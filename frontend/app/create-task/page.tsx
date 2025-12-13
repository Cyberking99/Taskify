"use client";

import React from 'react';
import PageLayout from '@/components/PageLayout';
import CreateTaskForm from '@/components/CreateTaskForm';
import { ZapIcon } from '@/components/Icons';

export default function CreateTaskPage() {
    return (
        <PageLayout>
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 mb-4">
                            <ZapIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Post a New Task
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Create a task, fund the escrow, and get work done trustlessly.
                        </p>
                    </div>

                    <CreateTaskForm />
                </div>
            </main>
        </PageLayout>
    );
}
