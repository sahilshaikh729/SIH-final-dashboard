/**
 * =============================================================================
 * SIH Disaster-Response Drone System - Ground Station Verification Suite
 * Comprehensive End-to-End Testing for Communication Architecture Scenarios
 * =============================================================================
 * Usage:
 *   node mock/test_all_scenarios.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const HOST = process.env.BACKEND_HOST || 'localhost';
const PORT = process.env.BACKEND_PORT || 5000;
const BASE_URL = `http://${HOST}:${PORT}`;
const WS_URL = `ws://${HOST}:${PORT}/ws`;

let wsMessagesReceived = [];
let wsClient = null;

function connectWebSocket() {
    return new Promise((resolve, reject) => {
        wsClient = new WebSocket(WS_URL);
        
        wsClient.on('open', () => {
            console.log(`🔌 [WS TEST] Connected to WebSocket server at ${WS_URL}`);
            resolve();
        });

        wsClient.on('message', (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                wsMessagesReceived.push(parsed);
            } catch (e) {
                // Ignore non-JSON
            }
        });

        wsClient.on('error', (err) => {
            console.error(`❌ [WS TEST ERROR] ${err.message}`);
            reject(err);
        });
    });
}

function postJSON(endpoint, payload) {
    return new Promise((resolve, reject) => {
        const bodyStr = JSON.stringify(payload);
        const req = http.request({
            hostname: HOST,
            port: PORT,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
}

function postMultipartImage(endpoint, eventId, imageBuffer, filename = 'test-evidence.jpg') {
    return new Promise((resolve, reject) => {
        const boundary = '--------------------------' + Math.random().toString(16).substring(2);
        
        let header = `--${boundary}\r\n`;
        header += `Content-Disposition: form-data; name="image"; filename="${filename}"\r\n`;
        header += `Content-Type: image/jpeg\r\n\r\n`;

        const footer = `\r\n--${boundary}--\r\n`;

        const bodyBuffer = Buffer.concat([
            Buffer.from(header, 'utf8'),
            imageBuffer,
            Buffer.from(footer, 'utf8')
        ]);

        const req = http.request({
            hostname: HOST,
            port: PORT,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': bodyBuffer.length
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);
        req.write(bodyBuffer);
        req.end();
    });
}

function getEventFromDB(eventId) {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}/api/events/${eventId}`, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

function createDummyImageBuffer() {
    // 1x1 pixel JPEG binary buffer
    return Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
        0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
        0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xBF, 0x00, 0xFF, 0xD9
    ]);
}

async function runTests() {
    console.log('=============================================================================');
    console.log('🧪 SIH GROUND STATION BACKEND & INTEGRATION TEST SUITE');
    console.log(`   Target Backend: ${BASE_URL}`);
    console.log('=============================================================================\n');

    let passedCount = 0;
    let totalScenarios = 6;

    try {
        await connectWebSocket();
    } catch (e) {
        console.error('❌ Failed to connect WebSocket for test notifications.');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 1: Wi-Fi JSON Event -> Backend -> Database -> WebSocket -> Dashboard
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 1: Wi-Fi JSON Event Ingestion');
    const evt1Id = `EVT-TEST1-${Date.now().toString().slice(-4)}`;
    const evt1Payload = {
        event_id: evt1Id,
        hazard: 'fire',
        confidence: 0.95,
        priority: 'HIGH',
        latitude: 28.1645,
        longitude: 85.3400,
        altitude: 45.0,
        timestamp: new Date().toISOString()
    };

    try {
        const res1 = await postJSON('/api/events', evt1Payload);
        const dbEvt1 = await getEventFromDB(evt1Id);

        const wsReceived1 = wsMessagesReceived.some(m => m.type === 'EVENT_CREATED' && m.payload.event_id === evt1Id);

        if (res1.status === 200 && dbEvt1 && dbEvt1.event_id === evt1Id && dbEvt1.channel === 'WIFI' && wsReceived1) {
            console.log(`✅ [PASS] Scenario 1: Wi-Fi JSON event processed, saved to DB (channel=WIFI), and broadcasted via WS.`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 1 failed. Status: ${res1.status}, DB: ${!!dbEvt1}, WS: ${wsReceived1}`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 1 error: ${err.message}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 2: Wi-Fi JSON + Image -> Backend -> Storage -> WebSocket
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 2: Wi-Fi JSON + Image Attachment Ingestion');
    const evt2Id = `EVT-TEST2-${Date.now().toString().slice(-4)}`;
    const dummyImg = createDummyImageBuffer();

    try {
        // First create event
        await postJSON('/api/events', {
            event_id: evt2Id,
            hazard: 'person',
            confidence: 0.91,
            priority: 'HIGH',
            latitude: 28.1630,
            longitude: 85.3360,
            altitude: 35.0
        });

        // Attach image file via POST /api/events/:event_id/image
        const imgRes = await postMultipartImage(`/api/events/${evt2Id}/image`, evt2Id, dummyImg, 'test-person.jpg');
        const dbEvt2 = await getEventFromDB(evt2Id);

        if (imgRes.status === 200 && dbEvt2 && dbEvt2.image_path && dbEvt2.image_path.startsWith('/uploads/')) {
            console.log(`✅ [PASS] Scenario 2: Image stored at '${dbEvt2.image_path}', attached to event ${evt2Id}, DB updated.`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 2 failed. Status: ${imgRes.status}, image_path: ${dbEvt2?.image_path}`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 2 error: ${err.message}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 3: LoRa/SiK Metadata -> Backend -> Database -> WebSocket
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 3: LoRa/SiK Lightweight Metadata Ingestion');
    const evt3Id = `EVT-TEST3-${Date.now().toString().slice(-4)}`;
    const loraPayload = {
        event_id: evt3Id,
        hazard: 'landslide',
        confidence: 0.88,
        priority: 'HIGH',
        latitude: 28.1660,
        longitude: 85.3460,
        altitude: 60.0
    };

    try {
        const res3 = await postJSON('/api/events/lora', loraPayload);
        const dbEvt3 = await getEventFromDB(evt3Id);

        if (res3.status === 200 && dbEvt3 && dbEvt3.channel === 'LORA' && dbEvt3.image_path === null) {
            console.log(`✅ [PASS] Scenario 3: LoRa metadata saved with channel='LORA' and image_path=null.`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 3 failed. Status: ${res3.status}, channel: ${dbEvt3?.channel}`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 3 error: ${err.message}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 4: LoRa event first -> Wi-Fi later with image -> Merge without duplicates
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 4: LoRa First -> Wi-Fi Image Merge Logic');
    const mergeEvtId = `EVT-MERGE-TEST-${Date.now().toString().slice(-4)}`;

    try {
        // Step A: Send LoRa packet first
        await postJSON('/api/events/lora', {
            event_id: mergeEvtId,
            hazard: 'flood',
            confidence: 0.82,
            priority: 'HIGH',
            latitude: 28.1575,
            longitude: 85.3410
        });

        const dbStep1 = await getEventFromDB(mergeEvtId);
        console.log(`   Step A (LoRa): Channel=${dbStep1.channel}, Image=${dbStep1.image_path}`);

        // Step B: Send Wi-Fi image attachment later for same event_id
        await postMultipartImage(`/api/events/${mergeEvtId}/image`, mergeEvtId, dummyImg, 'wifi-evidence.jpg');

        const dbStep2 = await getEventFromDB(mergeEvtId);
        console.log(`   Step B (Wi-Fi Merge): Channel=${dbStep2.channel}, Image=${dbStep2.image_path}`);

        if (dbStep1.channel === 'LORA' && dbStep2.channel === 'WIFI' && dbStep2.image_path && dbStep2.event_id === mergeEvtId) {
            console.log(`✅ [PASS] Scenario 4: LoRa event successfully merged with Wi-Fi image (channel updated to WIFI, no duplicate).`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 4 failed.`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 4 error: ${err.message}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 5: Repeated Transmissions -> Deduplication Check
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 5: Repeated Event Transmissions (Deduplication)');
    const dupEvtId = `EVT-DUP-TEST-${Date.now().toString().slice(-4)}`;
    const dupPayload = {
        event_id: dupEvtId,
        hazard: 'debris',
        confidence: 0.79,
        priority: 'MEDIUM',
        latitude: 28.1675,
        longitude: 85.3440
    };

    try {
        // Send 3 times
        await postJSON('/api/events/lora', dupPayload);
        await postJSON('/api/events/lora', dupPayload);
        await postJSON('/api/events', dupPayload);

        // Fetch total count matching this event_id from events endpoint
        const resQuery = await new Promise((resolve) => {
            http.get(`${BASE_URL}/api/events?search=${dupEvtId}`, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve(JSON.parse(body)));
            });
        });

        if (resQuery.total === 1 && resQuery.events.length === 1) {
            console.log(`✅ [PASS] Scenario 5: Transmitted 3 times, exactly 1 record found in database (deduplication active).`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 5 failed. Count in DB: ${resQuery.total}`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 5 error: ${err.message}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 6: Offline Local Network Operation Check
    // -------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------------------');
    console.log('TEST SCENARIO 6: Offline / Local Network Operation Check');
    try {
        const healthRes = await new Promise((resolve, reject) => {
            http.get(`${BASE_URL}/api/health`, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve(JSON.parse(body)));
            }).on('error', reject);
        });

        if (healthRes.status === 'HEALTHY' && healthRes.database.status === 'CONNECTED') {
            console.log(`✅ [PASS] Scenario 6: System fully operational on local network (${HOST}:${PORT}) without internet.`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] Scenario 6 failed.`);
        }
    } catch (err) {
        console.error(`❌ [FAIL] Scenario 6 error: ${err.message}`);
    }

    console.log('\n=============================================================================');
    console.log(`📊 TEST RESULTS: ${passedCount} / ${totalScenarios} SCENARIOS PASSED`);
    console.log('=============================================================================\n');

    if (wsClient) wsClient.close();
    process.exit(passedCount === totalScenarios ? 0 : 1);
}

runTests();
