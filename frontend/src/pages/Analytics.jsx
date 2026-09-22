import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [riskTrend, setRiskTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('performance');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [metricsRes, featuresRes, trendRes] = await Promise.all([
        api.get('/api/model-metrics'),
        api.get('/api/feature-importance'),
        api.get('/api/risk-trend')
      ]);

      setMetrics(metricsRes.data);
      setFeatureImportance(featuresRes.data);
      setRiskTrend(trendRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAnalytics} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Model Performance</h2>
          <p className="text-gray-600">Comprehensive insights and model evaluation metrics</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'performance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Model Performance
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'features'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Feature Importance
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'trends'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Risk Trends
          </button>
        </div>
      </div>

      {/* Model Performance Tab */}
      {activeTab === 'performance' && metrics && (
        <div className="space-y-6">
          {/* Model Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Current Model</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Model Type</div>
                <div className="text-lg font-semibold">{metrics.model_name || 'Random Forest'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Training Date</div>
                <div className="text-lg font-semibold">
                  {metrics.training_date ? new Date(metrics.training_date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Training Samples</div>
                <div className="text-lg font-semibold">{metrics.training_samples?.toLocaleString() || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Features Used</div>
                <div className="text-lg font-semibold">{metrics.n_features || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Precision</div>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.precision ? `${(metrics.precision * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Recall</div>
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.recall ? `${(metrics.recall * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">F1 Score</div>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.f1_score ? `${(metrics.f1_score * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Metrics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Advanced Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">ROC-AUC</div>
                <div className="text-xl font-bold">
                  {metrics.roc_auc ? `${(metrics.roc_auc * 100).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Area Under ROC Curve</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">PR-AUC</div>
                <div className="text-xl font-bold">
                  {metrics.pr_auc ? `${(metrics.pr_auc * 100).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Precision-Recall AUC</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Log Loss</div>
                <div className="text-xl font-bold">
                  {metrics.log_loss ? metrics.log_loss.toFixed(4) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Lower is better</div>
              </div>
            </div>
          </div>

          {/* Class-wise Performance */}
          {metrics.class_report && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Class-wise Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Class</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Precision</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Recall</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">F1-Score</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(metrics.class_report)
                      .filter(([key]) => !['accuracy', 'macro avg', 'weighted avg'].includes(key))
                      .map(([className, values]) => (
                        <tr key={className} className="border-b">
                          <td className="py-2 px-4 text-sm font-medium">
                            {className === '0' ? 'No Failure' : 'Failure'}
                          </td>
                          <td className="py-2 px-4 text-sm">{(values.precision * 100).toFixed(1)}%</td>
                          <td className="py-2 px-4 text-sm">{(values.recall * 100).toFixed(1)}%</td>
                          <td className="py-2 px-4 text-sm">{(values['f1-score'] * 100).toFixed(1)}%</td>
                          <td className="py-2 px-4 text-sm">{values.support}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Importance Tab */}
      {activeTab === 'features' && featureImportance && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Top Features by Importance</h3>
            <p className="text-sm text-gray-600 mb-6">
              Features ranked by their contribution to model predictions
            </p>
            <div className="space-y-3">
              {featureImportance.features?.slice(0, 15).map((feature, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{feature.feature}</span>
                    <span className="text-gray-600">
                      {(feature.importance * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(feature.importance / (featureImportance.features[0]?.importance || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Feature Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Features</div>
                <div className="text-2xl font-bold">{featureImportance.features?.length || 0}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Top Feature</div>
                <div className="text-lg font-bold truncate">
                  {featureImportance.features?.[0]?.feature || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Top Importance</div>
                <div className="text-2xl font-bold">
                  {featureImportance.features?.[0]
                    ? `${(featureImportance.features[0].importance * 100).toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Trends Tab */}
      {activeTab === 'trends' && riskTrend && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Risk Distribution Over Time</h3>
            <div className="space-y-4">
              {riskTrend.trend?.map((period, idx) => (
                <div key={idx} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="font-medium mb-2">{period.date || period.period}</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-xs text-gray-600">High Risk</div>
                      <div className="text-xl font-bold text-red-600">{period.high || 0}</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-xs text-gray-600">Medium Risk</div>
                      <div className="text-xl font-bold text-yellow-600">{period.medium || 0}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xs text-gray-600">Low Risk</div>
                      <div className="text-xl font-bold text-green-600">{period.low || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Overall Risk Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Total Observations</div>
                <div className="text-2xl font-bold">
                  {riskTrend.total_observations?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">High Risk %</div>
                <div className="text-2xl font-bold text-red-600">
                  {riskTrend.high_risk_percentage
                    ? `${riskTrend.high_risk_percentage.toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Medium Risk %</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {riskTrend.medium_risk_percentage
                    ? `${riskTrend.medium_risk_percentage.toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Low Risk %</div>
                <div className="text-2xl font-bold text-green-600">
                  {riskTrend.low_risk_percentage
                    ? `${riskTrend.low_risk_percentage.toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
