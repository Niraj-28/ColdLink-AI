import React, { useState } from 'react';
import { api } from '../utils/api';
import { getRiskColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';

const Prediction = () => {
  const [formData, setFormData] = useState({
    thermal_shipper_temp_reading: 5.0,
    room_temp_reading: 22.0,
    room_humidity_reading: 45.0,
    item_expiry_hours: 120,
    ultra_low_temperature_freezer_hours: 0,
    out_of_bound_temperature_hours: 0,
    refrigeration_temperature_hours: 24,
    location: 'Warehouse A',
    current_hop: 'Distribution Center',
    external_storage: 'Cold Room',
    hour: 12,
    day_of_week: 0
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
      
      const response = await api.post('/api/predict', formData);
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
      thermal_shipper_temp_reading: 5.0,
      room_temp_reading: 22.0,
      room_humidity_reading: 45.0,
      item_expiry_hours: 120,
      ultra_low_temperature_freezer_hours: 0,
      out_of_bound_temperature_hours: 0,
      refrigeration_temperature_hours: 24,
      location: 'Warehouse A',
      current_hop: 'Distribution Center',
      external_storage: 'Cold Room',
      hour: 12,
      day_of_week: 0
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
                    Thermal Shipper Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="thermal_shipper_temp_reading"
                    value={formData.thermal_shipper_temp_reading}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 2-8°C for most vaccines</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="room_temp_reading"
                    value={formData.room_temp_reading}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="room_humidity_reading"
                    value={formData.room_humidity_reading}
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

            {/* Time/Storage Information */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Storage & Time Information</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Until Expiry
                  </label>
                  <input
                    type="number"
                    name="item_expiry_hours"
                    value={formData.item_expiry_hours}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours until vaccine expires</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ultra-Low Freezer Hours
                  </label>
                  <input
                    type="number"
                    name="ultra_low_temperature_freezer_hours"
                    value={formData.ultra_low_temperature_freezer_hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time in ultra-low temperature storage</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refrigeration Hours
                  </label>
                  <input
                    type="number"
                    name="refrigeration_temperature_hours"
                    value={formData.refrigeration_temperature_hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time in standard refrigeration (2-8°C)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Out of Bounds Hours
                  </label>
                  <input
                    type="number"
                    name="out_of_bound_temperature_hours"
                    value={formData.out_of_bound_temperature_hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time outside recommended temperature range</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Location Information</h4>
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
                    <option value="Regional Center">Regional Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Hop
                  </label>
                  <select
                    name="current_hop"
                    value={formData.current_hop}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Distribution Center">Distribution Center</option>
                    <option value="Regional Warehouse">Regional Warehouse</option>
                    <option value="Transit Hub">Transit Hub</option>
                    <option value="Final Destination">Final Destination</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External Storage Type
                  </label>
                  <select
                    name="external_storage"
                    value={formData.external_storage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cold Room">Cold Room</option>
                    <option value="Freezer">Freezer</option>
                    <option value="Refrigerated Container">Refrigerated Container</option>
                    <option value="Thermal Shipper">Thermal Shipper</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Time Context (Optional) */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Time Context (Optional)</h4>
              <div className="grid grid-cols-2 gap-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hour of Day (0-23)
                  </label>
                  <input
                    type="number"
                    name="hour"
                    value={formData.hour}
                    onChange={handleInputChange}
                    min="0"
                    max="23"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day of Week (0=Mon)
                  </label>
                  <select
                    name="day_of_week"
                    value={formData.day_of_week}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">Monday</option>
                    <option value="1">Tuesday</option>
                    <option value="2">Wednesday</option>
                    <option value="3">Thursday</option>
                    <option value="4">Friday</option>
                    <option value="5">Saturday</option>
                    <option value="6">Sunday</option>
                  </select>
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
                <div className={`text-5xl font-bold mb-3 ${getRiskColor(prediction.risk_probability || 0)}`}>
                  {((prediction.risk_probability || 0) * 100).toFixed(1)}%
                </div>
                <RiskBadge level={prediction.risk_level || getRiskLevel(prediction.risk_probability || 0)} />
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
                  <div className="text-xs text-gray-600">Risk Category</div>
                  <div className="text-lg font-semibold">
                    {prediction.risk_category || prediction.risk_level || getRiskLevel(prediction.risk_probability || 0)}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              {prediction.recommendation && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Recommendation</h4>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-gray-700">{prediction.recommendation}</div>
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
                          factor.contribution > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {factor.contribution > 0 ? '+' : ''}{(factor.contribution).toFixed(3)}
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
                  <span className="font-medium">Random Forest Classifier</span>
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
