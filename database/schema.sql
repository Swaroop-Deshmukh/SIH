-- ============================================================
-- MnVision 360 — PostGIS Database Schema
-- Full schema for all 25 tables
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. DATA SOURCES — tracks all datasets and their availability
-- ============================================================
CREATE TABLE IF NOT EXISTS data_sources (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id         VARCHAR(100) UNIQUE NOT NULL,
    dataset_name      VARCHAR(255) NOT NULL,
    provider          VARCHAR(255),
    source_url        TEXT,
    data_type         VARCHAR(50),       -- RASTER, VECTOR, TABULAR, API
    coverage          VARCHAR(100),
    resolution        VARCHAR(100),
    crs               VARCHAR(100) DEFAULT 'EPSG:4326',
    acquisition_date  DATE,
    version           VARCHAR(50),
    status            VARCHAR(50) DEFAULT 'UNAVAILABLE',  -- AVAILABLE, PROCESSING, UNAVAILABLE, OPTIONAL, SYNTHETIC, PENDING_VALIDATION
    license           VARCHAR(255),
    availability      DECIMAL(5,2),     -- percentage 0-100
    notes             TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 2. MODEL VERSIONS — ML model registry
-- ============================================================
CREATE TABLE IF NOT EXISTS model_versions (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name               VARCHAR(100) NOT NULL,
    version                  VARCHAR(50) NOT NULL,
    model_type               VARCHAR(100),   -- XGBoost, RandomForest, LogisticRegression, IsolationForest
    module                   VARCHAR(100),   -- exploration, production, shortfall, anomaly, drill_target
    features                 JSONB,
    hyperparameters          JSONB,
    metrics                  JSONB,
    training_dataset_version VARCHAR(100),
    validation_method        VARCHAR(100),   -- spatial_block_cv, random_split
    training_date            TIMESTAMP WITH TIME ZONE,
    mlflow_run_id            VARCHAR(255),
    status                   VARCHAR(50) DEFAULT 'DEVELOPMENT',  -- DEVELOPMENT, STAGING, PRODUCTION, ARCHIVED
    notes                    TEXT,
    created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    full_name       VARCHAR(255),
    role            VARCHAR(50) DEFAULT 'viewer',  -- admin, geologist, mining_engineer, viewer
    hashed_password VARCHAR(255) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 4. MINES
-- ============================================================
CREATE TABLE IF NOT EXISTS mines (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_code          VARCHAR(50) UNIQUE NOT NULL,
    mine_name          VARCHAR(255) NOT NULL,
    location_district  VARCHAR(100),
    location_state     VARCHAR(100),
    geometry           GEOMETRY(POLYGON, 4326),
    centroid           GEOMETRY(POINT, 4326),
    area_sqkm          DECIMAL(10,4),
    mine_type          VARCHAR(50),        -- underground, opencast, mixed
    depth_m            DECIMAL(10,2),
    annual_capacity_mt DECIMAL(10,4),
    operational_status VARCHAR(50) DEFAULT 'OPERATIONAL',  -- OPERATIONAL, CARE_MAINTENANCE, DEVELOPMENT, CLOSED
    established_year   INTEGER,
    data_source        VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    notes              TEXT,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. MINE BLOCKS
-- ============================================================
CREATE TABLE IF NOT EXISTS mine_blocks (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_code            VARCHAR(100) NOT NULL,
    mine_id               UUID REFERENCES mines(id) ON DELETE CASCADE,
    geometry              GEOMETRY(POLYGON, 4326),
    centroid              GEOMETRY(POINT, 4326),
    level_m               DECIMAL(10,2),
    estimated_ore_tonnes  DECIMAL(15,4),
    estimated_grade_pct   DECIMAL(8,4),
    fe_grade_pct          DECIMAL(8,4),
    development_percent   DECIMAL(5,2) DEFAULT 0,
    drilling_percent      DECIMAL(5,2) DEFAULT 0,
    blasting_readiness    VARCHAR(50) DEFAULT 'NOT_READY',   -- READY, NOT_READY, IN_PROGRESS
    access_readiness      VARCHAR(50) DEFAULT 'NOT_READY',
    equipment_available   BOOLEAN DEFAULT FALSE,
    ventilation_status    VARCHAR(50) DEFAULT 'UNKNOWN',
    water_risk            VARCHAR(50) DEFAULT 'UNKNOWN',      -- LOW, MEDIUM, HIGH
    infrastructure_status VARCHAR(50) DEFAULT 'UNKNOWN',
    readiness_score       DECIMAL(5,2),
    block_status          VARCHAR(50) DEFAULT 'EXPLORATION',  -- EXPLORATION, DEVELOPMENT, READY, PRODUCING, DEPLETED, BLOCKED
    data_source           VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    notes                 TEXT,
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 6. GEOLOGICAL LAYERS
-- ============================================================
CREATE TABLE IF NOT EXISTS geological_layers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layer_name      VARCHAR(255) NOT NULL,
    layer_type      VARCHAR(100),   -- lithology, fault, lineament, formation, geomorphology
    source_dataset  VARCHAR(255),
    data_source_id  UUID REFERENCES data_sources(id),
    geometry        GEOMETRY(GEOMETRY, 4326),
    attributes      JSONB,
    confidence      VARCHAR(50) DEFAULT 'MEDIUM',   -- HIGH, MEDIUM, LOW
    acquisition_date DATE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 7. GEOLOGICAL UNITS
-- ============================================================
CREATE TABLE IF NOT EXISTS geological_units (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_name       VARCHAR(255) NOT NULL,
    formation       VARCHAR(255),
    lithology       VARCHAR(255),
    geological_age  VARCHAR(100),
    rock_type       VARCHAR(100),
    geometry        GEOMETRY(MULTIPOLYGON, 4326),
    attributes      JSONB,
    source_dataset  VARCHAR(255),
    data_source_id  UUID REFERENCES data_sources(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 8. MANGANESE OCCURRENCES — Core ML label dataset
-- ============================================================
CREATE TABLE IF NOT EXISTS mn_occurrences (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    occurrence_id VARCHAR(100) UNIQUE NOT NULL,
    deposit_name  VARCHAR(255),
    mine_name     VARCHAR(255),
    geometry      GEOMETRY(POINT, 4326),
    latitude      DECIMAL(12,8),
    longitude     DECIMAL(12,8),
    formation     VARCHAR(255),
    lithology     VARCHAR(255),
    ore_type      VARCHAR(100),
    mn_grade_pct  DECIMAL(8,4),
    deposit_type  VARCHAR(100),
    source        VARCHAR(255),
    source_year   INTEGER,
    confidence    VARCHAR(50) DEFAULT 'HIGH',     -- HIGH, MEDIUM, LOW
    label_type    VARCHAR(50) DEFAULT 'POSITIVE', -- POSITIVE, BACKGROUND
    data_source_id UUID REFERENCES data_sources(id),
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 9. BOREHOLES
-- ============================================================
CREATE TABLE IF NOT EXISTS boreholes (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borehole_id   VARCHAR(100) UNIQUE NOT NULL,
    mine_id       UUID REFERENCES mines(id),
    geometry      GEOMETRY(POINT, 4326),
    latitude      DECIMAL(12,8),
    longitude     DECIMAL(12,8),
    elevation_m   DECIMAL(10,2),
    azimuth_deg   DECIMAL(8,4),
    dip_deg       DECIMAL(8,4),
    total_depth_m DECIMAL(10,2),
    drill_date    DATE,
    drilled_by    VARCHAR(255),
    status        VARCHAR(50) DEFAULT 'COMPLETE',
    data_source   VARCHAR(50) DEFAULT 'REAL',
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 10. ASSAYS
-- ============================================================
CREATE TABLE IF NOT EXISTS assays (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borehole_id   UUID REFERENCES boreholes(id) ON DELETE CASCADE,
    depth_from_m  DECIMAL(10,4),
    depth_to_m    DECIMAL(10,4),
    mn_pct        DECIMAL(8,4),
    fe_pct        DECIMAL(8,4),
    sio2_pct      DECIMAL(8,4),
    al2o3_pct     DECIMAL(8,4),
    p_pct         DECIMAL(8,4),
    density       DECIMAL(8,4),
    lithology     VARCHAR(255),
    mineralogy    VARCHAR(255),
    sample_id     VARCHAR(100),
    lab_id        VARCHAR(100),
    assay_date    DATE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 11. SATELLITE SCENES
-- ============================================================
CREATE TABLE IF NOT EXISTS satellite_scenes (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id         VARCHAR(255) UNIQUE NOT NULL,
    satellite        VARCHAR(100),  -- Sentinel-2, Sentinel-1, Landsat-8, Landsat-9
    sensor           VARCHAR(100),
    acquisition_date DATE,
    geometry         GEOMETRY(POLYGON, 4326),
    cloud_cover_pct  DECIMAL(5,2),
    processing_level VARCHAR(50),   -- L1C, L2A, GRD
    data_source_id   UUID REFERENCES data_sources(id),
    file_path        TEXT,
    minio_path       TEXT,
    metadata         JSONB,
    status           VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 12. SATELLITE FEATURES (per-cell extracted features)
-- ============================================================
CREATE TABLE IF NOT EXISTS satellite_features (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cell_id       VARCHAR(100) NOT NULL,
    geometry      GEOMETRY(POINT, 4326),
    scene_id      UUID REFERENCES satellite_scenes(id),
    satellite     VARCHAR(100),
    feature_date  DATE,
    features      JSONB,   -- band values, indices, texture
    quality_flag  INTEGER DEFAULT 0,
    cloud_flag    BOOLEAN DEFAULT FALSE,
    data_complete BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 13. GEOPHYSICAL SURVEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS geophysical_surveys (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id     VARCHAR(100) UNIQUE NOT NULL,
    survey_type   VARCHAR(100),  -- magnetic, gravity, EM, resistivity
    geometry      GEOMETRY(GEOMETRY, 4326),
    attributes    JSONB,
    data_source_id UUID REFERENCES data_sources(id),
    acquisition_date DATE,
    operator      VARCHAR(255),
    status        VARCHAR(50) DEFAULT 'AVAILABLE',
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 14. GEOCHEMICAL SAMPLES
-- ============================================================
CREATE TABLE IF NOT EXISTS geochemical_samples (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id     VARCHAR(100) UNIQUE NOT NULL,
    geometry      GEOMETRY(POINT, 4326),
    latitude      DECIMAL(12,8),
    longitude     DECIMAL(12,8),
    sample_type   VARCHAR(100),  -- soil, rock, stream_sediment
    mn_ppm        DECIMAL(12,4),
    fe_ppm        DECIMAL(12,4),
    sio2_ppm      DECIMAL(12,4),
    al2o3_ppm     DECIMAL(12,4),
    p_ppm         DECIMAL(12,4),
    attributes    JSONB,
    data_source_id UUID REFERENCES data_sources(id),
    collection_date DATE,
    lab_id        VARCHAR(100),
    notes         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 15. WEATHER
-- ============================================================
CREATE TABLE IF NOT EXISTS weather (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id          UUID REFERENCES mines(id),
    geometry         GEOMETRY(POINT, 4326),
    observation_date DATE NOT NULL,
    observation_hour INTEGER,
    rainfall_mm      DECIMAL(10,4),
    temperature_c    DECIMAL(8,4),
    humidity_pct     DECIMAL(8,4),
    wind_speed_kmh   DECIMAL(8,4),
    soil_moisture    DECIMAL(8,4),
    lst_celsius      DECIMAL(8,4),
    data_source      VARCHAR(100) DEFAULT 'SYNTHETIC',
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 16. EQUIPMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS equipment (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_code    VARCHAR(100) UNIQUE NOT NULL,
    mine_id           UUID REFERENCES mines(id),
    equipment_type    VARCHAR(100),  -- excavator, drill, loader, haulage, crusher
    model_name        VARCHAR(255),
    manufacturer      VARCHAR(255),
    capacity_unit     VARCHAR(50),
    capacity_value    DECIMAL(10,2),
    installation_date DATE,
    last_maintenance  DATE,
    next_maintenance  DATE,
    status            VARCHAR(50) DEFAULT 'OPERATIONAL',  -- OPERATIONAL, MAINTENANCE, BREAKDOWN, IDLE, DECOMMISSIONED
    data_source       VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    notes             TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 17. EQUIPMENT EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS equipment_events (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id  UUID REFERENCES equipment(id) ON DELETE CASCADE,
    event_date    DATE NOT NULL,
    event_type    VARCHAR(100),   -- breakdown, maintenance, inspection, repair
    duration_hours DECIMAL(8,4),
    failure_type  VARCHAR(255),
    description   TEXT,
    resolved      BOOLEAN DEFAULT FALSE,
    resolved_date DATE,
    data_source   VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 18. OPERATIONAL DELAYS
-- ============================================================
CREATE TABLE IF NOT EXISTS operational_delays (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id       UUID REFERENCES mines(id),
    block_id      UUID REFERENCES mine_blocks(id),
    delay_date    DATE NOT NULL,
    delay_type    VARCHAR(100),   -- equipment, weather, blasting, development, access, power
    delay_hours   DECIMAL(8,4),
    description   TEXT,
    impact_tonnes DECIMAL(12,4),
    data_source   VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 19. MAINTENANCE HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_history (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id     UUID REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(100),  -- preventive, corrective, emergency
    duration_hours   DECIMAL(8,4),
    cost_inr         DECIMAL(15,2),
    technician       VARCHAR(255),
    parts_replaced   JSONB,
    notes            TEXT,
    data_source      VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 20. PRODUCTION
-- ============================================================
CREATE TABLE IF NOT EXISTS production (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id                  UUID REFERENCES mines(id),
    block_id                 UUID REFERENCES mine_blocks(id),
    production_date          DATE NOT NULL,
    shift                    VARCHAR(20),   -- morning, afternoon, night, full_day
    target_tonnes            DECIMAL(12,4),
    actual_tonnes            DECIMAL(12,4),
    ore_grade_pct            DECIMAL(8,4),
    equipment_availability_pct DECIMAL(8,4),
    haulage_cycles           INTEGER,
    haulage_cycle_time_min   DECIMAL(8,4),
    drilling_planned_m       DECIMAL(10,4),
    drilling_actual_m        DECIMAL(10,4),
    blasts_planned           INTEGER,
    blasts_completed         INTEGER,
    development_planned_m    DECIMAL(10,4),
    development_actual_m     DECIMAL(10,4),
    downtime_hours           DECIMAL(8,4),
    downtime_reason          VARCHAR(255),
    data_source              VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 21. PROSPECTIVITY PREDICTIONS (ML output per grid cell)
-- ============================================================
CREATE TABLE IF NOT EXISTS prospectivity_predictions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cell_id              VARCHAR(100) NOT NULL,
    geometry             GEOMETRY(POINT, 4326),
    prospectivity_score  DECIMAL(8,6),
    uncertainty          DECIMAL(8,6),
    data_completeness    DECIMAL(5,2),
    model_version_id     UUID REFERENCES model_versions(id),
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    feature_version      VARCHAR(100),
    dataset_version      VARCHAR(100),
    shap_values          JSONB,
    raw_features         JSONB,
    is_prototype         BOOLEAN DEFAULT TRUE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 22. DRILL TARGETS (aggregated high-prospectivity polygons)
-- ============================================================
CREATE TABLE IF NOT EXISTS drill_targets (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id               VARCHAR(100) UNIQUE NOT NULL,
    geometry                GEOMETRY(POLYGON, 4326),
    centroid                GEOMETRY(POINT, 4326),
    area_sqkm               DECIMAL(10,6),
    mean_prospectivity      DECIMAL(8,6),
    max_prospectivity       DECIMAL(8,6),
    uncertainty             DECIMAL(8,6),
    geological_support      VARCHAR(50),   -- HIGH, MEDIUM, LOW, UNKNOWN
    structural_support      VARCHAR(50),
    spectral_support        VARCHAR(50),
    geochemical_support     VARCHAR(50),
    geophysical_support     VARCHAR(50),
    accessibility           VARCHAR(50) DEFAULT 'UNKNOWN',
    data_completeness       DECIMAL(5,2),
    estimated_survey_cost_inr DECIMAL(15,2),
    priority_rank           INTEGER,
    priority_level          VARCHAR(50),   -- VERY_HIGH, HIGH, MEDIUM, LOW
    status                  VARCHAR(50) DEFAULT 'IDENTIFIED',  -- IDENTIFIED, SURVEY_RECOMMENDED, UNDER_SURVEY, CONFIRMED, DRILLED, REJECTED
    model_version_id        UUID REFERENCES model_versions(id),
    is_prototype            BOOLEAN DEFAULT TRUE,
    shap_summary            JSONB,
    recommended_action      TEXT,
    notes                   TEXT,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 23. BLOCK READINESS (historical readiness assessments)
-- ============================================================
CREATE TABLE IF NOT EXISTS block_readiness (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_id              UUID REFERENCES mine_blocks(id) ON DELETE CASCADE,
    assessment_date       DATE NOT NULL,
    readiness_score       DECIMAL(5,2),
    development_pct       DECIMAL(5,2),
    drilling_pct          DECIMAL(5,2),
    blasting_status       VARCHAR(50),
    access_status         VARCHAR(50),
    equipment_status      VARCHAR(50),
    ventilation_status    VARCHAR(50),
    water_risk            VARCHAR(50),
    infrastructure_status VARCHAR(50),
    available_ore_tonnes  DECIMAL(15,4),
    status                VARCHAR(50),
    notes                 TEXT,
    data_source           VARCHAR(50) DEFAULT 'PROTOTYPE_SIMULATION',
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 24. SHORTFALL PREDICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS shortfall_predictions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id              UUID REFERENCES mines(id),
    prediction_date      DATE NOT NULL,
    forecast_period_days INTEGER DEFAULT 7,
    target_tonnes        DECIMAL(12,4),
    predicted_tonnes     DECIMAL(12,4),
    expected_gap_tonnes  DECIMAL(12,4),
    shortfall_flag       BOOLEAN DEFAULT FALSE,
    risk_score           DECIMAL(8,6),
    risk_level           VARCHAR(50),    -- HIGH, MEDIUM, LOW
    shap_values          JSONB,
    model_version_id     UUID REFERENCES model_versions(id),
    is_prototype         BOOLEAN DEFAULT TRUE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 25. RECOMMENDATIONS (Decision Engine output)
-- ============================================================
CREATE TABLE IF NOT EXISTS recommendations (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_id  VARCHAR(100) UNIQUE NOT NULL,
    action             VARCHAR(255) NOT NULL,
    action_type        VARCHAR(100),   -- EQUIPMENT_REDEPLOY, BLOCK_ACTIVATE, SURVEY_PRIORITY, MAINTENANCE, SCHEDULE
    reason             TEXT,
    confidence         DECIMAL(8,6),
    expected_benefit   TEXT,
    affected_mine_id   UUID REFERENCES mines(id),
    affected_block_id  UUID REFERENCES mine_blocks(id),
    affected_target_id UUID REFERENCES drill_targets(id),
    status             VARCHAR(50) DEFAULT 'PENDING_REVIEW',  -- PENDING_REVIEW, APPROVED, REJECTED, COMPLETED
    reviewed_by        UUID REFERENCES users(id),
    reviewed_at        TIMESTAMP WITH TIME ZONE,
    review_notes       TEXT,
    is_prototype       BOOLEAN DEFAULT TRUE,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SPATIAL INDEXES (GIST)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_mines_geom              ON mines              USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_mines_centroid          ON mines              USING GIST(centroid);
CREATE INDEX IF NOT EXISTS idx_mine_blocks_geom        ON mine_blocks        USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geological_layers_geom  ON geological_layers  USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geological_units_geom   ON geological_units   USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_mn_occurrences_geom     ON mn_occurrences     USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_boreholes_geom          ON boreholes          USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_sat_features_geom       ON satellite_features USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geochem_geom            ON geochemical_samples USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_prospectivity_geom      ON prospectivity_predictions USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_drill_targets_geom      ON drill_targets      USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_drill_targets_centroid  ON drill_targets      USING GIST(centroid);

-- BTREE INDEXES
CREATE INDEX IF NOT EXISTS idx_weather_mine_date       ON weather(mine_id, observation_date);
CREATE INDEX IF NOT EXISTS idx_production_mine_date    ON production(mine_id, production_date);
CREATE INDEX IF NOT EXISTS idx_equipment_mine          ON equipment(mine_id);
CREATE INDEX IF NOT EXISTS idx_block_readiness         ON block_readiness(block_id, assessment_date);
CREATE INDEX IF NOT EXISTS idx_shortfall_mine_date     ON shortfall_predictions(mine_id, prediction_date);
CREATE INDEX IF NOT EXISTS idx_sat_features_cell       ON satellite_features(cell_id);
CREATE INDEX IF NOT EXISTS idx_rec_status              ON recommendations(status);

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE data_sources             IS 'Registry of all datasets — real and synthetic. Status tracks availability.';
COMMENT ON TABLE model_versions           IS 'ML model registry. Linked to MLflow runs.';
COMMENT ON TABLE mn_occurrences           IS 'Known Mn deposit locations. Core positive-label dataset for prospectivity ML.';
COMMENT ON TABLE prospectivity_predictions IS 'Per-grid-cell ML prospectivity scores. is_prototype=TRUE until real model trained.';
COMMENT ON TABLE drill_targets            IS 'Aggregated high-prospectivity target polygons for exploration prioritisation.';
COMMENT ON TABLE recommendations          IS 'Decision engine output. All require human review before action.';
COMMENT ON COLUMN mn_occurrences.label_type IS 'POSITIVE=known occurrence; BACKGROUND=unlabelled background. Never call background a confirmed negative.';
COMMENT ON COLUMN recommendations.status IS 'PENDING_REVIEW -> APPROVED/REJECTED/COMPLETED. Engineer must review.';
