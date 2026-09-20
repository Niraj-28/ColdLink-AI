import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const apiService = {
  // Health check
  health: () => api.get('/api/health'),
  
  // Statistics
  getStatistics: () => api.get('/api/statistics'),
  
  // Batches
  getBatches: (params = {}) => api.get('/api/batches', { params }),
  getBatchDetails: (batchId) => api.get(`/api/batches/${batchId}`),
  
  // Risk analytics
  getRiskSummary: () => api.get('/api/risk-summary'),
  getRiskTrend: () => api.get('/api/risk-trend'),
  
  // Model performance
  getModelMetrics: () => api.get('/api/model-metrics'),
  getFeatureImportance: (topN = 20) => api.get('/api/feature-importance', { params: { top_n: topN } }),
  getShapSummary: () => api.get('/api/shap-summary'),
  
  // Predictions
  predict: (data) => api.post('/api/predict', data),
  explain: (data) => api.post('/api/explain', data),
  getRecommendation: (batchId) => api.get(`/api/recommendation/${batchId}`),
};

export default api;
