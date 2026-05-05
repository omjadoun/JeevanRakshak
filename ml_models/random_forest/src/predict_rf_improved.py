# src/predict_rf_improved.py

import os
import joblib
import pandas as pd


# =========================
# 1. LOAD MODELS
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

flood_model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model_improved.pkl"))
evac_model = joblib.load(os.path.join(BASE_DIR, "models", "evacuation_model.pkl"))
le_target = joblib.load(os.path.join(BASE_DIR, "models", "target_encoder_improved.pkl"))

print("\n✅ Models loaded successfully!")


# =========================
# 2. USER INPUT
# =========================

rainfall = float(input("Enter Rainfall (mm): "))
water_level = float(input("Enter Water Level (m): "))
soil_moisture = float(input("Enter Soil Moisture (%): "))
city = input("Enter City (Urban/Suburban/Rural): ").strip().capitalize()


# =========================
# 3. PREPROCESS INPUT
# =========================

city_suburban = 1 if city == "Suburban" else 0
city_urban = 1 if city == "Urban" else 0

X = pd.DataFrame([{
    'rainfall_mm': rainfall,
    'river_level_m': water_level,
    'soil_moisture': soil_moisture,
    'city_Suburban': city_suburban,
    'city_Urban': city_urban
}])


# =========================
# 4. FLOOD PREDICTION
# =========================

prediction = flood_model.predict(X)
risk_label = le_target.inverse_transform(prediction)[0]

# Get probabilities
proba = flood_model.predict_proba(X)[0]

# Map probabilities
classes = le_target.classes_
prob_dict = dict(zip(classes, proba))

high_prob = prob_dict.get("High", 0)


# =========================
# 5. DECISION LOGIC (TEAMMATE STYLE)
# =========================

if high_prob >= 0.65:
    decision = "HIGH RISK - Evacuate"
elif high_prob >= 0.40:
    decision = "MEDIUM RISK - Prepare"
else:
    decision = "LOW RISK - Monitor"
    
# =========================
# 6. EVACUATION MODEL (VALIDATION LAYER)
# =========================

evac_prediction = evac_model.predict(X)[0]

if evac_prediction == 1:
    decision = "HIGH RISK - Evacuate (Confirmed by Evacuation Model)"


# =========================
# 7. OUTPUT
# =========================

print("\n🔍 Flood Risk Prediction:", risk_label)

print("\n📊 Probabilities:")
for k, v in prob_dict.items():
    print(f"{k}: {v:.2f}")

print(f"\n🚨 Final Decision: {decision}")