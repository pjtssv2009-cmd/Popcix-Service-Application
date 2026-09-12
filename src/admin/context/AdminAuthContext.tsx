/**
 * POPCIX ADMIN - Auth & Role-Based Access Control (RBAC) Context
 * Enforces server-aware permissions and allows instant live testing of all 8 admin roles.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole, AdminPermission } from '../types/admin';
import { CURRENT_ADMIN_USER } from '../data/adminMockData';

// Granular RBAC Permissions Mapping
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    'MANAGE_USERS', 'MANAGE_ROLES', 'VIEW_LIVE_OPS', 'REASSIGN_BOOKINGS', 'CANCEL_BOOKINGS',
    'APPROVE_KYC', 'REJECT_KYC', 'MANAGE_SERVICES', 'EDIT_PRICING', 'MANAGE_ZONES',
    'VIEW_FINANCE', 'PROCESS_REFUNDS', 'APPROVE_PAYOUTS', 'MANAGE_SUPPORT_TICKETS',
    'RESOLVE_DISPUTES', 'MODERATE_REVIEWS', 'MANAGE_GAMIFICATION', 'SEND_BROADCAST_NOTIFICATIONS',
    'VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS', 'TOGGLE_FEATURE_FLAGS'
  ],
  OPERATIONS_ADMIN: [
    'VIEW_LIVE_OPS', 'REASSIGN_BOOKINGS', 'CANCEL_BOOKINGS', 'MANAGE_ZONES',
    'MANAGE_SUPPORT_TICKETS', 'RESOLVE_DISPUTES', 'SEND_BROADCAST_NOTIFICATIONS', 'VIEW_ANALYTICS'
  ],
  KYC_ADMIN: [
    'APPROVE_KYC', 'REJECT_KYC', 'VIEW_AUDIT_LOGS'
  ],
  CUSTOMER_SUPPORT: [
    'VIEW_LIVE_OPS', 'REASSIGN_BOOKINGS', 'CANCEL_BOOKINGS', 'MANAGE_SUPPORT_TICKETS',
    'RESOLVE_DISPUTES', 'MODERATE_REVIEWS'
  ],
  FINANCE_ADMIN: [
    'VIEW_FINANCE', 'PROCESS_REFUNDS', 'APPROVE_PAYOUTS', 'VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS'
  ],
  SERVICE_MANAGER: [
    'MANAGE_SERVICES', 'EDIT_PRICING', 'MANAGE_ZONES', 'MANAGE_GAMIFICATION'
  ],
  PROFESSIONAL_MANAGER: [
    'VIEW_LIVE_OPS', 'MANAGE_GAMIFICATION', 'SEND_BROADCAST_NOTIFICATIONS', 'MODERATE_REVIEWS'
  ],
  ANALYST: [
    'VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS'
  ]
};

interface AdminAuthContextType {
  adminUser: AdminUser;
  currentRole: AdminRole;
  setRole: (role: AdminRole) => void;
  hasPermission: (permission: AdminPermission) => boolean;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem('popcix_admin_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CURRENT_ADMIN_USER;
  });

  const [currentRole, setCurrentRole] = useState<AdminRole>(adminUser.role);

  const setRole = (role: AdminRole) => {
    setCurrentRole(role);
    setAdminUser(prev => {
      const updated = { ...prev, role };
      localStorage.setItem('popcix_admin_user', JSON.stringify(updated));
      return updated;
    });
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    const allowed = ROLE_PERMISSIONS[currentRole] || [];
    return allowed.includes(permission);
  };

  const signOut = () => {
    localStorage.removeItem('popcix_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        currentRole,
        setRole,
        hasPermission,
        signOut
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
}
