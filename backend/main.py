import asyncio
import threading
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from core import state
from config import *

from routes.api import router
from ws.ws_manager import manager
from services.mqtt_service import start_mqtt, publish
from services.odoo_service import OdooService

app = FastAPI()

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
            state.current_mo_id = mo["id"]

            state.production_target = int(mo.get("product_qty", 10))

            print(f"🔥 Start MO {mo['name']} target={state.production_target}")

            publish("mes/target", {"target": state.production_target})
            publish("mes/control", {"command": "start"})

        time.sleep(5)
        
threading.Thread(target=odoo_listener, daemon=True).start()