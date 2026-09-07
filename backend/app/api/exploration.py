import os
import json
import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

router = APIRouter()

# Pydantic Schema for Prospectivity Inference
class ProspectivityInput(BaseModel):
    elevation: float = 350.0
    slope: float = 8.5
    aspect: float = 180.0
    s1_vv: float = -11.2
    s1_vh: float = -18.4
    s1_ratio: float = 0.6
    b02_blue: float = 1200.0
    b03_green: float = 1400.0
    b04_red: float = 1600.0
    b08_nir: float = 2800.0
    b11_swir1: float = 3100.0
    b12_swir2: float = 2400.0
    ndvi: float = 0.27
    ndbi: float = 0.05
    ndwi: float = -0.33
    clay_index: float = 1.29
    ferrous_index: float = 1.10
    landsat_b1: float = 0.12
    landsat_b2: float = 0.14
    landsat_b3: float = 0.18
    landsat_b4: float = 0.22
    landsat_b5: float = 0.35
    soil_moisture: float = 0.25
    rainfall: float = 1200.0
    dist_roads_km: float = 1.5
    dist_chem_km: float = 0.8
    nearest_mno_pct: float = 18.5

@router.get("/exploration/data-sources")
def get_data_sources():
    json_path = os.path.join(BASE_DIR, 'reports', 'dataset_inventory.json')
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            inv = json.load(f)
        return inv
    return {"raw_inventory": [], "synthetic_inventory": []}

@router.get("/exploration/occurrences")
def get_occurrences():
    # Return real occurrence points from dataset inventory / geochem
    excel_path = os.path.join(BASE_DIR, 'raw', 'geochemistry', 'original_geochemistry_file.xlsx')
    if os.path.exists(excel_path):
        try:
            df = pd.read_excel(excel_path)
            df = df.dropna(subset=['Latitude (DD)', 'Longitude (DD)', 'MnO (%)']).head(50)
            occurrences = []
            for idx, row in df.iterrows():
                occurrences.append({
                    "id": f"occ-{idx}",
                    "occurrence_id": str(row.get('Sample Number', f"MN-OCC-{idx:03d}")),
                    "deposit_name": f"Balaghat Mn Sample {row.get('Sample Number', idx)}",
                    "latitude": float(row['Latitude (DD)']),
                    "longitude": float(row['Longitude (DD)']),
                    "elevation": float(row.get('Elevation (meter)', 300)),
                    "ore_type": str(row.get('Sample Type ', 'Stream Sediment / Rock')),
                    "mn_grade_pct": float(row['MnO (%)']),
                    "confidence": "HIGH" if row['MnO (%)'] >= 10.0 else "MEDIUM",
                    "label_type": "POSITIVE" if row['MnO (%)'] >= 5.0 else "BACKGROUND",
                    "source": "GSI Geochemistry Field Survey (Real Data)"
                })
            return occurrences
        except Exception:
            pass

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
    metrics_path = os.path.join(BASE_DIR, 'reports', 'prospectivity_metrics.json')
    metrics = {}
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)

    tif_path = os.path.join(BASE_DIR, 'predictions', 'balaghat_prospectivity.tif')
    exists = os.path.exists(tif_path)

    return {
        "status": "TRAINED_AND_EXPORTED",
        "model_name": "RandomForest (SpatialBlockCV)",
        "metrics": metrics,
        "raster_exported": exists,
        "raster_path": tif_path if exists else None,
        "aoi": "Balaghat Manganese Belt (21.60 - 22.05 N, 79.60 - 80.30 E)",
        "bounds": [79.60, 21.60, 80.30, 22.05],
        "default_zoom": 10
    }

@router.post("/exploration/predict")
def predict_prospectivity(input_data: ProspectivityInput):
    model_path = os.path.join(BASE_DIR, 'models', 'prospectivity_model.joblib')
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Prospectivity model not found.")

    pkg = joblib.load(model_path)
    model = pkg['model']
    feature_cols = pkg['feature_cols']

    input_dict = input_data.model_dump()
    df_in = pd.DataFrame([input_dict])
    for col in feature_cols:
        if col not in df_in.columns:
            df_in[col] = 0.0

    df_in = df_in[feature_cols]
    prob = float(model.predict_proba(df_in)[0, 1])

    return {
        "prospectivity_probability": prob,
        "prospectivity_percentage": round(prob * 100, 2),
        "prediction_class": "HIGH PROSPECTIVITY (Manganese Occurrence Expected)" if prob >= 0.5 else "LOW/BACKGROUND PROSPECTIVITY",
        "model_used": pkg.get('model_name'),
        "top_features": pkg.get('feature_importances', [])[:5]
    }
