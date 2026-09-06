from pathlib import Path
from typing import Dict, List, Optional, Any
from loguru import logger

from geospatial.config import get_default_config
from geospatial.base import DatasetRegistry, RasterIngestor, AOIManager

class Sentinel1Ingestor:
    """Ingestion module for Sentinel-1 C-band SAR (VV, VH backscatter) imagery."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.config = get_default_config()
        self.data_dir = data_dir or (self.config.project_root / "data" / "raw" / "sentinel1")
        self.registry = DatasetRegistry(self.config)

    def process(self, aoi_manager: Optional[AOIManager] = None) -> Dict[str, Any]:
        """Ingests Sentinel-1 data if available. Reports UNAVAILABLE if files are missing."""
        availability = self.registry.check_availability()
        s1_info = availability.get("sentinel1", {})

        if s1_info.get("status") == "UNAVAILABLE":
            logger.info("Sentinel-1 SAR dataset is UNAVAILABLE in local data lake.")
            return {
                "dataset_id": "sentinel1_grd",
                "status": "UNAVAILABLE",
                "files_count": 0,
                "polarizations": [],
                "message": "Sentinel-1 SAR granules missing in data/raw/sentinel1. Phase 6 acquisition required."
            }

        found_files = s1_info.get("found_files", [])
        logger.info(f"Processing Sentinel-1 dataset: {len(found_files)} files found.")
        
        processed_metadata = []
        for file_name in found_files:
            file_path = self.data_dir / file_name
            if file_path.suffix.lower() in [".tif", ".tiff"]:
                meta = RasterIngestor.extract_metadata(file_path)
                processed_metadata.append(meta)

        return {
            "dataset_id": "sentinel1_grd",
            "status": "AVAILABLE",
            "files_count": len(found_files),
            "metadata": processed_metadata,
            "message": f"Successfully ingested {len(processed_metadata)} Sentinel-1 SAR files."
        }
