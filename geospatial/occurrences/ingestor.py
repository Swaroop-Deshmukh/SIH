from pathlib import Path
from typing import Dict, List, Optional, Any
from loguru import logger

from geospatial.config import get_default_config
from geospatial.base import DatasetRegistry, VectorIngestor, AOIManager

class OccurrencesIngestor:
    """Ingestion module for Manganese known occurrences (ground truth positive label points)."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.config = get_default_config()
        self.data_dir = data_dir or (self.config.project_root / "data" / "raw" / "occurrences")
        self.registry = DatasetRegistry(self.config)

    def process(self, aoi_manager: Optional[AOIManager] = None) -> Dict[str, Any]:
        """Ingests Mn occurrences if available. Reports UNAVAILABLE if files are missing."""
        availability = self.registry.check_availability()
        occ_info = availability.get("occurrences", {})

        if occ_info.get("status") == "UNAVAILABLE":
            logger.info("Mn occurrences dataset is UNAVAILABLE in local data lake.")
            return {
                "dataset_id": "mn_occurrences_public",
                "status": "UNAVAILABLE",
                "files_count": 0,
                "occurrences_count": 0,
                "message": "Known Mn occurrences vector file missing in data/raw/occurrences."
            }

        found_files = occ_info.get("found_files", [])
        logger.info(f"Processing Mn occurrences dataset: {len(found_files)} files found.")
        
        processed_metadata = []
        for file_name in found_files:
            file_path = self.data_dir / file_name
            if file_path.suffix.lower() in [".geojson", ".shp", ".gpkg", ".csv"]:
                gdf = VectorIngestor.load(file_path)
                meta = VectorIngestor.extract_metadata(gdf, file_path=str(file_path))
                processed_metadata.append(meta)

        return {
            "dataset_id": "mn_occurrences_public",
            "status": "AVAILABLE",
            "files_count": len(found_files),
            "metadata": processed_metadata,
            "message": f"Successfully ingested {len(processed_metadata)} occurrence vector files."
        }
