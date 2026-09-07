import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt

# Ensure root directory is in python path to import scripts
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from scripts.generate_predictions import Predictor

# Page Setup
st.set_page_config(
    page_title="Balaghat Mining Intelligence & Prospectivity ML Prototype",
    page_icon="⛏️",
    layout="wide"
)

st.title("⛏️ Balaghat Mining Intelligence & Mineral Prospectivity Prototype")
st.subheader("Dual ML Pipeline: Geospatial Mineral Prospectivity (Pipeline A) & Operational Shortfall Prediction (Pipeline B)")

# Sidebar Navigation
st.sidebar.header("Navigation")
page = st.sidebar.radio(
    "Select UI Section",
    [
        "1. Dataset Overview",
        "2. Mineral Prospectivity",
        "3. Operational ML",
        "4. Model Performance",
        "5. Interactive Predictions"
    ]
)

# Load Datasets & Reports (Cached)
@st.cache_data
def load_inventory():
    json_path = os.path.join(BASE_DIR, 'reports', 'dataset_inventory.json')
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            return json.load(f)
    return None

@st.cache_data
def load_prospectivity_metrics():
    path = os.path.join(BASE_DIR, 'reports', 'prospectivity_metrics.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None

@st.cache_data
def load_operational_metrics():
    path = os.path.join(BASE_DIR, 'reports', 'operational_metrics.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None

inventory = load_inventory()
prosp_metrics = load_prospectivity_metrics()
ops_metrics = load_operational_metrics()
predictor = Predictor(BASE_DIR)

# ----------------------------------------------------
# 1. DATASET OVERVIEW
# ----------------------------------------------------
if page == "1. Dataset Overview":
    st.header("1. Dataset Overview & Data Inventory")
    
    col1, col2, col3 = st.columns(3)
    raw_cnt = len(inventory.get('raw_inventory', [])) if inventory else 0
    synth_cnt = len(inventory.get('synthetic_inventory', [])) if inventory else 0
    col1.metric("Raw Geospatial Files", raw_cnt)
    col2.metric("Synthetic Operational Files", synth_cnt)
    col3.metric("ML Pipelines Configured", "2 Separate Pipelines")

    st.markdown("---")
    st.subheader("Pipeline A — Raw Geospatial Datasets (`raw/`)")
    if inventory and 'raw_inventory' in inventory:
        df_raw = pd.DataFrame(inventory['raw_inventory'])
        st.dataframe(df_raw[['relative_path', 'size_human', 'file_type', 'extension', 'crs', 'feature_count', 'count']], use_container_width=True)

    st.markdown("---")
    st.subheader("Pipeline B — Synthetic Operational Datasets (`synthetic/`)")
    if inventory and 'synthetic_inventory' in inventory:
        df_synth = pd.DataFrame(inventory['synthetic_inventory'])
        st.dataframe(df_synth[['relative_path', 'size_human', 'file_type', 'row_count', 'col_count']], use_container_width=True)

# ----------------------------------------------------
# 2. MINERAL PROSPECTIVITY
# ----------------------------------------------------
elif page == "2. Mineral Prospectivity":
    st.header("2. Pipeline A — Mineral Prospectivity Analysis")
    st.write("Identifies high-potential manganese occurrence zones by integrating DEM elevation, Sentinel-1 SAR, Sentinel-2 spectral indices, Landsat, and geochemical sample spatial models.")

    if prosp_metrics:
        st.subheader("Prospectivity Model Benchmark")
        df_pm = pd.DataFrame.from_dict(prosp_metrics, orient='index')
        st.dataframe(df_pm[['roc_auc', 'pr_auc', 'f1', 'precision', 'recall', 'accuracy']], use_container_width=True)

    prosp_pkg = predictor.prospectivity_pkg
    if prosp_pkg and 'feature_importances' in prosp_pkg:
        st.subheader("Top Predictive Prospectivity Features")
        df_imp = pd.DataFrame(prosp_pkg['feature_importances'])
        
        fig, ax = plt.subplots(figsize=(8, 4))
        top_df = df_imp.head(10).sort_values(by='importance')
        ax.barh(top_df['feature'], top_df['importance'], color='teal')
        ax.set_xlabel("Relative Feature Importance")
        ax.set_title("Top 10 Drivers for Manganese Prospectivity")
        st.pyplot(fig)

    st.subheader("Prospectivity Probability Map Output")
    tif_path = os.path.join(BASE_DIR, 'predictions', 'balaghat_prospectivity.tif')
    if os.path.exists(tif_path):
        st.success(f"Prospectivity probability raster successfully generated at `{tif_path}`")
    else:
        st.info("Prospectivity probability raster not yet rendered.")

# ----------------------------------------------------
# 3. OPERATIONAL ML
# ----------------------------------------------------
elif page == "3. Operational ML":
    st.header("3. Pipeline B — Operational Production Shortfall AI")
    st.write("Predicts daily block-level mine production shortfall (`target_tonnes > actual_tonnes`) using historical equipment availability, downtime, maintenance schedules, delay logs, and operational readiness indices.")

    if ops_metrics:
        st.subheader("Operational Shortfall Model Metrics")
        df_om = pd.DataFrame.from_dict(ops_metrics, orient='index')
        st.dataframe(df_om[['accuracy', 'f1', 'precision', 'recall', 'roc_auc']], use_container_width=True)

    ops_pkg = predictor.operations_pkg
    if ops_pkg and 'feature_importances' in ops_pkg:
        st.subheader("Top Production Shortfall Risk Drivers")
        df_imp = pd.DataFrame(ops_pkg['feature_importances'])
        
        fig, ax = plt.subplots(figsize=(8, 4))
        top_df = df_imp.head(10).sort_values(by='importance')
        ax.barh(top_df['feature'], top_df['importance'], color='darkorange')
        ax.set_xlabel("Relative Feature Importance")
        ax.set_title("Top Operational Shortfall Predictors")
        st.pyplot(fig)

# ----------------------------------------------------
# 4. MODEL PERFORMANCE
# ----------------------------------------------------
elif page == "4. Model Performance":
    st.header("4. Model Performance & Evaluation Summary")

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Prospectivity Models (Pipeline A)")
        if prosp_metrics:
            for name, m in prosp_metrics.items():
                st.markdown(f"**{name}**")
                st.write(f"- ROC-AUC: `{m['roc_auc']:.4f}` | PR-AUC: `{m['pr_auc']:.4f}` | F1: `{m['f1']:.4f}`")
                st.write(f"- Confusion Matrix: `{m['confusion_matrix']}`")

    with col2:
        st.subheader("Operational Shortfall Models (Pipeline B)")
        if ops_metrics:
            for name, m in ops_metrics.items():
                st.markdown(f"**{name}**")
                st.write(f"- F1-Score: `{m['f1']:.4f}` | Accuracy: `{m['accuracy']:.4f}` | ROC-AUC: `{m['roc_auc']:.4f}`")
                st.write(f"- Confusion Matrix: `{m['confusion_matrix']}`")

# ----------------------------------------------------
# 5. PREDICTIONS
# ----------------------------------------------------
elif page == "5. Interactive Predictions":
    st.header("5. Interactive Prediction Engine")

    pred_tab1, pred_tab2 = st.tabs(["Prospectivity Prediction", "Operational Shortfall Risk Prediction"])

    with pred_tab1:
        st.subheader("Test Spatial Prospectivity Prediction")
        col_a, col_b, col_c = st.columns(3)
        elev = col_a.number_input("Elevation (m)", 100.0, 800.0, 350.0)
        slope = col_b.number_input("Slope (deg)", 0.0, 45.0, 8.5)
        mno_pct = col_c.number_input("Nearest Geochem MnO (%)", 0.0, 60.0, 18.5)

        col_d, col_e, col_f = st.columns(3)
        dist_chem = col_d.number_input("Dist to Geochem Sample (km)", 0.0, 20.0, 0.8)
        dist_roads = col_e.number_input("Dist to Road (km)", 0.0, 20.0, 1.5)
        ndvi_val = col_f.number_input("NDVI Index", -1.0, 1.0, 0.27)

        if st.button("Run Prospectivity Prediction"):
            input_data = {
                'elevation': elev, 'slope': slope, 'aspect': 180.0,
                's1_vv': -11.2, 's1_vh': -18.4, 's1_ratio': 0.6,
                'b02_blue': 1200, 'b03_green': 1400, 'b04_red': 1600, 'b08_nir': 2800, 'b11_swir1': 3100, 'b12_swir2': 2400,
                'ndvi': ndvi_val, 'ndbi': 0.05, 'ndwi': -0.33, 'clay_index': 1.29, 'ferrous_index': 1.10,
                'landsat_b1': 0.12, 'landsat_b2': 0.14, 'landsat_b3': 0.18, 'landsat_b4': 0.22, 'landsat_b5': 0.35,
                'soil_moisture': 0.25, 'rainfall': 1200.0,
                'dist_roads_km': dist_roads, 'dist_chem_km': dist_chem, 'nearest_mno_pct': mno_pct
            }
            res = predictor.predict_prospectivity(input_data)
            st.write(res)
            st.metric("Prospectivity Probability", res.get('prospectivity_percentage'))
            st.success(res.get('prediction_class'))

    with pred_tab2:
        st.subheader("Test Operational Production Shortfall Prediction")
        col_x, col_y, col_z = st.columns(3)
        target_t = col_x.number_input("Target Tonnes", 100.0, 2000.0, 500.0)
        actual_lag1 = col_y.number_input("Actual Tonnes Yesterday (Lag1)", 50.0, 2000.0, 480.0)
        downtime_h = col_z.number_input("Equipment Downtime Hours", 0.0, 48.0, 15.0)

        col_u, col_v, col_w = st.columns(3)
        equip_avail = col_u.slider("Equipment Availability Ratio", 0.0, 1.0, 0.85)
        dev_percent = col_v.slider("Development Readiness (%)", 0.0, 100.0, 85.0)
        maint_cost = col_w.number_input("Maintenance Cost (INR)", 0.0, 500000.0, 25000.0)

        if st.button("Run Shortfall Risk Prediction"):
            input_ops = {
                'target_tonnes': target_t, 'ore_grade_mn': 38.0, 'planned_tonnes': target_t,
                'development_percent': dev_percent, 'drilling_percent': 90.0, 'blasting_readiness': 80.0, 'access_readiness': 95.0,
                'equip_operating_hours_sum': 140.0, 'equip_downtime_hours_sum': downtime_h, 'equip_availability_avg': equip_avail,
                'equip_utilization_avg': 0.75, 'equip_fuel_consumed_sum': 1200.0,
                'maint_cost_sum': maint_cost, 'maint_duration_sum': 4.0, 'maint_count': 2,
                'delay_duration_sum': 1.5, 'delay_count': 1,
                'actual_tonnes_lag1': actual_lag1, 'target_tonnes_lag1': target_t, 'shortfall_tonnes_lag1': target_t - actual_lag1,
                'actual_tonnes_roll3': actual_lag1, 'downtime_hours_roll3': downtime_h, 'equip_avail_roll3': equip_avail,
                'mine_code': 0
            }
            res_o = predictor.predict_operational_shortfall(input_ops)
            st.write(res_o)
            st.metric("Shortfall Risk Probability", res_o.get('shortfall_percentage'))
            if "HIGH RISK" in res_o.get('prediction_status', ''):
                st.error(res_o.get('prediction_status'))
            else:
                st.success(res_o.get('prediction_status'))
