import React from 'react';
import { X, Flame, AlertTriangle, Warehouse, Home, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Disaster, DemandRequest, ResourceCenter, Shelter, Vehicle, Delivery } from '../../types';

interface MapInfoCardProps {
  selectedEntity: {
    type: 'disaster' | 'demand' | 'center' | 'shelter' | 'vehicle';
    data: any;
  } | null;
  onClose: () => void;
  onAction?: (actionType: string, payload: any) => void;
}

export const MapInfoCard: React.FC<MapInfoCardProps> = ({ selectedEntity, onClose, onAction }) => {
  if (!selectedEntity) return null;

  const { type, data } = selectedEntity;

  return (
    <div className="absolute top-4 right-4 z-30 w-84 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 text-slate-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {type === 'disaster' && (
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Flame className="h-5 w-5" />
            </div>
          )}
          {type === 'demand' && (
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          {type === 'center' && (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Warehouse className="h-5 w-5" />
            </div>
          )}
          {type === 'shelter' && (
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Home className="h-5 w-5" />
            </div>
          )}
          {type === 'vehicle' && (
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Truck className="h-5 w-5" />
            </div>
          )}

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {type === 'disaster' ? 'Disaster Incident' : type === 'demand' ? 'Emergency Demand' : type === 'center' ? 'Relief Warehouse' : type === 'shelter' ? 'Relief Shelter' : 'Logistics Convoy'}
            </span>
            <h4 className="text-sm font-bold text-white leading-tight">
              {data.name || data.location_name || data.vehicle_number}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="py-3 space-y-2.5 text-xs">
        {type === 'disaster' && (
          <>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Severity:</span>
              <span className="font-bold text-red-400">{data.severity}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Affected Population:</span>
              <span className="font-bold text-white">{data.affected_people?.toLocaleString()} citizens</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">{data.status}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-2 rounded-lg">
              {data.description}
            </p>
          </>
        )}

        {type === 'demand' && (
          <>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Requested Resource:</span>
              <span className="font-bold text-orange-300">{data.requested_resource}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Required Quantity:</span>
              <span className="font-bold text-white font-mono text-sm">{data.quantity?.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Priority Score:</span>
              <span className="font-black text-red-400">{data.priority_score}/100 ({data.priority})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Affected Citizens:</span>
              <span className="font-semibold text-slate-200">{data.affected_people?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Verification:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> {data.verification_status}
              </span>
            </div>

            {data.status === 'PENDING' && onAction && (
              <button
                onClick={() => onAction('smart_match', data)}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Run Smart AI Match</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}

        {type === 'center' && (
          <>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Facility Type:</span>
              <span className="font-semibold text-emerald-300">{data.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Contact Officer:</span>
              <span className="font-semibold text-slate-200">{data.contact_person}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Hotline:</span>
              <span className="font-mono text-slate-300">{data.contact_phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Operational Status:</span>
              <span className="font-bold text-emerald-400">{data.status}</span>
            </div>
          </>
        )}

        {type === 'shelter' && (
          <>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Capacity:</span>
              <span className="font-semibold text-slate-200">{data.capacity?.toLocaleString()} evacuees</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Current Occupancy:</span>
              <span className="font-bold text-blue-300">{data.current_occupancy?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Occupancy Rate:</span>
              <span className="font-bold text-white">
                {Math.round((data.current_occupancy / data.capacity) * 100)}%
              </span>
            </div>
          </>
        )}

        {type === 'vehicle' && (
          <>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Vehicle Type:</span>
              <span className="font-semibold text-purple-300">{data.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Driver:</span>
              <span className="font-semibold text-slate-200">{data.driver_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Capacity:</span>
              <span className="font-mono text-slate-300">{data.capacity_kg} kg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Convoy Status:</span>
              <span className="font-black text-purple-400">{data.status}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
