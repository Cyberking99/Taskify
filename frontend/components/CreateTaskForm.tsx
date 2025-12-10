"use client";

import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseEther, erc20Abi } from 'viem';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import { PlusIcon, CheckCircleIcon } from './Icons';
import ABI from '@/lib/abi.json';
import { CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';

const CATEGORIES = [
    { value: 'Development', label: 'Development' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Other', label: 'Other' },
];

const CreateTaskForm = () => {
    const { address } = useAccount();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        budget: '',
        deadline: '',
    });

    const [isApproved, setIsApproved] = useState(false);

    // Read Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string} `, CONTRACT_ADDRESS],
        query: {
            enabled: !!address,
        }
    });

    // Write Contract (Approve & CreateTask)
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Check if allowance is sufficient
    useEffect(() => {
        if (allowance && formData.budget) {
            try {
                const budgetWei = parseEther(formData.budget || '0');
                setIsApproved(allowance >= budgetWei);
            } catch (error) {
                console.error("Error parsing budget for allowance check:", error);
                setIsApproved(false);
            }
        } else {
            setIsApproved(false);
        }
    }, [allowance, formData.budget]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.budget) {
            alert("Please enter a budget to approve.");
            return;
        }

        try {
            writeContract({
                address: CUSD_ADDRESS,
                abi: erc20Abi,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, parseEther(formData.budget)],
            });
        } catch (error) {
            console.error("Error approving:", error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);

            writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'createTask',
                args: [
                    formData.title,
                    formData.description,
                    formData.category,
                    parseEther(formData.budget),
                    BigInt(deadlineTimestamp)
                ],
            });
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            refetchAllowance();
        }
    }, [isConfirmed, refetchAllowance]);


    return (
        <form className="space-y-6 bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-6">
                <Input
                    label="Task Title"
                    name="title"
                    placeholder="e.g. Build a React Landing Page"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Category"
                        name="category"
                        options={CATEGORIES}
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <Input
                        label="Budget (cUSD)"
                        name="budget"
                        type="number"
                        step="0.01"
                        placeholder="5"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Deadline"
                    name="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                />

                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Describe the task in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                />
            </div>

            <div className="pt-4">
                {!isApproved ? (
                    <Button
                        onClick={handleApprove}
                        className="w-full h-12 text-base"
                        disabled={isPending || isConfirming || !formData.budget}
                        icon={CheckCircleIcon}
                    >
                        {isPending ? 'Approving...' : isConfirming ? 'Confirming Approval...' : 'Approve cUSD'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleCreateTask}
                        className="w-full h-12 text-base"
                        disabled={isPending || isConfirming}
                        icon={PlusIcon}
                    >
                        {isPending ? 'Creating...' : isConfirming ? 'Confirming Task...' : 'Create Task'}
                    </Button>
                )}

            </div>

            {isConfirmed && (
                <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-center">
                    Transaction confirmed!
                </div>
            )}
            {hash && (
                <div className="text-xs text-slate-500 text-center break-all">
                    Transaction Hash: {hash}
                </div>
            )}
        </form>
    );
};

export default CreateTaskForm;
