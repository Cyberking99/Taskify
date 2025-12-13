// Task status utilities
export const TASK_STATES = {
  OPEN: 0,
  ASSIGNED: 1,
  SUBMITTED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
  DISPUTED: 5,
  RESOLVED: 6,
} as const;

export const getStatusLabel = (state: number): string => {
  const labels = ['Open', 'Assigned', 'Submitted', 'Completed', 'Cancelled', 'Disputed', 'Resolved'];
  return labels[state] || 'Unknown';
};

export const getStatusColor = (state: number): string => {
  const colors = [
    'bg-green-500/20 text-green-400 border-green-500/50', // Open
    'bg-blue-500/20 text-blue-400 border-blue-500/50', // Assigned
    'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', // Submitted
    'bg-purple-500/20 text-purple-400 border-purple-500/50', // Completed
    'bg-red-500/20 text-red-400 border-red-500/50', // Cancelled
    'bg-orange-500/20 text-orange-400 border-orange-500/50', // Disputed
    'bg-teal-500/20 text-teal-400 border-teal-500/50', // Resolved
  ];
  return colors[state] || colors[0];
};

export const isTaskExpired = (deadline: bigint | number): boolean => {
  const deadlineTimestamp = typeof deadline === 'bigint' ? Number(deadline) : deadline;
  return Date.now() > deadlineTimestamp * 1000;
};

export const formatDeadline = (deadline: bigint | number): string => {
  const deadlineTimestamp = typeof deadline === 'bigint' ? Number(deadline) : deadline;
  return new Date(deadlineTimestamp * 1000).toLocaleString();
};

export const formatDeadlineDate = (deadline: bigint | number): string => {
  const deadlineTimestamp = typeof deadline === 'bigint' ? Number(deadline) : deadline;
  return new Date(deadlineTimestamp * 1000).toLocaleDateString();
};

