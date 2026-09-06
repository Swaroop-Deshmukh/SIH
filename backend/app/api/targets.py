from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.models import DrillTarget
from app.schemas.schemas import DrillTargetResponse

router = APIRouter()

@router.get("/targets", response_model=List[DrillTargetResponse])
def get_targets(db: Session = Depends(get_db)):
    try:
        targets = db.query(DrillTarget).order_by(DrillTarget.priority_rank.asc()).all()
        if targets:
            return targets
    except Exception:
        pass
    
    # Fallback prototype targets
    return [
        {
            "id": "d1000000-0000-0000-0000-000000000001",
            "target_id": "MN-042",
            "area_sqkm": 1.80,
            "mean_prospectivity": 0.910,
            "max_prospectivity": 0.943,
            "uncertainty": 0.180,
            "geological_support": "HIGH",
            "structural_support": "HIGH",
            "spectral_support": "MEDIUM",
            "accessibility": "HIGH",
            "data_completeness": 68.0,
            "priority_rank": 1,
            "priority_level": "VERY_HIGH",
            "status": "SURVEY_RECOMMENDED",
            "is_prototype": True,
            "recommended_action": "Ground geological survey recommended.",
            "shap_summary": [
                {"feature": "geology_formation", "contribution": 0.18, "direction": "positive"},
                {"feature": "distance_fault", "contribution": 0.14, "direction": "positive"},
                {"feature": "ndvi_seasonal", "contribution": 0.12, "direction": "positive"}
            ]
        },
        {
            "id": "d1000000-0000-0000-0000-000000000002",
            "target_id": "MN-018",
            "area_sqkm": 2.16,
            "mean_prospectivity": 0.872,
            "max_prospectivity": 0.901,
            "uncertainty": 0.220,
            "geological_support": "HIGH",
            "structural_support": "MEDIUM",
            "spectral_support": "HIGH",
            "accessibility": "MEDIUM",
            "data_completeness": 54.0,
            "priority_rank": 2,
            "priority_level": "HIGH",
            "status": "IDENTIFIED",
            "is_prototype": True,
            "recommended_action": "Geophysical survey recommended to resolve structural uncertainty.",
            "shap_summary": [
                {"feature": "geology_formation", "contribution": 0.16, "direction": "positive"},
                {"feature": "distance_fault", "contribution": 0.10, "direction": "positive"}
            ]
        }
    ]

@router.get("/targets/{target_id}", response_model=DrillTargetResponse)
def get_target(target_id: str, db: Session = Depends(get_db)):
    target = db.query(DrillTarget).filter(DrillTarget.target_id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return target

@router.get("/targets/{target_id}/explain")
def explain_target(target_id: str, db: Session = Depends(get_db)):
    target = db.query(DrillTarget).filter(DrillTarget.target_id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return {
        "target_id": target.target_id,
        "mean_prospectivity": target.mean_prospectivity,
        "shap_summary": target.shap_summary,
        "explanation_type": "Model-attributed SHAP contributions (Not direct causality)",
        "is_prototype": target.is_prototype
    }
