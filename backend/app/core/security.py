"""
MnVision 360 — Security Utilities
JWT creation/verification and bcrypt password hashing.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# bcrypt context — automatically handles cost factor upgrades
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password helpers ────────────────────────────────────────────────────────

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if *plain_password* matches the stored *hashed_password*."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Return a bcrypt hash of *password*."""
    return pwd_context.hash(password)


# ── JWT helpers ─────────────────────────────────────────────────────────────

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Encode *data* as a signed JWT.

    Args:
        data: Arbitrary claims to embed (e.g. {"sub": user_id}).
        expires_delta: Custom TTL; falls back to ``settings.jwt_expire_minutes``.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(tz=timezone.utc) + (
        expires_delta or timedelta(minutes=settings.jwt_expire_minutes)
    )
    to_encode["exp"] = expire
    return jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT.

    Returns:
        Decoded payload dict, or *None* if the token is invalid/expired.
    """
    try:
        payload: dict = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError:
        return None
