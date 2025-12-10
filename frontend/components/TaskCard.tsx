import React from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';

interface TaskCardProps {
    id: number;
    title: string;
    category: string;
    budget: bigint;
    deadline: bigint;
    state: number; // 0: Open, 1: Assigned, etc.
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, category, budget, deadline, state }) => {
    const deadlineDate = new Date(Number(deadline) * 1000).toLocaleDateString();
    const isExpired = Date.now() > Number(deadline) * 1000;

    const getStatusColor = (state: number) => {
        switch (state) {
            case 0: return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 1: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 2: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 3: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getStatusText = (state: number) => {
        switch (state) {
            case 0: return 'Open';
            case 1: return 'Assigned';
            case 2: return 'Submitted';
            case 3: return 'Completed';
            case 4: return 'Cancelled';
            case 5: return 'Disputed';
            case 6: return 'Resolved';
            default: return 'Unknown';
        }
    };

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                    {category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(state)}`}>
                    {getStatusText(state)}
                </span>
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
                    <span className={`${isExpired ? 'text-red-400' : 'text-white'} font-medium`}>
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
