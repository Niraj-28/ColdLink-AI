export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'CRITICAL':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'HIGH':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'MEDIUM':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'LOW':
      return 'text-green-700 bg-green-50 border-green-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

export const getRiskBadgeClass = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'CRITICAL':
      return 'badge-critical';
    case 'HIGH':
      return 'badge-high';
    case 'MEDIUM':
      return 'badge-medium';
    case 'LOW':
      return 'badge-low';
    default:
      return 'badge-low';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatPercentage = (num: number): string => {
  return `${(num * 100).toFixed(1)}%`;
};

export const getTemperatureStatus = (temp: number): {
  status: string;
  color: string;
} => {
  if (temp < 2) {
    return { status: 'Too Cold', color: 'text-blue-600' };
  } else if (temp > 8) {
    return { status: 'Too Warm', color: 'text-red-600' };
  } else {
    return { status: 'Normal', color: 'text-green-600' };
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
