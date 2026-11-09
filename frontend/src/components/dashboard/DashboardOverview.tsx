import React from 'react';
import { StatCards } from './StatCards';
import { ChartsSection } from './ChartsSection';
import { QuickAlerts } from './QuickAlerts';
import { ActiveTab } from '../layout/Sidebar';

interface DashboardOverviewProps {
  onNavigateTab: (tab: ActiveTab, demandId?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* KPI Stat Cards */}
      <StatCards />

      {/* Analytics & Supply/Demand Charts */}
      <ChartsSection />

      {/* Quick Action Lists */}
      <QuickAlerts
        onNavigateTab={(tab, demandId) => {
          onNavigateTab(tab as ActiveTab, demandId);
        }}
      />
    </div>
  );
};
