import React from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';
import Badge from './ui/Badge';
import StatusBadge from './StatusBadge';
import { formatDeadlineDate, isTaskExpired } from '@/lib/taskUtils';

interface TaskCardProps {
    id: number;
    title: string;
    category: string;
    budget: bigint;
    deadline: bigint;
    state: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, category, budget, deadline, state }) => {
    const deadlineDate = formatDeadlineDate(deadline);
    const expired = isTaskExpired(deadline);

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <Badge color="slate">{category}</Badge>
                <StatusBadge state={state} className="text-xs" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-1">
                    <span className="text-slate-500">Budget:</span>
                    <span className="text-white font-medium">{formatEther(budget)} cUSD</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-slate-500">Deadline:</span>
                    <span className={`${expired ? 'text-red-400' : 'text-white'} font-medium`}>
                        {deadlineDate}
                    </span>
                </div>
            </div>

            <Link
                href={`/tasks/${id}`}
                className="block w-full py-2.5 text-center rounded-lg bg-slate-700/50 hover:bg-blue-600 text-white font-medium transition-all duration-300"
            >
                View Details
            </Link>
        </div>
    );
};

export default TaskCard;
