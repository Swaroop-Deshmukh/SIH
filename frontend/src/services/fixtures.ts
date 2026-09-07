import { 
  Mine, 
  MineBlock, 
  DrillTarget, 
  Equipment, 
  ProductionSummary, 
  ProductionForecastPoint,
  ShortfallPrediction,
  PipelineStage,
  Recommendation, 
  DataSource,
  MnOccurrence
} from '../types';

export const FIXTURE_MINES: Mine[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    mine_code: 'BLG-01',
    mine_name: 'North Balaghat Mine',
    location_district: 'Balaghat',
    location_state: 'Madhya Pradesh',
    area_sqkm: 8.64,
    mine_type: 'Underground',
    depth_m: 320,
    annual_capacity_mt: 0.8,
    operational_status: 'OPERATIONAL',
    established_year: 1965,
    data_source: 'PROTOTYPE_SIMULATION'
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    mine_code: 'BLG-02',
    mine_name: 'Central Balaghat Mine (Ukwa)',
    location_district: 'Balaghat',
    location_state: 'Madhya Pradesh',
    area_sqkm: 14.40,
    mine_type: 'Underground',
    depth_m: 480,
    annual_capacity_mt: 1.2,
    operational_status: 'OPERATIONAL',
    established_year: 1958,
    data_source: 'PROTOTYPE_SIMULATION'
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    mine_code: 'BLG-03',
    mine_name: 'South Balaghat Mine (Tirodi)',
    location_district: 'Balaghat',
    location_state: 'Madhya Pradesh',
    area_sqkm: 17.28,
    mine_type: 'Mixed (UG + OC)',
    depth_m: 250,
    annual_capacity_mt: 0.6,
    operational_status: 'OPERATIONAL',
    established_year: 1972,
    data_source: 'PROTOTYPE_SIMULATION'
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    mine_code: 'BLG-04',
    mine_name: 'East Balaghat Mine',
    location_district: 'Balaghat',
    location_state: 'Madhya Pradesh',
    area_sqkm: 9.72,
    mine_type: 'Underground',
    depth_m: 180,
    annual_capacity_mt: 0.4,
    operational_status: 'CARE_MAINTENANCE',
    established_year: 1980,
    data_source: 'PROTOTYPE_SIMULATION'
  },
  {
    id: 'b1000000-0000-0000-0000-000000000005',
    mine_code: 'BLG-05',
    mine_name: 'West Balaghat Development Mine',
    location_district: 'Balaghat',
    location_state: 'Madhya Pradesh',
    area_sqkm: 11.16,
    mine_type: 'Opencast',
    depth_m: 80,
    annual_capacity_mt: 0.3,
    operational_status: 'DEVELOPMENT',
    established_year: 2020,
    data_source: 'PROTOTYPE_SIMULATION'
  }
];

export const FIXTURE_BLOCKS: MineBlock[] = [
  { id: 'c1', block_code: 'A-12', mine_id: 'b1000000-0000-0000-0000-000000000001', estimated_ore_tonnes: 42000, estimated_grade_pct: 31.2, fe_grade_pct: 6.4, development_percent: 95, drilling_percent: 100, blasting_readiness: 'READY', access_readiness: 'READY', equipment_available: true, ventilation_status: 'NORMAL', water_risk: 'LOW', readiness_score: 94, block_status: 'READY', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c2', block_code: 'A-13', mine_id: 'b1000000-0000-0000-0000-000000000001', estimated_ore_tonnes: 38000, estimated_grade_pct: 29.8, fe_grade_pct: 7.1, development_percent: 80, drilling_percent: 90, blasting_readiness: 'IN_PROGRESS', access_readiness: 'READY', equipment_available: true, ventilation_status: 'NORMAL', water_risk: 'LOW', readiness_score: 78, block_status: 'DEVELOPMENT', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c3', block_code: 'A-14', mine_id: 'b1000000-0000-0000-0000-000000000001', estimated_ore_tonnes: 55000, estimated_grade_pct: 33.1, fe_grade_pct: 5.9, development_percent: 60, drilling_percent: 0, blasting_readiness: 'NOT_READY', access_readiness: 'NOT_READY', equipment_available: false, ventilation_status: 'UNKNOWN', water_risk: 'MEDIUM', readiness_score: 42, block_status: 'DEVELOPMENT', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c4', block_code: 'B-17', mine_id: 'b1000000-0000-0000-0000-000000000002', estimated_ore_tonnes: 67000, estimated_grade_pct: 28.4, fe_grade_pct: 8.2, development_percent: 45, drilling_percent: 30, blasting_readiness: 'NOT_READY', access_readiness: 'NOT_READY', equipment_available: false, ventilation_status: 'MAINTENANCE', water_risk: 'HIGH', readiness_score: 25, block_status: 'BLOCKED', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c5', block_code: 'B-18', mine_id: 'b1000000-0000-0000-0000-000000000002', estimated_ore_tonnes: 72000, estimated_grade_pct: 30.5, fe_grade_pct: 6.8, development_percent: 100, drilling_percent: 100, blasting_readiness: 'READY', access_readiness: 'READY', equipment_available: true, ventilation_status: 'NORMAL', water_risk: 'LOW', readiness_score: 91, block_status: 'READY', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c6', block_code: 'B-20', mine_id: 'b1000000-0000-0000-0000-000000000002', estimated_ore_tonnes: 91000, estimated_grade_pct: 32.7, fe_grade_pct: 5.4, development_percent: 100, drilling_percent: 100, blasting_readiness: 'READY', access_readiness: 'READY', equipment_available: true, ventilation_status: 'NORMAL', water_risk: 'LOW', readiness_score: 96, block_status: 'PRODUCING', data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'c7', block_code: 'C-05', mine_id: 'b1000000-0000-0000-0000-000000000003', estimated_ore_tonnes: 31000, estimated_grade_pct: 25.1, fe_grade_pct: 9.0, development_percent: 88, drilling_percent: 95, blasting_readiness: 'READY', access_readiness: 'READY', equipment_available: true, ventilation_status: 'NORMAL', water_risk: 'MEDIUM', readiness_score: 87, block_status: 'READY', data_source: 'PROTOTYPE_SIMULATION' }
];

export const FIXTURE_TARGETS: DrillTarget[] = [
  {
    id: 'd1',
    target_id: 'MN-042',
    area_sqkm: 1.80,
    mean_prospectivity: 0.910,
    max_prospectivity: 0.943,
    uncertainty: 0.180,
    geological_support: 'HIGH',
    structural_support: 'HIGH',
    spectral_support: 'MEDIUM',
    accessibility: 'HIGH',
    data_completeness: 68.0,
    estimated_survey_cost_inr: 850000,
    priority_rank: 1,
    priority_level: 'VERY_HIGH',
    status: 'SURVEY_RECOMMENDED',
    is_prototype: true,
    recommended_action: 'Ground geological survey recommended. High prospectivity supported by proximity to geochemical sample anomalies and structural lineaments.',
    shap_summary: [
      { feature: 'Nearest Geochemical Sample (dist_chem_km)', contribution: 0.31, direction: 'positive' },
      { feature: 'Road Network Proximity (dist_roads_km)', contribution: 0.21, direction: 'positive' },
      { feature: 'SMAP Soil Moisture Index', contribution: 0.06, direction: 'positive' },
      { feature: 'Nearest Sample MnO (%)', contribution: 0.05, direction: 'positive' },
      { feature: 'Sentinel-2 NIR Band (B08)', contribution: 0.05, direction: 'positive' },
      { feature: 'CHIRPS Annual Rainfall', contribution: 0.04, direction: 'positive' },
      { feature: 'Clay Mineral Index (B11/B12)', contribution: 0.03, direction: 'positive' }
    ]
  },
  {
    id: 'd2',
    target_id: 'MN-018',
    area_sqkm: 2.16,
    mean_prospectivity: 0.872,
    max_prospectivity: 0.901,
    uncertainty: 0.220,
    geological_support: 'HIGH',
    structural_support: 'MEDIUM',
    spectral_support: 'HIGH',
    accessibility: 'MEDIUM',
    data_completeness: 54.0,
    estimated_survey_cost_inr: 1200000,
    priority_rank: 2,
    priority_level: 'HIGH',
    status: 'IDENTIFIED',
    is_prototype: true,
    recommended_action: 'Ground magnetic & gravity geophysics recommended to resolve structural uncertainty prior to exploratory drilling.',
    shap_summary: [
      { feature: 'Favourable Sausar Formation (Lithology_LSM)', contribution: 0.16, direction: 'positive' },
      { feature: 'SWIR Band Ratio (B11/B12)', contribution: 0.14, direction: 'positive' },
      { feature: 'Proximity to Mineralization Lines (Mineralization_Line_LSM)', contribution: 0.10, direction: 'positive' },
      { feature: 'DEM Slope & Elevation Profile', contribution: 0.06, direction: 'positive' }
    ]
  },
  {
    id: 'd3',
    target_id: 'MN-074',
    area_sqkm: 3.24,
    mean_prospectivity: 0.823,
    max_prospectivity: 0.861,
    uncertainty: 0.310,
    geological_support: 'MEDIUM',
    structural_support: 'HIGH',
    spectral_support: 'MEDIUM',
    accessibility: 'LOW',
    data_completeness: 41.0,
    estimated_survey_cost_inr: 1650000,
    priority_rank: 3,
    priority_level: 'HIGH',
    status: 'IDENTIFIED',
    is_prototype: true,
    recommended_action: 'Soil geochemistry program recommended. High structural density but elevated uncertainty due to sparse data coverage.',
    shap_summary: [
      { feature: 'Mineralization Line Proximity', contribution: 0.19, direction: 'positive' },
      { feature: 'SRTM Elevation Profile', contribution: 0.09, direction: 'positive' },
      { feature: 'Accessibility Distance (>3km)', contribution: -0.12, direction: 'negative' },
      { feature: 'Sparse Geochemical Sampling', contribution: -0.09, direction: 'negative' }
    ]
  }
];

export const FIXTURE_EQUIPMENT: Equipment[] = [
  { id: 'e1', equipment_code: 'EX-101', mine_id: 'b1000000-0000-0000-0000-000000000001', equipment_type: 'excavator', model_name: 'Komatsu PC2000', manufacturer: 'Komatsu', capacity_unit: 'm3/hr', capacity_value: 350, status: 'OPERATIONAL', availability_pct: 92.4, anomaly_level: 'NORMAL', anomaly_score: 0.12, data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'e2', equipment_code: 'EX-102', mine_id: 'b1000000-0000-0000-0000-000000000002', equipment_type: 'excavator', model_name: 'Liebherr R9350', manufacturer: 'Liebherr', capacity_unit: 'm3/hr', capacity_value: 420, status: 'OPERATIONAL', availability_pct: 88.0, anomaly_level: 'NORMAL', anomaly_score: 0.18, data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'e3', equipment_code: 'EX-103', mine_id: 'b1000000-0000-0000-0000-000000000001', equipment_type: 'drill', model_name: 'Atlas Copco DML', manufacturer: 'Epiroc', capacity_unit: 'm/hr', capacity_value: 18, status: 'OPERATIONAL', availability_pct: 95.1, anomaly_level: 'NORMAL', anomaly_score: 0.08, data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'e4', equipment_code: 'EX-104', mine_id: 'b1000000-0000-0000-0000-000000000002', equipment_type: 'haulage', model_name: 'CAT 777G Dump Truck', manufacturer: 'Caterpillar', capacity_unit: 'tonnes', capacity_value: 91, status: 'MAINTENANCE', availability_pct: 61.2, anomaly_level: 'ANOMALY', anomaly_score: 0.84, contributing_factors: ['Hydraulic pressure drops', 'Excessive engine idle cycles', 'Brake overheating alarms'], data_source: 'PROTOTYPE_SIMULATION' },
  { id: 'e5', equipment_code: 'EX-105', mine_id: 'b1000000-0000-0000-0000-000000000003', equipment_type: 'loader', model_name: 'Komatsu WA600', manufacturer: 'Komatsu', capacity_unit: 'm3/hr', capacity_value: 280, status: 'OPERATIONAL', availability_pct: 89.5, anomaly_level: 'NORMAL', anomaly_score: 0.15, data_source: 'PROTOTYPE_SIMULATION' }
];

export const FIXTURE_PRODUCTION_SUMMARY: ProductionSummary = {
  status: 'OPERATIONAL',
  data_source: 'REAL_PROCESSED_OPERATIONS_DATA',
  target_tonnes: 34883551,
  actual_tonnes: 28886275,
  gap_tonnes: 5997276,
  achievement_pct: 82.8,
  active_mines: 10
};

export const FIXTURE_FORECAST: ProductionForecastPoint[] = [
  { day: '2026-08-26', target: 27169, forecast: 22038, lower: 20275, upper: 27712 },
  { day: '2026-08-27', target: 28778, forecast: 23434, lower: 21559, upper: 29354 },
  { day: '2026-08-28', target: 28226, forecast: 23347, lower: 21479, upper: 28791 },
  { day: '2026-08-29', target: 25641, forecast: 20803, lower: 19139, upper: 26154 },
  { day: '2026-08-30', target: 28663, forecast: 23668, lower: 21775, upper: 29236 },
  { day: '2026-08-31', target: 29288, forecast: 24396, lower: 22444, upper: 29874 },
  { day: '2026-09-01', target: 28508, forecast: 22940, lower: 21105, upper: 29078 }
];

export const FIXTURE_PIPELINE_STAGES: PipelineStage[] = [
  { stage: 'Development', capacity_tpd: 8500, actual_tpd: 6800, utilization_pct: 80.0, status: 'DELAYED' },
  { stage: 'Drilling', capacity_tpd: 8000, actual_tpd: 7200, utilization_pct: 90.0, status: 'NORMAL' },
  { stage: 'Blasting', capacity_tpd: 9000, actual_tpd: 8100, utilization_pct: 90.0, status: 'NORMAL' },
  { stage: 'Loading', capacity_tpd: 7800, actual_tpd: 6900, utilization_pct: 88.5, status: 'NORMAL' },
  { stage: 'Haulage', capacity_tpd: 7200, actual_tpd: 6600, utilization_pct: 91.7, status: 'BOTTLENECK' },
  { stage: 'Hoisting', capacity_tpd: 8000, actual_tpd: 6600, utilization_pct: 82.5, status: 'NORMAL' },
  { stage: 'Processing', capacity_tpd: 10000, actual_tpd: 6600, utilization_pct: 66.0, status: 'NORMAL' }
];

export const FIXTURE_SHORTFALL: ShortfallPrediction = {
  id: 'sf-1',
  mine_name: 'Balaghat Mining Complex (10 Operational Sites)',
  prediction_date: '2026-09-01',
  forecast_period_days: 7,
  target_tonnes: 28508,
  predicted_tonnes: 22940,
  expected_gap_tonnes: 5568,
  shortfall_flag: true,
  risk_score: 0.88,
  risk_level: 'HIGH',
  shap_values: {
    '3-Day Rolling Production Average': 0.24,
    'Equipment Downtime Hours': 0.19,
    'Development Stope Delay': 0.13,
    'Mine Ore Grade Mn (%)': 0.09,
    'Rainfall & Soil Moisture Factor': 0.05
  },
  is_prototype: true
};

export const FIXTURE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    recommendation_id: 'REC-2026-001',
    action: 'Evaluate activation of alternate production block A-12',
    action_type: 'BLOCK_ACTIVATE',
    reason: 'Current 7-day shortfall risk is 88% with a 5,568 t deficit at Balaghat. Block A-12 is 94% operationally ready with cleared haulage routes and active equipment.',
    expected_benefit: 'Estimated mitigation of 3,000 to 4,500 t in production deficit.',
    confidence: 0.88,
    status: 'PENDING_REVIEW',
    is_prototype: true,
    created_at: '2026-09-07T00:00:00Z'
  },
  {
    id: 'r2',
    recommendation_id: 'REC-2026-002',
    action: 'Prioritize ground geological reconnaissance at target MN-042',
    action_type: 'SURVEY_PRIORITY',
    reason: 'High multi-source prospectivity (0.910) backed by favourable Precambrian lithology and lineament intersections. Ground assay needed to validate surface spectral response.',
    expected_benefit: 'Target uncertainty reduction from 0.180 to ~0.100.',
    confidence: 0.82,
    status: 'PENDING_REVIEW',
    is_prototype: true,
    created_at: '2026-09-07T00:00:00Z'
  },
  {
    id: 'r3',
    recommendation_id: 'REC-2026-003',
    action: 'Schedule immediate maintenance overhaul on haulage unit EX-104',
    action_type: 'MAINTENANCE',
    reason: 'Isolation Forest flagged severe idle pattern anomaly (score: 0.84). Running unit risks unplanned stoppage during high-output shift.',
    expected_benefit: 'Prevents estimated 18-hour catastrophic downtime event.',
    confidence: 0.71,
    status: 'PENDING_REVIEW',
    is_prototype: true,
    created_at: '2026-09-07T00:00:00Z'
  }
];

export const FIXTURE_DATA_SOURCES: DataSource[] = [
  { id: 's1', source_id: 'sentinel2_l2a', dataset_name: 'Sentinel-2 Level-2A Harmonized Surface Reflectance', provider: 'ESA Copernicus Hub', data_type: 'RASTER', coverage: 'Balaghat AOI', resolution: '10m / 20m', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'Primary optical bands B2-B12 and indices (NDVI, NDBI, NDWI, Clay, Ferrous).' },
  { id: 's2', source_id: 'sentinel1_grd', dataset_name: 'Sentinel-1 C-band SAR GRD (VV/VH)', provider: 'ESA Copernicus Hub', data_type: 'RASTER', coverage: 'Balaghat AOI', resolution: '~10m', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'All-weather radar backscatter for surface roughness and VV/VH ratio.' },
  { id: 's3', source_id: 'srtm_dem', dataset_name: 'SRTM NASA Digital Elevation Model 1-arcsec', provider: 'NASA / USGS', data_type: 'RASTER', coverage: 'Balaghat AOI', resolution: '30m', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'Topographic elevation, slope, and aspect morphometry.' },
  { id: 's4', source_id: 'geology_gsi', dataset_name: 'GSI 1:50,000 Geological Quadrangle (Schema_DM_LSM.gdb)', provider: 'Geological Survey of India', data_type: 'VECTOR', coverage: 'Balaghat Belt', resolution: '1:50,000', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'Lithology_LSM polygons and Mineralization_Line_LSM features.' },
  { id: 's5', source_id: 'mn_occurrences_public', dataset_name: 'Authoritative Known Manganese Occurrences & Geochemistry', provider: 'GSI / Geochemistry Survey', data_type: 'VECTOR', coverage: 'Balaghat District', resolution: '160 Point Samples', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: '160 geochemical sample locations with Lat, Lon, MnO%, Fe2O3%, SiO2%.' },
  { id: 's6', source_id: 'roads_osm', dataset_name: 'Balaghat Road & Track Network (GeoJSON)', provider: 'OpenStreetMap / OSM', data_type: 'VECTOR', coverage: 'Balaghat District', resolution: '2,057 Road Lines', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'Logistical distance calculation for drill target accessibility.' },
  { id: 's7', source_id: 'weather_chirps', dataset_name: 'CHIRPS Annual Rainfall & SMAP Soil Moisture', provider: 'CHIRPS / SMAP NASA', data_type: 'RASTER', coverage: 'Balaghat AOI', resolution: 'Regional', status: 'AVAILABLE', license: 'Real Data (Loaded)', availability: 100, notes: 'Annual precipitation and soil moisture rasters.' },
  { id: 's8', source_id: 'moil_production', dataset_name: 'MOIL Production & Shift Logs (production_history.csv)', provider: 'MOIL Operations', data_type: 'TABULAR', coverage: '10 Mine Leases', resolution: '66,300 Records', status: 'SYNTHETIC', license: 'Synthetic ML Data', availability: 100, notes: 'Synthetic operational data for shortfall risk classifier.' },
  { id: 's9', source_id: 'moil_equipment', dataset_name: 'MOIL Machinery Telemetry (equipment_history.csv)', provider: 'Sensor Equipment', data_type: 'TABULAR', coverage: 'Fleet Units', resolution: '108,225 Records', status: 'SYNTHETIC', license: 'Synthetic ML Data', availability: 100, notes: 'Equipment operating hours, downtime, and fuel consumption.' },
  { id: 's10', source_id: 'mine_blocks', dataset_name: 'Mine Block Spatial Model (mine_blocks.csv / GeoJSON)', provider: 'MOIL Planning', data_type: 'VECTOR', coverage: '68 Mine Blocks', resolution: 'Block Polygons', status: 'SYNTHETIC', license: 'Synthetic ML Data', availability: 100, notes: 'Mine block readiness, grade, and stripping ratios.' }
];

export const FIXTURE_OCCURRENCES: MnOccurrence[] = [
  { id: 'occ-1', occurrence_id: 'MN-OCC-001', deposit_name: 'Bharweli Deposit Area', latitude: 21.85, longitude: 80.21, formation: 'Sausar Group (Mansar Formation)', ore_type: 'Braunite / Pyrolusite', mn_grade_pct: 38.5, confidence: 'HIGH', label_type: 'POSITIVE', source: 'GSI Quadrangle Memoir' },
  { id: 'occ-2', occurrence_id: 'MN-OCC-002', deposit_name: 'Ukwa Belt Deposit', latitude: 21.96, longitude: 80.46, formation: 'Sausar Group (Mansar Formation)', ore_type: 'Psilomelane / Braunite', mn_grade_pct: 34.0, confidence: 'HIGH', label_type: 'POSITIVE', source: 'GSI Technical Report' },
  { id: 'occ-3', occurrence_id: 'MN-OCC-003', deposit_name: 'Tirodi Deposit Extension', latitude: 21.68, longitude: 79.71, formation: 'Sausar Group (Chorbaoli Formation)', ore_type: 'Braunite Banded', mn_grade_pct: 31.5, confidence: 'HIGH', label_type: 'POSITIVE', source: 'MOIL Public Geological Archive' }
];
