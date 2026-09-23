import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, Thermometer, Droplets, RefreshCw, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiService } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Statistics, RiskSummary, RiskTrend } from '../types';

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [riskTrend, setRiskTrend] = useState<RiskTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, summary, trend] = await Promise.all([
        apiService.getStatistics(),
        apiService.getRiskSummary(),
        apiService.getRiskTrend(),
      ]);
      setStatistics(stats);
      setRiskSummary(summary);
      setRiskTrend(trend);
    } catch (err) {
      setError('Failed to load dashboard data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner message="Loading dashboard data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!statistics || !riskSummary || !riskTrend) return null;

  // Prepare risk distribution data for pie chart
  const riskDistData = [
    { name: 'Low Risk', value: statistics.low_risk_count, color: '#10b981' },
    { name: 'Medium Risk', value: statistics.medium_risk_count, color: '#f59e0b' },
    { name: 'High Risk', value: statistics.high_risk_count, color: '#ef4444' },
  ];

  // Prepare location risk data
  const locationData = Object.entries(riskSummary.risk_by_location).map(([location, data]) => ({
    location,
    risk: (data.mean * 100).toFixed(1),
    count: data.count,
  })).slice(0, 10);

  // Prepare trend data
  const trendData = riskTrend.trend.slice(-30).map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avgRisk: (item.avg_risk * 100).toFixed(1),
    maxRisk: (item.max_risk * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time monitoring of vaccine cold chain system</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium text-gray-700">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Batches"
          value={statistics.total_batches.toLocaleString()}
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="High Risk"
          value={statistics.high_risk_count.toLocaleString()}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Low Risk"
          value={statistics.low_risk_count.toLocaleString()}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Avg Temp"
          value={`${statistics.avg_temperature.toFixed(1)}°C`}
          icon={Thermometer}
          color="primary"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Distribution Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
            <span className="text-xs text-gray-500">Total: {statistics.total_batches} batches</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskDistData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-xs text-gray-600">Low</p>
              </div>
              <p className="text-xl font-bold text-green-600">{statistics.low_risk_count}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <p className="text-xs text-gray-600">Medium</p>
              </div>
              <p className="text-xl font-bold text-yellow-600">{statistics.medium_risk_count}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <p className="text-xs text-gray-600">High</p>
              </div>
              <p className="text-xl font-bold text-red-600">{statistics.high_risk_count}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1.5 text-primary-600" />
                  Average Risk Score
                </span>
                <span className="text-lg font-bold text-primary-600">
                  {(riskSummary.average_risk * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${riskSummary.average_risk * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-red-600" />
                  High Risk Percentage
                </span>
                <span className="text-lg font-bold text-red-600">
                  {riskSummary.high_risk_percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${riskSummary.high_risk_percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <Thermometer className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-gray-700">Avg Temp</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 text-center">
                  {statistics.avg_temperature.toFixed(1)}°C
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {statistics.avg_temperature >= 2 && statistics.avg_temperature <= 8 ? 'Within Range' : 'Out of Range'}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-gray-700">Avg Humidity</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 text-center">
                  {statistics.avg_humidity.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {statistics.avg_humidity >= 30 && statistics.avg_humidity <= 60 ? 'Normal' : 'Alert'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-1">Monitoring Period</p>
              <p className="text-sm text-gray-900">
                {new Date(statistics.date_range.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {' '}
                {new Date(statistics.date_range.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4">
        {/* Risk Trend Over Time */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Trend Analysis</h3>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                label={{ value: 'Risk %', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="avgRisk" 
                stroke="#0ea5e9" 
                strokeWidth={2.5} 
                name="Average Risk %" 
                dot={{ fill: '#0ea5e9', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="maxRisk" 
                stroke="#ef4444" 
                strokeWidth={2.5} 
                name="Max Risk %" 
                dot={{ fill: '#ef4444', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk by Location */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk by Location</h3>
            <span className="text-xs text-gray-500">Top 10 locations</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="location" 
                angle={-30} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
              />
              <YAxis 
                label={{ value: 'Risk %', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar 
                dataKey="risk" 
                fill="#0ea5e9" 
                name="Average Risk %" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
