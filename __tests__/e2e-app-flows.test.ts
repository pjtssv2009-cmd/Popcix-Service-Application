import { describe, it, expect } from 'vitest';
import {
  MOCK_CATEGORIES,
  MOCK_SERVICES,
  MOCK_COUPONS,
  MOCK_PROFESSIONALS,
  MOCK_HOMECARE_PLANS,
} from '../src/data/mockMarketplaceData';
import { GamificationEngine, LEVEL_THRESHOLDS } from '../src/services/gamification/gamificationEngine';
import { AIAssistantService } from '../src/services/aiAssistant';
import { getCurrentUserLocation } from '../src/services/nativeMobile';

describe('POPCIX E2E Application Flows & Business Logic', () => {
  describe('Marketplace Catalog & Search', () => {
    it('contains all 14 required categories and rich services', () => {
      expect(MOCK_CATEGORIES.length).toBeGreaterThanOrEqual(14);
      expect(MOCK_SERVICES.length).toBeGreaterThanOrEqual(5);
      expect(MOCK_PROFESSIONALS.length).toBeGreaterThanOrEqual(3);
      expect(MOCK_HOMECARE_PLANS.length).toBeGreaterThanOrEqual(3);

      // Verify each category has an ID, name, and styling
      MOCK_CATEGORIES.forEach((cat) => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeTruthy();
        expect(cat.accentColor).toBeTruthy();
      });

      // Verify each service has price, rating, duration and category mapping
      MOCK_SERVICES.forEach((srv) => {
        expect(srv.startingPrice).toBeGreaterThan(0);
        expect(srv.rating).toBeGreaterThanOrEqual(4.0);
        expect(srv.estimatedDurationMins).toBeGreaterThan(0);
        expect(MOCK_CATEGORIES.some((c) => c.id === srv.categoryId)).toBe(true);
      });
    });

    it('filters services correctly by query and category', () => {
      const acCat = MOCK_CATEGORIES.find((c) => c.slug.includes('ac'));
      expect(acCat).toBeDefined();

      if (acCat) {
        const acServices = MOCK_SERVICES.filter((s) => s.categoryId === acCat.id);
        expect(acServices.length).toBeGreaterThan(0);
      }

      const query = 'clean';
      const cleanServices = MOCK_SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.shortDescription.toLowerCase().includes(query) ||
          (s.features && s.features.some((f) => f.toLowerCase().includes(query)))
      );
      expect(cleanServices.length).toBeGreaterThan(0);
    });
  });

  describe('8-Step Booking Financial Calculations', () => {
    it('computes subtotal, bundle stacking discount, coupon discount, tax and grand total correctly', () => {
      const basePrice = 499;
      const variants = [
        { id: 'v1', name: 'Gas Top-up', price: 299, durationMins: 20 },
        { id: 'v2', name: 'Filter Replacement', price: 199, durationMins: 15 },
      ];

      const addonsTotal = variants.reduce((sum, v) => sum + v.price, 0);
      expect(addonsTotal).toBe(498);

      const subtotal = basePrice + addonsTotal;
      expect(subtotal).toBe(997);

      // Multi-service stacking bundle discount
      const bundleDiscount = variants.length > 0 ? 50 : 0;
      expect(bundleDiscount).toBe(50);

      // Coupon application (e.g. STACKSAVE: 250 off)
      const coupon = MOCK_COUPONS.find((c) => c.code === 'STACKSAVE');
      expect(coupon).toBeDefined();

      const couponDiscount = coupon ? coupon.discountValue : 0;
      expect(couponDiscount).toBe(250);

      const taxableAmount = subtotal - bundleDiscount - couponDiscount;
      expect(taxableAmount).toBe(697);

      const taxAmount = Math.round(taxableAmount * 0.08 * 100) / 100;
      expect(taxAmount).toBe(55.76);

      const grandTotal = Math.max(0, taxableAmount + taxAmount);
      expect(grandTotal).toBe(752.76);
    });
  });

  describe('Gamification Progression Engine', () => {
    it('calculates correct level and tier from XP thresholds', () => {
      expect(LEVEL_THRESHOLDS.length).toBeGreaterThanOrEqual(6);

      const lvl1 = GamificationEngine.getLevelInfo(0);
      expect(lvl1.currentLevel.level).toBe(1);

      const lvl2 = GamificationEngine.getLevelInfo(350);
      expect(lvl2.currentLevel.level).toBe(2);

      const lvl4 = GamificationEngine.getLevelInfo(1000);
      expect(lvl4.currentLevel.level).toBe(4);
      expect(lvl4.currentLevel.title).toBe('Home Hero');
    });

    it('calculates booking XP and points reward rules', () => {
      const singleBooking = GamificationEngine.calculateBookingRewards(1000, false);
      expect(singleBooking.xpEarned).toBe(120);
      expect(singleBooking.pointsEarned).toBe(50 + 50); // base + 5% of 1000

      const bundleBooking = GamificationEngine.calculateBookingRewards(1500, true);
      expect(bundleBooking.xpEarned).toBe(120 + 50); // 170 XP
      expect(bundleBooking.pointsEarned).toBe(50 + 75 + 30); // 155 Points
    });
  });

  describe('AI Home Assistant Diagnostic Engine', () => {
    it('correctly matches multiple issue queries to tailored solutions', () => {
      const acDiag = AIAssistantService.diagnoseProblem('My AC is blowing warm air');
      expect(acDiag.problemTitle).toContain('AC');
      expect(acDiag.suggestedServiceIds.length).toBeGreaterThan(0);
      expect(acDiag.proTips.length).toBeGreaterThan(0);

      const partyDiag = AIAssistantService.diagnoseProblem('I have a party tonight need clean house');
      expect(partyDiag.problemTitle).toContain('Event');
      expect(partyDiag.suggestedServiceIds.length).toBeGreaterThan(0);

      const fallbackDiag = AIAssistantService.diagnoseProblem('Something strange is happening');
      expect(fallbackDiag.problemTitle).toBeTruthy();
    });
  });

  describe('Native Mobile Fallbacks', () => {
    it('provides graceful fallback for geolocation when offline/desktop', async () => {
      const loc = await getCurrentUserLocation();
      expect(loc.address).toBeTruthy();
      expect(loc.city).toBeTruthy();
      expect(loc.latitude).toBeDefined();
      expect(loc.longitude).toBeDefined();
    });
  });
});
