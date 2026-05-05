import os
import joblib
import pandas as pd
import numpy as np

from sklearn.metrics import f1_score


# =========================
# LOAD MODEL + DATA
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model_improved.pkl"))
le_target = joblib.load(os.path.join(BASE_DIR, "models", "target_encoder_improved.pkl"))

data_path = os.path.join(BASE_DIR, "data", "raw", "flood_prediction_demo.csv")
df = pd.read_csv(data_path)


# =========================
# PREPROCESS
# =========================

df = df.rename(columns={
    'Rainfall_mm': 'rainfall_mm',
    'River_Level_m': 'river_level_m',
    'Soil_Moisture_%': 'soil_moisture',
    'City': 'city'
})

df = df.dropna()

df['danger_score'] = (
    df['rainfall_mm'] / 300 +
    df['river_level_m'] / 5 +
    df['soil_moisture'] / 100
)

def classify_risk(score):
    if score >= 2.0:
        return "High"
    elif score >= 1.2:
        return "Moderate"
    else:
        return "Low"

df['flood_risk'] = df['danger_score'].apply(classify_risk)

df = pd.get_dummies(df, columns=['city'], drop_first=True)

X = df[
    [
        'rainfall_mm',
        'river_level_m',
        'soil_moisture',
        'city_Suburban',
        'city_Urban'
    ]
]

y = df['flood_risk']


# =========================
# GET PROBABILITIES
# =========================

probs = model.predict_proba(X)

high_index = list(le_target.classes_).index("High")
high_probs = probs[:, high_index]

# Convert y to binary (High vs others)
y_binary = (y == "High").astype(int)


# =========================
# THRESHOLD SEARCH
# =========================

thresholds = np.arange(0.3, 0.9, 0.05)

best_thresh = 0
best_score = 0

print("\nThreshold Tuning Results:\n")

for t in thresholds:
    preds = (high_probs >= t).astype(int)
    score = f1_score(y_binary, preds)

    print(f"Threshold: {t:.2f} → F1 Score: {score:.4f}")

    if score > best_score:
        best_score = score
        best_thresh = t

print("\n🔥 BEST THRESHOLD:", best_thresh)
print("🔥 BEST F1 SCORE:", best_score)