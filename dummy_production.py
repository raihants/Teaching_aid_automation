import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime

BROKER = "localhost"
PORT = 1883

# =============================
# GLOBAL STATE
# =============================

production_target = 0
produced_count = 0
running = False

# =============================
# MQTT SETUP
# =============================

client = mqtt.Client()
client.connect(BROKER, PORT, 60)


def publish(topic, payload):
    client.publish(topic, json.dumps(payload))
    print(f"[SEND] {topic} -> {payload}")


# =============================
# MQTT MESSAGE HANDLER
# =============================

def on_message(client, userdata, msg):
    global production_target, produced_count, running

    try:
        payload = json.loads(msg.payload.decode())
    except:
        print("⚠ Invalid JSON:", msg.payload)
        return
    topic = msg.topic

    print(f"[RECEIVE] {topic} -> {payload}")

    # SET TARGET
    if topic == "mes/target":
        production_target = payload.get("target", 0)
        produced_count = 0

        print(f"🎯 Production Target Set: {production_target}")

    # CONTROL COMMAND
    if topic == "mes/control":
        command = payload.get("command")

        if command == "start":
            running = True
            print("▶ Production START")

        elif command == "stop":
            running = False
            print("⏹ Production STOP")


client.on_message = on_message

client.subscribe("mes/target")
client.subscribe("mes/control")

client.loop_start()

print("MQTT Connected. Waiting for commands...")


# =============================
# WORKCENTER PROCESS
# =============================

def process_workcenter(product_id, workcenter, ideal_cycle=5.0, min_time=4.8, max_time=5.2, reject_rate=0):

    # START EVENT
    publish(f"mes/wc/{workcenter}", {
        "timestamp": datetime.now().isoformat(),
        "product_id": product_id,
        "workcenter": workcenter,
        "status": "start"
    })

    cycle_time = round(random.uniform(min_time, max_time), 2)
    time.sleep(cycle_time)

    result = "ok"

    if reject_rate > 0:
        result = random.choices(
            ["ok", "ng"],
            weights=[100 - reject_rate, reject_rate]
        )[0]

    # DONE EVENT
    publish(f"mes/wc/{workcenter}", {
        "timestamp": datetime.now().isoformat(),
        "product_id": product_id,
        "workcenter": workcenter,
        "status": "done",
        "result": result,
        "cycle_time": cycle_time,
        "ideal_cycle_time": ideal_cycle
    })

    return result


# =============================
# MAIN LOOP
# =============================

while True:

    # Tunggu start command
    if not running or production_target == 0:
        time.sleep(1)
        continue

    # Stop jika target tercapai
    if production_target > 0 and produced_count >= production_target:
        print("🎯 Production Target Reached")
        
        running = False
        production_target = 0
        produced_count = 0

        print("🔄 System back to IDLE (ready for new target & start)")
        
        continue

    product_id = random.randint(1000, 9999)

    print(f"\n=== START PRODUCT {product_id} ===")

    # =============================
    # Conveyor1
    # =============================

    result = process_workcenter(
        product_id,
        "Conveyor1",
        ideal_cycle=5.0,
        min_time=4.8,
        max_time=5.2,
        reject_rate=10
    )

    if result == "ng":

        print("❌ Defect detected at Conveyor1 — Line Terminated")

        publish("mes/product", {
            "timestamp": datetime.now().isoformat(),
            "product_id": product_id,
            "status": "complete",
            "result": "ng",
            "terminated_at": "Conveyor1"
        })

        time.sleep(3)
        continue

    # =============================
    # WORKCENTERS
    # =============================

    workcenters = [
        ("ArmRobot", 0),
        ("AGV", 0),
        ("Conveyor2", 0),
        ("Delta", 0),
    ]

    final_result = "ok"

    for wc, reject_rate in workcenters:

        result = process_workcenter(
            product_id,
            wc,
            ideal_cycle=5.0,
            min_time=4.8,
            max_time=5.2,
            reject_rate=reject_rate
        )

        if result == "ng":
            print(f"❌ Defect detected at {wc}")
            final_result = "ng"
            break

    # =============================
    # FINAL PRODUCT EVENT
    # =============================

    publish("mes/product", {
        "timestamp": datetime.now().isoformat(),
        "product_id": product_id,
        "status": "complete",
        "result": final_result
    })

    produced_count += 1

    print(f"=== PRODUCT {product_id} COMPLETE ({final_result}) ===")
    print(f"Progress: {produced_count}/{production_target}")

    time.sleep(3)