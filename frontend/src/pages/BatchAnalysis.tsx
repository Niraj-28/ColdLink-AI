import { useEffect, useState } from 'react';
import { Package, Filter, Search, ChevronDown, ChevronUp, MapPin, Thermometer, Droplets, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import { getRiskBadgeClass, formatDate, formatNumber } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Batch } from '../types';

const BatchAnalysis = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    filterBatches();
  }, [searchTerm, riskFilter, locationFilter, batches]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBatches({ limit: 100 });
      setBatches(response.batches);
    } catch (err) {
      setError('Failed to load batch data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterBatches = () => {
    let filtered = batches;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(batch =>
        batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (riskFilter !== 'ALL') {
      filtered = filtered.filter(batch => batch.risk_level === riskFilter);
    }

    // Location filter
    if (locationFilter !== 'ALL') {
      filtered = filtered.filter(batch => batch.location === locationFilter);
    }

    setFilteredBatches(filtered);
  };

  const toggleBatchExpand = (batchId: string) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  const locations = ['ALL', ...Array.from(new Set(batches.map(b => b.location)))];

  if (loading) return <LoadingSpinner message="Loading batch data..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Batch Analysis</h2>
        <p className="text-gray-600 mt-1">Monitor and analyze vaccine batch conditions</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Batches
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by batch ID or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="inline h-4 w-4 mr-1" />
              Risk Level
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-field"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredBatches.length}</strong> of <strong>{batches.length}</strong> batches
          </p>
        </div>
      </div>

      {/* Batch List */}
      <div className="space-y-4">
        {filteredBatches.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Batches Found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          filteredBatches.map((batch) => (
            <div key={batch.batch_id} className="card hover:shadow-lg transition-shadow">
              {/* Batch Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleBatchExpand(batch.batch_id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{batch.batch_id}</h3>
                    <p className="text-sm text-gray-600">{formatDate(batch.timestamp)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getRiskBadgeClass(batch.risk_level)}>
                      {batch.risk_level}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatNumber(batch.risk_score * 100, 0)}%
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedBatch === batch.batch_id ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Batch Details (Expanded) */}
              {expandedBatch === batch.batch_id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Location Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{batch.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hop:</span>
                          <span className="ml-2 font-medium">{batch.current_hop.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Storage:</span>
                          <span className="ml-2 font-medium">{batch.external_storage.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Temperature Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Thermometer className="h-4 w-4 mr-1" />
                        Temperature
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Shipper:</span>
                          <span className={`ml-2 font-medium ${
                            batch.temperature < 2 || batch.temperature > 8 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatNumber(batch.temperature, 1)}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Room:</span>
                          <span className="ml-2 font-medium">{formatNumber(batch.external_temperature, 1)}°C</span>
                        </div>
                        <div>
                          <span className="text-gray-600">OOB Hours:</span>
                          <span className={`ml-2 font-medium ${
                            batch.oob_hours > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatNumber(batch.oob_hours, 1)}h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Humidity & Time */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Droplets className="h-4 w-4 mr-1" />
                        Environment
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Humidity:</span>
                          <span className="ml-2 font-medium">{formatNumber(batch.humidity, 1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Transit:</span>
                          <span className="ml-2 font-medium">{formatNumber(batch.hours_in_transit, 1)}h</span>
                        </div>
                      </div>
                    </div>

                    {/* Expiry & Status */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Status
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Expiry:</span>
                          <span className={`ml-2 font-medium ${
                            batch.expiry_hours < 24 ? 'text-red-600' : 
                            batch.expiry_hours < 72 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatNumber(batch.expiry_hours, 1)}h
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expired:</span>
                          <span className={`ml-2 font-medium ${batch.is_expired ? 'text-red-600' : 'text-green-600'}`}>
                            {batch.is_expired ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Discarded:</span>
                          <span className={`ml-2 font-medium ${batch.is_discarded ? 'text-red-600' : 'text-green-600'}`}>
                            {batch.is_discarded ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Vaccine Type:</span>
                      <span className="ml-2 font-medium">{batch.vaccine_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="ml-2 font-medium">{batch.quantity.toLocaleString()} doses</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transport:</span>
                      <span className="ml-2 font-medium">{batch.transport_mode}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BatchAnalysis;
