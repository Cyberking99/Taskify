import React from 'react';
import { getStatusLabel, getStatusColor } from '@/lib/taskUtils';

interface StatusBadgeProps {
  state: number;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ state, className = '' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(state)} ${className}`}>
      {getStatusLabel(state)}
    </span>
  );
};

export default StatusBadge;

