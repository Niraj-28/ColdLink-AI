"""
Prediction Page - Single batch risk prediction with detailed form
"""

import streamlit as st
import requests
from datetime import datetime

API_BASE = "http://localhost:8000"

def show():
    st.header("🔮 Risk Prediction")
    st.markdown("Enter shipment details to predict cold chain failure risk")
    
    # Create form
    with st.form("prediction_form"):
        st.subheader("📦 Shipment Information")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**Temperature Readings**")
            thermal_shipper_temp = st.number_input(
                "Thermal Shipper Temperature (°C)",
                min_value=-80.0,
                max_value=50.0,
                value=5.0,
                step=0.1,
                help="Recommended: 2-8°C for most vaccines"
            )
            
            room_temp = st.number_input(
                "Room Temperature (°C)",
                min_value=-20.0,
                max_value=50.0,
                value=22.0,
                step=0.1
            )
            
            room_humidity = st.number_input(
                "Room Humidity (%)",
                min_value=0.0,
                max_value=100.0,
                value=45.0,
                step=1.0
            )
        
        with col2:
            st.markdown("**Storage Times (hours)**")
            item_expiry_hours = st.number_input(
                "Hours Until Expiry",
                min_value=-100.0,
                max_value=10000.0,
                value=120.0,
                step=1.0,
                help="Negative values indicate expired items"
            )
            
            ultra_low_hours = st.number_input(
                "Ultra-Low Freezer Hours",
                min_value=0.0,
                max_value=1000.0,
                value=0.0,
                step=1.0
            )
            
            refrigeration_hours = st.number_input(
                "Refrigeration Hours",
                min_value=0.0,
                max_value=1000.0,
                value=24.0,
                step=1.0
            )
        
        st.markdown("---")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            location = st.selectbox(
                "Location",
                ["Warehouse A", "Warehouse B", "Distribution Center", "Transit Hub", "Regional Center"]
            )
        
        with col2:
            current_hop = st.selectbox(
                "Current Hop",
                ["Distribution Center", "Regional Warehouse", "Transit Hub", "Final Destination"]
            )
        
        with col3:
            external_storage = st.selectbox(
                "External Storage Type",
                ["Cold Room", "Freezer", "Refrigerated Container", "Thermal Shipper"]
            )
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            oob_hours = st.number_input(
                "Out of Bounds Hours",
                min_value=0.0,
                max_value=500.0,
                value=0.0,
                step=0.1,
                help="Time outside recommended temperature range"
            )
        
        with col2:
            hour = st.slider("Hour of Day", 0, 23, 12)
        
        with col3:
            day_of_week = st.selectbox(
                "Day of Week",
                options=list(range(7)),
                format_func=lambda x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][x]
            )
        
        # Submit button
        submit = st.form_submit_button("🎯 Predict Risk", use_container_width=True)
    
    # Process prediction
    if submit:
        with st.spinner("Analyzing shipment data..."):
            try:
                payload = {
                    "thermal_shipper_temp_reading": thermal_shipper_temp,
                    "room_temp_reading": room_temp,
                    "room_humidity_reading": room_humidity,
                    "item_expiry_hours": item_expiry_hours,
                    "ultra_low_temperature_freezer_hours": ultra_low_hours,
                    "out_of_bound_temperature_hours": oob_hours,
                    "refrigeration_temperature_hours": refrigeration_hours,
                    "location": location,
                    "current_hop": current_hop,
                    "external_storage": external_storage,
                    "hour": hour,
                    "day_of_week": day_of_week
                }
                
                response = requests.post(f"{API_BASE}/api/predict", json=payload, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    st.success("✅ Prediction Complete!")
                    
                    # Display results
                    st.markdown("---")
                    st.subheader("📊 Prediction Results")
                    
                    # Risk probability gauge
                    risk_prob = result.get('risk_probability', 0)
                    risk_level = result.get('risk_level', 'UNKNOWN')
                    
                    col1, col2, col3 = st.columns([2, 1, 1])
                    
                    with col1:
                        # Risk gauge
                        if risk_level == 'LOW':
                            color = 'green'
                        elif risk_level == 'MEDIUM':
                            color = 'orange'
                        else:
                            color = 'red'
                        
                        st.markdown(f"""
                        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                            <h1 style="font-size: 3rem; margin: 0;">{risk_prob*100:.1f}%</h1>
                            <p style="font-size: 1.2rem; margin: 10px 0;">Failure Risk Probability</p>
                            <p style="font-size: 1.5rem; font-weight: bold; color: {color};">⚠️ {risk_level} RISK</p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with col2:
                        st.metric("Confidence", f"{result.get('confidence', 0)*100:.1f}%")
                        st.metric("Risk Category", result.get('risk_category', 'N/A'))
                    
                    with col3:
                        st.metric("Model", "Random Forest")
                        st.metric("Features Used", "20")
                    
                    # Recommendation
                    st.markdown("---")
                    st.subheader("💡 Recommendation")
                    recommendation = result.get('recommendation', 'No recommendation available')
                    st.info(recommendation)
                    
                    # Top risk factors
                    if 'top_risk_factors' in result and result['top_risk_factors']:
                        st.markdown("---")
                        st.subheader("🔍 Top Risk Factors")
                        
                        for i, factor in enumerate(result['top_risk_factors'][:5], 1):
                            contrib = factor.get('contribution', 0)
                            feature = factor.get('feature', 'Unknown')
                            value = factor.get('value', 0)
                            
                            impact_color = 'red' if contrib > 0 else 'green'
                            impact_arrow = '↑' if contrib > 0 else '↓'
                            
                            st.markdown(f"""
                            <div style="padding: 10px; margin: 5px 0; background-color: #f3f4f6; border-left: 4px solid {impact_color}; border-radius: 4px;">
                                <strong>{i}. {feature}</strong><br/>
                                Value: {value:.2f} | Impact: <span style="color: {impact_color};">{impact_arrow} {contrib:.4f}</span>
                            </div>
                            """, unsafe_allow_html=True)
                    
                else:
                    st.error(f"Prediction failed: {response.json().get('detail', 'Unknown error')}")
                    
            except requests.exceptions.RequestException as e:
                st.error("⚠️ Unable to connect to backend API")
                st.info("Please ensure the backend server is running on http://localhost:8000")
                st.code(f"Error: {str(e)}", language="text")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")
    
    # Sample scenarios
    with st.expander("📋 Sample Test Scenarios"):
        st.markdown("""
        **Low Risk Scenario:**
        - Thermal Shipper: 5.0°C
        - Room Temp: 20.0°C
        - Expiry Hours: 500
        - OOB Hours: 0
        
        **High Risk Scenario:**
        - Thermal Shipper: 9.5°C
        - Room Temp: 28.0°C
        - Expiry Hours: 18
        - OOB Hours: 8
        """)
