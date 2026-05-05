# src/test_rf_improved.py

import os
import joblib
import pandas as pd


# =========================
# 1. LOAD MODEL
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model_improved.pkl"))
le_target = joblib.load(os.path.join(BASE_DIR, "models", "target_encoder_improved.pkl"))

print("\n✅ Model loaded successfully!")


# =========================
# 2. DEFINE TEST CASES
# =========================

test_cases = [
    # rainfall, water_level, soil_moisture, city
    (10, 0.5, 20, "Rural"),        # Low
    (80, 1.2, 40, "Urban"),        # Low/Moderate
    (150, 2.5, 60, "Suburban"),    # Moderate
    (300, 4.5, 85, "Urban"),       # High
    (400, 6.0, 90, "Urban"),       # High
    (50, 0.8, 30, "Rural"),        # Low
    (200, 3.0, 70, "Suburban"),    # Moderate/High
]


# =========================
# 3. PREDICTION FUNCTION
# =========================

def predict_case(rainfall, water_level, soil_moisture, city):

    city = city.capitalize()

    # One-hot encoding (same as training)
    city_suburban = 1 if city == "Suburban" else 0
    city_urban = 1 if city == "Urban" else 0

    # Create DataFrame (fixes warning)
    X = pd.DataFrame([{
        'rainfall_mm': rainfall,
        'river_level_m': water_level,
        'soil_moisture': soil_moisture,
        'city_Suburban': city_suburban,
        'city_Urban': city_urban
    }])

    prediction = model.predict(X)
    risk = le_target.inverse_transform(prediction)

    return risk[0]


# =========================
# 4. RUN TEST CASES
# =========================

results = []

print("\n🚀 Running Test Cases...\n")

for i, (rainfall, water_level, soil_moisture, city) in enumerate(test_cases, 1):

    predicted_risk = predict_case(rainfall, water_level, soil_moisture, city)

    results.append({
        "Test Case": i,
        "Rainfall (mm)": rainfall,
        "Water Level (m)": water_level,
        "Soil Moisture (%)": soil_moisture,
        "City": city,
        "Predicted Risk": predicted_risk
    })

    print(f"Test {i}: {predicted_risk}")


# =========================
# 5. DISPLAY RESULTS
# =========================

df_results = pd.DataFrame(results)

print("\n📊 Detailed Results:\n")
print(df_results.to_string(index=False))


# =========================
# 6. SAVE RESULTS
# =========================

output_path = os.path.join(BASE_DIR, "outputs", "test_results.csv")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

df_results.to_csv(output_path, index=False)

print(f"\n✅ Results saved to: {output_path}")