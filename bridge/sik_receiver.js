/**
 * =============================================================================
 * SIH Disaster-Response Drone System - Person 2 Ground Station
 * SiK Telemetry Ground Radio Serial Receiver Script (Node.js)
 * =============================================================================
 * Flow:
 *   Serial COM port → receive one JSON line → parse JSON → validate → POST JSON
 *   to local Express backend → backend broadcasts it to dashboard.
 *
 * Environment Variables:
 *   SERIAL_PORT : Serial port name (Default: 'COM13' on Windows, '/dev/ttyUSB0' on Linux)
 *   BAUD_RATE   : Baud rate (Default: 57600)
 *   BACKEND_URL : Backend endpoint (Default: 'http://localhost:5000/api/events')
 */

const http = require('http');
const os = require('os');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const SERIAL_PORT_NAME = process.env.SERIAL_PORT || (os.platform() === 'win32' ? 'COM13' : '/dev/ttyUSB0');
const BAUD_RATE = parseInt(process.env.BAUD_RATE || '57600', 10);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/events';

console.log('=============================================================================');
console.log('📡 SIH DRONE GROUND STATION - SIK TELEMETRY GROUND RADIO RECEIVER');
console.log(`  Serial Port   : ${SERIAL_PORT_NAME}`);
console.log(`  Baud Rate     : ${BAUD_RATE}`);
console.log(`  Target Backend: ${BACKEND_URL}`);
console.log('=============================================================================\n');

function postToBackend(packet) {
  const payloadStr = JSON.stringify(packet);

  let parsedUrl;
  try {
    parsedUrl = new URL(BACKEND_URL);
  } catch (err) {
    console.error(`[BACKEND ERROR] Invalid BACKEND_URL (${BACKEND_URL}): ${err.message}`);
    return;
  }

  const reqOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadStr)
    }
  };

  const req = http.request(reqOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`[PACKET FORWARDED] Backend HTTP ${res.statusCode}: ${body}`);
      } else {
        console.error(`[BACKEND ERROR] Backend HTTP ${res.statusCode}: ${body}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`[BACKEND ERROR] Failed to send request to backend (${BACKEND_URL}): ${err.message}`);
  });

  req.write(payloadStr);
  req.end();
}

function processLine(lineStr) {
  const trimmedLine = lineStr.trim();
  if (!trimmedLine) return;

  console.log(`[PACKET RECEIVED] Raw input: ${trimmedLine}`);

  let packet;
  try {
    packet = JSON.parse(trimmedLine);
    console.log(`[PACKET PARSED] Valid JSON parsed successfully`);
  } catch (err) {
    console.error(`[MALFORMED PACKET] JSON parse failed: ${err.message}`);
    return;
  }

  // Validation: hazard, latitude and longitude must exist
  if (!packet.hazard || packet.latitude === undefined || packet.longitude === undefined) {
    console.warn(`[INVALID PAYLOAD] Missing required fields ('hazard', 'latitude', or 'longitude')`);
    return;
  }

  postToBackend(packet);
}

function startReceiver() {
  try {
    console.log(`Attempting to open serial port [${SERIAL_PORT_NAME}] at ${BAUD_RATE} baud...`);
    const port = new SerialPort({
      path: SERIAL_PORT_NAME,
      baudRate: BAUD_RATE
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
      console.log(`[RECEIVER CONNECTED] Connected to SiK radio on ${SERIAL_PORT_NAME} at ${BAUD_RATE} baud`);
    });

    parser.on('data', processLine);

    port.on('close', () => {
      console.log(`[RECEIVER ERROR] Serial port ${SERIAL_PORT_NAME} closed.`);
    });

    port.on('error', (err) => {
      console.error(`[RECEIVER ERROR] Serial port error on ${SERIAL_PORT_NAME}: ${err.message}`);
    });

  } catch (err) {
    console.error(`[RECEIVER ERROR] Failed to initialize serial port ${SERIAL_PORT_NAME}: ${err.message}`);
  }
}

startReceiver();
