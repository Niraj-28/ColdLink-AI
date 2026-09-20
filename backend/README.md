# ColdLink AI - Backend API

FastAPI backend for cold chain failure prediction system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure models are trained and saved in `../models/` directory

3. Run the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health & Info
- `GET /` - Root endpoint with API information
- `GET /api/health` - Health check
- `GET /api/statistics` - Overall dataset statistics

### Batch Management
- `GET /api/batches` - Get all batches (with filtering and pagination)
- `GET /api/batches/{batch_id}` - Get detailed batch information

### Risk Analytics
- `GET /api/risk-summary` - Risk distribution summary
- `GET /api/risk-trend` - Risk trend over time

### Model Performance
- `GET /api/model-metrics` - Model performance metrics
- `GET /api/feature-importance` - Feature importance rankings
- `GET /api/shap-summary` - SHAP summary statistics

### Predictions
- `POST /api/predict` - Predict risk for new data
- `POST /api/explain` - Get SHAP explanation for prediction
- `GET /api/recommendation/{batch_id}` - Get recommendation for batch

## Example Request

```python
import requests

# Predict risk
response = requests.post('http://localhost:8000/api/predict', json={
    "thermal_shipper_temp_reading": 5.0,
    "room_temp_reading": 22.0,
    "room_humidity_reading": 55.0,
    "item_expiry_hours": 48.0,
    "ultra_low_temperature_freezer_hours": 0.0,
    "out_of_bound_temperature_hours": 2.0,
    "refrigeration_temperature_hours": 24.0,
    "location": "Pune",
    "current_hop": "dest_vaccine_storage_unit",
    "external_storage": "vaccine_storage_unit",
    "hour": 14,
    "day_of_week": 2
})

print(response.json())
```

## API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
