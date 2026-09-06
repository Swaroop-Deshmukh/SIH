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
  data_source?: string;
}

export interface MineBlock {
  id: string;
  block_code: string;
  mine_id: string;
  estimated_ore_tonnes: number;
  estimated_grade_pct: number;
  development_percent: number;
  drilling_percent: number;
  blasting_readiness: string;
  access_readiness: string;
  equipment_available: boolean;
  readiness_score: number;
  block_status: string;
  data_source: string;
}

export interface DrillTarget {
  id: string;
  target_id: string;
  area_sqkm: number;
  mean_prospectivity: number;
  max_prospectivity: number;
  uncertainty: number;
  geological_support: string;
  structural_support: string;
  spectral_support: string;
  accessibility: string;
  data_completeness: number;
  priority_rank: number;
  priority_level: string;
  status: string;
  is_prototype: boolean;
  recommended_action: string;
  shap_summary?: Array<{
    feature: string;
    contribution: number;
    direction: 'positive' | 'negative';
  }>;
}

export interface ShortfallPrediction {
  id: string;
  prediction_date: string;
  forecast_period_days: number;
  target_tonnes: number;
  predicted_tonnes: number;
  expected_gap_tonnes: number;
  shortfall_flag: boolean;
  risk_score: number;
  risk_level: string;
  shap_values?: Record<string, number>;
  is_prototype: boolean;
}

export interface Recommendation {
  id: string;
  recommendation_id: string;
  action: string;
  action_type: string;
  reason: string;
  confidence: number;
  expected_benefit: string;
  status: string;
  is_prototype: boolean;
  created_at: string;
}

export interface DataSource {
  id: string;
  source_id: string;
  dataset_name: string;
  provider?: string;
  data_type?: string;
  status: string;
  availability?: number;
  notes?: string;
}
