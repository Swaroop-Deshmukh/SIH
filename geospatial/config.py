import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

class DatasetConfig(BaseModel):
    source_id: str
    name: str
    data_type: str  # RASTER, VECTOR, TABULAR
    category: str   # satellite, terrain, geology, occurrences, etc.
    relative_path: str
    expected_crs: str = "EPSG:4326"
    required: bool = False
    bands: Optional[List[str]] = None
    notes: Optional[str] = None

class GeospatialConfig(BaseModel):
    project_root: Path = Field(default_factory=lambda: Path(os.getcwd()))
    base_data_dir: Path = Field(default_factory=lambda: Path("data"))
    aoi_path: Path = Field(default_factory=lambda: Path("data/raw/boundaries/balaghat_aoi.geojson"))
    default_vector_crs: str = "EPSG:4326"
    default_raster_crs: str = "EPSG:32643"  # UTM Zone 44N for Balaghat region
    
    datasets: Dict[str, DatasetConfig] = Field(default_factory=lambda: {
        "sentinel2": DatasetConfig(
            source_id="sentinel2_l2a",
            name="Sentinel-2 Level-2A Surface Reflectance",
            data_type="RASTER",
            category="satellite",
            relative_path="raw/sentinel2",
            expected_crs="EPSG:32643",
            required=False,
            bands=["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B8A", "B11", "B12"],
            notes="Harmonized multispectral surface reflectance."
        ),
        "sentinel1": DatasetConfig(
            source_id="sentinel1_grd",
            name="Sentinel-1 SAR GRD",
            data_type="RASTER",
            category="satellite",
            relative_path="raw/sentinel1",
            expected_crs="EPSG:32643",
            required=False,
            bands=["VV", "VH"],
            notes="C-band SAR radar backscatter."
        ),
        "dem": DatasetConfig(
            source_id="srtm_dem",
            name="SRTM Digital Elevation Model",
            data_type="RASTER",
            category="terrain",
            relative_path="raw/dem",
            expected_crs="EPSG:4326",
            required=False,
            notes="Topographic surface elevation."
        ),
        "geology": DatasetConfig(
            source_id="geology_gsi",
            name="GSI Geological Lithology & Structures",
            data_type="VECTOR",
            category="geology",
            relative_path="raw/geology",
            expected_crs="EPSG:4326",
            required=False,
            notes="Geological units, formations, and lineaments."
        ),
        "occurrences": DatasetConfig(
            source_id="mn_occurrences_public",
            name="Known Manganese Occurrences",
            data_type="VECTOR",
            category="occurrences",
            relative_path="raw/occurrences",
            expected_crs="EPSG:4326",
            required=False,
            notes="Ground truth mineral occurrence points."
        )
    })

def get_default_config() -> GeospatialConfig:
    return GeospatialConfig()
