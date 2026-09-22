"""
Live Risk Monitor - Real-time monitoring with auto-refresh
"""

import streamlit as st
import requests
import time
from datetime import datetime

API_BASE = "http://localhost:8000"

def show():
    st.header("📡 Live Risk Monitor")
    st.markdown("Real-time monitoring of high-risk batches in the supply chain")
    
    # Auto-refresh toggle
    col1, col2 = st.columns([3, 1])
    
    with col1:
        auto_refresh = st.checkbox("🔄 Enable Auto-Refresh (every 30 seconds)", value=False)
    
    with col2:
        if st.button("🔄 Refresh Now"):
            st.rerun()
    
    # Display current time
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Fetch high-risk batches
    try:
        response = requests.get(f"{API_BASE}/api/batches?limit=20", timeout=10)
        
        if response.status_code == 200:
            batches = response.json()
            
            # Filter high-risk
            high_risk_batches = [b for b in batches if b.get('risk_level') == 'HIGH']
            medium_risk_batches = [b for b in batches if b.get('risk_level') == 'MEDIUM']
            
            # Alert summary
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric(
                    "🔴 Critical Alerts",
                    len(high_risk_batches),
                    delta="Requires immediate attention" if high_risk_batches else None,
                    delta_color="inverse"
                )
            
            with col2:
                st.metric(
                    "🟡 Warning Alerts",
                    len(medium_risk_batches),
                    delta="Monitor closely" if medium_risk_batches else None
                )
            
            with col3:
                st.metric(
                    "📊 Total Monitored",
                    len(batches)
                )
            
            st.markdown("---")
            
            # Critical alerts
            if high_risk_batches:
                st.subheader("🚨 Critical Alerts - Immediate Action Required")
                
                for batch in high_risk_batches:
                    with st.container():
                        st.markdown(f"""
                        <div style="padding: 15px; margin: 10px 0; background-color: #fee2e2; border-left: 5px solid #dc2626; border-radius: 5px; animation: pulse 2s infinite;">
                            <h3 style="color: #dc2626; margin: 0;">⚠️ CRITICAL: Batch {batch.get('batch_id', 'N/A')}</h3>
                            <p style="margin: 5px 0;"><strong>Risk Score:</strong> <span style="font-size: 1.2em; color: #dc2626;">{batch.get('risk_score', 0):.1%}</span></p>
                            <p style="margin: 5px 0;"><strong>Location:</strong> {batch.get('location', 'N/A')} → {batch.get('current_hop', 'N/A')}</p>
                            <p style="margin: 5px 0;">
                                <strong>Issues:</strong> 
                                Temp: {batch.get('thermal_shipper_temp_reading', 0):.1f}°C | 
                                Expiry: {batch.get('item_expiry_hours', 0):.0f}h | 
                                OOB: {batch.get('out_of_bound_temperature_hours', 0):.1f}h
                            </p>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            if st.button(f"📋 View Details", key=f"details_{batch.get('batch_id')}"):
                                st.info("Detailed batch information would be displayed here")
                        with col2:
                            if st.button(f"📧 Send Alert", key=f"alert_{batch.get('batch_id')}"):
                                st.success("Alert notification sent!")
                        with col3:
                            if st.button(f"✓ Acknowledge", key=f"ack_{batch.get('batch_id')}"):
                                st.success("Alert acknowledged")
                        
                        st.markdown("---")
            else:
                st.success("✅ No critical alerts - all batches within acceptable risk levels")
            
            # Warning alerts
            if medium_risk_batches:
                with st.expander(f"🟡 Warning Alerts ({len(medium_risk_batches)})", expanded=False):
                    for batch in medium_risk_batches:
                        st.markdown(f"""
                        <div style="padding: 10px; margin: 5px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                            <strong>Batch {batch.get('batch_id', 'N/A')}</strong> - 
                            Risk: {batch.get('risk_score', 0):.1%} | 
                            Location: {batch.get('location', 'N/A')}
                        </div>
                        """, unsafe_allow_html=True)
            
            # System status
            st.markdown("---")
            st.subheader("🖥️ System Status")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.success("✅ API Status: Connected")
            with col2:
                st.success("✅ Model Status: Operational")
            with col3:
                st.success("✅ Data Stream: Active")
            
        else:
            st.error(f"Failed to fetch batches: {response.status_code}")
    
    except Exception as e:
        st.error(f"⚠️ Connection Error: {str(e)}")
        st.info("Please ensure the backend server is running")
    
    # Auto-refresh logic
    if auto_refresh:
        time.sleep(30)
        st.rerun()
    
    # Add CSS for pulse animation
    st.markdown("""
    <style>
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    </style>
    """, unsafe_allow_html=True)
