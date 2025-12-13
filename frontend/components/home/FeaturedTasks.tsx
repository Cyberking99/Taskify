import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FeaturedTaskCard from './FeaturedTaskCard';
import { ChevronRightIcon, PlusIcon } from '@/components/Icons';

interface FeaturedTask {
  id: number;
  title: string;
  category: string;
  amount: string;
  deadline: string;
  description: string;
  tags: string[];
}

interface FeaturedTasksProps {
  tasks: FeaturedTask[];
}

const FeaturedTasks: React.FC<FeaturedTasksProps> = ({ tasks }) => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Gigs</h2>
            <p className="mt-2 text-slate-400">Fresh tasks just dropped on the chain.</p>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex" icon={ChevronRightIcon}>
            View All Tasks
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <FeaturedTaskCard key={task.id} task={task} />
          ))}

          {/* CTA Card */}
          <Link href="/create-task" className="rounded-xl p-6 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <PlusIcon className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Post a Job</h3>
            <p className="text-slate-400 text-sm mt-1">Need something done?</p>
          </Link>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="ghost" className="w-full">View All Tasks</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTasks;

