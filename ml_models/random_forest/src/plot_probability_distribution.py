import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt


# =========================
# 1. LOAD MODEL + DATA
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "rf_model_improved.pkl"))
le_target = joblib.load(os.path.join(BASE_DIR, "models", "target_encoder_improved.pkl"))

data_path = os.path.join(BASE_DIR, "data", "raw", "flood_prediction_demo.csv")

df = pd.read_csv(data_path)


# =========================
# 2. PREPROCESS SAME AS TRAINING
# =========================

df = df.rename(columns={
    'Rainfall_mm': 'rainfall_mm',
    'River_Level_m': 'river_level_m',
    'Soil_Moisture_%': 'soil_moisture',
    'City': 'city'
})

df = df.dropna()

# Create danger score
df['danger_score'] = (
    df['rainfall_mm'] / 300 +
    df['river_level_m'] / 5 +
    df['soil_moisture'] / 100
)

# Create labels (same logic)
def classify_risk(score):
    if score >= 2.0:
        return "High"
    elif score >= 1.2:
        return "Moderate"
    else:
        return "Low"

df['flood_risk'] = df['danger_score'].apply(classify_risk)

# Encode city
df = pd.get_dummies(df, columns=['city'], drop_first=True)

# Features
X = df[
    [
        'rainfall_mm',
        'river_level_m',
        'soil_moisture',
        'city_Suburban',
        'city_Urban'
    ]
]


# =========================
# 3. GET PROBABILITIES
# =========================

probs = model.predict_proba(X)

# Find index of "High"
high_index = list(le_target.classes_).index("High")

high_probs = probs[:, high_index]


# =========================
# 4. PLOT DISTRIBUTION
# =========================

plt.hist(high_probs, bins=30)
plt.xlabel("Probability of High Flood Risk")
plt.ylabel("Frequency")
plt.title("Distribution of High Risk Probabilities")

# Add threshold lines
plt.axvline(0.65)
plt.axvline(0.40)

plt.show()