import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Clock, Package } from 'lucide-react';
import { apiService } from '../services/api';
import { getRiskBadgeClass, formatDate, formatNumber } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Batch } from '../types';

const LiveRisk = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadBatches();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBatches({ limit: 50 });
      // Sort by risk score descending
      const sortedBatches = response.batches.sort((a, b) => b.risk_score - a.risk_score);
      setBatches(sortedBatches);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to load live risk data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const criticalBatches = batches.filter(b => b.risk_level === 'CRITICAL' || b.risk_level === 'HIGH');
  const activeBatches = batches.filter(b => !b.is_expired && !b.is_discarded);
  const expiredBatches = batches.filter(b => b.is_expired || b.is_discarded);

  if (loading && batches.length === 0) {
    return <LoadingSpinner message="Loading live risk monitor..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Live Risk Monitor</h2>
          <p className="text-gray-600 mt-1">Real-time monitoring of critical vaccine batches</p>
        </div>
        <button
          onClick={loadBatches}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="font-semibold text-gray-900">{lastUpdate.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="font-semibold text-red-600 text-xl">{criticalBatches.length}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto-Refresh</p>
              <p className="text-xs text-gray-500">Every 30 seconds</p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoRefresh ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoRefresh ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Batches</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{criticalBatches.length}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Batches</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activeBatches.length}</p>
            </div>
            <Package className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="card border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired/Discarded</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">{expiredBatches.length}</p>
            </div>
            <Package className="h-10 w-10 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalBatches.length > 0 && (
        <div className="card border-2 border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Critical Alerts - Immediate Action Required
          </h3>
          <div className="space-y-3">
            {criticalBatches.map((batch) => (
              <div
                key={batch.batch_id}
                className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{batch.batch_id}</h4>
                      <span className={getRiskBadgeClass(batch.risk_level)}>
                        {batch.risk_level}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {formatNumber(batch.risk_score * 100, 0)}%
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{batch.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <span className={`ml-2 font-medium ${
                          batch.temperature < 2 || batch.temperature > 8 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatNumber(batch.temperature, 1)}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expiry:</span>
                        <span className={`ml-2 font-medium ${
                          batch.expiry_hours < 24 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {formatNumber(batch.expiry_hours, 1)}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">OOB Hours:</span>
                        <span className={`ml-2 font-medium ${
                          batch.oob_hours > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatNumber(batch.oob_hours, 1)}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Batches Monitor */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Batches (Top 50 by Risk)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.slice(0, 50).map((batch) => (
                <tr key={batch.batch_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.batch_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={getRiskBadgeClass(batch.risk_level)}>
                        {batch.risk_level}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatNumber(batch.risk_score * 100, 0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={
                      batch.temperature < 2 || batch.temperature > 8 ? 'text-red-600 font-semibold' : 'text-green-600'
                    }>
                      {formatNumber(batch.temperature, 1)}°C
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={
                      batch.expiry_hours < 24 ? 'text-red-600 font-semibold' :
                      batch.expiry_hours < 72 ? 'text-orange-600' : 'text-green-600'
                    }>
                      {formatNumber(batch.expiry_hours, 1)}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {batch.is_expired && <span className="badge-critical">Expired</span>}
                    {batch.is_discarded && <span className="badge-critical ml-1">Discarded</span>}
                    {!batch.is_expired && !batch.is_discarded && (
                      <span className="badge-low">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(batch.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveRisk;
