import React from 'react';
import { ShieldAlert, Play, RotateCcw, User, Activity, Flame, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { currentUser, availableUsers, switchUser } = useAuth();
  const {
    disasters,
    selectedDisaster,
    setSelectedDisaster,
    resetDemoData,
    demoScenarioRunning,
    startDemoScenario,
    stopDemoScenario
  } = useData();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ResQConnect
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                EOC Live
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Disaster Relief Resource-Demand Matching & Logistics Platform
            </p>
          </div>
        </div>

        {/* Disaster Scenario Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-xs text-slate-400">Incident:</span>
          <select
            value={selectedDisaster?.id || ''}
            onChange={(e) => {
              const found = disasters.find(d => d.id === e.target.value);
              setSelectedDisaster(found || null);
            }}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
          >
            {disasters.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                {d.name.length > 35 ? d.name.slice(0, 35) + '...' : d.name} ({d.severity})
              </option>
            ))}
          </select>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Demo Scenario Button */}
          <button
            onClick={demoScenarioRunning ? stopDemoScenario : startDemoScenario}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
              demoScenarioRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-600/30'
            }`}
          >
            {demoScenarioRunning ? (
              <>
                <Radio className="h-4 w-4 animate-spin" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                Start Demo Scenario
              </>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state back to initial Vijayawada flood seed data?')) {
                resetDemoData();
              }
            }}
            title="Reset to Initial Seed Data"
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Role Persona Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <User className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Persona (Role)
              </span>
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                    {u.role.replace('_', ' ')} - {u.name.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
