import React, { useState } from 'react';
import { X, Plus, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { calculateDemandPriority } from '../../utils/prioritization';

interface CreateDemandModalProps {
  onClose: () => void;
  onCreated: (demandId: string) => void;
}

export const CreateDemandModal: React.FC<CreateDemandModalProps> = ({ onClose, onCreated }) => {
  const { disasters, createDemand } = useData();

  const [disasterId, setDisasterId] = useState<string>(disasters[0]?.id || '');
  const [locationName, setLocationName] = useState<string>('Vidyadharapuram Relief Camp, Vijayawada');
  const [resourceType, setResourceType] = useState<string>('Drinking Water');
  const [quantity, setQuantity] = useState<number>(1500);
  const [affectedPeople, setAffectedPeople] = useState<number>(3500);
  const [requestingOrg, setRequestingOrg] = useState<string>('National Disaster Response Force (NDRF) Team 2');
  const [contactPhone, setContactPhone] = useState<string>('+91 866 248 1199');
  const [urgencyNotes, setUrgencyNotes] = useState<string>('Severe drinking water contamination due to flood backflow.');
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Priority Preview
  const selectedDisaster = disasters.find(d => d.id === disasterId);
  const priorityPreview = calculateDemandPriority(
    resourceType,
    quantity,
    affectedPeople,
    selectedDisaster ? selectedDisaster.severity : 'CRITICAL',
    isVerified
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newDemand = await createDemand({
        disaster_id: disasterId,
        location_name: locationName,
        coordinates: {
          lat: 16.5150 + (Math.random() - 0.5) * 0.04,
          lng: 80.6250 + (Math.random() - 0.5) * 0.04
        },
        requested_resource: resourceType,
        quantity,
        affected_people: affectedPeople,
        requesting_organization: requestingOrg,
        contact_phone: contactPhone,
        urgency_notes: urgencyNotes,
        verification_status: isVerified ? 'VERIFIED' : 'PENDING_VERIFICATION'
      });
      onCreated(newDemand.id);
    } catch (err) {
      console.error('Error creating demand:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Emergency Demand Request</h3>
              <p className="text-xs text-slate-400">Submit field aid requirement for intelligent triage and matching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Incident / Disaster */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Associated Disaster Incident</label>
            <select
              value={disasterId}
              onChange={(e) => setDisasterId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
            >
              {disasters.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Location & Resource Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Camp Name</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Resource</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="Drinking Water">Drinking Water (Cans / Packs)</option>
                <option value="Food Packets">Food Packets (Meals / Rations)</option>
                <option value="Medicines">Medicines (ORS / Trauma Kits)</option>
                <option value="Blankets">Blankets (Fleece / Thermal)</option>
                <option value="Emergency Kits">Emergency Kits (Torch / Batteries)</option>
                <option value="Rescue Equipment">Rescue Equipment (Life Jackets)</option>
              </select>
            </div>
          </div>

          {/* Quantity & Affected Citizens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Required Quantity (Units)</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Affected Citizens</label>
              <input
                type="number"
                min={1}
                required
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Requesting Org & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Requesting Body</label>
              <input
                type="text"
                required
                value={requestingOrg}
                onChange={(e) => setRequestingOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Urgency Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency & Situational Notes</label>
            <textarea
              rows={2}
              value={urgencyNotes}
              onChange={(e) => setUrgencyNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Live Dynamic Priority Preview Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Live Priority Scoring Preview
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  priorityPreview.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {priorityPreview.priority}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {priorityPreview.score}/100
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-0.5">
              {priorityPreview.reasons.map((r, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-400"></span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Emergency Demand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
