/**
 * POPCIX PRO - Bottom Navigation Tabs
 * 5 Primary Sections: Home, Jobs, Earnings, Rewards, Profile
 */

import React from 'react';
import { useProMarketplace } from '../../context/ProMarketplaceContext';

export type ProTabKey = 'home' | 'jobs' | 'earnings' | 'rewards' | 'profile';

interface ProBottomTabsProps {
  currentTab: ProTabKey;
  onSelectTab: (tab: ProTabKey) => void;
}

export function ProBottomTabs({ currentTab, onSelectTab }: ProBottomTabsProps) {
  const { jobs } = useProMarketplace();

  // Count active/new jobs
  const pendingJobsCount = jobs.filter(j => ['BROADCAST_PENDING', 'ACCEPTED', 'NAVIGATING', 'ARRIVED', 'IN_PROGRESS'].includes(j.status)).length;

  const tabs: { key: ProTabKey; label: string; icon: string; badge?: number }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'jobs', label: 'Jobs', icon: '⚡', badge: pendingJobsCount > 0 ? pendingJobsCount : undefined },
    { key: 'earnings', label: 'Earnings', icon: '💰' },
    { key: 'rewards', label: 'Rewards', icon: '🏆' },
    { key: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="bg-white border-t border-[#E5E5E0] px-2 py-1.5 flex items-center justify-around fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto shadow-lg">
      {tabs.map(tab => {
        const isActive = currentTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelectTab(tab.key)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
              isActive ? 'text-[#000000] font-bold' : 'text-[#6B6B6B] font-medium hover:text-[#111111]'
            }`}
          >
            <div className="relative text-xl mb-0.5">
              <span>{tab.icon}</span>
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] leading-tight ${isActive ? 'font-bold scale-105' : 'font-normal'}`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 bg-[#000000] rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
