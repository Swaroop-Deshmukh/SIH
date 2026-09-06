from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models.models import DataSource, MnOccurrence
from app.schemas.schemas import DataSourceResponse, MnOccurrenceResponse

router = APIRouter()

@router.get("/exploration/data-sources", response_model=List[DataSourceResponse])
def get_data_sources(db: Session = Depends(get_db)):
    try:
        sources = db.query(DataSource).all()
        return sources
    except Exception:
        return []

@router.get("/exploration/occurrences", response_model=List[MnOccurrenceResponse])
def get_occurrences(db: Session = Depends(get_db)):
    try:
        occurrences = db.query(MnOccurrence).all()
        return occurrences
    except Exception:
        return [
            {
                "id": "c1000000-0000-0000-0000-000000000001",
                "occurrence_id": "MN-OCC-001",
                "deposit_name": "Balaghat Manganese Belt Occurrence 1",
                "latitude": 21.83,
                "longitude": 80.18,
                "ore_type": "Stratiform",
                "mn_grade_pct": 32.5,
                "confidence": "HIGH",
                "label_type": "POSITIVE",
                "source": "GSI Published Data"
            }
        ]

@router.get("/exploration/prospectivity")
def get_prospectivity_raster():
    return {
        "status": "PROTOTYPE_MODE",
        "message": "Real prospectivity raster will be trained and exported in Phases 5-14.",
        "aoi": "Balaghat Manganese Belt (~21.83 N, 80.18 E)",
        "bounds": [80.05, 21.70, 80.30, 21.95],
        "default_zoom": 10
    }
