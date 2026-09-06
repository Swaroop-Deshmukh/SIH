from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    environment: str
    services: Dict[str, str]

class DataSourceResponse(BaseModel):
    id: UUID
    source_id: str
    dataset_name: str
    provider: Optional[str] = None
    data_type: Optional[str] = None
    coverage: Optional[str] = None
    resolution: Optional[str] = None
    status: str
    availability: Optional[float] = None
    notes: Optional[str] = None

class MineResponse(BaseModel):
    id: UUID
    mine_code: str
    mine_name: str
    location_district: Optional[str] = None
    location_state: Optional[str] = None
    area_sqkm: Optional[float] = None
    mine_type: Optional[str] = None
    annual_capacity_mt: Optional[float] = None
    operational_status: Optional[str] = None
    data_source: Optional[str] = None

class MineBlockResponse(BaseModel):
    id: UUID
    block_code: str
    mine_id: UUID
    estimated_ore_tonnes: Optional[float] = None
    estimated_grade_pct: Optional[float] = None
    development_percent: Optional[float] = None
    drilling_percent: Optional[float] = None
    blasting_readiness: Optional[str] = None
    access_readiness: Optional[str] = None
    equipment_available: Optional[bool] = False
    readiness_score: Optional[float] = None
    block_status: Optional[str] = None
    data_source: Optional[str] = None

class MnOccurrenceResponse(BaseModel):
    id: UUID
    occurrence_id: str
    deposit_name: Optional[str] = None
    latitude: float
    longitude: float
    ore_type: Optional[str] = None
    mn_grade_pct: Optional[float] = None
    confidence: Optional[str] = None
    label_type: str
    source: Optional[str] = None

class DrillTargetResponse(BaseModel):
    id: UUID
    target_id: str
    area_sqkm: Optional[float] = None
    mean_prospectivity: float
    max_prospectivity: Optional[float] = None
    uncertainty: float
    geological_support: Optional[str] = None
    structural_support: Optional[str] = None
    spectral_support: Optional[str] = None
    accessibility: Optional[str] = None
    data_completeness: Optional[float] = None
    priority_rank: Optional[int] = None
    priority_level: Optional[str] = None
    status: Optional[str] = None
    is_prototype: bool = True
    recommended_action: Optional[str] = None
    shap_summary: Optional[List[Dict[str, Any]]] = None

class EquipmentResponse(BaseModel):
    id: UUID
    equipment_code: str
    mine_id: Optional[UUID] = None
    equipment_type: Optional[str] = None
    model_name: Optional[str] = None
    status: str
    data_source: Optional[str] = None

class ShortfallResponse(BaseModel):
    id: UUID
    mine_id: Optional[UUID] = None
    prediction_date: date
    forecast_period_days: int
    target_tonnes: float
    predicted_tonnes: float
    expected_gap_tonnes: float
    shortfall_flag: bool
    risk_score: float
    risk_level: str
    shap_values: Optional[Dict[str, float]] = None
    is_prototype: bool = True

class RecommendationResponse(BaseModel):
    id: UUID
    recommendation_id: str
    action: str
    action_type: Optional[str] = None
    reason: Optional[str] = None
    confidence: Optional[float] = None
    expected_benefit: Optional[str] = None
    status: str
    is_prototype: bool = True
    created_at: datetime
