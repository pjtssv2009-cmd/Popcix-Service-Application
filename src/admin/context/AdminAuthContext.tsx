/**
 * POPCIX ADMIN - Auth & Role-Based Access Control (RBAC) Context
 * Enforces server-aware permissions, tab access validation, and allows live testing of all 8 admin roles.
 */

import React, { createContext, useContext, useState } from 'react';
import { AdminUser, AdminRole, AdminPermission, AdminTab, RoleMetadata } from '../types/admin';
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

// Detailed Role Feature & Tab Access Metadata
export const ROLE_METADATA: Record<AdminRole, RoleMetadata> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    badge: 'FULL ACCESS',
    badgeColor: 'bg-black text-white',
    department: 'Executive Operations & Engineering',
    description: 'Unrestricted full platform authority across all 20 modules, feature flags & security controls.',
    primaryDomain: 'Ecosystem Governance',
    allowedTabs: [
      'dashboard', 'live-ops', 'bookings', 'customers', 'professionals', 'kyc',
      'services', 'zones', 'payments', 'payouts', 'refunds', 'support',
      'disputes', 'reviews', 'gamification', 'notifications', 'analytics',
      'audit-logs', 'feature-flags', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    keyCapabilities: [
      'Manage admin users & assign RBAC roles',
      'Toggle platform feature flags & kill-switches',
      'Direct dispatch, manual reassignments & booking cancellations',
      'Approve/reject technician KYC documents',
      'Process customer refunds & approve Friday partner payouts',
      'Catalogue pricing formula configuration',
      'System-wide emergency push broadcasts'
    ],
    restrictedCapabilities: []
  },
  OPERATIONS_ADMIN: {
    role: 'OPERATIONS_ADMIN',
    label: 'Operations Admin',
    badge: 'LIVE OPS & DISPATCH',
    badgeColor: 'bg-emerald-600 text-white',
    department: 'Field Operations & Dispatch',
    description: 'Fleet monitoring, active booking triage, manual reassignments, and zone operational management.',
    primaryDomain: 'Dispatch & Fleet Telemetry',
    allowedTabs: [
      'dashboard', 'live-ops', 'bookings', 'customers', 'professionals', 'zones',
      'support', 'disputes', 'notifications', 'analytics', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.OPERATIONS_ADMIN,
    keyCapabilities: [
      'Real-time GPS technician tracking & radar inspection',
      'Manual technician reassignment for stuck bookings',
      'Booking cancellation with admin resolution notes',
      'Geo-fencing & operational locality coverage',
      'Urgent operational broadcasts to field technicians',
      'Live operations performance analytics'
    ],
    restrictedCapabilities: [
      'Cannot approve/reject KYC documents',
      'Cannot approve Friday payouts or process wallet refunds',
      'Cannot edit service base pricing or commission formulas',
      'Cannot modify system feature flags'
    ]
  },
  KYC_ADMIN: {
    role: 'KYC_ADMIN',
    label: 'KYC & Verification Officer',
    badge: 'COMPLIANCE & VERIFICATION',
    badgeColor: 'bg-rose-600 text-white',
    department: 'Partner Onboarding & Legal Compliance',
    description: 'Technician identity verification, background check review, and Aadhaar/PAN compliance inspection.',
    primaryDomain: 'Partner Trust & Verification',
    allowedTabs: [
      'dashboard', 'kyc', 'professionals', 'audit-logs', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.KYC_ADMIN,
    keyCapabilities: [
      'Aadhaar & PAN document inspection drawer',
      'Approve technician onboarding applications',
      'Reject fraudulent or invalid verification requests',
      'Request document re-uploads with specific rejection reasons',
      'Review immutable compliance audit logs'
    ],
    restrictedCapabilities: [
      'Cannot dispatch or reassign bookings',
      'Cannot access financial ledgers or disburse payouts',
      'Cannot modify service catalogue or pricing',
      'Cannot resolve customer support disputes'
    ]
  },
  CUSTOMER_SUPPORT: {
    role: 'CUSTOMER_SUPPORT',
    label: 'Customer Support Lead',
    badge: 'CUSTOMER EXPERIENCE',
    badgeColor: 'bg-indigo-600 text-white',
    department: 'Customer Experience & Resolution',
    description: 'Support ticket resolution, customer-partner dispute arbitration, and review moderation.',
    primaryDomain: 'Helpdesk & Dispute Resolution',
    allowedTabs: [
      'dashboard', 'bookings', 'customers', 'support', 'disputes', 'reviews', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.CUSTOMER_SUPPORT,
    keyCapabilities: [
      'Manage & reply to live customer/technician support tickets',
      'Arbitrate service disputes and quality claims',
      'Moderate and hide abusive or fake reviews',
      'Inspect booking status and customer history',
      'Add internal resolution notes to tickets'
    ],
    restrictedCapabilities: [
      'Cannot approve KYC applications',
      'Cannot disburse weekly Friday partner payouts',
      'Cannot create or modify service offerings',
      'Cannot toggle platform feature flags'
    ]
  },
  FINANCE_ADMIN: {
    role: 'FINANCE_ADMIN',
    label: 'Finance & Payouts Admin',
    badge: 'TREASURY & PAYOUTS',
    badgeColor: 'bg-amber-600 text-white',
    department: 'Finance & Treasury',
    description: 'Gateway transaction reconciliation, customer refund approvals, and Friday technician batch payouts.',
    primaryDomain: 'Treasury & Revenue Reconciliation',
    allowedTabs: [
      'dashboard', 'payments', 'payouts', 'refunds', 'analytics', 'audit-logs', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.FINANCE_ADMIN,
    keyCapabilities: [
      'Inspect UPI, Card, and Net Banking payment transactions',
      'Approve and disburse weekly Friday technician payouts',
      'Export NEFT/IMPS payout batch CSV files',
      'Approve or decline customer refund requests',
      'Financial GMV, take-rate, and revenue analytics'
    ],
    restrictedCapabilities: [
      'Cannot reassign bookings or alter live dispatch',
      'Cannot approve KYC verification documents',
      'Cannot modify service pricing or catalogue',
      'Cannot edit service zone boundaries'
    ]
  },
  SERVICE_MANAGER: {
    role: 'SERVICE_MANAGER',
    label: 'Service & Pricing Manager',
    badge: 'CATALOGUE & PRICING',
    badgeColor: 'bg-teal-600 text-white',
    department: 'Category Management & Growth',
    description: 'Service catalogue structure, safety checklists, add-on pricing, and geo-zone pricing configuration.',
    primaryDomain: 'Category & Pricing Strategy',
    allowedTabs: [
      'dashboard', 'services', 'zones', 'gamification', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.SERVICE_MANAGER,
    keyCapabilities: [
      'Create and update service listings & descriptions',
      'Configure dynamic base pricing & partner commissions',
      'Define mandatory technician safety checklists',
      'Create add-on rate cards and package offerings',
      'Configure service zone coverage and surge settings'
    ],
    restrictedCapabilities: [
      'Cannot approve payouts or refund transactions',
      'Cannot approve KYC onboarding applications',
      'Cannot dispatch technicians or cancel active bookings',
      'Cannot toggle system feature flags'
    ]
  },
  PROFESSIONAL_MANAGER: {
    role: 'PROFESSIONAL_MANAGER',
    label: 'Professional Community Lead',
    badge: 'PRO GROWTH & GAMIFICATION',
    badgeColor: 'bg-purple-600 text-white',
    department: 'Partner Network & Engagement',
    description: 'Technician engagement, XP milestones, badges, streak gamification rules, and ratings moderation.',
    primaryDomain: 'Technician Network & Gamification',
    allowedTabs: [
      'dashboard', 'professionals', 'live-ops', 'gamification', 'reviews', 'notifications', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.PROFESSIONAL_MANAGER,
    keyCapabilities: [
      'Inspect technician performance, completion rates & earnings',
      'Configure XP multipliers, milestone badges, and tier perks',
      'Broadcast motivation & bonus notifications to technicians',
      'Moderate customer reviews and technician feedback',
      'Monitor live technician availability on field radar'
    ],
    restrictedCapabilities: [
      'Cannot approve KYC compliance documents',
      'Cannot disburse payouts or approve refunds',
      'Cannot modify service base pricing or catalogue structure',
      'Cannot toggle system feature flags'
    ]
  },
  ANALYST: {
    role: 'ANALYST',
    label: 'Business Intelligence Analyst',
    badge: 'READ-ONLY ANALYTICS',
    badgeColor: 'bg-zinc-600 text-white',
    department: 'Business Intelligence & Data Science',
    description: 'Read-only analytics, cohort retention, category split, booking volume trends, and immutable audit logs.',
    primaryDomain: 'BI, Reporting & Trend Analysis',
    allowedTabs: [
      'dashboard', 'analytics', 'bookings', 'payments', 'audit-logs', 'settings'
    ],
    permissions: ROLE_PERMISSIONS.ANALYST,
    keyCapabilities: [
      'Full access to analytics studio & GMV velocity graphs',
      'Inspect booking volumes and completion trends (Read-only)',
      'Inspect payment transaction history (Read-only)',
      'Review system audit logs and operational metrics',
      'Export reporting summaries'
    ],
    restrictedCapabilities: [
      'Read-only access: Cannot perform reassignments or cancellations',
      'Cannot approve or reject KYC documents',
      'Cannot approve payouts or process refunds',
      'Cannot edit catalogue, pricing, or system settings',
      'Cannot broadcast notifications'
    ]
  }
};

interface AdminAuthContextType {
  adminUser: AdminUser;
  currentRole: AdminRole;
  currentRoleMetadata: RoleMetadata;
  setRole: (role: AdminRole) => void;
  hasPermission: (permission: AdminPermission) => boolean;
  isTabAllowed: (tab: AdminTab) => boolean;
  getAllowedTabsForRole: (role: AdminRole) => AdminTab[];
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

  const isTabAllowed = (tab: AdminTab): boolean => {
    const meta = ROLE_METADATA[currentRole];
    if (!meta) return false;
    return meta.allowedTabs.includes(tab);
  };

  const getAllowedTabsForRole = (role: AdminRole): AdminTab[] => {
    return ROLE_METADATA[role]?.allowedTabs || [];
  };

  const signOut = () => {
    localStorage.removeItem('popcix_admin_user');
  };

  const currentRoleMetadata = ROLE_METADATA[currentRole] || ROLE_METADATA.SUPER_ADMIN;

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        currentRole,
        currentRoleMetadata,
        setRole,
        hasPermission,
        isTabAllowed,
        getAllowedTabsForRole,
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
