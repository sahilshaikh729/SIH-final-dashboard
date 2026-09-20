# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary users are emergency responders, disaster-management coordinators, and drone ground station operators conducting search & rescue missions in real time during disaster events.

## Product Purpose
Provide an operational ground station interface for real-time UAV surveillance, tracking AI-detected victims and disaster hazards (person, fire, flood, smoke, landslide, debris), monitoring drone telemetry (GPS, battery, SiK/LoRa link status), and managing incident logs with evidence lightbox inspection.

## Positioning
A high-density tactical disaster response command center built specifically for live telemetry ingestion via WebSocket and SiK/LoRa hardware bridges, offering real-time Leaflet spatial tracking alongside incident prioritization.

## Operating Context
Used in mobile emergency command units and field control posts. Operators require immediate visual clarity, high contrast data density, dark mode operational aesthetic with light mode support, zero visual clipping, and fast incident resolution workflows.

## Capabilities and Constraints
- Real-time Leaflet map with drone trajectory and live hazard pin placement.
- Real-time WebSocket connection to telemetry backend and hardware bridges (SiK radio / LoRa).
- Incident records data table with search, category filtering, evidence lightbox preview, and resolution tracking.
- Detections and priority sidebars with live status counts.
- Dual dark/light mode aerospace operational theme.
- Inferred constraint: Web React/Vite architecture with Express SQLite backend.

## Brand Commitments
- Project Name: SIH Disaster-Response Drone System - Person 2 Ground Station
- Visual identity: Tactical aerospace command center with deep navy/slate themes, cyan/blue operational glows, crisp mono fonts for metrics, and high-visibility status indicators.

## Evidence on Hand
- Full codebase with mock telemetry generator (`mock/event_generator/generator.js`).
- Telemetry hardware bridges (`bridge/sik_receiver.js`, `bridge/lora_bridge.js`).
- Evidence image assets in public/assets directory (`hero_drone.jpg`).

## Product Principles
1. **Operational Efficiency First**: Crucial information (hazard location, confidence %, battery status) must be scannable within milliseconds.
2. **Zero Visual Clipping & Overflow**: Components must strictly contain their content without text escaping or container truncation.
3. **Tactical Clarity**: High-contrast indicators and clean typography distinguish critical alerts from normal telemetry data.
4. **Reliable Live Telemetry**: Dynamic updates via WebSockets without breaking user interaction or map navigation.

## Accessibility & Inclusion
High-contrast tactical color coding (Red for High Priority/Person Rescue, Amber for Medium/Fire/Landslide, Cyan for Operational metrics, Emerald for Systems Live) to ensure clarity under harsh ambient lighting conditions in field control units.
