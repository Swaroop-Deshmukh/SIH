# MnVision 360 — Architecture Documentation

```
                           USERS & MOIL ENGINEERS
                                     │
                                     ▼
                 ┌───────────────────────────────────────┐
                 │     React + MapLibre Command Center   │
                 │                                       │
                 │ GIS Map • Dashboards • SHAP Explanations│
                 │ Block Readiness • Forecasts • Actions │
                 └───────────────────┬───────────────────┘
                                     │ REST / JSON
                                     ▼
                 ┌───────────────────────────────────────┐
                 │          FastAPI Gateway              │
                 └───────────────────┬───────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
   PostgreSQL 15                ML Services               GIS Processing
    + PostGIS 3.4                    │                         │
           │        ┌────────────────┼────────────────┐        │
           │        ▼                ▼                ▼        ▼
           │   MnExplore AI     MineTwin AI    ShortfallShield Spatial Cubes
           │  (Prospectivity)  (Block Ready)     (Forecasting)  & Clipping
           │        │                │                │        │
           │        └────────────────┼────────────────┘        │
           │                         ▼                         │
           └─────────────────► Decision Engine ◄───────────────┘
                               (Rules/OR-Tools)
                                     │
                                     ▼
                              Recommendations
```

## Six Integrated Technical Layers

1. **Space Observation Layer**:
   - Optical: Sentinel-2 (L2A harmonized surface reflectance, 10-20m bands B2-B12, SWIR ratios, NDVI, NDMI, NDRE).
   - SAR: Sentinel-1 (C-band GRD, VV/VH backscatter, surface roughness).
   - Elevation: NASA SRTM DEM (30m, slope, aspect, curvature, Topographic Position Index).
   - Thermal/Historical: Landsat Collection 2.

2. **Geoscience Evidence Layer**:
   - Lithology and geological formations (GSI / NGDR).
   - Structural geometry: Faults, lineaments, shear zones, contact distances.
   - Known occurrences: Positive label ground truth from public GSI and literature records.
   - Geochemistry & Airborne Geophysics: Fe, Mn anomalies, magnetic and gravity signatures.

3. **Machine Learning & Explainability**:
   - Spatial Block Cross-Validation (SpatialBlockCV) to prevent spatial autocorrelation leakage.
   - Models: Calibrated XGBoost & Random Forest Prospectivity Models.
   - Explainability: SHAP feature contributions for each candidate drill target.
   - Operational Time-Series & Anomaly Detection: Random Forest Regressor & Isolation Forest for machinery telemetry.

4. **Spatial Intelligence & Storage**:
   - PostGIS 3.4 with 25 relational tables and GIST 2D/3D spatial indices.
   - Unified 30m x 30m analysis grid with data completeness and native resolution tracking.

5. **Mine Operational Digital Twin (MineTwin)**:
   - Structural differentiation: In-situ Reserve vs. Mineable Ore vs. Operationally Ready Ore.
   - Granular readiness scoring across access, development, drilling, blasting, ventilation, and machinery.

6. **Decision Intelligence**:
   - Tier 1: Deterministic rules for safety and operational thresholds.
   - Tier 2: Machine learning risk projections and shortfall early warning.
   - Tier 3: Mathematical optimization (Google OR-Tools) for resource allocation.
   - Human-in-the-loop: Every automated recommendation is flagged as `PENDING_REVIEW` for engineer authorization.
