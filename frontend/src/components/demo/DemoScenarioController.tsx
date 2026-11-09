import React from 'react';
import { Radio, CheckCircle, StopCircle, Award, Sparkles, Truck, Layers, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const DemoScenarioController: React.FC = () => {
  const {
    demoScenarioRunning,
    demoScenarioStep,
    demoScenarioLog,
    stopDemoScenario
  } = useData();

  if (!demoScenarioRunning) return null;

  const totalSteps = 16;
  const progressPercent = Math.min(100, Math.round((demoScenarioStep / totalSteps) * 100));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl bg-slate-900/95 border-2 border-red-500/50 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Hackathon Jury Live Demo Scenario Active
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                Step {demoScenarioStep} of {totalSteps}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Automated end-to-end flow: Disaster → Demand → AI Match → Allocation → Fleet GPS → Resolution
            </p>
          </div>
        </div>

        <button
          onClick={stopDemoScenario}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
        >
          <StopCircle className="h-4 w-4 text-red-400" />
          <span>Stop Demo</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
          <span>Demonstration Progression</span>
          <span className="text-red-400 font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Latest Step Log Output */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
          <span className="font-semibold text-slate-200 truncate">
            {demoScenarioLog[demoScenarioLog.length - 1] || 'Executing triage sequence...'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono shrink-0">Live Simulation</span>
      </div>
    </div>
  );
};
