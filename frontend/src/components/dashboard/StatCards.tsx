import React from 'react';
import {
  Flame, AlertTriangle, Users, PackageCheck, Layers,
  Truck, CheckCircle, Clock
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const StatCards: React.FC = () => {
  const { disasters, demands, resources, deliveries } = useData();

  const activeDisastersCount = disasters.filter(d => d.status === 'ACTIVE').length;
  const criticalDemandsCount = demands.filter(d => d.priority === 'CRITICAL' && d.status !== 'FULFILLED').length;
  const totalAffectedPeople = disasters.reduce((acc, d) => acc + d.affected_people, 0);

  const totalAvailableStock = resources.reduce((acc, r) => acc + r.available_quantity, 0);
  const totalAllocatedStock = resources.reduce((acc, r) => acc + r.allocated_quantity, 0);

  const activeDeliveriesCount = deliveries.filter(del => del.status === 'IN_TRANSIT').length;
  const completedDeliveriesCount = deliveries.filter(del => del.status === 'DELIVERED').length;
  const pendingDemandsCount = demands.filter(d => d.status === 'PENDING').length;

  const cards = [
    {
      title: 'Active Disasters',
      value: activeDisastersCount,
      sub: 'Flood & Inundation Zones',
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    {
      title: 'Critical Demands',
      value: criticalDemandsCount,
      sub: 'Life-saving aid requests',
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      title: 'Affected Population',
      value: totalAffectedPeople.toLocaleString(),
      sub: 'Inundated citizens',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Available Inventory',
      value: totalAvailableStock.toLocaleString(),
      sub: 'Units across 4 depots',
      icon: PackageCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Allocated Stock',
      value: totalAllocatedStock.toLocaleString(),
      sub: 'Committed to transit',
      icon: Layers,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Active Deliveries',
      value: activeDeliveriesCount,
      sub: 'Convoys on live routes',
      icon: Truck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Delivered Convoys',
      value: completedDeliveriesCount,
      sub: 'Aid successfully resolved',
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      title: 'Pending Triage',
      value: pendingDemandsCount,
      sub: 'Awaiting allocation',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${card.bg} ${card.border} backdrop-blur-sm relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black tracking-tight text-white">{card.value}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
