import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { formatDate, getRiskColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RiskBadge from '../components/RiskBadge';

const BatchAnalysis = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDetails, setBatchDetails] = useState(null);
  const [shapValues, setShapValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/batches');
      setBatches(response.data.batches || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchDetails = async (batchId) => {
    try {
      setDetailsLoading(true);
      
      // Get batch data
      const batch = batches.find(b => b.batch_id === batchId);
      
      // Get SHAP explanation
      const shapResponse = await api.post('/api/explain', {
        temperature: batch.temperature || 5.0,
        humidity: batch.humidity || 60.0,
        location: batch.location || 'Warehouse A',
        transport_mode: batch.transport_mode || 'Air',
        vaccine_type: batch.vaccine_type || 'Type A',
        quantity: batch.quantity || 1000,
        hours_in_transit: batch.hours_in_transit || 12,
        external_temperature: batch.external_temperature || 25.0
      });
      
      setBatchDetails(batch);
      setShapValues(shapResponse.data);
    } catch (err) {
      console.error('Failed to fetch batch details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
    fetchBatchDetails(batchId);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBatches} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Batch Analysis</h2>
        <p className="text-gray-600">Detailed batch information with timelines and SHAP explanations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-semibold">Select Batch ({batches.length})</h3>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {batches.map((batch) => (
                <button
                  key={batch.batch_id}
                  onClick={() => handleBatchSelect(batch.batch_id)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${
                    selectedBatch === batch.batch_id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{batch.batch_id}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(batch.timestamp)}</div>
                    </div>
                    <div className="ml-2">
                      <RiskBadge level={batch.risk_level} size="sm" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs font-semibold ${getRiskColor(batch.risk_score)}`}>
                      {(batch.risk_score * 100).toFixed(1)}% Risk
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Details */}
        <div className="lg:col-span-2">
          {!selectedBatch ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">Select a batch to view detailed analysis</p>
            </div>
          ) : detailsLoading ? (
            <LoadingSpinner />
          ) : batchDetails ? (
            <div className="space-y-6">
              {/* Batch Info Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{batchDetails.batch_id}</h3>
                    <p className="text-sm text-gray-600">{formatDate(batchDetails.timestamp)}</p>
                  </div>
                  <RiskBadge level={batchDetails.risk_level} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-600">Risk Score</div>
                    <div className={`text-2xl font-bold ${getRiskColor(batchDetails.risk_score)}`}>
                      {(batchDetails.risk_score * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="text-2xl font-bold">
                      {batchDetails.is_expired ? (
                        <span className="text-red-600">Expired</span>
                      ) : batchDetails.is_discarded ? (
                        <span className="text-orange-600">Discarded</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold mb-4">Environmental Conditions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Temperature</div>
                    <div className="text-lg font-semibold">{batchDetails.temperature?.toFixed(1) || 'N/A'}°C</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Humidity</div>
                    <div className="text-lg font-semibold">{batchDetails.humidity?.toFixed(1) || 'N/A'}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">External Temp</div>
                    <div className="text-lg font-semibold">{batchDetails.external_temperature?.toFixed(1) || 'N/A'}°C</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Transit Hours</div>
                    <div className="text-lg font-semibold">{batchDetails.hours_in_transit || 'N/A'}h</div>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold mb-4">Shipment Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{batchDetails.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport Mode:</span>
                    <span className="font-medium">{batchDetails.transport_mode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vaccine Type:</span>
                    <span className="font-medium">{batchDetails.vaccine_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{batchDetails.quantity?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* SHAP Explanation */}
              {shapValues && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="font-semibold mb-4">Feature Impact Analysis (SHAP)</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    How each feature influenced the risk prediction for this batch
                  </p>
                  <div className="space-y-3">
                    {shapValues.top_features?.map((feature, idx) => (
                      <div key={idx} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{feature.feature}</span>
                          <span className={feature.shap_value > 0 ? 'text-red-600' : 'text-green-600'}>
                            {feature.shap_value > 0 ? '+' : ''}{(feature.shap_value * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              feature.shap_value > 0 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.abs(feature.shap_value) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                    <strong>Base Value:</strong> {(shapValues.base_value * 100).toFixed(2)}% 
                    <span className="ml-2 text-gray-600">→</span>
                    <strong className="ml-2">Predicted:</strong> {(shapValues.prediction * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BatchAnalysis;
