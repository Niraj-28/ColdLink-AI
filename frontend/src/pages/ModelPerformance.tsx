import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Award, TrendingUp, Target, Activity, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatsCard from '../components/StatsCard';

interface ModelMetricsResponse {
  best_model: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  all_models: {
    [key: string]: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      roc_auc: number;
    };
  };
  training_info?: {
    training_date: string;
    train_size: number;
    val_size: number;
    test_size: number;
    num_features: number;
  };
}

const ModelPerformance = () => {
  const [metricsData, setMetricsData] = useState<ModelMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getModelMetrics();
      setMetricsData(data);
    } catch (err) {
      setError('Failed to load model metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading model performance metrics..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!metricsData) return null;

  const { metrics, all_models, best_model } = metricsData;

  // Prepare comparison data for bar chart
  const comparisonData = Object.entries(all_models).map(([model, data]) => ({
    model: model.replace(/_/g, ' ').toUpperCase(),
    accuracy: (data.accuracy * 100).toFixed(1),
    precision: (data.precision * 100).toFixed(1),
    recall: (data.recall * 100).toFixed(1),
    f1_score: (data.f1_score * 100).toFixed(1),
    roc_auc: (data.roc_auc * 100).toFixed(1),
  }));

  // Prepare radar chart data for best model
  const radarData = [
    { metric: 'Accuracy', value: metrics.accuracy * 100 },
    { metric: 'Precision', value: metrics.precision * 100 },
    { metric: 'Recall', value: metrics.recall * 100 },
    { metric: 'F1-Score', value: metrics.f1_score * 100 },
    { metric: 'ROC-AUC', value: metrics.roc_auc * 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Model Performance</h2>
        <p className="text-sm text-gray-600 mt-1">Comprehensive evaluation and comparison of trained models</p>
      </div>

      {/* Best Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Accuracy"
          value={`${(metrics.accuracy * 100).toFixed(1)}%`}
          icon={Target}
          color="primary"
        />
        <StatsCard
          title="Precision"
          value={`${(metrics.precision * 100).toFixed(1)}%`}
          icon={Award}
          color="success"
        />
        <StatsCard
          title="Recall"
          value={`${(metrics.recall * 100).toFixed(1)}%`}
          icon={Activity}
          color="warning"
        />
        <StatsCard
          title="F1-Score"
          value={`${(metrics.f1_score * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="primary"
        />
        <StatsCard
          title="ROC-AUC"
          value={`${(metrics.roc_auc * 100).toFixed(1)}%`}
          icon={AlertCircle}
          color="success"
        />
      </div>
        />
        <StatsCard
          title="ROC-AUC"
          value={`${(bestModel.roc_auc * 100).toFixed(1)}%`}
          icon={AlertCircle}
          color="success"
        />
      </div>

      {/* Model Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Comparison */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison - All Metrics</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" angle={-45} textAnchor="end" height={100} fontSize={11} />
              <YAxis domain={[0, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
              <Bar dataKey="precision" fill="#10b981" name="Precision" />
              <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
              <Bar dataKey="f1_score" fill="#8b5cf6" name="F1-Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart - Best Model */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Best Model Performance Profile
            <span className="ml-2 text-sm font-normal text-primary-600">
              ({best_model})
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precision
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recall
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  F1-Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROC-AUC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(all_models).map(([model, data], index) => (
                <tr key={model} className={index === 0 ? 'bg-primary-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {model.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                          Best
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.accuracy * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.precision * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.recall * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.f1_score * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.roc_auc * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric Explanations */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding the Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Accuracy</h4>
              <p className="text-xs text-gray-600">Overall correctness: (TP+TN) / Total predictions</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Precision</h4>
              <p className="text-xs text-gray-600">Accuracy of positive predictions: TP / (TP+FP)</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Recall (Sensitivity)</h4>
              <p className="text-xs text-gray-600">Coverage of actual positives: TP / (TP+FN)</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-gray-900">F1-Score</h4>
              <p className="text-xs text-gray-600">Harmonic mean of Precision and Recall</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">ROC-AUC</h4>
              <p className="text-xs text-gray-600">Area under ROC curve, measures discrimination ability</p>
            </div>
            <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
              TP=True Positive, TN=True Negative, FP=False Positive, FN=False Negative
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
