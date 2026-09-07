"""
MnVision 360 — Authentication & Identity Endpoints
Includes JWT token issue/refresh, login throttling, password verification, and RBAC helper dependencies.
"""

import time
from datetime import datetime, timezone
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from loguru import logger

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
)
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/auth", tags=["Authentication & Security"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# In-memory store for pre-seeded RBAC users & rate-limiting trackers
FAILED_ATTEMPTS: Dict[str, Dict] = {}  # key: ip_or_username -> {count, lock_until}
REVOKED_TOKENS = set()

# Pre-seeded users with secure bcrypt hashes
INITIAL_USERS = [
    {
        "id": "u-admin-01",
        "username": "admin",
        "email": "admin@moil.nic.in",
        "full_name": "MOIL Executive Administrator",
        "role": "Admin",
        "hashed_password": get_password_hash("MoilAdmin@2026!"),
        "is_active": True,
    },
    {
        "id": "u-[#003366]-02",
        "username": "ops_manager",
        "email": "ops.manager@moil.nic.in",
        "full_name": "Balaghat Operations Director",
        "role": "Operations Manager",
        "hashed_password": get_password_hash("MoilOps@2026!"),
        "is_active": True,
    },
    {
        "id": "u-geo-03",
        "username": "geologist",
        "email": "chief.geologist@moil.nic.in",
        "full_name": "Chief Exploration Geologist",
        "role": "Geologist",
        "hashed_password": get_password_hash("MoilGeo@2026!"),
        "is_active": True,
    },
    {
        "id": "u-field-04",
        "username": "field_officer",
        "email": "field.officer@moil.nic.in",
        "full_name": "Ground Reconnaissance Officer",
        "role": "Field Officer",
        "hashed_password": get_password_hash("MoilField@2026!"),
        "is_active": True,
    },
]

USERS_DB = {u["username"]: u for u in INITIAL_USERS}

# ── Schemas ──────────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserResponse

class LoginRequest(BaseModel):
    username: str
    password: str

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

# ── Rate Limiting Helper ─────────────────────────────────────────────────────

def check_rate_limit(client_ip: str, username: str):
    key = f"{client_ip}:{username}"
    now = time.time()
    record = FAILED_ATTEMPTS.get(key, {"count": 0, "lock_until": 0})

    if record["lock_until"] > now:
        remaining = int(record["lock_until"] - now)
        logger.warning(f"Rate limit triggered for {key}. Locked for {remaining}s")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Please try again in {remaining} seconds.",
        )

def record_failed_attempt(client_ip: str, username: str):
    key = f"{client_ip}:{username}"
    now = time.time()
    record = FAILED_ATTEMPTS.get(key, {"count": 0, "lock_until": 0})
    record["count"] += 1
    
    # Throttle / lock out after 5 consecutive failures for 60 seconds
    if record["count"] >= 5:
        record["lock_until"] = now + 60
        logger.warning(f"Account/IP locked out due to repeated failures: {key}")
    
    FAILED_ATTEMPTS[key] = record

def clear_failed_attempts(client_ip: str, username: str):
    key = f"{client_ip}:{username}"
    FAILED_ATTEMPTS.pop(key, None)

# ── Dependencies ─────────────────────────────────────────────────────────────

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    if token in REVOKED_TOKENS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been revoked/logged out. Please re-authenticate.",
        )

    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    username = payload.get("sub")
    user = USERS_DB.get(username)
    if not user or not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or no longer exists.",
        )

    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
    )

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: UserResponse = Depends(get_current_user)):
        if current_user.role not in allowed_roles and current_user.role != "Admin":
            logger.warning(
                f"Forbidden access attempt by user '{current_user.username}' (role: '{current_user.role}') to role-protected resource. Required: {allowed_roles}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Required role in {allowed_roles}, but current role is '{current_user.role}'.",
            )
        return current_user
    return role_checker

# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)

def login(request: Request, body: LoginRequest):
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip, body.username)

    user = USERS_DB.get(body.username)
    
    # Generic error message to prevent username enumeration
    if not user or not verify_password(body.password, user["hashed_password"]):
        record_failed_attempt(client_ip, body.username)
        log_audit_event(
            username=body.username or "anonymous",
            role=user["role"] if user else "UNKNOWN",
            action="LOGIN_FAILURE",
            resource="/api/auth/login",
            ip_address=client_ip,
            status="FAILED",
            details="Invalid username or password credentials provided.",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled. Contact system administrator.",
        )

    clear_failed_attempts(client_ip, body.username)

    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"], "id": user["id"]}
    )

    log_audit_event(
        username=user["username"],
        role=user["role"],
        action="LOGIN_SUCCESS",
        resource="/api/auth/login",
        ip_address=client_ip,
        status="SUCCESS",
        details=f"User '{user['username']}' authenticated successfully with role '{user['role']}'.",
    )

    user_resp = UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
    )

    return TokenResponse(
        access_token=access_token,
        expires_in_minutes=settings.jwt_expire_minutes,
        user=user_resp,
    )

@router.post("/logout")
def logout(request: Request, token: str = Depends(oauth2_scheme), current_user: UserResponse = Depends(get_current_user)):
    client_ip = request.client.host if request.client else "127.0.0.1"
    REVOKED_TOKENS.add(token)
    
    log_audit_event(
        username=current_user.username,
        role=current_user.role,
        action="LOGOUT",
        resource="/api/auth/logout",
        ip_address=client_ip,
        status="SUCCESS",
        details=f"User '{current_user.username}' signed out successfully.",
    )
    return {"message": "Logged out successfully. Token invalidated."}

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    body: PasswordChangeRequest,
    current_user: UserResponse = Depends(get_current_user),
    request: Request = None,
):
    user = USERS_DB.get(current_user.username)
    if not user or not verify_password(body.old_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long.",
        )

    user["hashed_password"] = get_password_hash(body.new_password)
    USERS_DB[current_user.username] = user

    client_ip = request.client.host if request and request.client else "127.0.0.1"
    log_audit_event(
        username=current_user.username,
        role=current_user.role,
        action="PASSWORD_CHANGED",
        resource="/api/auth/change-password",
        ip_address=client_ip,
        status="SUCCESS",
        details="User updated password securely via bcrypt context.",
    )

    return {"message": "Password updated successfully."}
