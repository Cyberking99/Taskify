import React from 'react';
import PageLayout from '@/components/PageLayout';
import TaskList from '@/components/TaskList';

const BrowsePage = () => {
    return (
        <PageLayout>
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
        </PageLayout>
    );
};

export default BrowsePage;
