import json
import asyncio
import paho.mqtt.client as mqtt

from core import state
from core.state import *
from services.oee_service import calculate_oee
from ws.ws_manager import manager

BROKER = "localhost"
PORT = 1883

mqtt_client = mqtt.Client()
main_loop = asyncio.get_event_loop()

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT")
    client.subscribe("mes/#")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    topic = msg.topic
    
    print(f"MQTT Received: {topic} -> {payload}")
    
    if topic.startswith('mes/wc/'):
        
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

        elif payload["status"] == "done":
            production_state["workcenters"][wc]["status"] = "IDLE"
            production_state["workcenters"][wc]["cycle"] = payload.get("cycle_time", 0)

            if payload.get("result") == "ok":
                production_state["workcenters"][wc]["ok"] += 1
            elif payload.get("result") == "ng":
                production_state["workcenters"][wc]["ng"] += 1
                
        conveyor = production_state["workcenters"].get("Conveyor1")
        if conveyor:
            production_state["total"] = conveyor["ok"] + conveyor["ng"]
            production_state["ok"] = conveyor["ok"]
            production_state["ng"] = conveyor["ng"]
    calculate_oee()
    
    if topic == "mes/product":
        if payload.get("status") == "complete":

            if payload.get("result") == "ok":
                state.produced_count += 1

                # update progress ke Odoo
                state.odoo.update_production_qty(state.current_mo_id, state.produced_count)

                print(f"📈 Progress sent to Odoo: {state.produced_count}")

            # cek apakah sudah selesai
            if state.produced_count >= state.production_target:
                print("🎯 Target reached → closing MO")

                state.odoo.mark_mo_done(state.current_mo_id)

    asyncio.run_coroutine_threadsafe(manager.broadcast(production_state), main_loop)
    
def start_mqtt():
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect(BROKER, PORT, 60)
    mqtt_client.loop_start()
    

def publish(topic, payload):
    try:
        mqtt_client.publish(topic, json.dumps(payload))
        print(f"[MQTT SEND] {topic} -> {payload}")
    except Exception as e:
        print("❌ MQTT Publish Error:", e)