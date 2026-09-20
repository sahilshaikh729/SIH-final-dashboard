import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  BatteryCharging, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Compass, 
  Activity, 
  MapPin, 
  Gauge, 
  Zap, 
  ShieldAlert, 
  ArrowLeft,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import DroneMarker from './DroneMarker';
import { BorderTrail } from './core/border-trail';

export default function DroneMonitor({
  dronePosition = null,
  isConnected = true,
  isOnline = true,
  onBackToOverview = null
}) {
  const [timeStr, setTimeStr] = useState('');
  const [mapViewMode, setMapViewMode] = useState('STANDARD'); // 'STANDARD' or 'SATELLITE'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const altitude = dronePosition?.altitude ? dronePosition.altitude.toFixed(1) : '45.0';
  const speed = dronePosition?.speed ? dronePosition.speed.toFixed(1) : '12.4';
  const heading = dronePosition?.heading || 45;
  const batteryPct = dronePosition?.battery || 88;
  const lat = dronePosition?.latitude ? dronePosition.latitude.toFixed(5) : '28.16100';
  const lng = dronePosition?.longitude ? dronePosition.longitude.toFixed(5) : '85.33800';

  const defaultCenter = [
    dronePosition?.latitude || 28.1610,
    dronePosition?.longitude || 85.3380
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto px-5 py-2 flex flex-col gap-4 font-sans select-none animate-[hero-fade-in_0.4s_ease-out]">
      
      {/* 1. PAGE HEADER BAR */}
      <div className="glass-panel p-4 flex items-center justify-between flex-wrap gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/12 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>OVERVIEW</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h1 className="text-base font-black uppercase tracking-wider text-slate-100">
                DRONE MONITOR
              </h1>
            </div>
            <p className="text-[11px] font-mono font-bold tracking-widest text-cyan-400/90 uppercase mt-0.5">
              DRONE-01 · AUTONOMOUS RESPONSE UAV
            </p>
          </div>
        </div>

        {/* Live System Connection Pill & Clock */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono font-bold text-slate-200">{timeStr}</div>
            <div className="text-[10px] text-slate-400 font-sans">TELEMETRY STREAM</div>
          </div>

          <div className="px-3 py-1.5 rounded-full status-pill-online text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-400'}`} />
            <span>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
        </div>
      </div>

      {/* 2. CORE TELEMETRY GRID: [ DRONE VISUAL + REAL-TIME TELEMETRY ] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 5 Cols: Prominent Central Drone Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px] shadow-2xl">
            {/* Ambient Cyan Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Rotating Telemetry Ring */}
            <div className="absolute w-72 h-72 border border-cyan-400/15 rounded-full animate-[drone-prop-spin_20s_linear_infinite] pointer-events-none" />

            {/* Drone Visual */}
            <div className="drone-hover-wrapper z-10 my-auto">
              <img 
                src="/hero_drone.jpg" 
                alt="SIH Drone-01 Response UAV" 
                className="w-72 h-auto max-h-[250px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Drone Identity & Status */}
            <div className="z-10 text-center space-y-1 mt-4">
              <div className="text-xs font-mono font-bold tracking-[0.3em] text-cyan-400 uppercase">
                AEGIS QUADCOPTER UAV
              </div>
              <div className="text-sm font-black tracking-wider text-slate-100 uppercase">
                SIH-AEGIS-01
              </div>
            </div>

            {/* Corner Status Indicators */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              ALT: <span className="text-slate-100 font-bold">{altitude}m</span>
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              SPD: <span className="text-cyan-300 font-bold">{speed} km/h</span>
            </div>
          </div>

          {/* Compass / Heading Dial Card */}
          <div className="glass-panel p-4 space-y-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                  HEADING & COMPASS
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">{heading}°</span>
            </div>

            <div className="flex items-center justify-around py-2">
              {/* Visual Compass Rose */}
              <div className="relative w-24 h-24 rounded-full border border-cyan-400/30 bg-black/30 flex items-center justify-center">
                <span className="absolute top-1 text-[10px] font-mono font-bold text-cyan-400">N</span>
                <span className="absolute bottom-1 text-[10px] font-mono font-bold text-slate-400">S</span>
                <span className="absolute left-1.5 text-[10px] font-mono font-bold text-slate-400">W</span>
                <span className="absolute right-1.5 text-[10px] font-mono font-bold text-slate-400">E</span>
                
                {/* Rotating Compass Needle */}
                <div 
                  className="w-1 h-16 bg-gradient-to-t from-transparent via-cyan-400 to-red-500 rounded-full transition-transform duration-500"
                  style={{ transform: `rotate(${heading}deg)` }}
                />
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 font-sans text-xs">Heading:</span>
                  <span className="text-slate-100 font-bold">{heading}°</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 font-sans text-xs">Vertical Speed:</span>
                  <span className="text-slate-400 font-bold">N/A</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 font-sans text-xs">Dist. Home:</span>
                  <span className="text-slate-400 font-bold">N/A</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 7 Cols: Primary Live Telemetry Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Top 4 Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Battery */}
            <div className="glass-panel p-3.5 space-y-1 hover:bg-white/6 transition-all shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>BATTERY</span>
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">{batteryPct}%</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${batteryPct}%` }} />
              </div>
            </div>

            {/* Altitude */}
            <div className="glass-panel p-3.5 space-y-1 hover:bg-white/6 transition-all shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>ALTITUDE</span>
                <Navigation className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono text-cyan-300">{altitude} m</div>
              <div className="text-[10px] text-slate-400 font-sans">AGL Flight Level</div>
            </div>

            {/* Speed */}
            <div className="glass-panel p-3.5 space-y-1 hover:bg-white/6 transition-all shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>SPEED</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black font-mono text-blue-300">{speed} km/h</div>
              <div className="text-[10px] text-slate-400 font-sans">Ground Velocity</div>
            </div>

            {/* Flight Time */}
            <div className="glass-panel p-3.5 space-y-1 hover:bg-white/6 transition-all shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>FLIGHT TIME</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-300">00:04:25</div>
              <div className="text-[10px] text-slate-400 font-sans">Active Mission</div>
            </div>

          </div>

          {/* Battery Detailed Specs Glass Card */}
          <div className="glass-panel p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                  BATTERY POWER SYSTEM
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                HEALTHY ({batteryPct}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Voltage:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Current:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Power Consumption:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Temperature:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
            </div>
          </div>

          {/* GPS Telemetry & Satellite Data Glass Card */}
          <div className="glass-panel p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                  GPS POSITIONING TELEMETRY
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                3D LOCK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Latitude:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{lat}°</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Longitude:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{lng}°</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">Satellites:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-400 font-sans">HDOP:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">N/A</div>
              </div>
            </div>
          </div>

          {/* System Connection Link Status Glass Panel */}
          <div className="glass-panel p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                  SYSTEM CONNECTION LINKS
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-white/4 border border-white/8 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-sans">DRONE:</span>
                <span className="text-emerald-400 font-bold mt-1">{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/4 border border-white/8 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-sans">SiK LINK:</span>
                <span className="text-cyan-400 font-bold mt-1">READY</span>
              </div>
              <div className="p-2 rounded-xl bg-white/4 border border-white/8 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-sans">GPS:</span>
                <span className="text-slate-100 font-bold mt-1">3D LOCK</span>
              </div>
              <div className="p-2 rounded-xl bg-white/4 border border-white/8 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-sans">BACKEND:</span>
                <span className="text-emerald-400 font-bold mt-1">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/4 border border-white/8 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-sans">WEBSOCKET:</span>
                <span className="text-cyan-300 font-bold mt-1">{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. LIVE DRONE MAP WORKSPACE */}
      <div className="glass-panel h-[400px] flex flex-col overflow-hidden relative shadow-2xl">
        <BorderTrail
          className="bg-gradient-to-l from-cyan-300 via-blue-500 to-cyan-300 shadow-[0_0_15px_#06b6d4]"
          size={140}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'linear',
          }}
        />
        <div className="flex items-center justify-between p-3.5 bg-[#0a1322]/80 border-b border-white/10 z-20 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
              DRONE-01 LIVE POSITION MAP
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Map Layer Switcher Control */}
            <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-display font-semibold">
              <button
                onClick={() => setMapViewMode('STANDARD')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  mapViewMode === 'STANDARD'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Standard Map
              </button>
              <button
                onClick={() => setMapViewMode('SATELLITE')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  mapViewMode === 'SATELLITE'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Satellite
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
              LAT: {lat}° · LNG: {lng}°
            </span>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0 relative z-10">
          <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              key={mapViewMode}
              attribution={mapViewMode === 'SATELLITE' ? 'Tiles &copy; Esri' : '&copy; OpenStreetMap & CartoDB'}
              url={
                mapViewMode === 'SATELLITE'
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              }
              maxNativeZoom={mapViewMode === 'SATELLITE' ? 18 : 19}
              maxZoom={20}
            />
            {dronePosition && typeof dronePosition.latitude === 'number' && typeof dronePosition.longitude === 'number' && (
              <DroneMarker dronePosition={dronePosition} isConnected={isConnected} />
            )}
          </MapContainer>
        </div>
      </div>

    </div>
  );
}
