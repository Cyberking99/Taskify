import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

interface FeaturedTask {
  id: number;
  title: string;
  category: string;
  amount: string;
  deadline: string;
  description: string;
  tags: string[];
}

interface FeaturedTaskCardProps {
  task: FeaturedTask;
}

const FeaturedTaskCard: React.FC<FeaturedTaskCardProps> = ({ task }) => {
  const getCategoryColor = (category: string): 'blue' | 'purple' | 'green' => {
    if (category === 'Development') return 'blue';
    if (category === 'Design') return 'purple';
    return 'green';
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-900/10 cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <Badge color={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
          <div className="flex items-center text-slate-200 font-semibold bg-slate-700/50 px-3 py-1 rounded-md">
            <span className="mr-1">♦</span> {task.amount}
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{task.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50 text-xs text-slate-500">
          <div className="flex gap-2">
            {task.tags.map(tag => (
              <span key={tag} className="bg-slate-800 px-2 py-1 rounded text-slate-400">#{tag}</span>
            ))}
          </div>
          <div className="flex items-center">
            Expires in {task.deadline}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedTaskCard;

