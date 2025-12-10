"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ABI from '@/lib/abi.json';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { CheckCircleIcon } from '@/components/Icons';

const TaskDetailPage = () => {
    const params = useParams();
    const { id } = params;
    const { address } = useAccount();
    const [submissionUrl, setSubmissionUrl] = useState('');

    // Fetch Task Details
    const { data: taskData, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'tasks',
        args: [BigInt(id as string)],
    });

    // Contract Writes
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            refetch();
        }
    }, [isConfirmed, refetch]);

    if (!taskData) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-50">
                <Navbar />
                <div className="pt-32 text-center">Loading...</div>
            </div>
        );
    }

    // Parse Task Data
    const task = {
        id: taskData[0],
        creator: taskData[1],
        worker: taskData[2],
        title: taskData[3],
        description: taskData[4],
        category: taskData[5],
        budget: taskData[6],
        deadline: taskData[7],
        state: taskData[8],
        createdAt: taskData[9],
        submissionUrl: taskData[10],
        submittedAt: taskData[11]
    };

    const isCreator = address === task.creator;
    const isWorker = address === task.worker;
    const deadlineDate = new Date(Number(task.deadline) * 1000).toLocaleString();
    const isExpired = Date.now() > Number(task.deadline) * 1000;

    // Actions
    const handleAcceptTask = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'acceptTask',
            args: [task.id],
        });
    };

    const handleSubmitWork = () => {
        if (!submissionUrl) return alert("Please enter a submission URL");
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'submitWork',
            args: [task.id, submissionUrl],
        });
    };

    const handleApproveWork = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'approveWork',
            args: [task.id],
        });
    };

    const handleCancelTask = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'cancelTask',
            args: [task.id],
        });
    };

    const getStatusBadge = (state: number) => {
        const styles = [
            'bg-green-500/20 text-green-400 border-green-500/50', // Open
            'bg-blue-500/20 text-blue-400 border-blue-500/50', // Assigned
            'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', // Submitted
            'bg-purple-500/20 text-purple-400 border-purple-500/50', // Completed
            'bg-red-500/20 text-red-400 border-red-500/50', // Cancelled
            'bg-orange-500/20 text-orange-400 border-orange-500/50', // Disputed
            'bg-teal-500/20 text-teal-400 border-teal-500/50', // Resolved
        ];
        const labels = ['Open', 'Assigned', 'Submitted', 'Completed', 'Cancelled', 'Disputed', 'Resolved'];
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[state] || styles[0]}`}>
                {labels[state] || 'Unknown'}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30">
            <Navbar />
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                                        {task.category}
                                    </span>
                                    {getStatusBadge(task.state)}
                                </div>
                                <h1 className="text-3xl font-bold text-white">{task.title}</h1>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Budget</p>
                                <p className="text-2xl font-bold text-blue-400">{formatEther(task.budget)} cUSD</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm border-t border-slate-700/50 pt-6">
                            <div>
                                <p className="text-slate-500 mb-1">Creator</p>
                                <p className="text-slate-300 font-mono truncate">{task.creator}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Worker</p>
                                <p className="text-slate-300 font-mono truncate">
                                    {task.worker === '0x0000000000000000000000000000000000000000' ? 'Unassigned' : task.worker}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Deadline</p>
                                <p className={`${isExpired ? 'text-red-400' : 'text-slate-300'}`}>{deadlineDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {task.description}
                        </p>
                    </div>

                    {/* Submission Info */}
                    {task.state >= 2 && ( // Submitted or later
                        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4">Work Submission</h2>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-slate-400 text-sm mb-1">Submission URL</p>
                                <a href={task.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                                    {task.submissionUrl}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6">Actions</h2>

                        {/* Creator Actions */}
                        {isCreator && (
                            <div className="space-y-4">
                                {task.state === 0 && (
                                    <Button onClick={handleCancelTask} disabled={isPending || isConfirming} variant="danger" className="w-full">
                                        {isPending ? 'Cancelling...' : 'Cancel Task'}
                                    </Button>
                                )}
                                {task.state === 2 && (
                                    <Button onClick={handleApproveWork} disabled={isPending || isConfirming} icon={CheckCircleIcon} className="w-full">
                                        {isPending ? 'Approving...' : 'Approve Work & Pay Worker'}
                                    </Button>
                                )}
                                {task.state === 1 && (
                                    <p className="text-slate-400 text-center">Waiting for worker to submit work...</p>
                                )}
                                {task.state === 3 && (
                                    <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-center">
                                        Task Completed!
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Worker Actions */}
                        {!isCreator && (
                            <div className="space-y-4">
                                {task.state === 0 && (
                                    <Button onClick={handleAcceptTask} disabled={isPending || isConfirming || isExpired} className="w-full">
                                        {isPending ? 'Accepting...' : 'Accept Task'}
                                    </Button>
                                )}
                                {isWorker && task.state === 1 && (
                                    <div className="space-y-4">
                                        <Input
                                            label="Submission URL"
                                            placeholder="https://github.com/..."
                                            value={submissionUrl}
                                            onChange={(e) => setSubmissionUrl(e.target.value)}
                                        />
                                        <Button onClick={handleSubmitWork} disabled={isPending || isConfirming} className="w-full">
                                            {isPending ? 'Submitting...' : 'Submit Work'}
                                        </Button>
                                    </div>
                                )}
                                {isWorker && task.state === 2 && (
                                    <p className="text-slate-400 text-center">Waiting for creator approval...</p>
                                )}
                            </div>
                        )}

                        {/* Transaction Status */}
                        {isConfirmed && (
                            <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-center">
                                Transaction confirmed!
                            </div>
                        )}
                        {hash && (
                            <div className="mt-2 text-xs text-slate-500 text-center break-all">
                                Transaction Hash: {hash}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskDetailPage;
