from main import app

print("Listing all registered routes:")
for route in app.routes:
    methods = getattr(route, "methods", None)
    path = getattr(route, "path", None)
    print(f"{methods} {path}")
