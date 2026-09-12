/**
 * POPCIX Service Completion Celebration & Rating Modal
 * Confetti burst, XP & Points reward breakdown, and 1-5 Star Review with Optional Tip.
 */

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useGamification } from '../../context/GamificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Mascot } from '../../components/common/Mascot';
import { firePopcixConfetti } from '../../components/common/ConfettiCelebration';
import {
  Star,
  Sparkles,
  CheckCircle2,
  FileText,
  Heart,
  Flame,
  Award,
  ThumbsUp,
  X,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';

export const ServiceCompletionModal: React.FC = () => {
  const {
    completedBookingForCelebration,
    closeModal,
    submitServiceReview,
  } = useMarketplace();

  const { addXpAndPoints } = useGamification();

  const [rating, setRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [behaviorRating, setBehaviorRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('Super fast, professional, and spotless cleaning!');
  const [selectedTip, setSelectedTip] = useState<number>(50);

  useEffect(() => {
    firePopcixConfetti();
  }, []);

  if (!completedBookingForCelebration) return null;

  const booking = completedBookingForCelebration;

  const handleReviewSubmit = () => {
    triggerHaptic('success');
    playSoundEffect('success');
    addXpAndPoints(50, 30, 'Left 5-Star Service Review');
    submitServiceReview(booking.id, rating, reviewText, selectedTip);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between">
          <span className="text-xs font-black text-[#10B981] uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>JOB COMPLETED</span>
          </span>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-[#F8F8F5] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Hero Celebration Banner */}
          <div className="flex flex-col items-center text-center">
            <Mascot mood="celebrating" size={110} className="mb-2" />
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              Nice! Your home just got better. 🎉
            </h2>
            <p className="text-xs font-medium text-[#6B6B6B] mt-1 max-w-xs">
              Thank you for trusting POPCIX. Your space is officially fresh and certified!
            </p>
          </div>

          {/* Gamification Reward Summary Box */}
          <div className="p-4 bg-gradient-to-r from-[#111111] to-[#1F1F1F] text-white rounded-3xl shadow-card">
            <span className="text-[10px] font-extrabold text-[#FFAA00] uppercase tracking-wider">
              REWARDS EARNED
            </span>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#FDE047]" />
                </div>
                <div>
                  <span className="text-sm font-black text-white">+{booking.xpEarned || 120} XP</span>
                  <span className="block text-[10px] text-[#D1D1D1]">Level Progress</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFAA00] flex items-center justify-center text-black font-black">
                  🪙
                </div>
                <div>
                  <span className="text-sm font-black text-white">+{booking.pointsEarned || 50} Pts</span>
                  <span className="block text-[10px] text-[#D1D1D1]">POPCIX Wallet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <Card variant="surface" padding="md" className="space-y-2 text-xs">
            <div className="flex justify-between font-bold text-[#111111]">
              <span>Service:</span>
              <span>{booking.services[0]?.serviceName}</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Invoice Ref:</span>
              <span className="font-mono">{booking.bookingCode}-INV</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Total Paid:</span>
              <span className="font-extrabold text-black">₹{booking.totalAmount}</span>
            </div>
          </Card>

          {/* 1-5 STAR RATING & REVIEW (Requirement 24) */}
          <div className="p-4 bg-white rounded-3xl border border-[#EAEAE4] space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-black text-[#111111]">
                Rate Your Experience with {booking.professional?.name || 'our Pro'}
              </h4>
              <p className="text-[11px] text-[#6B6B6B]">Tap stars to rate</p>

              {/* Big Star Selector */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      playSoundEffect('pop');
                      setRating(star);
                    }}
                    className="p-1 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-[#FFAA00] fill-[#FFAA00]'
                          : 'text-[#DFDFD6]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#F8F8F5] rounded-xl flex items-center justify-between">
                <span>Timeliness:</span>
                <span className="font-extrabold text-black">⭐ 5.0</span>
              </div>
              <div className="p-2.5 bg-[#F8F8F5] rounded-xl flex items-center justify-between">
                <span>Cleanliness:</span>
                <span className="font-extrabold text-black">⭐ 5.0</span>
              </div>
              <div className="p-2.5 bg-[#F8F8F5] rounded-xl flex items-center justify-between">
                <span>Quality:</span>
                <span className="font-extrabold text-black">⭐ 5.0</span>
              </div>
              <div className="p-2.5 bg-[#F8F8F5] rounded-xl flex items-center justify-between">
                <span>Behavior:</span>
                <span className="font-extrabold text-black">⭐ 5.0</span>
              </div>
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Written Review
              </label>
              <textarea
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about the service..."
                className="w-full bg-[#F8F8F5] border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
              />
            </div>

            {/* Optional Tip */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Add an Optional Tip for Pro
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 30, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedTip(amt);
                    }}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                      selectedTip === amt
                        ? 'bg-black text-white shadow-2xs'
                        : 'bg-[#F1F1ED] text-[#6B6B6B] hover:text-black'
                    }`}
                  >
                    {amt === 0 ? 'No Tip' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleReviewSubmit}
            >
              Submit Rating & Collect Bonus XP (+50)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
