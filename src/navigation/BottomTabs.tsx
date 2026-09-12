/**
 * POPCIX 5-Tab Bottom Navigation Bar
 * Thumb-friendly, responsive, rounded icons with active indicators and haptics.
 */

import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MainTab } from '../types/navigation';
import { Home, Compass, CalendarCheck2, Gift, User } from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../theme/haptics';

export const BottomTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useMarketplace();

  const tabs: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck2 },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: MainTab) => {
    if (activeTab !== tabId) {
      triggerHaptic('light');
      playSoundEffect('pop');
      setActiveTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EAEAE4] py-2 px-3 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive ? 'text-black' : 'text-[#8E8E8E] hover:text-[#555555]'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-black text-white' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white scale-110' : ''}`} />
                {tab.id === 'rewards' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFAA00] rounded-full animate-ping" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 transition-all ${
                  isActive ? 'font-extrabold text-black scale-105' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
