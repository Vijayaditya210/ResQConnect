// Data contract types for ResQConnect Emergency Command Center

export type UserRole = 
  | 'ADMIN'               // Disaster Authority / Commander
  | 'NGO'                 // Relief Organization / Field Aid
  | 'WAREHOUSE_MANAGER'   // Resource Center Manager
  | 'VOLUNTEER_LOGISTICS' // Transport & Driver

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  phone: string;
  assignedLocation?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Disaster {
  id: string;
  name: string;
  type: 'Flood' | 'Cyclone' | 'Earthquake' | 'Landslide' | 'Fire';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location_name: string;
  coordinates: Coordinates;
  affected_people: number;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
  declared_at: string;
  description?: string;
}

export interface ResourceCenter {
  id: string;
  name: string;
  type: 'Central Warehouse' | 'District Depot' | 'Community Center' | 'Hospital Store';
  location_name: string;
  coordinates: Coordinates;
  capacity_sqft: number;
  contact_person: string;
  contact_phone: string;
  status: 'OPERATIONAL' | 'FULL_CAPACITY' | 'RESTRICTED';
}

export interface ResourceItem {
  id: string;
  resource_type: 
    | 'Drinking Water'
    | 'Food Packets'
    | 'Medicines'
    | 'Blankets'
    | 'Clothes'
    | 'Emergency Kits'
    | 'Rescue Equipment';
  total_quantity: number;
  available_quantity: number;
  allocated_quantity: number;
  unit: string;
  resource_center_id: string;
  resource_center_name: string;
  coordinates: Coordinates;
  condition: 'Good' | 'Sealed' | 'Perishable' | 'Ready';
  expiry_date?: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'DEPLETED';
  last_updated: string;
}

export interface DemandRequest {
  id: string;
  disaster_id: string;
  disaster_name: string;
  location_name: string;
  coordinates: Coordinates;
  requested_resource: string;
  quantity: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority_score: number;
  priority_reasons: string[];
  affected_people: number;
  requesting_organization: string;
  contact_phone: string;
  status: 'PENDING' | 'MATCHED' | 'ALLOCATED' | 'IN_TRANSIT' | 'FULFILLED' | 'CANCELLED';
  verification_status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'UNVERIFIED';
  created_at: string;
  urgency_notes?: string;
  allocated_resource_id?: string;
  allocated_center_id?: string;
  allocated_center_name?: string;
  active_delivery_id?: string;
}

export interface Allocation {
  id: string;
  demand_id: string;
  resource_id: string;
  resource_center_id: string;
  resource_center_name: string;
  resource_type: string;
  allocated_quantity: number;
  allocated_by: string;
  allocated_at: string;
  status: 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface Vehicle {
  id: string;
  vehicle_number: string;
  type: '4x4 Rescue Truck' | 'Medium Cargo Truck' | 'Light Van' | 'Rescue Boat' | 'Emergency Ambulance';
  capacity_kg: number;
  driver_name: string;
  driver_phone: string;
  current_coordinates: Coordinates;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'RETURNING' | 'MAINTENANCE';
  assigned_delivery_id?: string;
}

export interface Delivery {
  id: string;
  demand_id: string;
  disaster_id: string;
  disaster_name: string;
  resource_center_id: string;
  resource_center_name: string;
  destination_name: string;
  source_coordinates: Coordinates;
  destination_coordinates: Coordinates;
  vehicle_id: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  resource_type: string;
  quantity: number;
  distance_km: number;
  estimated_travel_time_mins: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED';
  route_waypoints: Coordinates[];
  current_step_index: number;
  created_at: string;
  last_updated: string;
  delivered_at?: string;
}

export interface Shelter {
  id: string;
  name: string;
  location_name: string;
  coordinates: Coordinates;
  capacity: number;
  current_occupancy: number;
  contact_person: string;
  contact_phone: string;
  status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL';
}

export interface AlertItem {
  id: string;
  type: 'CRITICAL_DEMAND' | 'LOW_INVENTORY' | 'DELIVERY_DELAYED' | 'RESOURCE_ALLOCATED' | 'DEMAND_FULFILLED' | 'DISASTER_ALERT';
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  timestamp: string;
  related_id?: string;
}

export interface MatchCandidate {
  resource_center_id: string;
  resource_center_name: string;
  resource_id: string;
  available_quantity: number;
  requested_quantity: number;
  fulfillable_quantity: number;
  distance_km: number;
  estimated_travel_time_mins: number;
  match_score: number;
  reasons: string[];
  feasibility: 'FULLY_FULFILLABLE' | 'PARTIALLY_FULFILLABLE' | 'INSUFFICIENT_STOCK';
  coordinates: Coordinates;
}

export interface SmartMatchResponse {
  demand_id: string;
  requested_resource: string;
  requested_quantity: number;
  demand_priority: string;
  recommended_match: MatchCandidate | null;
  alternative_matches: MatchCandidate[];
  conflicting_demands: Array<{
    demand_id: string;
    location: string;
    quantity: number;
    priority: string;
    status: string;
  }>;
  shortage_warning: string | null;
  ai_explanation: string;
  confidence_score: number;
}

export interface AIIntelligenceResponse {
  demand_id: string;
  priority_recommendation: string;
  priority_score: number;
  recommended_action: string;
  reasoning: string[];
  primary_center_name: string;
  primary_center_id: string;
  allocated_quantity: number;
  alternative_center_name?: string;
  alternative_center_id?: string;
  confidence_score: number;
  potential_shortages: string[];
  competing_demands_detected: string[];
  judge_explanation: string;
}
