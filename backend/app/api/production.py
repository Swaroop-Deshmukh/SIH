from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models.models import ShortfallPrediction
from app.schemas.schemas import ShortfallResponse

router = APIRouter()

@router.get("/production")
def get_production_summary():
    return {
        "status": "OPERATIONAL",
        "data_source": "PROTOTYPE_SIMULATION",
        "target_tonnes": 50000,
        "actual_tonnes": 46200,
        "gap_tonnes": 3800,
        "achievement_pct": 92.4,
        "active_mines": 5
    }

@router.get("/production/forecast")
def get_production_forecast():
    return {
        "data_source": "PROTOTYPE_SIMULATION",
        "model": "RandomForestRegressor-v0.1-prototype",
        "forecast_days": [
            {"day": "Day 1", "target": 7140, "forecast": 6800, "lower": 6500, "upper": 7100},
            {"day": "Day 2", "target": 7140, "forecast": 6720, "lower": 6400, "upper": 7040},
            {"day": "Day 3", "target": 7140, "forecast": 6650, "lower": 6300, "upper": 6980},
            {"day": "Day 4", "target": 7140, "forecast": 6580, "lower": 6200, "upper": 6900},
            {"day": "Day 5", "target": 7140, "forecast": 6500, "lower": 6100, "upper": 6850},
            {"day": "Day 6", "target": 7140, "forecast": 6480, "lower": 6050, "upper": 6800},
            {"day": "Day 7", "target": 7140, "forecast": 6470, "lower": 6000, "upper": 6820}
        ]
    }

@router.get("/production/shortfall", response_model=List[ShortfallResponse])
def get_shortfall(db: Session = Depends(get_db)):
    try:
        shortfalls = db.query(ShortfallPrediction).all()
        if shortfalls:
            return shortfalls
    except Exception:
        pass
        
    return [
        {
            "id": "e1000000-0000-0000-0000-000000000001",
            "prediction_date": "2026-09-07",
            "forecast_period_days": 7,
            "target_tonnes": 50000,
            "predicted_tonnes": 46200,
            "expected_gap_tonnes": 3800,
            "shortfall_flag": True,
            "risk_score": 0.78,
            "risk_level": "HIGH",
            "shap_values": {
                "equipment_downtime": 0.24,
                "development_delay": 0.19,
                "drilling_delay": 0.13,
                "haulage_inefficiency": 0.09,
                "rainfall": 0.05
            },
            "is_prototype": True
        }
    ]

@router.get("/production/bottlenecks")
def get_bottlenecks():
    return {
        "pipeline_stages": [
            {"stage": "Development", "capacity_tpd": 8500, "actual_tpd": 6800, "utilization_pct": 80.0, "status": "DELAYED"},
            {"stage": "Drilling", "capacity_tpd": 8000, "actual_tpd": 7200, "utilization_pct": 90.0, "status": "NORMAL"},
            {"stage": "Blasting", "capacity_tpd": 9000, "actual_tpd": 8100, "utilization_pct": 90.0, "status": "NORMAL"},
            {"stage": "Loading", "capacity_tpd": 7800, "actual_tpd": 6900, "utilization_pct": 88.5, "status": "NORMAL"},
            {"stage": "Haulage", "capacity_tpd": 7200, "actual_tpd": 6600, "utilization_pct": 91.7, "status": "BOTTLENECK"},
            {"stage": "Hoisting", "capacity_tpd": 8000, "actual_tpd": 6600, "utilization_pct": 82.5, "status": "NORMAL"},
            {"stage": "Processing", "capacity_tpd": 10000, "actual_tpd": 6600, "utilization_pct": 66.0, "status": "NORMAL"}
        ],
        "primary_bottleneck": "Haulage",
        "secondary_bottleneck": "Development",
        "notes": "Haulage cycle times elevated due to EX-104 maintenance disruption."
    }
