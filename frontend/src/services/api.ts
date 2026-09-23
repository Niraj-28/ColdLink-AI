import axios from 'axios';
import type {
  Statistics,
  Batch,
  BatchDetails,
  PredictionRequest,
  PredictionResponse,
  ModelMetrics,
  FeatureImportance,
  RiskSummary,
  RiskTrend,
} from '../types';

// Use relative URL since Vite proxy will forward to backend
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health & Info
  async healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
  },

  async getStatistics(): Promise<Statistics> {
    const response = await api.get('/api/statistics');
    return response.data;
  },

  // Batch Management
  async getBatches(params?: {
    limit?: number;
    offset?: number;
    risk_level?: string;
    location?: string;
  }): Promise<{ total: number; batches: Batch[] }> {
    const response = await api.get('/api/batches', { params });
    return response.data;
  },

  async getBatchDetails(batchId: string): Promise<BatchDetails> {
    const response = await api.get(`/api/batches/${batchId}`);
    return response.data;
  },

  // Risk Analytics
  async getRiskSummary(): Promise<RiskSummary> {
    const response = await api.get('/api/risk-summary');
    return response.data;
  },

  async getRiskTrend(): Promise<RiskTrend> {
    const response = await api.get('/api/risk-trend');
    return response.data;
  },

  // Model Performance
  async getModelMetrics(): Promise<ModelMetrics> {
    const response = await api.get('/api/model-metrics');
    return response.data;
  },

  async getFeatureImportance(topN: number = 20): Promise<FeatureImportance> {
    const response = await api.get('/api/feature-importance', {
      params: { top_n: topN },
    });
    return response.data;
  },

  async getShapSummary() {
    const response = await api.get('/api/shap-summary');
    return response.data;
  },

  // Predictions
  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    const response = await api.post('/api/predict', data);
    return response.data;
  },

  async explain(data: PredictionRequest) {
    const response = await api.post('/api/explain', data);
    return response.data;
  },

  async getRecommendation(batchId: string) {
    const response = await api.get(`/api/recommendation/${batchId}`);
    return response.data;
  },
};
