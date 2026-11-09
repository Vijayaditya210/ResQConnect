from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import PORT, HOST
from .services.firebase_service import initialize_firebase
from .routers import ai, matching, logistics, demo

app = FastAPI(
    title="ResQConnect - Disaster Relief Resource-Demand Matching & Logistics Coordination API",
    description="Emergency Operations Command & Decision Intelligence Backend (GGSIPU2633 - USAR, GGSIPU)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def on_startup():
    initialize_firebase()
    print("ResQConnect Disaster Management Backend initialized successfully.")

# Include Routers
app.include_router(ai.router)
app.include_router(matching.router)
app.include_router(logistics.router)
app.include_router(demo.router)

@app.get("/")
async def root():
    return {
        "platform": "ResQConnect",
        "description": "Disaster Relief Resource-Demand Matching & Logistics Coordination Platform",
        "problem_statement": "GGSIPU2633",
        "organization": "University School of Automation & Robotics (USAR), GGSIPU",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
