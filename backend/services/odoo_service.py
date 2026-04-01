import xmlrpc.client
import socket

class OdooService:
    def __init__(self, url, db, username, password):
        self.url = url
        self.db = db
        self.username = username
        self.password = password

        self.uid = None
        self.models = None
        self.last_mo_id = None

        self.connect()

    def connect(self):
        try:
            print("🔄 Connecting to Odoo...")

            self.common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common")

            # AUTHENTICATION
            self.uid = self.common.authenticate(
                self.db,
                self.username,
                self.password,
                {}
            )

            if not self.uid:
                print("❌ Odoo Login Failed: Username / Password / DB salah")
                return

            self.models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")

            print("✅ Odoo Connected Successfully")
            print(f"👤 UID: {self.uid}")

        except socket.error:
            print("❌ Odoo Connection Failed: Server tidak aktif / URL salah")

        except Exception as e:
            print("❌ Odoo Unknown Error:", e)

    def get_active_mo(self):
        mos = self.models.execute_kw(
            self.db, self.uid, self.password,
            'mrp.production', 'search_read',
            [[['state', 'in', ['confirmed', 'progress']]]],
            {'fields': ['id', 'name', 'product_qty']}
        )

        if not mos:
            print("ℹ No active Manufacturing Order")
            return None

        mo = mos[0]

        print(f"✅ Active MO: {mo['name']} | Target: {mo['product_qty']}")

        return mo
    
    def update_production_qty(self, mo_id, qty_done):
        try:
            self.models.execute_kw(
                self.db, self.uid, self.password,
                'mrp.production', 'write',
                [[mo_id], {
                    'qty_produced': qty_done
                }]
            )
            print(f"📦 Updated qty_produced = {qty_done}")
        except Exception as e:
            print("❌ Failed update qty:", e)
            
    def mark_mo_done(self, mo_id):
        try:
            self.models.execute_kw(
                self.db, self.uid, self.password,
                'mrp.production', 'button_mark_done',
                [[mo_id]]
            )
            print("✅ MO marked as DONE in Odoo")
        except Exception as e:
            print("❌ Failed mark done:", e)