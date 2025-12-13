import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { SearchIcon, PlusIcon } from '@/components/Icons';

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

export default Hero;

