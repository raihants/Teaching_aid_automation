from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import json
import paho.mqtt.client as mqtt

app = FastAPI()

# =========================
# GLOBAL STATE
# =========================

connected_clients = []

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

# IMPORTANT:
# Gunakan event loop yang benar (thread-safe)
main_loop = asyncio.get_event_loop()


def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT")
    client.subscribe("mes/#")


def on_message(client, userdata, msg):
    global production_state

    payload = json.loads(msg.payload.decode())
    topic = msg.topic

    print("MQTT:", topic, payload)

    if topic.startswith("mes/wc/"):

        wc = payload.get("workcenter")

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

        # Update total berdasarkan Conveyor1
        conveyor = production_state["workcenters"].get("Conveyor1")
        if conveyor:
            production_state["total"] = conveyor["ok"] + conveyor["ng"]
            production_state["ok"] = conveyor["ok"]
            production_state["ng"] = conveyor["ng"]

    # 🔥 SAFE BROADCAST FROM THREAD
    asyncio.run_coroutine_threadsafe(broadcast_state(), main_loop)


mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(BROKER, PORT, 60)
mqtt_client.loop_start()

# =========================
# ROUTES
# =========================

@app.get("/")
def root():
    return {"status": "backend running"}

# =========================
# WEBSOCKET
# =========================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print("WebSocket connected")

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("WebSocket disconnected")
        connected_clients.remove(websocket)


async def broadcast_state():
    for client in connected_clients.copy():
        try:
            await client.send_text(json.dumps(production_state))
        except:
            connected_clients.remove(client)