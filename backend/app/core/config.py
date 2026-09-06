"""
MnVision 360 — Application Configuration
Reads settings from environment variables or .env file.
All secrets MUST be overridden via environment variables in production.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # ── App ────────────────────────────────────────────────────────────────
    app_name: str = "MnVision 360"
    app_version: str = "1.0.0-phase1"
    app_env: str = "development"
    debug: bool = True

    # ── Database ───────────────────────────────────────────────────────────
    database_url: str = "postgresql://mnvision:mnvision360@postgres:5432/mnvision360"

    # ── Security ───────────────────────────────────────────────────────────
    secret_key: str = "change-this-in-production"
    jwt_secret: str = "change-this-jwt-secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    # ── MinIO Object Storage ───────────────────────────────────────────────
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "mnvision_access"
    minio_secret_key: str = "mnvision_secret_key"

    # ── MLflow Experiment Tracking ─────────────────────────────────────────
    mlflow_tracking_uri: str = "http://mlflow:5000"

    # ── Google Earth Engine (optional — Phase 5) ───────────────────────────
    gee_service_account: Optional[str] = None
    gee_key_file: Optional[str] = None
    gee_project: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
    }


settings = Settings()
