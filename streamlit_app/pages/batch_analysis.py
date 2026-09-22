"""
Batch Analysis Page - View and filter high-risk batches
"""

import streamlit as st
import requests
import pandas as pd

API_BASE = "http://localhost:8000"

def show():
    st.header("📦 Batch Analysis")
    st.markdown("Monitor and analyze vaccine batches in the supply chain")
    
    # Filters
    col1, col2, col3 = st.columns(3)
    
    with col1:
        risk_filter = st.selectbox(
            "Risk Level Filter",
            ["All", "HIGH", "MEDIUM", "LOW"]
        )
    
    with col2:
        location_filter = st.selectbox(
            "Location Filter",
            ["All", "Warehouse A", "Warehouse B", "Distribution Center", "Transit Hub"]
        )
    
    with col3:
        limit = st.number_input("Number of Batches", min_value=10, max_value=100, value=30, step=10)
    
    # Fetch batches
    if st.button("🔄 Load Batches", use_container_width=True):
        with st.spinner("Loading batch data..."):
            try:
                params = {"limit": limit}
                if risk_filter != "All":
                    params["risk_level"] = risk_filter
                if location_filter != "All":
                    params["location"] = location_filter
                
                response = requests.get(f"{API_BASE}/api/batches", params=params, timeout=10)
                
                if response.status_code == 200:
                    batches = response.json()
                    
                    if batches:
                        st.success(f"✅ Loaded {len(batches)} batches")
                        
                        # Summary metrics
                        st.markdown("---")
                        col1, col2, col3, col4 = st.columns(4)
                        
                        high_risk = sum(1 for b in batches if b.get('risk_level') == 'HIGH')
                        medium_risk = sum(1 for b in batches if b.get('risk_level') == 'MEDIUM')
                        low_risk = sum(1 for b in batches if b.get('risk_level') == 'LOW')
                        avg_risk = sum(b.get('risk_score', 0) for b in batches) / len(batches) if batches else 0
                        
                        with col1:
                            st.metric("High Risk", high_risk, delta=f"{high_risk/len(batches)*100:.1f}%")
                        with col2:
                            st.metric("Medium Risk", medium_risk)
                        with col3:
                            st.metric("Low Risk", low_risk)
                        with col4:
                            st.metric("Avg Risk Score", f"{avg_risk:.2%}")
                        
                        st.markdown("---")
                        
                        # Display batches
                        for batch in batches:
                            risk_level = batch.get('risk_level', 'UNKNOWN')
                            risk_score = batch.get('risk_score', 0)
                            
                            if risk_level == 'HIGH':
                                color = '#fee2e2'
                                border_color = '#dc2626'
                                icon = '🔴'
                            elif risk_level == 'MEDIUM':
                                color = '#fef3c7'
                                border_color = '#f59e0b'
                                icon = '🟡'
                            else:
                                color = '#d1fae5'
                                border_color = '#10b981'
                                icon = '🟢'
                            
                            with st.container():
                                st.markdown(f"""
                                <div style="padding: 15px; margin: 10px 0; background-color: {color}; border-left: 5px solid {border_color}; border-radius: 5px;">
                                    <h4>{icon} Batch ID: {batch.get('batch_id', 'N/A')}</h4>
                                    <p><strong>Risk Score:</strong> {risk_score:.2%} | <strong>Risk Level:</strong> {risk_level}</p>
                                    <p><strong>Location:</strong> {batch.get('location', 'N/A')} | <strong>Hop:</strong> {batch.get('current_hop', 'N/A')}</p>
                                    <p><strong>Temp:</strong> {batch.get('thermal_shipper_temp_reading', 0):.1f}°C | 
                                       <strong>Expiry:</strong> {batch.get('item_expiry_hours', 0):.0f}h | 
                                       <strong>OOB:</strong> {batch.get('out_of_bound_temperature_hours', 0):.1f}h</p>
                                </div>
                                """, unsafe_allow_html=True)
                                
                                # Expandable details
                                with st.expander(f"View Details for {batch.get('batch_id', 'N/A')}"):
                                    col1, col2 = st.columns(2)
                                    
                                    with col1:
                                        st.markdown("**Temperature Readings**")
                                        st.write(f"Thermal Shipper: {batch.get('thermal_shipper_temp_reading', 0):.2f}°C")
                                        st.write(f"Room Temperature: {batch.get('room_temp_reading', 0):.2f}°C")
                                        st.write(f"Room Humidity: {batch.get('room_humidity_reading', 0):.1f}%")
                                    
                                    with col2:
                                        st.markdown("**Storage Information**")
                                        st.write(f"Expiry Hours: {batch.get('item_expiry_hours', 0):.0f}h")
                                        st.write(f"Ultra-Low Hours: {batch.get('ultra_low_temperature_freezer_hours', 0):.0f}h")
                                        st.write(f"Refrigeration Hours: {batch.get('refrigeration_temperature_hours', 0):.0f}h")
                                        st.write(f"OOB Hours: {batch.get('out_of_bound_temperature_hours', 0):.1f}h")
                    else:
                        st.info("No batches found matching the filters")
                
                else:
                    st.error(f"Failed to load batches: {response.status_code}")
            
            except Exception as e:
                st.error(f"Error loading batches: {str(e)}")
    
    else:
        st.info("👆 Click 'Load Batches' to view batch data")
    
    # Export option
    st.markdown("---")
    st.subheader("📥 Export Options")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📊 Export High Risk Report"):
            st.info("Export functionality would generate a CSV/PDF report of high-risk batches")
    
    with col2:
        if st.button("📧 Send Alert Notifications"):
            st.success("Alert notifications would be sent to supply chain managers")
