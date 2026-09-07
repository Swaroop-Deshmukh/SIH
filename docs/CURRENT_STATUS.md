# MnVision 360 — Current Project Status Audit

**Date**: September 7, 2026  
**Platform**: MnVision 360 — Space-to-Mine Intelligence Platform  
**Target Area**: Balaghat Manganese Belt, Madhya Pradesh, India (`EPSG:4326` / `EPSG:32644`)

---

## 1. COMPLETED

### Frontend Architecture (React + Vite + TypeScript + Tailwind CSS + MapLibre GL + Recharts)
- **9 Operational Modules**:
  - `CommandCenter` (`/`): Executive production, shortfall risk, equipment availability, prospectivity map summary.
  - `ExplorationMap` (`/exploration`): Interactive MapLibre map with Prospectivity, Uncertainty, Targets, and Target Analysis sub-tabs.
  - `DrillPlanning` (`/drill-planning`): Exploratory target queue, spatial coordinates, priority scores, and drill core specs.
  - `MineTwin` (`/minetwin`): Mines overview, 3D/2D Mine Block Model viewer, and Block Readiness Matrix.
  - `Production` (`/production`): Production forecast charts, shortfall alerts, and bottleneck diagnostics.
  - `Equipment` (`/equipment`): Heavy machinery telemetry cards, health statuses, and anomaly alerts.
  - `DecisionCenter` (`/decision-center`): Human-in-the-loop operational recommendations and cost-benefit trade-offs.
  - `FieldSurvey` (`/field-survey`): Field verification log and ground-truth sample entry.
  - `DataModels` (`/data-models`): Geospatial data availability matrix and ML model registry.
- **UI Architecture & Components**:
  - Navigation Sidebar & Top Header with status metrics.
  - Standardized UI states: `LoadingState`, `EmptyState`, `ErrorState` (`src/components/StatusStates.tsx`).
  - `PrototypeBadge` component indicating synthetic operational data.
  - Verified clean production build (`npm run build` -> `dist/index.html`).

### Backend Architecture (FastAPI + Uvicorn + Pydantic v2)
- **REST API Routers**:
  - `health` (`GET /health`): System health & database connection validator.
  - `mines` (`GET /api/mines`): Active mine sites (Balaghat, Ukwa, Bharweli).
  - `exploration` (`GET /api/exploration/prospectivity`, `GET /api/exploration/uncertainty`, `POST /api/exploration/run`): Exploration layers API.
  - `targets` (`GET /api/targets`, `GET /api/targets/{id}`): Drill target polygons and multi-criteria rankings.
  - `production` (`GET /api/production/forecast`, `GET /api/production/shortfall`): Operational forecasting & risk endpoints.
  - `equipment` (`GET /api/equipment/telemetry`, `GET /api/equipment/anomalies`): Heavy machinery telemetry endpoints.
  - `blocks` (`GET /api/blocks`, `GET /api/blocks/readiness`): Mine block model & readiness scores.
  - `recommendations` (`GET /api/recommendations`): Decision engine recommendations.
  - `field` (`GET /api/field/surveys`, `POST /api/field/surveys`): Ground-truth survey logs.
- **Fallback Architecture**: Gracefully switches to in-memory prototype fixtures when PostGIS is offline.

### PostGIS Database Schema (`database/schema.sql`)
- **25 Relational & Spatial Tables**:
  - Geospatial: `aoi_boundaries`, `spatial_features`, `mn_occurrences`, `geology_units`, `fault_lineaments`
  - Exploration: `prospectivity_outputs`, `uncertainty_outputs`, `drill_targets`, `drill_target_analysis`, `shap_explanations`
  - MineTwin: `mines`, `mine_blocks`, `block_readiness`, `geotechnical_logs`
  - Production: `production_targets`, `production_actuals`, `production_forecasts`, `shortfall_alerts`, `bottlenecks`
  - Equipment: `equipment_fleet`, `equipment_telemetry`, `equipment_anomalies`, `maintenance_tickets`
  - Decision & Field: `decision_recommendations`, `field_surveys`, `dataset_registry`, `ml_model_registry`

### Geospatial Ingestion Architecture (`geospatial/`)
- **Study Area AOI**: Balaghat AOI (`data/raw/boundaries/balaghat_aoi.geojson`) covering `79.50° E, 21.50° N` to `80.60° E, 22.10° N`.
- **Modular Data Ingestors**:
  - `AOIManager`: Boundary loading, spatial bounds, clipping mask creation.
  - `RasterIngestor`: Rasterio / rioxarray ingestion, resolution validation, CRS transformation.
  - `VectorIngestor`: GeoPandas ingestion, spatial index build, geometry clipping.
  - `DatasetRegistry`: Dynamic availability tracking system reporting `UNAVAILABLE` for missing raw datasets.
- **Unit Testing**: Pytest test suite (`tests/geospatial/test_ingestion.py`) passing 5/5 tests.

---

## 2. IN PROGRESS

- **Live Local Execution**:
  - React Frontend dev server running on `http://localhost:3000` (Task ID: `task-487`).
  - FastAPI Backend REST server running on `http://localhost:8000` (Task ID: `task-534`).

---

## 3. MISSING

- **Real Feature Calculation Pipeline**:
  - Sentinel-2 multi-spectral band index calculations (NDVI, NDMI, NDWI, NDRE, mineral ratios B11/B12, B8/B11).
  - Sentinel-1 SAR backscatter processing (VV, VH, VV/VH ratio, surface roughness).
  - SRTM DEM morphometry calculation (slope, aspect, profile/plan curvature, hillshade, TPI, TRI, TWI).
  - Geology & Structural proximity rasters (distance to faults, distance to lineaments, lithology rasterization).
- **Spatial Feature Cube**:
  - GeoParquet / PostGIS multi-variate raster grid (`data/features/mn_exploration_features.parquet`).
- **Real Exploration ML Pipeline**:
  - `SpatialBlockCV` block cross-validation module to eliminate spatial autocorrelation leakage.
  - Exploration Prospectivity Model training (Logistic Regression -> Random Forest -> XGBoost Classifier).
  - SHAP explainability engine generating model-attributed feature importance values.
  - Ensemble Variance / Tree Variance spatial uncertainty engine.
  - GeoTIFF raster generator (`prospectivity.tif`, `uncertainty.tif`).
- **DrillTarget AI Extraction Engine**:
  - Spatial raster thresholding, connected components polygon extraction, and multi-criteria target ranking.
- **Operational ML Models**:
  - ShortfallShield production forecasting regressor (`XGBRegressor`) & shortfall risk classifier.
  - Heavy Machinery anomaly detector (`IsolationForest`).
- **Decision Engine**:
  - Human-in-the-loop recommendation builder (OR-Tools / rule-based optimization solver).

---

## 4. DATA AVAILABLE

| Dataset | Source / Location | Type | Availability Status |
| :--- | :--- | :--- | :--- |
| **Balaghat Study Area AOI** | `data/raw/boundaries/balaghat_aoi.geojson` | Vector GeoJSON | `AVAILABLE` (Real Data) |
| **Mine Locations** | Prototype Fixtures (`backend/app/api/mines.py`) | Spatial Points | `SYNTHETIC` (Prototype Simulation Data) |
| **Mine Block Model** | Prototype Fixtures (`backend/app/api/blocks.py`) | Spatial Polygons | `SYNTHETIC` (Prototype Simulation Data) |
| **Production History** | Prototype Fixtures (`backend/app/api/production.py`) | Time-Series | `SYNTHETIC` (Prototype Simulation Data) |
| **Equipment Telemetry** | Prototype Fixtures (`backend/app/api/equipment.py`) | Time-Series | `SYNTHETIC` (Prototype Simulation Data) |
| **Decision Recommendations**| Prototype Fixtures (`backend/app/api/recommendations.py`) | Relational JSON | `SYNTHETIC` (Prototype Simulation Data) |

---

## 5. DATA MISSING

| Missing Dataset | Required File Location | Required Format | Current Status |
| :--- | :--- | :--- | :--- |
| **Sentinel-2 L2A Imagery** | `data/raw/sentinel2/` | GeoTIFF (B2-B12) | `UNAVAILABLE` |
| **Sentinel-1 SAR Imagery** | `data/raw/sentinel1/` | GeoTIFF (VV, VH) | `UNAVAILABLE` |
| **SRTM NASA DEM** | `data/raw/dem/` | GeoTIFF (Elevation) | `UNAVAILABLE` |
| **GSI/NGDR Geology** | `data/raw/geology/` | Shapefile / GeoJSON | `UNAVAILABLE` |
| **Faults & Lineaments** | `data/raw/faults/` | Shapefile / GeoJSON | `UNAVAILABLE` |
| **Known Mn Occurrences** | `data/raw/occurrences/` | CSV / GeoJSON | `UNAVAILABLE` |
| **Geochemistry Assays** | `data/raw/geochemistry/` | CSV / Point GeoJSON | `UNAVAILABLE` |
| **Geophysics Anomalies** | `data/raw/geophysics/` | GeoTIFF / Grid | `UNAVAILABLE` |

---

## 6. ML TO IMPLEMENT

1. **`ml/exploration/preprocessing.py`**: Spatial data normalization, missing value handling, spatial alignment.
2. **`ml/exploration/features/spectral.py`**: Sentinel-2 spectral indices & ratios calculator.
3. **`ml/exploration/features/sar.py`**: Sentinel-1 SAR polarimetric indices calculator.
4. **`ml/exploration/features/terrain.py`**: SRTM DEM morphometry & hydrological indicators calculator.
5. **`ml/exploration/features/structural.py`**: Euclidean spatial proximity to lineaments, faults, and contact zones.
6. **`ml/exploration/training/spatial_cv.py`**: `SpatialBlockCV` splitting algorithm.
7. **`ml/exploration/training/trainer.py`**: Progressive model training (Logistic Regression -> Random Forest -> XGBoost).
8. **`ml/exploration/evaluation/metrics.py`**: Evaluation engine computing ROC-AUC, PR-AUC, F1, Precision@K, Recall@K.
9. **`ml/exploration/explainability/shap_engine.py`**: SHAP explainer for global & local model-attributed feature contributions.
10. **`ml/exploration/inference/uncertainty.py`**: Monte Carlo / Ensemble spatial variance engine.
11. **`ml/drill_target/extractor.py`**: Watershed polygon extraction & multi-criteria target ranker.
12. **`ml/shortfall/forecaster.py`**: Production time-series regressor & shortfall risk classifier.
13. **`ml/anomaly/equipment_detector.py`**: Heavy machinery Isolation Forest anomaly detector.
14. **`ml/decision_engine/optimizer.py`**: Multi-objective decision recommendation engine.

---

## 7. INTEGRATION TO IMPLEMENT

1. **FastAPI ML Bridge**: Connect python ML inference engines directly into `/api/exploration/prospectivity`, `/api/exploration/uncertainty`, `/api/targets`, `/api/production/forecast`, `/api/equipment/anomalies`, `/api/recommendations`.
2. **React UI Layer Status Indicators**:
   - Add top header badge: `REAL DATA` (for exploration datasets) vs `PROTOTYPE SIMULATION DATA` (for operational mine/production/equipment data).
   - Add Data Completeness indicators ($0\% - 100\%$) based on active registered data sources.
3. **MOIL Corporate Visual Refinement**: Update header accents, navigation typography, institutional color tones, and PSU presentation layout without modifying application routes or core functionality.
