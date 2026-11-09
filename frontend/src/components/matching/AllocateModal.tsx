import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Layers, Truck, ShieldCheck } from 'lucide-react';
import { DemandRequest, MatchCandidate, Vehicle } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface AllocateModalProps {
  demand: DemandRequest;
  candidate: MatchCandidate;
  onClose: () => void;
  onSuccess: () => void;
}

export const AllocateModal: React.FC<AllocateModalProps> = ({
  demand,
  candidate,
  onClose,
  onSuccess
}) => {
  const { allocateResource, dispatchDelivery, vehicles } = useData();
  const { currentUser } = useAuth();

  const [quantity, setQuantity] = useState<number>(candidate.fulfillable_quantity);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const avail = vehicles.find(v => v.status === 'AVAILABLE');
    return avail ? avail.id : vehicles[0]?.id || '';
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const remainingAfter = candidate.available_quantity - quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Execute Atomic Allocation
      const allocResult = await allocateResource(
        demand.id,
        candidate.resource_id,
        quantity,
        currentUser.id
      );

      if (!allocResult.success) {
        setErrorMsg(allocResult.message);
        setIsSubmitting(false);
        return;
      }

      // 2. Dispatch Delivery if selected
      if (autoDispatch && selectedVehicleId) {
        await dispatchDelivery({
          demandId: demand.id,
          resourceCenterId: candidate.resource_center_id,
          vehicleId: selectedVehicleId,
          quantity
        });
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Allocation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Approve Resource Allocation</h3>
              <p className="text-xs text-slate-400">Atomic inventory commitment & vehicle dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="my-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Demand:</span>
              <span className="font-bold text-white">#{demand.id} ({demand.location_name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Warehouse:</span>
              <span className="font-bold text-emerald-300">{candidate.resource_center_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Available Stock:</span>
              <span className="font-mono text-slate-200">{candidate.available_quantity.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Remaining Post-Allocation:</span>
              <span className={`font-mono font-bold ${remainingAfter < 200 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {remainingAfter.toLocaleString()} units
              </span>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantity to Allocate ({demand.requested_resource})
            </label>
            <input
              type="number"
              min={1}
              max={candidate.available_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(candidate.available_quantity, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Auto-Dispatch Convoy Checkbox */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <Truck className="h-4 w-4 text-purple-400" />
              <span>Automatically dispatch logistics vehicle upon allocation</span>
            </label>

            {autoDispatch && (
              <div className="pl-6 pt-1">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicle_number} - {v.type} ({v.driver_name}) [{v.status}]
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Guaranteed duplicate allocation prevention with transactional locking.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || quantity <= 0}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
