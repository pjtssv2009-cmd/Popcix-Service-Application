/**
 * POPCIX PRO - Professional Auth & Profile Context
 * Manages Pro session, Supabase Auth, KYC workflow, Online/Offline availability, and working zones.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProProfile, ProAvailabilityStatus, KYCStatus, ProCategory } from '../types/pro';
import { INITIAL_PRO_PROFILE } from '../data/proMockData';
import { supabase } from '../services/supabase';

interface ProAuthContextType {
  proProfile: ProProfile;
  isOnline: boolean;
  kycStatus: KYCStatus;
  toggleAvailability: (status?: ProAvailabilityStatus) => void;
  updateProfile: (updates: Partial<ProProfile>) => void;
  updateKYCStatus: (status: KYCStatus, reason?: string) => void;
  updateServiceZones: (zones: string[]) => void;
  updateWorkingHours: (hours: ProProfile['workingHours']) => void;
  submitKYCStep: (stepNumber: number, data: any) => Promise<boolean>;
  signOutPro: () => Promise<void>;
}

const STORAGE_KEY = 'popcix_pro_profile_v1';

const ProAuthContext = createContext<ProAuthContextType | undefined>(undefined);

export function ProAuthProvider({ children }: { children: React.ReactNode }) {
  const [proProfile, setProProfile] = useState<ProProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved pro profile', e);
    }
    return INITIAL_PRO_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proProfile));
    } catch (e) {
      console.error('Failed to save pro profile', e);
    }
  }, [proProfile]);

  const isOnline = proProfile.availability === 'ONLINE';
  const kycStatus = proProfile.kycStatus;

  const toggleAvailability = (forcedStatus?: ProAvailabilityStatus) => {
    setProProfile(prev => {
      let nextStatus: ProAvailabilityStatus;
      if (forcedStatus) {
        nextStatus = forcedStatus;
      } else {
        nextStatus = prev.availability === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      }
      return {
        ...prev,
        availability: nextStatus
      };
    });
  };

  const updateProfile = (updates: Partial<ProProfile>) => {
    setProProfile(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateKYCStatus = (status: KYCStatus, reason?: string) => {
    setProProfile(prev => ({
      ...prev,
      kycStatus: status,
      isVerified: status === 'APPROVED',
      kycRejectionReason: reason
    }));
  };

  const updateServiceZones = (zones: string[]) => {
    setProProfile(prev => ({
      ...prev,
      serviceZones: zones
    }));
  };

  const updateWorkingHours = (workingHours: ProProfile['workingHours']) => {
    setProProfile(prev => ({
      ...prev,
      workingHours
    }));
  };

  const submitKYCStep = async (stepNumber: number, data: any): Promise<boolean> => {
    // In production, this saves directly to supabase 'professional_documents' & 'professional_profiles'
    if (stepNumber === 10) {
      updateKYCStatus('APPROVED');
    } else {
      updateKYCStatus('UNDER_REVIEW');
    }
    return true;
  };

  const signOutPro = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout', e);
    }
    toggleAvailability('OFFLINE');
  };

  return (
    <ProAuthContext.Provider
      value={{
        proProfile,
        isOnline,
        kycStatus,
        toggleAvailability,
        updateProfile,
        updateKYCStatus,
        updateServiceZones,
        updateWorkingHours,
        submitKYCStep,
        signOutPro
      }}
    >
      {children}
    </ProAuthContext.Provider>
  );
}

export function useProAuth() {
  const ctx = useContext(ProAuthContext);
  if (!ctx) {
    throw new Error('useProAuth must be used within a ProAuthProvider');
  }
  return ctx;
}
