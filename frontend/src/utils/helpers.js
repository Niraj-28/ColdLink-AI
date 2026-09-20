// Risk level utilities
export const getRiskColor = (riskLevel) => {
  const colors = {
    'CRITICAL': 'red',
    'HIGH': 'orange',
    'MEDIUM': 'yellow',
    'LOW': 'green',
  };
  return colors[riskLevel] || 'gray';
};

export const getRiskBadgeClass = (riskLevel) => {
  const classes = {
    'CRITICAL': 'badge-critical',
    'HIGH': 'badge-high',
    'MEDIUM': 'badge-medium',
    'LOW': 'badge-low',
  };
  return classes[riskLevel] || 'badge-low';
};

export const getRiskColorClass = (riskLevel) => {
  const classes = {
    'CRITICAL': 'text-red-600',
    'HIGH': 'text-orange-600',
    'MEDIUM': 'text-yellow-600',
    'LOW': 'text-green-600',
  };
  return classes[riskLevel] || 'text-gray-600';
};

export const getRiskBgClass = (riskLevel) => {
  const classes = {
    'CRITICAL': 'bg-red-50 border-red-200',
    'HIGH': 'bg-orange-50 border-orange-200',
    'MEDIUM': 'bg-yellow-50 border-yellow-200',
    'LOW': 'bg-green-50 border-green-200',
  };
  return classes[riskLevel] || 'bg-gray-50 border-gray-200';
};

// Format numbers
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A';
  return Number(num).toFixed(decimals);
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined) return 'N/A';
  return `${(Number(num) * 100).toFixed(decimals)}%`;
};

export const formatProbability = (prob) => {
  if (prob === null || prob === undefined) return 'N/A';
  return `${(Number(prob) * 100).toFixed(1)}%`;
};

// Format dates
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format hours
export const formatHours = (hours) => {
  if (hours === null || hours === undefined) return 'N/A';
  const h = Number(hours);
  if (h < 0) return `${Math.abs(h).toFixed(1)}h (expired)`;
  if (h < 24) return `${h.toFixed(1)}h`;
  const days = Math.floor(h / 24);
  const remainingHours = h % 24;
  return `${days}d ${remainingHours.toFixed(0)}h`;
};

// Format temperature
export const formatTemperature = (temp) => {
  if (temp === null || temp === undefined) return 'N/A';
  return `${Number(temp).toFixed(1)}°C`;
};

// Format humidity
export const formatHumidity = (humidity) => {
  if (humidity === null || humidity === undefined) return 'N/A';
  return `${Number(humidity).toFixed(0)}%`;
};

// Validate temperature range (2-8°C for vaccines)
export const isTemperatureInRange = (temp) => {
  return temp >= 2 && temp <= 8;
};

export const getTemperatureStatus = (temp) => {
  if (temp < 2) return { status: 'TOO_LOW', message: 'Below safe range', color: 'blue' };
  if (temp > 8) return { status: 'TOO_HIGH', message: 'Above safe range', color: 'red' };
  return { status: 'SAFE', message: 'Within safe range', color: 'green' };
};

// Sort functions
export const sortByRisk = (batches, descending = true) => {
  return [...batches].sort((a, b) => {
    const diff = b.risk_probability - a.risk_probability;
    return descending ? diff : -diff;
  });
};

export const sortByExpiry = (batches, ascending = true) => {
  return [...batches].sort((a, b) => {
    const diff = a.expiry_hours - b.expiry_hours;
    return ascending ? diff : -diff;
  });
};

// Filter functions
export const filterByRiskLevel = (batches, riskLevel) => {
  if (!riskLevel || riskLevel === 'ALL') return batches;
  return batches.filter(batch => batch.risk_level === riskLevel);
};

export const filterByLocation = (batches, location) => {
  if (!location || location === 'ALL') return batches;
  return batches.filter(batch => batch.location === location);
};

// Statistics helpers
export const calculateAverage = (arr, key) => {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, item) => acc + (item[key] || 0), 0);
  return sum / arr.length;
};

export const countByProperty = (arr, property) => {
  return arr.reduce((acc, item) => {
    const value = item[property];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

// Chart data helpers
export const prepareChartData = (data, xKey, yKey) => {
  return data.map(item => ({
    name: item[xKey],
    value: item[yKey],
  }));
};

export const prepareTimeSeriesData = (data, dateKey, valueKey) => {
  return data.map(item => ({
    date: new Date(item[dateKey]).getTime(),
    value: item[valueKey],
  }));
};

// Error handling
export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.detail || error.response.statusText || 'Server error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// Loading state
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
