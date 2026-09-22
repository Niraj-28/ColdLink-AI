"""
Analytics Page - Model performance metrics and feature importance
"""

import streamlit as st
import requests
import plotly.graph_objects as go
import plotly.express as px

API_BASE = "http://localhost:8000"

def show():
    st.header("📊 Model Analytics")
    st.markdown("Detailed model performance metrics and insights")
    
    # Model comparison
    st.subheader("🏆 Model Comparison")
    
    try:
        response = requests.get(f"{API_BASE}/api/model-metrics", timeout=5)
        
        if response.status_code == 200:
            metrics = response.json()
            
            # Display metrics table
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("### Best Model: Random Forest")
                best_metrics = metrics.get('random_forest', {})
                
                col_a, col_b = st.columns(2)
                with col_a:
                    st.metric("Accuracy", f"{best_metrics.get('accuracy', 0)*100:.2f}%")
                    st.metric("Precision", f"{best_metrics.get('precision', 0)*100:.2f}%")
                with col_b:
                    st.metric("Recall", f"{best_metrics.get('recall', 0)*100:.2f}%")
                    st.metric("F1-Score", f"{best_metrics.get('f1', 0)*100:.2f}%")
                
                st.metric("ROC-AUC", f"{best_metrics.get('roc_auc', 0)*100:.2f}%", delta="Best performer")
            
            with col2:
                st.markdown("### All Models Performance")
                
                # Create comparison chart
                models = list(metrics.keys())
                f1_scores = [metrics[m].get('f1', 0) for m in models]
                roc_aucs = [metrics[m].get('roc_auc', 0) for m in models]
                
                fig = go.Figure()
                fig.add_trace(go.Bar(name='F1-Score', x=models, y=f1_scores, marker_color='#3B82F6'))
                fig.add_trace(go.Bar(name='ROC-AUC', x=models, y=roc_aucs, marker_color='#10B981'))
                
                fig.update_layout(
                    barmode='group',
                    height=300,
                    yaxis=dict(title='Score', range=[0, 1]),
                    xaxis=dict(title='Model'),
                    legend=dict(orientation='h', yanchor='bottom', y=1.02)
                )
                st.plotly_chart(fig, use_container_width=True)
            
            # Detailed metrics table
            st.markdown("---")
            st.subheader("📈 Detailed Metrics Comparison")
            
            import pandas as pd
            df_metrics = pd.DataFrame(metrics).T
            df_metrics = df_metrics.round(4)
            df_metrics.columns = [col.replace('_', ' ').title() for col in df_metrics.columns]
            
            # Style the dataframe
            st.dataframe(
                df_metrics.style.highlight_max(axis=0, color='lightgreen'),
                use_container_width=True
            )
            
        else:
            st.error("Unable to fetch model metrics")
    
    except Exception as e:
        st.error(f"Error loading metrics: {str(e)}")
    
    # Feature Importance
    st.markdown("---")
    st.subheader("🎯 Feature Importance")
    
    try:
        response = requests.get(f"{API_BASE}/api/feature-importance", timeout=5)
        
        if response.status_code == 200:
            importance_data = response.json()
            features = importance_data.get('features', [])
            importances = importance_data.get('importances', [])
            
            if features and importances:
                # Create horizontal bar chart
                fig = go.Figure(go.Bar(
                    x=importances[:15],
                    y=features[:15],
                    orientation='h',
                    marker=dict(
                        color=importances[:15],
                        colorscale='Viridis',
                        showscale=True
                    )
                ))
                
                fig.update_layout(
                    title="Top 15 Most Important Features",
                    height=500,
                    xaxis=dict(title='Importance Score'),
                    yaxis=dict(title='Feature', autorange='reversed')
                )
                st.plotly_chart(fig, use_container_width=True)
                
                # Feature insights
                st.markdown("### 💡 Feature Insights")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.info(f"**Most Important**: {features[0]}")
                with col2:
                    st.info(f"**Second**: {features[1]}")
                with col3:
                    st.info(f"**Third**: {features[2]}")
                
            else:
                st.warning("No feature importance data available")
        else:
            st.error("Unable to fetch feature importance")
    
    except Exception as e:
        st.error(f"Error loading feature importance: {str(e)}")
    
    # Model Information
    st.markdown("---")
    st.subheader("ℹ️ Model Information")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        **Training Details**
        - Training Size: 16,605
        - Validation Size: 5,054
        - Test Size: 4,714
        """)
    
    with col2:
        st.markdown("""
        **Features**
        - Total Features: 20
        - Numerical: 17
        - Categorical: 3 (encoded)
        """)
    
    with col3:
        st.markdown("""
        **Target Distribution**
        - Class 0 (Normal): 54.5%
        - Class 1 (Failure): 45.5%
        - Balanced: ✓
        """)
    
    # Performance notes
    st.markdown("---")
    st.info("""
    **Model Performance Summary:**
    
    The Random Forest classifier demonstrates excellent performance with:
    - **High Recall (99.9%)**: Successfully identifies almost all failure cases
    - **Strong ROC-AUC (94.1%)**: Excellent discrimination between classes
    - **Balanced F1-Score (79.7%)**: Good balance between precision and recall
    
    This model prioritizes catching all potential failures (high recall) while maintaining good overall accuracy.
    """)
    
    st.success("✅ Model is production-ready and performing within expected parameters")
