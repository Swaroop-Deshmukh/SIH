# MnVision 360 — Security Architecture & Governance Blueprint

## 1. Security Architecture Overview

The **MnVision 360 Space-to-Mine Intelligence Platform** implements a multi-layered, zero-trust security deployment architecture designed for Government PSU compliance (MOIL / Ministry of Steel).

```
Browser (TLS 1.3 / HTTPS)
   ↓
Nginx Reverse Proxy (Rate Limiting, CSP & Security Headers)
   ↓
FastAPI Hardened Gateway (JWT Authentication & Throttling)
   ↓
Role-Based Access Control (RBAC Dependency Layer)
   ↓
Application Domain Services & Audit Logger
   ↓
PostgreSQL / PostGIS Spatial Database Lake + ML Engine
```

---

## 2. Authentication & Identity Management

- **Password Hashing**: Uses `passlib` with `bcrypt` cost-factor hashing. Plaintext passwords are never stored or logged.
- **JWT Session Tokens**: Standard `HS256` signed JSON Web Tokens containing sub, role, and expiration timestamp claims (`exp`).
- **Token Expiration & Invalidation**: Short-lived access tokens (configured via `JWT_EXPIRE_MINUTES`) with an in-memory blacklisting mechanism for instant server-side revocation on logout.
- **Login Throttling & Rate Limiting**: Consecutive failed login attempts from the same IP/username are limited to 5 attempts per minute before incurring automatic 60-second lockouts. Generic error messages prevent username enumeration.

---

## 3. Role-Based Access Control (RBAC) Matrix

Backend endpoints strictly enforce role authorization via FastAPI dependencies (`require_roles([...])`):

| Role | Permissions & Scope | Accessible System Modules |
|---|---|---|
| **Admin** | Full system administration, security center, user management, audit logs, model & data registry | All System Modules, Security Center, Audit Logs, Users |
| **Operations Manager** | Production forecasting, shortfall shield, equipment anomaly tracking, digital twin models, decision recommendations | Dashboard, Production, Shortfall, Equipment, MineTwin, Decision Center, MnAssist |
| **Geologist** | Multi-source GIS exploration, satellite reflectance, structural lineaments, Mn occurrences, drill targets | Exploration GIS, Satellite/GIS, Geology, Mn Occurrences, Drill Targets, MnAssist |
| **Field Officer** | Ground reconnaissance observations, field sample logging, secure file uploads, drillhole verification | Field Mode, Targets, Field Observations, Field File Uploads |

---

## 4. Real-Time Audit Logging System

Every security and operational event is recorded to the audit log system (`app/services/audit_service.py`):
- **Events Logged**: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `PASSWORD_CHANGED`, `EXPLORATION_TARGET_VIEWED`, `PRODUCTION_FORECAST_VIEWED`, `RECOMMENDATION_APPROVED`, `RECOMMENDATION_REJECTED`, `FIELD_OBSERVATION_SUBMITTED`, `FIELD_FILE_UPLOADED`, `UNSAFE_FILE_UPLOAD_BLOCKED`.
- **Recorded Fields**: Timestamp (UTC), Username, Role, Action, Target Resource, Client IP Address, Status (`SUCCESS` / `FAILED` / `BLOCKED`), and Context Details.
- **Data Protection**: Credentials, passwords, JWT secrets, and raw keys are strictly sanitized and never saved to logs.

---

## 5. Network & HTTP Security Headers

Configured via Nginx and FastAPI middleware:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Tailored CSP allowing OpenStreetMap tile servers, MapLibre GL WebGL shaders, local APIs, and static assets without exposing cross-site script vulnerabilities.

---

## 6. Safe Error Handling & File Security

- **Safe Error Responses**: Internal exception handlers catch unexpected errors and return generic error responses (`500 Internal Server Error`) to prevent stack trace, filesystem path, or database URL leakage.
- **File Upload Protection**: Validates file extension against white-listed formats (`.csv`, `.xlsx`, `.geojson`, `.png`, `.jpg`, `.pdf`), enforces a 10MB file size ceiling, and sanitizes filenames to prevent path traversal attacks.
