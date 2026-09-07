import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import (
    accuracy_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, f1_score, confusion_matrix
)
import rasterio
from rasterio.transform import from_bounds

def print_log(msg):
    print(msg, flush=True)

def main():
    base_dir = os.path.abspath(os.curdir)
    features_csv = os.path.join(base_dir, 'features', 'prospectivity_features.csv')
    models_dir = os.path.join(base_dir, 'models')
    reports_dir = os.path.join(base_dir, 'reports')
    predictions_dir = os.path.join(base_dir, 'predictions')
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(predictions_dir, exist_ok=True)

    print_log("=== STEP 5: Mineral Prospectivity Model Training ===")

    df = pd.read_csv(features_csv)
    print_log(f"Loaded feature dataset: {len(df)} total rows.")

    # Filter labeled samples only (0 = background, 1 = positive mineral occurrence)
    df_labeled = df[df['target_occurrence'].isin([0, 1])].copy()
    print_log(f"Labeled Samples: {len(df_labeled)} (Positives: {sum(df_labeled['target_occurrence']==1)}, Background: {sum(df_labeled['target_occurrence']==0)})")

    # Define Feature List (excluding target and label-derivation columns like dist_min_line_km)
    feature_cols = [
        'elevation', 'slope', 'aspect',
        's1_vv', 's1_vh', 's1_ratio',
        'b02_blue', 'b03_green', 'b04_red', 'b08_nir', 'b11_swir1', 'b12_swir2',
        'ndvi', 'ndbi', 'ndwi', 'clay_index', 'ferrous_index',
        'landsat_b1', 'landsat_b2', 'landsat_b3', 'landsat_b4', 'landsat_b5',
        'soil_moisture', 'rainfall',
        'dist_roads_km', 'dist_chem_km', 'nearest_mno_pct'
    ]

    X = df_labeled[feature_cols]
    y = df_labeled['target_occurrence'].values
    groups = df_labeled['spatial_block_id'].values

    # Prevent Spatial Data Leakage using GroupShuffleSplit based on spatial_block_id
    gss = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
    train_idx, test_idx = next(gss.split(X, y, groups=groups))

    X_train, y_train = X.iloc[train_idx], y[train_idx]
    X_test, y_test = X.iloc[test_idx], y[test_idx]

    print_log(f"Spatial Block Split -> Train count: {len(X_train)} (Pos: {sum(y_train==1)}), Test count: {len(X_test)} (Pos: {sum(y_test==1)})")

    # Define Baseline Models
    models = {
        'LogisticRegression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, random_state=42))
        ]),
        'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
        'HistGradientBoosting': HistGradientBoostingClassifier(max_iter=100, max_depth=8, random_state=42)
    }

    metrics_summary = {}
    best_model_name = None
    best_auc = -1.0
    best_model_obj = None

    for name, model in models.items():
        print_log(f"\nTraining model: {name}...")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred

        acc = accuracy_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        pr_auc = average_precision_score(y_test, y_prob)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()

        metrics_summary[name] = {
            'accuracy': float(acc),
            'roc_auc': float(roc_auc),
            'pr_auc': float(pr_auc),
            'precision': float(prec),
            'recall': float(rec),
            'f1': float(f1),
            'confusion_matrix': cm
        }

        print_log(f"  {name} Metrics -> ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f} | F1: {f1:.4f} | Acc: {acc:.4f}")

        if roc_auc > best_auc:
            best_auc = roc_auc
            best_model_name = name
            best_model_obj = model

    print_log(f"\nBest Prospectivity Model: {best_model_name} with ROC-AUC = {best_auc:.4f}")

    # Feature Importance for Tree Model
    rf_model = models['RandomForest']
    importances = rf_model.feature_importances_
    df_imp = pd.DataFrame({
        'feature': feature_cols,
        'importance': importances
    }).sort_values(by='importance', ascending=False)
    
    print_log("\nTop 10 Prospectivity Features:")
    print_log(df_imp.head(10).to_string(index=False))

    # Save Best Model and Feature Importances
    model_path = os.path.join(models_dir, 'prospectivity_model.joblib')
    joblib.dump({
        'model': best_model_obj,
        'feature_cols': feature_cols,
        'model_name': best_model_name,
        'metrics': metrics_summary[best_model_name],
        'all_metrics': metrics_summary,
        'feature_importances': df_imp.to_dict(orient='records')
    }, model_path)
    print_log(f"Saved trained prospectivity model package to {model_path}")

    # Save Metrics CSV and JSON
    df_metrics = pd.DataFrame.from_dict(metrics_summary, orient='index')
    metrics_csv = os.path.join(reports_dir, 'prospectivity_metrics.csv')
    metrics_json = os.path.join(reports_dir, 'prospectivity_metrics.json')
    df_metrics.to_csv(metrics_csv)
    with open(metrics_json, 'w') as f:
        json.dump(metrics_summary, f, indent=2)
    print_log(f"Saved metrics reports to {metrics_csv} and {metrics_json}")

    # --- Generate Prospectivity Probability Raster ---
    print_log("\nGenerating full-area prospectivity probability raster...")
    X_full = df[feature_cols]
    full_probs = best_model_obj.predict_proba(X_full)[:, 1]
    df['prospectivity_prob'] = full_probs

    # Reconstruct 2D raster grid
    minx, miny, maxx, maxy = 79.60, 21.60, 80.30, 22.05
    res = 0.002
    width = int(np.round((maxx - minx) / res))
    height = int(np.round((maxy - miny) / res))

    prob_grid = np.zeros((height, width), dtype=np.float32)
    prob_grid[df['row_idx'].values, df['col_idx'].values] = full_probs

    prob_tif = os.path.join(predictions_dir, 'balaghat_prospectivity.tif')
    transform = from_bounds(minx, miny, maxx, maxy, width, height)
    with rasterio.open(
        prob_tif, 'w', driver='GTiff',
        height=height, width=width, count=1, dtype=prob_grid.dtype,
        crs='EPSG:4326', transform=transform
    ) as dst:
        dst.write(prob_grid, 1)
    print_log(f"Successfully generated prospectivity raster output at: {prob_tif}")

if __name__ == '__main__':
    main()
