import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, ROLE_METADATA } from '../admin/context/AdminAuthContext';
import { AdminRole, AdminTab } from '../admin/types/admin';

describe('POPCIX ADMIN - Role-Based Access Control (RBAC) & Feature Assignment Matrix', () => {
  const allRoles: AdminRole[] = [
    'SUPER_ADMIN',
    'OPERATIONS_ADMIN',
    'KYC_ADMIN',
    'CUSTOMER_SUPPORT',
    'FINANCE_ADMIN',
    'SERVICE_MANAGER',
    'PROFESSIONAL_MANAGER',
    'ANALYST'
  ];

  it('verifies all 8 roles have registered metadata and distinct department assignments', () => {
    allRoles.forEach(role => {
      const meta = ROLE_METADATA[role];
      expect(meta).toBeDefined();
      expect(meta.role).toBe(role);
      expect(meta.label).toBeTruthy();
      expect(meta.department).toBeTruthy();
      expect(meta.allowedTabs.length).toBeGreaterThan(0);
      expect(meta.keyCapabilities.length).toBeGreaterThan(0);
    });
  });

  it('verifies SUPER_ADMIN has full unrestricted access to all 20 platform tabs', () => {
    const superAdmin = ROLE_METADATA.SUPER_ADMIN;
    expect(superAdmin.allowedTabs.length).toBe(20);
    expect(superAdmin.restrictedCapabilities.length).toBe(0);
    expect(superAdmin.permissions).toContain('TOGGLE_FEATURE_FLAGS');
    expect(superAdmin.permissions).toContain('APPROVE_PAYOUTS');
    expect(superAdmin.permissions).toContain('APPROVE_KYC');
    expect(superAdmin.permissions).toContain('REASSIGN_BOOKINGS');
  });

  it('verifies OPERATIONS_ADMIN has dispatch and live-ops access but is restricted from finance and KYC', () => {
    const ops = ROLE_METADATA.OPERATIONS_ADMIN;
    expect(ops.allowedTabs).toContain('live-ops');
    expect(ops.allowedTabs).toContain('bookings');
    expect(ops.allowedTabs).toContain('zones');
    expect(ops.permissions).toContain('VIEW_LIVE_OPS');
    expect(ops.permissions).toContain('REASSIGN_BOOKINGS');

    // Forbidden
    expect(ops.allowedTabs).not.toContain('kyc');
    expect(ops.allowedTabs).not.toContain('payouts');
    expect(ops.allowedTabs).not.toContain('feature-flags');
    expect(ops.permissions).not.toContain('APPROVE_KYC');
    expect(ops.permissions).not.toContain('APPROVE_PAYOUTS');
    expect(ops.permissions).not.toContain('TOGGLE_FEATURE_FLAGS');
  });

  it('verifies KYC_ADMIN has document verification authority but cannot dispatch or disburse funds', () => {
    const kyc = ROLE_METADATA.KYC_ADMIN;
    expect(kyc.allowedTabs).toContain('kyc');
    expect(kyc.allowedTabs).toContain('audit-logs');
    expect(kyc.permissions).toContain('APPROVE_KYC');
    expect(kyc.permissions).toContain('REJECT_KYC');

    // Forbidden
    expect(kyc.allowedTabs).not.toContain('live-ops');
    expect(kyc.allowedTabs).not.toContain('payments');
    expect(kyc.allowedTabs).not.toContain('payouts');
    expect(kyc.allowedTabs).not.toContain('services');
    expect(kyc.permissions).not.toContain('VIEW_LIVE_OPS');
    expect(kyc.permissions).not.toContain('APPROVE_PAYOUTS');
  });

  it('verifies CUSTOMER_SUPPORT can manage tickets & disputes but cannot execute financial payouts or KYC approvals', () => {
    const support = ROLE_METADATA.CUSTOMER_SUPPORT;
    expect(support.allowedTabs).toContain('support');
    expect(support.allowedTabs).toContain('disputes');
    expect(support.allowedTabs).toContain('reviews');
    expect(support.permissions).toContain('MANAGE_SUPPORT_TICKETS');
    expect(support.permissions).toContain('RESOLVE_DISPUTES');

    // Forbidden
    expect(support.allowedTabs).not.toContain('payouts');
    expect(support.allowedTabs).not.toContain('kyc');
    expect(support.allowedTabs).not.toContain('feature-flags');
    expect(support.permissions).not.toContain('APPROVE_PAYOUTS');
    expect(support.permissions).not.toContain('APPROVE_KYC');
  });

  it('verifies FINANCE_ADMIN can manage payments, Friday payouts, and refunds', () => {
    const finance = ROLE_METADATA.FINANCE_ADMIN;
    expect(finance.allowedTabs).toContain('payments');
    expect(finance.allowedTabs).toContain('payouts');
    expect(finance.allowedTabs).toContain('refunds');
    expect(finance.permissions).toContain('VIEW_FINANCE');
    expect(finance.permissions).toContain('APPROVE_PAYOUTS');
    expect(finance.permissions).toContain('PROCESS_REFUNDS');

    // Forbidden
    expect(finance.allowedTabs).not.toContain('live-ops');
    expect(finance.allowedTabs).not.toContain('kyc');
    expect(finance.allowedTabs).not.toContain('services');
    expect(finance.permissions).not.toContain('VIEW_LIVE_OPS');
    expect(finance.permissions).not.toContain('APPROVE_KYC');
    expect(finance.permissions).not.toContain('MANAGE_SERVICES');
  });

  it('verifies SERVICE_MANAGER can manage catalogue pricing & checklists but cannot disburse payouts', () => {
    const sm = ROLE_METADATA.SERVICE_MANAGER;
    expect(sm.allowedTabs).toContain('services');
    expect(sm.allowedTabs).toContain('zones');
    expect(sm.allowedTabs).toContain('gamification');
    expect(sm.permissions).toContain('MANAGE_SERVICES');
    expect(sm.permissions).toContain('EDIT_PRICING');
    expect(sm.permissions).toContain('MANAGE_ZONES');

    // Forbidden
    expect(sm.allowedTabs).not.toContain('payouts');
    expect(sm.allowedTabs).not.toContain('kyc');
    expect(sm.permissions).not.toContain('APPROVE_PAYOUTS');
    expect(sm.permissions).not.toContain('APPROVE_KYC');
  });

  it('verifies PROFESSIONAL_MANAGER can configure streaks, badges, and push notifications', () => {
    const pm = ROLE_METADATA.PROFESSIONAL_MANAGER;
    expect(pm.allowedTabs).toContain('professionals');
    expect(pm.allowedTabs).toContain('gamification');
    expect(pm.allowedTabs).toContain('notifications');
    expect(pm.allowedTabs).toContain('reviews');
    expect(pm.permissions).toContain('MANAGE_GAMIFICATION');
    expect(pm.permissions).toContain('SEND_BROADCAST_NOTIFICATIONS');
    expect(pm.permissions).toContain('MODERATE_REVIEWS');

    // Forbidden
    expect(pm.allowedTabs).not.toContain('payouts');
    expect(pm.allowedTabs).not.toContain('services');
    expect(pm.permissions).not.toContain('APPROVE_PAYOUTS');
    expect(pm.permissions).not.toContain('MANAGE_SERVICES');
  });

  it('verifies ANALYST is strictly read-only and has zero mutating execute permissions', () => {
    const analyst = ROLE_METADATA.ANALYST;
    expect(analyst.allowedTabs).toContain('analytics');
    expect(analyst.allowedTabs).toContain('dashboard');
    expect(analyst.allowedTabs).toContain('audit-logs');
    expect(analyst.permissions).toEqual(['VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS']);

    // Strictly no mutating actions
    expect(analyst.permissions).not.toContain('REASSIGN_BOOKINGS');
    expect(analyst.permissions).not.toContain('CANCEL_BOOKINGS');
    expect(analyst.permissions).not.toContain('APPROVE_KYC');
    expect(analyst.permissions).not.toContain('APPROVE_PAYOUTS');
    expect(analyst.permissions).not.toContain('PROCESS_REFUNDS');
    expect(analyst.permissions).not.toContain('EDIT_PRICING');
    expect(analyst.permissions).not.toContain('TOGGLE_FEATURE_FLAGS');
  });
});
