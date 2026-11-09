// Google Maps Platform Configuration & Tactical Styling

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const isGoogleMapsConfigured = Boolean(
  GOOGLE_MAPS_API_KEY &&
  GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY'
);

export const DEFAULT_MAP_CENTER = {
  lat: 16.5062,
  lng: 80.6480 // Vijayawada - Amaravati - Guntur Corridor
};

export const DEFAULT_ZOOM = 12;

// Map ID required for AdvancedMarkerElement per Google Maps Platform guidelines (CF9)
export const MAP_ID = 'DEMO_MAP_ID';

export const ATTRIBUTION_IDS = ['gmp_git_agentskills_v1'];

export const ENTITY_COLORS = {
  disaster: {
    bg: '#ef4444',
    border: '#b91c1c',
    text: '#ffffff',
    label: 'Disaster Zone'
  },
  demand: {
    bg: '#f97316',
    border: '#c2410c',
    text: '#ffffff',
    label: 'Emergency Demand'
  },
  resourceCenter: {
    bg: '#10b981',
    border: '#047857',
    text: '#ffffff',
    label: 'Resource Warehouse'
  },
  shelter: {
    bg: '#3b82f6',
    border: '#1d4ed8',
    text: '#ffffff',
    label: 'Relief Shelter'
  },
  vehicle: {
    bg: '#8b5cf6',
    border: '#6d28d9',
    text: '#ffffff',
    label: 'Logistics Vehicle'
  }
};
