import React from 'react';
import { Database, Server, Wifi, Cpu, Clock, Activity } from 'lucide-react';

export default function SystemStatusBar({ isConnected, stats, lastUpdate }) {
  const totalEvents = stats?.total_events || 0;
  const formattedLastUpdate = lastUpdate
    ? new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'STANDBY';

  return (
    <div className="bg-[#070a10] border-t border-slate-800/90 px-4 py-1.5 font-sans text-[11px] text-slate-400 select-none">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Status Pills Group */}
        <div className="flex flex-wrap items-center gap-3.5">
          
          {/* API Status */}
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">API:</span>
            <span className="text-slate-200 font-semibold font-mono">ONLINE (:5000)</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* RPi Connection Listener */}
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">PI CONSUMER:</span>
            <span className="text-slate-200 font-semibold font-mono">LISTENING</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* Database */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">DB:</span>
            <span className="text-slate-200 font-semibold font-mono">SQLITE (ACTIVE)</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* WebSocket */}
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">WS:</span>
            <span className={isConnected ? 'text-emerald-400 font-semibold font-mono' : 'text-red-400 font-semibold font-mono'}>
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

        </div>

        {/* Live Stream Metrics & Last Update */}
        <div className="flex items-center gap-3.5">
          
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">EVENTS:</span>
            <span className="text-slate-200 font-semibold font-mono">{totalEvents} STORED</span>
          </div>

          <span className="text-slate-700">•</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium font-sans">LAST SYNC:</span>
            <span className="text-slate-200 font-semibold font-mono">{formattedLastUpdate}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
