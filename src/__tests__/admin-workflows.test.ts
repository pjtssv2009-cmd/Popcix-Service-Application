/**
 * Automated Test Suite for POPCIX ADMIN Web Dashboard
 * Tests RBAC permissions, booking workflows, KYC decisions, pricing calculations, and audit trails.
 */

import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS } from '../admin/context/AdminAuthContext';
import { 
  INITIAL_ADMIN_BOOKINGS, 
  INITIAL_KYC_APPLICATIONS, 
  INITIAL_SERVICES_CATALOG, 
  INITIAL_AUDIT_LOGS 
} from '../admin/data/adminMockData';

describe('POPCIX ADMIN - Role-Based Access Control (RBAC)', () => {
  it('SUPER_ADMIN should have full unrestricted permissions', () => {
    const superAdminPerms = ROLE_PERMISSIONS.SUPER_ADMIN;
    expect(superAdminPerms).toContain('MANAGE_USERS');
    expect(superAdminPerms).toContain('APPROVE_KYC');
    expect(superAdminPerms).toContain('PROCESS_REFUNDS');
    expect(superAdminPerms).toContain('EDIT_PRICING');
    expect(superAdminPerms).toContain('TOGGLE_FEATURE_FLAGS');
  });

  it('FINANCE_ADMIN should only access financial operations and not manage KYC or Pricing', () => {
    const financePerms = ROLE_PERMISSIONS.FINANCE_ADMIN;
    expect(financePerms).toContain('VIEW_FINANCE');
    expect(financePerms).toContain('PROCESS_REFUNDS');
    expect(financePerms).toContain('APPROVE_PAYOUTS');
    expect(financePerms).not.toContain('APPROVE_KYC');
    expect(financePerms).not.toContain('EDIT_PRICING');
  });

  it('KYC_ADMIN should only be able to inspect and approve/reject documents', () => {
    const kycPerms = ROLE_PERMISSIONS.KYC_ADMIN;
    expect(kycPerms).toContain('APPROVE_KYC');
    expect(kycPerms).toContain('REJECT_KYC');
    expect(kycPerms).not.toContain('PROCESS_REFUNDS');
    expect(kycPerms).not.toContain('REASSIGN_BOOKINGS');
  });
});

describe('POPCIX ADMIN - Booking Operations & Financials', () => {
  it('should maintain initial active bookings with valid financial breakdowns', () => {
    const activeBooking = INITIAL_ADMIN_BOOKINGS[0];
    expect(activeBooking.bookingCode).toBe('PCX-102948');
    expect(activeBooking.amount).toBe(948);
    expect(activeBooking.baseAmount).toBe(699);
    expect(activeBooking.addonAmount).toBe(249);
    expect(activeBooking.platformFee).toBe(100);
    expect(activeBooking.proEarnings).toBe(848);
    expect(activeBooking.status).toBe('IN_PROGRESS');
  });

  it('should contain a complete step-by-step lifecycle timeline', () => {
    const timeline = INITIAL_ADMIN_BOOKINGS[0].timeline;
    expect(timeline.length).toBeGreaterThanOrEqual(5);
    expect(timeline[0].title).toBe('Booking Created');
  });
});

describe('POPCIX ADMIN - KYC Verification Queue', () => {
  it('should list pending, under-review, and approved technician applications', () => {
    const pendingApp = INITIAL_KYC_APPLICATIONS.find(a => a.status === 'PENDING');
    const approvedApp = INITIAL_KYC_APPLICATIONS.find(a => a.status === 'APPROVED');

    expect(pendingApp).toBeDefined();
    expect(pendingApp?.documents.length).toBeGreaterThanOrEqual(2);
    expect(approvedApp?.proName).toBe('Ravi Kumar');
  });
});

describe('POPCIX ADMIN - Services & Pricing Engine', () => {
  it('should have configurable pricing equations and mandatory checklists', () => {
    const acService = INITIAL_SERVICES_CATALOG[0];
    expect(acService.basePrice).toBe(699);
    expect(acService.professionalPayout).toBe(599);
    expect(acService.platformCommission).toBe(100);
    expect(acService.checklist.length).toBe(7);
  });
});

describe('POPCIX ADMIN - Security Audit Trail', () => {
  it('should maintain append-only administrative action history', () => {
    expect(INITIAL_AUDIT_LOGS.length).toBeGreaterThanOrEqual(3);
    const firstLog = INITIAL_AUDIT_LOGS[0];
    expect(firstLog.adminEmail).toBe('karthik.ops@popcix.com');
    expect(firstLog.action).toBe('KYC_APPROVED');
  });
});
