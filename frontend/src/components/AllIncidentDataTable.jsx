import React, { useState } from 'react';
import { 
  Table, 
  Search, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Flame, 
  Waves, 
  Wind, 
  Mountain, 
  Package, 
  Filter, 
  Calendar, 
  Download, 
  ImageIcon, 
  MoreVertical 
} from 'lucide-react';

function getHazardIcon(hazard) {
  const h = (hazard || '').toLowerCase();
  switch (h) {
    case 'person': return User;
    case 'fire': return Flame;
    case 'flood': return Waves;
    case 'smoke': return Wind;
    case 'landslide': return Mountain;
    case 'debris': return Package;
    default: return AlertTriangle;
  }
}

function getHazardColor(hazard) {
  const h = (hazard || '').toLowerCase();
  switch (h) {
    case 'person': return 'text-red-400';
    case 'fire': return 'text-orange-400';
    case 'flood': return 'text-cyan-400';
    case 'smoke': return 'text-slate-400';
    case 'landslide': return 'text-amber-400';
    case 'debris': return 'text-blue-400';
    default: return 'text-cyan-400';
  }
}

export default function AllIncidentDataTable({ 
  events = [], 
  selectedEvent, 
  onSelectEvent, 
  onInspectEvidence,
  onResolveEvent 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      !searchTerm ||
      evt.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.hazard || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.priority || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'UNRESOLVED' && evt.status !== 'RESOLVED') ||
      (statusFilter === 'RESOLVED' && evt.status === 'RESOLVED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-panel p-3.5 shadow-lg font-sans text-slate-200 select-none min-w-0">
      {/* Header & Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2.5 border-b border-white/8 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Table className="w-4 h-4 text-[#22d3ee] shrink-0" />
          <h2 className="text-[11px] xl:text-xs font-display font-semibold uppercase tracking-wider text-[#f2f5f8] truncate">
            ALL INCIDENT RECORDS ({events.length} TOTAL)
          </h2>
        </div>

        {/* Controls: Search, Filters, Date, Export */}
        <div className="flex items-center gap-2 flex-wrap text-xs shrink-0 font-display">
          
          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-[#8d99a8] absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search ID, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#141e2c] border border-white/8 rounded-xl pl-7 pr-2.5 py-1 text-xs text-[#f2f5f8] placeholder-[#8d99a8] focus:outline-none focus:border-[#22d3ee]/60 w-36 sm:w-44 transition-colors font-mono"
            />
          </div>

          {/* Filters Button */}
          <button 
            onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'UNRESOLVED' : statusFilter === 'UNRESOLVED' ? 'RESOLVED' : 'ALL')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141e2c] hover:bg-[#182231] border border-white/8 text-xs font-display font-semibold text-[#f2f5f8] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Filter className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" />
            <span>Filter ({statusFilter})</span>
          </button>

          {/* Date Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141e2c] border border-white/8 text-xs font-display font-semibold text-[#f2f5f8] shrink-0 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" />
            <span>Today</span>
          </div>

          {/* Export Button */}
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `incident_records_${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-display font-bold border border-blue-400/40 transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Export</span>
          </button>

        </div>
      </div>

      {/* Incident Records Table Container */}
      <div className="overflow-x-auto max-h-[290px] w-full mt-2">
        <table className="w-full text-left border-collapse text-xs font-sans whitespace-nowrap">
          <thead className="bg-[#0f1724]/95 text-[#8d99a8] text-[10px] uppercase font-display font-semibold tracking-wider sticky top-0 z-10 border-b border-white/8">
            <tr>
              <th className="px-3 py-2 font-mono">ID</th>
              <th className="px-3 py-2 font-display">TYPE</th>
              <th className="px-3 py-2 font-display">PRIORITY</th>
              <th className="px-3 py-2 font-mono">CONFIDENCE</th>
              <th className="px-3 py-2 font-mono">TIMESTAMP</th>
              <th className="px-3 py-2 font-mono">LATITUDE</th>
              <th className="px-3 py-2 font-mono">LONGITUDE</th>
              <th className="px-3 py-2 font-display">STATUS</th>
              <th className="px-3 py-2 text-center">EVIDENCE</th>
              <th className="px-3 py-2 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-8 text-slate-400 text-xs italic font-sans">
                  No incident records matching criteria.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEvent && selectedEvent.event_id === evt.event_id;
                const isResolved = evt.status === 'RESOLVED';
                const Icon = getHazardIcon(evt.hazard);
                const confPct = Math.round((evt.confidence || 0) * 100);
                const timeStr = evt.timestamp 
                  ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                  : 'N/A';

                return (
                  <tr
                    key={evt.event_id}
                    onClick={() => onSelectEvent(evt)}
                    className={`transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-500/20 text-white font-bold'
                        : isResolved
                        ? 'bg-white/2 text-slate-400 hover:bg-white/5'
                        : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    {/* ID */}
                    <td className="px-3 py-2 font-mono font-bold text-slate-200">
                      {evt.event_id}
                    </td>

                    {/* TYPE */}
                    <td className="px-3 py-2 font-sans font-bold">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${getHazardColor(evt.hazard)}`} />
                        <span className="uppercase">{evt.hazard}</span>
                      </div>
                    </td>

                    {/* PRIORITY */}
                    <td className="px-3 py-2 font-sans">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase font-mono border ${
                        evt.priority === 'HIGH' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : evt.priority === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {evt.priority}
                      </span>
                    </td>

                    {/* CONFIDENCE */}
                    <td className="px-3 py-2 font-mono font-bold text-slate-100">
                      {confPct}%
                    </td>

                    {/* TIMESTAMP */}
                    <td className="px-3 py-2 text-slate-300 font-mono">
                      {timeStr}
                    </td>

                    {/* LATITUDE */}
                    <td className="px-3 py-2 font-mono text-slate-300">
                      {evt.latitude?.toFixed(5)}°
                    </td>

                    {/* LONGITUDE */}
                    <td className="px-3 py-2 font-mono text-slate-300">
                      {evt.longitude?.toFixed(5)}°
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-2 font-sans">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase border ${
                        isResolved
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                      }`}>
                        {evt.status || 'UNRESOLVED'}
                      </span>
                    </td>

                    {/* EVIDENCE */}
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectEvidence(evt);
                        }}
                        className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="View evidence lightbox"
                      >
                        <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </td>

                    {/* ACTION */}
                    <td className="px-3 py-2 text-right font-sans">
                      <div className="flex items-center justify-end gap-1">
                        {!isResolved && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResolveEvent(evt.event_id);
                            }}
                            className="px-2 py-0.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold border border-emerald-600 transition-colors cursor-pointer shrink-0"
                          >
                            RESOLVE
                          </button>
                        )}
                        <button className="p-1 rounded-md hover:bg-slate-800 text-slate-400 shrink-0">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
