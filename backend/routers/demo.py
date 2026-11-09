from fastapi import APIRouter
from typing import Dict, Any
from ..config import FIREBASE_PROJECT_ID, GOOGLE_MAPS_API_KEY, GEMINI_API_KEY

router = APIRouter(prefix="/api/demo", tags=["Demo & System Status"])

@router.get("/status")
async def system_status() -> Dict[str, Any]:
    """
    Returns platform connectivity status, active integrations, and demo scenario configuration.
    """
    return {
        "status": "OPERATIONAL",
        "scenario": "Vijayawada Flood Emergency (Andhra Pradesh, NTR District)",
        "integrations": {
            "firebase": {
                "configured": bool(FIREBASE_PROJECT_ID),
                "project_id": FIREBASE_PROJECT_ID if FIREBASE_PROJECT_ID else "Client-Sync / Local Storage Adapter Active"
            },
            "google_maps": {
                "configured": bool(GOOGLE_MAPS_API_KEY),
                "mode": "Live Google Maps JavaScript & Routes API" if GOOGLE_MAPS_API_KEY else "Interactive Map + Client Fallback Simulation"
            },
            "gemini_ai": {
                "configured": bool(GEMINI_API_KEY),
                "mode": "Gemini 2.5 Flash Active" if GEMINI_API_KEY else "Intelligent Rule-Based MCDA Intelligence Engine (Transparent Fallback)"
            }
        },
        "target_region": {
            "name": "Vijayawada - Guntur - Amaravati Urban Complex",
            "center": {"lat": 16.5062, "lng": 80.6480}
        }
    }
