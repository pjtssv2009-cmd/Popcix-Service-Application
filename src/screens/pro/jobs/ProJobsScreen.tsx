/**
 * POPCIX PRO - Jobs Screen
 * Filter and manage all marketplace jobs across New, Upcoming, Active, Completed, Cancelled tabs.
 */

import React, { useState } from 'react';
import { useProMarketplace } from '../../../context/ProMarketplaceContext';
import { ProJobCard } from '../../../components/pro/ProJobCard';
import { ProJob } from '../../../types/pro';

interface ProJobsScreenProps {
  onOpenJobModal: (job: ProJob) => void;
}

export function ProJobsScreen({ onOpenJobModal }: ProJobsScreenProps) {
  const {
    jobs,
    activeJobTab,
    setActiveJobTab,
    acceptJob,
    declineJob,
    triggerSimulatedJobRadar
  } = useProMarketplace();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs by current tab
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.bookingCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeJobTab === 'new') {
      return job.status === 'BROADCAST_PENDING';
    }
    if (activeJobTab === 'upcoming') {
      return job.status === 'ACCEPTED' && job.scheduledDate !== 'Today';
    }
    if (activeJobTab === 'active') {
      return ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'IN_PROGRESS'].includes(job.status);
    }
    if (activeJobTab === 'completed') {
      return job.status === 'COMPLETED';
    }
    if (activeJobTab === 'cancelled') {
      return job.status === 'CANCELLED' || job.status === 'DECLINED';
    }
    return true;
  });

  const tabs: { key: typeof activeJobTab; label: string; count: number }[] = [
    { key: 'active', label: 'Active', count: jobs.filter(j => ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'IN_PROGRESS'].includes(j.status)).length },
    { key: 'new', label: 'New', count: jobs.filter(j => j.status === 'BROADCAST_PENDING').length },
    { key: 'upcoming', label: 'Upcoming', count: jobs.filter(j => j.status === 'ACCEPTED' && j.scheduledDate !== 'Today').length },
    { key: 'completed', label: 'Completed', count: jobs.filter(j => j.status === 'COMPLETED').length },
    { key: 'cancelled', label: 'Cancelled', count: jobs.filter(j => ['CANCELLED', 'DECLINED'].includes(j.status)).length }
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4 max-w-md mx-auto">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111111]">Job Marketplace</h1>
          <p className="text-xs text-[#6B6B6B]">Dispatch & Active Service Management</p>
        </div>
        <button
          onClick={triggerSimulatedJobRadar}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#000000] text-white hover:bg-[#222222] transition-colors"
        >
          + Test Radar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeJobTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveJobTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#000000] text-white border-[#000000] shadow-2xs'
                  : 'bg-white text-[#6B6B6B] border-[#E5E5E0] hover:bg-[#F8F8F5]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-black' : 'bg-[#F0F0EB] text-[#333333]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by service, customer or booking code..."
          className="w-full bg-white border border-[#E5E5E0] rounded-xl px-3 py-2 text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-black shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#999999] font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <ProJobCard
              key={job.id}
              job={job}
              onAccept={acceptJob}
              onDecline={declineJob}
              onOpenDetails={onOpenJobModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E5E0] shadow-xs my-6">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-sm font-bold text-[#111111] mb-1">
            No {activeJobTab} jobs found
          </h3>
          <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto mb-4">
            {activeJobTab === 'new'
              ? 'New service opportunities in your service radius will pop up here.'
              : `You currently have no ${activeJobTab} bookings matching your criteria.`}
          </p>
          {activeJobTab === 'new' && (
            <button
              onClick={triggerSimulatedJobRadar}
              className="px-4 py-2 rounded-xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors"
            >
              Simulate Instant Job Radar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
