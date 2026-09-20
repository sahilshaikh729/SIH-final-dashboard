import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Radio, BatteryCharging, Gauge, ArrowUp, Cpu } from 'lucide-react';

/**
 * Custom DivIcon Builder for realistic professional drone marker
 */
function buildDroneDivIcon(heading, isConnected, droneId, altitude, speed) {
  const statusColor = isConnected ? '#10b981' : '#ef4444';
  const statusText = isConnected ? 'ONLINE' : 'OFFLINE';

  const svgDrone = `
    <div class="drone-marker-container">
      <div class="drone-hover-wrapper">
        <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease; width: 44px; height: 44px; position: relative; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 100 100" width="44" height="44" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.8));">
            <!-- Drone Frame Arms -->
            <line x1="22" y1="22" x2="78" y2="78" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
            <line x1="78" y1="22" x2="22" y2="78" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
            <line x1="22" y1="22" x2="78" y2="78" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="78" y1="22" x2="22" y2="78" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>

            <!-- 4 Propeller Guards & Blades -->
            <!-- Top-Left Rotor -->
            <g transform="translate(22,22)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
              <g class="drone-propeller-blade">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#60a5fa" stroke-width="2" opacity="0.85" stroke-linecap="round"/>
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
              </g>
              <circle cx="0" cy="0" r="3" fill="#3b82f6"/>
            </g>

            <!-- Top-Right Rotor -->
            <g transform="translate(78,22)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
              <g class="drone-propeller-blade">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#60a5fa" stroke-width="2" opacity="0.85" stroke-linecap="round"/>
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
              </g>
              <circle cx="0" cy="0" r="3" fill="#3b82f6"/>
            </g>

            <!-- Bottom-Left Rotor -->
            <g transform="translate(22,78)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
              <g class="drone-propeller-blade">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#60a5fa" stroke-width="2" opacity="0.85" stroke-linecap="round"/>
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
              </g>
              <circle cx="0" cy="0" r="3" fill="#3b82f6"/>
            </g>

            <!-- Bottom-Right Rotor -->
            <g transform="translate(78,78)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
              <g class="drone-propeller-blade">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#60a5fa" stroke-width="2" opacity="0.85" stroke-linecap="round"/>
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
              </g>
              <circle cx="0" cy="0" r="3" fill="#3b82f6"/>
            </g>

            <!-- Central Chassis Body -->
            <polygon points="50,26 68,44 68,64 50,74 32,64 32,44" fill="#090d16" stroke="#3b82f6" stroke-width="2"/>
            
            <!-- Nose Direction Pointer -->
            <polygon points="50,22 56,32 44,32" fill="#60a5fa"/>

            <!-- Central LED Status Beacon -->
            <circle cx="50" cy="50" r="4.5" fill="${statusColor}" class="drone-led-beacon"/>
          </svg>
        </div>

        <!-- Attached Telemetry Pill Label -->
        <div style="
          position: absolute;
          bottom: -18px;
          background: rgba(11, 16, 26, 0.92);
          backdrop-filter: blur(4px);
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #1e293b;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="width: 5px; height: 5px; border-radius: 50%; background: ${statusColor}; display: inline-block;"></span>
          <span style="color: #93c5fd;">${droneId}</span>
          <span style="color: #64748b;">|</span>
          <span style="color: #cbd5e1;">${altitude.toFixed(0)}m</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-drone-marker',
    html: svgDrone,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    popupAnchor: [0, -26]
  });
}

/**
 * Modular DroneMarker Component
 * Animates position smoothly using lerp interpolation, draws flight path trail, and displays interaction popup.
 */
export default function DroneMarker({ dronePosition, isConnected = true }) {
  const targetLat = dronePosition?.latitude ?? 28.1610;
  const targetLng = dronePosition?.longitude ?? 85.3380;
  const targetHeading = dronePosition?.heading ?? 0;
  const altitude = dronePosition?.altitude ?? 45.0;
  const speed = dronePosition?.speed ?? 12.4;
  const battery = dronePosition?.battery ?? 88;
  const droneId = dronePosition?.id || 'SIH-DRONE-01';

  // Smooth position interpolation state
  const [currentPos, setCurrentPos] = useState([targetLat, targetLng]);
  const [currentHeading, setCurrentHeading] = useState(targetHeading);

  // Historical flight path trail
  const [flightPath, setFlightPath] = useState([[targetLat, targetLng]]);

  const animFrameRef = useRef(null);
  const prevTargetRef = useRef([targetLat, targetLng]);

  // Update target coordinates and interpolate position smoothly
  useEffect(() => {
    const prevLat = prevTargetRef.current[0];
    const prevLng = prevTargetRef.current[1];

    // If target position hasn't changed, retain current position
    if (prevLat === targetLat && prevLng === targetLng) {
      return;
    }

    // Append new target position to historical flight path trail (max 50 points)
    setFlightPath((prev) => {
      const lastPoint = prev[prev.length - 1];
      if (lastPoint && lastPoint[0] === targetLat && lastPoint[1] === targetLng) {
        return prev;
      }
      const updated = [...prev, [targetLat, targetLng]];
      return updated.slice(-50);
    });

    // Compute direction heading if heading is 0 or static
    let calcHeading = targetHeading;
    const dLat = targetLat - prevLat;
    const dLng = targetLng - prevLng;
    if (Math.abs(dLat) > 0.00001 || Math.abs(dLng) > 0.00001) {
      const angleDeg = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      calcHeading = (angleDeg + 360) % 360;
    }

    prevTargetRef.current = [targetLat, targetLng];

    // Lerp Animation loop (1.2s duration)
    const startTime = performance.now();
    const duration = 1200; // ms
    const startLat = currentPos[0];
    const startLng = currentPos[1];

    const animateStep = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Smooth ease-out quad curve
      const ease = 1 - (1 - progress) * (1 - progress);

      const nextLat = startLat + (targetLat - startLat) * ease;
      const nextLng = startLng + (targetLng - startLng) * ease;

      setCurrentPos([nextLat, nextLng]);
      setCurrentHeading(calcHeading);

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animateStep);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateStep);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetLat, targetLng, targetHeading]);

  const markerIcon = buildDroneDivIcon(currentHeading, isConnected, droneId, altitude, speed);

  return (
    <>
      {/* Subtle Historical Flight Trail Line */}
      {flightPath.length > 1 && (
        <Polyline
          positions={flightPath}
          pathOptions={{
            color: '#3b82f6',
            weight: 2.5,
            opacity: 0.65,
            dashArray: '4, 6',
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />
      )}

      {/* Smoothly Animated Live Drone Marker */}
      <Marker position={currentPos} icon={markerIcon}>
        <Popup>
          <div className="drone-popup-card p-1 text-slate-100 text-xs font-sans">
            
            {/* Header: Drone ID & Live Status */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-100">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>{droneId}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                isConnected 
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400' 
                  : 'bg-rose-950/80 border border-rose-800 text-rose-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {/* Structured Telemetry Metrics Grid */}
            <div className="space-y-1.5 text-[11px]">
              
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-slate-400" /> Latitude:
                </span>
                <span className="font-mono font-semibold text-slate-100">{currentPos[0].toFixed(5)}°</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 stroke-slate-400" style={{ transform: 'rotate(90deg)' }} /> Longitude:
                </span>
                <span className="font-mono font-semibold text-slate-100">{currentPos[1].toFixed(5)}°</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-slate-400" /> Altitude:
                </span>
                <span className="font-mono font-semibold text-blue-400">{altitude.toFixed(1)} m</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-slate-400" /> Speed:
                </span>
                <span className="font-mono font-semibold text-emerald-400">{speed.toFixed(1)} m/s</span>
              </div>

              {/* Battery Level Status */}
              <div className="pt-1.5 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Battery:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{battery}%</span>
                </div>
                <div className="w-full bg-slate-900 border border-slate-700/70 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, battery))}%` }}
                  />
                </div>
              </div>

            </div>

          </div>
        </Popup>
      </Marker>
    </>
  );
}
