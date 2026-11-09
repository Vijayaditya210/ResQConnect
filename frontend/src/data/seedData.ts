import {
  Disaster, ResourceCenter, ResourceItem, DemandRequest,
  Vehicle, Delivery, Shelter, AlertItem, UserProfile
} from '../types';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_admin_01',
    name: 'Dr. Ramesh Babu, IAS',
    email: 'commissioner@resqconnect.gov.in',
    role: 'ADMIN',
    organization: 'AP Disaster Management Authority (APDMA)',
    phone: '+91 866 248 9901',
    assignedLocation: 'AP State Emergency Operations Center, Vijayawada'
  },
  {
    id: 'user_ngo_01',
    name: 'Priya Sundaram',
    email: 'priya@redcross-ap.org',
    role: 'NGO',
    organization: 'Indian Red Cross Society (AP State Branch)',
    phone: '+91 98480 12345',
    assignedLocation: 'Vijayawada Field Relief Cell'
  },
  {
    id: 'user_wh_01',
    name: 'M. Venkat Rao',
    email: 'logistics.guntur@resqconnect.org',
    role: 'WAREHOUSE_MANAGER',
    organization: 'Civil Supplies Logistics Depot',
    phone: '+91 94401 55678',
    assignedLocation: 'Guntur Central Relief Depot'
  },
  {
    id: 'user_vol_01',
    name: 'Rajesh Kumar (Convoy Lead)',
    email: 'rajesh.driver@resqconnect.org',
    role: 'VOLUNTEER_LOGISTICS',
    organization: 'Disaster Rapid Logistics Taskforce',
    phone: '+91 99887 76655',
    assignedLocation: 'Vehicle AP-39-TR-104'
  }
];

export const SEED_DISASTERS: Disaster[] = [
  {
    id: 'DIS-AP-01',
    name: 'Vijayawada Urban Inundation & Budameru Rivulet Breach',
    type: 'Flood',
    severity: 'CRITICAL',
    location_name: 'Vijayawada City & Ajit Singh Nagar Zone',
    coordinates: { lat: 16.5193, lng: 80.6305 },
    affected_people: 18500,
    status: 'ACTIVE',
    declared_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    description: 'Catastrophic river surge in Budameru rivulet causing acute inundation across Ajit Singh Nagar, Payakapuram, and Vidyadharapuram.'
  },
  {
    id: 'DIS-AP-02',
    name: 'Guntur Lowland Krishna River Embankment Overflow',
    type: 'Flood',
    severity: 'HIGH',
    location_name: 'Guntur North Rural Belt & Seethanagaram',
    coordinates: { lat: 16.3267, lng: 80.4465 },
    affected_people: 6200,
    status: 'ACTIVE',
    declared_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    description: 'Krishna river floodwaters exceeding danger mark at Prakasam Barrage upstream, breaching agricultural dikes.'
  },
  {
    id: 'DIS-AP-03',
    name: 'Amaravati Capital Region Heavy Waterlogging',
    type: 'Flood',
    severity: 'MEDIUM',
    location_name: 'Amaravati Seed Access Sector & Rayapudi',
    coordinates: { lat: 16.5331, lng: 80.5265 },
    affected_people: 3400,
    status: 'ACTIVE',
    declared_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    description: 'Localized storm runoff submerging road corridors and isolating peripheral villages.'
  }
];

export const SEED_RESOURCE_CENTERS: ResourceCenter[] = [
  {
    id: 'RC-GNT-01',
    name: 'Guntur Central Relief Warehouse',
    type: 'Central Warehouse',
    location_name: 'Nallapadu Industrial Estate, Guntur',
    coordinates: { lat: 16.3150, lng: 80.4420 },
    capacity_sqft: 45000,
    contact_person: 'M. Venkat Rao',
    contact_phone: '+91 94401 55678',
    status: 'OPERATIONAL'
  },
  {
    id: 'RC-AMR-02',
    name: 'Amaravati State Logistics Buffer Depot',
    type: 'District Depot',
    location_name: 'Velagapudi Government Complex, Amaravati',
    coordinates: { lat: 16.5200, lng: 80.5250 },
    capacity_sqft: 32000,
    contact_person: 'K. S. N. Murthy',
    contact_phone: '+91 94402 77889',
    status: 'OPERATIONAL'
  },
  {
    id: 'RC-BZA-03',
    name: 'Vijayawada East Civil Defense Depot',
    type: 'Hospital Store',
    location_name: 'Autonagar Aid Center, Vijayawada',
    coordinates: { lat: 16.5180, lng: 80.6650 },
    capacity_sqft: 20000,
    contact_person: 'Dr. Aruna Kumari',
    contact_phone: '+91 866 255 4321',
    status: 'OPERATIONAL'
  },
  {
    id: 'RC-TEN-04',
    name: 'Tenali Multi-Agency Aid Stockpile',
    type: 'Community Center',
    location_name: 'Tenali Market Yard, Tenali',
    coordinates: { lat: 16.2430, lng: 80.6400 },
    capacity_sqft: 18000,
    contact_person: 'P. Subba Rao',
    contact_phone: '+91 98499 11223',
    status: 'OPERATIONAL'
  }
];

export const SEED_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-01',
    resource_type: 'Drinking Water',
    total_quantity: 6000,
    available_quantity: 5000,
    allocated_quantity: 1000,
    unit: '20L Cans / Packs',
    resource_center_id: 'RC-GNT-01',
    resource_center_name: 'Guntur Central Relief Warehouse',
    coordinates: { lat: 16.3150, lng: 80.4420 },
    condition: 'Sealed',
    expiry_date: '2026-12-31',
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-02',
    resource_type: 'Drinking Water',
    total_quantity: 3500,
    available_quantity: 3000,
    allocated_quantity: 500,
    unit: '20L Cans / Packs',
    resource_center_id: 'RC-AMR-02',
    resource_center_name: 'Amaravati State Logistics Buffer Depot',
    coordinates: { lat: 16.5200, lng: 80.5250 },
    condition: 'Sealed',
    expiry_date: '2026-12-31',
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-03',
    resource_type: 'Food Packets',
    total_quantity: 10000,
    available_quantity: 8000,
    allocated_quantity: 2000,
    unit: 'Dry Ration Kits',
    resource_center_id: 'RC-GNT-01',
    resource_center_name: 'Guntur Central Relief Warehouse',
    coordinates: { lat: 16.3150, lng: 80.4420 },
    condition: 'Good',
    expiry_date: '2026-10-15',
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-04',
    resource_type: 'Medicines',
    total_quantity: 1500,
    available_quantity: 1200,
    allocated_quantity: 300,
    unit: 'Trauma & ORS Kits',
    resource_center_id: 'RC-AMR-02',
    resource_center_name: 'Amaravati State Logistics Buffer Depot',
    coordinates: { lat: 16.5200, lng: 80.5250 },
    condition: 'Sealed',
    expiry_date: '2027-04-30',
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-05',
    resource_type: 'Blankets',
    total_quantity: 2500,
    available_quantity: 2000,
    allocated_quantity: 500,
    unit: 'Fleece Blankets',
    resource_center_id: 'RC-TEN-04',
    resource_center_name: 'Tenali Multi-Agency Aid Stockpile',
    coordinates: { lat: 16.2430, lng: 80.6400 },
    condition: 'Ready',
    expiry_date: undefined,
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-06',
    resource_type: 'Emergency Kits',
    total_quantity: 1000,
    available_quantity: 800,
    allocated_quantity: 200,
    unit: 'Torch/Batteries/Tarps',
    resource_center_id: 'RC-AMR-02',
    resource_center_name: 'Amaravati State Logistics Buffer Depot',
    coordinates: { lat: 16.5200, lng: 80.5250 },
    condition: 'Ready',
    expiry_date: undefined,
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-07',
    resource_type: 'Rescue Equipment',
    total_quantity: 600,
    available_quantity: 450,
    allocated_quantity: 150,
    unit: 'Life Jackets & Inflatable Rings',
    resource_center_id: 'RC-BZA-03',
    resource_center_name: 'Vijayawada East Civil Defense Depot',
    coordinates: { lat: 16.5180, lng: 80.6650 },
    condition: 'Good',
    expiry_date: undefined,
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  },
  {
    id: 'RES-08',
    resource_type: 'Food Packets',
    total_quantity: 3000,
    available_quantity: 2500,
    allocated_quantity: 500,
    unit: 'Ready-to-Eat Meal Boxes',
    resource_center_id: 'RC-BZA-03',
    resource_center_name: 'Vijayawada East Civil Defense Depot',
    coordinates: { lat: 16.5180, lng: 80.6650 },
    condition: 'Good',
    expiry_date: '2026-09-30',
    status: 'AVAILABLE',
    last_updated: new Date().toISOString()
  }
];

export const SEED_DEMANDS: DemandRequest[] = [
  {
    id: 'DEM-1001',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    location_name: 'Ajit Singh Nagar Inundation Zone',
    coordinates: { lat: 16.5320, lng: 80.6380 },
    requested_resource: 'Drinking Water',
    quantity: 2000,
    priority: 'CRITICAL',
    priority_score: 95.0,
    priority_reasons: [
      '5,000 citizens marooned on rooftops and upper floors',
      'Municipal water supply pipelines contaminated with flood runoff',
      'Critical life-support window: 42 minutes pending response time',
      'Ground verified by AP Disaster Response Force Field Unit 4'
    ],
    affected_people: 5000,
    requesting_organization: 'Ajit Singh Nagar Citizen Action & Red Cross',
    contact_phone: '+91 866 299 1044',
    status: 'PENDING',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 42 * 60000).toISOString(),
    urgency_notes: 'Urgent need of clean bottled drinking water cans before nightfall.'
  },
  {
    id: 'DEM-1002',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    location_name: 'Payakapuram Primary Health Center',
    coordinates: { lat: 16.5450, lng: 80.6450 },
    requested_resource: 'Medicines',
    quantity: 350,
    priority: 'CRITICAL',
    priority_score: 91.0,
    priority_reasons: [
      '800 displaced patients requiring anti-diarrheal, ORS, and insulin',
      'Direct flood damage to pharmacy stocks',
      'High vulnerability cluster including pregnant women and elderly'
    ],
    affected_people: 800,
    requesting_organization: 'District Medical Officer (NTR District)',
    contact_phone: '+91 866 244 8833',
    status: 'PENDING',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'DEM-1003',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    location_name: 'Bhavanipuram Zilla Parishad School',
    coordinates: { lat: 16.5250, lng: 80.6050 },
    requested_resource: 'Food Packets',
    quantity: 1500,
    priority: 'HIGH',
    priority_score: 78.0,
    priority_reasons: [
      '2,200 flood evacuees sheltered without hot meals for 18 hours',
      'Road access restored via elevated bridge bypass'
    ],
    affected_people: 2200,
    requesting_organization: 'Seva Bharathi Emergency Kitchen',
    contact_phone: '+91 94403 22114',
    status: 'PENDING',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 65 * 60000).toISOString()
  },
  {
    id: 'DEM-1004',
    disaster_id: 'DIS-AP-02',
    disaster_name: 'Guntur Krishna Embankment Overflow',
    location_name: 'Seethanagaram High School Grounds',
    coordinates: { lat: 16.3380, lng: 80.4550 },
    requested_resource: 'Blankets',
    quantity: 800,
    priority: 'MEDIUM',
    priority_score: 55.0,
    priority_reasons: [
      '1,400 people evacuated from submerged riverbanks',
      'Cold night temperature forecast on open campground'
    ],
    affected_people: 1400,
    requesting_organization: 'Guntur Rural Relief Front',
    contact_phone: '+91 863 221 9988',
    status: 'PENDING',
    verification_status: 'PENDING_VERIFICATION',
    created_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'DEM-1005',
    disaster_id: 'DIS-AP-03',
    disaster_name: 'Amaravati Storm Waterlogging',
    location_name: 'Tadepalli Embankment Camp',
    coordinates: { lat: 16.4850, lng: 80.6020 },
    requested_resource: 'Drinking Water',
    quantity: 4000,
    priority: 'HIGH',
    priority_score: 82.0,
    priority_reasons: [
      '4,800 evacuees in makeshift roadside camps',
      'Contaminated borewells'
    ],
    affected_people: 4800,
    requesting_organization: 'AP Red Cross Disaster Unit',
    contact_phone: '+91 98481 00223',
    status: 'PENDING',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 50 * 60000).toISOString()
  },
  {
    id: 'DEM-1006',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    location_name: 'Kondapalli Hillside Evacuation Zone',
    coordinates: { lat: 16.6180, lng: 80.5350 },
    requested_resource: 'Emergency Kits',
    quantity: 200,
    priority: 'MEDIUM',
    priority_score: 48.0,
    priority_reasons: [
      '1,100 people relocated away from flash runoff ravines'
    ],
    affected_people: 1100,
    requesting_organization: 'Kondapalli Grama Panchayat',
    contact_phone: '+91 866 288 3311',
    status: 'ALLOCATED',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
    allocated_resource_id: 'RES-06',
    allocated_center_id: 'RC-AMR-02',
    allocated_center_name: 'Amaravati State Logistics Buffer Depot'
  },
  {
    id: 'DEM-1007',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    location_name: 'Ibrahimpatnam Ferry Point',
    coordinates: { lat: 16.5890, lng: 80.5180 },
    requested_resource: 'Rescue Equipment',
    quantity: 150,
    priority: 'CRITICAL',
    priority_score: 93.0,
    priority_reasons: [
      '3,200 people waiting for boat transport across swollen stream'
    ],
    affected_people: 3200,
    requesting_organization: 'SDRF 3rd Battalion Rescue Wing',
    contact_phone: '+91 94400 33445',
    status: 'IN_TRANSIT',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 75 * 60000).toISOString(),
    allocated_resource_id: 'RES-07',
    allocated_center_id: 'RC-BZA-03',
    allocated_center_name: 'Vijayawada East Civil Defense Depot',
    active_delivery_id: 'DEL-2001'
  },
  {
    id: 'DEM-1008',
    disaster_id: 'DIS-AP-02',
    disaster_name: 'Guntur Krishna Embankment Overflow',
    location_name: 'Mangalagiri Community Hall',
    coordinates: { lat: 16.4350, lng: 80.5650 },
    requested_resource: 'Food Packets',
    quantity: 500,
    priority: 'LOW',
    priority_score: 35.0,
    priority_reasons: [
      '900 people in stable transit shelter, buffer rations requested'
    ],
    affected_people: 900,
    requesting_organization: 'Lions Club Mangalagiri',
    contact_phone: '+91 8645 233 444',
    status: 'FULFILLED',
    verification_status: 'VERIFIED',
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    allocated_resource_id: 'RES-03',
    allocated_center_id: 'RC-GNT-01',
    allocated_center_name: 'Guntur Central Relief Warehouse'
  }
];

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-01',
    vehicle_number: 'AP-39-TR-104',
    type: '4x4 Rescue Truck',
    capacity_kg: 5000,
    driver_name: 'Rajesh Kumar',
    driver_phone: '+91 99887 76655',
    current_coordinates: { lat: 16.3150, lng: 80.4420 }, // Stationed at Guntur Warehouse
    status: 'AVAILABLE'
  },
  {
    id: 'VEH-02',
    vehicle_number: 'AP-16-CG-882',
    type: 'Medium Cargo Truck',
    capacity_kg: 8000,
    driver_name: 'Suresh Varma',
    driver_phone: '+91 98492 33441',
    current_coordinates: { lat: 16.5450, lng: 80.6000 },
    status: 'IN_TRANSIT',
    assigned_delivery_id: 'DEL-2001'
  },
  {
    id: 'VEH-03',
    vehicle_number: 'AP-07-EM-301',
    type: 'Emergency Ambulance',
    capacity_kg: 1500,
    driver_name: 'Anitha Reddy',
    driver_phone: '+91 94411 77889',
    current_coordinates: { lat: 16.5200, lng: 80.5250 },
    status: 'AVAILABLE'
  },
  {
    id: 'VEH-04',
    vehicle_number: 'AP-39-BT-012',
    type: 'Rescue Boat',
    capacity_kg: 2000,
    driver_name: 'K. Venkatesh',
    driver_phone: '+91 93901 88223',
    current_coordinates: { lat: 16.5890, lng: 80.5180 },
    status: 'ASSIGNED'
  },
  {
    id: 'VEH-05',
    vehicle_number: 'AP-16-LV-554',
    type: 'Light Van',
    capacity_kg: 2500,
    driver_name: 'P. Satyanarayana',
    driver_phone: '+91 97004 55667',
    current_coordinates: { lat: 16.2430, lng: 80.6400 },
    status: 'AVAILABLE'
  }
];

export const SEED_DELIVERIES: Delivery[] = [
  {
    id: 'DEL-2001',
    demand_id: 'DEM-1007',
    disaster_id: 'DIS-AP-01',
    disaster_name: 'Vijayawada Urban Inundation',
    resource_center_id: 'RC-BZA-03',
    resource_center_name: 'Vijayawada East Civil Defense Depot',
    destination_name: 'Ibrahimpatnam Ferry Point',
    source_coordinates: { lat: 16.5180, lng: 80.6650 },
    destination_coordinates: { lat: 16.5890, lng: 80.5180 },
    vehicle_id: 'VEH-02',
    vehicle_number: 'AP-16-CG-882',
    driver_name: 'Suresh Varma',
    driver_phone: '+91 98492 33441',
    resource_type: 'Rescue Equipment',
    quantity: 150,
    distance_km: 19.4,
    estimated_travel_time_mins: 28,
    status: 'IN_TRANSIT',
    current_step_index: 8,
    route_waypoints: [
      { lat: 16.5180, lng: 80.6650 },
      { lat: 16.5220, lng: 80.6450 },
      { lat: 16.5310, lng: 80.6200 },
      { lat: 16.5450, lng: 80.5800 },
      { lat: 16.5620, lng: 80.5480 },
      { lat: 16.5800, lng: 80.5300 },
      { lat: 16.5890, lng: 80.5180 }
    ],
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    last_updated: new Date().toISOString()
  }
];

export const SEED_SHELTERS: Shelter[] = [
  {
    id: 'SH-01',
    name: 'Vijayawada Municipal High School Relief Camp',
    location_name: 'Gandhinagar, Vijayawada',
    coordinates: { lat: 16.5110, lng: 80.6280 },
    capacity: 2500,
    current_occupancy: 2150,
    contact_person: 'T. Srinivasa Rao',
    contact_phone: '+91 866 257 8899',
    status: 'NEAR_CAPACITY'
  },
  {
    id: 'SH-02',
    name: 'Guntur Indoor Stadium Relief Shelter',
    location_name: 'Brundavan Gardens, Guntur',
    coordinates: { lat: 16.3080, lng: 80.4350 },
    capacity: 1800,
    current_occupancy: 1200,
    contact_person: 'K. Padma Vathi',
    contact_phone: '+91 863 235 6677',
    status: 'OPEN'
  },
  {
    id: 'SH-03',
    name: 'Amaravati Convention Center Evacuation Zone',
    location_name: 'Rayapudi Core Sector, Amaravati',
    coordinates: { lat: 16.5140, lng: 80.5150 },
    capacity: 3000,
    current_occupancy: 1450,
    contact_person: 'Ch. Madhusudhan',
    contact_phone: '+91 94409 33221',
    status: 'OPEN'
  }
];

export const SEED_ALERTS: AlertItem[] = [
  {
    id: 'ALT-01',
    type: 'CRITICAL_DEMAND',
    title: 'Critical Aid Needed in Ajit Singh Nagar',
    message: '2,000 units of drinking water urgently requested for 5,000 marooned citizens in Vijayawada.',
    severity: 'CRITICAL',
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    related_id: 'DEM-1001'
  },
  {
    id: 'ALT-02',
    type: 'DISASTER_ALERT',
    title: 'Budameru Rivulet Breach Expanding',
    message: 'APDMA issues Red Alert for Vijayawada Urban; floodwaters entering new low-lying sectors.',
    severity: 'CRITICAL',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    related_id: 'DIS-AP-01'
  },
  {
    id: 'ALT-03',
    type: 'RESOURCE_ALLOCATED',
    title: 'Emergency Aid Dispatch Initialized',
    message: '150 Rescue Equipment units assigned to Vehicle AP-16-CG-882 en route to Ibrahimpatnam.',
    severity: 'INFO',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    related_id: 'DEL-2001'
  },
  {
    id: 'ALT-04',
    type: 'DEMAND_FULFILLED',
    title: 'Mangalagiri Camp Supplied',
    message: '500 dry food packets successfully delivered to Mangalagiri Community Shelter.',
    severity: 'SUCCESS',
    timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
    related_id: 'DEM-1008'
  }
];
