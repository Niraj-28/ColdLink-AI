import { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface FeatureImportance {
  feature: string;
  importance: number;
}

interface SHAPSummary {
  num_features: number;
  top_positive_features: Array<{ feature: string; mean_shap: number }>;
  top_negative_features: Array<{ feature: string; mean_shap: number }>;
}

const AIInsights = () => {
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [shapSummary, setSHAPSummary] = useState<SHAPSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const [features, shap] = await Promise.all([
        apiService.getFeatureImportance(15),
        apiService.getSHAPSummary(),
      ]);
      setFeatureImportance(features);
      setSHAPSummary(shap);
    } catch (err) {
      setError('Failed to load AI insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Generating AI insights..." />;
  if (error) return <ErrorMessage message={error} />;

  const formatFeatureName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Brain className="h-7 w-7 mr-2 text-primary-600" />
          AI Insights & Explainability
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Understanding how our AI makes predictions using SHAP analysis and feature importance
        </p>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">Features Analyzed</h4>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {shapSummary?.num_features || featureImportance.length}+
              </p>
              <p className="text-xs text-blue-700 mt-1">Variables considered in predictions</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 text-sm">Risk Drivers</h4>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {shapSummary?.top_positive_features.length || 5}
              </p>
              <p className="text-xs text-green-700 mt-1">Key factors that increase risk</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 text-sm">Protective Factors</h4>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {shapSummary?.top_negative_features.length || 5}
              </p>
              <p className="text-xs text-purple-700 mt-1">Factors that reduce risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
          Top 15 Most Important Features
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Features ranked by their influence on model predictions (Random Forest importance scores)
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={featureImportance} layout="vertical" margin={{ left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'auto']} />
            <YAxis dataKey="feature" type="category" fontSize={12} 
              tickFormatter={formatFeatureName} width={140} />
            <Tooltip 
              formatter={(value: any) => [(value * 100).toFixed(2) + '%', 'Importance']}
              labelFormatter={formatFeatureName}
            />
            <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
              {featureImportance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 10}, 70%, 50%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SHAP Analysis */}
      {shapSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Increasing Factors */}
          <div className="card border-red-200 bg-gradient-to-br from-white to-red-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Top Risk-Increasing Factors
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Features that, when present, increase the probability of cold chain failure
            </p>
            <div className="space-y-3">
              {shapSummary.top_positive_features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatFeatureName(feature.feature)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    +{feature.mean_shap.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Decreasing Factors */}
          <div className="card border-green-200 bg-gradient-to-br from-white to-green-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top Risk-Decreasing Factors
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Features that, when present, decrease the probability of cold chain failure
            </p>
            <div className="space-y-3">
              {shapSummary.top_negative_features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatFeatureName(feature.feature)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {feature.mean_shap.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explainability Information */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600" />
          About SHAP (SHapley Additive exPlanations)
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>SHAP values</strong> provide a unified measure of feature importance that explains 
            individual predictions by showing how much each feature contributed to the prediction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">✅ What SHAP Tells Us:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Which features matter most for each prediction</li>
                <li>Direction of impact (increase or decrease risk)</li>
                <li>Magnitude of each feature's contribution</li>
                <li>How features interact with each other</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">📊 How to Interpret:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Positive values:</strong> Increase predicted risk</li>
                <li><strong>Negative values:</strong> Decrease predicted risk</li>
                <li><strong>Larger magnitude:</strong> Stronger influence</li>
                <li><strong>Zero or small:</strong> Minimal impact on prediction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="card bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
          Actionable Insights for Operators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">🎯 Focus Areas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Monitor temperature deviations closely</li>
              <li>Track time until expiry for batches</li>
              <li>Optimize storage duration patterns</li>
              <li>Review high-risk location patterns</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">⚡ Best Practices:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Maintain consistent temperature control</li>
              <li>Minimize out-of-bound exposure time</li>
              <li>Prioritize batches near expiry</li>
              <li>Use proper storage equipment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
