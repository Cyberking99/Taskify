import React from 'react';
import {
  PlusIcon,
  SearchIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@/components/Icons';

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

export default HowItWorks;

