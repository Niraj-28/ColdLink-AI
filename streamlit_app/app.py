"""
ColdLink AI - Streamlit Frontend
Main application entry point with navigation
"""

import streamlit as st
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Page configuration
st.set_page_config(
    page_title="ColdLink AI",
    page_icon="❄️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main {
        padding: 0rem 1rem;
    }
    .stAlert {
        margin-top: 1rem;
    }
    div[data-testid="stMetricValue"] {
        font-size: 2rem;
        font-weight: bold;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 1rem;
        color: #6B7280;
    }
    .risk-high {
        color: #DC2626;
        font-weight: bold;
    }
    .risk-medium {
        color: #F59E0B;
        font-weight: bold;
    }
    .risk-low {
        color: #10B981;
        font-weight: bold;
    }
    h1 {
        color: #1F2937;
        padding-bottom: 1rem;
    }
    h2 {
        color: #374151;
        padding-top: 1rem;
    }
    h3 {
        color: #4B5563;
    }
    .stButton>button {
        width: 100%;
        background-color: #3B82F6;
        color: white;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: 500;
        border: none;
        transition: background-color 0.2s;
    }
    .stButton>button:hover {
        background-color: #2563EB;
    }
    .sidebar .sidebar-content {
        background-color: #F9FAFB;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.title("❄️ ColdLink AI")
st.markdown("### AI-Powered Vaccine Cold Chain Risk Prediction System")

# Sidebar navigation
st.sidebar.title("Navigation")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Select Page:",
    ["🏠 Dashboard", "🔮 Prediction", "📊 Analytics", "📦 Batch Analysis", "📡 Live Risk Monitor"],
    label_visibility="collapsed"
)

st.sidebar.markdown("---")
st.sidebar.markdown("### About")
st.sidebar.info(
    """
    **ColdLink AI** predicts vaccine cold chain failures using machine learning.
    
    **Features:**
    - Real-time risk prediction
    - Batch monitoring
    - Model analytics
    - SHAP explanations
    
    **Model Performance:**
    - Accuracy: 76.8%
    - F1-Score: 79.7%
    - ROC-AUC: 94.1%
    """
)

st.sidebar.markdown("---")
st.sidebar.markdown("### API Status")

# Check backend health
import requests
try:
    response = requests.get("http://localhost:8000/api/health", timeout=2)
    if response.status_code == 200:
        st.sidebar.success("✅ Backend: Connected")
    else:
        st.sidebar.error("❌ Backend: Error")
except:
    st.sidebar.error("❌ Backend: Offline")

# Route to pages
if page == "🏠 Dashboard":
    import pages.dashboard as dashboard
    dashboard.show()
elif page == "🔮 Prediction":
    import pages.prediction as prediction
    prediction.show()
elif page == "📊 Analytics":
    import pages.analytics as analytics
    analytics.show()
elif page == "📦 Batch Analysis":
    import pages.batch_analysis as batch_analysis
    batch_analysis.show()
elif page == "📡 Live Risk Monitor":
    import pages.live_risk as live_risk
    live_risk.show()
