import React, { useState } from 'react';
import {
  PackageSearch, Warehouse, AlertTriangle, CheckCircle2,
  Filter, Search, Layers, RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const InventoryTable: React.FC = () => {
  const { resources, resourceCenters } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredResources = resources.filter(r => {
    const matchesSearch =
      r.resource_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resource_center_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = selectedCenter === 'ALL' || r.resource_center_id === selectedCenter;
    const matchesType = selectedType === 'ALL' || r.resource_type === selectedType;

    return matchesSearch && matchesCenter && matchesType;
  });

  const totalAvailable = resources.reduce((acc, r) => acc + r.available_quantity, 0);
  const totalAllocated = resources.reduce((acc, r) => acc + r.allocated_quantity, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl md:col-span-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Warehouse className="h-5 w-5" />
            <h2 className="text-base font-black text-white">Relief Warehouses</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active stockpiles across {resourceCenters.length} strategic regional depots.
          </p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Available Stock</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {totalAvailable.toLocaleString()} units
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Committed / In-Transit</div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-1">
              {totalAllocated.toLocaleString()} units
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search resource or warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Warehouse Center Filter */}
          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="ALL">All Warehouses</option>
            {resourceCenters.map((rc) => (
              <option key={rc.id} value={rc.id}>
                {rc.name}
              </option>
            ))}
          </select>

          {/* Resource Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Food Packets">Food Packets</option>
            <option value="Medicines">Medicines</option>
            <option value="Blankets">Blankets</option>
            <option value="Emergency Kits">Emergency Kits</option>
            <option value="Rescue Equipment">Rescue Equipment</option>
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="p-3.5">Resource ID & Type</th>
                <th className="p-3.5">Warehouse Location</th>
                <th className="p-3.5">Available Quantity</th>
                <th className="p-3.5">Allocated Quantity</th>
                <th className="p-3.5">Total Capacity</th>
                <th className="p-3.5">Quality Condition</th>
                <th className="p-3.5 text-right">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredResources.map((res) => {
                const percentAvail = Math.round((res.available_quantity / res.total_quantity) * 100);
                return (
                  <tr key={res.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-white text-sm">{res.resource_type}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{res.id} • {res.unit}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{res.resource_center_name}</div>
                      <div className="text-[10px] text-slate-400">Facility ID: {res.resource_center_id}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-emerald-400 text-sm">
                        {res.available_quantity.toLocaleString()}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percentAvail < 25 ? 'bg-red-500' : percentAvail < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${percentAvail}%` }}
                        />
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-400">
                        {res.allocated_quantity.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">in transit</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-300">
                        {res.total_quantity.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">{res.unit}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                        {res.condition}
                      </span>
                      {res.expiry_date && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Exp: {res.expiry_date}</div>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-right">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        res.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : res.status === 'LOW_STOCK'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {res.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
