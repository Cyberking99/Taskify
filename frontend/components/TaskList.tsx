"use client";

import React, { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import TaskCard from './TaskCard';
import ABI from '@/lib/abi.json';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { MagnifyingGlassIcon } from './Icons';

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Other'];

const TaskList = () => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Get total task count
  const { data: taskCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'taskCount',
  });

  // 2. Prepare contract reads for all tasks
  const tasksConfig = React.useMemo(() => {
    if (!taskCount) return [];
    const count = Number(taskCount);
    const configs = [];
    for (let i = 1; i <= count; i++) {
      configs.push({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'tasks',
        args: [BigInt(i)],
      });
    }
    return configs;
  }, [taskCount]);

  // 3. Fetch all tasks
  const { data: tasksData, isLoading: isTasksLoading } = useReadContracts({
    contracts: tasksConfig,
    query: {
      enabled: !!taskCount,
    }
  });

  // 4. Process and filter tasks
  const filteredTasks = React.useMemo(() => {
    if (!tasksData) return [];

    return tasksData
      .map((result: any) => result.result) // Extract result from wagmi response
      .filter((task: any) => task) // Filter out nulls/undefined
      .map((task: any) => ({
        id: task[0],
        creator: task[1],
        worker: task[2],
        title: task[3],
        description: task[4],
        category: task[5],
        budget: task[6],
        deadline: task[7],
        state: task[8],
        createdAt: task[9],
        submissionUrl: task[10],
        submittedAt: task[11]
      }))
      // Filter by Category
      .filter((task: any) => filterCategory === 'All' || task.category === filterCategory)
      // Filter by Search
      .filter((task: any) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      // Sort by newest first
      .reverse();
  }, [tasksData, filterCategory, searchQuery]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px - 4 py - 2 rounded - full text - sm font - medium whitespace - nowrap transition - colors ${filterCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                } `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isTasksLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task: any) => (
            <TaskCard key={Number(task.id)} {...task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800 border-dashed">
          <p className="text-slate-400 text-lg">No tasks found.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
