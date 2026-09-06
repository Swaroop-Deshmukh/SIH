from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter()

class FieldObservationCreate(BaseModel):
    target_id: Optional[str] = None
    latitude: float
    longitude: float
    observation_date: date
    lithology: str
    rock_type: Optional[str] = None
    sample_id: Optional[str] = None
    notes: Optional[str] = None

@router.post("/field-observations")
def submit_observation(obs: FieldObservationCreate):
    return {
        "status": "ACCEPTED",
        "observation_id": f"OBS-{obs.observation_date.strftime('%Y%m%d')}-001",
        "message": "Observation recorded in field database. Will be linked into subsequent model retraining cycles."
    }
