"""
MnVision 360 — Structured Logging Setup
Uses loguru for human-readable and file-based structured logs.
"""

import sys
from pathlib import Path
from loguru import logger

from app.core.config import settings


def setup_logging() -> None:
    """Configure loguru sinks for stdout and rotating file output."""
    # Remove default loguru handler
    logger.remove()

    log_level = "DEBUG" if settings.debug else "INFO"
    log_format = (
        "{time:YYYY-MM-DD HH:mm:ss} | {level:<8} | "
        "{name}:{function}:{line} | {message}"
    )

    # Stdout sink
    logger.add(
        sys.stdout,
        format=log_format,
        level=log_level,
        colorize=True,
        enqueue=True,
    )

    # Rotating file sink
    log_dir = Path("logs")
    log_dir.mkdir(parents=True, exist_ok=True)

    logger.add(
        log_dir / "mnvision360.log",
        rotation="10 MB",
        retention="7 days",
        level=log_level,
        format=log_format,
        enqueue=True,
        encoding="utf-8",
    )

    logger.info(
        f"Logging initialised — level={log_level}, env={settings.app_env}"
    )
