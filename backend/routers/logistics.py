from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..models.schemas import Coordinates
from ..services.routes_service import compute_route

router = APIRouter(prefix="/api/logistics", tags=["Logistics & Routing"])

class RouteRequest(BaseModel):
    origin: Coordinates
    destination: Coordinates

@router.post("/compute-route")
async def calculate_route(payload: RouteRequest) -> Dict[str, Any]:
    """
    Calculates accurate road distance, duration, and intermediate route waypoints
    using Google Maps Routes API (or high-accuracy geospatial routing model fallback).
    """
    try:
        route_info = compute_route(payload.origin, payload.destination)
        return route_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route calculation failed: {str(e)}")
