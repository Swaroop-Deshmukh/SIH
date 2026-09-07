# MnVision 360 — Dataset Availability Matrix & Source Audit

**Date**: September 7, 2026  
**Platform**: MnVision 360 — Space-to-Mine Intelligence Platform  
**Target Area**: Balaghat Manganese Belt, Madhya Pradesh, India (`EPSG:4326` / `EPSG:32644`)

---

## 1. DATASET AVAILABILITY MATRIX

The following dataset availability matrix details all exploration, geological, and operational datasets within MnVision 360. Each dataset is assigned a formal status according to the platform specification:
- `AVAILABLE`: Validated real dataset present in data lake directory.
- `PROCESSING`: Dataset present but awaiting feature extraction / reprojection.
- `UNAVAILABLE`: Real dataset not present in local data lake; ML pipeline handles gracefully via dynamic feature reduction.
- `OPTIONAL`: Supplementary dataset for model enhancement.
- `SYNTHETIC`: Generated simulation data clearly labeled as **"Prototype Simulation Data"**.
- `PENDING_VALIDATION`: Dataset ingested but undergoing spatial integrity and CRS verification.

| Dataset ID | Dataset Name | Provider / Source | Data Type | Coverage | Native Res / Scale | CRS | Status | Category Label | ML Feature Usage | Missing Handling Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ds-aoi-01` | **Balaghat AOI** | GSI / State Boundary | Vector (GeoJSON) | Balaghat Manganese Belt | Polygon Boundary | `EPSG:4326` | `AVAILABLE` | **REAL DATA** | Spatial bounding mask & coordinate clip boundary | Required base geometry; platform default |
| `ds-sentinel2-01` | **Sentinel-2 L2A Surface Reflectance** | ESA / Copernicus Hub | Multi-spectral Raster (GeoTIFF) | Balaghat AOI | 10m - 20m | `EPSG:32644` | `UNAVAILABLE` | **REAL DATA** | B2-B12, NDVI, NDMI, NDWI, NDRE, B11/B12, B8/B11 | Exclude spectral indices; report completeness reduction |
| `ds-sentinel1-01` | **Sentinel-1 SAR GRD** | ESA / Copernicus Hub | C-band SAR Raster (GeoTIFF) | Balaghat AOI | 10m | `EPSG:32644` | `UNAVAILABLE` | **REAL DATA** | VV, VH, VV/VH ratio, surface roughness | Exclude SAR backscatter features |
| `ds-dem-01` | **SRTM 30m Digital Elevation Model** | NASA / USGS | Elevation Raster (GeoTIFF) | Balaghat AOI | 30m | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Elevation, Slope, Aspect, Curvature, TPI, TRI, TWI | Exclude morphometric terrain features |
| `ds-geology-01` | **Lithology & Stratigraphy** | GSI / NGDR | Vector (Shapefile) | Balaghat AOI | 1:50,000 | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Lithological units, Sausar Group formations, contacts | Exclude lithological categorical encoding |
| `ds-faults-01` | **Faults & Lineaments** | GSI / NGDR | Vector (Shapefile) | Balaghat AOI | 1:50,000 | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Distance to faults, Lineament density, Structural orientation | Exclude structural spatial proximity rasters |
| `ds-occurrences-01` | **Known Mn Occurrences** | GSI / MOIL Records | Point Vector (CSV/GeoJSON) | Balaghat Belt | Point Locations | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Positive deposit labels for prospectivity training | Rely on geological deposit catalog / synthetic seed |
| `ds-geochem-01` | **Soil/Sediment Geochemistry** | GSI National Geochemical Mapping | Point / Grid Vector | Balaghat AOI | Variable | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Mn, Fe, P, SiO2 assay concentrations | Exclude geochemical layer; flag data completeness |
| `ds-geophys-01` | **Aeromagnetic & Gravity Grids** | GSI National Geophysical Mapping | Raster Grid | Balaghat AOI | 100m | `EPSG:4326` | `UNAVAILABLE` | **REAL DATA** | Magnetic anomaly, Bouguer gravity anomaly | Exclude geophysics layer; flag data completeness |
| `ds-mines-01` | **Active Mine Coordinates** | MOIL Operational Records | Spatial Points | Balaghat, Ukwa, Bharweli | Site Boundary | `EPSG:4326` | `SYNTHETIC` | **PROTOTYPE SIMULATION DATA** | MineTwin GIS visualization & site context | Built-in fixture data; explicitly labeled |
| `ds-blocks-01` | **3D Mine Block Model** | MOIL Mine Planning | Spatial Polygons | Active Mines | 10m x 10m x 5m | `EPSG:32644` | `SYNTHETIC` | **PROTOTYPE SIMULATION DATA** | Block Readiness Matrix & ore grade estimates | Built-in fixture data; explicitly labeled |
| `ds-production-01` | **Production History** | MOIL Plant Logs | Time-Series (JSON/Tabular) | Monthly Targets | Tonnage Output | N/A | `SYNTHETIC` | **PROTOTYPE SIMULATION DATA** | Production forecasting & ShortfallShield alerts | Built-in fixture data; explicitly labeled |
| `ds-telemetry-01` | **Equipment Telemetry Stream** | IoT Machinery Sensors | Time-Series (JSON) | Active Fleet | 1-min interval | N/A | `SYNTHETIC` | **PROTOTYPE SIMULATION DATA** | Heavy machinery anomaly detection (Isolation Forest) | Built-in fixture data; explicitly labeled |

---

## 2. DYNAMIC FEATURE SELECTION & COMPLETENESS SCORING

The MnVision 360 exploration engine evaluates feature availability dynamically at runtime without crashing or inventing synthetic values for missing satellite/geological files:

$$ \text{Data Completeness Score (\%)} = \left( \frac{\sum \text{Weight of Available Features}}{\sum \text{Weight of All System Features}} \right) \times 100 $$

### Current Data Completeness Breakdown:
- **Registered Exploration Datasets**: 1 / 9 Available (`Balaghat AOI`)
- **Current Exploration Data Completeness**: **11%** (Baseline Spatial AOI Only)
- **Model Execution Policy**: When raw raster/vector files are missing in `data/raw/`, the system gracefully reports `UNAVAILABLE` and utilizes synthetic prototype feature grids for UI verification, ensuring strict scientific integrity and transparent data provenance.

---

## 3. PROTTOYPE VS REAL DATA LABELS

To maintain complete transparency with stakeholders and executive leadership:
1. **Exploration Modules** (Prospectivity Map, Target Analysis, Data Models):
   - Displays **`REAL DATA`** when backed by authoritative satellite (Sentinel), elevation (SRTM), or GSI geological datasets.
   - Displays **`PROTOTYPE SIMULATION DATA`** badge when running on fallback development grids.
2. **Operational Modules** (MineTwin, Production Forecast, Equipment Fleet, Decision Center):
   - Always displays the **`PROTOTYPE SIMULATION DATA`** badge until authorized, confidential MOIL operational telemetry streams are integrated.
