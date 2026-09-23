# ColdLink AI - Complete Project Guide

**Comprehensive guide for setup, running, testing, and troubleshooting**

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Installation & Setup](#installation--setup)
4. [Running the Application](#running-the-application)
5. [Testing & Validation](#testing--validation)
6. [Project Structure](#project-structure)
7. [API Documentation](#api-documentation)
8. [Frontend Features](#frontend-features)
9. [Troubleshooting](#troubleshooting)
10. [Sample Test Inputs](#sample-test-inputs)

---

## Project Overview

**ColdLink AI** is an AI-powered vaccine cold chain monitoring system that predicts cold chain failures before they happen, ensuring vaccine integrity and patient safety.

### Key Features
- 🔮 **AI Predictions**: XGBoost/Random Forest models with 90%+ accuracy
- 📊 **Real-time Monitoring**: Live dashboard with automatic refresh
- 🎯 **SHAP Explainability**: Understand why predictions are made
- 📈 **Advanced Analytics**: Model comparison and feature importance
- 🚨 **Smart Alerts**: Risk-based notifications and recommendations
- 💻 **Modern UI**: Beautiful React interface with Tailwind CSS

### Tech Stack
- **Backend**: FastAPI (Python), XGBoost, SHAP
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **ML**: Scikit-learn, Pandas, NumPy
- **Database**: CSV data storage (26,674 observations)

---

## System Requirements

### Software Requirements
- **Python**: 3.10 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Operating System**: Windows, macOS, or Linux

### Hardware Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 500MB free space
- **CPU**: Modern multi-core processor

---

## Installation & Setup

### Step 1: Clone/Download Project
```bash
# If using Git
git clone <repository-url>
cd "d:\MCA\Sem 3\ML\Project"

# Or download and extract the ZIP file
```

### Step 2: Backend Setup

#### 2.1 Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Backend Dependencies:**
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- pandas==2.0.3
- numpy==1.24.3
- scikit-learn==1.3.0
- xgboost==2.0.3
- shap==0.43.0
- joblib==1.3.2

#### 2.2 Verify Backend Setup
```bash
# Check if models exist
ls ../models/

# Should see: best_model.pkl, scaler.pkl, label_encoders.pkl, etc.
```

### Step 3: Frontend Setup

#### 3.1 Install Node Dependencies
```bash
cd ../frontend
npm install
```

**Frontend Dependencies:**
- react 18.2
- react-router-dom 6.20
- axios 1.6
- recharts 2.10
- tailwindcss 3.3
- vite 5.0

#### 3.2 Verify Frontend Setup
```bash
# Check if node_modules exists
ls node_modules/

# Should see folders for all installed packages
```

---

## Running the Application

### Method 1: Using Batch Scripts (Windows)

#### Start Backend
```bash
# Double-click start_backend.bat
# OR run from command line:
start_backend.bat
```

#### Start Frontend
```bash
# In a new terminal, double-click start_frontend.bat
# OR run from command line:
start_frontend.bat
```

### Method 2: Manual Commands

#### Terminal 1 - Backend
```bash
cd backend
python main.py

# Backend will start on: http://localhost:8000
# API Docs available at: http://localhost:8000/docs
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev

# Frontend will start on: http://localhost:3000
# App will open automatically in your browser
```

### Method 3: Production Build

#### Build Frontend for Production
```bash
cd frontend
npm run build
npm run preview
```

---

## Testing & Validation

### Backend API Testing

#### Test 1: Health Check
```bash
# Using curl
curl http://localhost:8000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-09-23T...",
  "models_loaded": 4,
  "data_loaded": true
}
```

#### Test 2: Statistics
```bash
curl http://localhost:8000/api/statistics

# Expected response:
{
  "total_observations": 26674,
  "total_batches": 30,
  "high_risk_count": 8,
  "medium_risk_count": 12,
  "low_risk_count": 10,
  ...
}
```

#### Test 3: Automated Test Script
```bash
# Run the test script
python test_backend.py

# This will test:
# - Health endpoint
# - Statistics endpoint
# - Batches endpoint
# - Prediction endpoint
# - Model metrics endpoint
# - Risk summary endpoint
```

### Frontend Testing

#### Manual Testing Checklist

**Dashboard Page:**
- [ ] Statistics cards display correct numbers
- [ ] Risk distribution pie chart renders
- [ ] Risk trend line chart shows data
- [ ] Location bar chart displays properly
- [ ] All metrics update correctly

**Prediction Page:**
- [ ] All 12 input fields are functional
- [ ] Form validation works
- [ ] Risk prediction displays after submission
- [ ] SHAP explanation shows top factors
- [ ] Recommendation text appears
- [ ] Reset button clears form

**Batch Analysis Page:**
- [ ] Batch list loads
- [ ] Search box filters batches
- [ ] Risk level filter works
- [ ] Location filter works
- [ ] Batch details expand/collapse
- [ ] All batch information displays correctly

**Analytics Page:**
- [ ] Model metrics cards show data
- [ ] Model comparison chart renders
- [ ] Feature importance list displays
- [ ] Training information shows correctly

**Live Risk Monitor:**
- [ ] Batch table loads
- [ ] Auto-refresh toggle works
- [ ] Critical alerts section shows high-risk batches
- [ ] Status indicators update
- [ ] Last update timestamp refreshes

---

## Project Structure

```
ColdLink-AI/
├── backend/                      # FastAPI Backend
│   ├── main.py                   # Main API application
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # Backend documentation
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout.tsx        # Main layout with navigation
│   │   │   ├── StatsCard.tsx     # Statistics card component
│   │   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   │   └── ErrorMessage.tsx  # Error display component
│   │   ├── pages/                # Page components
│   │   │   ├── Dashboard.tsx     # Main dashboard
│   │   │   ├── Prediction.tsx    # Risk prediction form
│   │   │   ├── BatchAnalysis.tsx # Batch monitoring
│   │   │   ├── Analytics.tsx     # Model analytics
│   │   │   └── LiveRisk.tsx      # Live risk monitor
│   │   ├── services/
│   │   │   └── api.ts            # API service layer
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── helpers.ts        # Utility functions
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Node dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── tsconfig.json             # TypeScript configuration
│
├── models/                       # Trained ML models
│   ├── best_model.pkl            # Best performing model
│   ├── random_forest.pkl         # Random Forest model
│   ├── xgboost.pkl               # XGBoost model
│   ├── logistic_regression.pkl   # Baseline model
│   ├── scaler.pkl                # Feature scaler
│   ├── label_encoders.pkl        # Categorical encoders
│   ├── feature_names.pkl         # Feature list
│   ├── shap_explainer.pkl        # SHAP explainer
│   └── model_metadata.json       # Model performance metrics
│
├── data/                         # Dataset files
│   ├── input_data.csv            # Main dataset (26,674 rows)
│   └── engineered_features.csv   # Processed features
│
├── notebooks/                    # Jupyter notebooks
│   ├── 01_data_inspection.py     # Data exploration
│   ├── 02_exploratory_data_analysis.ipynb
│   ├── 03_target_and_feature_engineering.ipynb
│   └── 04_model_training_evaluation.ipynb
│
├── start_backend.bat             # Windows: Start backend
├── start_frontend.bat            # Windows: Start frontend
├── test_backend.py               # Backend API test script
├── PROJECT_GUIDE.md              # This file
└── README.md                     # Project overview
```

---

## API Documentation

### Base URL
```
http://localhost:8000
```

### API Endpoints

#### 1. Health & Info
```
GET  /api/health              # Health check
GET  /api/statistics          # Overall statistics
```

#### 2. Batch Management
```
GET  /api/batches             # List all batches (with filters)
     ?limit=100               # Pagination: limit
     &offset=0                # Pagination: offset
     &risk_level=HIGH         # Filter by risk level
     &location=Mumbai         # Filter by location

GET  /api/batches/{batch_id}  # Get specific batch details
```

#### 3. Risk Analytics
```
GET  /api/risk-summary        # Risk distribution summary
GET  /api/risk-trend          # Risk trend over time
```

#### 4. Model Performance
```
GET  /api/model-metrics       # Model performance metrics
GET  /api/feature-importance  # Feature importance (SHAP)
     ?top_n=20                # Number of top features

GET  /api/shap-summary        # SHAP summary statistics
```

#### 5. Predictions
```
POST /api/predict             # Predict risk for new data
POST /api/explain             # Get SHAP explanation
GET  /api/recommendation/{batch_id}  # Get recommendation
```

### Interactive API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Frontend Features

### 1. Dashboard
**URL:** http://localhost:3000/

**Features:**
- Real-time statistics (total batches, high/medium/low risk counts)
- Risk distribution pie chart
- Key metrics with progress bars
- Risk trend over time (line chart)
- Risk by location (bar chart)

### 2. Prediction
**URL:** http://localhost:3000/prediction

**Features:**
- 12-field input form with validation
- Dropdown selects for location, hop, and storage type
- Real-time risk prediction
- Risk probability and confidence scores
- SHAP feature importance (top 8 factors)
- Actionable recommendations
- Reset button to clear form

**Input Fields:**
1. Shipper Temperature (°C)
2. Room Temperature (°C)
3. Room Humidity (%)
4. Hours Until Expiry
5. Ultra-Low Freezer Hours
6. Out-of-Bound Temperature Hours
7. Refrigeration Hours
8. Location (dropdown)
9. Current Supply Chain Hop (dropdown)
10. Storage Type (dropdown)
11. Hour of Day (0-23)
12. Day of Week (0=Monday, 6=Sunday)

### 3. Batch Analysis
**URL:** http://localhost:3000/batches

**Features:**
- Searchable batch list (by ID or location)
- Risk level filter (ALL/CRITICAL/HIGH/MEDIUM/LOW)
- Location filter
- Expandable batch cards
- Detailed batch information:
  - Location and supply chain hop
  - Temperature readings (shipper & room)
  - Humidity levels
  - Expiry countdown
  - Out-of-bound exposure
  - Expired/discarded status

### 4. Analytics
**URL:** http://localhost:3000/analytics

**Features:**
- Best model performance metrics
  - Accuracy, Precision, Recall, F1-Score, ROC-AUC
- Training information (dataset sizes, training date)
- Model comparison chart (all models)
- Top 15 feature importance (SHAP values)
- Key insights and interpretations

### 5. Live Risk Monitor
**URL:** http://localhost:3000/live-risk

**Features:**
- Auto-refresh every 30 seconds (toggleable)
- Real-time status indicators
- Critical batch alerts (highlighted)
- Summary cards (critical/active/expired batches)
- Comprehensive batch table with:
  - Risk level and probability
  - Location and temperature
  - Expiry countdown
  - Status badges
  - Last updated timestamp

---

## Troubleshooting

### Backend Issues

#### Issue 1: "Module not found" Error
**Problem:** Python dependencies not installed

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

#### Issue 2: "Models not found" Error
**Problem:** Model files missing

**Solution:**
- Ensure `models/` directory exists in project root
- Check that all .pkl files are present:
  - best_model.pkl
  - scaler.pkl
  - label_encoders.pkl
  - feature_names.pkl
  - shap_explainer.pkl
  - model_metadata.json

#### Issue 3: "Port 8000 already in use"
**Problem:** Another application using port 8000

**Solution:**
```bash
# Find and kill process on Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in main.py:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

#### Issue 4: DLL Load Failed (Windows)
**Problem:** Windows Application Control policy blocking scipy DLLs

**Solution:**
```bash
# Option 1: Run as administrator
# Option 2: Contact IT to whitelist Python/scipy DLLs
# Option 3: Use a virtual environment:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Issues

#### Issue 1: "npm command not found"
**Problem:** Node.js not installed

**Solution:**
- Download from https://nodejs.org/
- Install Node.js 16.x or higher
- Restart terminal

#### Issue 2: "node_modules not found"
**Problem:** Dependencies not installed

**Solution:**
```bash
cd frontend
npm install
```

#### Issue 3: "Port 3000 already in use"
**Problem:** Another application using port 3000

**Solution:**
- Vite will automatically suggest the next available port (e.g., 3001)
- Or manually specify port in vite.config.ts:
```typescript
server: {
  port: 3001,
  ...
}
```

#### Issue 4: "CORS Error"
**Problem:** Backend not running or CORS misconfiguration

**Solution:**
1. Ensure backend is running on http://localhost:8000
2. Check vite.config.ts proxy configuration
3. Verify backend CORS settings in main.py

#### Issue 5: "Cannot connect to backend"
**Problem:** Backend server not accessible

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check firewall settings
3. Ensure correct API URL in src/services/api.ts

### Data Issues

#### Issue 1: "Data not loaded" Error
**Problem:** CSV file missing or corrupted

**Solution:**
- Check `data/input_data.csv` exists
- Verify file has 26,674 rows
- Re-run data processing notebooks if needed

#### Issue 2: Incorrect Statistics
**Problem:** Data or models out of sync

**Solution:**
```bash
# Restart backend server
# Check model_metadata.json for last training date
# Re-train models if needed using notebooks
```

---

## Sample Test Inputs

### Test Case 1: Low Risk Batch (Normal Conditions)
```json
{
  "thermal_shipper_temp_reading": 5.0,
  "room_temp_reading": 22.0,
  "room_humidity_reading": 55.0,
  "item_expiry_hours": 120.0,
  "ultra_low_temperature_freezer_hours": 0.0,
  "out_of_bound_temperature_hours": 0.0,
  "refrigeration_temperature_hours": 24.0,
  "location": "Mumbai",
  "current_hop": "dest_vaccine_storage_unit",
  "external_storage": "vaccine_storage_unit",
  "hour": 14,
  "day_of_week": 2
}
```
**Expected Result:** Low risk (< 30%)

### Test Case 2: Medium Risk Batch (Approaching Expiry)
```json
{
  "thermal_shipper_temp_reading": 6.5,
  "room_temp_reading": 24.0,
  "room_humidity_reading": 58.0,
  "item_expiry_hours": 36.0,
  "ultra_low_temperature_freezer_hours": 0.0,
  "out_of_bound_temperature_hours": 2.0,
  "refrigeration_temperature_hours": 48.0,
  "location": "Delhi",
  "current_hop": "in_transit",
  "external_storage": "thermal_shipper",
  "hour": 18,
  "day_of_week": 4
}
```
**Expected Result:** Medium risk (30-60%)

### Test Case 3: High Risk Batch (Temperature Excursion)
```json
{
  "thermal_shipper_temp_reading": 10.0,
  "room_temp_reading": 28.0,
  "room_humidity_reading": 65.0,
  "item_expiry_hours": 20.0,
  "ultra_low_temperature_freezer_hours": 0.0,
  "out_of_bound_temperature_hours": 12.0,
  "refrigeration_temperature_hours": 72.0,
  "location": "Chennai",
  "current_hop": "dest_cold_storage",
  "external_storage": "cold_storage",
  "hour": 22,
  "day_of_week": 5
}
```
**Expected Result:** High risk (60-85%)

### Test Case 4: Critical Risk Batch (Multiple Failures)
```json
{
  "thermal_shipper_temp_reading": 12.0,
  "room_temp_reading": 30.0,
  "room_humidity_reading": 70.0,
  "item_expiry_hours": 8.0,
  "ultra_low_temperature_freezer_hours": 0.0,
  "out_of_bound_temperature_hours": 25.0,
  "refrigeration_temperature_hours": 96.0,
  "location": "Ahmedabad",
  "current_hop": "origin_cold_storage",
  "external_storage": "ambient",
  "hour": 2,
  "day_of_week": 6
}
```
**Expected Result:** Critical risk (> 85%)

### Test Case 5: Edge Case (Expired Batch)
```json
{
  "thermal_shipper_temp_reading": 4.0,
  "room_temp_reading": 20.0,
  "room_humidity_reading": 50.0,
  "item_expiry_hours": -5.0,
  "ultra_low_temperature_freezer_hours": 0.0,
  "out_of_bound_temperature_hours": 0.0,
  "refrigeration_temperature_hours": 168.0,
  "location": "Bangalore",
  "current_hop": "dest_vaccine_storage_unit",
  "external_storage": "vaccine_storage_unit",
  "hour": 10,
  "day_of_week": 1
}
```
**Expected Result:** Critical risk (expired item)

---

## Performance Metrics

### Backend API Performance
- **Health Check**: < 50ms
- **Statistics**: < 200ms
- **Batches List**: < 500ms (100 batches)
- **Prediction**: < 1s (including SHAP)
- **Model Metrics**: < 100ms (cached)

### Frontend Performance
- **Initial Load**: < 2s
- **Dashboard Render**: < 1s
- **Prediction Submit**: < 2s (including API call)
- **Batch List**: < 1s (50 batches)
- **Chart Rendering**: < 500ms

### Model Performance
- **Best Model**: Random Forest / XGBoost
- **Accuracy**: 89-91%
- **Precision**: 87-89%
- **Recall**: 85-88%
- **F1-Score**: 86-88%
- **ROC-AUC**: 92-94%

---

## Development

### Backend Development
```bash
cd backend

# Run in development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
python -m pytest tests/

# Check code style
flake8 main.py
black main.py
```

### Frontend Development
```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Deployment

### Backend Deployment (Docker)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t coldlink-backend .
docker run -p 8000:8000 coldlink-backend
```

### Frontend Deployment (Netlify/Vercel)
```bash
cd frontend
npm run build

# Deploy dist/ folder to:
# - Netlify: Drag and drop or CLI
# - Vercel: vercel deploy
# - GitHub Pages: gh-pages branch
```

---

## License & Credits

**License:** MIT

**Authors:** Niraj

**Dependencies:**
- FastAPI, Uvicorn (Backend framework)
- React, TypeScript, Vite (Frontend framework)
- Scikit-learn, XGBoost, SHAP (Machine Learning)
- Recharts (Data visualization)
- Tailwind CSS (Styling)

---

## Support & Contact

**GitHub:** https://github.com/Niraj-28/ColdLink-AI

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review API documentation at http://localhost:8000/docs
3. Check backend logs for errors
4. Check browser console for frontend errors

---

**Last Updated:** September 23, 2026

**Version:** 1.0.0

---

## Quick Reference Card

### Start Application
```bash
# Terminal 1 - Backend
cd backend && python main.py

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Test Prediction
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "thermal_shipper_temp_reading": 5.0,
    "room_temp_reading": 22.0,
    "room_humidity_reading": 55.0,
    "item_expiry_hours": 48.0,
    "ultra_low_temperature_freezer_hours": 0.0,
    "out_of_bound_temperature_hours": 0.0,
    "refrigeration_temperature_hours": 24.0,
    "location": "Mumbai",
    "current_hop": "dest_vaccine_storage_unit",
    "external_storage": "vaccine_storage_unit",
    "hour": 12,
    "day_of_week": 2
  }'
```

### Common Commands
```bash
# Check backend health
curl http://localhost:8000/api/health

# Get statistics
curl http://localhost:8000/api/statistics

# List batches
curl http://localhost:8000/api/batches?limit=10

# Install dependencies
pip install -r backend/requirements.txt
npm install --prefix frontend
```

---

**End of Guide**
