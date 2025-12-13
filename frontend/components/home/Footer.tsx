import React from 'react';
import { ZapIcon } from '@/components/Icons';

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

export default Footer;

