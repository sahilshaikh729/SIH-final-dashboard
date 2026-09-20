import React, { useState } from 'react';
import { Wifi, Radio, Code, Copy, Check, Terminal, Server, ShieldCheck, Database, Activity, Image as ImageIcon } from 'lucide-react';

export default function ReceiverStatus({ healthData, isConnected }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const serverIp = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '<YOUR-SERVER-IP>'
    : window.location.hostname;

  const wifiUrl = `http://${serverIp}:5000/api/events`;
  const loraUrl = `http://${serverIp}:5000/api/events/lora`;
  const imageUrl = `http://${serverIp}:5000/api/events/<EVENT_ID>/image`;

  const curlExample = `# Scenario A: Post full JSON event over Wi-Fi
curl -X POST "${wifiUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_id": "EVT-00125",
    "hazard": "fire",
    "confidence": 0.91,
    "priority": "HIGH",
    "latitude": 28.1610,
    "longitude": 85.3380,
    "altitude": 42.5,
    "timestamp": "2026-09-08T14:32:18Z"
  }'

# Scenario B: Attach image evidence later when Wi-Fi becomes available
curl -X POST "${imageUrl.replace('<EVENT_ID>', 'EVT-00125')}" \\
  -F "image=@/path/to/evidence.jpg"`;

  const pythonExample = `import requests
from datetime import datetime

# Scenario: Lightweight LoRa packet sent first over Serial/SiK radio bridge
lora_payload = {
    "event_id": "EVT-00125",
    "hazard": "fire",  # 0=flood, 1=smoke, 2=fire, 3=debris, 4=landslide, 5=person
    "confidence": 0.88,
    "priority": "HIGH",
    "latitude": 28.1610,
    "longitude": 85.3380,
    "altitude": 42.5,
    "timestamp": datetime.now().isoformat()
}

res = requests.post("${loraUrl}", json=lora_payload)
print("LoRa Telemetry Response:", res.status_code, res.json())

# Later when Wi-Fi connects, upload evidence image for the same event_id
with open("evidence.jpg", "rb") as img_file:
    res_img = requests.post("${imageUrl.replace('<EVENT_ID>', 'EVT-00125')}", files={"image": img_file})
    print("Wi-Fi Image Merge Response:", res_img.status_code, res_img.json())`;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Real System Connection Overview Card */}
      <div className="glass-panel p-6 border-cyan-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white">
                GROUND STATION COMMUNICATIONS & INGESTION CONTRACT
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Multi-channel communication bridge (Wi-Fi & LoRa/SiK) with communication-link agnostic event merging.
              </p>
            </div>
          </div>

          {/* Real System Connection Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className={`px-3 py-1 rounded border flex items-center gap-1.5 ${
              isConnected ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-red-950/80 text-red-400 border-red-800'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              <span>WS: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </div>
            
            <div className="px-3 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>DB: {healthData?.database?.status || 'CONNECTED'} ({healthData?.database?.total_events_stored || 0} events)</span>
            </div>
          </div>
        </div>

        {/* Triple Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* Wi-Fi Channel */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
                <Wifi className="w-4 h-4" /> WI-FI INGESTION
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-bold select-all overflow-x-auto">
              POST {wifiUrl}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              High bandwidth Wi-Fi link. Transmits telemetry JSON + optional multipart image file.
            </p>
          </div>

          {/* LoRa Channel */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <Radio className="w-4 h-4" /> LORA / SIK RADIO
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-slate-800 text-amber-300 font-bold select-all overflow-x-auto">
              POST {loraUrl}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Low bandwidth long-range serial radio bridge. Transmits lightweight telemetry metadata (no images).
            </p>
          </div>

          {/* Image Upload Channel */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 flex items-center gap-1.5 text-sm">
                <ImageIcon className="w-4 h-4" /> EVIDENCE ATTACHMENT
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-slate-800 text-purple-300 font-bold select-all overflow-x-auto">
              POST/PATCH {imageUrl}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Delayed Wi-Fi evidence attachment. Merges optical image to existing event without creating duplicate records.
            </p>
          </div>

        </div>

      </div>

      {/* Code Snippets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* cURL Example */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> WI-FI & IMAGE cURL CONTRACT
              </span>
              <button
                onClick={() => handleCopy(curlExample, 1)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              <code>{curlExample}</code>
            </pre>
          </div>
        </div>

        {/* Python Example */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-amber-400" /> LORA & DELAYED WI-FI MERGE (PYTHON)
              </span>
              <button
                onClick={() => handleCopy(pythonExample, 2)}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 2 ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
              <code>{pythonExample}</code>
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}

