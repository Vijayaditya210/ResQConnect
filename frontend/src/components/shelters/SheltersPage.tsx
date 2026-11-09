import React from 'react';
import { Home, Users, Phone, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SheltersPage: React.FC = () => {
  const { shelters } = useData();

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.current_occupancy, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl md:col-span-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Home className="h-5 w-5" />
            <h2 className="text-base font-black text-white">Relief Shelters & Camps</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Designated disaster evacuation facilities across the Krishna river flood plain.
          </p>
        </div>

        <div className="bg-slate-900 border border-blue-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Shelter Capacity</div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-1">
              {totalCapacity.toLocaleString()} evacuees
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-purple-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Current Occupancy Rate</div>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">
              {Math.round((totalOccupancy / totalCapacity) * 100)}% ({totalOccupancy.toLocaleString()})
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map((s) => {
          const occupancyPct = Math.round((s.current_occupancy / s.capacity) * 100);
          const isNearCap = occupancyPct >= 80;
          return (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Home className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    s.status === 'OPEN'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mt-3 leading-snug">{s.name}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{s.location_name}</span>
                </div>
              </div>

              {/* Progress & Stats */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Occupancy:</span>
                  <span className="font-mono font-bold text-white">
                    {s.current_occupancy.toLocaleString()} / {s.capacity.toLocaleString()} ({occupancyPct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isNearCap ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Contact: {s.contact_person}</span>
                  <span className="font-mono">{s.contact_phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
