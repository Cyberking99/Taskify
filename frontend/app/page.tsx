"use client";

import React from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import {
  SearchIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ZapIcon,
  ChevronRightIcon,
  PlusIcon
} from '@/components/Icons';
import Link from 'next/link';

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
          <Link href="/create-task">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" icon={PlusIcon}>
              Post a Task
            </Button>
          </Link>
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
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <FeaturedTasks />
      </main>

      <Footer />
    </div>
  );
}
