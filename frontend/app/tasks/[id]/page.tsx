"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import PageLayout from '@/components/PageLayout';
import TaskHeader from '@/components/tasks/TaskHeader';
import TaskDescription from '@/components/tasks/TaskDescription';
import TaskActions from '@/components/tasks/TaskActions';
import ABI from '@/lib/abi.json';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { TASK_STATES, isTaskExpired } from '@/lib/taskUtils';

const TaskDetailPage = () => {
    const params = useParams();
    const { id } = params;

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
            <PageLayout>
                <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">Loading...</div>
                </main>
            </PageLayout>
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

    const expired = isTaskExpired(task.deadline);
    const showSubmission = task.state >= TASK_STATES.SUBMITTED;

    // Action Handlers
    const handleAcceptTask = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'acceptTask',
            args: [task.id],
        });
    };

    const handleSubmitWork = (url: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'submitWork',
            args: [task.id, url],
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

    return (
        <PageLayout>
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <TaskHeader
                        title={task.title}
                        category={task.category}
                        budget={task.budget}
                        deadline={task.deadline}
                        state={task.state}
                        creator={task.creator}
                        worker={task.worker}
                    />

                    <TaskDescription
                        description={task.description}
                        submissionUrl={task.submissionUrl}
                        showSubmission={showSubmission}
                    />

                    <TaskActions
                        taskId={task.id}
                        state={task.state}
                        creator={task.creator}
                        worker={task.worker}
                        isExpired={expired}
                        onAcceptTask={handleAcceptTask}
                        onSubmitWork={handleSubmitWork}
                        onApproveWork={handleApproveWork}
                        onCancelTask={handleCancelTask}
                        isPending={isPending}
                        isConfirming={isConfirming}
                        isConfirmed={isConfirmed}
                        hash={hash}
                    />
                </div>
            </main>
        </PageLayout>
    );
};

export default TaskDetailPage;
