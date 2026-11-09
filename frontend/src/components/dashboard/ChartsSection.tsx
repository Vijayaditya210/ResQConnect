import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useData } from '../../context/DataContext';

export const ChartsSection: React.FC = () => {
  const { resources, demands, deliveries } = useData();

  // 1. Resource Demand vs Supply aggregated by category
  const categories = [
    'Drinking Water',
    'Food Packets',
    'Medicines',
    'Blankets',
    'Emergency Kits',
    'Rescue Equipment'
  ];

  const supplyDemandData = categories.map(cat => {
    const supply = resources
      .filter(r => r.resource_type.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(r.resource_type.toLowerCase()))
      .reduce((acc, r) => acc + r.available_quantity, 0);

    const demand = demands
      .filter(d => d.requested_resource.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(d.requested_resource.toLowerCase()))
      .filter(d => d.status !== 'FULFILLED')
      .reduce((acc, d) => acc + d.quantity, 0);

    return {
      name: cat.replace('Drinking ', '').replace(' Packets', '').replace(' Equipment', ''),
      Supply: supply,
      Demand: demand
    };
  });

  // 2. Demands Priority breakdown
  const priorityCounts = {
    CRITICAL: demands.filter(d => d.priority === 'CRITICAL').length,
    HIGH: demands.filter(d => d.priority === 'HIGH').length,
    MEDIUM: demands.filter(d => d.priority === 'MEDIUM').length,
    LOW: demands.filter(d => d.priority === 'LOW').length
  };

  const priorityData = [
    { name: 'Critical', value: priorityCounts.CRITICAL, color: '#ef4444' },
    { name: 'High', value: priorityCounts.HIGH, color: '#f97316' },
    { name: 'Medium', value: priorityCounts.MEDIUM, color: '#eab308' },
    { name: 'Low', value: priorityCounts.LOW, color: '#3b82f6' }
  ].filter(p => p.value > 0);

  // 3. Logistics Delivery Pipeline breakdown
  const deliveryStatusCounts = {
    PENDING: demands.filter(d => d.status === 'PENDING').length,
    ALLOCATED: demands.filter(d => d.status === 'ALLOCATED').length,
    IN_TRANSIT: deliveries.filter(d => d.status === 'IN_TRANSIT').length,
    DELIVERED: deliveries.filter(d => d.status === 'DELIVERED').length
  };

  const deliveryData = [
    { status: 'Pending Triage', count: deliveryStatusCounts.PENDING, color: '#eab308' },
    { status: 'Allocated', count: deliveryStatusCounts.ALLOCATED, color: '#3b82f6' },
    { status: 'In Transit', count: deliveryStatusCounts.IN_TRANSIT, color: '#8b5cf6' },
    { status: 'Delivered', count: deliveryStatusCounts.DELIVERED, color: '#10b981' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Supply vs Demand Comparison */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4.5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Resource Supply vs. Active Demand</h3>
            <p className="text-xs text-slate-400">Available warehouse stock compared with unfulfilled requests</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span> Available Supply
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500"></span> Emergency Demand
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplyDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Bar dataKey="Supply" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Demand" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand Priority Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Demand Priority Breakdown</h3>
          <p className="text-xs text-slate-400">Active emergency aid requests by severity</p>
        </div>

        <div className="h-52 w-full my-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
          {priorityData.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                {p.name}
              </span>
              <span className="font-bold text-white font-mono text-xs">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
