"use client";

import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

// --- Icons (Inline SVGs to ensure zero-dependency rendering) ---

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6" /></svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

const EthereumIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 12h12M6 12l6-6m-6 6l6 6" /></svg> // Simplified
);


// --- Mock Data ---

const FEATURED_TASKS = [
  {
    id: 1,
    title: "Smart Contract Audit (ERC-20)",
    category: "Development",
    amount: "2500 USDC",
    deadline: "3 days",
    description: "Looking for an experienced solidity dev to audit a simple token contract.",
    tags: ["Solidity", "Security"]
  },
  {
    id: 2,
    title: "Logo Design for DeFi Protocol",
    category: "Design",
    amount: "2000 USDC",
    deadline: "2 days",
    description: "Need a minimalist vector logo for a new yield aggregator.",
    tags: ["Figma", "Branding"]
  },
  {
    id: 3,
    title: "Write a Thread on Zero Knowledge Proofs",
    category: "Marketing",
    amount: "100 USDC",
    deadline: "1 day",
    description: "Create a viral Twitter thread explaining ZK-Rollups to beginners.",
    tags: ["Content", "Social"]
  },
  {
    id: 4,
    title: "Fix Next.js Hydration Error",
    category: "Development",
    amount: "600 USDC",
    deadline: "12 hours",
    description: "Urgent fix needed for a dApp hydration mismatch in the navbar.",
    tags: ["React", "Next.js"]
  }
];

// --- Components ---

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  icon: Icon
}: {
  children?: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  className?: string,
  onClick?: () => void,
  icon?: React.ElementType
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 focus:ring-blue-500",
    secondary: "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/20 focus:ring-violet-500",
    outline: "border border-slate-700 text-slate-300 hover:bg-slate-800 focus:ring-slate-500",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode, color?: 'blue' | 'green' | 'purple' | 'orange' }) => {
  const colors = {
    blue: "bg-blue-900/30 text-blue-400 border-blue-800",
    green: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
    purple: "bg-purple-900/30 text-purple-400 border-purple-800",
    orange: "bg-orange-900/30 text-orange-400 border-orange-800",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Navbar Component ---

const Navbar = ({ isConnected, connectWallet, address }: { isConnected: boolean, connectWallet: () => void, address: string }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center">
              <ZapIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Taskify
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Find Work</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Post a Job</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
          </div>

          {/* Connect Button */}
          <div>
            {isConnected ? (
              <Button variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            ) : (
              <Button onClick={connectWallet} icon={WalletIcon}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Hero Component ---

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge color="purple">Web3 Freelancing is Here</Badge>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Work Freedom. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 animate-gradient">
            Trustless Payment.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10">
          The decentralized marketplace for micro-tasks. Post gigs, get work done, and pay securely via smart contract escrow. No middlemen, just code.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="w-full sm:w-auto h-12 px-8 text-base" icon={SearchIcon}>
            Find a Job
          </Button>
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" icon={PlusIcon}>
            Post a Task
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-slate-800 pt-10">
          {[
            { label: 'Total Tasks', value: '1,204' },
            { label: 'USDC Paid Out', value: '$450K+' },
            { label: 'Active Workers', value: '850' },
            { label: 'Avg Completion', value: '4h' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- How It Works Component ---

const HowItWorks = () => {
  const steps = [
    {
      icon: PlusIcon,
      title: "1. Create Task",
      desc: "Post a job with details and deposit USDC into the secure escrow contract."
    },
    {
      icon: SearchIcon,
      title: "2. Worker Accepts",
      desc: "A freelancer connects their wallet and accepts your task to start working."
    },
    {
      icon: CheckCircleIcon,
      title: "3. Submit Proof",
      desc: "Worker submits the completed work or proof of completion on-chain."
    },
    {
      icon: ShieldCheckIcon,
      title: "4. Get Paid",
      desc: "You approve the work, and the smart contract instantly releases funds."
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How Taskify Works</h2>
          <p className="mt-4 text-slate-400">Fully decentralized workflow powered by smart contracts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Featured Tasks Component ---

const TaskCard: React.FC<{ task: typeof FEATURED_TASKS[0] }> = ({ task }) => {
  return (
    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-900/10 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <Badge color={task.category === 'Development' ? 'blue' : task.category === 'Design' ? 'purple' : 'green'}>
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
  );
};

const FeaturedTasks = () => {
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
          {FEATURED_TASKS.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {/* CTA Card */}
          <div className="rounded-xl p-6 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <PlusIcon className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Post a Job</h3>
            <p className="text-slate-400 text-sm mt-1">Need something done?</p>
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="ghost" className="w-full">View All Tasks</Button>
        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center">
            <ZapIcon className="text-white w-3 h-3" />
          </div>
          <span className="text-lg font-bold text-white">Taskify</span>
        </div>

        <div className="flex gap-8 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Smart Contract</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
        </div>

        <div className="text-sm text-slate-600">
          © 2025 Taskify Protocol.
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function Home() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleConnect = () => {
    open();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30">
      <Navbar
        isConnected={isConnected}
        connectWallet={handleConnect}
        address={address || ""}
      />

      <main>
        <Hero />
        <HowItWorks />
        <FeaturedTasks />
      </main>

      <Footer />
    </div>
  );
}
