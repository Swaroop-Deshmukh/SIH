-- ============================================================
-- MnVision 360 — Prototype Simulation Data Seed
-- ⚠ ALL DATA BELOW IS PROTOTYPE SIMULATION DATA
-- Not real MOIL operational data
-- Balaghat area coordinates (~21.83°N, 80.18°E)
-- ============================================================

-- ============================================================
-- MODEL VERSION (placeholder before real ML training)
-- ============================================================
INSERT INTO model_versions (
  id, model_name, version, model_type, module, features, metrics, status, notes
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'MnProspectivity',
  'v0.1-prototype',
  'PrototypeFixture',
  'exploration',
  '["B4","B8","B11","NDVI","elevation","slope","distance_fault"]'::JSONB,
  '{"note": "Prototype fixture values — not from real ML training", "roc_auc": null}'::JSONB,
  'DEVELOPMENT',
  'Phase 1 prototype. No real training performed. Placeholder for pipeline validation.'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- MINES (5 prototype MOIL-style mines near Balaghat)
-- ⚠ PROTOTYPE SIMULATION DATA
-- ============================================================
INSERT INTO mines (id, mine_code, mine_name, location_district, location_state,
  geometry, centroid, area_sqkm, mine_type, depth_m, annual_capacity_mt,
  operational_status, established_year, data_source)
VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'BLG-01', 'North Balaghat Mine',
  'Balaghat', 'Madhya Pradesh',
  ST_GeomFromText('POLYGON((80.12 21.89, 80.15 21.89, 80.15 21.87, 80.12 21.87, 80.12 21.89))', 4326),
  ST_GeomFromText('POINT(80.135 21.88)', 4326),
  8.64, 'underground', 320.0, 0.8,
  'OPERATIONAL', 1965, 'PROTOTYPE_SIMULATION'
),
(
  'b1000000-0000-0000-0000-000000000002',
  'BLG-02', 'Central Balaghat Mine',
  'Balaghat', 'Madhya Pradesh',
  ST_GeomFromText('POLYGON((80.17 21.85, 80.21 21.85, 80.21 21.82, 80.17 21.82, 80.17 21.85))', 4326),
  ST_GeomFromText('POINT(80.19 21.835)', 4326),
  14.40, 'underground', 480.0, 1.2,
  'OPERATIONAL', 1958, 'PROTOTYPE_SIMULATION'
),
(
  'b1000000-0000-0000-0000-000000000003',
  'BLG-03', 'South Balaghat Mine',
  'Balaghat', 'Madhya Pradesh',
  ST_GeomFromText('POLYGON((80.14 21.79, 80.18 21.79, 80.18 21.76, 80.14 21.76, 80.14 21.79))', 4326),
  ST_GeomFromText('POINT(80.16 21.775)', 4326),
  17.28, 'mixed', 250.0, 0.6,
  'OPERATIONAL', 1972, 'PROTOTYPE_SIMULATION'
),
(
  'b1000000-0000-0000-0000-000000000004',
  'BLG-04', 'East Balaghat Mine',
  'Balaghat', 'Madhya Pradesh',
  ST_GeomFromText('POLYGON((80.24 21.84, 80.27 21.84, 80.27 21.81, 80.24 21.81, 80.24 21.84))', 4326),
  ST_GeomFromText('POINT(80.255 21.825)', 4326),
  9.72, 'underground', 180.0, 0.4,
  'CARE_MAINTENANCE', 1980, 'PROTOTYPE_SIMULATION'
),
(
  'b1000000-0000-0000-0000-000000000005',
  'BLG-05', 'West Balaghat Development Mine',
  'Balaghat', 'Madhya Pradesh',
  ST_GeomFromText('POLYGON((80.09 21.83, 80.12 21.83, 80.12 21.80, 80.09 21.80, 80.09 21.83))', 4326),
  ST_GeomFromText('POINT(80.105 21.815)', 4326),
  11.16, 'opencast', 80.0, 0.3,
  'DEVELOPMENT', 2020, 'PROTOTYPE_SIMULATION'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- MINE BLOCKS (15 blocks across mines)
-- ⚠ PROTOTYPE SIMULATION DATA
-- ============================================================
INSERT INTO mine_blocks (
  id, block_code, mine_id, estimated_ore_tonnes, estimated_grade_pct,
  development_percent, drilling_percent, blasting_readiness, access_readiness,
  equipment_available, ventilation_status, water_risk, readiness_score, block_status, data_source
) VALUES
-- BLG-01 blocks
('c1000000-0000-0000-0000-000000000001','A-12','b1000000-0000-0000-0000-000000000001',42000,31.2,95,100,'READY','READY',TRUE,'GOOD','LOW',94,'READY','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000002','A-13','b1000000-0000-0000-0000-000000000001',38000,29.8,80,90,'IN_PROGRESS','READY',TRUE,'GOOD','LOW',78,'DEVELOPMENT','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000003','A-14','b1000000-0000-0000-0000-000000000001',55000,33.1,60,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','MEDIUM',42,'DEVELOPMENT','PROTOTYPE_SIMULATION'),
-- BLG-02 blocks
('c1000000-0000-0000-0000-000000000004','B-17','b1000000-0000-0000-0000-000000000002',67000,28.4,45,30,'NOT_READY','NOT_READY',FALSE,'MAINTENANCE','HIGH',25,'DEVELOPMENT','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000005','B-18','b1000000-0000-0000-0000-000000000002',72000,30.5,100,100,'READY','READY',TRUE,'GOOD','LOW',91,'READY','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000006','B-19','b1000000-0000-0000-0000-000000000002',48000,27.9,70,80,'IN_PROGRESS','READY',FALSE,'GOOD','LOW',65,'DEVELOPMENT','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000007','B-20','b1000000-0000-0000-0000-000000000002',91000,32.7,100,100,'READY','READY',TRUE,'GOOD','LOW',96,'PRODUCING','PROTOTYPE_SIMULATION'),
-- BLG-03 blocks
('c1000000-0000-0000-0000-000000000008','C-05','b1000000-0000-0000-0000-000000000003',31000,25.1,88,95,'READY','READY',TRUE,'GOOD','MEDIUM',87,'READY','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000009','C-06','b1000000-0000-0000-0000-000000000003',44000,26.8,55,60,'NOT_READY','READY',FALSE,'UNKNOWN','MEDIUM',58,'DEVELOPMENT','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000010','C-07','b1000000-0000-0000-0000-000000000003',18000,22.3,20,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','HIGH',15,'EXPLORATION','PROTOTYPE_SIMULATION'),
-- BLG-04 blocks (care/maintenance mine)
('c1000000-0000-0000-0000-000000000011','D-09','b1000000-0000-0000-0000-000000000004',28000,24.6,30,0,'NOT_READY','NOT_READY',FALSE,'MAINTENANCE','HIGH',12,'BLOCKED','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000012','D-10','b1000000-0000-0000-0000-000000000004',35000,23.9,0,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','HIGH',5,'BLOCKED','PROTOTYPE_SIMULATION'),
-- BLG-05 blocks (development mine)
('c1000000-0000-0000-0000-000000000013','E-01','b1000000-0000-0000-0000-000000000005',125000,19.5,15,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','LOW',10,'EXPLORATION','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000014','E-02','b1000000-0000-0000-0000-000000000005',98000,21.2,5,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','LOW',5,'EXPLORATION','PROTOTYPE_SIMULATION'),
('c1000000-0000-0000-0000-000000000015','E-03','b1000000-0000-0000-0000-000000000005',76000,20.8,0,0,'NOT_READY','NOT_READY',FALSE,'UNKNOWN','LOW',3,'EXPLORATION','PROTOTYPE_SIMULATION')
ON CONFLICT DO NOTHING;

-- ============================================================
-- EQUIPMENT (5 prototype units)
-- ⚠ PROTOTYPE SIMULATION DATA
-- ============================================================
INSERT INTO equipment (
  id, equipment_code, mine_id, equipment_type, model_name, manufacturer,
  capacity_unit, capacity_value, status, data_source
) VALUES
('e1000000-0000-0000-0000-000000000001','EX-101','b1000000-0000-0000-0000-000000000001','excavator','PC2000','Komatsu','m3/hr',350,'OPERATIONAL','PROTOTYPE_SIMULATION'),
('e1000000-0000-0000-0000-000000000002','EX-102','b1000000-0000-0000-0000-000000000002','excavator','R9350','Liebherr','m3/hr',420,'OPERATIONAL','PROTOTYPE_SIMULATION'),
('e1000000-0000-0000-0000-000000000003','EX-103','b1000000-0000-0000-0000-000000000001','drill','DML','Atlas Copco','m/hr',18,'OPERATIONAL','PROTOTYPE_SIMULATION'),
('e1000000-0000-0000-0000-000000000004','EX-104','b1000000-0000-0000-0000-000000000002','haulage','777G','CAT','tonnes',91,'MAINTENANCE','PROTOTYPE_SIMULATION'),
('e1000000-0000-0000-0000-000000000005','EX-105','b1000000-0000-0000-0000-000000000003','loader','WA600','Komatsu','m3/hr',280,'OPERATIONAL','PROTOTYPE_SIMULATION')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DRILL TARGETS (3 prototype targets)
-- ⚠ PROTOTYPE SIMULATION DATA — not from real ML
-- ============================================================
INSERT INTO drill_targets (
  id, target_id,
  geometry, centroid,
  area_sqkm, mean_prospectivity, max_prospectivity, uncertainty,
  geological_support, structural_support, spectral_support, accessibility,
  data_completeness, priority_rank, priority_level, status,
  model_version_id, is_prototype, recommended_action,
  shap_summary
) VALUES
(
  'd1000000-0000-0000-0000-000000000001', 'MN-042',
  ST_GeomFromText('POLYGON((80.22 21.90, 80.25 21.90, 80.25 21.88, 80.22 21.88, 80.22 21.90))', 4326),
  ST_GeomFromText('POINT(80.235 21.89)', 4326),
  1.80, 0.910, 0.943, 0.180,
  'HIGH', 'HIGH', 'MEDIUM', 'HIGH',
  68.0, 1, 'VERY_HIGH', 'SURVEY_RECOMMENDED',
  'a1b2c3d4-0000-0000-0000-000000000001', TRUE,
  'Ground geological survey recommended. High prospectivity supported by favourable structural and geological evidence.',
  '[
    {"feature": "geology_formation", "contribution": 0.18, "direction": "positive"},
    {"feature": "distance_fault",    "contribution": 0.14, "direction": "positive"},
    {"feature": "ndvi_seasonal",     "contribution": 0.12, "direction": "positive"},
    {"feature": "elevation",         "contribution": 0.08, "direction": "positive"},
    {"feature": "vv_vh_ratio",       "contribution": 0.05, "direction": "positive"},
    {"feature": "soil_moisture",     "contribution": 0.04, "direction": "positive"}
  ]'::JSONB
),
(
  'd1000000-0000-0000-0000-000000000002', 'MN-018',
  ST_GeomFromText('POLYGON((80.08 21.87, 80.11 21.87, 80.11 21.85, 80.08 21.85, 80.08 21.87))', 4326),
  ST_GeomFromText('POINT(80.095 21.86)', 4326),
  2.16, 0.872, 0.901, 0.220,
  'HIGH', 'MEDIUM', 'HIGH', 'MEDIUM',
  54.0, 2, 'HIGH', 'IDENTIFIED',
  'a1b2c3d4-0000-0000-0000-000000000001', TRUE,
  'Geophysical survey recommended to resolve structural uncertainty before ground survey.',
  '[
    {"feature": "geology_formation", "contribution": 0.16, "direction": "positive"},
    {"feature": "ndvi_seasonal",     "contribution": 0.14, "direction": "positive"},
    {"feature": "distance_fault",    "contribution": 0.10, "direction": "positive"},
    {"feature": "b11_b12_ratio",     "contribution": 0.09, "direction": "positive"},
    {"feature": "slope",             "contribution": 0.06, "direction": "positive"}
  ]'::JSONB
),
(
  'd1000000-0000-0000-0000-000000000003', 'MN-074',
  ST_GeomFromText('POLYGON((80.19 21.75, 80.22 21.75, 80.22 21.73, 80.19 21.73, 80.19 21.75))', 4326),
  ST_GeomFromText('POINT(80.205 21.74)', 4326),
  3.24, 0.823, 0.861, 0.310,
  'MEDIUM', 'HIGH', 'MEDIUM', 'LOW',
  41.0, 3, 'HIGH', 'IDENTIFIED',
  'a1b2c3d4-0000-0000-0000-000000000001', TRUE,
  'Additional data required before survey. Geochemical sampling of accessible areas recommended.',
  '[
    {"feature": "distance_fault",    "contribution": 0.19, "direction": "positive"},
    {"feature": "geology_formation", "contribution": 0.11, "direction": "positive"},
    {"feature": "elevation",         "contribution": 0.09, "direction": "positive"},
    {"feature": "accessibility",     "contribution": -0.12, "direction": "negative"},
    {"feature": "data_completeness", "contribution": -0.08, "direction": "negative"}
  ]'::JSONB
) ON CONFLICT DO NOTHING;

-- ============================================================
-- MANGANESE OCCURRENCES (public knowledge — Balaghat belt)
-- Source: Published literature / GSI public reports
-- ============================================================
INSERT INTO mn_occurrences (
  occurrence_id, deposit_name, mine_name, geometry, latitude, longitude,
  formation, ore_type, mn_grade_pct, deposit_type, source, source_year,
  confidence, label_type
) VALUES
('MN-OCC-001','Balaghat Manganese Belt — Known Occurrence 1',NULL,
  ST_GeomFromText('POINT(80.18 21.83)', 4326), 21.83, 80.18,
  'Precambrian','Stratiform',32.5,'Sedimentary','GSI Published Report',2015,'HIGH','POSITIVE'),
('MN-OCC-002','Balaghat Manganese Belt — Known Occurrence 2',NULL,
  ST_GeomFromText('POINT(80.21 21.86)', 4326), 21.86, 80.21,
  'Precambrian','Stratiform',28.1,'Sedimentary','GSI Published Report',2015,'HIGH','POSITIVE'),
('MN-OCC-003','Balaghat Manganese Belt — Known Occurrence 3',NULL,
  ST_GeomFromText('POINT(80.14 21.80)', 4326), 21.80, 80.14,
  'Precambrian','Vein',24.7,'Hydrothermal','Published Literature',2019,'MEDIUM','POSITIVE'),
('MN-OCC-004','Balaghat Area — Background Sample 1',NULL,
  ST_GeomFromText('POINT(80.25 21.78)', 4326), 21.78, 80.25,
  NULL,NULL,NULL,NULL,'Background Survey',2020,'LOW','BACKGROUND'),
('MN-OCC-005','Balaghat Area — Background Sample 2',NULL,
  ST_GeomFromText('POINT(80.10 21.92)', 4326), 21.92, 80.10,
  NULL,NULL,NULL,NULL,'Background Survey',2020,'LOW','BACKGROUND')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SHORTFALL PREDICTIONS (prototype)
-- ⚠ PROTOTYPE SIMULATION DATA
-- ============================================================
INSERT INTO shortfall_predictions (
  mine_id, prediction_date, forecast_period_days,
  target_tonnes, predicted_tonnes, expected_gap_tonnes,
  shortfall_flag, risk_score, risk_level,
  shap_values, model_version_id, is_prototype
) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  CURRENT_DATE, 7,
  50000, 46200, 3800,
  TRUE, 0.78, 'HIGH',
  '{"equipment_downtime":0.24,"development_delay":0.19,"drilling_delay":0.13,"haulage_inefficiency":0.09,"rainfall":0.05}'::JSONB,
  'a1b2c3d4-0000-0000-0000-000000000001', TRUE
),
(
  'b1000000-0000-0000-0000-000000000002',
  CURRENT_DATE, 7,
  84000, 81500, 2500,
  FALSE, 0.34, 'LOW',
  '{"equipment_downtime":0.10,"development_delay":0.08,"drilling_delay":0.05,"rainfall":0.11}'::JSONB,
  'a1b2c3d4-0000-0000-0000-000000000001', TRUE
);

-- ============================================================
-- RECOMMENDATIONS (prototype — pending engineer review)
-- ⚠ PROTOTYPE SIMULATION DATA
-- ============================================================
INSERT INTO recommendations (
  recommendation_id, action, action_type, reason, confidence, expected_benefit,
  affected_mine_id, affected_block_id, status, is_prototype
) VALUES
(
  'REC-2026-001',
  'Evaluate activation of alternate production block A-12',
  'BLOCK_ACTIVATE',
  'Current production at BLG-01 is forecast to miss target by 3,800 t (78% shortfall probability). Block A-12 has 94% readiness score, access is ready, and equipment is available. Activating A-12 could partially offset the projected gap.',
  0.78,
  'Potential reduction of 2,000-3,500 t in production gap. Requires engineer assessment of ore quality and logistics.',
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'PENDING_REVIEW', TRUE
),
(
  'REC-2026-002',
  'Evaluate ground geological survey at exploration target MN-042',
  'SURVEY_PRIORITY',
  'MN-042 has the highest prospectivity score (0.91) with strong geological and structural support. Uncertainty is moderate (0.18) and could be reduced by a ground geological survey and rock sampling.',
  0.82,
  'Reduction in target uncertainty from 0.18 to estimated 0.09-0.12. May confirm or reject high-priority drilling candidate.',
  NULL, NULL,
  'PENDING_REVIEW', TRUE
),
(
  'REC-2026-003',
  'Schedule preventive maintenance for haulage unit EX-104',
  'MAINTENANCE',
  'Equipment anomaly detection flagged EX-104 with elevated downtime pattern. Anomaly score is HIGH. Scheduled preventive maintenance now may prevent unplanned breakdown during peak production period.',
  0.71,
  'Potential prevention of 12-24 hour unplanned downtime. Reduces production shortfall risk contribution from equipment factor.',
  'b1000000-0000-0000-0000-000000000002', NULL,
  'PENDING_REVIEW', TRUE
);
