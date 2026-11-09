import React, { useState } from 'react';
import {
  Truck, Navigation, CheckCircle2, Clock, AlertTriangle,
  Phone, User, MapPin, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Delivery, Vehicle } from '../../types';

interface LogisticsListPageProps {
  onNavigateToMap: () => void;
}

export const LogisticsListPage: React.FC<LogisticsListPageProps> = ({ onNavigateToMap }) => {
  const { deliveries, vehicles, updateDeliveryStatus, demoScenarioRunning } = useData();
  const { canUpdateLogistics } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'deliveries' | 'vehicles'>('deliveries');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-black text-white">Logistics & Tactical Fleet Coordination</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time convoy routing, driver dispatching, and dynamic live tracking telemetry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('deliveries')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'deliveries' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deliveries ({deliveries.length})
          </button>
          <button
            onClick={() => setActiveSubTab('vehicles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'vehicles' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fleet Vehicles ({vehicles.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'deliveries' ? (
        /* Deliveries List */
        <div className="space-y-3">
          {deliveries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400">
              No active delivery missions created yet. Run Smart Match and approve an allocation to dispatch convoys.
            </div>
          ) : (
            deliveries.map((del) => (
              <div
                key={del.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{del.id}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          del.status === 'IN_TRANSIT'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                            : del.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {del.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Demand Ref: <strong className="text-slate-200">#{del.demand_id}</strong> • Incident: {del.disaster_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onNavigateToMap}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <MapPin className="h-3.5 w-3.5 text-purple-400" />
                      <span>Track on Map</span>
                    </button>

                    {canUpdateLogistics && del.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => updateDeliveryStatus(del.id, 'DELIVERED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Route Flow & Cargo details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Origin */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Source Warehouse:</span>
                    <div className="font-semibold text-emerald-300 mt-0.5">{del.resource_center_name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">Cargo: <b className="text-white">{del.quantity.toLocaleString()}</b> units ({del.resource_type})</div>
                  </div>

                  {/* Destination */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Destination Aid Camp:</span>
                    <div className="font-semibold text-orange-300 mt-0.5">{del.destination_name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Distance: <b className="text-slate-200">{del.distance_km} km</b> (~{del.estimated_travel_time_mins} mins)
                    </div>
                  </div>

                  {/* Vehicle & Driver */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Transport:</span>
                    <div className="font-mono font-bold text-purple-300 mt-0.5">{del.vehicle_number}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{del.driver_name}</span>
                      <Phone className="h-3 w-3 ml-2" />
                      <span className="font-mono">{del.driver_phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Vehicles Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="p-3.5">Vehicle Number & Type</th>
                <th className="p-3.5">Payload Capacity</th>
                <th className="p-3.5">Assigned Driver</th>
                <th className="p-3.5">Driver Contact</th>
                <th className="p-3.5 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-white text-sm">{v.vehicle_number}</div>
                    <div className="text-[10px] text-slate-400">{v.type}</div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{v.capacity_kg.toLocaleString()} kg</td>
                  <td className="p-3.5 font-semibold text-slate-200">{v.driver_name}</td>
                  <td className="p-3.5 font-mono text-slate-300">{v.driver_phone}</td>
                  <td className="p-3.5 text-right">
                    <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      v.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : v.status === 'IN_TRANSIT'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
