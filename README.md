# MnVision 360 — Space-to-Mine Intelligence Platform

MnVision 360 is a professional decision-support web GIS + AI platform for Manganese Exploration and Production Intelligence designed for MOIL (Manganese Ore India Limited).

## Core Principle: Layered Scientific Prospectivity
The platform **never claims to directly detect underground manganese ore from satellite imagery**. Instead, it fuses surface earth observation (Sentinel-2, Sentinel-1, Landsat, SRTM DEM) with geological maps, structural lineaments, geophysics, geochemistry, and known manganese deposits into an explainable, calibrated prospectivity model.

```
Surface satellite evidence
           ↓
Multi-source mineral prospectivity (MnExplore AI)
           ↓
Exploration target (DrillTarget AI)
           ↓
Field validation & Borehole Assays
           ↓
3D Geological Resource Model
           ↓
Mineable block & Operational readiness (MineTwin AI)
           ↓
Production capacity & Shortfall prediction (ShortfallShield AI)
           ↓
AI Decision Engine & Engineer Recommendations
```

---

## 4 Core Intelligence Modules

1. **MnExplore AI**: Multi-source mineral prospectivity mapping combining optical reflectance, radar backscatter, topography, lithology, and structural distance.
2. **DrillTarget AI**: Extraction, clustering, and multi-criteria ranking of high-priority drilling candidates with SHAP explainability.
3. **MineTwin AI**: Digital mine block model distinguishing *Reserve*, *Mineable Ore*, and *Operationally Ready Ore*.
4. **ShortfallShield AI**: Production forecasting (7/15/30 days), operational bottleneck identification, and shortfall risk early warnings.

All converging into the **AI Decision Engine** (Rules + ML + Optimization).

---

## Architecture Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, MapLibre GL JS, Recharts, TanStack Query, Lucide Icons.
- **Backend**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, GeoAlchemy2, Uvicorn.
- **Geospatial & Spatial DB**: PostgreSQL 15, PostGIS 3.4, GeoPandas, Rasterio, Shapely.
- **Machine Learning**: scikit-learn, XGBoost, SHAP, Isolation Forest, OR-Tools.
- **Infrastructure**: Docker, Docker Compose, Nginx, MinIO (Object Store), MLflow.

---

## Quick Start (Docker)

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Start the full stack:
   ```bash
   docker compose up --build -d
   ```

3. Service Access Endpoints:
   - **Frontend GIS Command Center**: [http://localhost](http://localhost) (or port 3000 in dev)
   - **FastAPI Documentation**: [http://localhost/api/docs](http://localhost/api/docs)
   - **Backend Health Check**: [http://localhost/health](http://localhost/health)
   - **PgAdmin Database UI**: [http://localhost:5050](http://localhost:5050)
   - **MinIO Console**: [http://localhost:9001](http://localhost:9001)
   - **MLflow Tracking**: [http://localhost:5000](http://localhost:5000)

---

## Phase Status

- **Phase 1: Project Foundation & Core GIS/DB Scaffold** — In progress
- **Phase 2: Balaghat AOI & Data Quality Engine**
- **Phase 3: Sentinel-2 & DEM Harmonization Pipeline**
- **Phase 4: Multi-Source Feature Cube & XGBoost Model**
- **Phase 5: MineTwin Operational Engine & Decision Center**
