"""
ColdLink AI - FastAPI Backend
Main application file with all API endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Initialize FastAPI app
app = FastAPI(
    title="ColdLink AI API",
    description="AI-powered cold chain failure prediction system for vaccine shipments",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for loaded models and data
models = {}
scaler = None
label_encoders = {}
feature_names = {}
metadata = {}
df_data = None
shap_data = {}

# Risk thresholds (configurable)
RISK_THRESHOLDS = {
    'low': 0.3,
    'medium': 0.6,
    'high': 0.85
}


def load_models_and_data():
    """Load all trained models and preprocessing artifacts at startup"""
    global models, scaler, label_encoders, feature_names, metadata, df_data, shap_data
    
    try:
        # Load best model
        models['best'] = joblib.load('../models/best_model.pkl')
        print("✓ Best model loaded")
        
        # Load all models
        model_files = {
            'logistic_regression': '../models/logistic_regression.pkl',
            'random_forest': '../models/random_forest.pkl',
            'xgboost': '../models/xgboost.pkl',
            'histgradientboosting': '../models/histgradientboosting.pkl'
        }
        
        for name, path in model_files.items():
            if Path(path).exists():
                models[name] = joblib.load(path)
                print(f"✓ {name} loaded")
        
        # Load preprocessing artifacts
        scaler = joblib.load('../models/scaler.pkl')
        print("✓ Scaler loaded")
        
        label_encoders = joblib.load('../models/label_encoders.pkl')
        print("✓ Label encoders loaded")
        
        feature_names = joblib.load('../models/feature_names.pkl')
        print("✓ Feature names loaded")
        
        # Load metadata
        with open('../models/model_metadata.json', 'r') as f:
            metadata = json.load(f)
        print("✓ Model metadata loaded")
        
        # Load SHAP data
        shap_data = joblib.load('../models/shap_explainer.pkl')
        print("✓ SHAP data loaded")
        
        # Load original dataset for batch information (has location, current_hop, external_storage)
        df_data = pd.read_csv('../data/input_data.csv')
        df_data['date'] = pd.to_datetime(df_data['date'])
        print(f"✓ Dataset loaded: {df_data.shape}")
        
        print("\n🚀 All models and data loaded successfully!")
        
    except Exception as e:
        print(f"❌ Error loading models: {str(e)}")
        raise


@app.on_event("startup")
async def startup_event():
    """Load models when server starts"""
    print("\n" + "="*70)
    print("COLDLINK AI - BACKEND STARTUP")
    print("="*70 + "\n")
    load_models_and_data()
    print("\n" + "="*70)
    print("✓ Server ready to accept requests")
    print("="*70 + "\n")


# ============================================================================
# API MODELS (Request/Response schemas)
# ============================================================================

class PredictionRequest(BaseModel):
    """Request model for batch prediction"""
    thermal_shipper_temp_reading: float = Field(..., description="Temperature in thermal shipper (°C)")
    room_temp_reading: float = Field(..., description="Room temperature (°C)")
    room_humidity_reading: float = Field(..., description="Room humidity (%)")
    item_expiry_hours: float = Field(..., description="Hours until expiry")
    ultra_low_temperature_freezer_hours: float = Field(default=0, description="Hours in ultra-low freezer")
    out_of_bound_temperature_hours: float = Field(default=0, description="Hours out of temperature bounds")
    refrigeration_temperature_hours: float = Field(default=0, description="Hours in refrigeration")
    location: str = Field(..., description="Current location")
    current_hop: str = Field(..., description="Current hop in supply chain")
    external_storage: str = Field(..., description="External storage type")
    hour: Optional[int] = Field(default=12, description="Hour of day (0-23)")
    day_of_week: Optional[int] = Field(default=0, description="Day of week (0=Mon, 6=Sun)")


class PredictionResponse(BaseModel):
    """Response model for predictions"""
    risk_probability: float
    risk_level: str
    risk_category: str
    confidence: float
    top_risk_factors: List[Dict[str, Any]]
    recommendation: str


class BatchInfo(BaseModel):
    """Batch information model"""
    batch_id: str
    location: str
    current_hop: str
    storage: str
    temperature: float
    humidity: float
    expiry_hours: float
    risk_probability: float
    risk_level: str
    recommended_action: str


# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": len(models),
        "data_loaded": df_data is not None
    }


@app.get("/api/statistics")
async def get_statistics():
    """Get overall dataset statistics"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Calculate statistics
    total_observations = len(df_data)
    total_batches = df_data['batch_id'].nunique()
    
    # Calculate risk distribution using simple rules (same as batches endpoint)
    df_latest = df_data.sort_values('date').groupby('batch_id').last().reset_index()
    
    # Simple risk calculation
    def simple_risk_score(row):
        risk = 0.0
        if row['thermal_shipper_temp_reading'] < 2 or row['thermal_shipper_temp_reading'] > 8:
            risk += 0.4
        if row['item_expiry_hours'] < 48:
            risk += 0.3
        if row['out_of_bound_temperature_hours'] > 5:
            risk += 0.3
        return min(risk, 1.0)
    
    df_latest['risk_score'] = df_latest.apply(simple_risk_score, axis=1)
    
    high_risk = (df_latest['risk_score'] >= 0.6).sum()
    medium_risk = ((df_latest['risk_score'] >= 0.3) & (df_latest['risk_score'] < 0.6)).sum()
    low_risk = (df_latest['risk_score'] < 0.3).sum()
    
    return {
        "total_observations": int(total_observations),
        "total_batches": int(total_batches),
        "high_risk_count": int(high_risk),
        "medium_risk_count": int(medium_risk),
        "low_risk_count": int(low_risk),
        "avg_temperature": float(df_data['thermal_shipper_temp_reading'].mean()),
        "avg_humidity": float(df_data['room_humidity_reading'].mean()),
        "date_range": {
            "start": df_data['date'].min().isoformat(),
            "end": df_data['date'].max().isoformat()
        }
    }


# ============================================================================
# BATCH ENDPOINTS
# ============================================================================

@app.get("/api/batches")
async def get_all_batches(
    limit: int = 100,
    offset: int = 0,
    risk_level: Optional[str] = None,
    location: Optional[str] = None
):
    """Get all batches with basic information (simplified version)"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Get latest observation for each batch
    df_latest = df_data.sort_values('date').groupby('batch_id').last().reset_index()
    
    # Simple risk calculation based on temperature and expiry
    def simple_risk_score(row):
        risk = 0.0
        # Temperature risk
        if row['thermal_shipper_temp_reading'] < 2 or row['thermal_shipper_temp_reading'] > 8:
            risk += 0.4
        # Expiry risk
        if row['item_expiry_hours'] < 48:
            risk += 0.3
        # Out of bound exposure
        if row['out_of_bound_temperature_hours'] > 5:
            risk += 0.3
        return min(risk, 1.0)
    
    df_latest['risk_score'] = df_latest.apply(simple_risk_score, axis=1)
    df_latest['risk_level'] = df_latest['risk_score'].apply(lambda x: 'HIGH' if x >= 0.6 else ('MEDIUM' if x >= 0.3 else 'LOW'))
    
    # Apply filters
    if risk_level:
        df_latest = df_latest[df_latest['risk_level'] == risk_level]
    
    if location:
        df_latest = df_latest[df_latest['location'] == location]
    
    # Sort by risk (highest first)
    df_latest = df_latest.sort_values('risk_score', ascending=False)
    
    # Pagination
    total = len(df_latest)
    df_page = df_latest.iloc[offset:offset+limit]
    
    # Format response
    batches = []
    for _, row in df_page.iterrows():
        # Check if batch is expired or discarded
        is_expired = row['item_expiry_hours'] <= 0
        is_discarded = row['out_of_bound_temperature_hours'] > 24
        
        batches.append({
            "batch_id": row['batch_id'],
            "timestamp": row['date'].isoformat() if hasattr(row['date'], 'isoformat') else str(row['date']),
            "location": row['location'],
            "current_hop": row['current_hop'],
            "external_storage": row['external_storage'],
            "temperature": float(row['thermal_shipper_temp_reading']),
            "humidity": float(row['room_humidity_reading']),
            "external_temperature": float(row['room_temp_reading']),
            "hours_in_transit": float(row['refrigeration_temperature_hours']),
            "expiry_hours": float(row['item_expiry_hours']),
            "oob_hours": float(row['out_of_bound_temperature_hours']),
            "risk_score": float(row['risk_score']),
            "risk_level": row['risk_level'],
            "is_expired": bool(is_expired),
            "is_discarded": bool(is_discarded),
            "vaccine_type": "Type A",  # Default since not in data
            "quantity": 1000,  # Default since not in data
            "transport_mode": "Air"  # Default since not in data
        })
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "batches": batches
    }


@app.get("/api/batches/{batch_id}")
async def get_batch_details(batch_id: str):
    """Get detailed information for a specific batch"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    batch_data = df_data[df_data['batch_id'] == batch_id].copy()
    
    if batch_data.empty:
        raise HTTPException(status_code=404, detail=f"Batch {batch_id} not found")
    
    batch_data = batch_data.sort_values('date')
    
    # Get predictions for all observations
    X_batch = prepare_features_for_prediction(batch_data)
    risk_probs = models['best'].predict_proba(X_batch)[:, 1]
    batch_data['risk_probability'] = risk_probs
    
    # Get SHAP explanation for latest observation
    latest_obs = batch_data.iloc[[-1]]
    X_latest = prepare_features_for_prediction(latest_obs)
    
    # Calculate SHAP values
    shap_values = calculate_shap_for_instance(X_latest)
    
    # Timeline data
    timeline = []
    for _, row in batch_data.iterrows():
        timeline.append({
            "timestamp": row['date'].isoformat(),
            "temperature": float(row['thermal_shipper_temp_reading']),
            "humidity": float(row['room_humidity_reading']),
            "risk_probability": float(row['risk_probability']),
            "location": row['location'],
            "hop": row['current_hop']
        })
    
    # Latest observation
    latest = batch_data.iloc[-1]
    
    return {
        "batch_id": batch_id,
        "summary": {
            "current_location": latest['location'],
            "current_hop": latest['current_hop'],
            "storage_type": latest['external_storage'],
            "current_temperature": float(latest['thermal_shipper_temp_reading']),
            "current_humidity": float(latest['room_humidity_reading']),
            "expiry_hours": float(latest['item_expiry_hours']),
            "risk_probability": float(latest['risk_probability']),
            "risk_level": get_risk_level(latest['risk_probability'])
        },
        "timeline": timeline,
        "shap_explanation": shap_values,
        "recommendation": generate_detailed_recommendation(latest, shap_values)
    }


# ============================================================================
# RISK ANALYTICS ENDPOINTS
# ============================================================================

@app.get("/api/risk-summary")
async def get_risk_summary():
    """Get risk distribution summary"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    df_latest = df_data.sort_values('date').groupby('batch_id').last().reset_index()
    X_latest = prepare_features_for_prediction(df_latest)
    risk_probs = models['best'].predict_proba(X_latest)[:, 1]
    
    df_latest['risk_probability'] = risk_probs
    df_latest['risk_level'] = df_latest['risk_probability'].apply(get_risk_level)
    
    # Risk distribution
    risk_dist = df_latest['risk_level'].value_counts().to_dict()
    
    # Risk by location
    risk_by_location = df_latest.groupby('location')['risk_probability'].agg(['mean', 'count']).to_dict('index')
    
    # Risk by storage type
    risk_by_storage = df_latest.groupby('external_storage')['risk_probability'].agg(['mean', 'count']).to_dict('index')
    
    return {
        "risk_distribution": risk_dist,
        "risk_by_location": risk_by_location,
        "risk_by_storage": risk_by_storage,
        "average_risk": float(risk_probs.mean()),
        "high_risk_percentage": float((risk_probs >= RISK_THRESHOLDS['high']).mean() * 100)
    }


@app.get("/api/risk-trend")
async def get_risk_trend():
    """Get risk trend over time"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Sample data points for trend (daily averages)
    df_trend = df_data.copy()
    df_trend['date_only'] = df_trend['date'].dt.date
    
    trend_data = []
    for date in sorted(df_trend['date_only'].unique()):
        day_data = df_trend[df_trend['date_only'] == date]
        X_day = prepare_features_for_prediction(day_data)
        risk_probs = models['best'].predict_proba(X_day)[:, 1]
        
        trend_data.append({
            "date": str(date),
            "avg_risk": float(risk_probs.mean()),
            "max_risk": float(risk_probs.max()),
            "num_observations": int(len(day_data))
        })
    
    return {"trend": trend_data}


# ============================================================================
# MODEL PERFORMANCE ENDPOINTS
# ============================================================================

@app.get("/api/model-metrics")
async def get_model_metrics():
    """Get model performance metrics"""
    if not metadata:
        raise HTTPException(status_code=500, detail="Metadata not loaded")
    
    return {
        "best_model": metadata.get('best_model'),
        "metrics": metadata.get('best_model_metrics'),
        "all_models": metadata.get('all_models_comparison'),
        "training_info": {
            "training_date": metadata.get('training_date'),
            "train_size": metadata.get('train_size'),
            "val_size": metadata.get('val_size'),
            "test_size": metadata.get('test_size'),
            "num_features": metadata.get('num_features')
        }
    }


@app.get("/api/feature-importance")
async def get_feature_importance(top_n: int = 20):
    """Get top N most important features"""
    if 'feature_importance' not in shap_data:
        raise HTTPException(status_code=500, detail="SHAP data not loaded")
    
    importance_df = shap_data['feature_importance'].head(top_n)
    
    return {
        "features": importance_df.to_dict('records')
    }


@app.get("/api/shap-summary")
async def get_shap_summary():
    """Get SHAP summary statistics"""
    if 'feature_importance' not in shap_data:
        raise HTTPException(status_code=500, detail="SHAP data not loaded")
    
    importance_df = shap_data['feature_importance']
    
    return {
        "top_features": importance_df.head(10).to_dict('records'),
        "total_features": len(importance_df),
        "top_categories": {
            "temperature_features": int(importance_df[importance_df['feature'].str.contains('temp', case=False)].shape[0]),
            "expiry_features": int(importance_df[importance_df['feature'].str.contains('expiry', case=False)].shape[0]),
            "humidity_features": int(importance_df[importance_df['feature'].str.contains('humidity', case=False)].shape[0])
        }
    }


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_risk(request: PredictionRequest):
    """Predict cold chain failure risk for new data"""
    try:
        # Convert request to dataframe
        input_data = pd.DataFrame([request.dict()])
        
        # Add derived features
        input_data = add_basic_features(input_data)
        
        # Prepare features
        X_input = prepare_features_for_prediction(input_data)
        
        # Make prediction
        risk_prob = float(models['best'].predict_proba(X_input)[0, 1])
        risk_level = get_risk_level(risk_prob)
        risk_category = get_risk_category(risk_prob)
        
        # Calculate SHAP explanation
        shap_values = calculate_shap_for_instance(X_input)
        
        # Generate recommendation
        recommendation = generate_detailed_recommendation(input_data.iloc[0], shap_values)
        
        return PredictionResponse(
            risk_probability=risk_prob,
            risk_level=risk_level,
            risk_category=risk_category,
            confidence=float(max(risk_prob, 1 - risk_prob)),
            top_risk_factors=shap_values['top_factors'][:5],
            recommendation=recommendation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/api/explain")
async def explain_prediction(request: PredictionRequest):
    """Get detailed SHAP explanation for a prediction"""
    try:
        # Convert request to dataframe
        input_data = pd.DataFrame([request.dict()])
        input_data = add_basic_features(input_data)
        
        # Prepare features
        X_input = prepare_features_for_prediction(input_data)
        
        # Get prediction
        risk_prob = float(models['best'].predict_proba(X_input)[0, 1])
        
        # Calculate SHAP values
        shap_explanation = calculate_shap_for_instance(X_input)
        
        return {
            "risk_probability": risk_prob,
            "risk_level": get_risk_level(risk_prob),
            "shap_explanation": shap_explanation,
            "feature_contributions": shap_explanation['top_factors']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")


@app.get("/api/recommendation/{batch_id}")
async def get_recommendation(batch_id: str):
    """Get recommendation for a specific batch"""
    if df_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    batch_data = df_data[df_data['batch_id'] == batch_id]
    
    if batch_data.empty:
        raise HTTPException(status_code=404, detail=f"Batch {batch_id} not found")
    
    # Get latest observation
    latest = batch_data.sort_values('date').iloc[-1]
    
    # Get prediction
    X_latest = prepare_features_for_prediction(pd.DataFrame([latest]))
    risk_prob = float(models['best'].predict_proba(X_latest)[0, 1])
    
    # Get SHAP explanation
    shap_values = calculate_shap_for_instance(X_latest)
    
    # Generate recommendation
    recommendation = generate_detailed_recommendation(latest, shap_values)
    
    return {
        "batch_id": batch_id,
        "risk_probability": risk_prob,
        "risk_level": get_risk_level(risk_prob),
        "recommendation": recommendation,
        "key_risk_factors": shap_values['top_factors'][:5]
    }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def prepare_features_for_prediction(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare features for model prediction"""
    df_prep = df.copy()
    
    # Encode categorical features
    for col in feature_names['categorical_features']:
        if col in df_prep.columns:
            encoded_col = col + '_encoded'
            if col in label_encoders:
                # Handle unseen categories
                le = label_encoders[col]
                df_prep[encoded_col] = df_prep[col].apply(
                    lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else -1
                )
    
    # Select features in correct order
    X = df_prep[feature_names['all_features']]
    
    # Handle any remaining missing values
    X = X.fillna(0)
    
    return X


def add_basic_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add basic derived features needed for prediction"""
    df = df.copy()
    
    # Time-based features (use provided values or defaults)
    if 'hour' not in df.columns:
        df['hour'] = 12  # Default to noon
    if 'day_of_week' not in df.columns:
        df['day_of_week'] = 0  # Default to Monday
    
    # Derived time features
    if 'is_weekend' not in df.columns:
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    
    # Temperature features
    if 'temp_diff' not in df.columns:
        df['temp_diff'] = df['room_temp_reading'] - df['thermal_shipper_temp_reading']
    
    if 'temp_ratio' not in df.columns:
        df['temp_ratio'] = df['room_temp_reading'] / (df['thermal_shipper_temp_reading'] + 1)
    
    # Temperature indicators
    if 'shipper_temp_too_low' not in df.columns:
        df['shipper_temp_too_low'] = (df['thermal_shipper_temp_reading'] < 2).astype(int)
    if 'shipper_temp_too_high' not in df.columns:
        df['shipper_temp_too_high'] = (df['thermal_shipper_temp_reading'] > 8).astype(int)
    if 'shipper_temp_in_range' not in df.columns:
        df['shipper_temp_in_range'] = ((df['thermal_shipper_temp_reading'] >= 2) & 
                                        (df['thermal_shipper_temp_reading'] <= 8)).astype(int)
    
    # Expiry features
    if 'is_expired' not in df.columns:
        df['is_expired'] = (df['item_expiry_hours'] < 0).astype(int)
    if 'near_expiry' not in df.columns:
        df['near_expiry'] = ((df['item_expiry_hours'] >= 0) & (df['item_expiry_hours'] < 24)).astype(int)
    if 'expiry_critical' not in df.columns:
        df['expiry_critical'] = (df['item_expiry_hours'] < 24).astype(int)
    if 'days_until_expiry' not in df.columns:
        df['days_until_expiry'] = df['item_expiry_hours'] / 24
    if 'weeks_until_expiry' not in df.columns:
        df['weeks_until_expiry'] = df['item_expiry_hours'] / 168
    
    # Exposure features
    if 'has_oob_exposure' not in df.columns:
        df['has_oob_exposure'] = (df['out_of_bound_temperature_hours'] > 0).astype(int)
    if 'oob_exposure_high' not in df.columns:
        df['oob_exposure_high'] = (df['out_of_bound_temperature_hours'] > 24).astype(int)
    
    if 'total_storage_time' not in df.columns:
        df['total_storage_time'] = (df['ultra_low_temperature_freezer_hours'] + 
                                     df['refrigeration_temperature_hours'] + 
                                     df['out_of_bound_temperature_hours'])
    
    if 'oob_exposure_ratio' not in df.columns:
        df['oob_exposure_ratio'] = df['out_of_bound_temperature_hours'] / (df['total_storage_time'] + 1)
    if 'ultra_low_ratio' not in df.columns:
        df['ultra_low_ratio'] = df['ultra_low_temperature_freezer_hours'] / (df['total_storage_time'] + 1)
    if 'refrigeration_ratio' not in df.columns:
        df['refrigeration_ratio'] = df['refrigeration_temperature_hours'] / (df['total_storage_time'] + 1)
    
    # Humidity features
    if 'humidity_too_high' not in df.columns:
        df['humidity_too_high'] = (df['room_humidity_reading'] > 60).astype(int)
    if 'humidity_too_low' not in df.columns:
        df['humidity_too_low'] = (df['room_humidity_reading'] < 30).astype(int)
    
    # Room temperature indicators
    if 'room_temp_too_high' not in df.columns:
        df['room_temp_too_high'] = (df['room_temp_reading'] > 25).astype(int)
    if 'room_temp_too_low' not in df.columns:
        df['room_temp_too_low'] = (df['room_temp_reading'] < 15).astype(int)
    
    # Fill any other missing lag/rolling features with 0
    for col in feature_names['all_features']:
        if col not in df.columns:
            df[col] = 0
    
    return df


def calculate_shap_for_instance(X: pd.DataFrame) -> Dict[str, Any]:
    """Calculate SHAP values for a single instance"""
    try:
        # Use TreeExplainer for tree-based models
        explainer = shap_data.get('explainer')
        if explainer is None:
            # Create new explainer
            explainer = shap.TreeExplainer(models['best'])
        
        shap_vals = explainer.shap_values(X)
        
        # Handle different SHAP value formats
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[1]  # Positive class
        
        if len(shap_vals.shape) > 1:
            shap_vals = shap_vals[0]
        
        # Get feature contributions
        feature_contributions = []
        for i, (feat, shap_val) in enumerate(zip(feature_names['all_features'], shap_vals)):
            feature_contributions.append({
                'feature': feat,
                'value': float(X.iloc[0, i]),
                'contribution': float(shap_val),
                'abs_contribution': float(abs(shap_val))
            })
        
        # Sort by absolute contribution
        feature_contributions.sort(key=lambda x: x['abs_contribution'], reverse=True)
        
        return {
            'top_factors': feature_contributions,
            'base_value': float(explainer.expected_value) if hasattr(explainer, 'expected_value') else 0.5
        }
        
    except Exception as e:
        print(f"SHAP calculation error: {str(e)}")
        # Return empty if SHAP fails
        return {
            'top_factors': [],
            'base_value': 0.5
        }


def get_risk_level(probability: float) -> str:
    """Convert probability to risk level"""
    if probability >= RISK_THRESHOLDS['high']:
        return "CRITICAL"
    elif probability >= RISK_THRESHOLDS['medium']:
        return "HIGH"
    elif probability >= RISK_THRESHOLDS['low']:
        return "MEDIUM"
    else:
        return "LOW"


def get_risk_category(probability: float) -> str:
    """Get risk category for display"""
    level = get_risk_level(probability)
    return level


def get_recommendation_for_risk(risk_level: str, expiry_hours: float) -> str:
    """Generate basic recommendation based on risk level"""
    if risk_level == "CRITICAL":
        return "URGENT: Immediate action required. Consider discarding batch."
    elif risk_level == "HIGH":
        return "High priority: Expedite delivery and closely monitor conditions."
    elif risk_level == "MEDIUM":
        if expiry_hours < 24:
            return "Monitor closely: Approaching expiry. Prioritize distribution."
        return "Caution: Monitor temperature and humidity conditions."
    else:
        return "Normal: Continue standard monitoring procedures."


def generate_detailed_recommendation(row: pd.Series, shap_values: Dict[str, Any]) -> str:
    """Generate detailed recommendation based on multiple factors"""
    recommendations = []
    
    # Check expiry
    expiry_hours = row.get('item_expiry_hours', 0)
    if expiry_hours < 0:
        recommendations.append("⚠️ CRITICAL: Batch has EXPIRED. Immediate discard required.")
    elif expiry_hours < 24:
        recommendations.append(f"⚠️ URGENT: Only {expiry_hours:.1f} hours until expiry. Expedite delivery immediately.")
    elif expiry_hours < 72:
        recommendations.append(f"⚡ Priority distribution needed: {expiry_hours:.1f} hours remaining.")
    
    # Check temperature
    temp = row.get('thermal_shipper_temp_reading', 5)
    if temp < 2:
        recommendations.append(f"❄️ Temperature too LOW ({temp:.1f}°C). Risk of freezing damage. Adjust immediately.")
    elif temp > 8:
        recommendations.append(f"🌡️ Temperature too HIGH ({temp:.1f}°C). Move to cooler storage immediately.")
    elif 2 <= temp <= 8:
        recommendations.append(f"✅ Temperature in safe range ({temp:.1f}°C).")
    
    # Check out-of-bound exposure
    oob_hours = row.get('out_of_bound_temperature_hours', 0)
    if oob_hours > 24:
        recommendations.append(f"⚠️ Extended temperature excursion detected ({oob_hours:.1f}h). Quality assessment required.")
    elif oob_hours > 0:
        recommendations.append(f"⚠️ Temperature excursion: {oob_hours:.1f}h out of bounds. Monitor closely.")
    
    # Check humidity
    humidity = row.get('room_humidity_reading', 50)
    if humidity > 60:
        recommendations.append(f"💧 Humidity HIGH ({humidity:.0f}%). Check for condensation risk.")
    elif humidity < 30:
        recommendations.append(f"🏜️ Humidity LOW ({humidity:.0f}%). Monitor for desiccation.")
    
    # Top risk factors from SHAP
    if shap_values and 'top_factors' in shap_values:
        top_factors = shap_values['top_factors'][:3]
        if top_factors:
            factor_names = [f['feature'] for f in top_factors if f['abs_contribution'] > 0.01]
            if factor_names:
                recommendations.append(f"📊 Key risk factors: {', '.join(factor_names[:3])}")
    
    # General recommendation
    if not recommendations:
        recommendations.append("✅ No immediate concerns. Continue standard monitoring.")
    
    return " | ".join(recommendations)


# ============================================================================
# ROOT ENDPOINT
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ColdLink AI - Cold Chain Failure Prediction API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/api/health",
            "statistics": "/api/statistics",
            "batches": "/api/batches",
            "batch_details": "/api/batches/{batch_id}",
            "risk_summary": "/api/risk-summary",
            "risk_trend": "/api/risk-trend",
            "model_metrics": "/api/model-metrics",
            "feature_importance": "/api/feature-importance",
            "shap_summary": "/api/shap-summary",
            "predict": "/api/predict (POST)",
            "explain": "/api/explain (POST)",
            "recommendation": "/api/recommendation/{batch_id}"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
