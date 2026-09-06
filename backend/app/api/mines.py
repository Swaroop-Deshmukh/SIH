from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.models import Mine, MineBlock
from app.schemas.schemas import MineResponse, MineBlockResponse

router = APIRouter()

@router.get("/mines", response_model=List[MineResponse])
def get_mines(db: Session = Depends(get_db)):
    try:
        mines = db.query(Mine).all()
        return mines
    except Exception:
        # Fallback prototype data if DB not loaded yet
        return [
            {
                "id": "b1000000-0000-0000-0000-000000000001",
                "mine_code": "BLG-01",
                "mine_name": "North Balaghat Mine",
                "location_district": "Balaghat",
                "location_state": "Madhya Pradesh",
                "area_sqkm": 8.64,
                "mine_type": "underground",
                "annual_capacity_mt": 0.8,
                "operational_status": "OPERATIONAL",
                "data_source": "PROTOTYPE_SIMULATION"
            },
            {
                "id": "b1000000-0000-0000-0000-000000000002",
                "mine_code": "BLG-02",
                "mine_name": "Central Balaghat Mine",
                "location_district": "Balaghat",
                "location_state": "Madhya Pradesh",
                "area_sqkm": 14.40,
                "mine_type": "underground",
                "annual_capacity_mt": 1.2,
                "operational_status": "OPERATIONAL",
                "data_source": "PROTOTYPE_SIMULATION"
            }
        ]

@router.get("/mines/{mine_id}", response_model=MineResponse)
def get_mine(mine_id: UUID, db: Session = Depends(get_db)):
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if not mine:
        raise HTTPException(status_code=404, detail="Mine not found")
    return mine

@router.get("/mines/{mine_id}/blocks", response_model=List[MineBlockResponse])
def get_mine_blocks(mine_id: UUID, db: Session = Depends(get_db)):
    blocks = db.query(MineBlock).filter(MineBlock.mine_id == mine_id).all()
    return blocks
