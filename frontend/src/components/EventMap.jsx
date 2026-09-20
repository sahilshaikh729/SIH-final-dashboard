import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Eye, MapPin, Globe, Image, Search, Navigation } from 'lucide-react';
import { getHazardConfig, PRIORITY_CONFIG } from '../utils/hazardUtils';
import DroneMarker from './DroneMarker';
import { BorderTrail } from './core/border-trail';

/**
 * Custom DivIcon builder for map event markers with semantic colors and high-priority pulse
 */
function createCustomMarkerIcon(event, isSelected) {
  const hazard = (event.hazard || '').toLowerCase();
  const isPerson = hazard === 'person';
  const confPct = Math.round((event.confidence || 0) * 100);
  const isHighPrio = event.priority === 'HIGH';

  if (isPerson) {
    // Dedicated PERSON DETECTED Rescue Pin (Red/Coral Accent with Pulse)
    const html = `
      <div class="custom-person-pin ${isSelected ? 'selected-pin' : ''} ${isHighPrio ? 'pulse-red-ring' : ''}" style="
        display: flex;
        align-items: center;
        gap: 6px;
        background: ${isSelected ? '#b91c1c' : '#7f1d1d'};
        color: #fca5a5;
        border: 2px solid ${isSelected ? '#f87171' : '#ef4444'};
        border-radius: 16px;
        padding: 4px 10px;
        box-shadow: ${isSelected ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 4px 14px rgba(0,0,0,0.6)'};
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 11px;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>PERSON ${confPct}%</span>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-person-wrapper',
      html: html,
      iconSize: [115, 30],
      iconAnchor: [57, 15],
      popupAnchor: [0, -15]
    });
  }

  // Hazard Config Mapping (Semantic Color Standards)
  let markerBg = '#0c1b2a';
  let markerBorder = '#3b82f6';
  let markerColor = '#93c5fd';

  if (hazard === 'fire') {
    markerBg = '#7c2d12'; markerBorder = '#f97316'; markerColor = '#ffedd5';
  } else if (hazard === 'flood') {
    markerBg = '#164e63'; markerBorder = '#06b6d4'; markerColor = '#cffaffe';
  } else if (hazard === 'smoke') {
    markerBg = '#1e293b'; markerBorder = '#94a3b8'; markerColor = '#f1f5f9';
  } else if (hazard === 'landslide') {
    markerBg = '#78350f'; markerBorder = '#f59e0b'; markerColor = '#fef3c7';
  } else if (hazard === 'debris') {
    markerBg = '#1e3a8a'; markerBorder = '#3b82f6'; markerColor = '#dbeafe';
  }

  const html = `
    <div class="custom-map-marker ${isHighPrio ? 'pulse-red-ring' : ''}" style="
      background: ${markerBg};
      border: 2px solid ${isSelected ? '#ffffff' : markerBorder};
      color: ${markerColor};
      box-shadow: ${isSelected ? '0 0 16px ' + markerBorder : '0 4px 12px rgba(0,0,0,0.5)'};
      font-family: 'Inter', sans-serif;
    ">
      <div style="font-weight: 900; font-size: 11px;">
        ${hazard.charAt(0).toUpperCase()}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: html,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

/**
 * Intelligent collision offset helper to disperse close-proximity markers
 */
function applyCollisionOffsets(events) {
  const coordGroups = new Map();
  
  return events.map((evt) => {
    const roundedKey = `${evt.latitude?.toFixed(4)}_${evt.longitude?.toFixed(4)}`;
    const index = coordGroups.get(roundedKey) || 0;
    coordGroups.set(roundedKey, index + 1);

    if (index === 0) return evt;

    // Disperse markers radially (~20m spacing)
    const angle = (index * 60) * (Math.PI / 180);
    const radius = 0.00022 * index;
    const offsetLat = evt.latitude + radius * Math.sin(angle);
    const offsetLng = evt.longitude + radius * Math.cos(angle);

    return {
      ...evt,
      renderLatitude: offsetLat,
      renderLongitude: offsetLng
    };
  });
}

/**
 * Controller to auto-pan or fit bounds
 */
function MapAutoFit({ events, selectedEvent, mapFilter }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  useEffect(() => {
    if (selectedEvent && typeof selectedEvent.latitude === 'number' && typeof selectedEvent.longitude === 'number') {
      map.setView([selectedEvent.latitude, selectedEvent.longitude], 16, { animate: true });
      return;
    }
    if (events && events.length > 0) {
      const validCoords = events.filter(e => typeof e.latitude === 'number' && typeof e.longitude === 'number');
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords.map(e => [e.latitude, e.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true });
      }
    }
  }, [events.length, selectedEvent?.event_id, mapFilter]);
  return null;
}

export default function EventMap({ 
  events, 
  selectedEvent, 
  onSelectEvent, 
  mapFilter = 'ALL',
  onClearFilter,
  dronePosition = null,
  isOnline = true,
  isConnected = true
}) {
  const [mapViewMode, setMapViewMode] = useState('MAP'); // 'MAP' or 'SATELLITE'

  const filteredEvents = useMemo(() => {
    if (mapFilter === 'SINGLE_EVENT' && selectedEvent) {
      return events.filter(e => e.event_id === selectedEvent.event_id);
    }
    if (mapFilter === 'HIGH_PRIORITY') {
      return events.filter(e => e.priority === 'HIGH');
    }
    if (mapFilter === 'MEDIUM_PRIORITY') {
      return events.filter(e => e.priority === 'MEDIUM');
    }
    if (mapFilter === 'LOW_PRIORITY') {
      return events.filter(e => e.priority === 'LOW');
    }
    if (mapFilter && mapFilter !== 'ALL') {
      return events.filter(e => (e.hazard || '').toLowerCase() === mapFilter.toLowerCase());
    }
    return events;
  }, [events, mapFilter, selectedEvent]);

  // Group events by hazard category and limit map visualization to max 5 latest per category
  const mapCappedEvents = useMemo(() => {
    if (!filteredEvents || filteredEvents.length === 0) return [];

    if (mapFilter === 'SINGLE_EVENT' && selectedEvent) {
      return filteredEvents;
    }

    const categoryGroups = new Map();

    filteredEvents.forEach(evt => {
      const category = (evt.hazard || 'other').toLowerCase();
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }
      categoryGroups.get(category).push(evt);
    });

    const selectedEvents = [];
    const MAX_PER_CATEGORY = 5;

    categoryGroups.forEach((groupEvents) => {
      const sortedGroup = [...groupEvents].sort((a, b) => {
        const aActive = a.status !== 'RESOLVED' ? 1 : 0;
        const bActive = b.status !== 'RESOLVED' ? 1 : 0;
        if (aActive !== bActive) return bActive - aActive;

        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        if (timeA !== timeB) return timeB - timeA;

        return String(b.event_id || '').localeCompare(String(a.event_id || ''));
      });

      const top5 = sortedGroup.slice(0, MAX_PER_CATEGORY);
      selectedEvents.push(...top5);
    });

    if (selectedEvent && filteredEvents.some(e => e.event_id === selectedEvent.event_id)) {
      const alreadyIncluded = selectedEvents.some(e => e.event_id === selectedEvent.event_id);
      if (!alreadyIncluded) {
        selectedEvents.push(selectedEvent);
      }
    }

    return selectedEvents;
  }, [filteredEvents, selectedEvent, mapFilter]);

  const renderEvents = useMemo(() => applyCollisionOffsets(mapCappedEvents), [mapCappedEvents]);

  const defaultCenter = selectedEvent && typeof selectedEvent.latitude === 'number' 
    ? [selectedEvent.latitude, selectedEvent.longitude] 
    : (dronePosition ? [dronePosition.latitude, dronePosition.longitude] : [28.1610, 85.3380]);
  
  const mapRef = useRef(null);

  let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  let tileAttribution = '&copy; OpenStreetMap & CartoDB';
  let maxNativeZoom = 19;

  if (mapViewMode === 'SATELLITE') {
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    tileAttribution = 'Tiles &copy; Esri';
    maxNativeZoom = 18;
  }

  return (
    <div className="glass-panel h-full flex flex-col relative overflow-hidden font-sans select-none shadow-2xl min-w-0">
      
      {/* Animated Glowing Light Border Trail */}
      <BorderTrail
        className="bg-gradient-to-l from-cyan-300 via-blue-500 to-cyan-300 shadow-[0_0_15px_#06b6d4]"
        size={140}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'linear',
        }}
      />

      {/* Map Panel Header Toolbar */}
      <div className="flex items-center justify-between font-display flex-wrap gap-2 py-2.5 px-3.5 bg-[#111927]/90 border-b border-white/8 z-20 min-w-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <MapPin className="w-4 h-4 text-[#22d3ee] shrink-0" />
          <h2 className="text-[11px] xl:text-xs font-display font-semibold uppercase tracking-wider text-[#f2f5f8] truncate">
            LIVE MISSION MAP
          </h2>

          {/* Active Filter Indicator Badge */}
          {mapFilter && mapFilter !== 'ALL' && (
            <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#22d3ee] shrink-0 whitespace-nowrap">
              <span>FILTER: {mapFilter === 'SINGLE_EVENT' ? `ISOLATED (${selectedEvent?.event_id || 'EVENT'})` : mapFilter.toUpperCase()} ({renderEvents.length} MARKERS)</span>
              {onClearFilter && (
                <button
                  onClick={onClearFilter}
                  className="ml-1 text-[#22d3ee] hover:text-white underline cursor-pointer"
                >
                  [ SHOW ALL ]
                </button>
              )}
            </div>
          )}

          {mapFilter === 'ALL' && (
            <span className="text-[10px] text-[#22d3ee] bg-[#141e2c] border border-white/8 px-2.5 py-0.5 rounded-full font-mono font-bold shadow-sm shrink-0 whitespace-nowrap">
              MAP MARKERS: {renderEvents.length} (MAX 5/CAT) · TOTAL: {events.length}
            </span>
          )}
        </div>
        
        {/* Switchers & Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          
          {/* Layer Switcher */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-display font-semibold shrink-0">
            <button
              onClick={() => setMapViewMode('MAP')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                mapViewMode === 'MAP'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" /> MAP
            </button>
            <button
              onClick={() => setMapViewMode('SATELLITE')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                mapViewMode === 'SATELLITE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Image className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" /> SATELLITE
            </button>
          </div>

          {/* Quick Target Focus Buttons */}
          <button
            onClick={() => onSelectEvent && events[0] && onSelectEvent(events[0])}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-display font-semibold text-slate-200 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>🚁 DRONE</span>
          </button>
          <button
            onClick={() => {
              const personEvt = events.find(e => (e.hazard || '').toLowerCase() === 'person');
              if (personEvt && onSelectEvent) onSelectEvent(personEvt);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-[11px] font-display font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>👤 PERSON</span>
          </button>

        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 w-full min-h-0 relative overflow-hidden z-10">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            key={mapViewMode}
            attribution={tileAttribution}
            url={tileUrl}
            maxNativeZoom={maxNativeZoom}
            maxZoom={20}
          />

          <MapAutoFit events={renderEvents} selectedEvent={selectedEvent} mapFilter={mapFilter} />

          {/* Live Animated Drone GPS Marker */}
          {dronePosition && typeof dronePosition.latitude === 'number' && typeof dronePosition.longitude === 'number' && (
            <DroneMarker dronePosition={dronePosition} isConnected={isConnected} />
          )}

          {/* Event Detections Markers */}
          {renderEvents.map((evt) => {
            const isSelected = selectedEvent && selectedEvent.event_id === evt.event_id;
            const lat = evt.renderLatitude || evt.latitude;
            const lng = evt.renderLongitude || evt.longitude;

            return (
              <Marker
                key={evt.event_id}
                position={[lat, lng]}
                icon={createCustomMarkerIcon(evt, isSelected)}
                eventHandlers={{
                  click: () => onSelectEvent(evt)
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-slate-200 text-xs space-y-1.5 min-w-[210px]">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                      <span className="font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {(evt.hazard || 'PERSON').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                        {evt.event_id}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Confidence:</span>
                        <span className="font-bold text-cyan-300">{(evt.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Priority:</span>
                        <span className={`font-bold ${evt.priority === 'HIGH' ? 'text-red-400' : evt.priority === 'MEDIUM' ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {evt.priority || 'NORMAL'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Time:</span>
                        <span className="text-slate-200">{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" /> INSPECT EVIDENCE
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
