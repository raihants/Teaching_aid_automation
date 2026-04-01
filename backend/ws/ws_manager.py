import json

class ConnectionManager:
    def __init__(self):
        self.clients = []
        
    async def connect(self, websocket):
        await websocket.accept()
        self.clients.append(websocket)
        print("WebSocket connected")
    
    def disconnect(self, websocket):
        if websocket in self.clients:
            self.clients.remove(websocket)
            print("WebSocket disconnected")
    
    async def broadcast(self, data):
        for client in self.clients.copy():
            try:
                await client.send_text(json.dumps(data))  # ✅ ini yang benar
            except Exception as e:
                print("WS SEND ERROR:", e)
                self.disconnect(client)
                
manager = ConnectionManager()