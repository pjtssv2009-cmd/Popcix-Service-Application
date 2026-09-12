/**
 * POPCIX PRO - Profile & Settings Screen
 * Verified pro credentials, service zones, working hours, KYC documents, repeat customers CRM, referrals, support, and sign out.
 */

import React, { useState } from 'react';
import { useProAuth } from '../../../context/ProAuthContext';
import { REPEAT_CUSTOMERS_LIST, PRO_SUPPORT_TICKETS } from '../../../data/proMockData';

interface ProProfileScreenProps {
  onOpenKYCModal: () => void;
  onOpenLearningModal: () => void;
  onOpenSafetyModal: () => void;
  onSwitchMode?: () => void;
}

export function ProProfileScreen({
  onOpenKYCModal,
  onOpenLearningModal,
  onOpenSafetyModal,
  onSwitchMode
}: ProProfileScreenProps) {
  const { proProfile, updateServiceZones, signOutPro } = useProAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'zones' | 'customers' | 'referrals' | 'support'>('profile');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Available service zones for toggle
  const availableZones = ['OMR', 'Sholinganallur', 'Perungudi', 'Thoraipakkam', 'Velachery', 'Medavakkam', 'Guindy', 'Adyar', 'T. Nagar'];

  const handleToggleZone = (zone: string) => {
    if (proProfile.serviceZones.includes(zone)) {
      updateServiceZones(proProfile.serviceZones.filter(z => z !== zone));
    } else {
      updateServiceZones([...proProfile.serviceZones, zone]);
    }
  };

  const handleCopyReferral = () => {
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4 max-w-md mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-xs">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={proProfile.avatarUrl}
            alt={proProfile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-black shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-base font-black text-[#111111]">{proProfile.name}</h2>
              <span className="inline-flex items-center text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#10B981]/15 text-[#047857]">
                ✓ VERIFIED
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6B6B6B]">{proProfile.primaryCategory}</p>
            <div className="flex items-center gap-2 text-xs text-[#333333] mt-1">
              <span className="font-bold text-[#FFAA00]">⭐ {proProfile.rating}</span>
              <span className="text-[#888888]">•</span>
              <span>{proProfile.completedJobsCount} jobs</span>
              <span className="text-[#888888]">•</span>
              <span>{proProfile.experienceYears} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Bio / About */}
        <p className="text-xs text-[#555555] bg-[#F8F8F5] p-3 rounded-2xl border border-[#EBEBE6] leading-relaxed">
          "{proProfile.aboutText}"
        </p>
      </div>

      {/* Nav Section Tabs */}
      <div className="flex items-center gap-1 bg-[#F0F0EB] p-1 rounded-2xl">
        {[
          { key: 'profile', label: 'Credentials' },
          { key: 'zones', label: 'Zones' },
          { key: 'customers', label: 'Clients' },
          { key: 'referrals', label: 'Refer' },
          { key: 'support', label: 'Support' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === tab.key ? 'bg-white text-black shadow-xs' : 'text-[#6B6B6B] hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: CREDENTIALS & KYC */}
      {activeSection === 'profile' && (
        <div className="space-y-3">
          {/* KYC Status Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                KYC & VERIFICATION STATUS
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#047857]">
                APPROVED & ACTIVE
              </span>
            </div>
            <div className="space-y-2 text-xs text-[#333333]">
              <div className="flex justify-between py-1 border-b border-[#F0F0EB]">
                <span className="text-[#6B6B6B]">Government Aadhaar / Voter ID:</span>
                <span className="font-semibold">•••• •••• 9210 (Verified)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F0EB]">
                <span className="text-[#6B6B6B]">Income Tax PAN Card:</span>
                <span className="font-semibold">ABCDE••••F (Verified)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F0EB]">
                <span className="text-[#6B6B6B]">Bank Settlement Account:</span>
                <span className="font-semibold">{proProfile.bankDetails.bankName} (Verified)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B6B6B]">Trade Certificate:</span>
                <span className="font-semibold">HVAC Inverter Specialist L2</span>
              </div>
            </div>
            <button
              onClick={onOpenKYCModal}
              className="w-full mt-3 py-2 rounded-xl bg-[#F8F8F5] text-xs font-bold text-[#111111] hover:bg-[#F0F0EB] border border-[#E5E5E0]"
            >
              View Full 10-Step KYC Submission
            </button>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2">
              SCHEDULED WORKING HOURS
            </h3>
            <div className="flex items-center justify-between text-xs font-medium text-[#111111] bg-[#F8F8F5] p-3 rounded-xl">
              <span>Daily Shift: <strong>{proProfile.workingHours.startTime} - {proProfile.workingHours.endTime}</strong></span>
              <span>Days: <strong>Mon - Sat</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SERVICE ZONES */}
      {activeSection === 'zones' && (
        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">
              PREFERRED SERVICE HUBS (CHENNAI)
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Toggle neighborhoods where you are actively willing to travel for service bookings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableZones.map(zone => {
              const isSelected = proProfile.serviceZones.includes(zone);
              return (
                <button
                  key={zone}
                  onClick={() => handleToggleZone(zone)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#000000] text-white border-black shadow-2xs'
                      : 'bg-[#F8F8F5] text-[#6B6B6B] border-[#E5E5E0] hover:bg-white'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {zone}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-[#6B6B6B] bg-[#F8F8F5] p-3 rounded-xl">
            Maximum Travel Radius: <strong>{proProfile.serviceRadiusKm} km from current GPS center</strong>
          </div>
        </div>
      )}

      {/* SECTION 3: REPEAT CUSTOMERS CRM */}
      {activeSection === 'customers' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">
              YOUR REPEAT HOMEOWNERS ({REPEAT_CUSTOMERS_LIST.length})
            </h3>
            <p className="text-xs text-[#6B6B6B] mb-3">
              Homeowners who have re-booked you for scheduled maintenance.
            </p>

            <div className="space-y-2.5">
              {REPEAT_CUSTOMERS_LIST.map(cust => (
                <div
                  key={cust.id}
                  className="p-3 rounded-xl bg-[#F8F8F5] border border-[#EBEBE6] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#111111] flex items-center gap-1.5">
                      <span>{cust.customerFirstName}</span>
                      {cust.isFavorite && <span className="text-[#EF4444]">❤️</span>}
                    </div>
                    <div className="text-[10px] text-[#6B6B6B]">{cust.lastServiceName}</div>
                    <div className="text-[10px] text-[#6B6B6B] mt-0.5">Last booking: {cust.lastServiceDate}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#10B981]">
                      {cust.totalServicesCount} Bookings
                    </span>
                    <div className="text-[10px] text-[#FFAA00] font-bold">
                      ⭐ {cust.customerRatingGiven}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: REFERRAL PROGRAM */}
      {activeSection === 'referrals' && (
        <div className="bg-white rounded-2xl p-5 border border-[#E5E5E0] shadow-xs text-center space-y-3">
          <div className="text-3xl">🤝</div>
          <h3 className="text-sm font-black text-[#111111]">
            Invite Qualified Professionals & Earn ₹1,000
          </h3>
          <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto">
            Share your unique referral code with fellow electricians, plumbers, and technicians. When they complete their first 5 jobs, you both receive ₹1,000 cash.
          </p>

          <div className="bg-[#F8F8F5] p-3 rounded-2xl border border-dashed border-[#CCCCCC] flex items-center justify-between max-w-xs mx-auto">
            <span className="font-mono font-black text-sm tracking-wider text-[#111111]">
              {proProfile.referralCode}
            </span>
            <button
              onClick={handleCopyReferral}
              className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg"
            >
              {copiedReferral ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: SUPPORT TICKETS */}
      {activeSection === 'support' && (
        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              SUPPORT TICKETS
            </h3>
            <span className="text-[10px] font-bold text-[#10B981]">24/7 PRO DESK</span>
          </div>

          <div className="space-y-2">
            {PRO_SUPPORT_TICKETS.map(ticket => (
              <div
                key={ticket.id}
                className="p-3 rounded-xl bg-[#F8F8F5] border border-[#EBEBE6] text-xs"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-[#111111]">{ticket.subject}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                    ticket.status === 'RESOLVED' ? 'bg-[#10B981]/15 text-[#047857]' : 'bg-[#FFAA00]/15 text-[#B45309]'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="text-[10px] text-[#6B6B6B]">
                  #{ticket.ticketCode} • {ticket.category}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenSafetyModal}
            className="w-full py-2.5 rounded-xl bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold hover:bg-[#EF4444]/20 transition-colors"
          >
            🛡️ Safety & Incident Report Center
          </button>
        </div>
      )}

      {/* Bottom Actions: Mode Switch & Sign Out */}
      <div className="pt-2 space-y-2">
        {onSwitchMode && (
          <button
            onClick={onSwitchMode}
            className="w-full py-3 rounded-2xl bg-[#F0F0EB] text-[#111111] text-xs font-bold hover:bg-[#E5E5E0] transition-colors border border-[#E5E5E0] flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Switch to POPCIX Customer App</span>
          </button>
        )}

        <button
          onClick={signOutPro}
          className="w-full py-3 rounded-2xl bg-white text-[#EF4444] text-xs font-bold hover:bg-[#FEE2E2] transition-colors border border-[#FECACA]"
        >
          Sign Out of POPCIX PRO
        </button>
      </div>
    </div>
  );
}
