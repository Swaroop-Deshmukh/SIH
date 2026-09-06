from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.api import health, mines, exploration, targets, production, equipment, blocks, recommendations, field
from app.database import check_db_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info(f"Starting MnVision 360 API v{settings.app_version}")
    logger.info(f"Environment: {settings.app_env}")
    
    if check_db_connection():
        logger.info("Database: Connected successfully to PostGIS")
    else:
        logger.warning("Database: Not connected (Running in prototype fixture mode)")
        
    yield
    
    logger.info("Shutting down MnVision 360 API")

app = FastAPI(
    title="MnVision 360 API",
    description="Space-to-Mine Intelligence Platform for MOIL Manganese Exploration & Production Intelligence",
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, tags=["Health"])
app.include_router(mines.router, prefix="/api", tags=["Mines"])
app.include_router(exploration.router, prefix="/api", tags=["Exploration"])
app.include_router(targets.router, prefix="/api", tags=["Drill Targets"])
app.include_router(production.router, prefix="/api", tags=["Production"])
app.include_router(equipment.router, prefix="/api", tags=["Equipment"])
app.include_router(blocks.router, prefix="/api", tags=["Mine Blocks"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(field.router, prefix="/api", tags=["Field Operations"])
