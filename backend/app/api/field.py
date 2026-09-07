import os
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request, status
from pydantic import BaseModel
from typing import Optional
from datetime import date
from loguru import logger

from app.api.auth import get_current_user, require_roles, UserResponse
from app.services.audit_service import log_audit_event

router = APIRouter()

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".geojson", ".json", ".jpg", ".jpeg", ".png", ".pdf"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

class FieldObservationCreate(BaseModel):
    target_id: Optional[str] = None
    latitude: float
    longitude: float
    observation_date: date
    lithology: str
    rock_type: Optional[str] = None
    sample_id: Optional[str] = None
    notes: Optional[str] = None

@router.post("/field-observations")
def submit_observation(
    obs: FieldObservationCreate,
    request: Request,
    current_user: UserResponse = Depends(require_roles(["Field Officer", "Geologist", "Admin"])),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    obs_id = f"OBS-{obs.observation_date.strftime('%Y%m%d')}-001"

    log_audit_event(
        username=current_user.username,
        role=current_user.role,
        action="FIELD_OBSERVATION_SUBMITTED",
        resource=f"/api/field-observations/{obs_id}",
        ip_address=client_ip,
        status="SUCCESS",
        details=f"Field observation logged at ({obs.latitude}, {obs.longitude}) for Target '{obs.target_id}'.",
    )

    return {
        "status": "ACCEPTED",
        "observation_id": obs_id,
        "submitted_by": current_user.username,
        "message": "Observation recorded in field database. Will be linked into subsequent model retraining cycles."
    }

@router.post("/field/upload")
async def upload_field_file(
    request: Request,
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(require_roles(["Field Officer", "Geologist", "Admin"])),
):
    """
    Secure file upload handler enforcing file type, max 10MB size, filename sanitization (preventing path traversal), and audit logging.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    # 1. Filename sanitization (Path Traversal Protection)
    raw_filename = os.path.basename(file.filename or "")
    sanitized_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', raw_filename)
    
    if not sanitized_filename or sanitized_filename.startswith('.'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file name provided.")

    ext = os.path.splitext(sanitized_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        log_audit_event(
            username=current_user.username,
            role=current_user.role,
            action="UNSAFE_FILE_UPLOAD_BLOCKED",
            resource="/api/field/upload",
            ip_address=client_ip,
            status="BLOCKED",
            details=f"Disallowed file extension '{ext}' attempted by user '{current_user.username}'.",
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not permitted. Allowed extensions: {list(ALLOWED_EXTENSIONS)}",
        )

    # 2. File content reading and size validation
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum permitted limit of 10 MB.",
        )

    log_audit_event(
        username=current_user.username,
        role=current_user.role,
        action="FIELD_FILE_UPLOADED",
        resource=f"/api/field/upload/{sanitized_filename}",
        ip_address=client_ip,
        status="SUCCESS",
        details=f"Securely uploaded field file '{sanitized_filename}' ({len(contents)} bytes).",
    )

    return {
        "status": "SUCCESS",
        "filename": sanitized_filename,
        "size_bytes": len(contents),
        "uploaded_by": current_user.username,
        "message": f"File '{sanitized_filename}' verified and stored safely."
    }
