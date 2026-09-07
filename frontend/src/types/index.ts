export interface Mine {
  id: string;
  mine_code: string;
  mine_name: string;
  location_district: string;
  location_state: string;
  area_sqkm?: number;
  mine_type: string;
  annual_capacity_mt?: number;
  operational_status: string;
  established_year?: number;
  depth_m?: number;
  data_source?: string;
}

export interface MineBlock {
  id: string;
  block_code: string;
  mine_id: string;
  level_m?: number;
  estimated_ore_tonnes: number;
  estimated_grade_pct: number;
  fe_grade_pct?: number;
  development_percent: number;
  drilling_percent: number;
  blasting_readiness: 'READY' | 'IN_PROGRESS' | 'NOT_READY';
  access_readiness: 'READY' | 'IN_PROGRESS' | 'NOT_READY';
  equipment_available: boolean;
  ventilation_status?: string;
  water_risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  readiness_score: number;
  block_status: 'EXPLORATION' | 'DEVELOPMENT' | 'READY' | 'PRODUCING' | 'BLOCKED' | 'DEPLETED' | 'ACTIVATED';
  data_source: string;
}

export interface DrillTarget {
  id: string;
  target_id: string;
  area_sqkm: number;
  mean_prospectivity: number;
  max_prospectivity: number;
  uncertainty: number;
  geological_support: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  structural_support: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  spectral_support: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  geochemical_support?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  geophysical_support?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  accessibility: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR';
  data_completeness: number;
  estimated_survey_cost_inr?: number;
  priority_rank: number;
  priority_level: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'IDENTIFIED' | 'SURVEY_RECOMMENDED' | 'UNDER_SURVEY' | 'CONFIRMED' | 'DRILLED' | 'REJECTED';
  is_prototype: boolean;
  recommended_action: string;
  shap_summary?: Array<{
    feature: string;
    contribution: number;
    direction: 'positive' | 'negative';
  }>;
}

export interface Equipment {
  id: string;
  equipment_code: string;
  mine_id?: string;
  equipment_type: 'excavator' | 'haulage' | 'drill' | 'loader' | 'crusher';
  model_name: string;
  manufacturer?: string;
  capacity_unit?: string;
  capacity_value?: number;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'BREAKDOWN' | 'IDLE' | 'DECOMMISSIONED';
  availability_pct: number;
  anomaly_level: 'NORMAL' | 'WARNING' | 'ANOMALY';
  anomaly_score: number;
  contributing_factors?: string[];
  data_source: string;
}

export interface ProductionSummary {
  status: string;
  data_source: string;
  target_tonnes: number;
  actual_tonnes: number;
  gap_tonnes: number;
  achievement_pct: number;
  active_mines: number;
}

export interface ProductionForecastPoint {
  day: string;
  target: number;
  forecast: number;
  lower?: number;
  upper?: number;
}

export interface ShortfallPrediction {
  id: string;
  mine_id?: string;
  mine_name?: string;
  prediction_date: string;
  forecast_period_days: number;
  target_tonnes: number;
  predicted_tonnes: number;
  expected_gap_tonnes: number;
  shortfall_flag: boolean;
  risk_score: number;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  shap_values?: Record<string, number>;
  is_prototype: boolean;
}

export interface PipelineStage {
  stage: string;
  capacity_tpd: number;
  actual_tpd: number;
  utilization_pct: number;
  status: 'NORMAL' | 'DELAYED' | 'BOTTLENECK';
}

export interface Recommendation {
  id: string;
  recommendation_id: string;
  action: string;
  action_type: 'EQUIPMENT_REDEPLOY' | 'BLOCK_ACTIVATE' | 'SURVEY_PRIORITY' | 'MAINTENANCE' | 'SCHEDULE';
  reason: string;
  confidence: number;
  expected_benefit: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  affected_mine_id?: string;
  affected_block_id?: string;
  is_prototype: boolean;
  created_at: string;
}

export interface DataSource {
  id: string;
  source_id: string;
  dataset_name: string;
  provider?: string;
  data_type?: 'RASTER' | 'VECTOR' | 'TABULAR' | 'API';
  coverage?: string;
  resolution?: string;
  crs?: string;
  status: 'AVAILABLE' | 'PROCESSING' | 'UNAVAILABLE' | 'OPTIONAL' | 'SYNTHETIC' | 'PENDING_VALIDATION';
  license?: string;
  availability?: number;
  notes?: string;
}

export interface MnOccurrence {
  id: string;
  occurrence_id: string;
  deposit_name?: string;
  latitude: number;
  longitude: number;
  formation?: string;
  ore_type?: string;
  mn_grade_pct?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  label_type: 'POSITIVE' | 'BACKGROUND';
  source?: string;
}
