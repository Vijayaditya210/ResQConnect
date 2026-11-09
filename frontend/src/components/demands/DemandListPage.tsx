import React, { useState } from 'react';
import {
  Plus, Search, Filter, AlertTriangle, Sparkles,
  ShieldCheck, ShieldAlert, CheckCircle2, Clock, MapPin
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CreateDemandModal } from './CreateDemandModal';
import { DemandRequest } from '../../types';

interface DemandListPageProps {
  onSelectDemandForMatch: (demandId: string) => void;
}

export const DemandListPage: React.FC<DemandListPageProps> = ({ onSelectDemandForMatch }) => {
  const { demands, verifyDemand } = useData();
  const { canCreateDemands } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredDemands = demands.filter(d => {
    const matchesSearch =
      d.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.requested_resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || d.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            Emergency Demand Triage & Verification Center
          </h2>
          <p className="text-xs text-slate-400">
            Real-time incoming field requests with transparent multi-factor priority scoring.
          </p>
        </div>

        {canCreateDemands && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Emergency Demand
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search location, resource, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'PENDING', 'ALLOCATED', 'IN_TRANSIT', 'FULFILLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Priority Filters */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Demands Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="p-3.5">Demand ID & Priority</th>
                <th className="p-3.5">Location & Incident</th>
                <th className="p-3.5">Resource Needed</th>
                <th className="p-3.5">Affected Citizens</th>
                <th className="p-3.5">Priority Reasons</th>
                <th className="p-3.5">Status & Verification</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredDemands.map((demand) => (
                <tr key={demand.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-mono font-bold text-white text-xs">{demand.id}</div>
                    <span className={`inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      demand.priority === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : demand.priority === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : demand.priority === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {demand.priority} ({demand.priority_score})
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-slate-100 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-red-400 shrink-0" />
                      <span>{demand.location_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{demand.disaster_name}</div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-orange-300 font-mono text-sm">
                      {demand.quantity.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">{demand.requested_resource}</div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-white font-mono">{demand.affected_people.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">citizens in need</div>
                  </td>

                  <td className="p-3.5 max-w-xs">
                    <div className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {demand.priority_reasons[0] || 'Urgent survival assistance required.'}
                    </div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap space-y-1">
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        demand.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : demand.status === 'ALLOCATED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : demand.status === 'IN_TRANSIT'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {demand.status}
                      </span>
                    </div>

                    <button
                      onClick={() => verifyDemand(demand.id, demand.verification_status !== 'VERIFIED')}
                      className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {demand.verification_status === 'VERIFIED' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </button>
                  </td>

                  <td className="p-3.5 whitespace-nowrap text-right">
                    {demand.status === 'PENDING' ? (
                      <button
                        onClick={() => onSelectDemandForMatch(demand.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 ml-auto shadow-sm shadow-blue-600/30 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Smart Match</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        {demand.allocated_center_name ? `Via ${demand.allocated_center_name.split(' ')[0]}` : 'Resolved'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateDemandModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(newId) => {
            setIsCreateModalOpen(false);
            onSelectDemandForMatch(newId);
          }}
        />
      )}
    </div>
  );
};
