"""
Dashboard Page - Overview of system statistics and metrics
"""

import streamlit as st
import requests
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

API_BASE = "http://localhost:8000"

def show():
    st.header("📊 System Dashboard")
    st.markdown("Real-time overview of cold chain monitoring system")
    
    # Fetch statistics from API
    try:
        response = requests.get(f"{API_BASE}/api/statistics", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            
            # Key Metrics Row
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric(
                    label="Total Batches",
                    value=f"{stats.get('total_batches', 0):,}",
                    delta=None
                )
            
            with col2:
                high_risk = stats.get('high_risk_count', 0)
                st.metric(
                    label="High Risk Batches",
                    value=f"{high_risk:,}",
                    delta=f"{stats.get('high_risk_percentage', 0):.1f}%",
                    delta_color="inverse"
                )
            
            with col3:
                st.metric(
                    label="Avg Risk Score",
                    value=f"{stats.get('average_risk_score', 0):.2%}",
                    delta=None
                )
            
            with col4:
                st.metric(
                    label="System Status",
                    value="Operational",
                    delta="✓ Healthy"
                )
            
            st.markdown("---")
            
            # Risk Distribution
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("Risk Distribution")
                risk_dist = stats.get('risk_distribution', {})
                
                if risk_dist:
                    fig = go.Figure(data=[go.Pie(
                        labels=list(risk_dist.keys()),
                        values=list(risk_dist.values()),
                        hole=0.4,
                        marker=dict(colors=['#10B981', '#F59E0B', '#DC2626'])
                    )])
                    fig.update_layout(
                        height=300,
                        margin=dict(t=20, b=20, l=20, r=20),
                        showlegend=True
                    )
                    st.plotly_chart(fig, use_container_width=True)
                else:
                    st.info("No risk distribution data available")
            
            with col2:
                st.subheader("Risk Level Breakdown")
                if risk_dist:
                    for level, count in risk_dist.items():
                        pct = (count / stats.get('total_batches', 1)) * 100
                        if level == 'LOW':
                            color = 'green'
                        elif level == 'MEDIUM':
                            color = 'orange'
                        else:
                            color = 'red'
                        
                        st.markdown(f"""
                        <div style="padding: 10px; margin: 5px 0; background-color: #{color}20; border-left: 4px solid {color}; border-radius: 4px;">
                            <strong>{level}</strong>: {count:,} batches ({pct:.1f}%)
                        </div>
                        """, unsafe_allow_html=True)
                else:
                    st.info("No breakdown data available")
            
            # Recent Trends
            st.markdown("---")
            st.subheader("📈 Risk Trend Analysis")
            
            try:
                trend_response = requests.get(f"{API_BASE}/api/risk-trend", timeout=5)
                if trend_response.status_code == 200:
                    trend_data = trend_response.json()
                    
                    if trend_data:
                        dates = [item['date'] for item in trend_data]
                        avg_risk = [item['average_risk'] for item in trend_data]
                        high_risk_count = [item['high_risk_count'] for item in trend_data]
                        
                        fig = go.Figure()
                        fig.add_trace(go.Scatter(
                            x=dates, y=avg_risk,
                            name='Average Risk',
                            mode='lines+markers',
                            line=dict(color='#3B82F6', width=2)
                        ))
                        fig.add_trace(go.Bar(
                            x=dates, y=high_risk_count,
                            name='High Risk Count',
                            marker_color='#DC2626',
                            yaxis='y2'
                        ))
                        
                        fig.update_layout(
                            height=400,
                            hovermode='x unified',
                            yaxis=dict(title='Average Risk Score'),
                            yaxis2=dict(title='High Risk Batches', overlaying='y', side='right'),
                            xaxis=dict(title='Date'),
                            legend=dict(orientation='h', yanchor='bottom', y=1.02)
                        )
                        st.plotly_chart(fig, use_container_width=True)
                    else:
                        st.info("No trend data available")
                else:
                    st.warning("Unable to fetch trend data")
            except Exception as e:
                st.error(f"Error loading trend data: {str(e)}")
            
            # Model Performance Summary
            st.markdown("---")
            st.subheader("🤖 Model Performance")
            
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Accuracy", "76.8%")
            with col2:
                st.metric("F1-Score", "79.7%")
            with col3:
                st.metric("ROC-AUC", "94.1%")
            with col4:
                st.metric("Recall", "99.9%")
            
            st.info("💡 **Model**: Random Forest Classifier | **Features**: 20 | **Training Size**: 16,605 samples")
            
        else:
            st.error(f"API Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        st.error("⚠️ Unable to connect to backend API")
        st.info("Please ensure the backend server is running on http://localhost:8000")
        st.code(f"Error: {str(e)}", language="text")
    
    # Footer
    st.markdown("---")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
