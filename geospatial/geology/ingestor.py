from pathlib import Path
from typing import Dict, List, Optional, Any
from loguru import logger

from geospatial.config import get_default_config
from geospatial.base import DatasetRegistry, VectorIngestor, AOIManager

class GeologyIngestor:
    """Ingestion module for Geological Survey of India (GSI) vector formations and lineaments."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.config = get_default_config()
        self.data_dir = data_dir or (self.config.project_root / "data" / "raw" / "geology")
        self.registry = DatasetRegistry(self.config)

    def process(self, aoi_manager: Optional[AOIManager] = None) -> Dict[str, Any]:
        """Ingests geology vector layers if available. Reports UNAVAILABLE if files are missing."""
        availability = self.registry.check_availability()
        geo_info = availability.get("geology", {})

        if geo_info.get("status") == "UNAVAILABLE":
            logger.info("Geology vector dataset is UNAVAILABLE in local data lake.")
            return {
                "dataset_id": "geology_gsi",
                "status": "UNAVAILABLE",
                "files_count": 0,
                "layers": [],
                "message": "GSI geological vector layers missing in data/raw/geology."
            }

        found_files = geo_info.get("found_files", [])
        logger.info(f"Processing Geology dataset: {len(found_files)} files found.")
        
        processed_metadata = []
        for file_name in found_files:
            file_path = self.data_dir / file_name
            if file_path.suffix.lower() in [".geojson", ".shp", ".gpkg"]:
                gdf = VectorIngestor.load(file_path)
                meta = VectorIngestor.extract_metadata(gdf, file_path=str(file_path))
                processed_metadata.append(meta)

        return {
            "dataset_id": "geology_gsi",
            "status": "AVAILABLE",
            "files_count": len(found_files),
            "metadata": processed_metadata,
            "message": f"Successfully ingested {len(processed_metadata)} geological vector layers."
        }
