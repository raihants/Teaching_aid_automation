from core.state import production_state

def calculate_oee():
    workcenters = production_state["workcenters"]

    total = production_state["total"]
    ok = production_state["ok"]

    quality = (ok / total * 100) if total > 0 else 0

    wc_oee = {}
    perf_list = []

    for name, wc in workcenters.items():

        cycle = wc.get("cycle", 0)
        ideal = 5

        performance = (ideal / cycle * 100) if cycle > 0 else 0
        performance = min(performance, 100)

        availability = 100 if cycle > 0 else 0

        oee = availability/100 * performance/100 * quality/100 * 100

        wc_oee[name] = {
            "availability": round(availability,1),
            "performance": round(performance,1),
            "quality": round(quality,1),
            "oee": round(oee,1)
        }

        perf_list.append(performance)

    avg_perf = sum(perf_list)/len(perf_list) if perf_list else 0
    availability_line = 100 if total > 0 else 0

    oee_line = availability_line/100 * avg_perf/100 * quality/100 * 100

    production_state["oee"] = {
        "availability": round(availability_line,1),
        "performance": round(avg_perf,1),
        "quality": round(quality,1),
        "oee": round(oee_line,1)
    }

    production_state["oee_wc"] = wc_oee