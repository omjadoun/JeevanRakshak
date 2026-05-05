# src/test_evacuation_model.py

import os
import joblib
import pandas as pd


# =========================
# 1. LOAD MODEL
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "evacuation_model.pkl"))

print("\n✅ Evacuation model loaded successfully!")


# =========================
# 2. DEFINE TEST CASES
# =========================

test_cases = [
    # rainfall, water_level, soil_moisture, city
    (10, 0.5, 20, "Rural"),        # No evacuation
    (80, 1.2, 40, "Urban"),        # No evacuation
    (150, 2.5, 60, "Suburban"),    # Borderline
    (300, 4.5, 85, "Urban"),       # Evacuation
    (400, 6.0, 90, "Urban"),       # Evacuation
    (50, 0.8, 30, "Rural"),        # No evacuation
    (200, 3.0, 70, "Suburban"),    # Likely evacuation
]


# =========================
# 3. PREDICTION FUNCTION
# =========================

def predict_case(rainfall, water_level, soil_moisture, city):

    city = city.capitalize()

    city_suburban = 1 if city == "Suburban" else 0
    city_urban = 1 if city == "Urban" else 0

    X = pd.DataFrame([{
        'rainfall_mm': rainfall,
        'river_level_m': water_level,
        'soil_moisture': soil_moisture,
        'city_Suburban': city_suburban,
        'city_Urban': city_urban
    }])

    prediction = model.predict(X)

    return int(prediction[0])


# =========================
# 4. RUN TEST CASES
# =========================

results = []

print("\n🚀 Running Evacuation Test Cases...\n")

for i, (rainfall, water_level, soil_moisture, city) in enumerate(test_cases, 1):

    predicted = predict_case(rainfall, water_level, soil_moisture, city)

    decision = "YES" if predicted == 1 else "NO"

    results.append({
        "Test Case": i,
        "Rainfall (mm)": rainfall,
        "Water Level (m)": water_level,
        "Soil Moisture (%)": soil_moisture,
        "City": city,
        "Evacuation Required": decision
    })

    print(f"Test {i}: {decision}")


# =========================
# 5. DISPLAY RESULTS
# =========================

df_results = pd.DataFrame(results)

print("\n📊 Detailed Results:\n")
print(df_results.to_string(index=False))


# =========================
# 6. SAVE RESULTS
# =========================

output_path = os.path.join(BASE_DIR, "outputs", "evacuation_test_results.csv")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

df_results.to_csv(output_path, index=False)

print(f"\n✅ Results saved to: {output_path}")