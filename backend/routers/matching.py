from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from ..models.schemas import (
    DemandRequest, ResourceItem, ResourceCenter, SmartMatchResponse
)
from ..services.matching_service import find_best_matches, calculate_priority_score
from ..services.firebase_service import execute_atomic_allocation

router = APIRouter(prefix="/api/matching", tags=["Intelligent Resource Matching"])

class MatchPayload(BaseModel):
    demand: DemandRequest
    available_resources: List[ResourceItem]
    resource_centers: List[ResourceCenter]
    all_demands: Optional[List[DemandRequest]] = None

class AllocatePayload(BaseModel):
    demand_id: str
    resource_id: str
    quantity: int
    user_id: str

@router.post("/calculate-matches", response_model=SmartMatchResponse)
async def calculate_matches(payload: MatchPayload):
    """
    Computes intelligent rule-based multi-criteria resource matches for an emergency demand.
    """
    try:
        match_response = find_best_matches(
            demand=payload.demand,
            resources=payload.available_resources,
            resource_centers=payload.resource_centers,
            all_demands=payload.all_demands
        )
        return match_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching calculation failed: {str(e)}")

@router.post("/allocate-resource")
async def allocate_resource(payload: AllocatePayload):
    """
    Executes an atomic resource allocation with duplicate prevention.
    """
    result = execute_atomic_allocation(payload.resource_id, payload.quantity)
    if not result.get("success", False):
        raise HTTPException(status_code=400, detail=result.get("error", "Allocation failed"))
    return result
