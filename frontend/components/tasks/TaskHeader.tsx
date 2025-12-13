import React from 'react';
import { formatEther } from 'viem';
import Badge from '@/components/ui/Badge';
import StatusBadge from '@/components/StatusBadge';
import { formatDeadline, isTaskExpired } from '@/lib/taskUtils';

interface TaskHeaderProps {
  title: string;
  category: string;
  budget: bigint;
  deadline: bigint;
  state: number;
  creator: string;
  worker: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  title,
  category,
  budget,
  deadline,
  state,
  creator,
  worker,
}) => {
  const deadlineDate = formatDeadline(deadline);
  const expired = isTaskExpired(deadline);
  const isUnassigned = worker === '0x0000000000000000000000000000000000000000';

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge color="slate">{category}</Badge>
            <StatusBadge state={state} />
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Budget</p>
          <p className="text-2xl font-bold text-blue-400">{formatEther(budget)} cUSD</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm border-t border-slate-700/50 pt-6">
        <div>
          <p className="text-slate-500 mb-1">Creator</p>
          <p className="text-slate-300 font-mono truncate">{creator}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Worker</p>
          <p className="text-slate-300 font-mono truncate">
            {isUnassigned ? 'Unassigned' : worker}
          </p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Deadline</p>
          <p className={`${expired ? 'text-red-400' : 'text-slate-300'}`}>{deadlineDate}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;

