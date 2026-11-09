from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import (
    DemandRequest, ResourceItem, ResourceCenter, AIIntelligenceResponse, AIAnalyzeDemandRequest
)
from ..services.ai_service import generate_ai_disaster_intelligence

router = APIRouter(prefix="/api/ai", tags=["AI Response Intelligence"])

@router.post("/analyze-demand", response_model=AIIntelligenceResponse)
async def analyze_demand(payload: AIAnalyzeDemandRequest):
    """
    Analyzes an emergency demand and generates AI-assisted response recommendations,
    priority validation, shortage warnings, and explainable allocation reasoning.
    """
    try:
        response = generate_ai_disaster_intelligence(
            demand=payload.demand,
            resources=payload.available_resources,
            resource_centers=payload.resource_centers
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI intelligence analysis failed: {str(e)}")
