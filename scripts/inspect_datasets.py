import os
import sys
import json
import zipfile
import pandas as pd
import numpy as np

try:
    import rasterio
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False

try:
    import geopandas as gpd
    HAS_GEOPANDAS = True
except ImportError:
    HAS_GEOPANDAS = False

def print_log(msg):
    print(msg, flush=True)

def create_required_directories(base_dir):
    dirs = ['processed', 'features', 'models', 'predictions', 'reports', 'scripts', 'app']
    for d in dirs:
        p = os.path.join(base_dir, d)
        os.makedirs(p, exist_ok=True)
        print_log(f"Directory ensured: {p}")

def inspect_excel(filepath):
    try:
        excel_file = pd.ExcelFile(filepath)
        sheets_info = {}
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            sheets_info[sheet_name] = {
                "row_count": len(df),
                "col_count": len(df.columns),
                "columns": [str(c) for c in df.columns],
                "missing_values": {str(k): int(v) for k, v in df.isnull().sum().to_dict().items()},
                "dtypes": {str(col): str(dtype) for col, dtype in df.dtypes.items()},
                "head": df.head(3).astype(str).to_dict(orient="records")
            }
        return {
            "file_type": "excel",
            "sheet_count": len(excel_file.sheet_names),
            "sheets": sheets_info
        }
    except Exception as e:
        return {"file_type": "excel", "error": str(e)}

def inspect_csv(filepath):
    try:
        df = pd.read_csv(filepath, nrows=1000)
        # Quick row count estimation without loading full file into memory if huge
        with open(filepath, 'rb') as f:
            full_len = sum(1 for _ in f) - 1
        return {
            "file_type": "csv",
            "row_count": full_len,
            "col_count": len(df.columns),
            "columns": [str(c) for c in df.columns],
            "missing_values": {str(k): int(v) for k, v in df.isnull().sum().to_dict().items()},
            "dtypes": {str(col): str(dtype) for col, dtype in df.dtypes.items()},
            "head": df.head(3).astype(str).to_dict(orient="records")
        }
    except Exception as e:
        return {"file_type": "csv", "error": str(e)}

def inspect_raster(filepath):
    if not HAS_RASTERIO:
        return {"file_type": "raster", "error": "rasterio not installed"}
    try:
        with rasterio.open(filepath) as src:
            bounds = src.bounds
            crs_str = str(src.crs) if src.crs else "Unassigned / None"
            res = src.res
            band_info = []
            for b_idx in range(1, src.count + 1):
                dt = src.dtypes[b_idx - 1]
                nd = src.nodatavals[b_idx - 1]
                band_info.append({"band_index": b_idx, "dtype": str(dt), "nodata": float(nd) if nd is not None else None})
            return {
                "file_type": "raster",
                "driver": src.driver,
                "width": src.width,
                "height": src.height,
                "count": src.count,
                "crs": crs_str,
                "resolution": [float(r) for r in res],
                "bounds": {"minx": float(bounds.left), "miny": float(bounds.bottom), "maxx": float(bounds.right), "maxy": float(bounds.top)},
                "bands": band_info
            }
    except Exception as e:
        return {"file_type": "raster", "error": str(e)}

def inspect_vector(filepath):
    if not HAS_GEOPANDAS:
        return {"file_type": "vector", "error": "geopandas not installed"}
    try:
        gdf = gpd.read_file(filepath)
        crs_str = str(gdf.crs) if gdf.crs else "Unassigned / None"
        bounds = gdf.total_bounds
        geom_types = [str(t) for t in gdf.geometry.type.unique()] if not gdf.empty else []
        cols = [str(c) for c in gdf.columns if c != 'geometry']
        return {
            "file_type": "vector",
            "feature_count": len(gdf),
            "crs": crs_str,
            "bounds": {"minx": float(bounds[0]), "miny": float(bounds[1]), "maxx": float(bounds[2]), "maxy": float(bounds[3])} if len(bounds)==4 else None,
            "geometry_types": geom_types,
            "columns": cols,
            "missing_values": {str(k): int(v) for k, v in gdf[cols].isnull().sum().to_dict().items()} if cols else {},
            "head": gdf[cols].head(3).astype(str).to_dict(orient="records") if cols else []
        }
    except Exception as e:
        return {"file_type": "vector", "error": str(e)}

def inspect_zip(filepath):
    try:
        with zipfile.ZipFile(filepath, 'r') as z:
            file_list = z.namelist()
            return {
                "file_type": "zip",
                "contained_files_count": len(file_list),
                "contained_files": file_list[:30]
            }
    except Exception as e:
        return {"file_type": "zip", "error": str(e)}

def scan_directory(target_dir, base_root):
    inventory = []
    if not os.path.exists(target_dir):
        print_log(f"Warning: Directory {target_dir} does not exist.")
        return inventory

    for root, dirs, files in os.walk(target_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_root).replace('\\', '/')
            ext = os.path.splitext(f)[1].lower()
            file_size = os.path.getsize(full_path)

            file_record = {
                "relative_path": rel_path,
                "filename": f,
                "extension": ext,
                "size_bytes": file_size,
                "size_human": f"{file_size / (1024*1024):.2f} MB" if file_size > 1024*1024 else f"{file_size / 1024:.2f} KB"
            }

            print_log(f"Inspecting: {rel_path} ({file_record['size_human']})")

            if ext in ['.xlsx', '.xls']:
                info = inspect_excel(full_path)
            elif ext == '.csv':
                info = inspect_csv(full_path)
            elif ext in ['.tif', '.tiff', '.jp2']:
                info = inspect_raster(full_path)
            elif ext in ['.geojson', '.kml', '.shp'] and not f.endswith('inventory.json'):
                info = inspect_vector(full_path)
            elif ext == '.json':
                # Check if vector or plain json
                info = inspect_vector(full_path)
                if "error" in info:
                    info = {"file_type": "json"}
            elif ext == '.zip':
                info = inspect_zip(full_path)
            elif ext in ['.md', '.txt']:
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as tf:
                        lines = [tf.readline() for _ in range(5)]
                    info = {"file_type": "text", "sample_lines": [l.strip() for l in lines if l.strip()]}
                except Exception as e:
                    info = {"file_type": "text", "error": str(e)}
            else:
                info = {"file_type": "other"}

            file_record.update(info)
            inventory.append(file_record)

    return inventory

def generate_markdown_report(raw_inv, synth_inv, md_path):
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("# Balaghat Mining Intelligence — Dataset Inventory Report\n\n")
        f.write("Generated automatically during STEP 1 Data Inspection.\n\n")

        f.write("## 1. Executive Summary\n\n")
        f.write(f"- **Raw Geospatial Files Count:** {len(raw_inv)}\n")
        f.write(f"- **Synthetic Operational Files Count:** {len(synth_inv)}\n\n")

        f.write("## 2. Pipeline A — Raw Geospatial Datasets (`raw/`)\n\n")
        f.write("| Relative Path | Size | Type | Format / Specs | Rows/Bands | Columns / Details |\n")
        f.write("|---|---|---|---|---|---|\n")

        for item in raw_inv:
            ftype = item.get("file_type", "unknown")
            size = item.get("size_human", "")
            path = item.get("relative_path", "")

            if ftype == "raster":
                specs = f"CRS: {item.get('crs', 'N/A')}, Res: {item.get('resolution', 'N/A')}"
                rows_bands = f"{item.get('width', 0)}x{item.get('height', 0)} ({item.get('count', 0)} bands)"
                bounds = item.get('bounds', {})
                bounds_str = f"[{bounds.get('minx',0):.2f}, {bounds.get('miny',0):.2f}, {bounds.get('maxx',0):.2f}, {bounds.get('maxy',0):.2f}]" if bounds else "N/A"
                details = f"Bounds: {bounds_str}"
            elif ftype == "excel":
                specs = f"Excel ({item.get('sheet_count', 0)} sheets)"
                sheets = item.get("sheets", {})
                rows_bands = ", ".join([f"{s}: {v.get('row_count')} rows" for s, v in sheets.items()])
                cols = []
                for s, v in sheets.items():
                    cols.extend(v.get("columns", []))
                details = f"Cols: {', '.join(cols[:8])}..."
            elif ftype == "vector":
                specs = f"CRS: {item.get('crs', 'N/A')}, Geoms: {item.get('geometry_types', [])}"
                rows_bands = f"{item.get('feature_count', 0)} features"
                details = f"Cols: {', '.join(item.get('columns', [])[:8])}"
            elif ftype == "csv":
                specs = "CSV"
                rows_bands = f"{item.get('row_count', 0)} rows"
                details = f"Cols: {', '.join(item.get('columns', [])[:8])}"
            elif ftype == "zip":
                specs = "ZIP Archive"
                rows_bands = f"{item.get('contained_files_count', 0)} files"
                details = f"Files: {', '.join(item.get('contained_files', [])[:5])}"
            else:
                specs = item.get("extension", "")
                rows_bands = "N/A"
                details = item.get("error", "N/A")

            f.write(f"| `{path}` | {size} | {ftype} | {specs} | {rows_bands} | {details} |\n")

        f.write("\n## 3. Pipeline B — Synthetic Operational Datasets (`synthetic/` / `synthethic/`)\n\n")
        f.write("| Relative Path | Size | Type | Rows | Columns | Key Findings |\n")
        f.write("|---|---|---|---|---|---|\n")

        for item in synth_inv:
            ftype = item.get("file_type", "unknown")
            size = item.get("size_human", "")
            path = item.get("relative_path", "")

            if ftype == "csv":
                rows = item.get('row_count', 0)
                cols = ", ".join(item.get('columns', []))
                missing_total = sum(item.get('missing_values', {}).values()) if isinstance(item.get('missing_values'), dict) else 0
                f.write(f"| `{path}` | {size} | CSV | {rows} | {cols[:60]}... | Missing values: {missing_total} |\n")
            elif ftype == "vector":
                rows = item.get('feature_count', 0)
                cols = ", ".join(item.get('columns', []))
                f.write(f"| `{path}` | {size} | GeoJSON | {rows} | {cols[:60]}... | CRS: {item.get('crs')} |\n")
            elif ftype == "text":
                sample = item.get('sample_lines', [''])[0] if item.get('sample_lines') else ''
                f.write(f"| `{path}` | {size} | Text/MD | N/A | Documentation | Sample: {sample[:50]}... |\n")
            elif ftype == "zip":
                f.write(f"| `{path}` | {size} | ZIP | N/A | {item.get('contained_files_count')} files contained | ZIP archive |\n")
            else:
                f.write(f"| `{path}` | {size} | {ftype} | N/A | N/A | N/A |\n")

        f.write("\n## 4. Key Data Inspection Findings & Detailed Analysis\n\n")

        f.write("### Pipeline A: Geospatial / Prospectivity Datasets Inspection\n")
        f.write("1. **DEM (Elevation)**: Raster present in `raw/dem/output_SRTMGL1.tif`. Provides elevation in meters.\n")
        f.write("2. **Sentinel-1 (SAR)**: Raster present in `raw/sentinel1/MIRPS_Sentinel1_2021_2026-0000000000-0000000000.tif`.\n")
        f.write("3. **Sentinel-2 (Multispectral)**: JP2 band files in `raw/sentinel2/` (B02, B03, B04, B05, B06, B07, B08, B11, B12, B8A, SCL).\n")
        f.write("4. **Landsat & Weather**: `raw/landstat/MIRPS_Landsat8_9_2013_2026.tif`, `raw/weather/MIRPS_SMAP_SoilMoisture_2021_2026.tif`, `raw/weather/rainfall.tif`.\n")
        f.write("5. **Geochemistry**: `raw/geochemistry/original_geochemistry_file.xlsx`.\n")
        f.write("6. **Mineral Occurrences**: Shapefile/GIS zipped datasets in `raw/mineral_occurences/`.\n")

        f.write("\n### Pipeline B: Synthetic Operational Datasets Inspection\n")
        f.write("1. **Production History**: `production_history.csv` contains planned vs actual production.\n")
        f.write("2. **Mine Blocks**: `mine_blocks.csv` and `mine_blocks.geojson`.\n")
        f.write("3. **Equipment**: `equipment_history.csv` and `equipment_events.csv`.\n")
        f.write("4. **Maintenance & Delays**: `maintenance_history.csv` and `operational_delays.csv`.\n")

def main():
    base_dir = os.path.abspath(os.curdir)
    print_log(f"Working Directory: {base_dir}")

    # Step 0: Ensure directories
    create_required_directories(base_dir)

    # Locate raw and synthetic dirs
    raw_dir = os.path.join(base_dir, 'raw')
    
    synth_dir = os.path.join(base_dir, 'synthetic')
    if not os.path.exists(synth_dir):
        alt_synth = os.path.join(base_dir, 'synthethic')
        if os.path.exists(alt_synth):
            synth_dir = alt_synth

    print_log(f"Scanning raw directory: {raw_dir}")
    raw_inventory = scan_directory(raw_dir, base_dir)

    print_log(f"Scanning synthetic directory: {synth_dir}")
    synthetic_inventory = scan_directory(synth_dir, base_dir)

    full_inventory = {
        "raw_inventory": raw_inventory,
        "synthetic_inventory": synthetic_inventory
    }

    json_path = os.path.join(base_dir, 'reports', 'dataset_inventory.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(full_inventory, f, indent=2, default=str)
    print_log(f"Saved JSON inventory to {json_path}")

    md_path = os.path.join(base_dir, 'reports', 'dataset_inventory.md')
    generate_markdown_report(raw_inventory, synthetic_inventory, md_path)
    print_log(f"Saved Markdown inventory to {md_path}")

if __name__ == '__main__':
    main()
