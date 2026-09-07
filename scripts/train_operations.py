import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, f1_score, confusion_matrix
)

def print_log(msg):
    print(msg, flush=True)

def main():
    base_dir = os.path.abspath(os.curdir)
    features_csv = os.path.join(base_dir, 'features', 'operations_features.csv')
    models_dir = os.path.join(base_dir, 'models')
    reports_dir = os.path.join(base_dir, 'reports')
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)

    print_log("=== STEP 6: Synthetic Operations Model Training ===")

    df = pd.read_csv(features_csv)
    df['date'] = pd.to_datetime(df['date'])
    print_log(f"Loaded operational feature dataset: {len(df)} total records from {df['date'].min().date()} to {df['date'].max().date()}")

    # Define Feature List (Strictly historical & current indicators, no future leakage)
    feature_cols = [
        'target_tonnes', 'ore_grade_mn', 'planned_tonnes',
        'development_percent', 'drilling_percent', 'blasting_readiness', 'access_readiness',
        'equip_operating_hours_sum', 'equip_downtime_hours_sum', 'equip_availability_avg',
        'equip_utilization_avg', 'equip_fuel_consumed_sum',
        'maint_cost_sum', 'maint_duration_sum', 'maint_count',
        'delay_duration_sum', 'delay_count',
        'actual_tonnes_lag1', 'target_tonnes_lag1', 'shortfall_tonnes_lag1',
        'actual_tonnes_roll3', 'downtime_hours_roll3', 'equip_avail_roll3',
        'mine_code'
    ]

    # Fill any remaining NaNs in features
    df[feature_cols] = df[feature_cols].fillna(0)

    X = df[feature_cols]
    y = df['is_shortfall'].values

    # Respect Time-Series Split: Train on 2024-2025 data, Test on 2026 data
    split_date = pd.to_datetime('2026-01-01')
    train_mask = df['date'] < split_date
    test_mask = df['date'] >= split_date

    X_train, y_train = X[train_mask], y[train_mask]
    X_test, y_test = X[test_mask], y[test_mask]

    print_log(f"Time-Series Split -> Train (2024-2025): {len(X_train)} rows (Shortfall %: {np.mean(y_train)*100:.1f}%), Test (2026): {len(X_test)} rows (Shortfall %: {np.mean(y_test)*100:.1f}%)")

    # Define Models
    models = {
        'LogisticRegression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, random_state=42))
        ]),
        'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
        'HistGradientBoosting': HistGradientBoostingClassifier(max_iter=100, max_depth=6, random_state=42)
    }

    metrics_summary = {}
    best_model_name = None
    best_f1 = -1.0
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

        print_log(f"  {name} Metrics -> Accuracy: {acc:.4f} | F1: {f1:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | ROC-AUC: {roc_auc:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = model

    print_log(f"\nBest Operations Model: {best_model_name} with F1-Score = {best_f1:.4f}")

    # Feature Importance
    rf_model = models['RandomForest']
    importances = rf_model.feature_importances_
    df_imp = pd.DataFrame({
        'feature': feature_cols,
        'importance': importances
    }).sort_values(by='importance', ascending=False)

    print_log("\nTop 10 Operational Shortfall Predictors:")
    print_log(df_imp.head(10).to_string(index=False))

    # Save Best Model Package
    model_path = os.path.join(models_dir, 'operations_model.joblib')
    joblib.dump({
        'model': best_model_obj,
        'feature_cols': feature_cols,
        'model_name': best_model_name,
        'metrics': metrics_summary[best_model_name],
        'all_metrics': metrics_summary,
        'feature_importances': df_imp.to_dict(orient='records')
    }, model_path)
    print_log(f"Saved trained operations model to {model_path}")

    # Save Metrics CSV and JSON
    df_metrics = pd.DataFrame.from_dict(metrics_summary, orient='index')
    metrics_csv = os.path.join(reports_dir, 'operational_metrics.csv')
    metrics_json = os.path.join(reports_dir, 'operational_metrics.json')
    df_metrics.to_csv(metrics_csv)
    with open(metrics_json, 'w') as f:
        json.dump(metrics_summary, f, indent=2)
    print_log(f"Saved operational metrics reports to {metrics_csv} and {metrics_json}")

if __name__ == '__main__':
    main()
