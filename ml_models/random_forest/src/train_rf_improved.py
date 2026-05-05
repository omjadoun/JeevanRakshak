# src/train_rf_improved.py

import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score


# =========================
# 1. LOAD DATA
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "flood_prediction_demo.csv")

df = pd.read_csv(DATA_PATH)

print("\nDataset Loaded Successfully!")
print(df.head())


# =========================
# 2. CLEAN & STANDARDIZE
# =========================

df = df.rename(columns={
    'Rainfall_mm': 'rainfall_mm',
    'River_Level_m': 'river_level_m',
    'Soil_Moisture_%': 'soil_moisture',
    'City': 'city'
})

df = df.dropna()


# =========================
# 3. CREATE DOMAIN-BASED RISK 🔥
# =========================

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
df = df.drop(columns=['Flood_Risk'])


# =========================
# 4. FEATURE ENGINEERING
# =========================

df['water_stress'] = df['rainfall_mm'] * df['river_level_m']
df['saturation_index'] = df['soil_moisture'] * df['rainfall_mm']


# =========================
# 5. ENCODE DATA
# =========================

df = pd.get_dummies(df, columns=['city'], drop_first=True)

le_target = LabelEncoder()
df['flood_risk'] = le_target.fit_transform(df['flood_risk'])


# =========================
# 6. FEATURES & TARGET
# =========================

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
# 7. TRAIN-TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# =========================
# 8. TRAIN MODEL
# =========================

model = RandomForestClassifier(
    n_estimators=400,
    max_depth=None,
    min_samples_split=4,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)


# =========================
# 9. EVALUATION
# =========================

y_pred = model.predict(X_test)

print("\n🔥 IMPROVED MODEL PERFORMANCE 🔥")
print("Accuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# =========================
# 10. SAVE MODEL
# =========================

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

joblib.dump(model, os.path.join(BASE_DIR, "models", "rf_model_improved.pkl"))
joblib.dump(le_target, os.path.join(BASE_DIR, "models", "target_encoder_improved.pkl"))

print("\nImproved model saved successfully!")