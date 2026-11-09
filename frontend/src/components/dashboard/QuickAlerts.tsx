import React from 'react';
import {
  AlertTriangle, Truck, Flame, Sparkles, ArrowRight,
  Clock, MapPin, CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface QuickAlertsProps {
  onNavigateTab: (tab: 'matching' | 'demands' | 'logistics' | 'map', demandId?: string) => void;
}

export const QuickAlerts: React.FC<QuickAlertsProps> = ({ onNavigateTab }) => {
  const { demands, disasters, deliveries, alerts } = useData();

  const criticalDemands = demands
    .filter(d => d.priority === 'CRITICAL' || d.priority === 'HIGH')
    .slice(0, 4);

  const activeDeliveries = deliveries
    .filter(d => d.status === 'IN_TRANSIT')
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Critical Demands Needing Triage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-bold text-white">Critical & High Demands</h3>
            </div>
            <button
              onClick={() => onNavigateTab('demands')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              View All ({demands.length}) <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalDemands.map((d) => (
              <div
                key={d.id}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                      d.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {d.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate">{d.location_name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span className="text-white font-medium">{d.quantity.toLocaleString()} {d.requested_resource}</span>
                    <span>• {d.affected_people.toLocaleString()} people</span>
                  </div>
                </div>

                {d.status === 'PENDING' ? (
                  <button
                    onClick={() => onNavigateTab('matching', d.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Sparkles className="h-3 w-3" />
                    Match
                  </button>
                ) : (
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 shrink-0">
                    {d.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Convoy Logistics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Active Convoys (Live Routes)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('logistics')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              Logistics Hub <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeDeliveries.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/40 text-center text-xs text-slate-400">
                No convoys currently in transit. Allocate resources to dispatch vehicles.
              </div>
            ) : (
              activeDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-purple-500/20 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-300">{del.vehicle_number}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                        {del.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 truncate">
                      To: <span className="font-semibold text-white">{del.destination_name}</span> ({del.quantity} {del.resource_type})
                    </p>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>ETA: ~{del.estimated_travel_time_mins} mins</span>
                      <span>• Dist: {del.distance_km} km</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('map')}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-purple-500/40"
                  >
                    <MapPin className="h-3 w-3" />
                    Track
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Incident Status & Recent Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Live Incident Stream</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Live Feed</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-300">{a.title}</span>
                  <span>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
