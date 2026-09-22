# ColdLink AI - Streamlit Frontend Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd streamlit_app
pip install -r requirements.txt
```

### Running the Application

```bash
# Start backend first (in separate terminal)
cd backend
python main.py

# Start Streamlit frontend
cd streamlit_app
python -m streamlit run app.py
```

The application will open automatically in your browser at `http://localhost:8501`

---

## 📊 Application Structure

### Main Components

```
streamlit_app/
├── app.py                      # Main application entry point
├── pages/
│   ├── dashboard.py            # Overview and statistics
│   ├── prediction.py           # Single prediction form
│   ├── analytics.py            # Model performance metrics
│   ├── batch_analysis.py       # Batch monitoring
│   └── live_risk.py            # Real-time risk monitoring
├── .streamlit/
│   └── config.toml            # Streamlit configuration
└── requirements.txt           # Python dependencies
```

---

## 🎯 Features Overview

### 1. 🏠 Dashboard Page

**Purpose**: System overview with key metrics and trends

**Features**:
- **Key Metrics Cards**: Total batches, high-risk count, average risk score, system status
- **Risk Distribution Pie Chart**: Visual breakdown of LOW/MEDIUM/HIGH risk levels
- **Risk Trend Analysis**: Time-series chart showing average risk and high-risk batch counts
- **Model Performance Summary**: Quick view of accuracy, F1-score, ROC-AUC, recall

**API Endpoints Used**:
- `GET /api/health` - System health check
- `GET /api/statistics` - Overall statistics
- `GET /api/risk-trend` - Historical risk trends

**Screenshot Elements**:
```
┌─────────────────────────────────────────┐
│ Total Batches  │ High Risk │ Avg Risk  │
│     26,674     │    145    │  35.2%    │
└─────────────────────────────────────────┘
│ Risk Distribution Chart │ Risk Breakdown │
└─────────────────────────────────────────┘
│        Risk Trend Over Time             │
└─────────────────────────────────────────┘
```

---

### 2. 🔮 Prediction Page

**Purpose**: Interactive form for single batch risk prediction

**Input Fields** (12 parameters):

| Category | Field | Range | Default | Description |
|----------|-------|-------|---------|-------------|
| **Temperature** | Thermal Shipper Temp | -80 to 50°C | 5.0°C | Vaccine storage temperature |
| | Room Temperature | -20 to 50°C | 22.0°C | Ambient temperature |
| | Room Humidity | 0-100% | 45% | Environmental humidity |
| **Storage Time** | Hours Until Expiry | -100 to 10000h | 120h | Time before expiration |
| | Ultra-Low Freezer Hours | 0-1000h | 0h | Time in deep freeze |
| | Refrigeration Hours | 0-1000h | 24h | Time in 2-8°C storage |
| | Out of Bounds Hours | 0-500h | 0h | Time outside safe range |
| **Location** | Location | Dropdown | Warehouse A | Current facility |
| | Current Hop | Dropdown | Distribution Center | Supply chain stage |
| | External Storage | Dropdown | Cold Room | Storage type |
| **Time Context** | Hour of Day | 0-23 | 12 | Current hour |
| | Day of Week | 0-6 | 0 (Mon) | Current day |

**Output Display**:
- **Risk Probability Gauge**: Large percentage display with color coding
- **Risk Level Badge**: LOW (green), MEDIUM (orange), HIGH (red)
- **Confidence Score**: Model's confidence in prediction
- **Recommendation**: Actionable advice based on risk factors
- **Top 5 Risk Factors**: SHAP-based feature contributions with impact direction

**API Endpoint Used**:
- `POST /api/predict` - Single prediction endpoint

**Sample Test Cases**:

```python
# Low Risk (5-25% probability)
{
  "thermal_shipper_temp_reading": 5.0,
  "room_temp_reading": 20.0,
  "item_expiry_hours": 500,
  "out_of_bound_temperature_hours": 0
}

# High Risk (70-90% probability)
{
  "thermal_shipper_temp_reading": 9.5,
  "room_temp_reading": 28.0,
  "item_expiry_hours": 18,
  "out_of_bound_temperature_hours": 8
}
```

---

### 3. 📊 Analytics Page

**Purpose**: Model performance analysis and feature importance

**Sections**:

1. **Model Comparison**
   - Side-by-side metrics for all 4 models:
     - Logistic Regression
     - Random Forest (Best)
     - XGBoost
     - HistGradientBoosting
   - Grouped bar chart comparing F1-Score and ROC-AUC
   - Highlighted best performers

2. **Detailed Metrics Table**
   - Accuracy, Precision, Recall, F1-Score, ROC-AUC
   - Color-coded max values per metric
   - Sortable and exportable

3. **Feature Importance Chart**
   - Top 15 features by importance score
   - Horizontal bar chart with color gradient
   - Based on Random Forest feature importance

4. **Model Information**
   - Training/validation/test split sizes
   - Feature breakdown (numerical vs categorical)
   - Target class distribution

**Key Insights Displayed**:
```
✅ High Recall (99.9%): Catches almost all failure cases
✅ Strong ROC-AUC (94.1%): Excellent class separation
✅ Balanced F1 (79.7%): Good precision-recall balance
```

**API Endpoints Used**:
- `GET /api/model-metrics` - All model performance metrics
- `GET /api/feature-importance` - Feature importance scores

---

### 4. 📦 Batch Analysis Page

**Purpose**: Monitor and filter batches in the supply chain

**Features**:

1. **Filter Controls**
   - Risk Level: All / HIGH / MEDIUM / LOW
   - Location: All / Warehouse A / Warehouse B / Distribution Center / Transit Hub
   - Number of batches: 10-100

2. **Summary Metrics**
   - High/Medium/Low risk counts
   - Percentage distribution
   - Average risk score

3. **Batch Display Cards**
   - Color-coded by risk level (red/yellow/green)
   - Batch ID, risk score, location
   - Key parameters: temp, expiry, OOB hours
   - Expandable details panel

4. **Export Options**
   - High risk report generation
   - Alert notification sending

**Card Layout Example**:
```
┌────────────────────────────────────────┐
│ 🔴 Batch ID: BATCH_12345              │
│ Risk Score: 78% | Risk Level: HIGH    │
│ Location: Warehouse A → Transit Hub   │
│ Temp: 9.2°C | Expiry: 18h | OOB: 8h  │
│ [View Details ▼]                       │
└────────────────────────────────────────┘
```

**API Endpoint Used**:
- `GET /api/batches?limit={n}&risk_level={level}&location={loc}`

---

### 5. 📡 Live Risk Monitor Page

**Purpose**: Real-time monitoring with auto-refresh capability

**Features**:

1. **Auto-Refresh Toggle**
   - Enable/disable 30-second auto-refresh
   - Manual refresh button
   - Last updated timestamp

2. **Alert Summary**
   - 🔴 Critical Alerts (HIGH risk) count
   - 🟡 Warning Alerts (MEDIUM risk) count
   - 📊 Total monitored batches

3. **Critical Alerts Section**
   - Animated pulse effect for attention
   - Large batch cards with full details
   - Action buttons:
     - 📋 View Details
     - 📧 Send Alert
     - ✓ Acknowledge

4. **Warning Alerts (Collapsible)**
   - Expandable section for MEDIUM risk batches
   - Compact display format

5. **System Status Dashboard**
   - API connection status
   - Model operational status
   - Data stream status

**Alert Card Example**:
```
┌──────────────────────────────────────────┐
│ ⚠️ CRITICAL: Batch BATCH_54321 [PULSING]│
│ Risk Score: 85%                          │
│ Location: Transit Hub → Final Dest      │
│ Issues: Temp: 10.5°C | Expiry: 12h |    │
│         OOB: 12h                         │
│ [View Details] [Send Alert] [Acknowledge]│
└──────────────────────────────────────────┘
```

**API Endpoint Used**:
- `GET /api/batches?limit=20` - Latest batch data

---

## 🎨 UI/UX Features

### Design Elements

1. **Color Coding**
   - 🟢 GREEN (#10B981): Low risk, safe, operational
   - 🟡 ORANGE (#F59E0B): Medium risk, warning, attention needed
   - 🔴 RED (#DC2626): High risk, critical, immediate action
   - 🔵 BLUE (#3B82F6): Primary actions, information

2. **Responsive Layout**
   - Wide layout for data-heavy pages
   - Column-based responsive design
   - Expandable sections for details

3. **Interactive Elements**
   - Form validation on prediction page
   - Expandable detail panels
   - Hover effects and tooltips
   - Loading spinners for API calls

4. **Sidebar Navigation**
   - Fixed navigation with icons
   - Active page highlighting
   - API status indicator
   - Model performance summary

### Custom Styling

The app uses custom CSS for enhanced UX:
- Metric cards with large, bold numbers
- Color-coded risk badges
- Gradient backgrounds for emphasis
- Smooth transitions and animations
- Professional card-based layouts

---

## 🔌 API Integration

### Base URL Configuration

```python
API_BASE = "http://localhost:8000"
```

### Error Handling

All pages include comprehensive error handling:

```python
try:
    response = requests.get(f"{API_BASE}/api/endpoint", timeout=5)
    if response.status_code == 200:
        data = response.json()
        # Process data
    else:
        st.error(f"API Error: {response.status_code}")
except requests.exceptions.RequestException as e:
    st.error("⚠️ Unable to connect to backend API")
    st.info("Please ensure the backend server is running on http://localhost:8000")
```

### Timeout Configuration

- Health checks: 2 seconds
- Statistics/metrics: 5 seconds  
- Predictions: 10 seconds
- Batch queries: 10 seconds

---

## 📈 Model Performance Summary

As displayed throughout the application:

| Metric | Value | Interpretation |
|--------|-------|----------------|
| **Accuracy** | 76.8% | Overall correctness |
| **Precision** | 66.3% | True positives / predicted positives |
| **Recall** | 99.9% | Catches almost all failures |
| **F1-Score** | 79.7% | Harmonic mean of precision/recall |
| **ROC-AUC** | 94.1% | Excellent discrimination ability |

**Model**: Random Forest Classifier  
**Training Size**: 16,605 samples  
**Features**: 20 (17 numerical, 3 encoded categorical)  
**Target Balance**: 54.5% normal, 45.5% failure

---

## 🐛 Troubleshooting

### Common Issues

1. **"Unable to connect to backend API"**
   - Ensure backend is running: `cd backend && python main.py`
   - Check if port 8000 is available
   - Verify firewall settings

2. **"Streamlit command not found"**
   - Use: `python -m streamlit run app.py`
   - Or install globally: `pip install streamlit --user`

3. **"Module not found" errors**
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

4. **Slow page loading**
   - Check backend response times
   - Reduce batch limit in queries
   - Verify network connectivity

5. **Charts not displaying**
   - Ensure plotly is installed: `pip install plotly`
   - Check browser console for errors
   - Try refreshing the page

---

## 🚀 Production Deployment

### Recommended Steps

1. **Environment Configuration**
   ```bash
   # Create .env file
   API_BASE_URL=https://your-backend-api.com
   STREAMLIT_SERVER_PORT=8501
   STREAMLIT_SERVER_HEADLESS=true
   ```

2. **Security Considerations**
   - Enable authentication (Streamlit Cloud or custom)
   - Use HTTPS for API connections
   - Implement rate limiting
   - Add CORS configuration

3. **Performance Optimization**
   - Enable caching: `@st.cache_data`
   - Limit batch query sizes
   - Implement pagination
   - Use connection pooling

4. **Monitoring**
   - Set up logging
   - Monitor API response times
   - Track user interactions
   - Alert on errors

---

## 📝 Development Tips

### Adding New Pages

1. Create new file in `pages/` directory
2. Implement `show()` function
3. Import and route in `app.py`
4. Follow existing patterns for consistency

### Customizing Themes

Edit `.streamlit/config.toml`:

```toml
[theme]
primaryColor="#3B82F6"
backgroundColor="#FFFFFF"
secondaryBackgroundColor="#F3F4F6"
textColor="#1F2937"
font="sans serif"
```

### Testing Changes

```bash
# Streamlit auto-reloads on file changes
# Just save your file and refresh the browser
```

---

## 📞 Support

For issues or questions:
- Check backend logs: `backend/` directory
- Review browser console for frontend errors
- Verify API endpoints using curl or Postman
- Check Streamlit documentation: https://docs.streamlit.io

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Sidebar shows "Backend: Connected"
- ✅ Dashboard displays metrics and charts
- ✅ Prediction form returns risk scores
- ✅ Analytics shows model comparison
- ✅ Batch analysis loads and filters data
- ✅ Live monitor shows real-time alerts
- ✅ No error messages in the UI

**Application is now ready for use! 🚀**
