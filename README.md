# ResQConnect: Disaster Relief Resource-Demand Matching & Logistics Coordination Platform

**Problem Statement ID:** GGSIPU2633  
**Domain:** Disaster Management & Response  
**Organization:** University School of Automation & Robotics (USAR), GGSIPU  
**System Name:** **ResQConnect - Emergency Operations Command & Decision Intelligence Platform**

---

## 🌟 Overview & Core Objective

During large-scale natural disasters (such as the Vijayawada Urban Inundation scenario), emergency operations centers face severe bottlenecks in matching chaotic incoming field demands with dispersed warehouse inventories.

**ResQConnect** solves this by bridging the end-to-end disaster logistics lifecycle:
$$\text{Disaster Incident} \longrightarrow \text{Emergency Demand} \longrightarrow \text{Multi-Factor Priority Scoring} \longrightarrow \text{Intelligent AI Matching} \longrightarrow \text{Atomic Allocation} \longrightarrow \text{Logistics Assignment} \longrightarrow \text{Live Fleet Tracking} \longrightarrow \text{Demand Resolved}$$

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used | Key Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti | Modern Tactical Emergency Operations Center Dashboard with Glassmorphism UI |
| **Mapping & GIS** | Google Maps Platform (`@vis.gl/react-google-maps`, `AdvancedMarkerElement`, Routes API) | Real-time map with color-coded pins, road routes, and vehicle GPS simulation |
| **AI Intelligence** | Gemini 2.5 Flash (`google-genai`) + Multi-Criteria Decision Analysis (MCDA) Rule Engine | Explainable priority recommendation, warehouse triage ranking, shortage warnings |
| **Backend API** | FastAPI (Python 3.12), Pydantic v2, Uvicorn, Firebase Admin SDK | High-performance REST APIs for geospatial routing, matching calculation, and atomic transactions |
| **Database & Sync** | Cloud Firestore (with `onSnapshot` real-time listeners) & Resilient Local-Sync Adapter | Real-time cross-client synchronisation with zero-latency fallback |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v20+ LTS)
- **Python** (3.10+)

### 1. Start the FastAPI Backend
```bash
# From workspace root
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: **http://localhost:8000/docs**

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
Open your browser at: **http://localhost:5173**

---

## 🎬 1-Click Interactive Hackathon Demo (2-3 Minutes)

ResQConnect includes a dedicated **"Start Demo Scenario"** controller built specifically for hackathon juries:

1. Click **"Start Demo Scenario"** in the top navigation bar.
2. Observe the automated step-by-step incident resolution:
   - **Step 1–2**: Active Red Alert for *Vijayawada Urban Inundation & Budameru Breach* (18,500 people affected).
   - **Step 3**: Critical emergency demand `DEM-1001` (2,000 units of Drinking Water) arrives from Ajit Singh Nagar camp.
   - **Step 4**: AI Decision Engine evaluates 4 regional warehouses and recommends *Guntur Central Relief Warehouse* with a **95% Match Score** (due to 5,000 units in stock and shortest 28 min transit via NH-16).
   - **Step 5**: Admin approves allocation $\rightarrow$ Guntur stock atomically decreases from **5,000 to 3,000 units**.
   - **Step 6**: Vehicle `AP-39-TR-104` is dispatched on Google Maps Highway Route NH-16.
   - **Steps 7–14**: **DEMO LIVE TRACKING** animates the vehicle coordinates smoothly along the route.
   - **Step 15**: Cargo arrives $\rightarrow$ Status changes to **DELIVERED** $\rightarrow$ Demand resolves to **FULFILLED** $\rightarrow$ Confetti celebration triggers!
   - **Step 16**: Dashboard statistics update live across the board.
3. At any time, click the **Reset Icon** (🔄) to restore clean baseline seed data.

---

## 👥 Demo Personas & Role-Based Access Control (RBAC)

Use the top-right persona selector to switch roles:

| Persona | Role | Permissions |
| :--- | :--- | :--- |
| **Dr. Ramesh Babu, IAS** | `ADMIN` (Disaster Authority) | Global incident oversight, allocation approvals, full telemetry access |
| **Priya Sundaram** | `NGO` (Red Cross AP) | Create field demands, verify ground reports, shelter coordination |
| **M. Venkat Rao** | `WAREHOUSE_MANAGER` (Guntur Depot) | Real-time stock intake, approve allocations, monitor low stock |
| **Rajesh Kumar** | `VOLUNTEER_LOGISTICS` (Convoy Lead) | Vehicle navigation, cargo manifest verification, update delivery status |

---

## 🔑 Environment Variables Template

Copy `.env.example` to `.env` to connect live Google Cloud & Firebase projects:

```env
# Frontend (Vite)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_API_BASE_URL=http://localhost:8000

# Backend (FastAPI)
PORT=8000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_MAPS_API_KEY=your_google_maps_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Note on Zero-Configuration Prototype Mode**: If API keys are not yet configured, ResQConnect automatically activates its high-fidelity Local-Sync Adapter & Intelligent MCDA Decision Engine so the application is 100% functional for evaluation.

---

## 🗄️ Firestore Collections Structure

- `disasters`: `{ id, name, type, severity, location_name, coordinates, affected_people, status, declared_at }`
- `demands`: `{ id, disaster_id, location_name, requested_resource, quantity, priority, priority_score, priority_reasons, affected_people, status, verification_status }`
- `resources`: `{ id, resource_type, total_quantity, available_quantity, allocated_quantity, resource_center_id, condition, status }`
- `resource_centers`: `{ id, name, type, location_name, coordinates, capacity_sqft, contact_person, status }`
- `vehicles`: `{ id, vehicle_number, type, capacity_kg, driver_name, current_coordinates, status }`
- `deliveries`: `{ id, demand_id, source_coordinates, destination_coordinates, vehicle_number, distance_km, estimated_travel_time_mins, status, route_waypoints }`
- `shelters`: `{ id, name, location_name, capacity, current_occupancy, status }`
- `alerts`: `{ id, type, title, message, severity, timestamp }`

---

## 🛡️ Google Maps Platform Appendix
- *Usage of Google Maps Platform products and services may incur costs against your Google Cloud project billing account.*
- **Products Utilized**: Maps JavaScript API, AdvancedMarkerElement, Routes API, Places API, Geocoding API.
- **Key Restrictions**: Restrict production keys via HTTP Referrers and designated APIs at: `https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys`
- **License Scope**: Google-sourced code snippets are provided 'as-is' under the Apache 2.0 License (https://www.apache.org/licenses/LICENSE-2.0).
- **Terms of Service**: Use of this code is subject to the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1).
