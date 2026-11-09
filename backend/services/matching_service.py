from typing import List, Dict, Any, Optional
from ..models.schemas import (
    DemandRequest, ResourceItem, ResourceCenter, MatchCandidate, SmartMatchResponse
)
from .routes_service import compute_route, haversine_distance_km

def calculate_priority_score(demand: DemandRequest, disaster_severity: str = "CRITICAL") -> Dict[str, Any]:
    """
    Computes a transparent, explainable priority score (0-100) based on multi-factor criteria.
    """
    score = 0.0
    reasons = []

    # 1. Disaster Severity (Weight: 25%)
    severity = demand.priority.upper() if demand.priority else disaster_severity.upper()
    if severity == "CRITICAL":
        score += 25.0
        reasons.append("Disaster severity is classified as CRITICAL")
    elif severity == "HIGH":
        score += 18.0
        reasons.append("Disaster severity is classified as HIGH")
    elif severity == "MEDIUM":
        score += 12.0
        reasons.append("Disaster severity is classified as MEDIUM")
    else:
        score += 5.0
        reasons.append("Disaster severity is classified as LOW")

    # 2. Number of Affected People (Weight: 25%)
    if demand.affected_people >= 10000:
        score += 25.0
        reasons.append(f"Massive human impact: {demand.affected_people:,} people directly affected")
    elif demand.affected_people >= 5000:
        score += 20.0
        reasons.append(f"Severe human impact: {demand.affected_people:,} people affected")
    elif demand.affected_people >= 1000:
        score += 15.0
        reasons.append(f"Significant human impact: {demand.affected_people:,} people affected")
    elif demand.affected_people >= 200:
        score += 10.0
        reasons.append(f"Moderate human impact: {demand.affected_people:,} people affected")
    else:
        score += 5.0
        reasons.append(f"Localized human impact: {demand.affected_people:,} people affected")

    # 3. Resource Urgency / Criticality (Weight: 30%)
    res_type = demand.requested_resource.lower()
    if any(k in res_type for k in ["water", "drinking", "medicine", "first aid", "medical", "rescue", "boat"]):
        score += 30.0
        reasons.append(f"Life-critical survival resource: {demand.requested_resource}")
    elif any(k in res_type for k in ["food", "meal", "ration", "baby"]):
        score += 22.0
        reasons.append(f"High-urgency sustenance resource: {demand.requested_resource}")
    elif any(k in res_type for k in ["blanket", "shelter", "tarp", "tent"]):
        score += 15.0
        reasons.append(f"Essential protection resource: {demand.requested_resource}")
    else:
        score += 10.0
        reasons.append(f"General relief supply: {demand.requested_resource}")

    # 4. Verification Status (Weight: 10%)
    if demand.verification_status == "VERIFIED":
        score += 10.0
        reasons.append("On-ground ground assessment VERIFIED by field authority")
    else:
        score += 5.0
        reasons.append("Demand awaiting secondary ground verification")

    # 5. Quantity Factor (Weight: 10%)
    if demand.quantity >= 1000:
        score += 10.0
        reasons.append(f"High-volume emergency shipment requested ({demand.quantity:,} units)")
    else:
        score += 6.0
        reasons.append(f"Standard shipment volume requested ({demand.quantity:,} units)")

    final_score = min(100.0, round(score, 1))
    
    # Priority Level Mapping
    if final_score >= 80.0:
        priority_level = "CRITICAL"
    elif final_score >= 60.0:
        priority_level = "HIGH"
    elif final_score >= 40.0:
        priority_level = "MEDIUM"
    else:
        priority_level = "LOW"

    return {
        "score": final_score,
        "priority": priority_level,
        "reasons": reasons
    }

def find_best_matches(
    demand: DemandRequest,
    resources: List[ResourceItem],
    resource_centers: List[ResourceCenter],
    all_demands: Optional[List[DemandRequest]] = None
) -> SmartMatchResponse:
    """
    Intelligent Rule-Based Matching Engine for Disaster Resource Allocation.
    Matches emergency demands with optimal warehouse stock based on distance,
    travel time, stock availability, and priority.
    """
    # 1. Filter matching resources by type
    norm_res_name = demand.requested_resource.strip().lower()
    matching_stock = [
        r for r in resources
        if r.resource_type.strip().lower() == norm_res_name or norm_res_name in r.resource_type.lower()
    ]

    centers_dict = {c.id: c for c in resource_centers}
    candidates: List[MatchCandidate] = []

    for stock in matching_stock:
        center = centers_dict.get(stock.resource_center_id)
        center_coords = stock.coordinates if stock.coordinates else (center.coordinates if center else demand.coordinates)
        center_name = stock.resource_center_name or (center.name if center else "Relief Depot")

        # Compute dynamic route
        route_info = compute_route(center_coords, demand.coordinates)
        distance_km = route_info["distance_km"]
        eta_mins = route_info["estimated_travel_time_mins"]

        # Stock evaluation
        avail = stock.available_quantity
        req = demand.quantity
        fulfillable = min(avail, req)

        # Multi-Criteria Scoring (0 - 100)
        # Factors:
        # A. Stock Fulfillment (Weight: 40 points)
        if avail >= req:
            stock_score = 40.0
            feasibility = "FULLY_FULFILLABLE"
            stock_reason = f"Full capacity available ({avail:,} in stock vs {req:,} needed)"
        elif avail > 0:
            ratio = avail / float(req)
            stock_score = 40.0 * ratio
            feasibility = "PARTIALLY_FULFILLABLE"
            stock_reason = f"Partial fulfillment possible ({avail:,} of {req:,} needed)"
        else:
            stock_score = 0.0
            feasibility = "INSUFFICIENT_STOCK"
            stock_reason = "Out of stock at this location"

        # B. Proximity & ETA (Weight: 35 points)
        # Closer is better. Scale from 0 to 60 km
        dist_factor = max(0.0, 1.0 - (distance_km / 60.0))
        dist_score = 35.0 * dist_factor
        dist_reason = f"Optimal transit distance: {distance_km} km (Est. ETA: {eta_mins} mins)"

        # C. Warehouse Operational Readiness (Weight: 15 points)
        condition_score = 15.0 if stock.condition in ["Good", "Sealed", "Ready"] else 8.0
        condition_reason = f"Inventory condition verified: {stock.condition}"

        # D. Priority Urgency Match (Weight: 10 points)
        urgency_score = 10.0 if demand.priority == "CRITICAL" else 7.0

        total_match_score = round(min(100.0, stock_score + dist_score + condition_score + urgency_score), 1)

        candidate_reasons = [stock_reason, dist_reason, condition_reason]
        if avail >= req:
            candidate_reasons.append("Shortest feasible route with sufficient reserve capacity")

        candidates.append(MatchCandidate(
            resource_center_id=stock.resource_center_id,
            resource_center_name=center_name,
            resource_id=stock.id,
            available_quantity=avail,
            requested_quantity=req,
            fulfillable_quantity=fulfillable,
            distance_km=distance_km,
            estimated_travel_time_mins=eta_mins,
            match_score=total_match_score,
            reasons=candidate_reasons,
            feasibility=feasibility,
            coordinates=center_coords
        ))

    # Sort candidates by match score descending
    candidates.sort(key=lambda x: (x.feasibility == "FULLY_FULFILLABLE", x.match_score), reverse=True)

    recommended = candidates[0] if len(candidates) > 0 else None
    alternatives = candidates[1:4] if len(candidates) > 1 else []

    # Detect conflicting demands competing for the same resource center
    conflicts = []
    if all_demands and recommended:
        for other in all_demands:
            if other.id != demand.id and other.status in ["PENDING", "MATCHED"]:
                if other.requested_resource.strip().lower() == norm_res_name:
                    conflicts.append({
                        "demand_id": other.id,
                        "location": other.location_name,
                        "quantity": other.quantity,
                        "priority": other.priority,
                        "status": other.status
                    })

    # Shortage warning
    total_avail = sum(c.available_quantity for c in candidates)
    shortage_msg = None
    if total_avail < demand.quantity:
        shortage_msg = f"REGIONAL DEFICIT: Total regional stock of {demand.requested_resource} ({total_avail:,}) is less than requested quantity ({demand.quantity:,}). Emergency inter-district replenishment required."
    elif total_avail < demand.quantity * 1.3:
        shortage_msg = f"LOW BUFFER: Regional reserve of {demand.requested_resource} is operating below safe buffer (Remaining: {total_avail - demand.quantity:,} units after allocation)."

    # Structured AI / Rule-based explanation
    if recommended:
        explanation = (
            f"The Intelligent Rule-Based Matching Engine recommends allocating {recommended.fulfillable_quantity:,} "
            f"units of {demand.requested_resource} from {recommended.resource_center_name}. "
            f"This facility achieved the highest score ({recommended.match_score}%) due to "
            f"{'full availability of requested stock' if recommended.feasibility == 'FULLY_FULFILLABLE' else 'highest available stock'} "
            f"and an estimated rapid transit time of {recommended.estimated_travel_time_mins} minutes over {recommended.distance_km} km."
        )
    else:
        explanation = f"No active warehouses currently hold inventory of {demand.requested_resource}. Immediate procurement or mutual-aid requisition required."

    confidence = recommended.match_score if recommended else 0.0

    return SmartMatchResponse(
        demand_id=demand.id,
        requested_resource=demand.requested_resource,
        requested_quantity=demand.quantity,
        demand_priority=demand.priority,
        recommended_match=recommended,
        alternative_matches=alternatives,
        conflicting_demands=conflicts,
        shortage_warning=shortage_msg,
        ai_explanation=explanation,
        confidence_score=confidence
    )
