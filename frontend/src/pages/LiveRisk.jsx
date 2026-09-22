import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { formatDate, getRiskColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RiskBadge from '../components/RiskBadge';

const LiveRisk = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('risk_desc');

  useEffect(() => {
    fetchBatches();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [batches, searchTerm, riskFilter, sortBy]);

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

  const applyFilters = () => {
    let filtered = [...batches];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(batch =>
        batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(batch => batch.risk_level === riskFilter.toUpperCase());
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'risk_desc':
          return b.risk_score - a.risk_score;
        case 'risk_asc':
          return a.risk_score - b.risk_score;
        case 'date_desc':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'date_asc':
          return new Date(a.timestamp) - new Date(b.timestamp);
        default:
          return 0;
      }
    });

    setFilteredBatches(filtered);
  };

  if (loading && batches.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBatches} />;

  const riskCounts = batches.reduce((acc, batch) => {
    acc[batch.risk_level] = (acc[batch.risk_level] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Live Risk Monitoring</h2>
          <p className="text-gray-600">Real-time batch monitoring with filtering and search</p>
        </div>
        <button
          onClick={fetchBatches}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">Total Batches</div>
          <div className="text-2xl font-bold">{batches.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">High Risk</div>
          <div className="text-2xl font-bold text-red-600">{riskCounts.HIGH || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-600">{riskCounts.MEDIUM || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">Low Risk</div>
          <div className="text-2xl font-bold text-green-600">{riskCounts.LOW || 0}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Batch ID</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter batch ID..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="risk_desc">Risk: High to Low</option>
              <option value="risk_asc">Risk: Low to High</option>
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No batches found matching your filters
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr key={batch.batch_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.batch_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(batch.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.temperature?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${getRiskColor(batch.risk_score)}`}>
                        {(batch.risk_score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <RiskBadge level={batch.risk_level} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.is_expired ? (
                        <span className="text-red-600 font-medium">Expired</span>
                      ) : batch.is_discarded ? (
                        <span className="text-orange-600 font-medium">Discarded</span>
                      ) : (
                        <span className="text-green-600 font-medium">Active</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredBatches.length} of {batches.length} batches
      </div>
    </div>
  );
};

export default LiveRisk;
