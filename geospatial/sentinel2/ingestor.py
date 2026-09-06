from pathlib import Path
from typing import Dict, List, Optional, Any
from loguru import logger

from geospatial.config import get_default_config
from geospatial.base import DatasetRegistry, RasterIngestor, AOIManager

class Sentinel2Ingestor:
    """Ingestion module for Sentinel-2 Level-2A Multispectral surface reflectance imagery."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.config = get_default_config()
        self.data_dir = data_dir or (self.config.project_root / "data" / "raw" / "sentinel2")
        self.registry = DatasetRegistry(self.config)

    def process(self, aoi_manager: Optional[AOIManager] = None) -> Dict[str, Any]:
        """Ingests Sentinel-2 data if available. Reports UNAVAILABLE if files are missing."""
        availability = self.registry.check_availability()
        s2_info = availability.get("sentinel2", {})

        if s2_info.get("status") == "UNAVAILABLE":
            logger.info("Sentinel-2 dataset is UNAVAILABLE in local data lake.")
            return {
                "dataset_id": "sentinel2_l2a",
                "status": "UNAVAILABLE",
                "files_count": 0,
                "bands_processed": [],
                "message": "Sentinel-2 raw granules missing in data/raw/sentinel2. Phase 5 acquisition required."
            }

        found_files = s2_info.get("found_files", [])
        logger.info(f"Processing Sentinel-2 dataset: {len(found_files)} files found.")
        
        processed_metadata = []
        for file_name in found_files:
            file_path = self.data_dir / file_name
            if file_path.suffix.lower() in [".tif", ".tiff"]:
                meta = RasterIngestor.extract_metadata(file_path)
                processed_metadata.append(meta)

        return {
            "dataset_id": "sentinel2_l2a",
            "status": "AVAILABLE",
            "files_count": len(found_files),
            "metadata": processed_metadata,
            "message": f"Successfully ingested {len(processed_metadata)} Sentinel-2 raster files."
        }
