import React from 'react';
import Navbar from './Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30 ${className}`}>
      <Navbar />
      {children}
    </div>
  );
};

export default PageLayout;

