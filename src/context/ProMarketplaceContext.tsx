/**
 * POPCIX PRO - Marketplace Context
 * Controls the complete 14-step professional job workflow:
 * Radar -> Accept/Decline -> Navigation -> Arrival -> Start OTP ->
 * In-Progress Checklist -> Chargeable Add-on Request -> Before/After Photos ->
 * Completion OTP -> Instant Payout & XP Ledger update.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProJob, ProJobStatus, JobAddon, ProEarningsSummary, PayoutTransaction } from '../types/pro';
import { INITIAL_PRO_JOBS, INITIAL_PRO_EARNINGS, INITIAL_PAYOUT_HISTORY } from '../data/proMockData';
import { triggerHaptic } from '../services/nativeMobile';

interface ProMarketplaceContextType {
  jobs: ProJob[];
  earnings: ProEarningsSummary;
  payouts: PayoutTransaction[];
  activeJob: ProJob | null;
  incomingRadarJob: ProJob | null;
  activeJobTab: 'new' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  setActiveJobTab: (tab: 'new' | 'upcoming' | 'active' | 'completed' | 'cancelled') => void;
  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string, reason?: string) => void;
  startNavigation: (jobId: string) => void;
  confirmArrival: (jobId: string) => void;
  verifyStartOtp: (jobId: string, otpEntered: string) => boolean;
  toggleChecklistItem: (jobId: string, itemId: string) => void;
  requestAddon: (jobId: string, addon: { name: string; price: number; description: string }) => void;
  approveAddonByCustomer: (jobId: string, addonId: string) => void;
  addJobPhoto: (jobId: string, type: 'BEFORE' | 'AFTER', photoUrl: string) => void;
  verifyCompletionOtp: (jobId: string, otpEntered: string) => boolean;
  cancelJobWithReason: (jobId: string, reason: string) => void;
  triggerSimulatedJobRadar: () => void;
  dismissRadarJob: () => void;
  selectJobForDetails: (job: ProJob | null) => void;
  selectedJobDetails: ProJob | null;
}

const JOBS_STORAGE_KEY = 'popcix_pro_jobs_v1';
const EARNINGS_STORAGE_KEY = 'popcix_pro_earnings_v1';

const ProMarketplaceContext = createContext<ProMarketplaceContextType | undefined>(undefined);

export function ProMarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<ProJob[]>(() => {
    try {
      const saved = localStorage.getItem(JOBS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved pro jobs', e);
    }
    return INITIAL_PRO_JOBS;
  });

  const [earnings, setEarnings] = useState<ProEarningsSummary>(() => {
    try {
      const saved = localStorage.getItem(EARNINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved pro earnings', e);
    }
    return INITIAL_PRO_EARNINGS;
  });

  const [payouts] = useState<PayoutTransaction[]>(INITIAL_PAYOUT_HISTORY);
  const [activeJobTab, setActiveJobTab] = useState<'new' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('active');
  const [selectedJobDetails, setSelectedJobDetails] = useState<ProJob | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to sync pro jobs', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(earnings));
    } catch (e) {
      console.error('Failed to sync pro earnings', e);
    }
  }, [earnings]);

  // Find radar job and active job
  const incomingRadarJob = jobs.find(j => j.status === 'BROADCAST_PENDING') || null;
  const activeJob = jobs.find(j => ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'IN_PROGRESS'].includes(j.status)) || null;

  const acceptJob = (jobId: string) => {
    triggerHaptic('medium');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'ACCEPTED',
          acceptedAt: new Date().toISOString()
        };
      }
      return job;
    }));
  };

  const declineJob = (jobId: string, reason?: string) => {
    triggerHaptic('light');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'DECLINED',
          jobNotes: reason ? `Declined: ${reason}` : 'Declined by professional'
        };
      }
      return job;
    }));
  };

  const startNavigation = (jobId: string) => {
    triggerHaptic('light');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'NAVIGATING'
        };
      }
      return job;
    }));
  };

  const confirmArrival = (jobId: string) => {
    triggerHaptic('medium');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'ARRIVED'
        };
      }
      return job;
    }));
  };

  const verifyStartOtp = (jobId: string, otpEntered: string): boolean => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return false;

    // Allow correct start OTP or master demo OTP '4829' / '0000'
    if (otpEntered.trim() === targetJob.startOtp || otpEntered.trim() === '4829' || otpEntered.trim() === '0000') {
      triggerHaptic('heavy');
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'IN_PROGRESS',
            startedAt: new Date().toISOString()
          };
        }
        return job;
      }));
      return true;
    }
    return false;
  };

  const toggleChecklistItem = (jobId: string, itemId: string) => {
    triggerHaptic('light');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          checklist: job.checklist.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return job;
    }));
  };

  const requestAddon = (jobId: string, addon: { name: string; price: number; description: string }) => {
    const newAddon: JobAddon = {
      id: `add_${Date.now()}`,
      name: addon.name,
      price: addon.price,
      description: addon.description,
      status: 'PENDING_CUSTOMER_APPROVAL',
      requestedAt: new Date().toISOString()
    };

    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          addons: [...job.addons, newAddon]
        };
      }
      return job;
    }));

    // Simulate customer auto-approval after 2.5s for seamless demo experience
    setTimeout(() => {
      approveAddonByCustomer(jobId, newAddon.id);
    }, 2500);
  };

  const approveAddonByCustomer = (jobId: string, addonId: string) => {
    triggerHaptic('medium');
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        let addonPrice = 0;
        const updatedAddons = job.addons.map(a => {
          if (a.id === addonId) {
            addonPrice = a.price;
            return { ...a, status: 'APPROVED' as const, approvedAt: new Date().toISOString() };
          }
          return a;
        });
        return {
          ...job,
          addons: updatedAddons,
          basePrice: job.basePrice + addonPrice,
          netPayout: job.netPayout + addonPrice
        };
      }
      return job;
    }));
  };

  const addJobPhoto = (jobId: string, type: 'BEFORE' | 'AFTER', photoUrl: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        if (type === 'BEFORE') {
          return { ...job, beforePhotos: [...job.beforePhotos, photoUrl] };
        } else {
          return { ...job, afterPhotos: [...job.afterPhotos, photoUrl] };
        }
      }
      return job;
    }));
  };

  const verifyCompletionOtp = (jobId: string, otpEntered: string): boolean => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return false;

    if (otpEntered.trim() === targetJob.completionOtp || otpEntered.trim() === '7193' || otpEntered.trim() === '0000') {
      triggerHaptic('heavy');
      const payoutAmount = targetJob.netPayout;

      // Update job status to completed
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
            xpEarned: 180
          };
        }
        return job;
      }));

      // Increment earnings
      setEarnings(prev => ({
        ...prev,
        todayEarnings: prev.todayEarnings + payoutAmount,
        todayJobsCount: prev.todayJobsCount + 1,
        thisWeekEarnings: prev.thisWeekEarnings + payoutAmount,
        thisMonthEarnings: prev.thisMonthEarnings + payoutAmount,
        lifetimeEarnings: prev.lifetimeEarnings + payoutAmount,
        availableBalance: prev.availableBalance + payoutAmount,
        nextPayoutAmount: prev.nextPayoutAmount + payoutAmount,
        breakdown: {
          ...prev.breakdown,
          baseEarnings: prev.breakdown.baseEarnings + payoutAmount
        }
      }));

      return true;
    }
    return false;
  };

  const cancelJobWithReason = (jobId: string, reason: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'CANCELLED',
          jobNotes: `Cancelled by pro: ${reason}`
        };
      }
      return job;
    }));
  };

  const triggerSimulatedJobRadar = () => {
    const simulatedJob: ProJob = {
      id: `job_radar_${Date.now()}`,
      bookingCode: `PX-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'AC Technician',
      serviceName: 'Emergency AC Cooling Breakdown & Jet Wash',
      serviceDescription: 'Urgent cooling repair, drain clear, and comprehensive high-pressure coil wash.',
      customerFirstName: 'Ananya',
      customerPhoneMasked: '+91 98845 •••••',
      customerRating: 4.9,
      customerAddressApprox: 'OMR Road, Sholinganallur (1.8 km)',
      customerAddressFull: 'Apt 504, Prestige Courtyard, Sholinganallur, Chennai - 600119',
      customerInstructions: 'AC stopped cooling suddenly. Family at home, prompt arrival requested.',
      customerCoordinates: { lat: 12.8984, lng: 80.2291 },
      distanceKm: 1.8,
      estimatedDurationMin: 60,
      scheduledDate: 'Today',
      scheduledTime: 'Right Now',
      basePrice: 999,
      platformFee: 100,
      netPayout: 899,
      status: 'BROADCAST_PENDING',
      startOtp: '4829',
      completionOtp: '7193',
      checklist: [
        { id: 'sim1', title: 'Check main breaker & power input', completed: false, required: true },
        { id: 'sim2', title: 'High-pressure foam wash', completed: false, required: true },
        { id: 'sim3', title: 'Check gas pressure & cooling temp', completed: false, required: true }
      ],
      addons: [],
      beforePhotos: [],
      afterPhotos: [],
      paymentMode: 'ONLINE_PAID',
      createdAt: new Date().toISOString(),
      xpEarned: 180
    };

    setJobs(prev => [simulatedJob, ...prev.filter(j => j.status !== 'BROADCAST_PENDING')]);
  };

  const dismissRadarJob = () => {
    if (incomingRadarJob) {
      declineJob(incomingRadarJob.id, 'Ignored / Timed out');
    }
  };

  const selectJobForDetails = (job: ProJob | null) => {
    setSelectedJobDetails(job);
  };

  return (
    <ProMarketplaceContext.Provider
      value={{
        jobs,
        earnings,
        payouts,
        activeJob,
        incomingRadarJob,
        activeJobTab,
        setActiveJobTab,
        acceptJob,
        declineJob,
        startNavigation,
        confirmArrival,
        verifyStartOtp,
        toggleChecklistItem,
        requestAddon,
        approveAddonByCustomer,
        addJobPhoto,
        verifyCompletionOtp,
        cancelJobWithReason,
        triggerSimulatedJobRadar,
        dismissRadarJob,
        selectJobForDetails,
        selectedJobDetails
      }}
    >
      {children}
    </ProMarketplaceContext.Provider>
  );
}

export function useProMarketplace() {
  const ctx = useContext(ProMarketplaceContext);
  if (!ctx) {
    throw new Error('useProMarketplace must be used within a ProMarketplaceProvider');
  }
  return ctx;
}
