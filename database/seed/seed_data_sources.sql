-- ============================================================
-- MnVision 360 — Data Sources Seed
-- Registers all datasets used in the platform
-- ============================================================

INSERT INTO data_sources (source_id, dataset_name, provider, source_url, data_type, coverage, resolution, crs, status, license, availability, notes)
VALUES
(
  'sentinel2_l2a',
  'Sentinel-2 Level-2A Surface Reflectance (Harmonized)',
  'ESA Copernicus / Google Earth Engine',
  'https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED',
  'RASTER', 'Balaghat AOI', '10m / 20m / 60m', 'EPSG:32643',
  'PENDING_VALIDATION', 'Open Access - Copernicus', NULL,
  'Primary optical dataset. 13 bands. Phase 5 acquisition via GEE. Bands B2-B12 used for spectral features and indices (NDVI, NDMI, NDRE, NDWI). DO NOT use as direct Mn detector.'
),
(
  'sentinel1_grd',
  'Sentinel-1 SAR GRD (C-band)',
  'ESA Copernicus / Google Earth Engine',
  'https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD',
  'RASTER', 'Balaghat AOI', '~10m', 'EPSG:32643',
  'PENDING_VALIDATION', 'Open Access - Copernicus', NULL,
  'SAR VV/VH. Day/night, all-weather. Phase 6 acquisition. Used as supporting surface/structural evidence alongside optical data.'
),
(
  'landsat_c2',
  'Landsat Collection 2 Level-2 (OLI/TIRS)',
  'USGS / Google Earth Engine',
  'https://earthexplorer.usgs.gov/',
  'RASTER', 'Balaghat AOI', '30m', 'EPSG:32643',
  'PENDING_VALIDATION', 'Open Access - USGS', NULL,
  'Historical baseline + thermal (LST). Landsat 8/9. Provides longer time series than Sentinel. Surface temperature anomaly detection.'
),
(
  'srtm_dem',
  'SRTM Digital Elevation Model 1-arc-second',
  'NASA / USGS',
  'https://earthexplorer.usgs.gov/',
  'RASTER', 'Balaghat AOI', '30m', 'EPSG:4326',
  'PENDING_VALIDATION', 'Open Access - NASA', NULL,
  'Primary terrain dataset. Derivatives: elevation, slope, aspect, curvature, hillshade, TPI, TRI, flow accumulation, drainage density.'
),
(
  'geology_gsi',
  'GSI Geological Map of India (1:50,000)',
  'Geological Survey of India',
  'https://bhukosh.gsi.gov.in/',
  'VECTOR', 'Balaghat District', 'Variable (1:50k)', 'EPSG:4326',
  'OPTIONAL', 'Government/Restricted', NULL,
  'Lithology, formations, geological boundaries. Check NGDR portal. May require application. Licensing restrictions may apply.'
),
(
  'ngdr_data',
  'National Geoscience Data Repository',
  'GSI / Ministry of Mines',
  'https://ngdr.gsi.gov.in/',
  'VECTOR', 'Central India', 'Variable', 'EPSG:4326',
  'OPTIONAL', 'Government', NULL,
  'Exploration data, geophysical surveys, geochemical data. GSI is nodal agency. Register and apply for data access.'
),
(
  'bhuvan_geomorph',
  'ISRO Bhuvan — Geomorphology and Lineaments',
  'ISRO / NRSC',
  'https://bhuvan.nrsc.gov.in/',
  'VECTOR', 'Central India', 'Variable', 'EPSG:4326',
  'OPTIONAL', 'Open Access / NRSC', NULL,
  'Geomorphological units, lineaments. Useful for structural feature extraction.'
),
(
  'mn_occurrences_public',
  'Known Manganese Occurrences — Public Sources',
  'GSI / NGDR / Published Literature',
  'https://ngdr.gsi.gov.in/',
  'VECTOR', 'Central India', 'Point', 'EPSG:4326',
  'PENDING_VALIDATION', 'Open Access', NULL,
  'CRITICAL DATASET: Known Mn deposit/occurrence locations used as positive ML labels. Sources: GSI mineral occurrence database, published research, MOIL public reports.'
),
(
  'imd_rainfall',
  'IMD Gridded Rainfall Data',
  'India Meteorological Department',
  'https://imdpune.gov.in/',
  'RASTER', 'Balaghat District', '0.25deg (~25km)', 'EPSG:4326',
  'OPTIONAL', 'Open Access', NULL,
  'Daily/monthly gridded rainfall. Important for ShortfallShield weather features. Register on IMD portal.'
),
(
  'era5_weather',
  'ERA5 Reanalysis — Temperature, Humidity, Soil Moisture',
  'ECMWF / Copernicus Climate Data Store',
  'https://cds.climate.copernicus.eu/',
  'RASTER', 'Central India', '~25km', 'EPSG:4326',
  'PENDING_VALIDATION', 'Open Access - Copernicus', NULL,
  'Long-term reanalysis. Temperature, humidity, soil moisture, wind. Accessible via GEE or CDS API.'
),
(
  'geochemistry_ngdr',
  'Regional Geochemical Survey Data',
  'GSI / NGDR',
  'https://ngdr.gsi.gov.in/',
  'VECTOR', 'Balaghat', 'Survey-dependent', 'EPSG:4326',
  'OPTIONAL', 'Government', NULL,
  'Mn, Fe, SiO2 soil/rock geochemistry. Availability uncertain. If unavailable, mark features as missing — do NOT fabricate data.'
),
(
  'geophysics_ngdr',
  'Airborne Geophysical Survey Data',
  'GSI / NGDR',
  'https://ngdr.gsi.gov.in/',
  'RASTER', 'Balaghat', 'Survey-dependent', 'EPSG:4326',
  'OPTIONAL', 'Government', NULL,
  'Magnetic anomaly, gravity. Important: magnetic anomaly ≠ manganese. Used as supporting geological evidence only.'
),
(
  'moil_production',
  'MOIL Mine Production History',
  'MOIL Limited',
  'Internal / MOIL',
  'TABULAR', 'All MOIL Mines', 'Mine-level daily', NULL,
  'SYNTHETIC', 'Proprietary', 0,
  'PROTOTYPE SIMULATION DATA. Synthetic data with realistic operational relationships. Will be replaced if MOIL provides actual data. Clearly labelled in UI.'
),
(
  'moil_equipment',
  'MOIL Equipment Telemetry and Maintenance',
  'MOIL Limited',
  'Internal / MOIL',
  'TABULAR', 'All MOIL Mines', 'Equipment-level', NULL,
  'SYNTHETIC', 'Proprietary', 0,
  'PROTOTYPE SIMULATION DATA. Synthetic equipment events, maintenance logs, availability metrics. Not real MOIL data.'
),
(
  'moil_operations',
  'MOIL Operational Data (Drilling, Blasting, Haulage)',
  'MOIL Limited',
  'Internal / MOIL',
  'TABULAR', 'All MOIL Mines', 'Shift-level', NULL,
  'SYNTHETIC', 'Proprietary', 0,
  'PROTOTYPE SIMULATION DATA. Synthetic drilling, blasting, haulage cycle data. Not real MOIL data.'
),
(
  'roads_osm',
  'Road Network — Accessibility Layer',
  'OpenStreetMap Contributors',
  'https://www.openstreetmap.org/',
  'VECTOR', 'Balaghat District', 'Variable', 'EPSG:4326',
  'AVAILABLE', 'ODbL', 100,
  'Road network for calculating accessibility scores for drill targets. Download via Overpass API or QGIS OSM plugin.'
)
ON CONFLICT (source_id) DO UPDATE
  SET notes = EXCLUDED.notes,
      updated_at = NOW();
