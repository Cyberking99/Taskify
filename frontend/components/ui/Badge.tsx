import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'teal' | 'slate';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: "bg-blue-900/30 text-blue-400 border-blue-800",
    green: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
    purple: "bg-purple-900/30 text-purple-400 border-purple-800",
    orange: "bg-orange-900/30 text-orange-400 border-orange-800",
    red: "bg-red-900/30 text-red-400 border-red-800",
    yellow: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    teal: "bg-teal-900/30 text-teal-400 border-teal-800",
    slate: "bg-slate-700/50 text-slate-300 border-slate-600/50",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

