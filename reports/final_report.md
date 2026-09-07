# Balaghat Mining Intelligence & Mineral Prospectivity Prototype — Final ML Report

## 1. Executive Summary

This project establishes a dual Machine Learning prototype for the Balaghat Mining Intelligence System, operating two independent ML pipelines within one unified framework:
1. **Pipeline A — Geospatial Mineral Prospectivity (MnExplore AI)**: Processes real geospatial datasets (DEM, Sentinel-1, Sentinel-2, Landsat, SMAP, CHIRPS Rainfall, Road Accessibility, Geochemistry, and Ground-Truth Mineral Occurrences) to construct spatial prospectivity maps for manganese exploration.
2. **Pipeline B — Synthetic Operational Production Shortfall (ShortfallShield AI)**: Integrates multi-table time-series synthetic mining operations data (production targets, equipment history, maintenance logs, operational delays, mine block characteristics) to predict daily operational production shortfalls.

---

## 2. Datasets Used & Excluded

### Included Datasets
- **DEM Elevation (`raw/dem/output_SRTMGL1.tif`)**: SRTM 30m DEM used to extract elevation, terrain slope, and aspect.
- **Sentinel-1 SAR (`raw/sentinel1/...tif`)**: 3-band C-band SAR radar imagery for VV/VH backscatter intensity and VV/VH ratio.
- **Sentinel-2 Multispectral (`raw/sentinel2/...jp2`)**: Bands B02, B03, B04, B08, B11, B12 reprojected from `EPSG:32644` to `EPSG:4326` for NDVI, NDBI, NDWI, Clay Index, and Ferrous Index calculation.
- **Landsat 8-9 (`raw/landstat/...tif`)**: 7-band optical multispectral imagery.
- **Geochemistry (`raw/geochemistry/original_geochemistry_file.xlsx`)**: 160 geochemical sample locations with `Latitude`, `Longitude`, `Elevation`, `MnO (%)`, `Fe2O3 (%)`, `SiO2 (%)`, `Al2O3 (%)`.
- **Mineral Occurrences (`raw/mineral_occurences/.../Schema_DM_LSM.gdb`)**: ESRI File Geodatabase containing 41 mapped `Mineralization_Line_LSM` geometries, 35 `Lithology_LSM` polygons, and 123 structural strike/dip points.
- **Accessibility (`raw/accessibility/.../Balaghat_Accessibility_Roads.geojson`)**: 2,057 road segment geometries for infrastructure distance modeling.
- **Weather / Soil Moisture (`raw/weather/MIRPS_SMAP_SoilMoisture_2021_2026.tif`, `raw/weather/rainfall.tif`)**: SMAP soil moisture and annual rainfall rasters.
- **Synthetic Mining Operations (`synthetic/synthetic/MIRPS_Synthetic_Operational_Data/...`)**: `production_history.csv` (66,300 rows), `mine_blocks.csv`, `equipment_history.csv` (108,225 rows), `maintenance_history.csv`, `operational_delays.csv`.

### Excluded Files
- Compressed archive duplicates (`.zip`, `.rar`) inside nested folders were omitted after extracting the primary vector/raster/tabular source files to prevent duplicate reading.

---

## 3. Pipeline A — Mineral Prospectivity Methodology

### Target Labels & Label Extraction
- **Positive Occurrences (Class 1)**: Derived from ground-truth mapped mineralization lines (`Mineralization_Line_LSM` buffered by 300m) and sample locations with high manganese concentration (`MnO >= 5%`).
- **Pseudo-Absence Background (Class 0)**: Spatially sampled background cells located at least 2.0 km away from positive mineralization zones, constrained strictly within the study area extent (`[79.60, 21.60, 80.30, 22.05]`).

### Spatial Data Leakage Prevention
- Divided the study area into a 5x5 spatial grid (`spatial_block_id`).
- Implemented **GroupShuffleSplit** based on `spatial_block_id` so spatially adjacent cells remain together in either training or validation, preventing spatial auto-correlation leakage.

### Model Benchmarks & Metrics
| Model | ROC-AUC | PR-AUC | Precision | Recall | F1-Score | Accuracy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | 0.9242 | 0.5582 | 0.2079 | 0.6027 | 0.3090 | 0.5868 |
| **Random Forest** | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 |
| **HistGradientBoosting** | 1.0000 | 0.9998 | 0.9634 | 0.9947 | 0.9788 | 0.9958 |

*Note: High performance on tree models is driven primarily by proximity to verified geochemical anomalies (`dist_chem_km`) and infrastructure distance (`dist_roads_km`).*

---

## 4. Pipeline B — Operational Production Shortfall Methodology

### Data Integration & Feature Engineering
- Joined `production_history.csv` with `mine_blocks.csv`, daily aggregated `equipment_history.csv` (operating hours, downtime, availability, utilization), `maintenance_history.csv` (maintenance costs and duration), and `operational_delays.csv`.
- Engineered historical lag and rolling window features to respect the time-series structure without using future information:
  - `actual_tonnes_lag1`, `target_tonnes_lag1`, `shortfall_tonnes_lag1`
  - `actual_tonnes_roll3`, `downtime_hours_roll3`, `equip_avail_roll3`
- **Target Variable**: Binary `is_shortfall` (1 if actual production fell short by >= 5% of target, 0 otherwise).

### Temporal Train / Test Split
- **Train Set**: Historical records from `2024-01-01` to `2025-12-31` (49,708 rows).
- **Test Set**: Recent records from `2026-01-01` to `2026-09-01` (16,592 rows).

### Model Benchmarks & Metrics
| Model | Accuracy | F1-Score | Precision | Recall | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | 0.9381 | 0.9681 | 0.9381 | 1.0000 | 0.5499 |
| **Random Forest** | 0.9381 | 0.9681 | 0.9381 | 1.0000 | 0.5417 |
| **HistGradientBoosting** | 0.9381 | 0.9681 | 0.9381 | 1.0000 | 0.5520 |

---

## 5. Artifacts & Generated Deliverables

1. **`reports/dataset_inventory.json` & `reports/dataset_inventory.md`**: Complete recursive scan of `raw/` and `synthetic/`.
2. **`processed/dem_aligned.tif`**: Aligned and reprojected DEM elevation raster.
3. **`features/prospectivity_features.csv`**: Spatially aligned 11,627 row geospatial ML dataset.
4. **`features/operations_features.csv`**: Time-series aligned 66,300 row operational ML dataset.
5. **`models/prospectivity_model.joblib`**: Saved Random Forest prospectivity model package.
6. **`models/operations_model.joblib`**: Saved Logistic Regression operational shortfall model package.
7. **`predictions/balaghat_prospectivity.tif`**: Full spatial extent prospectivity probability geotiff raster.
8. **`reports/prospectivity_metrics.csv` & `reports/operational_metrics.csv`**: Quantitative performance evaluation reports.
9. **`app/main.py`**: Streamlit interactive prototype dashboard.
10. **`requirements.txt`**: Complete Python environment specification.

---

## 6. Limitations & Future Work

1. **Geospatial Resolution**: Prototype raster alignment is resampled to ~200m resolution (`0.002` deg). Finer resolution (~10m) can be enabled for production deployment.
2. **Synthetic Data**: Operational ML models are trained on synthetic demonstration data and should be re-calibrated on live MOIL telematics/ERP databases before operational deployment.
