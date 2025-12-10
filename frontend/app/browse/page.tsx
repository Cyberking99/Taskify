import React from 'react';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';

const BrowsePage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30">
            <Navbar />
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Browse Tasks
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Find tasks that match your skills, complete them, and get paid in crypto.
                        </p>
                    </div>

                    <TaskList />
                </div>
            </main>
        </div>
    );
};

export default BrowsePage;
