import React from 'react';
import {
  LayoutDashboard, Map, Sparkles, Inbox, PackageSearch,
  Truck, Home, AlertOctagon, Layers
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export type ActiveTab = 'dashboard' | 'map' | 'matching' | 'demands' | 'inventory' | 'logistics' | 'shelters';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { demands, deliveries } = useData();

  const pendingDemandsCount = demands.filter(d => d.status === 'PENDING').length;
  const activeDeliveriesCount = deliveries.filter(d => d.status === 'IN_TRANSIT').length;

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'map', label: 'Tactical Live Map', icon: Map, highlight: true },
    { id: 'matching', label: 'Smart AI Matching', icon: Sparkles, badge: 'AI' },
    { id: 'demands', label: 'Demands & Triage', icon: Inbox, badgeCount: pendingDemandsCount },
    { id: 'inventory', label: 'Resource Stockpile', icon: PackageSearch },
    { id: 'logistics', label: 'Fleet & Deliveries', icon: Truck, badgeCount: activeDeliveriesCount },
    { id: 'shelters', label: 'Relief Shelters', icon: Home }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-57px)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Tactical Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info / Emergency Contact */}
      <div className="p-3 border-t border-slate-800 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <AlertOctagon className="h-4 w-4 text-red-400" />
            <span>AP State Control Room</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            NTR District Incident Commander: <br />
            <span className="text-slate-200 font-mono font-medium">1070 / +91 866 2489901</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
