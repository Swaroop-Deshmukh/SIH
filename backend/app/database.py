"""
MnVision 360 — Database Engine & Session Factory
SQLAlchemy 2.x with PostGIS support via GeoAlchemy2.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from loguru import logger

from app.core.config import settings


# ── Engine ──────────────────────────────────────────────────────────────────

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # validate connections before use
    pool_size=10,
    max_overflow=20,
    echo=settings.debug,      # log SQL in debug mode
    future=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session,
)


# ── Declarative base ─────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


# ── Dependency ───────────────────────────────────────────────────────────────

def get_db():
    """FastAPI dependency that yields a DB session and closes it on exit."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Health checks ─────────────────────────────────────────────────────────────

def check_db_connection() -> bool:
    """Return True if we can reach the database."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error(f"Database connection failed: {exc}")
        return False


def check_postgis() -> bool:
    """Return True if PostGIS extension is available, logging its version."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT PostGIS_Version()"))
            version = result.fetchone()[0]
            logger.info(f"PostGIS version: {version}")
        return True
    except Exception as exc:
        logger.error(f"PostGIS check failed: {exc}")
        return False
