"use client";

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedTasks from '@/components/home/FeaturedTasks';
import Footer from '@/components/home/Footer';

// Mock data for featured tasks
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

export default function Home() {
  return (
    <PageLayout>
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedTasks tasks={FEATURED_TASKS} />
      </main>
      <Footer />
    </PageLayout>
  );
}
