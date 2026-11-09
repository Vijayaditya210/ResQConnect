import {
  DemandRequest, ResourceItem, ResourceCenter, MatchCandidate, SmartMatchResponse
} from '../types';
import { calculateDistanceKm, estimateTravelTimeMins } from './geoUtils';

export function runRuleBasedMatching(
  demand: DemandRequest,
  resources: ResourceItem[],
  resourceCenters: ResourceCenter[],
  allDemands: DemandRequest[] = []
): SmartMatchResponse {
  const normResource = demand.requested_resource.trim().toLowerCase();
  
  // Filter matching stock
  const matchingResources = resources.filter(
    r => r.resource_type.toLowerCase() === normResource || normResource.includes(r.resource_type.toLowerCase())
  );

  const centersMap = new Map<string, ResourceCenter>();
  resourceCenters.forEach(c => centersMap.set(c.id, c));

  const candidates: MatchCandidate[] = [];

  for (const stock of matchingResources) {
    const center = centersMap.get(stock.resource_center_id);
    const coords = stock.coordinates || (center ? center.coordinates : demand.coordinates);
    const centerName = stock.resource_center_name || (center ? center.name : 'Relief Warehouse');

    const distanceKm = calculateDistanceKm(coords, demand.coordinates);
    const etaMins = estimateTravelTimeMins(distanceKm);

    const avail = stock.available_quantity;
    const req = demand.quantity;
    const fulfillable = Math.min(avail, req);

    let feasibility: 'FULLY_FULFILLABLE' | 'PARTIALLY_FULFILLABLE' | 'INSUFFICIENT_STOCK' = 'INSUFFICIENT_STOCK';
    let stockScore = 0;
    let stockReason = 'Out of stock at this location';

    if (avail >= req) {
      stockScore = 40.0;
      feasibility = 'FULLY_FULFILLABLE';
      stockReason = `Full capacity available (${avail.toLocaleString()} in stock vs ${req.toLocaleString()} needed)`;
    } else if (avail > 0) {
      stockScore = 40.0 * (avail / req);
      feasibility = 'PARTIALLY_FULFILLABLE';
      stockReason = `Partial fulfillment possible (${avail.toLocaleString()} of ${req.toLocaleString()} needed)`;
    }

    const distFactor = Math.max(0, 1.0 - distanceKm / 60.0);
    const distScore = 35.0 * distFactor;
    const distReason = `Optimal transit route: ${distanceKm} km (Est. ETA: ${etaMins} mins)`;

    const conditionScore = stock.condition === 'Good' || stock.condition === 'Sealed' || stock.condition === 'Ready' ? 15.0 : 8.0;
    const conditionReason = `Stock quality verified: ${stock.condition}`;

    const urgencyScore = demand.priority === 'CRITICAL' ? 10.0 : 7.0;

    const totalScore = Math.min(100, Math.round((stockScore + distScore + conditionScore + urgencyScore) * 10) / 10);

    const reasons = [stockReason, distReason, conditionReason];
    if (avail >= req) {
      reasons.push('Direct highway access and immediate dispatch readiness');
    }

    candidates.push({
      resource_center_id: stock.resource_center_id,
      resource_center_name: centerName,
      resource_id: stock.id,
      available_quantity: avail,
      requested_quantity: req,
      fulfillable_quantity: fulfillable,
      distance_km: distanceKm,
      estimated_travel_time_mins: etaMins,
      match_score: totalScore,
      reasons,
      feasibility,
      coordinates: coords
    });
  }

  // Sort candidates: fully fulfillable first, then highest score
  candidates.sort((a, b) => {
    if (a.feasibility === 'FULLY_FULFILLABLE' && b.feasibility !== 'FULLY_FULFILLABLE') return -1;
    if (b.feasibility === 'FULLY_FULFILLABLE' && a.feasibility !== 'FULLY_FULFILLABLE') return 1;
    return b.match_score - a.match_score;
  });

  const recommended = candidates.length > 0 ? candidates[0] : null;
  const alternatives = candidates.slice(1, 4);

  // Conflicting demands
  const conflicts: Array<{
    demand_id: string;
    location: string;
    quantity: number;
    priority: string;
    status: string;
  }> = [];

  allDemands.forEach(d => {
    if (d.id !== demand.id && (d.status === 'PENDING' || d.status === 'MATCHED')) {
      if (d.requested_resource.toLowerCase() === normResource) {
        conflicts.push({
          demand_id: d.id,
          location: d.location_name,
          quantity: d.quantity,
          priority: d.priority,
          status: d.status
        });
      }
    }
  });

  // Shortage warning
  const totalAvail = candidates.reduce((acc, c) => acc + c.available_quantity, 0);
  let shortageWarning: string | null = null;
  if (totalAvail < demand.quantity) {
    shortageWarning = `REGIONAL DEFICIT: Total regional stock of ${demand.requested_resource} (${totalAvail.toLocaleString()}) is insufficient for requested demand (${demand.quantity.toLocaleString()}). Immediate inter-district requisition required.`;
  } else if (totalAvail < demand.quantity * 1.3) {
    shortageWarning = `BUFFER ALERT: Regional reserve is low. Only ${(totalAvail - demand.quantity).toLocaleString()} units will remain post-allocation.`;
  }

  let explanation = '';
  if (recommended) {
    explanation = `The Intelligent Rule-Based Matching Engine recommends allocating ${recommended.fulfillable_quantity.toLocaleString()} units of ${demand.requested_resource} from ${recommended.resource_center_name}. This facility achieved the highest score (${recommended.match_score}%) due to ${
      recommended.feasibility === 'FULLY_FULFILLABLE' ? 'complete stock fulfillment' : 'highest available stock'
    } and rapid estimated transit time (${recommended.estimated_travel_time_mins} mins over ${recommended.distance_km} km).`;
  } else {
    explanation = `No active depot currently has stock of ${demand.requested_resource}. Escalation required.`;
  }

  return {
    demand_id: demand.id,
    requested_resource: demand.requested_resource,
    requested_quantity: demand.quantity,
    demand_priority: demand.priority,
    recommended_match: recommended,
    alternative_matches: alternatives,
    conflicting_demands: conflicts,
    shortage_warning: shortageWarning,
    ai_explanation: explanation,
    confidence_score: recommended ? recommended.match_score : 0
  };
}
