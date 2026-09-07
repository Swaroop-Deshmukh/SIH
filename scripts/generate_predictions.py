import os
import sys
import joblib
import pandas as pd
import numpy as np

def print_log(msg):
    print(msg, flush=True)

class Predictor:
    def __init__(self, base_dir=None):
        if base_dir is None:
            base_dir = os.path.abspath(os.curdir)
        self.base_dir = base_dir
        self.prospectivity_pkg = None
        self.operations_pkg = None

        prosp_path = os.path.join(base_dir, 'models', 'prospectivity_model.joblib')
        ops_path = os.path.join(base_dir, 'models', 'operations_model.joblib')

        if os.path.exists(prosp_path):
            self.prospectivity_pkg = joblib.load(prosp_path)
            print_log(f"Loaded Prospectivity Model ({self.prospectivity_pkg.get('model_name')})")

        if os.path.exists(ops_path):
            self.operations_pkg = joblib.load(ops_path)
            print_log(f"Loaded Operational Model ({self.operations_pkg.get('model_name')})")

    def predict_prospectivity(self, input_dict):
        if self.prospectivity_pkg is None:
            return {"error": "Prospectivity model not loaded."}
        
        model = self.prospectivity_pkg['model']
        feature_cols = self.prospectivity_pkg['feature_cols']

        df_in = pd.DataFrame([input_dict])
        for col in feature_cols:
            if col not in df_in.columns:
                df_in[col] = 0.0

        df_in = df_in[feature_cols]
        prob = float(model.predict_proba(df_in)[0, 1])
        pred_label = int(prob >= 0.5)

        return {
            "prospectivity_probability": prob,
            "prospectivity_percentage": f"{prob * 100:.2f}%",
            "prediction_class": "High Prospectivity (Manganese Occurrence Expected)" if pred_label == 1 else "Low/Background Prospectivity",
            "model_used": self.prospectivity_pkg.get('model_name')
        }

    def predict_operational_shortfall(self, input_dict):
        if self.operations_pkg is None:
            return {"error": "Operations model not loaded."}

        model = self.operations_pkg['model']
        feature_cols = self.operations_pkg['feature_cols']

        df_in = pd.DataFrame([input_dict])
        for col in feature_cols:
            if col not in df_in.columns:
                df_in[col] = 0.0

        df_in = df_in[feature_cols]
        prob = float(model.predict_proba(df_in)[0, 1]) if hasattr(model, "predict_proba") else float(model.predict(df_in)[0])
        pred_label = int(prob >= 0.5)

        return {
            "shortfall_probability": prob,
            "shortfall_percentage": f"{prob * 100:.2f}%",
            "prediction_status": "HIGH RISK of Operational Production Shortfall" if pred_label == 1 else "LOW RISK (On Target Production)",
            "model_used": self.operations_pkg.get('model_name')
        }

def main():
    print_log("=== STEP 7: Testing Prediction API ===")
    predictor = Predictor()

    sample_prosp = {
        'elevation': 350.0, 'slope': 8.5, 'aspect': 180.0,
        's1_vv': -11.2, 's1_vh': -18.4, 's1_ratio': 0.6,
        'b02_blue': 1200, 'b03_green': 1400, 'b04_red': 1600, 'b08_nir': 2800, 'b11_swir1': 3100, 'b12_swir2': 2400,
        'ndvi': 0.27, 'ndbi': 0.05, 'ndwi': -0.33, 'clay_index': 1.29, 'ferrous_index': 1.10,
        'landsat_b1': 0.12, 'landsat_b2': 0.14, 'landsat_b3': 0.18, 'landsat_b4': 0.22, 'landsat_b5': 0.35,
        'soil_moisture': 0.25, 'rainfall': 1200.0,
        'dist_roads_km': 1.5, 'dist_chem_km': 0.8, 'nearest_mno_pct': 18.5
    }

    res_p = predictor.predict_prospectivity(sample_prosp)
    print_log(f"Sample Prospectivity Result: {res_p}")

    sample_ops = {
        'target_tonnes': 500.0, 'ore_grade_mn': 38.0, 'planned_tonnes': 500.0,
        'development_percent': 85.0, 'drilling_percent': 90.0, 'blasting_readiness': 80.0, 'access_readiness': 95.0,
        'equip_operating_hours_sum': 140.0, 'equip_downtime_hours_sum': 15.0, 'equip_availability_avg': 0.88,
        'equip_utilization_avg': 0.75, 'equip_fuel_consumed_sum': 1200.0,
        'maint_cost_sum': 25000.0, 'maint_duration_sum': 4.0, 'maint_count': 2,
        'delay_duration_sum': 1.5, 'delay_count': 1,
        'actual_tonnes_lag1': 480.0, 'target_tonnes_lag1': 500.0, 'shortfall_tonnes_lag1': 20.0,
        'actual_tonnes_roll3': 475.0, 'downtime_hours_roll3': 12.0, 'equip_avail_roll3': 0.86,
        'mine_code': 0
    }

    res_o = predictor.predict_operational_shortfall(sample_ops)
    print_log(f"Sample Operational Shortfall Result: {res_o}")

if __name__ == '__main__':
    main()
