/**
 * POPCIX Instant Booking Radar Screen
 * "Need help now?" Pro radar discovery with estimated arrival time & live search animation.
 */

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Mascot } from '../../components/common/Mascot';
import {
  Zap,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  X,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { MOCK_PROFESSIONALS } from '../../data/mockMarketplaceData';

export const InstantBookingRadar: React.FC = () => {
  const { closeModal, startBookingFlow, services } = useMarketplace();
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [selectedProIndex, setSelectedProIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      playSoundEffect('coin');
      triggerHaptic('success');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const emergencyService = services.find((s) => s.slug === 'emergency-electrical-repair') || services[0];
  const pro = MOCK_PROFESSIONALS[selectedProIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3 border-b border-[#EAEAE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FF5757] text-white rounded-xl">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-black text-[#111111]">INSTANT HELP NOW</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {isScanning ? (
            /* Radar Scanning Animation */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative flex items-center justify-center w-48 h-48 mb-6">
                {/* Radar Waves */}
                <div className="absolute inset-0 rounded-full border border-[#FF5757]/30 animate-ping opacity-75" />
                <div className="absolute inset-4 rounded-full border border-[#FF5757]/40 animate-pulse" />
                <div className="absolute inset-8 rounded-full border border-[#FF5757]/60" />
                <div className="w-24 h-24 rounded-full bg-[#FEF2F2] border-2 border-[#FF5757] flex items-center justify-center shadow-lg">
                  <Mascot mood="superhero" size={64} />
                </div>
              </div>

              <h3 className="text-lg font-black text-[#111111] animate-pulse">
                Finding your POPCIX Pro...
              </h3>
              <p className="text-xs text-[#6B6B6B] max-w-xs mt-1">
                Scanning GPS radar for active verified technicians within a 5 km radius.
              </p>
            </div>
          ) : (
            /* Pro Found Card */
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />} className="mb-2">
                  3 ACTIVE PROS NEARBY
                </Badge>
                <h3 className="text-xl font-black text-[#111111]">
                  Nearest Pro Ready for Dispatch!
                </h3>
              </div>

              {/* Selected Pro Card */}
              <Card variant="surface" padding="lg" className="border-2 border-black">
                <div className="flex items-start gap-3.5">
                  <img
                    src={pro.profilePhotoUrl}
                    alt={pro.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-black/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-extrabold text-[#111111]">{pro.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-xs font-medium text-[#6B6B6B]">
                      {pro.yearsExperience} yrs exp • {pro.completedJobs}+ jobs completed
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="amber" size="sm" icon={<Star className="w-3 h-3 fill-black" />}>
                        {pro.rating}
                      </Badge>
                      <span className="text-xs font-bold text-[#10B981]">
                        {pro.responseRate} response
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dispatch Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#EAEAE4]">
                  <div className="p-3 bg-[#FEF2F2] rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-[#991B1B] uppercase">Estimated Arrival</span>
                    <div className="text-base font-black text-[#B91C1C] flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4" />
                      <span>{pro.estimatedArrivalMins} Mins</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F1F1ED] rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">Pro Distance</span>
                    <div className="text-base font-black text-[#111111] flex items-center justify-center gap-1 mt-0.5">
                      <Navigation className="w-4 h-4 text-[#0284C7]" />
                      <span>{pro.distanceKm} km</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Service Selection */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAEAE4]">
                <span className="text-xs font-bold text-[#6B6B6B]">Instant Service Type:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-extrabold text-black">{emergencyService.name}</span>
                  <span className="text-sm font-black text-black">₹{emergencyService.startingPrice}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                variant="primary"
                size="xl"
                fullWidth
                onClick={() => {
                  startBookingFlow(emergencyService);
                }}
              >
                Confirm Instant Dispatch ⚡
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
