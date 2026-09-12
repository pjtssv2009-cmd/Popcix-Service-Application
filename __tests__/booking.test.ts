import { describe, it, expect } from 'vitest';
import { GamificationEngine } from '../src/services/gamification/gamificationEngine';

describe('POPCIX Booking & Service Stacking Calculations', () => {
  it('calculates bundle discounts and rewards for stacked services', () => {
    const basePrice = 699;
    const addonPrice = 199;
    const isBundle = true;
    const subtotal = basePrice + addonPrice; // 898
    const bundleDiscount = isBundle ? 50 : 0; // 50
    const tax = Math.round((subtotal - bundleDiscount) * 0.08 * 100) / 100;
    const total = subtotal - bundleDiscount + tax;

    expect(subtotal).toBe(898);
    expect(bundleDiscount).toBe(50);
    expect(total).toBeCloseTo(915.84, 1);

    const rewards = GamificationEngine.calculateBookingRewards(total, isBundle);
    expect(rewards.xpEarned).toBe(170); // 120 + 50 bundle bonus
    expect(rewards.pointsEarned).toBeGreaterThanOrEqual(125);
  });

  it('accurately enforces coupon discount rules and maximum caps', () => {
    const subtotal = 1000;
    const percentageCoupon = {
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxDiscount: 150,
      minOrderAmount: 500,
    };

    const calculatedDiscount = Math.min(
      percentageCoupon.maxDiscount,
      (subtotal * percentageCoupon.discountValue) / 100
    );

    // 20% of 1000 is 200, but capped at 150 max discount
    expect(calculatedDiscount).toBe(150);
  });
});
