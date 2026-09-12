/**
 * POPCIX ADMIN - Operations Data Context
 * Central marketplace state management with real-time mutations and immutable audit logging.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AdminBooking, 
  LiveTechnicianPosition, 
  AdminKYCApplication, 
  AdminServiceItem, 
  ServiceZone, 
  PaymentTransactionRecord, 
  RefundRequestRecord, 
  PayoutRecord, 
  SupportTicketRecord, 
  DisputeRecord, 
  AuditLogEntry, 
  FeatureFlag,
  AdminBookingStatus
} from '../types/admin';
import { 
  INITIAL_ADMIN_BOOKINGS, 
  LIVE_TECHNICIAN_POSITIONS, 
  INITIAL_KYC_APPLICATIONS, 
  INITIAL_SERVICES_CATALOG, 
  INITIAL_SERVICE_ZONES, 
  INITIAL_PAYMENT_TRANSACTIONS, 
  INITIAL_REFUND_REQUESTS, 
  INITIAL_PAYOUT_RECORDS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_DISPUTES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_FEATURE_FLAGS 
} from '../data/adminMockData';
import { useAdminAuth } from './AdminAuthContext';

interface AdminDataContextType {
  bookings: AdminBooking[];
  liveTechnicians: LiveTechnicianPosition[];
  kycApplications: AdminKYCApplication[];
  services: AdminServiceItem[];
  zones: ServiceZone[];
  payments: PaymentTransactionRecord[];
  refunds: RefundRequestRecord[];
  payouts: PayoutRecord[];
  supportTickets: SupportTicketRecord[];
  disputes: DisputeRecord[];
  auditLogs: AuditLogEntry[];
  featureFlags: FeatureFlag[];
  reassignBooking: (bookingId: string, newProId: string, newProName: string) => void;
  updateBookingStatus: (bookingId: string, status: AdminBookingStatus, note?: string) => void;
  addBookingNote: (bookingId: string, note: string) => void;
  updateKYCStatus: (appId: string, status: AdminKYCApplication['status'], reason?: string) => void;
  updateServicePricing: (serviceId: string, basePrice: number, proPayout: number, platformFee: number) => void;
  toggleServiceActive: (serviceId: string) => void;
  toggleZoneActive: (zoneId: string) => void;
  processRefund: (refundId: string, approve: boolean, note?: string) => void;
  replyToSupportTicket: (ticketId: string, message: string) => void;
  resolveDispute: (disputeId: string, resolution: string) => void;
  toggleFeatureFlag: (key: string) => void;
  logAuditAction: (action: string, resource: string, resourceId: string, prev?: string, next?: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { adminUser } = useAdminAuth();

  const [bookings, setBookings] = useState<AdminBooking[]>(INITIAL_ADMIN_BOOKINGS);
  const [liveTechnicians] = useState<LiveTechnicianPosition[]>(LIVE_TECHNICIAN_POSITIONS);
  const [kycApplications, setKycApplications] = useState<AdminKYCApplication[]>(INITIAL_KYC_APPLICATIONS);
  const [services, setServices] = useState<AdminServiceItem[]>(INITIAL_SERVICES_CATALOG);
  const [zones, setZones] = useState<ServiceZone[]>(INITIAL_SERVICE_ZONES);
  const [payments] = useState<PaymentTransactionRecord[]>(INITIAL_PAYMENT_TRANSACTIONS);
  const [refunds, setRefunds] = useState<RefundRequestRecord[]>(INITIAL_REFUND_REQUESTS);
  const [payouts] = useState<PayoutRecord[]>(INITIAL_PAYOUT_RECORDS);
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>(INITIAL_SUPPORT_TICKETS);
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(INITIAL_FEATURE_FLAGS);

  const logAuditAction = (action: string, resource: string, resourceId: string, prev?: string, next?: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      adminEmail: adminUser.email,
      adminRole: adminUser.role,
      action,
      resource,
      resourceId,
      previousState: prev,
      newState: next,
      timestamp: `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST`,
      ipAddress: '103.14.24.88'
    };
    setAuditLogs(current => [newEntry, ...current]);
  };

  const reassignBooking = (bookingId: string, newProId: string, newProName: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        logAuditAction('BOOKING_REASSIGNED', 'bookings', b.bookingCode, b.professionalName, newProName);
        return {
          ...b,
          professionalId: newProId,
          professionalName: newProName,
          status: 'ASSIGNED',
          timeline: [
            ...b.timeline,
            {
              id: `t_${Date.now()}`,
              timestamp: 'Just now',
              title: 'Reassigned by Admin',
              description: `Admin ${adminUser.name} reassigned to ${newProName}`,
              actor: 'ADMIN'
            }
          ]
        };
      }
      return b;
    }));
  };

  const updateBookingStatus = (bookingId: string, status: AdminBookingStatus, note?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        logAuditAction('BOOKING_STATUS_CHANGED', 'bookings', b.bookingCode, b.status, status);
        return {
          ...b,
          status,
          adminNotes: note ? [...b.adminNotes, note] : b.adminNotes,
          timeline: [
            ...b.timeline,
            {
              id: `t_${Date.now()}`,
              timestamp: 'Just now',
              title: `Status Changed to ${status}`,
              description: note || `Updated by ${adminUser.name}`,
              actor: 'ADMIN'
            }
          ]
        };
      }
      return b;
    }));
  };

  const addBookingNote = (bookingId: string, note: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, adminNotes: [...b.adminNotes, note] };
      }
      return b;
    }));
  };

  const updateKYCStatus = (appId: string, status: AdminKYCApplication['status'], reason?: string) => {
    setKycApplications(prev => prev.map(a => {
      if (a.id === appId) {
        logAuditAction('KYC_STATUS_UPDATED', 'kyc_applications', a.proName, a.status, status);
        return {
          ...a,
          status,
          assignedReviewer: adminUser.name,
          rejectionReason: reason
        };
      }
      return a;
    }));
  };

  const updateServicePricing = (serviceId: string, basePrice: number, proPayout: number, platformFee: number) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        logAuditAction('SERVICE_PRICING_UPDATED', 'services', s.title, `₹${s.basePrice}`, `₹${basePrice}`);
        return { ...s, basePrice, professionalPayout: proPayout, platformCommission: platformFee };
      }
      return s;
    }));
  };

  const toggleServiceActive = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const next = !s.isActive;
        logAuditAction('SERVICE_AVAILABILITY_TOGGLED', 'services', s.title, `${s.isActive}`, `${next}`);
        return { ...s, isActive: next };
      }
      return s;
    }));
  };

  const toggleZoneActive = (zoneId: string) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const next = !z.isActive;
        logAuditAction('ZONE_STATUS_TOGGLED', 'service_zones', z.zoneName, `${z.isActive}`, `${next}`);
        return { ...z, isActive: next };
      }
      return z;
    }));
  };

  const processRefund = (refundId: string, approve: boolean, note?: string) => {
    setRefunds(prev => prev.map(r => {
      if (r.id === refundId) {
        const newStatus = approve ? 'COMPLETED' : 'REJECTED';
        logAuditAction('REFUND_PROCESSED', 'refunds', r.refundCode, r.status, newStatus);
        return {
          ...r,
          status: newStatus,
          approvedBy: adminUser.name,
          resolvedAt: new Date().toISOString(),
          adminNote: note
        };
      }
      return r;
    }));
  };

  const replyToSupportTicket = (ticketId: string, message: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          lastReplyAt: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `m_${Date.now()}`,
              sender: `${adminUser.name} (${adminUser.role})`,
              isAgent: true,
              text: message,
              time: 'Just now'
            }
          ]
        };
      }
      return t;
    }));
  };

  const resolveDispute = (disputeId: string, resolution: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        logAuditAction('DISPUTE_RESOLVED', 'disputes', d.disputeCode, d.status, 'RESOLVED');
        return { ...d, status: 'RESOLVED', resolution };
      }
      return d;
    }));
  };

  const toggleFeatureFlag = (key: string) => {
    setFeatureFlags(prev => prev.map(f => {
      if (f.key === key) {
        const next = !f.enabled;
        logAuditAction('FEATURE_FLAG_TOGGLED', 'feature_flags', f.title, `${f.enabled}`, `${next}`);
        return { ...f, enabled: next };
      }
      return f;
    }));
  };

  return (
    <AdminDataContext.Provider
      value={{
        bookings,
        liveTechnicians,
        kycApplications,
        services,
        zones,
        payments,
        refunds,
        payouts,
        supportTickets,
        disputes,
        auditLogs,
        featureFlags,
        reassignBooking,
        updateBookingStatus,
        addBookingNote,
        updateKYCStatus,
        updateServicePricing,
        toggleServiceActive,
        toggleZoneActive,
        processRefund,
        replyToSupportTicket,
        resolveDispute,
        toggleFeatureFlag,
        logAuditAction
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return ctx;
}
