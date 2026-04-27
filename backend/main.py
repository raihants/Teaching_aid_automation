import asyncio
from datetime import datetime
import os
import threading
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from core import state
from dotenv import load_dotenv

from routes.api import router
from ws.ws_manager import manager
from services.mqtt_service import start_mqtt, publish
from services.odoo_service import OdooService
from services.db_service import create_mo, finish_mo

load_dotenv()

ODOO_URL = os.getenv("ODOO_URL")
ODOO_DB = os.getenv("ODOO_DB")
ODOO_USERNAME = os.getenv("ODOO_USERNAME")
ODOO_PASSWORD = os.getenv("ODOO_PASSWORD")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 sementara bebas (dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# start MQTT
start_mqtt()

state.odoo = OdooService(ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await asyncio.sleep(1)  # keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

def odoo_listener():
    while True:
        mo = state.odoo.get_active_mo()

        if mo and mo["id"] != state.current_mo_id:
            print(f"🆕 New MO detected: {mo['name']} (was {state.current_mo_id})")

            # ── Reset all state before starting the new MO ──
            state.reset_state()

            state.current_mo_id = mo["id"]
            state.production_target = int(mo.get("product_qty", 10))

            # Sync target into production_state for WebSocket broadcast
            state.production_state["target"] = state.production_target

            print(f"🔥 Start MO {mo['name']} target={state.production_target}")

            publish("mes/target", {"target": state.production_target})
            publish("mes/control", {"command": "start"})

            create_mo(mo["id"])

        time.sleep(5)
        
threading.Thread(target=odoo_listener, daemon=True).start()