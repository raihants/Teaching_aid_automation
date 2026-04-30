import xmlrpc.client
import socket


class OdooService:
    def __init__(self, url, db, username, password):
        self.url = url
        self.db = db
        self.username = username
        self.password = password

        self.uid = None
        self.last_mo_id = None

        self.connect()

    # =============================
    # CONNECT
    # =============================
    def connect(self):
        try:
            print("[ODOO] Connecting to Odoo...")

            common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common")

            self.uid = common.authenticate(
                self.db,
                self.username,
                self.password,
                {}
            )

            if not self.uid:
                print("[ERROR] Login Failed (username/password/db salah)")
                return False

            print("[OK] Connected to Odoo")
            print(f"[USER] UID: {self.uid}")

            return True

        except socket.error:
            print("[ERROR] Connection Failed (server mati / URL salah)")
            return False

        except Exception as e:
            print("[ERROR] Unknown Error:", e)
            return False

    # =============================
    # SAFE EXECUTE
    # =============================
    def execute(self, model, method, args=None, kwargs=None):
        if args is None:
            args = []
        if kwargs is None:
            kwargs = {}

        try:
            models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")

            return models.execute_kw(
                self.db,
                self.uid,
                self.password,
                model,
                method,
                args,
                kwargs
            )

        except Exception as e:
            print(f"[ERROR] Odoo Error ({model}.{method}):", e)

            # coba reconnect
            if self.connect():
                try:
                    models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")
                    return models.execute_kw(
                        self.db,
                        self.uid,
                        self.password,
                        model,
                        method,
                        args,
                        kwargs
                    )
                except Exception as e2:
                    print("[ERROR] Retry Failed:", e2)

            return None

    # =============================
    # GET ACTIVE MO
    # =============================
    def get_active_mo(self):
        result = self.execute(
            'mrp.production',
            'search_read',
            [[['state', 'in', ['progress']]]],
            {'fields': ['id', 'name', 'product_qty', 'qty_produced']}
        )

        if not result:
            print("[INFO] No active Manufacturing Order")
            return None

        mo = result[0]

        print(f"[OK] Active MO: {mo['name']} | Target: {mo['product_qty']}")

        return mo

    # =============================
    # UPDATE QTY
    # =============================
    def update_production_qty(self, mo_id, qty_done):
        result = self.execute(
            'mrp.production',
            'write',
            [[mo_id], {'qty_produced': qty_done}]
        )

        if result:
            print(f"[UPDATE] Updated qty_produced = {qty_done}")

    # =============================
    # MARK DONE
    # =============================
    def mark_mo_done(self, mo_id):
        result = self.execute(
            'mrp.production',
            'button_mark_done',
            [[mo_id]]
        )

        if result is not None:
            print("[OK] MO marked as DONE")