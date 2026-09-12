/**
 * POPCIX 8-Step Minimal Booking Flow Wizard
 * 1. Service -> 2. Options/Addons -> 3. Address -> 4. Booking Type -> 5. Date/Time Slot -> 6. Price Review & Coupon -> 7. Payment -> 8. Confirmation
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useGamification } from '../../context/GamificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Mascot } from '../../components/common/Mascot';
import {
  ArrowLeft,
  X,
  Check,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  Zap,
  Repeat,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { BookingType, ServiceVariant } from '../../types/marketplace';

export const BookingFlowModal: React.FC = () => {
  const {
    bookingDraft,
    bookingStep,
    setBookingStep,
    closeModal,
    toggleAddonInDraft,
    setBookingDraftAddress,
    setBookingDraftType,
    setBookingDraftSlot,
    applyCouponCode,
    removeCoupon,
    setPaymentMethod,
    confirmBooking,
    addresses,
    coupons,
    openLiveTracking,
  } = useMarketplace();

  const { addXpAndPoints } = useGamification();

  const [couponInput, setCouponInput] = useState<string>('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBookingResult, setConfirmedBookingResult] = useState<any>(null);

  if (!bookingDraft.service) return null;

  const totalSteps = 8;
  const progressPercent = Math.round((bookingStep / totalSteps) * 100);

  // Price calculations
  const basePrice = bookingDraft.service.startingPrice;
  const addonsTotal = bookingDraft.selectedVariants.reduce((sum, v) => sum + v.price, 0);
  const subtotal = basePrice + addonsTotal;
  const bundleDiscount = bookingDraft.selectedVariants.length > 0 ? 50 : 0;

  let couponDiscount = 0;
  if (bookingDraft.appliedCoupon) {
    if (bookingDraft.appliedCoupon.discountType === 'PERCENTAGE') {
      couponDiscount = Math.min(
        bookingDraft.appliedCoupon.maxDiscount || 9999,
        (subtotal * bookingDraft.appliedCoupon.discountValue) / 100
      );
    } else {
      couponDiscount = bookingDraft.appliedCoupon.discountValue;
    }
  }

  const taxAmount = Math.round((subtotal - bundleDiscount - couponDiscount) * 0.08 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - bundleDiscount - couponDiscount + taxAmount);

  // Slot dates generator
  const dates = [
    { label: 'Today', date: new Date().toISOString().split('T')[0] },
    {
      label: 'Tomorrow',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    },
    {
      label: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    },
  ];

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:30 PM - 05:30 PM',
    '07:00 PM - 08:00 PM',
  ];

  const handleNext = () => {
    triggerHaptic('light');
    playSoundEffect('pop');
    setBookingStep(bookingStep + 1);
  };

  const handleBack = () => {
    triggerHaptic('light');
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    } else {
      closeModal();
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMsg({ text: res.message, isSuccess: res.success });
  };

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    triggerHaptic('medium');

    try {
      const booking = await confirmBooking();
      addXpAndPoints(booking.xpEarned, booking.pointsEarned, 'Completed Booking Payment');
      setConfirmedBookingResult(booking);
      setIsProcessing(false);
      setBookingStep(8); // Step 8 Confirmation
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Wizard Header & Step Progress */}
        <div className="bg-white px-5 pt-4 pb-3 border-b border-[#EAEAE4] select-none">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </button>

            <span className="text-xs font-black text-[#111111] uppercase tracking-wider">
              Step {bookingStep} of {totalSteps}
            </span>

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

          <ProgressBar progress={progressPercent} color="violet" height="sm" />
        </div>

        {/* Wizard Step Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* STEP 1: SERVICE OVERVIEW */}
          {bookingStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#111111]">
                Selected Service
              </h2>
              <Card variant="surface" padding="lg">
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={bookingDraft.service.imageUrl}
                    alt={bookingDraft.service.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#EAEAE4]"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111111]">
                      {bookingDraft.service.name}
                    </h3>
                    <p className="text-xs font-medium text-[#6B6B6B]">
                      {bookingDraft.service.categoryName} • {bookingDraft.service.estimatedDurationMins}m
                    </p>
                    <span className="text-sm font-black text-black mt-1 inline-block">
                      ₹{bookingDraft.service.startingPrice}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#444444] bg-[#F8F8F5] p-3 rounded-xl">
                  {bookingDraft.service.shortDescription}
                </p>
              </Card>
            </div>
          )}

          {/* STEP 2: SERVICE STACKING & ADD-ONS */}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Stack Compatible Add-ons
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Combine items in one visit to get a ₹50 bundle discount!
                </p>
              </div>

              {bookingDraft.service.variants && bookingDraft.service.variants.length > 0 ? (
                <div className="space-y-2.5">
                  {bookingDraft.service.variants.map((v) => {
                    const isSelected = bookingDraft.selectedVariants.some((addon) => addon.id === v.id);
                    return (
                      <Card
                        key={v.id}
                        variant={isSelected ? 'accent-violet' : 'surface'}
                        padding="md"
                        className="cursor-pointer transition-all"
                        onClick={() => toggleAddonInDraft(v)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 pr-3">
                            <h4 className="text-xs font-bold text-[#111111]">{v.name}</h4>
                            <p className="text-[11px] text-[#6B6B6B]">{v.description}</p>
                            <span className="text-xs font-black text-black mt-1 inline-block">
                              +₹{v.price} ({v.durationMins}m)
                            </span>
                          </div>

                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-[#7C3AED] text-white' : 'bg-[#EAEAE4] text-black'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-white rounded-3xl text-center border border-[#EAEAE4]">
                  <p className="text-xs text-[#6B6B6B]">No additional add-ons needed for this job.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CHOOSE ADDRESS */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Select Address
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Where should the POPCIX Pro arrive?
                </p>
              </div>

              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = bookingDraft.selectedAddress.id === addr.id;
                  return (
                    <Card
                      key={addr.id}
                      variant={isSelected ? 'accent-amber' : 'surface'}
                      padding="md"
                      className="cursor-pointer transition-all"
                      onClick={() => {
                        triggerHaptic('light');
                        setBookingDraftAddress(addr);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-black/5 shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#111111]">{addr.label}</span>
                            {addr.isDefault && (
                              <Badge variant="black" size="sm">Default</Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#444444] font-medium mt-1">
                            {addr.streetAddress} {addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ''}
                          </p>
                          {addr.instructionsForPro && (
                            <p className="text-[11px] text-[#6B6B6B] mt-1 italic">
                              Note: "{addr.instructionsForPro}"
                            </p>
                          )}
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#FFAA00] border-[#FFAA00]' : 'border-[#DFDFD6]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CHOOSE BOOKING TYPE (Instant, Scheduled, Recurring) */}
          {bookingStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Choose Booking Type
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Pick how soon you'd like your service performed
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* INSTANT */}
                <Card
                  variant={bookingDraft.bookingType === 'INSTANT' ? 'accent-coral' : 'surface'}
                  padding="md"
                  className="cursor-pointer transition-all border-2"
                  onClick={() => setBookingDraftType('INSTANT')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-full bg-[#FF5757] text-white shrink-0 shadow-sm">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#111111]">INSTANT DISPATCH</h4>
                        <Badge variant="coral" size="sm">~30 Mins</Badge>
                      </div>
                      <p className="text-xs font-medium text-[#6B6B6B] mt-1">
                        Find the closest verified pro on radar for immediate doorstep arrival.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* SCHEDULED */}
                <Card
                  variant={bookingDraft.bookingType === 'SCHEDULED' ? 'accent-violet' : 'surface'}
                  padding="md"
                  className="cursor-pointer transition-all border-2"
                  onClick={() => setBookingDraftType('SCHEDULED')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-full bg-[#7C3AED] text-white shrink-0 shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#111111]">SCHEDULED VISIT</h4>
                      <p className="text-xs font-medium text-[#6B6B6B] mt-1">
                        Choose your exact preferred date & time slot with guaranteed technician allocation.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* RECURRING */}
                <Card
                  variant={bookingDraft.bookingType === 'RECURRING' ? 'accent-emerald' : 'surface'}
                  padding="md"
                  className="cursor-pointer transition-all border-2"
                  onClick={() => setBookingDraftType('RECURRING')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-full bg-[#10B981] text-white shrink-0 shadow-sm">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#111111]">RECURRING ROUTINE</h4>
                        <Badge variant="emerald" size="sm">Save 15%</Badge>
                      </div>
                      <p className="text-xs font-medium text-[#6B6B6B] mt-1">
                        Weekly, bi-weekly, or monthly repeat home care. Cancel or pause anytime.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* STEP 5: DATE & TIME SLOT */}
          {bookingStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Pick Date & Time
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Select the convenient slot for pro arrival
                </p>
              </div>

              {bookingDraft.bookingType === 'INSTANT' ? (
                <div className="p-6 bg-[#FEF2F2] border border-[#FECACA] rounded-3xl text-center space-y-2">
                  <Zap className="w-8 h-8 text-[#FF5757] mx-auto animate-bounce" />
                  <h4 className="text-sm font-extrabold text-[#991B1B]">
                    Instant Radar Activated
                  </h4>
                  <p className="text-xs text-[#B91C1C]">
                    Your job will be broadcast immediately to the nearest top-rated pro. Arrival estimated in 18-30 minutes.
                  </p>
                </div>
              ) : (
                <>
                  {/* Date selection pills */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#111111] mb-2 uppercase">
                      Select Date
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {dates.map((d) => {
                        const isSelected = bookingDraft.scheduledDate === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setBookingDraftSlot(d.date, bookingDraft.scheduledTimeSlot)}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              isSelected
                                ? 'bg-black text-white border-black font-extrabold shadow-sm'
                                : 'bg-white border-[#DFDFD6] text-[#6B6B6B] font-bold hover:text-black'
                            }`}
                          >
                            <span className="text-xs block">{d.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#111111] mb-2 uppercase">
                      Available Time Slots
                    </label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => {
                        const isSelected = bookingDraft.scheduledTimeSlot === slot;
                        return (
                          <div
                            key={slot}
                            onClick={() => setBookingDraftSlot(bookingDraft.scheduledDate, slot)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#F5F3FF] border-[#7C3AED] shadow-2xs font-extrabold text-[#5B21B6]'
                                : 'bg-white border-[#EAEAE4] text-[#444444] font-semibold hover:border-black'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="w-4 h-4 text-[#7C3AED]" />
                              <span>{slot}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#7C3AED]" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 6: PRICE REVIEW & COUPONS */}
          {bookingStep === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Price Breakdown
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  100% transparent pricing with zero hidden charges
                </p>
              </div>

              {/* Coupon input */}
              <div className="p-3 bg-white rounded-2xl border border-[#EAEAE4]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. STACKSAVE)"
                    className="flex-1 bg-[#F8F8F5] border border-[#DFDFD6] rounded-xl px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-black"
                  />
                  <Button variant="primary" size="sm" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] font-bold mt-2 ${
                      couponMsg.isSuccess ? 'text-[#10B981]' : 'text-[#FF5757]'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Available Coupons Shortcut */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {coupons.map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => {
                      setCouponInput(cp.code);
                      applyCouponCode(cp.code);
                    }}
                    className="px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] rounded-xl text-xs font-extrabold shrink-0 hover:scale-105 transition-transform"
                  >
                    🏷️ {cp.code} (Save ₹{cp.discountValue})
                  </button>
                ))}
              </div>

              {/* Summary Table */}
              <Card variant="surface" padding="md" className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#444444]">
                  <span>Service Base ({bookingDraft.service.name})</span>
                  <span className="font-bold">₹{basePrice}</span>
                </div>

                {bookingDraft.selectedVariants.map((v) => (
                  <div key={v.id} className="flex justify-between text-[#444444]">
                    <span>+ {v.name}</span>
                    <span className="font-bold">₹{v.price}</span>
                  </div>
                ))}

                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-[#7C3AED] font-bold">
                    <span>Bundle Stacking Discount</span>
                    <span>-₹{bundleDiscount}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#10B981] font-bold">
                    <span>Coupon Discount ({bookingDraft.appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Taxes & Service Fee (8%)</span>
                  <span>₹{taxAmount}</span>
                </div>

                <div className="pt-2 border-t border-[#EAEAE4] flex justify-between text-base font-black text-black">
                  <span>Grand Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 7: PAYMENT METHOD */}
          {bookingStep === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  Choose Payment
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Secured with 256-bit encryption. Never stores raw card data.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm / BHIM)', badge: 'Instant & Zero Fee' },
                  { id: 'CARD', label: 'Credit / Debit Card (Visa, Mastercard, RuPay)', badge: 'Secure' },
                  { id: 'NETBANKING', label: 'Net Banking (All Indian Banks)', badge: '' },
                  { id: 'WALLET', label: 'POPCIX Wallet / Amazon Pay', badge: '' },
                  { id: 'RAZORPAY', label: 'Razorpay Unified Checkout', badge: 'Popular' },
                ].map((pm) => {
                  const isSelected = bookingDraft.paymentMethod === pm.id;
                  return (
                    <Card
                      key={pm.id}
                      variant={isSelected ? 'accent-emerald' : 'surface'}
                      padding="md"
                      className="cursor-pointer transition-all"
                      onClick={() => {
                        triggerHaptic('light');
                        setPaymentMethod(pm.id as any);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#111111]">{pm.label}</span>
                          {pm.badge && (
                            <span className="block text-[10px] text-[#10B981] font-bold mt-0.5">
                              {pm.badge}
                            </span>
                          )}
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#10B981] border-[#10B981]' : 'border-[#DFDFD6]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="p-3 bg-[#F1F1ED] rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#6B6B6B]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>POPCIX 100% Money-Back Happiness Guarantee</span>
              </div>
            </div>
          )}

          {/* STEP 8: CONFIRMATION & CELEBRATION */}
          {bookingStep === 8 && (
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <Mascot mood="celebrating" size={120} />

              <Badge variant="emerald" size="lg" icon={<CheckCircle2 className="w-4 h-4" />}>
                BOOKING CONFIRMED! 🎉
              </Badge>

              <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                Your Home Care is Sorted!
              </h2>

              <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
                POPCIX Pro has received your request. You earned{' '}
                <span className="font-extrabold text-black">
                  +{confirmedBookingResult?.xpEarned || 120} XP
                </span>{' '}
                and{' '}
                <span className="font-extrabold text-black">
                  +{confirmedBookingResult?.pointsEarned || 50} Points
                </span>
                !
              </p>

              <Card variant="muted" padding="md" className="w-full text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Booking Code:</span>
                  <span className="font-extrabold text-black">
                    {confirmedBookingResult?.bookingCode || 'POP-78241'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Assigned Pro:</span>
                  <span className="font-extrabold text-black">
                    {confirmedBookingResult?.professional?.name || 'Rajesh Sharma'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Arrival Time:</span>
                  <span className="font-extrabold text-black">
                    {confirmedBookingResult?.estimatedArrivalTime || '18-25 mins'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Total Paid:</span>
                  <span className="font-extrabold text-black">
                    ₹{confirmedBookingResult?.totalAmount || totalAmount}
                  </span>
                </div>
              </Card>

              <Button
                variant="primary"
                size="xl"
                fullWidth
                onClick={() => {
                  closeModal();
                  if (confirmedBookingResult) {
                    openLiveTracking(confirmedBookingResult);
                  }
                }}
              >
                Track Live Booking 🚀
              </Button>
            </div>
          )}
        </div>

        {/* Wizard Footer Actions */}
        {bookingStep < 8 && (
          <div className="bg-white border-t border-[#EAEAE4] p-4 px-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6B6B6B]">Estimated Total</span>
              <div className="text-lg font-black text-black">₹{totalAmount}</div>
            </div>

            {bookingStep === 7 ? (
              <Button
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                onClick={handleFinalPayment}
                className="px-8 shadow-sm"
              >
                Pay & Confirm ₹{totalAmount}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                className="px-8 shadow-sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
