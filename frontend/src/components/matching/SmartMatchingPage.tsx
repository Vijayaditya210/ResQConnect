import React, { useState, useEffect } from 'react';
import {
  Sparkles, Warehouse, CheckCircle2, Clock, AlertTriangle,
  ArrowRight, ShieldAlert, Cpu, Check, RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DemandRequest, MatchCandidate, SmartMatchResponse } from '../../types';
import { runRuleBasedMatching } from '../../utils/matchingEngine';
import { AIIntelligencePanel } from './AIIntelligencePanel';
import { AllocateModal } from './AllocateModal';

interface SmartMatchingPageProps {
  initialDemandId?: string | null;
  onAllocationSuccess?: () => void;
}

export const SmartMatchingPage: React.FC<SmartMatchingPageProps> = ({
  initialDemandId,
  onAllocationSuccess
}) => {
  const { demands, resources, resourceCenters } = useData();

  const [selectedDemandId, setSelectedDemandId] = useState<string>(() => {
    if (initialDemandId) return initialDemandId;
    const firstPending = demands.find(d => d.status === 'PENDING');
    return firstPending ? firstPending.id : demands[0]?.id || '';
  });

  const [matchResult, setMatchResult] = useState<SmartMatchResponse | null>(null);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<MatchCandidate | null>(null);

  const currentDemand = demands.find(d => d.id === selectedDemandId);

  // When a demand is selected from another page (e.g., Demand List → Smart Match), update the selected ID
  useEffect(() => {
    if (initialDemandId && initialDemandId !== selectedDemandId) {
      setSelectedDemandId(initialDemandId);
    }
  }, [initialDemandId]);

  // Run matching whenever selected demand or inventory changes
  useEffect(() => {
    if (currentDemand) {
      const result = runRuleBasedMatching(currentDemand, resources, resourceCenters, demands);
      setMatchResult(result);
    }
  }, [selectedDemandId, demands, resources, resourceCenters]);

  const handleApprove = (candidate: MatchCandidate) => {
    setSelectedCandidateForModal(candidate);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">Intelligent Resource Matching Engine</h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MCDA Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-Criteria Decision Analysis evaluating stock buffer, travel time, road distance, and disaster urgency.
          </p>
        </div>

        {/* Demand Selector */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="text-xs font-semibold text-slate-400">Select Demand:</span>
          <select
            value={selectedDemandId}
            onChange={(e) => setSelectedDemandId(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {demands.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                #{d.id} - {d.location_name} ({d.requested_resource}: {d.quantity}) [{d.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentDemand && matchResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: AI Response Intelligence Panel & Match Candidates */}
          <div className="lg:col-span-7 space-y-6">
            {/* AI Intelligence Panel */}
            <AIIntelligencePanel
              demand={currentDemand}
              matchResponse={matchResult}
              onApproveAllocation={handleApprove}
            />

            {/* Candidate Resource Centers Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-emerald-400" />
                  Evaluated Resource Centers & Depots
                </h3>
                <span className="text-xs text-slate-400">
                  {matchResult.recommended_match ? 1 + matchResult.alternative_matches.length : 0} Candidates Evaluated
                </span>
              </div>

              <div className="space-y-3">
                {matchResult.recommended_match ? (
                  [matchResult.recommended_match, ...matchResult.alternative_matches].map((cand, idx) => {
                    const isTop = idx === 0;
                    return (
                      <div
                        key={cand.resource_id}
                        className={`p-4 rounded-xl border transition ${
                          isTop
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{cand.resource_center_name}</span>
                              {isTop && (
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  Top Recommendation
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                              <span>Available: <strong className="text-emerald-400">{cand.available_quantity.toLocaleString()}</strong> units</span>
                              <span>•</span>
                              <span>Distance: <strong className="text-slate-200">{cand.distance_km} km</strong></span>
                              <span>•</span>
                              <span>Est. Travel Time: <strong className="text-slate-200">{cand.estimated_travel_time_mins} mins</strong></span>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="text-right shrink-0">
                            <div className={`text-lg font-black font-mono ${isTop ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {cand.match_score}%
                            </div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Match Score</div>
                          </div>
                        </div>

                        {/* Reasons Breakdown */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-2">
                          {cand.reasons.map((r, rIdx) => (
                            <span key={rIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                              ✓ {r}
                            </span>
                          ))}
                        </div>

                        {currentDemand.status === 'PENDING' && (
                          <div className="mt-3 text-right">
                            <button
                              onClick={() => handleApprove(cand)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                isTop
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              Allocate from this Depot
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/40 text-center text-xs text-slate-400">
                    No matching stock records found for {currentDemand.requested_resource}.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Demand Profile & Competing Demands Detector */}
          <div className="lg:col-span-5 space-y-6">
            {/* Demand Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Demand Profile
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  currentDemand.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {currentDemand.priority}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Incident:</span>
                  <span className="font-semibold text-slate-200">{currentDemand.disaster_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-bold text-white">{currentDemand.location_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource:</span>
                  <span className="font-bold text-orange-400">{currentDemand.requested_resource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity Needed:</span>
                  <span className="font-mono font-bold text-white text-sm">{currentDemand.quantity.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Citizens:</span>
                  <span className="font-semibold text-slate-200">{currentDemand.affected_people.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Requesting Body:</span>
                  <span className="font-semibold text-slate-300">{currentDemand.requesting_organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-black text-blue-400">{currentDemand.status}</span>
                </div>
              </div>
            </div>

            {/* Conflicting Demands Detector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Competing Demands Detected ({matchResult.conflicting_demands.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Other concurrent requests competing for the same regional stockpile of <strong className="text-slate-200">{currentDemand.requested_resource}</strong>:
              </p>

              <div className="space-y-2">
                {matchResult.conflicting_demands.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950/40 text-xs text-slate-400 text-center">
                    No competing demands for this resource type.
                  </div>
                ) : (
                  matchResult.conflicting_demands.map((c) => (
                    <div
                      key={c.demand_id}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">#{c.demand_id} - {c.location}</div>
                        <div className="text-[11px] text-slate-400">Quantity: {c.quantity.toLocaleString()} units</div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        c.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {c.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {selectedCandidateForModal && currentDemand && (
        <AllocateModal
          demand={currentDemand}
          candidate={selectedCandidateForModal}
          onClose={() => setSelectedCandidateForModal(null)}
          onSuccess={() => {
            setSelectedCandidateForModal(null);
            if (onAllocationSuccess) onAllocationSuccess();
          }}
        />
      )}
    </div>
  );
};
