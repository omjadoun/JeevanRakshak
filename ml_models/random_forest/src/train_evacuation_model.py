# src/train_evacuation_model.py

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
# 3. CREATE DANGER SCORE
# =========================

df['danger_score'] = (
    df['rainfall_mm'] / 300 +
    df['river_level_m'] / 5 +
    df['soil_moisture'] / 100
)


# =========================
# 4. CREATE EVACUATION LABEL 🔥
# =========================

def evacuation_logic(score):
    if score >= 1.5:
        return 1
    else:
        return 0

df['evacuation_required'] = df['danger_score'].apply(evacuation_logic)


# =========================
# 5. ENCODE CITY
# =========================

df = pd.get_dummies(df, columns=['city'], drop_first=True)


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

y = df['evacuation_required']


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
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)


# =========================
# 9. EVALUATION
# =========================

y_pred = model.predict(X_test)

print("\n🚨 EVACUATION MODEL PERFORMANCE 🚨")
print("Accuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# =========================
# 10. SAVE MODEL
# =========================

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

joblib.dump(model, os.path.join(BASE_DIR, "models", "evacuation_model.pkl"))

print("\nEvacuation model saved successfully!")