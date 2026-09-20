import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const RiskBadge = ({ level, showIcon = true, size = 'md' }) => {
  const configs = {
    'CRITICAL': {
      color: 'red',
      bgClass: 'bg-red-100 text-red-800',
      icon: AlertTriangle,
    },
    'HIGH': {
      color: 'orange',
      bgClass: 'bg-orange-100 text-orange-800',
      icon: AlertCircle,
    },
    'MEDIUM': {
      color: 'yellow',
      bgClass: 'bg-yellow-100 text-yellow-800',
      icon: Info,
    },
    'LOW': {
      color: 'green',
      bgClass: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    },
  };

  const sizeClasses = {
    'sm': 'text-xs px-2 py-0.5',
    'md': 'text-sm px-2.5 py-1',
    'lg': 'text-base px-3 py-1.5',
  };

  const config = configs[level] || configs['LOW'];
  const Icon = config.icon;
  const sizeClass = sizeClasses[size] || sizeClasses['md'];

  return (
    <span className={`inline-flex items-center space-x-1 font-semibold rounded ${config.bgClass} ${sizeClass}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      <span>{level}</span>
    </span>
  );
};

export default RiskBadge;
