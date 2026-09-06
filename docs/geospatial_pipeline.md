# MnVision 360 — Geospatial Ingestion Architecture

## 1. Overview
The **MnVision 360 Geospatial Ingestion Pipeline** provides a modular, configuration-driven foundation for reading, validating, reprojecting, clipping, and quality-auditing multi-source Earth observation (optical/SAR), topography, geology, and mineral deposit datasets across the Balaghat Manganese Belt Area of Interest (AOI).

```
                      BALAGHAT AOI GEOJSON
                     (data/raw/boundaries/)
                               │
                               ▼
                        AOIManager
                    (CRS Normalization)
                               │
   ┌───────────────────────────┼───────────────────────────┐
   ▼                           ▼                           ▼
RasterIngestor             VectorIngestor            DatasetRegistry
 (Rasterio)                 (GeoPandas)             (Status Tracking)
   │                           │                           │
   ├── Sentinel-2              ├── Geology Vector          ├── AVAILABLE
   ├── Sentinel-1              └── Mn Occurrences          └── UNAVAILABLE
   └── SRTM DEM
```

---

## 2. Spatial AOI Boundary
- **Path**: [`data/raw/boundaries/balaghat_aoi.geojson`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/data/raw/boundaries/balaghat_aoi.geojson)
- **Bounding Box (WGS84 EPSG:4326)**: `[79.50° E, 21.50° N]` to `[80.60° E, 22.10° N]`
- **Target Projection (UTM Zone 44N)**: `EPSG:32643`

---

## 3. Configuration-Driven Architecture
Dataset paths, spatial data types, expected CRS, band signatures, and requirement tags are specified in [`geospatial/config.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/config.py). 

New datasets (e.g. Geochemistry, Landsat Collection 2, Aeromagnetic rasters) can be registered in `GeospatialConfig` without modifying the core ingestion logic.

---

## 4. Ingestion & Validation Capabilities ([`geospatial/base.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/base.py))

- **AOIManager**: Loads study area boundary, validates geometry integrity, and handles CRS re-projecting.
- **RasterIngestor**:
  - Spatial metadata extraction: Bounds, CRS, dimensions, resolution, band counts, nodata values, data types, and valid pixel percentage.
  - Reprojection & clipping: Reprojects rasters to target CRS (default `EPSG:32643`) and clips extent precisely to the AOI polygon using Rasterio mask routines.
- **VectorIngestor**:
  - Feature loading & metadata extraction: Geometry types, feature counts, CRS, and validity flags.
  - Geometry validation: Detects and fixes invalid geometries using Shapely (`make_valid`) and removes empty geometries.
  - Spatial clipping: Reprojects and clips vector features to AOI boundary via GeoPandas.
- **DatasetRegistry**:
  - Scans data lake directories (`data/raw/`).
  - Reports dataset availability (`AVAILABLE` vs `UNAVAILABLE`) without inventing or fabricating artificial layers.

---

## 5. Reusable Dataset Ingestors

1. **`Sentinel2Ingestor`** ([`geospatial/sentinel2/ingestor.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/sentinel2/ingestor.py)): Surface reflectance bands B2-B12.
2. **`Sentinel1Ingestor`** ([`geospatial/sentinel1/ingestor.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/sentinel1/ingestor.py)): C-band SAR radar backscatter (VV, VH).
3. **`DEMIngestor`** ([`geospatial/dem/ingestor.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/dem/ingestor.py)): NASA SRTM 30m Digital Elevation Model.
4. **`GeologyIngestor`** ([`geospatial/geology/ingestor.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/geology/ingestor.py)): GSI Sausar Group formations & structural lineaments.
5. **`OccurrencesIngestor`** ([`geospatial/occurrences/ingestor.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/geospatial/occurrences/ingestor.py)): Known ground truth manganese occurrences.

---

## 6. Scientific Integrity & Data Lake Strategy
If raw files are not present in `data/raw/`, the ingestors log warning messages and report `status: UNAVAILABLE`. **The pipeline does not fabricate synthetic rasters or fake mineral occurrences.**
