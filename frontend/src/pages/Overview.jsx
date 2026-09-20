import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, ThermometerSun, Droplets } from 'lucide-react';
import { apiService } from '../utils/api';
import { getErrorMessage } from '../utils/helpers';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getStatistics();
      setStats(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-600">
          Real-time monitoring of cold chain vaccine shipments
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Observations"
          value={stats.total_observations.toLocaleString()}
          subtitle={`${stats.total_batches} batches`}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Critical Risk Batches"
          value={stats.high_risk_batches + stats.medium_risk_batches}
          subtitle={`${stats.high_risk_batches} high, ${stats.medium_risk_batches} medium`}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Avg Temperature"
          value={`${stats.avg_temperature.toFixed(1)}°C`}
          subtitle="Thermal shipper reading"
          icon={ThermometerSun}
          color="orange"
        />
        <StatCard
          title="Avg Humidity"
          value={`${stats.avg_humidity.toFixed(0)}%`}
          subtitle="Room humidity level"
          icon={Droplets}
          color="teal"
        />
      </div>

      {/* Risk Distribution Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">{stats.high_risk_batches}</p>
            <p className="text-sm text-red-800 mt-1">High Risk</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{stats.medium_risk_batches}</p>
            <p className="text-sm text-orange-800 mt-1">Medium Risk</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{stats.low_risk_batches}</p>
            <p className="text-sm text-yellow-800 mt-1">Low Risk</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{stats.safe_batches}</p>
            <p className="text-sm text-green-800 mt-1">Safe</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ML Model</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monitoring</span>
              <span className="text-green-600 font-medium">Running</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update</span>
              <span className="text-gray-900">Real-time</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/live-risk" className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              View Live Risk Monitoring
            </a>
            <a href="/prediction" className="block w-full text-left px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors">
              Make New Prediction
            </a>
            <a href="/analytics" className="block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
