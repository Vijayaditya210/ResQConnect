import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { AlertBanner } from './components/layout/AlertBanner';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DisasterMap } from './components/map/DisasterMap';
import { SmartMatchingPage } from './components/matching/SmartMatchingPage';
import { DemandListPage } from './components/demands/DemandListPage';
import { InventoryTable } from './components/inventory/InventoryTable';
import { LogisticsListPage } from './components/logistics/LogisticsListPage';
import { SheltersPage } from './components/shelters/SheltersPage';
import { DemoScenarioController } from './components/demo/DemoScenarioController';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDemandForMatch, setSelectedDemandForMatch] = useState<string | null>(null);

  const handleNavigateWithDemand = (tab: ActiveTab, demandId?: string) => {
    if (demandId) setSelectedDemandForMatch(demandId);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Real-time Alert Ticker */}
      <AlertBanner />

      {/* Main Layout Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {activeTab === 'dashboard' && (
            <DashboardOverview onNavigateTab={handleNavigateWithDemand} />
          )}

          {activeTab === 'map' && (
            <DisasterMap
              onSelectDemandForMatch={(demId) => {
                setSelectedDemandForMatch(demId);
                setActiveTab('matching');
              }}
            />
          )}

          {activeTab === 'matching' && (
            <SmartMatchingPage
              initialDemandId={selectedDemandForMatch}
              onAllocationSuccess={() => {
                setActiveTab('map');
              }}
            />
          )}

          {activeTab === 'demands' && (
            <DemandListPage
              onSelectDemandForMatch={(demId) => {
                setSelectedDemandForMatch(demId);
                setActiveTab('matching');
              }}
            />
          )}

          {activeTab === 'inventory' && <InventoryTable />}

          {activeTab === 'logistics' && (
            <LogisticsListPage
              onNavigateToMap={() => setActiveTab('map')}
            />
          )}

          {activeTab === 'shelters' && <SheltersPage />}
        </main>
      </div>

      {/* 1-Click Automated Demo Scenario Floating Overlay */}
      <DemoScenarioController />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
