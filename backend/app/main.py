import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import init_db
from .api.targets import router as targets_router
from .api.analysis import router as analysis_router
from .api.followup import router as followup_router

app = FastAPI(
    title="Trifecta Computational Astrophysics API",
    description="Scientific Screening Engine for TESS Exoplanet Candidates",
    version="0.1.0"
)

# CORS middleware for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(targets_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(followup_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "Trifecta Computational Astrophysics Backend",
        "version": "0.1.0",
        "archives": {
            "nasa_exoplanet_archive": "CONNECTED",
            "mast_tess": "CONNECTED",
            "gaia_dr3": "CONNECTED",
            "panstarrs": "CONNECTED"
        }
    }
