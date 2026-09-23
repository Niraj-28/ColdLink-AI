import { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';
import { getRiskBadgeClass, formatPercentage } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import type { PredictionRequest, PredictionResponse } from '../types';

const Prediction = () => {
  const [formData, setFormData] = useState<PredictionRequest>({
    thermal_shipper_temp_reading: 5.0,
    room_temp_reading: 22.0,
    room_humidity_reading: 55.0,
    item_expiry_hours: 48.0,
    ultra_low_temperature_freezer_hours: 0.0,
    out_of_bound_temperature_hours: 0.0,
    refrigeration_temperature_hours: 24.0,
    location: 'Mumbai',
    current_hop: 'dest_vaccine_storage_unit',
    external_storage: 'vaccine_storage_unit',
    hour: 12,
    day_of_week: 2,
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi'
  ];

  const hops = [
    'source_vaccine_storage_unit',
    'origin_cold_storage',
    'in_transit',
    'dest_cold_storage',
    'dest_vaccine_storage_unit'
  ];

  const storageTypes = [
    'vaccine_storage_unit',
    'cold_storage',
    'ultra_low_freezer',
    'refrigerator',
    'thermal_shipper',
    'ambient'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await apiService.predict(formData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      thermal_shipper_temp_reading: 5.0,
      room_temp_reading: 22.0,
      room_humidity_reading: 55.0,
      item_expiry_hours: 48.0,
      ultra_low_temperature_freezer_hours: 0.0,
      out_of_bound_temperature_hours: 0.0,
      refrigeration_temperature_hours: 24.0,
      location: 'Mumbai',
      current_hop: 'dest_vaccine_storage_unit',
      external_storage: 'vaccine_storage_unit',
      hour: 12,
      day_of_week: 2,
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Risk Prediction</h2>
        <p className="text-sm text-gray-600 mt-1">Predict cold chain failure risk using AI models with SHAP explainability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
              <Activity className="h-5 w-5 mr-2 text-primary-600" />
              Batch Information Input
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Temperature Readings */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2">Temperature Readings</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Shipper Temperature (°C) *
                    </label>
                    <input
                      type="number"
                      name="thermal_shipper_temp_reading"
                      step="0.1"
                      value={formData.thermal_shipper_temp_reading}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Range: 2-8°C</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Room Temperature (°C) *
                    </label>
                    <input
                      type="number"
                      name="room_temp_reading"
                      step="0.1"
                      value={formData.room_temp_reading}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical: 18-25°C</p>
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2 mb-3">Environmental Conditions</p>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Room Humidity (%) *
                </label>
                <input
                  type="number"
                  name="room_humidity_reading"
                  step="0.1"
                  value={formData.room_humidity_reading}
                  onChange={handleInputChange}
                  className="input-field text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ideal: 30-60%</p>
              </div>

              {/* Expiry Hours */}
              <div>
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2 mb-3">Expiry Information</p>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Hours Until Expiry *
                </label>
                <input
                  type="number"
                  name="item_expiry_hours"
                  step="0.1"
                  value={formData.item_expiry_hours}
                  onChange={handleInputChange}
                  className="input-field text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Remaining shelf life in hours</p>
              </div>

              {/* Storage Hours */}
              <div>
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2 mb-3">Storage Duration</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Ultra-Low Hours
                    </label>
                    <input
                      type="number"
                      name="ultra_low_temperature_freezer_hours"
                      step="0.1"
                      value={formData.ultra_low_temperature_freezer_hours}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      OOB Hours
                    </label>
                    <input
                      type="number"
                      name="out_of_bound_temperature_hours"
                      step="0.1"
                      value={formData.out_of_bound_temperature_hours}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Refrigeration Hours
                    </label>
                    <input
                      type="number"
                      name="refrigeration_temperature_hours"
                      step="0.1"
                      value={formData.refrigeration_temperature_hours}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location and Logistics */}
              <div>
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2 mb-3">Location & Supply Chain</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Location *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Current Supply Chain Hop *
                    </label>
                    <select
                      name="current_hop"
                      value={formData.current_hop}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    >
                      {hops.map(hop => (
                        <option key={hop} value={hop}>{hop.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Storage Type *
                    </label>
                    <select
                      name="external_storage"
                      value={formData.external_storage}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      required
                    >
                      {storageTypes.map(storage => (
                        <option key={storage} value={storage}>{storage.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Time Features */}
              <div>
                <p className="text-sm font-semibold text-gray-700 border-l-4 border-primary-500 pl-2 mb-3">Time Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Hour of Day (0-23)
                    </label>
                    <input
                      type="number"
                      name="hour"
                      min="0"
                      max="23"
                      value={formData.hour}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Day of Week (0=Mon, 6=Sun)
                    </label>
                    <input
                      type="number"
                      name="day_of_week"
                      min="0"
                      max="6"
                      value={formData.day_of_week}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5"
                >
                  {loading ? 'Analyzing...' : 'Predict Risk'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary text-sm py-2.5 px-6"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="card">
              <LoadingSpinner message="Analyzing batch data..." />
            </div>
          )}

          {error && (
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm">Prediction Failed</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {prediction && (
            <>
              {/* Risk Assessment */}
              <div className="card bg-gradient-to-br from-white to-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">Risk Assessment Results</h3>
                
                <div className="text-center py-4 mb-4">
                  <span className={`${getRiskBadgeClass(prediction.risk_level)} text-base px-5 py-2`}>
                    {prediction.risk_level}
                  </span>
                  <div className="mt-6 mb-3">
                    <div className="text-5xl font-bold text-gray-900">
                      {formatPercentage(prediction.risk_probability)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Risk Probability</p>
                  </div>
                  <div className="mt-4 inline-flex items-center space-x-4 bg-blue-50 px-6 py-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-primary-600">
                        {formatPercentage(prediction.confidence)}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 flex items-center mb-3 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {prediction.recommendation.split(' | ').map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-blue-900">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2.5 flex-shrink-0"></span>
                        <span className="leading-relaxed">{rec.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Risk Factors */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-3">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                  Top Risk Factors (SHAP Analysis)
                </h3>
                <div className="space-y-3">
                  {prediction.top_risk_factors.slice(0, 8).map((factor, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            {index + 1}. {factor.feature.replace(/_/g, ' ').charAt(0).toUpperCase() + factor.feature.replace(/_/g, ' ').slice(1)}
                          </span>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-600">Value: <strong>{factor.value.toFixed(2)}</strong></span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className={`text-xs font-semibold ${
                              factor.contribution > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              Impact: {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            factor.contribution > 0 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(Math.abs(factor.contribution) * 1000, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 italic border-t pt-3">
                  * Positive values increase risk, negative values decrease risk
                </p>
              </div>
            </>
          )}

          {!loading && !error && !prediction && (
            <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-white">
              <Activity className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Ready to Predict</h3>
              <p className="text-gray-600 mt-2 text-sm">Fill in the batch information and click "Predict Risk"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
