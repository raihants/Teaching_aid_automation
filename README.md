# 🏭 Teaching Aid MES Simulation & Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MQTT](https://img.shields.io/badge/mqtt-660066?style=for-the-badge&logo=mqtt&logoColor=white)

This project is an end-to-end **Manufacturing Execution System (MES)** simulation. It integrates an ERP system (Odoo) with a simulated IoT production line (via MQTT) and visualizes the real-time manufacturing process on a modern web dashboard.

## 📋 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-fastapi)
  - [MQTT Simulator Setup](#2-mqtt-simulator)
  - [Frontend Setup](#3-frontend-setup-react)
- [How It Works](#-how-it-works)

## 🏗 Architecture Overview

The system consists of three main components:
1. **ERP Integration (Backend)**: Fetches the active Manufacturing Order (MO) and production targets from **Odoo**.
2. **IoT Simulation (Dummy Production)**: An MQTT-based simulator representing an automated factory line (Conveyors, Robotic Arms, AGVs). It receives commands and broadcasts real-time telemetry (cycle times, defects, completions).
3. **Real-time Dashboard (Frontend)**: Connects to the backend via **WebSockets** to monitor live production progress, workcenter statuses, and detect bottlenecks or defects dynamically.

## 📂 Project Structure

- `frontend-a/`: The React-based frontend dashboard.
- `backend/`: The FastAPI backend serving as the bridge between Odoo, MQTT, and the frontend web sockets.
- `dummy_production.py`: Python script simulating the factory floor via MQTT messaging.

## ✨ Features

- **ERP Sync**: Automatically retrieves target quantities and MO details from Odoo.
- **MQTT Event Driven**: Utilizes MQTT topics (`mes/target`, `mes/control`, `mes/wc/#`, `mes/product`) for all machine communications.
- **Real-Time Visibility**: Live WebSocket streaming ensures the dashboard reflects the factory floor instantly.
- **Defect Simulation**: Configurable reject rates simulate realistic production defects (`ng` status).
- **Workcell Tracking**: Monitors discrete steps: `Conveyor1` ➔ `ArmRobot` ➔ `AGV` ➔ `Conveyor2` ➔ `Delta`.

## 💻 Technology Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS (Styling)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React & React Icons (Icons)

**Backend:**
- Python 3
- FastAPI
- WebSockets
- Paho MQTT (IoT Messaging)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- Active MQTT Broker (e.g., Mosquitto running on `localhost:1883`)
- Odoo Instance (for ERP integration)

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up your environment:
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt # Ensure you have fastapi, uvicorn, paho-mqtt, python-dotenv, websockets
```

Create a `.env` file in the `backend/` directory with your Odoo credentials (as seen in the codebase):
```env
ODOO_URL=http://your-odoo-instance.com
ODOO_DB=your_database
ODOO_USERNAME=your_username
ODOO_PASSWORD=your_password
```

Run the server:
```bash
uvicorn main:app --reload
```

### 2. MQTT Simulator
Run the dummy production script to simulate factory machines. Make sure your local MQTT broker is running:
```bash
python dummy_production.py
```
*Note: This script will wait idly until it receives a target and a start command from the backend.*

### 3. Frontend Setup (React)
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ How It Works

1. The **FastAPI backend** continually polls Odoo for a new active Manufacturing Order (MO).
2. Once an MO is found, the backend extracts the target quantity and publishes `mes/target` and `mes/control` (`start`) to the MQTT broker.
3. The **`dummy_production.py`** script wakes up, receives the start command, and begins simulating production, publishing machine statuses, cycle times, and product completions to `mes/wc/[workcenter]` and `mes/product`.
4. The backend listens to these MQTT events and pipes them through a **WebSocket** directly to the **React Frontend**.
5. The frontend displays the active production line vividly, updating progress bars, charts, and machine states in real-time.
git 