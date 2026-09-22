import React, { useState } from 'react';
import { api } from '../utils/api';
import { getRiskColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';

const Prediction = () => {
  const [formData, setFormData] = useState({
    temperature: 5.0,
    humidity: 60.0,
    location: 'Warehouse A',
    transport_mode: 'Air',
    vaccine_type: 'Type A',
    quantity: 1000,
    hours_in_transit: 12,
    external_temperature: 25.0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate prediction');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      temperature: 5.0,
      humidity: 60.0,
      location: 'Warehouse A',
      transport_mode: 'Air',
      vaccine_type: 'Type A',
      quantity: 1000,
      hours_in_transit: 12,
      external_temperature: 25.0
    });
    setPrediction(null);
    setError(null);
  };

  const getRiskLevel = (score) => {
    if (score >= 0.7) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Risk Prediction</h2>
        <p className="text-gray-600">Enter shipment details to predict failure risk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Temperature Conditions */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Temperature Conditions</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 2-8°C for most vaccines</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="external_temperature"
                    value={formData.external_temperature}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Information */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Shipment Information</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Warehouse A">Warehouse A</option>
                    <option value="Warehouse B">Warehouse B</option>
                    <option value="Distribution Center">Distribution Center</option>
                    <option value="Transit Hub">Transit Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Mode
                  </label>
                  <select
                    name="transport_mode"
                    value={formData.transport_mode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Air">Air</option>
                    <option value="Road">Road</option>
                    <option value="Sea">Sea</option>
                    <option value="Rail">Rail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours in Transit
                  </label>
                  <input
                    type="number"
                    name="hours_in_transit"
                    value={formData.hours_in_transit}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Vaccine Details */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Vaccine Details</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccine Type
                  </label>
                  <select
                    name="vaccine_type"
                    value={formData.vaccine_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Type A">Type A</option>
                    <option value="Type B">Type B</option>
                    <option value="Type C">Type C</option>
                    <option value="mRNA">mRNA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (units)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? 'Predicting...' : 'Predict Risk'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Prediction Results */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Prediction Results</h3>

          {loading ? (
            <LoadingSpinner />
          ) : prediction ? (
            <div className="space-y-6">
              {/* Risk Score */}
              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2">
                <div className="text-sm text-gray-600 mb-2">Failure Risk Probability</div>
                <div className={`text-5xl font-bold mb-3 ${getRiskColor(prediction.risk_score)}`}>
                  {(prediction.risk_score * 100).toFixed(1)}%
                </div>
                <RiskBadge level={getRiskLevel(prediction.risk_score)} />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">Model Confidence</div>
                  <div className="text-lg font-semibold">
                    {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">Risk Level</div>
                  <div className="text-lg font-semibold">
                    {getRiskLevel(prediction.risk_score)}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Recommendations</h4>
                  <div className="space-y-2">
                    {prediction.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="text-sm text-gray-700 flex-1">{rec}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Risk Factors */}
              {prediction.top_risk_factors && prediction.top_risk_factors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Top Risk Factors</h4>
                  <div className="space-y-2">
                    {prediction.top_risk_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{factor.feature}</span>
                        <span className={`text-sm font-semibold ${
                          factor.impact > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Info */}
              <div className="pt-4 border-t text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-medium">{prediction.model || 'Random Forest'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Fill out the form and click "Predict Risk" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
