# 🚀 How to Run ColdLink AI - Complete Guide

## ✅ System Requirements

### Software Required
- **Python**: 3.8 or higher (Currently using: 3.14.7)
- **Node.js**: 16 or higher (Currently using: 24.19.0)
- **npm**: 8 or higher (Currently using: 11.17.0)
- **Git**: For cloning the repository

### Hardware Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for initial setup only

---

## 📦 Step 1: Initial Setup (First Time Only)

### 1.1 Clone the Repository
```bash
git clone https://github.com/Niraj-28/ColdLink-AI.git
cd ColdLink-AI
```

### 1.2 Install Python Dependencies
```bash
# Make sure you're in the project root directory
pip install -r requirements.txt
```

**Expected packages to install:**
- fastapi==0.115.12
- uvicorn==0.32.1
- scikit-learn==1.6.1
- xgboost==2.1.3
- pandas==2.2.3
- numpy==2.2.2
- shap==0.47.0
- joblib==1.4.2
- python-multipart==0.0.20

### 1.3 Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

**This will install:**
- React 18.3.1
- Vite 5.4.21
- Tailwind CSS 3.4.17
- React Router 7.1.3
- Axios 1.7.9
- And other dependencies

### 1.4 Verify Installation
```bash
# Check Python packages
pip list | findstr "fastapi scikit-learn xgboost shap pandas"

# Check Node modules
dir frontend\node_modules
```

---

## 🏃‍♂️ Step 2: Running the Application

### Option A: Quick Start (Recommended)

#### Terminal 1: Start Backend
```bash
# Navigate to backend directory
cd backend

# Start the FastAPI server
python main.py
```

**Expected Output:**
```
======================================================================
COLDLINK AI - BACKEND STARTUP
======================================================================
✓ Best model loaded
✓ logistic_regression loaded
✓ random_forest loaded
✓ xgboost loaded
✓ histgradientboosting loaded
✓ Scaler loaded
✓ Label encoders loaded
✓ Feature names loaded
✓ Model metadata loaded
✓ SHAP data loaded
✓ Dataset loaded: (26373, 23)

🚀 All models and data loaded successfully!
======================================================================
✓ Server ready to accept requests
======================================================================
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

⏱️ **Startup Time**: 20-30 seconds (loading models)  
🌐 **Backend URL**: http://localhost:8000  
📚 **API Docs**: http://localhost:8000/docs

#### Terminal 2: Start Frontend
```bash
# Navigate to frontend directory
cd frontend

# Start the Vite development server
npm run dev
```

**Expected Output:**
```
> coldlink-ai-frontend@1.0.0 dev
> vite

  VITE v5.4.21  ready in 4483 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

⏱️ **Startup Time**: 5-10 seconds  
🌐 **Frontend URL**: http://localhost:3000

### Option B: Using PowerShell Scripts (Windows)

#### Create `start-backend.ps1`:
```powershell
Write-Host "Starting ColdLink AI Backend..." -ForegroundColor Green
cd backend
python main.py
```

#### Create `start-frontend.ps1`:
```powershell
Write-Host "Starting ColdLink AI Frontend..." -ForegroundColor Green
cd frontend
npm run dev
```

#### Run both scripts:
```powershell
# Terminal 1
.\start-backend.ps1

# Terminal 2
.\start-frontend.ps1
```

---

## 🌐 Step 3: Access the Application

### Open in Browser
1. Wait for both servers to start completely
2. Open your web browser (Chrome, Firefox, Edge recommended)
3. Navigate to: **http://localhost:3000**

### What You Should See
- **Homepage**: ColdLink AI Dashboard with statistics
- **Navigation**: Sidebar with 8 pages
- **Data**: Real-time data from backend API

---

## 📊 Step 4: Using the Application

### 4.1 Overview Dashboard (Home)
**URL**: http://localhost:3000/

**Features:**
- Total observations and batches
- Risk distribution (HIGH/MEDIUM/LOW)
- Recent batches table
- System health status

**Try This:**
1. View the statistics cards at the top
2. Check the risk distribution
3. Scroll through the recent batches table

### 4.2 Live Risk Monitoring
**URL**: http://localhost:3000/live-risk

**Features:**
- Real-time batch monitoring
- Search by batch ID
- Filter by risk level
- Sort by risk score or date
- Auto-refresh every 30 seconds

**Try This:**
1. Search for a specific batch (e.g., "Batch_1")
2. Filter by "High Risk" only
3. Sort by "Risk: High to Low"
4. Click "Refresh" to reload data

### 4.3 Batch Analysis
**URL**: http://localhost:3000/batch-analysis

**Features:**
- Detailed batch information
- Environmental conditions
- Shipment details
- SHAP feature impact visualization

**Try This:**
1. Click on any batch from the list
2. View environmental conditions (temperature, humidity)
3. Check shipment details
4. Analyze SHAP feature impacts (positive/negative)

### 4.4 Risk Prediction
**URL**: http://localhost:3000/prediction

**Features:**
- Interactive prediction form
- Real-time risk calculation
- Actionable recommendations
- Top risk factors

**Try This:**
1. Fill in the form:
   - Storage Temperature: 5.0°C
   - External Temperature: 25.0°C
   - Humidity: 60%
   - Location: Warehouse A
   - Transport Mode: Air
   - Vaccine Type: Type A
   - Quantity: 1000
   - Hours in Transit: 12

2. Click "Predict Risk"
3. View the risk score and level
4. Read the recommendations
5. Check top risk factors

### 4.5 Analytics Dashboard
**URL**: http://localhost:3000/analytics

**Features:**
- Model performance metrics
- Feature importance rankings
- Risk trends over time
- Tabbed interface

**Try This:**
1. **Performance Tab**: View F1 Score (79.7%), ROC-AUC (94.1%)
2. **Features Tab**: See top 15 important features
3. **Trends Tab**: Analyze risk distribution over time

### 4.6 About Page
**URL**: http://localhost:3000/about

**Features:**
- Project overview
- Problem statement
- Key features
- Technology stack

---

## 🧪 Step 5: Testing the API (Optional)

### Using Browser
1. Open http://localhost:8000/docs
2. Try the interactive API documentation
3. Test any endpoint with the "Try it out" button

### Using PowerShell
```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:8000/api/health"

# Get Statistics
Invoke-RestMethod -Uri "http://localhost:8000/api/statistics"

# Get All Batches
Invoke-RestMethod -Uri "http://localhost:8000/api/batches"

# Make a Prediction
$body = @{
    thermal_shipper_temp_reading = 5.0
    room_temp_reading = 22.0
    room_humidity_reading = 60.0
    item_expiry_hours = 720.0
    ultra_low_temperature_freezer_hours = 0.0
    out_of_bound_temperature_hours = 2.0
    refrigeration_temperature_hours = 10.0
    location = 'Warehouse A'
    current_hop = 'Distribution Center'
    external_storage = 'Cold Room'
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/predict" -Method Post -Body $body -ContentType "application/json"
```

### Using curl (if available)
```bash
# Health Check
curl http://localhost:8000/api/health

# Get Statistics
curl http://localhost:8000/api/statistics

# Make a Prediction
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"thermal_shipper_temp_reading":5.0,"room_temp_reading":22.0,"room_humidity_reading":60.0,"item_expiry_hours":720.0,"ultra_low_temperature_freezer_hours":0.0,"out_of_bound_temperature_hours":2.0,"refrigeration_temperature_hours":10.0,"location":"Warehouse A","current_hop":"Distribution Center","external_storage":"Cold Room"}'
```

---

## 🔍 Step 6: Verifying Everything Works

### Checklist
- [ ] Backend starts without errors (wait 20-30 seconds)
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Overview dashboard shows data
- [ ] Live Risk page displays batches
- [ ] Batch Analysis page allows selection
- [ ] Prediction form generates results
- [ ] Analytics page shows metrics
- [ ] No console errors in browser (press F12)

### Common Issues and Solutions

#### Issue 1: "Port 8000 already in use"
**Solution:**
```powershell
# Find the process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Then restart backend
cd backend
python main.py
```

#### Issue 2: "Port 3000 already in use"
**Solution:**
Frontend will automatically try port 3001, 3002, etc.
Look for the actual port in the terminal output:
```
➜  Local:   http://localhost:3001/
```

#### Issue 3: "Module not found" errors
**Solution:**
```bash
# Reinstall Python dependencies
pip install -r requirements.txt

# Reinstall frontend dependencies
cd frontend
npm install
```

#### Issue 4: Backend takes too long to start
**Reason:** Loading ML models (especially SHAP) takes 20-30 seconds  
**Solution:** Just wait patiently for "Server ready to accept requests"

#### Issue 5: Frontend shows "Network Error"
**Possible Causes:**
1. Backend not running
2. Backend still loading (wait for "Server ready")
3. Wrong backend URL in frontend config

**Solution:**
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check frontend API configuration
cd frontend
type src\utils\api.js | findstr "API_BASE_URL"
```

#### Issue 6: "Cannot find module" in backend
**Solution:**
```powershell
# Make sure you're in the correct directory
cd backend
python main.py
```

---

## 🛑 Step 7: Stopping the Application

### Graceful Shutdown
1. **Stop Frontend**: Press `Ctrl+C` in the frontend terminal
2. **Stop Backend**: Press `Ctrl+C` in the backend terminal

### Force Stop (if needed)
```powershell
# Find and kill Python processes
taskkill /IM python.exe /F

# Find and kill Node processes
taskkill /IM node.exe /F
```

---

## 📝 Step 8: Re-running the Application

### Every Time You Want to Run
You DON'T need to:
- ❌ Reinstall dependencies
- ❌ Retrain models
- ❌ Re-clone repository

You ONLY need to:
- ✅ Start backend: `cd backend && python main.py`
- ✅ Start frontend: `cd frontend && npm run dev`
- ✅ Open browser: http://localhost:3000

### After System Restart
Same steps as above - just start both servers!

---

## 📚 Additional Resources

### Documentation
- **README.md**: Project overview and setup
- **PROJECT_REPORT.md**: Detailed technical documentation
- **FACULTY_QA.md**: 40 Q&A for understanding the project
- **TEST_RESULTS.md**: ML pipeline testing results
- **INTEGRATION_TEST_RESULTS.md**: Frontend-backend testing
- **PROJECT_COMPLETION_SUMMARY.md**: Complete project summary

### API Documentation
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Code Structure
```
ColdLink-AI/
├── backend/          # FastAPI server
│   └── main.py      # 12 API endpoints
├── frontend/         # React application
│   └── src/
│       ├── pages/   # 8 pages
│       └── components/
├── models/          # Trained ML models
├── data/            # Dataset (26,373 records)
└── notebooks/       # Jupyter notebooks
```

---

## 🎯 Quick Command Reference

### Start Application
```bash
# Terminal 1
cd backend && python main.py

# Terminal 2  
cd frontend && npm run dev
```

### Check Status
```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:3000
```

### View Logs
```bash
# Backend logs are in the terminal where you ran python main.py
# Frontend logs are in the terminal where you ran npm run dev
# Browser console: Press F12 in browser
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging

**Backend:**
Add this to `backend/main.py` before running:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
Open browser console (F12) to see detailed logs

### Check System Resources
```powershell
# CPU and Memory usage
tasklist | findstr "python\|node"

# Port usage
netstat -ano | findstr ":8000"
netstat -ano | findstr ":3000"
```

### Verify File Integrity
```powershell
# Check models exist
dir models\*.pkl

# Check data exists
dir data\*.csv

# Check frontend build
dir frontend\node_modules
```

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

### Backend Terminal
```
✓ Server ready to accept requests
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Frontend Terminal
```
VITE v5.4.21  ready in 4483 ms
➜  Local:   http://localhost:3000/
```

### Browser
- No errors in console (F12)
- Data loads on Overview page
- Can navigate between pages
- Forms work correctly

---

## 📞 Support

If you encounter issues:

1. **Check this guide** - Most common issues are covered
2. **Check documentation** - See other .md files
3. **Check GitHub** - https://github.com/Niraj-28/ColdLink-AI
4. **Check logs** - Terminal output and browser console (F12)

---

## ⏱️ Expected Timings

- **Initial Setup**: 5-10 minutes (first time only)
- **Backend Startup**: 20-30 seconds (loading models)
- **Frontend Startup**: 5-10 seconds
- **Page Load**: <1 second
- **API Response**: 50-300ms
- **Prediction**: ~200ms

---

## 🎓 For Demonstration/Presentation

### Recommended Flow
1. Start both servers
2. Open browser to http://localhost:3000
3. Show Overview dashboard (statistics)
4. Navigate to Live Risk (show filtering)
5. Open Batch Analysis (show SHAP explanation)
6. Use Prediction form (show real-time prediction)
7. View Analytics (show model metrics)
8. Explain the technology stack from About page

### Talking Points
- "Real AI/ML system with 79.7% F1 Score"
- "Complete full-stack application"
- "SHAP explainability for every prediction"
- "12 REST API endpoints"
- "8 interactive frontend pages"
- "26,373 real data points"

---

**Document Version**: 1.0  
**Last Updated**: September 22, 2026  
**Tested On**: Windows 10, Python 3.14.7, Node.js 24.19.0

**Status**: ✅ All systems tested and verified working!
