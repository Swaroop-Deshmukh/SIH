from pathlib import Path
from typing import Dict, List, Optional, Any
from loguru import logger

from geospatial.config import get_default_config
from geospatial.base import DatasetRegistry, RasterIngestor, AOIManager

class DEMIngestor:
    """Ingestion module for NASA/SRTM Digital Elevation Model rasters."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.config = get_default_config()
        self.data_dir = data_dir or (self.config.project_root / "data" / "raw" / "dem")
        self.registry = DatasetRegistry(self.config)

    def process(self, aoi_manager: Optional[AOIManager] = None) -> Dict[str, Any]:
        """Ingests DEM data if available. Reports UNAVAILABLE if files are missing."""
        availability = self.registry.check_availability()
        dem_info = availability.get("dem", {})

        if dem_info.get("status") == "UNAVAILABLE":
            logger.info("DEM dataset is UNAVAILABLE in local data lake.")
            return {
                "dataset_id": "srtm_dem",
                "status": "UNAVAILABLE",
                "files_count": 0,
                "derivatives": [],
                "message": "SRTM DEM missing in data/raw/dem."
            }

        found_files = dem_info.get("found_files", [])
        logger.info(f"Processing DEM dataset: {len(found_files)} files found.")
        
        processed_metadata = []
        for file_name in found_files:
            file_path = self.data_dir / file_name
            if file_path.suffix.lower() in [".tif", ".tiff", ".hgt"]:
                meta = RasterIngestor.extract_metadata(file_path)
                processed_metadata.append(meta)

        return {
            "dataset_id": "srtm_dem",
            "status": "AVAILABLE",
            "files_count": len(found_files),
            "metadata": processed_metadata,
            "message": f"Successfully ingested {len(processed_metadata)} DEM raster files."
        }
