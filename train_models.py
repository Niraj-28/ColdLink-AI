"""
Quick Model Training Script for Testing
Trains models without running full notebooks
"""

import pandas as pd
import numpy as np
import joblib
import json
import warnings
from pathlib import Path
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import xgboost as xgb
import shap

warnings.filterwarnings('ignore')
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

print("="*70)
print("COLDLINK AI - QUICK MODEL TRAINING")
print("="*70)

# Create models directory
Path('models').mkdir(exist_ok=True)

# Load data
print("\n1. Loading data...")
df = pd.read_csv('data/input_data.csv')
df['date'] = pd.to_datetime(df['date'])
df = df.drop_duplicates().sort_values(['batch_id', 'date']).reset_index(drop=True)
print(f"   Loaded: {df.shape}")

# Create simple target
print("\n2. Creating target variable...")
batch_outcomes = df.groupby('batch_id').agg({
    'item_expiry_hours': 'min',
    'out_of_bound_temperature_hours': 'max',
    'current_hop': lambda x: x.iloc[-1]
}).reset_index()

batch_outcomes['expired'] = batch_outcomes['item_expiry_hours'] < 0
batch_outcomes['high_oob'] = batch_outcomes['out_of_bound_temperature_hours'] > 24
batch_outcomes['discarded'] = batch_outcomes['current_hop'].str.contains('discard', case=False, na=False)
batch_outcomes['batch_failed'] = (batch_outcomes['expired'] | batch_outcomes['high_oob'] | batch_outcomes['discarded']).astype(int)

df = df.merge(batch_outcomes[['batch_id', 'batch_failed']], on='batch_id')
df['target'] = df['batch_failed']
print(f"   Target distribution: {df['target'].value_counts().to_dict()}")

# Create simple features
print("\n3. Creating features...")
df['hour'] = df['date'].dt.hour
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
df['temp_diff'] = df['room_temp_reading'] - df['thermal_shipper_temp_reading']
df['shipper_temp_too_high'] = (df['thermal_shipper_temp_reading'] > 8).astype(int)
df['shipper_temp_too_low'] = (df['thermal_shipper_temp_reading'] < 2).astype(int)
df['is_expired'] = (df['item_expiry_hours'] < 0).astype(int)
df['near_expiry'] = ((df['item_expiry_hours'] >= 0) & (df['item_expiry_hours'] < 24)).astype(int)
df['has_oob_exposure'] = (df['out_of_bound_temperature_hours'] > 0).astype(int)
df['total_storage_time'] = (df['ultra_low_temperature_freezer_hours'] + 
                              df['refrigeration_temperature_hours'] + 
                              df['out_of_bound_temperature_hours'])

# Encode categoricals
label_encoders = {}
for col in ['location', 'current_hop', 'external_storage']:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# Define features
numeric_features = ['thermal_shipper_temp_reading', 'room_temp_reading', 'room_humidity_reading',
                   'item_expiry_hours', 'ultra_low_temperature_freezer_hours',
                   'out_of_bound_temperature_hours', 'refrigeration_temperature_hours',
                   'hour', 'day_of_week', 'is_weekend', 'temp_diff', 
                   'shipper_temp_too_high', 'shipper_temp_too_low', 'is_expired', 'near_expiry',
                   'has_oob_exposure', 'total_storage_time']
encoded_categorical = ['location_encoded', 'current_hop_encoded', 'external_storage_encoded']
all_features = numeric_features + encoded_categorical
print(f"   Total features: {len(all_features)}")

# Chronological split
print("\n4. Splitting data chronologically...")
min_date = df['date'].min()
max_date = df['date'].max()
date_range = (max_date - min_date).total_seconds()
train_end = min_date + pd.Timedelta(seconds=date_range * 0.6)
val_end = min_date + pd.Timedelta(seconds=date_range * 0.8)

train_df = df[df['date'] <= train_end]
val_df = df[(df['date'] > train_end) & (df['date'] <= val_end)]
test_df = df[df['date'] > val_end]

X_train, y_train = train_df[all_features], train_df['target']
X_val, y_val = val_df[all_features], val_df['target']
X_test, y_test = test_df[all_features], test_df['target']

print(f"   Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

# Scale features
print("\n5. Scaling features...")
scaler = StandardScaler()
numeric_indices = [i for i, col in enumerate(all_features) if col in numeric_features]
X_train_scaled = X_train.copy().astype(float)
X_train_scaled.iloc[:, numeric_indices] = scaler.fit_transform(X_train.iloc[:, numeric_indices])

# Train models
print("\n6. Training models...")
models = {}

print("   Training Logistic Regression...")
models['logistic_regression'] = LogisticRegression(random_state=RANDOM_STATE, max_iter=1000, class_weight='balanced')
models['logistic_regression'].fit(X_train_scaled, y_train)

print("   Training Random Forest...")
models['random_forest'] = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=RANDOM_STATE, 
                                                 class_weight='balanced', n_jobs=-1)
models['random_forest'].fit(X_train, y_train)

print("   Training XGBoost...")
models['xgboost'] = xgb.XGBClassifier(n_estimators=50, max_depth=6, learning_rate=0.1, 
                                     random_state=RANDOM_STATE, eval_metric='logloss',
                                     scale_pos_weight=(y_train==0).sum()/(y_train==1).sum())
models['xgboost'].fit(X_train, y_train)

print("   Training HistGradientBoosting...")
models['histgradientboosting'] = HistGradientBoostingClassifier(max_iter=50, max_depth=6, 
                                                                learning_rate=0.1, random_state=RANDOM_STATE)
models['histgradientboosting'].fit(X_train, y_train)

# Evaluate and select best
print("\n7. Evaluating models...")
best_f1 = 0
best_model_name = None
results = {}

for name, model in models.items():
    X_te = X_test
    y_pred = model.predict(X_te)
    y_proba = model.predict_proba(X_te)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc = roc_auc_score(y_test, y_proba)
    
    results[name] = {'accuracy': acc, 'precision': prec, 'recall': rec, 'f1': f1, 'roc_auc': roc}
    print(f"   {name:25} | Acc: {acc:.3f} | F1: {f1:.3f} | ROC-AUC: {roc:.3f}")
    
    if f1 > best_f1:
        best_f1 = f1
        best_model_name = name

best_model = models[best_model_name]
print(f"\n   [BEST] Best model: {best_model_name} (F1: {best_f1:.3f})")

# Save models
print("\n8. Saving models...")
joblib.dump(best_model, 'models/best_model.pkl')
for name, model in models.items():
    joblib.dump(model, f'models/{name}.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(label_encoders, 'models/label_encoders.pkl')
joblib.dump({
    'all_features': all_features,
    'numeric_features': numeric_features,
    'categorical_features': ['location', 'current_hop', 'external_storage'],
    'encoded_categorical': encoded_categorical
}, 'models/feature_names.pkl')

# SHAP
print("\n9. Creating SHAP explainer...")
X_test_sample = X_test.sample(min(100, len(X_test)), random_state=RANDOM_STATE)
explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test_sample)

# Handle different SHAP value formats
if isinstance(shap_values, list):
    shap_values = shap_values[1]  # Positive class

# For multi-output (binary classification), select positive class
if len(shap_values.shape) == 3:
    shap_values = shap_values[:, :, 1]  # (samples, features, classes) -> (samples, features)

# Calculate mean absolute SHAP values
shap_importance = np.abs(shap_values).mean(axis=0)

feature_importance_df = pd.DataFrame({
    'feature': all_features,
    'importance': list(shap_importance)
}).sort_values('importance', ascending=False)

joblib.dump({
    'explainer': explainer,
    'shap_values_sample': shap_values,
    'X_test_sample': X_test_sample,
    'feature_importance': feature_importance_df
}, 'models/shap_explainer.pkl')

# Metadata
print("\n10. Saving metadata...")
# Also save engineered dataset for backend
df_engineered = pd.concat([X_train, X_val, X_test], axis=0)
df_engineered['target'] = pd.concat([y_train, y_val, y_test], axis=0)
# Add back date and batch_id for backend
original_indices = df_engineered.index
df_engineered['date'] = df['date'].iloc[original_indices].values
df_engineered['batch_id'] = df['batch_id'].iloc[original_indices].values
# Reorder columns
cols = ['date', 'batch_id'] + all_features + ['target']
df_engineered = df_engineered[cols]
df_engineered.to_csv('data/engineered_features.csv', index=False)
print(f"   [OK] Saved engineered features: {df_engineered.shape}")

metadata = {
    'best_model': best_model_name,
    'best_model_metrics': {k: float(v) for k, v in results[best_model_name].items()},
    'all_models_comparison': {name: {k: float(v) for k, v in metrics.items()} for name, metrics in results.items()},
    'training_date': pd.Timestamp.now().isoformat(),
    'train_size': len(X_train),
    'val_size': len(X_val),
    'test_size': len(X_test),
    'num_features': len(all_features),
    'target_distribution': {
        'train': {'0': int((y_train==0).sum()), '1': int((y_train==1).sum())},
        'test': {'0': int((y_test==0).sum()), '1': int((y_test==1).sum())}
    },
    'feature_list': all_features,
    'top_features': feature_importance_df.head(10)['feature'].tolist()
}

with open('models/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n" + "="*70)
print("MODEL TRAINING COMPLETE!")
print("="*70)
print("\n[OK] Best model: {best_model_name}")
print(f"[OK] Test Accuracy: {results[best_model_name]['accuracy']:.3f}")
print(f"[OK] Test F1-Score: {results[best_model_name]['f1']:.3f}")
print(f"[OK] Test ROC-AUC: {results[best_model_name]['roc_auc']:.3f}")
print(f"[OK] Models saved to models/")
print(f"[OK] Total features: {len(all_features)}")
print("\nReady to start backend!")
