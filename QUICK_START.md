# ColdLink AI - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Start Backend (Choose One)

#### Option A: Demo Mode (Recommended - No Issues)
```bash
# Double-click this file:
start_backend_demo.bat

# OR run manually:
cd backend
python main_demo.py
```

#### Option B: Full ML Mode (May have DLL issues)
```bash
# Double-click this file:
start_backend.bat

# OR run manually:
cd backend
python main.py
```

**If you see DLL errors, use Option A (Demo Mode)**

---

### Step 2: Start Frontend

```bash
# In a NEW terminal, double-click:
start_frontend.bat

# OR run manually:
cd frontend
npm install  # First time only
npm run dev
```

---

### Step 3: Open Browser

Frontend will automatically open at:
**http://localhost:3000**

Or manually visit:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

---

## ✅ Verify Everything Works

### Test 1: Check Dashboard
1. Click "Dashboard" in navigation
2. Should see statistics, charts, and trends
3. ✅ If you see data, it's working!

### Test 2: Try Prediction
1. Click "Prediction" in navigation
2. Fill in the form (or use default values)
3. Click "Predict Risk"
4. Should see risk score and SHAP factors
5. ✅ If you see results, it's working!

### Test 3: Check Batches
1. Click "Batch Analysis"
2. Should see list of batches
3. Try searching or filtering
4. Click a batch to expand details
5. ✅ If batches load, it's working!

---

## 🎯 Sample Test Input

Use these values in the Prediction page:

**Normal Conditions (Low Risk):**
```
Shipper Temperature: 5.0
Room Temperature: 22.0
Room Humidity: 55.0
Hours Until Expiry: 120.0
Ultra-Low Hours: 0.0
OOB Hours: 0.0
Refrigeration Hours: 24.0
Location: Mumbai
Current Hop: dest_vaccine_storage_unit
Storage Type: vaccine_storage_unit
Hour: 14
Day of Week: 2
```

**Expected Result:** LOW or MEDIUM risk (~20-30%)

---

**High Risk Scenario:**
```
Shipper Temperature: 10.0  (too high!)
Room Temperature: 28.0
Room Humidity: 65.0
Hours Until Expiry: 15.0  (expiring soon!)
OOB Hours: 12.0  (out of bounds!)
Everything else: same as above
```

**Expected Result:** HIGH or CRITICAL risk (~70-90%)

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if Python is installed
python --version

# Check if dependencies are installed
pip list | findstr fastapi

# If not installed:
cd backend
pip install -r requirements.txt
```

### Frontend won't start?
```bash
# Check if Node is installed
node --version

# Check if dependencies are installed
cd frontend
npm install

# If port 3000 is busy, Vite will suggest 3001
```

### DLL Error?
```bash
# Use demo mode instead:
start_backend_demo.bat

# See DLL_FIX_GUIDE.md for permanent solutions
```

### Can't connect to backend?
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# If not, restart backend:
cd backend
python main_demo.py
```

---

## 📱 Application Features

### 🏠 Dashboard
- Statistics: Total batches, risk counts, temperatures
- Risk Distribution: Pie chart
- Trend Analysis: Line chart over time
- Location Analysis: Bar chart by location

### 🔮 Prediction
- **Input**: 12 fields for batch data
- **Output**: Risk score, level, SHAP factors, recommendation
- **Features**: Real-time prediction, explanations, reset button

### 📦 Batch Analysis
- **List**: All batches with risk indicators
- **Search**: By batch ID or location
- **Filter**: By risk level or location
- **Details**: Expandable batch information

### 📊 Analytics
- **Metrics**: Accuracy, Precision, Recall, F1, ROC-AUC
- **Comparison**: All 4 models side-by-side
- **Features**: Top 15 most important features
- **Charts**: Bar charts for visualization

### 📡 Live Risk Monitor
- **Auto-refresh**: Updates every 30 seconds
- **Alerts**: Critical batch warnings
- **Status**: System health indicators
- **Table**: Comprehensive batch view

---

## 🎓 For Your Project

### Screenshots to Take
1. ✅ Dashboard with charts
2. ✅ Prediction with results
3. ✅ Batch Analysis with filters
4. ✅ Analytics with model metrics
5. ✅ Live Risk Monitor

### What to Document
- ✅ Setup process
- ✅ How you ran it
- ✅ Test cases you tried
- ✅ Results you got
- ✅ Any issues (like DLL) and how you solved them

### Demo Preparation
1. Start both backend and frontend
2. Load Dashboard (show charts)
3. Run 2-3 predictions (low, medium, high risk)
4. Show batch filtering
5. Show model metrics
6. Show live monitoring

---

## 📞 Need Help?

**Check these files:**
1. **PROJECT_GUIDE.md** - Complete documentation
2. **DLL_FIX_GUIDE.md** - Fix DLL loading issues
3. **README.md** - Project overview

**Common Commands:**
```bash
# Restart backend
Ctrl+C  # Stop
python main_demo.py  # Start

# Restart frontend
Ctrl+C  # Stop
npm run dev  # Start

# Check what's running
netstat -ano | findstr :8000  # Backend
netstat -ano | findstr :3000  # Frontend
```

---

## ⚡ Performance Tips

### Backend
- First startup: 2-3 seconds (loading data)
- API calls: < 1 second
- Predictions: < 100ms (demo mode)

### Frontend
- Initial load: < 2 seconds
- Navigation: Instant (SPA)
- Charts: < 500ms to render

---

## 🎉 You're Ready!

**Everything should now be working!**

1. ✅ Backend running on port 8000
2. ✅ Frontend running on port 3000
3. ✅ Application accessible in browser
4. ✅ All features functional

**Enjoy testing ColdLink AI!** 🚀

---

**Quick Links:**
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

---

*For detailed information, see PROJECT_GUIDE.md*
