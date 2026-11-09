import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Flame, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AlertBanner: React.FC = () => {
  const { alerts } = useData();
  const latestAlert = alerts[0];

  if (!latestAlert) return null;

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Flame className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-400 shrink-0" />;
    }
  };

  const getBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 border-red-500/30 text-red-200';
      case 'WARNING':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
      case 'SUCCESS':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 text-xs transition-colors ${getBadgeStyle(latestAlert.severity)}`}>
      <div className="flex items-center gap-2 max-w-5xl truncate">
        {getAlertIcon(latestAlert.severity)}
        <span className="font-bold uppercase tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
          {latestAlert.type.replace('_', ' ')}
        </span>
        <span className="font-semibold text-slate-100">{latestAlert.title}:</span>
        <span className="text-slate-300 truncate">{latestAlert.message}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
        <Bell className="h-3.5 w-3.5" />
        <span>{new Date(latestAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};
