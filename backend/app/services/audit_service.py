"""
MnVision 360 — Audit Service
Records real security and operational events to database/memory audit store.
"""

from datetime import datetime, timezone
from typing import List, Dict, Optional
from loguru import logger
import uuid

# In-memory store for audit events when running in fixture/standalone mode or to mirror DB events
AUDIT_LOGS_STORE: List[Dict] = []

def log_audit_event(
    username: str,
    role: str,
    action: str,
    resource: str,
    ip_address: str = "127.0.0.1",
    status: str = "SUCCESS",
    details: Optional[str] = None,
) -> Dict:
    """
    Log a real security or operational audit event.
    Stores user, role, action, timestamp, IP, resource, and status.
    NEVER logs passwords, secrets, or raw credentials.
    """
    event = {
        "id": f"audit-{uuid.uuid4().hex[:8]}",
        "username": username,
        "role": role,
        "action": action,
        "resource": resource,
        "ip_address": ip_address,
        "status": status,
        "details": details or "",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    AUDIT_LOGS_STORE.insert(0, event)  # newest first
    # Keep up to 1,000 recent audit logs in memory
    if len(AUDIT_LOGS_STORE) > 1000:
        AUDIT_LOGS_STORE.pop()

    logger.info(f"AUDIT_EVENT [{status}] {username} ({role}) -> {action} on {resource}")
    return event

def get_audit_logs(limit: int = 100, role_filter: Optional[str] = None, action_filter: Optional[str] = None) -> List[Dict]:
    """Retrieve audit logs with optional filtering."""
    logs = AUDIT_LOGS_STORE
    if role_filter:
        logs = [l for l in logs if l["role"] == role_filter]
    if action_filter:
        logs = [l for l in logs if l["action"] == action_filter]
    return logs[:limit]
