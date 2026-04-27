production_state = {
    "total": 0,
    "ok": 0,
    "ng": 0,
    "workcenters": {},
    "oee": {},
    "oee_wc": {},
    "target": 0,
    "progress": 0
}

production_target = 0
produced_count = 0
ok_count = 0
ng_count = 0

start_time = None
end_time = None

current_mo_id = None
odoo = None


def reset_state():
    """
    Reset all production counters and workcenter data when a new MO starts.
    Mutates in-place so every module that imported state sees the reset.
    """
    import core.state as _s

    # Reset scalar counters
    _s.produced_count = 0
    _s.ok_count = 0
    _s.ng_count = 0
    _s.start_time = None
    _s.end_time = None

    # Reset production_state dict in-place
    _s.production_state["total"] = 0
    _s.production_state["ok"] = 0
    _s.production_state["ng"] = 0
    _s.production_state["workcenters"] = {}
    _s.production_state["oee"] = {}
    _s.production_state["oee_wc"] = {}
    _s.production_state["progress"] = 0
    # "target" will be updated by the caller right after reset

    print("🔄 State reset for new MO")