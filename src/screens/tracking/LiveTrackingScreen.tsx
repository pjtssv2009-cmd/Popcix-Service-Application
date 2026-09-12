/**
 * POPCIX Live Booking Tracking Screen
 * Animated Progress Timeline, Map View, Pro Contact, and Simulation Controls.
 */

import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Mascot } from '../../components/common/Mascot';
import {
  ArrowLeft,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Play,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { BookingStatus } from '../../types/marketplace';

export const LiveTrackingScreen: React.FC = () => {
  const {
    activeTrackingBooking,
    closeModal,
    simulateTrackingStep,
    completeServiceAndCelebrate,
  } = useMarketplace();

  if (!activeTrackingBooking) return null;

  const pro = activeTrackingBooking.professional;

  const timelineSteps: {
    status: BookingStatus;
    label: string;
    sublabel: string;
  }[] = [
    { status: 'CONFIRMED', label: 'Booking Confirmed', sublabel: 'Order verified in POPCIX system' },
    { status: 'PRO_ASSIGNED', label: 'POPCIX Pro Assigned', sublabel: `${pro?.name || 'Master Technician'} accepted` },
    { status: 'ON_THE_WAY', label: 'On The Way', sublabel: 'Technician en route to your address' },
    { status: 'ARRIVED', label: 'Arrived at Doorstep', sublabel: 'Pro has arrived and is ready' },
    { status: 'SERVICE_STARTED', label: 'Service Started', sublabel: 'Work in progress with safety checks' },
    { status: 'COMPLETED', label: 'Service Completed', sublabel: 'Inspected and certified clean' },
  ];

  const currentStatusIndex = timelineSteps.findIndex(
    (s) => s.status === activeTrackingBooking.status
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                closeModal();
              }}
              className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </button>
            <div>
              <span className="text-[10px] font-extrabold text-[#6B6B6B] uppercase">LIVE SERVICE TRACKING</span>
              <h3 className="text-sm font-black text-[#111111]">{activeTrackingBooking.bookingCode}</h3>
            </div>
          </div>

          <Badge variant="emerald" size="sm" icon={<span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />}>
            LIVE
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Simulated Interactive Map */}
          <div className="relative h-48 bg-[#E5E7EB] rounded-3xl overflow-hidden border-2 border-white shadow-inner flex flex-col justify-between p-4">
            {/* Map Grid Pattern */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Destination Pin (Customer Home) */}
            <div className="relative z-10 self-end flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md">
              <MapPin className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>Your Home</span>
            </div>

            {/* Technician GPS Marker */}
            <div className="relative z-10 self-start animate-bounce">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DFDFD6] shadow-lg">
                <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-black text-xs">
                  ⚡
                </div>
                <div>
                  <span className="text-[11px] font-black text-black">{pro?.name || 'POPCIX Pro'}</span>
                  <span className="block text-[9px] font-bold text-[#10B981]">
                    {activeTrackingBooking.status === 'ARRIVED' ? 'At Doorstep' : '2.4 km away'}
                  </span>
                </div>
              </div>
            </div>

            {/* ETA Overlay */}
            <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-md p-2.5 px-3.5 rounded-2xl border border-black/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-extrabold text-black">
                  Estimated Arrival: {activeTrackingBooking.estimatedArrivalTime || '11:18 AM'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#6B6B6B]">Traffic Normal</span>
            </div>
          </div>

          {/* Assigned Technician Card */}
          {pro && (
            <Card variant="surface" padding="md" className="border border-[#EAEAE4]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={pro.profilePhotoUrl}
                    alt={pro.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#EAEAE4]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-[#111111]">{pro.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-xs text-[#6B6B6B] font-medium">
                      POPCIX Master Technician • {pro.yearsExperience} yrs exp
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="amber" size="sm" icon={<Star className="w-3 h-3 fill-black" />}>
                        {pro.rating}
                      </Badge>
                      <span className="text-[11px] font-bold text-[#10B981]">
                        {pro.completedJobs}+ jobs done
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      alert(`Calling ${pro.name} at +91 98765 00000 (Secured Proxy Call)`);
                    }}
                    className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Call Pro"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      alert(`Chat opened with ${pro.name}`);
                    }}
                    className="w-10 h-10 rounded-full bg-[#F1F1ED] text-black flex items-center justify-center hover:bg-[#EAEAE4]"
                    aria-label="Message Pro"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* VISUALLY ENGAGING PROGRESS TIMELINE */}
          <div>
            <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider mb-3">
              Service Status Timeline
            </h4>

            <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EAEAE4]">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.status} className="relative flex items-start gap-3 select-none">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        isPassed
                          ? 'bg-[#10B981] text-white'
                          : isCurrent
                          ? 'bg-black text-white ring-4 ring-black/10 animate-pulse'
                          : 'bg-white border-2 border-[#DFDFD6] text-[#8E8E8E]'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black ${
                            isCurrent
                              ? 'text-black text-sm'
                              : isPassed
                              ? 'text-[#10B981]'
                              : 'text-[#8E8E8E]'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <Badge variant="black" size="sm">ACTIVE</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">
                        {step.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEMO SIMULATOR CONTROLS */}
          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-3xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#B45309]">
                🎮 Interactive Live Simulator
              </span>
              <span className="text-[10px] font-bold text-[#D97706]">
                Testing Tool
              </span>
            </div>
            <p className="text-xs text-[#92400E]">
              Advance the live job status through each step or complete it immediately to trigger the completion celebration!
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={simulateTrackingStep}
                leftIcon={<Play className="w-3.5 h-3.5" />}
                className="flex-1"
              >
                Advance Next Status
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => completeServiceAndCelebrate(activeTrackingBooking.id)}
              >
                Complete Job 🎉
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
