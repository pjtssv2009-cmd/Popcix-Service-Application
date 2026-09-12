/**
 * POPCIX HomeCare Subscriptions Screen
 * Basic, Plus, and Premium VIP tiers with clear perks and upgrade flows.
 */

import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Mascot } from '../../components/common/Mascot';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Crown,
  ArrowLeft,
  Zap,
  Star,
} from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';

interface SubscriptionsScreenProps {
  onClose?: () => void;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({ onClose }) => {
  const {
    homeCarePlans,
    activeSubscriptionTier,
    upgradeSubscription,
    closeModal,
  } = useMarketplace();

  const handleClose = () => {
    triggerHaptic('light');
    if (onClose) onClose();
    else closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </button>
          <span className="text-xs font-black text-[#111111] uppercase tracking-wider">
            POPCIX HOMECARE VIP
          </span>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hero Banner */}
          <div className="flex flex-col items-center text-center">
            <Mascot mood="superhero" size={90} className="mb-2" />
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              POPCIX HomeCare™
            </h2>
            <p className="text-xs font-medium text-[#6B6B6B] mt-1 max-w-xs">
              Put your entire home maintenance on autopilot. Enjoy free services & priority dispatch.
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="space-y-4">
            {homeCarePlans.map((plan) => {
              const isCurrent = activeSubscriptionTier === plan.tier;

              return (
                <Card
                  key={plan.id}
                  variant={isCurrent ? 'surface' : 'surface'}
                  padding="lg"
                  className={`relative border-2 transition-all ${
                    plan.isRecommended
                      ? 'border-[#7C3AED] shadow-card ring-2 ring-[#7C3AED]/10'
                      : isCurrent
                      ? 'border-black'
                      : 'border-[#DFDFD6]'
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="absolute -top-3 left-6">
                      <Badge variant="violet" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-black text-[#111111]">{plan.name}</h3>
                      <p className="text-xs text-[#6B6B6B]">
                        {plan.includedServicesCount} Included Services / Qtr
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-black">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B] block">/ month</span>
                    </div>
                  </div>

                  {/* Perks List */}
                  <ul className="space-y-1.5 my-3.5 pt-3 border-t border-[#F1F1ED]">
                    {plan.perks.map((perk, i) => (
                      <li key={i} className="text-xs font-medium text-[#444444] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center text-xs font-black text-[#065F46]">
                      ✓ Your Current Active Plan
                    </div>
                  ) : (
                    <Button
                      variant={plan.isRecommended ? 'accent' : 'primary'}
                      size="md"
                      fullWidth
                      onClick={() => upgradeSubscription(plan.tier)}
                    >
                      Switch to {plan.name}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Terms Footer */}
          <div className="p-3 bg-[#F1F1ED] rounded-2xl text-[11px] text-[#6B6B6B] text-center leading-relaxed">
            No hidden commitments. Cancel or pause anytime with 1-click in your profile.
          </div>
        </div>
      </div>
    </div>
  );
};
