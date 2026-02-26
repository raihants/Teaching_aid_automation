from fastapi import FastAPI, WebSocket
import asyncio
import json
import paho.mqtt.client as mqtt

app = FastAPI()

connected_clients = []

# =========================
# PRODUCTION STATE
# =========================

production_state = {
    "total": 0,
    "ok": 0,
    "ng": 0,
    "workcenters": {}
}

# =========================
# MQTT CONFIG
# =========================

BROKER = "localhost"
PORT = 1883

mqtt_client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT")
    client.subscribe("mes/#")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    topic = msg.topic

    print("MQTT:", topic, payload)

    if topic.startswith("mes/wc/"):

        wc = payload.get("workcenter")

        # Buat workcenter kalau belum ada
        if wc not in production_state["workcenters"]:
            production_state["workcenters"][wc] = {
                "status": "IDLE",
                "cycle": 0,
                "ok": 0,
                "ng": 0
            }

        if payload["status"] == "start":
            production_state["workcenters"][wc]["status"] = "RUNNING"

        if payload["status"] == "done":
            production_state["workcenters"][wc]["status"] = "IDLE"
            production_state["workcenters"][wc]["cycle"] = payload.get("cycle_time", 0)

            if payload.get("result") == "ok":
                production_state["workcenters"][wc]["ok"] += 1

            elif payload.get("result") == "ng":
                production_state["workcenters"][wc]["ng"] += 1
                
            if "Conveyor1" in production_state["workcenters"]:
                conveyor = production_state["workcenters"]["Conveyor1"]
                production_state["total"] = conveyor["ok"] + conveyor["ng"]
                
                production_state["ok"] = conveyor["ok"]
                production_state["ng"] = conveyor["ng"]
                
            else:
                production_state["total"] = 0

    asyncio.run(broadcast_state())

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(BROKER, PORT, 60)
mqtt_client.loop_start()

# =========================
# WEBSOCKET
# =========================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)

    try:
        while True:
            await asyncio.sleep(1)
    except:
        connected_clients.remove(websocket)

async def broadcast_state():
    disconnected = []

    for client in connected_clients:
        try:
            await client.send_text(json.dumps(production_state))
        except:
            disconnected.append(client)

    for client in disconnected:
        connected_clients.remove(client)