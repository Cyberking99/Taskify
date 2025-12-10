"use client";

import React from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import Button from './ui/Button';
import { ZapIcon, WalletIcon } from './Icons';
import Link from 'next/link';

const Navbar = () => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    const handleConnect = () => {
        open();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center">
                            <ZapIcon className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Taskify
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Find Work</Link>
                        <Link href="/browse" className="text-slate-300 hover:text-white transition-colors">
                            Browse Tasks
                        </Link>
                        <Link href="/create-task" className="text-slate-300 hover:text-white transition-colors">
                            Post a Task
                        </Link>
                        <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</Link>
                    </div>

                    {/* Connect Button */}
                    <div>
                        {isConnected ? (
                            <Button variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </Button>
                        ) : (
                            <Button onClick={handleConnect} icon={WalletIcon}>
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
