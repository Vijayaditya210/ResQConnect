from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# Common Location Coordinate
class Coordinates(BaseModel):
    lat: float
    lng: float

# Disaster Model
class Disaster(BaseModel):
    id: str
    name: str
    type: str # Flood, Cyclone, Earthquake, Landslide, Fire
    severity: str # CRITICAL, HIGH, MEDIUM, LOW
    location_name: str
    coordinates: Coordinates
    affected_people: int
    status: str # ACTIVE, CONTAINED, RESOLVED
    declared_at: str
    description: Optional[str] = None

# Resource Inventory Model
class ResourceItem(BaseModel):
    id: str
    resource_type: str # Drinking Water, Food Packets, Medicines, Blankets, Clothes, Emergency Kits, Rescue Equipment
    total_quantity: int
    available_quantity: int
    allocated_quantity: int
    unit: str # units, packets, kits, boxes, sets
    resource_center_id: str
    resource_center_name: str
    coordinates: Coordinates
    condition: str # Good, Sealed, Perishable, Ready
    expiry_date: Optional[str] = None
    status: str # AVAILABLE, LOW_STOCK, DEPLETED
    last_updated: str

# Resource Center / Warehouse Model
class ResourceCenter(BaseModel):
    id: str
    name: str
    type: str # Central Warehouse, District Depot, Community Center, Hospital Store
    location_name: str
    coordinates: Coordinates
    capacity_sqft: int
    contact_person: str
    contact_phone: str
    status: str # OPERATIONAL, FULL_CAPACITY, RESTRICTED

# Emergency Demand Request Model
class DemandRequest(BaseModel):
    id: str
    disaster_id: str
    disaster_name: str
    location_name: str
    coordinates: Coordinates
    requested_resource: str
    quantity: int
    priority: str # CRITICAL, HIGH, MEDIUM, LOW
    priority_score: float = 0.0 # 0 - 100
    priority_reasons: List[str] = []
    affected_people: int
    requesting_organization: str
    contact_phone: str
    status: str # PENDING, MATCHED, ALLOCATED, IN_TRANSIT, FULFILLED, CANCELLED
    verification_status: str # VERIFIED, PENDING_VERIFICATION, UNVERIFIED
    created_at: str
    urgency_notes: Optional[str] = None

# Allocation Model
class Allocation(BaseModel):
    id: str
    demand_id: str
    resource_id: str
    resource_center_id: str
    resource_center_name: str
    resource_type: str
    allocated_quantity: int
    allocated_by: str # User ID / Name
    allocated_at: str
    status: str # CONFIRMED, DISPATCHED, COMPLETED, CANCELLED
    notes: Optional[str] = None

# Vehicle Model
class Vehicle(BaseModel):
    id: str
    vehicle_number: str
    type: str # 4x4 Rescue Truck, Medium Cargo Truck, Light Van, Boat/Amphibious, Ambulance
    capacity_kg: int
    driver_name: str
    driver_phone: str
    current_coordinates: Coordinates
    status: str # AVAILABLE, ASSIGNED, IN_TRANSIT, RETURNING, MAINTENANCE
    assigned_delivery_id: Optional[str] = None

# Delivery / Logistics Model
class Delivery(BaseModel):
    id: str
    demand_id: str
    disaster_id: str
    disaster_name: str
    resource_center_id: str
    resource_center_name: str
    destination_name: str
    source_coordinates: Coordinates
    destination_coordinates: Coordinates
    vehicle_id: str
    vehicle_number: str
    driver_name: str
    driver_phone: str
    resource_type: str
    quantity: int
    distance_km: float
    estimated_travel_time_mins: int
    status: str # PENDING, ASSIGNED, IN_TRANSIT, DELAYED, DELIVERED
    route_waypoints: List[Coordinates] = []
    current_step_index: int = 0
    created_at: str
    last_updated: str
    delivered_at: Optional[str] = None

# Shelter Model
class Shelter(BaseModel):
    id: str
    name: str
    location_name: str
    coordinates: Coordinates
    capacity: int
    current_occupancy: int
    contact_person: str
    contact_phone: str
    status: str # OPEN, NEAR_CAPACITY, FULL

# Real-Time Alert Model
class Alert(BaseModel):
    id: str
    type: str # CRITICAL_DEMAND, LOW_INVENTORY, DELIVERY_DELAYED, RESOURCE_ALLOCATED, DEMAND_FULFILLED, DISASTER_ALERT
    title: str
    message: str
    severity: str # CRITICAL, WARNING, INFO, SUCCESS
    timestamp: str
    related_id: Optional[str] = None

# Smart Matching Request & Response
class MatchCandidate(BaseModel):
    resource_center_id: str
    resource_center_name: str
    resource_id: str
    available_quantity: int
    requested_quantity: int
    fulfillable_quantity: int
    distance_km: float
    estimated_travel_time_mins: int
    match_score: float # 0 - 100
    reasons: List[str]
    feasibility: str # FULLY_FULFILLABLE, PARTIALLY_FULFILLABLE, INSUFFICIENT_STOCK
    coordinates: Coordinates

class SmartMatchResponse(BaseModel):
    demand_id: str
    requested_resource: str
    requested_quantity: int
    demand_priority: str
    recommended_match: Optional[MatchCandidate] = None
    alternative_matches: List[MatchCandidate] = []
    conflicting_demands: List[Dict[str, Any]] = []
    shortage_warning: Optional[str] = None
    ai_explanation: str
    confidence_score: float

# AI Intelligence Request & Response
class AIAnalyzeDemandRequest(BaseModel):
    demand: DemandRequest
    available_resources: List[ResourceItem]
    resource_centers: List[ResourceCenter]

class AIIntelligenceResponse(BaseModel):
    demand_id: str
    priority_recommendation: str
    priority_score: float
    recommended_action: str
    reasoning: List[str]
    primary_center_name: str
    primary_center_id: str
    allocated_quantity: int
    alternative_center_name: Optional[str] = None
    alternative_center_id: Optional[str] = None
    confidence_score: float
    potential_shortages: List[str] = []
    competing_demands_detected: List[str] = []
    judge_explanation: str
