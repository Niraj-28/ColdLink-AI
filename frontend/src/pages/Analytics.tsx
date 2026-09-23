import { useEffect, useState } from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { ModelMetrics, FeatureImportance } from '../types';

const Analytics = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [metricsData, importanceData] = await Promise.all([
        apiService.getModelMetrics(),
        apiService.getFeatureImportance(15),
      ]);
      setMetrics(metricsData);
      setFeatureImportance(importanceData);
    } catch (err) {
      setError('Failed to load analytics data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!metrics || !featureImportance) return null;

  // Prepare model comparison data
  const modelComparison = Object.entries(metrics.all_models || {}).map(([name, data]: [string, any]) => ({
    model: name.replace(/_/g, ' '),
    accuracy: (data.accuracy * 100).toFixed(1),
    precision: (data.precision * 100).toFixed(1),
    recall: (data.recall * 100).toFixed(1),
    f1: (data.f1_score * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Model Analytics</h2>
        <p className="text-gray-600 mt-1">Performance metrics and feature importance analysis</p>
      </div>

      {/* Model Performance Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Best Model Performance</h3>
            <p className="text-sm text-gray-600 mt-1">
              Model: <span className="font-medium text-primary-600">{metrics.best_model}</span>
            </p>
          </div>
          <Award className="h-10 w-10 text-yellow-500" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {(metrics.metrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {(metrics.metrics.precision * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Precision</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {(metrics.metrics.recall * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Recall</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">
              {(metrics.metrics.f1_score * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">F1-Score</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600">
              {(metrics.metrics.roc_auc * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">ROC-AUC</div>
          </div>
        </div>
      </div>

      {/* Training Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary-600" />
          Training Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Training Date</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {new Date(metrics.training_info.training_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Training Set</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {metrics.training_info.train_size.toLocaleString()} samples
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Validation Set</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {metrics.training_info.val_size.toLocaleString()} samples
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Test Set</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {metrics.training_info.test_size.toLocaleString()} samples
            </p>
          </div>
        </div>
      </div>

      {/* Model Comparison */}
      {modelComparison.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" angle={-20} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy %" />
              <Bar dataKey="precision" fill="#10b981" name="Precision %" />
              <Bar dataKey="recall" fill="#8b5cf6" name="Recall %" />
              <Bar dataKey="f1" fill="#f59e0b" name="F1-Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Feature Importance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
          Top Feature Importance (SHAP)
        </h3>
        <div className="space-y-3">
          {featureImportance.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm font-medium text-gray-600">{index + 1}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {feature.feature.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    {feature.importance.toFixed(4)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${(feature.importance / featureImportance.features[0].importance) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>
              The {metrics.best_model} model achieves {(metrics.metrics.f1_score * 100).toFixed(1)}% F1-Score,
              indicating excellent balance between precision and recall.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>
              ROC-AUC of {(metrics.metrics.roc_auc * 100).toFixed(1)}% demonstrates strong discriminative ability
              between risk classes.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>
              Temperature-related features dominate the top importance rankings, confirming their critical role
              in cold chain failure prediction.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>
              Model trained on {(metrics.training_info.train_size + metrics.training_info.val_size + 
              metrics.training_info.test_size).toLocaleString()} total samples with {metrics.training_info.num_features} engineered features.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
