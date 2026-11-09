import React, { useState } from 'react';
import {
  APIProvider, Map, AdvancedMarker, Pin
} from '@vis.gl/react-google-maps';
import {
  Flame, AlertTriangle, Warehouse, Home, Truck,
  Layers, ZoomIn, ZoomOut, Navigation, Radio, MapPin, Globe
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MapInfoCard } from './MapInfoCard';
import {
  GOOGLE_MAPS_API_KEY, isGoogleMapsConfigured,
  DEFAULT_MAP_CENTER, DEFAULT_ZOOM, MAP_ID
} from '../../config/maps';

// Coordinates boundary for Vijayawada - Guntur - Amaravati region
const BOUNDS = {
  minLat: 16.20,
  maxLat: 16.65,
  minLng: 80.40,
  maxLng: 80.70
};

interface DisasterMapProps {
  onSelectDemandForMatch?: (demandId: string) => void;
  focusedCoordinates?: { lat: number; lng: number } | null;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({ onSelectDemandForMatch, focusedCoordinates }) => {
  const {
    disasters,
    resourceCenters,
    demands,
    vehicles,
    shelters,
    deliveries,
    demoScenarioRunning
  } = useData();

  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'disaster' | 'demand' | 'center' | 'shelter' | 'vehicle';
    data: any;
  } | null>(null);

  // View mode: Google Maps vs Tactical Radar GIS
  const [mapMode, setMapMode] = useState<'google' | 'tactical'>(() => {
    return isGoogleMapsConfigured ? 'google' : 'tactical';
  });

  // Filter layer toggles
  const [layers, setLayers] = useState({
    disasters: true,
    demands: true,
    warehouses: true,
    shelters: true,
    fleet: true,
    routes: true
  });

  // Map viewport zoom & pan for tactical canvas
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map coordinate conversion to SVG viewport (1000 x 650)
  const mapToCanvas = (lat: number, lng: number) => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 900 + 50;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 550 + 50;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] bg-[#070b14] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Tactical Status Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-white">
          <Radio className="h-4 w-4 text-red-500 animate-pulse" />
          <span>Vijayawada - Guntur Disaster Corridor</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {demoScenarioRunning ? 'DEMO LIVE GPS' : 'Tactical GIS Grid'}
          </span>
        </div>

        {/* View Mode Switcher (Google Maps vs Tactical Canvas) */}
        {isGoogleMapsConfigured && (
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl shadow-lg backdrop-blur-md text-xs font-semibold">
            <button
              onClick={() => setMapMode('google')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
                mapMode === 'google' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" /> Google Maps
            </button>
            <button
              onClick={() => setMapMode('tactical')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
                mapMode === 'tactical' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Tactical Radar
            </button>
          </div>
        )}

        {/* Layer Filters */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl shadow-lg backdrop-blur-md text-[11px] font-semibold">
          <button
            onClick={() => setLayers(l => ({ ...l, disasters: !l.disasters }))}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition ${
              layers.disasters ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 opacity-60'
            }`}
          >
            <Flame className="h-3.5 w-3.5" /> Disasters ({disasters.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, demands: !l.demands }))}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition ${
              layers.demands ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 opacity-60'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Demands ({demands.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, warehouses: !l.warehouses }))}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition ${
              layers.warehouses ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 opacity-60'
            }`}
          >
            <Warehouse className="h-3.5 w-3.5" /> Depots ({resourceCenters.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, shelters: !l.shelters }))}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition ${
              layers.shelters ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 opacity-60'
            }`}
          >
            <Home className="h-3.5 w-3.5" /> Shelters ({shelters.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, fleet: !l.fleet }))}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition ${
              layers.fleet ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 opacity-60'
            }`}
          >
            <Truck className="h-3.5 w-3.5" /> Fleet ({vehicles.length})
          </button>
        </div>
      </div>

      {/* Floating Zoom & Control Toolbars */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.25))}
          title="Zoom In"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoomLevel(z => Math.max(0.75, z - 0.25))}
          title="Zoom Out"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          title="Center Focus"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition"
        >
          <Navigation className="h-4 w-4" />
        </button>
      </div>

      {/* Main Map View: Google Maps or Tactical Radar Canvas */}
      {mapMode === 'google' && isGoogleMapsConfigured ? (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <div className="w-full h-full">
            <Map
              defaultCenter={DEFAULT_MAP_CENTER}
              defaultZoom={DEFAULT_ZOOM}
              mapId={MAP_ID}
              disableDefaultUI={false}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Disasters Markers (🔴) */}
              {layers.disasters && disasters.map(d => (
                <AdvancedMarker
                  key={d.id}
                  position={d.coordinates}
                  onClick={() => setSelectedEntity({ type: 'disaster', data: d })}
                >
                  <Pin background="#ef4444" glyphColor="#ffffff" borderColor="#b91c1c" />
                </AdvancedMarker>
              ))}

              {/* Demands Markers (🟠) */}
              {layers.demands && demands.map(dem => {
                if (dem.status === 'FULFILLED') return null;
                return (
                  <AdvancedMarker
                    key={dem.id}
                    position={dem.coordinates}
                    onClick={() => setSelectedEntity({ type: 'demand', data: dem })}
                  >
                    <Pin background="#f97316" glyphColor="#ffffff" borderColor="#c2410c" />
                  </AdvancedMarker>
                );
              })}

              {/* Warehouses (🟢) */}
              {layers.warehouses && resourceCenters.map(rc => (
                <AdvancedMarker
                  key={rc.id}
                  position={rc.coordinates}
                  onClick={() => setSelectedEntity({ type: 'center', data: rc })}
                >
                  <Pin background="#10b981" glyphColor="#ffffff" borderColor="#047857" />
                </AdvancedMarker>
              ))}

              {/* Shelters (🔵) */}
              {layers.shelters && shelters.map(sh => (
                <AdvancedMarker
                  key={sh.id}
                  position={sh.coordinates}
                  onClick={() => setSelectedEntity({ type: 'shelter', data: sh })}
                >
                  <Pin background="#3b82f6" glyphColor="#ffffff" borderColor="#1d4ed8" />
                </AdvancedMarker>
              ))}

              {/* Vehicles (🟣) */}
              {layers.fleet && vehicles.map(v => (
                <AdvancedMarker
                  key={v.id}
                  position={v.current_coordinates}
                  onClick={() => setSelectedEntity({ type: 'vehicle', data: v })}
                >
                  <Pin background="#8b5cf6" glyphColor="#ffffff" borderColor="#6d28d9" />
                </AdvancedMarker>
              ))}
            </Map>
          </div>
        </APIProvider>
      ) : (
        /* Tactical High-Definition Canvas Surface */
        <div
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeOpacity="0.4" />
              </pattern>
              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1000" height="650" fill="#090d16" />
            <rect width="1000" height="650" fill="url(#grid)" />

            {/* Krishna River Geo-Path */}
            <path
              d="M 50,420 Q 300,380 480,280 T 950,220"
              fill="none"
              stroke="#0284c7"
              strokeWidth="38"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
            <path
              d="M 50,420 Q 300,380 480,280 T 950,220"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="12"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
            <text x="560" y="270" fill="#7dd3fc" fontSize="11" fontWeight="bold" opacity="0.7">
              Krishna River (Flood Level Danger Mark)
            </text>

            {/* Major Highway Corridors (NH-16) */}
            <path
              d="M 220,530 Q 380,390 520,310 T 820,130"
              fill="none"
              stroke="#334155"
              strokeWidth="5"
              strokeDasharray="4 2"
            />
            <text x="260" y="470" fill="#94a3b8" fontSize="10" opacity="0.6" transform="rotate(-30 260 470)">
              National Highway NH-16 (Guntur - Vijayawada)
            </text>

            <path
              d="M 450,260 L 520,310 L 760,290"
              fill="none"
              stroke="#334155"
              strokeWidth="4"
            />
            <text x="440" y="245" fill="#94a3b8" fontSize="10" opacity="0.6">
              Prakasam Barrage Corridor
            </text>

            {/* Active Deliveries Routes (Polylines) */}
            {layers.routes && deliveries.map((del) => {
              const startPt = mapToCanvas(del.source_coordinates.lat, del.source_coordinates.lng);
              const endPt = mapToCanvas(del.destination_coordinates.lat, del.destination_coordinates.lng);
              return (
                <g key={del.id}>
                  <path
                    d={`M ${startPt.x},${startPt.y} Q ${(startPt.x + endPt.x)/2 + 20},${(startPt.y + endPt.y)/2 - 15} ${endPt.x},${endPt.y}`}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="6"
                    strokeOpacity="0.3"
                  />
                  <path
                    d={`M ${startPt.x},${startPt.y} Q ${(startPt.x + endPt.x)/2 + 20},${(startPt.y + endPt.y)/2 - 15} ${endPt.x},${endPt.y}`}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                </g>
              );
            })}

            {/* Relief Shelters Markers (🔵) */}
            {layers.shelters && shelters.map((sh) => {
              const pt = mapToCanvas(sh.coordinates.lat, sh.coordinates.lng);
              return (
                <g
                  key={sh.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'shelter', data: sh })}
                >
                  <circle cx={pt.x} cy={pt.y} r="16" fill="#3b82f6" fillOpacity="0.2" />
                  <circle cx={pt.x} cy={pt.y} r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="10" fill="#fff" dominantBaseline="middle">🏠</text>
                  <text x={pt.x} y={pt.y + 22} textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">
                    {sh.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Resource Centers / Warehouses Markers (🟢) */}
            {layers.warehouses && resourceCenters.map((rc) => {
              const pt = mapToCanvas(rc.coordinates.lat, rc.coordinates.lng);
              return (
                <g
                  key={rc.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'center', data: rc })}
                >
                  <circle cx={pt.x} cy={pt.y} r="20" fill="#10b981" fillOpacity="0.2" />
                  <circle cx={pt.x} cy={pt.y} r="12" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                  <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="11" fill="#fff" dominantBaseline="middle">🏭</text>
                  <text x={pt.x} y={pt.y + 24} textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold">
                    {rc.name.split(' ')[0]} Depot
                  </text>
                </g>
              );
            })}

            {/* Disasters Markers & Breach Zones (🔴) */}
            {layers.disasters && disasters.map((dis) => {
              const pt = mapToCanvas(dis.coordinates.lat, dis.coordinates.lng);
              return (
                <g
                  key={dis.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'disaster', data: dis })}
                >
                  <circle cx={pt.x} cy={pt.y} r="35" fill="#ef4444" fillOpacity="0.15" filter="url(#glow-red)" />
                  <circle cx={pt.x} cy={pt.y} r="22" fill="#ef4444" fillOpacity="0.3">
                    <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="fillOpacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pt.x} cy={pt.y} r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x={pt.x} y={pt.y + 5} textAnchor="middle" fontSize="13" dominantBaseline="middle">🔥</text>
                  <text x={pt.x} y={pt.y + 26} textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">
                    {dis.name.slice(0, 20)}
                  </text>
                </g>
              );
            })}

            {/* Emergency Demands Markers (🟠) */}
            {layers.demands && demands.map((dem) => {
              if (dem.status === 'FULFILLED') return null;
              const pt = mapToCanvas(dem.coordinates.lat, dem.coordinates.lng);
              const isCritical = dem.priority === 'CRITICAL';
              return (
                <g
                  key={dem.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'demand', data: dem })}
                >
                  {isCritical && (
                    <circle cx={pt.x} cy={pt.y} r="24" fill="#f97316" fillOpacity="0.25">
                      <animate attributeName="r" values="20;28;20" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={pt.x} cy={pt.y} r="11" fill="#ea580c" stroke="#ffffff" strokeWidth="1.8" />
                  <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="10" dominantBaseline="middle">⚠</text>
                  <text x={pt.x} y={pt.y - 15} textAnchor="middle" fill="#fdba74" fontSize="10" fontWeight="bold">
                    {dem.requested_resource.slice(0, 10)}: {dem.quantity}
                  </text>
                </g>
              );
            })}

            {/* Active Vehicles / Convoys (🟣 Live Moving Marker) */}
            {layers.fleet && vehicles.map((v) => {
              const pt = mapToCanvas(v.current_coordinates.lat, v.current_coordinates.lng);
              const isTransit = v.status === 'IN_TRANSIT';
              return (
                <g
                  key={v.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'vehicle', data: v })}
                >
                  {isTransit && (
                    <circle cx={pt.x} cy={pt.y} r="22" fill="#8b5cf6" fillOpacity="0.35" filter="url(#glow-purple)">
                      <animate attributeName="fillOpacity" values="0.35;0.1;0.35" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={pt.x} cy={pt.y} r="13" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                  <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="12" dominantBaseline="middle">🚛</text>
                  <text x={pt.x} y={pt.y + 24} textAnchor="middle" fill="#d8b4fe" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {v.vehicle_number}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-md flex flex-wrap items-center gap-4 text-xs">
        <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500 border border-white"></span>
          <span className="text-slate-300">Disasters (🔴)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-orange-500 border border-white"></span>
          <span className="text-slate-300">Demands (🟠)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white"></span>
          <span className="text-slate-300">Warehouses (🟢)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-500 border border-white"></span>
          <span className="text-slate-300">Shelters (🔵)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-purple-500 border border-white"></span>
          <span className="text-slate-300">Live Vehicles (🟣)</span>
        </div>
      </div>

      {/* Selected Entity Popup Information Card */}
      <MapInfoCard
        selectedEntity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onAction={(action, payload) => {
          if (action === 'smart_match' && onSelectDemandForMatch) {
            onSelectDemandForMatch(payload.id);
          }
        }}
      />
    </div>
  );
};
