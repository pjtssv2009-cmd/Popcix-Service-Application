/**
 * POPCIX Service Detail Screen
 * Transparent Pricing, What's Included/Excluded, FAQs, Reviews, Safety Protocols,
 * and Service Stacking ("Bundle these services?").
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Check,
  Sparkles,
  HelpCircle,
  Heart,
  Share2,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { ServiceVariant } from '../../types/marketplace';

export const ServiceDetailScreen: React.FC = () => {
  const {
    selectedService,
    closeModal,
    startBookingFlow,
    favorites,
    toggleFavorite,
  } = useMarketplace();

  const [selectedAddons, setSelectedAddons] = useState<ServiceVariant[]>([]);

  if (!selectedService) return null;

  const isFav = favorites.has(selectedService.id);

  const toggleAddon = (variant: ServiceVariant) => {
    triggerHaptic('light');
    playSoundEffect('pop');
    setSelectedAddons((prev) => {
      const exists = prev.some((v) => v.id === variant.id);
      return exists ? prev.filter((v) => v.id !== variant.id) : [...prev, variant];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, v) => sum + v.price, 0);
  const bundleDiscount = selectedAddons.length > 0 ? 50 : 0;
  const grandTotal = selectedService.startingPrice + addonsTotal - bundleDiscount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header with Back & Actions */}
        <div className="bg-white px-5 py-3 border-b border-[#EAEAE4] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-10 h-10 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>

          <span className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider">
            {selectedService.categoryName}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleFavorite(selectedService.id)}
              className="w-10 h-10 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <Heart
                className={`w-5 h-5 ${isFav ? 'text-[#FF5757] fill-[#FF5757]' : 'text-black'}`}
              />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Hero Media & Summary */}
          <div className="relative rounded-3xl overflow-hidden border border-[#EAEAE4]">
            <img
              src={selectedService.imageUrl}
              alt={selectedService.name}
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="amber" size="sm" icon={<Star className="w-3 h-3 fill-black" />}>
                  {selectedService.rating}
                </Badge>
                <span className="text-xs font-bold text-white/90">
                  {selectedService.reviewsCount.toLocaleString()} verified customer reviews
                </span>
              </div>
              <h1 className="text-xl font-black text-white leading-tight">
                {selectedService.name}
              </h1>
            </div>
          </div>

          {/* Pricing & Duration Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#EAEAE4] shadow-2xs">
            <div>
              <span className="text-xs font-bold text-[#6B6B6B]">Transparent Pricing</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-black">
                  ₹{selectedService.startingPrice}
                </span>
                {selectedService.originalPrice && (
                  <span className="text-sm font-bold text-[#8E8E8E] line-through">
                    ₹{selectedService.originalPrice}
                  </span>
                )}
                <span className="text-xs font-bold text-[#10B981]">
                  Save ₹{(selectedService.originalPrice || selectedService.startingPrice) - selectedService.startingPrice}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#6B6B6B]">Est. Duration</span>
              <div className="flex items-center gap-1 text-sm font-extrabold text-black mt-0.5">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <span>{selectedService.estimatedDurationMins} mins</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-sm font-medium text-[#444444] leading-relaxed">
              {selectedService.fullOverview}
            </p>
          </div>

          {/* SERVICE STACKING BUNDLE SECTION (Requirement 19) */}
          {selectedService.variants && selectedService.variants.length > 0 && (
            <div className="p-4 bg-[#F5F3FF] border border-[#DDD6FE] rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#7C3AED] text-white rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#5B21B6]">
                      Bundle These Services?
                    </h3>
                    <p className="text-[11px] font-semibold text-[#7C3AED]">
                      Combine add-ons into one visit & save ₹50 instantly!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selectedService.variants.map((v) => {
                  const isSelected = selectedAddons.some((addon) => addon.id === v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleAddon(v)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#7C3AED] shadow-sm'
                          : 'bg-white/60 border-[#EAEAE4] hover:bg-white'
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <h4 className="text-xs font-bold text-[#111111]">{v.name}</h4>
                        <p className="text-[11px] text-[#6B6B6B]">{v.description}</p>
                        <span className="text-xs font-black text-black mt-1 inline-block">
                          +₹{v.price} ({v.durationMins}m)
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                          isSelected ? 'bg-[#7C3AED] text-white' : 'bg-[#EAEAE4] text-black'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* What's Included & Not Included */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Included */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAEAE4]">
              <h4 className="text-xs font-extrabold text-[#10B981] flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT'S INCLUDED</span>
              </h4>
              <ul className="space-y-2">
                {selectedService.whatsIncluded.map((inc, i) => (
                  <li key={i} className="text-xs font-medium text-[#444444] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAEAE4]">
              <h4 className="text-xs font-extrabold text-[#FF5757] flex items-center gap-1.5 mb-2.5">
                <XCircle className="w-4 h-4" />
                <span>WHAT'S NOT INCLUDED</span>
              </h4>
              <ul className="space-y-2">
                {selectedService.whatsNotIncluded.map((notInc, i) => (
                  <li key={i} className="text-xs font-medium text-[#6B6B6B] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] mt-1.5 shrink-0" />
                    <span>{notInc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Protocols */}
          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl">
            <h4 className="text-xs font-extrabold text-[#065F46] flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>POPCIX SAFETY & HAPPINESS GUARANTEE</span>
            </h4>
            <ul className="space-y-1.5">
              {selectedService.safetyProtocols.map((safe, i) => (
                <li key={i} className="text-xs font-medium text-[#047857] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                  <span>{safe}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          {selectedService.faqs.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider mb-2.5">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {selectedService.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 bg-white rounded-2xl border border-[#EAEAE4]">
                    <h5 className="text-xs font-bold text-[#111111] mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{faq.question}</span>
                    </h5>
                    <p className="text-xs font-medium text-[#6B6B6B] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Booking Bar */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-[#EAEAE4] p-4 px-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#6B6B6B]">Total Estimated</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-black">₹{grandTotal}</span>
              {bundleDiscount > 0 && (
                <span className="text-[11px] font-extrabold text-[#7C3AED]">
                  (₹{bundleDiscount} bundle discount applied)
                </span>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="px-8 shadow-sm"
            onClick={() => {
              startBookingFlow(selectedService, selectedAddons[0]);
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
