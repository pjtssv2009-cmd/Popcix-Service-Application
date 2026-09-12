/**
 * POPCIX ADMIN - Type Definitions
 * Roles, Permissions, Bookings, KYC Queue, Live Ops, Pricing, Finance, Disputes & Auditing.
 */

export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'KYC_ADMIN'
  | 'CUSTOMER_SUPPORT'
  | 'FINANCE_ADMIN'
  | 'SERVICE_MANAGER'
  | 'PROFESSIONAL_MANAGER'
  | 'ANALYST';

export type AdminPermission = 
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES'
  | 'VIEW_LIVE_OPS'
  | 'REASSIGN_BOOKINGS'
  | 'CANCEL_BOOKINGS'
  | 'APPROVE_KYC'
  | 'REJECT_KYC'
  | 'MANAGE_SERVICES'
  | 'EDIT_PRICING'
  | 'MANAGE_ZONES'
  | 'VIEW_FINANCE'
  | 'PROCESS_REFUNDS'
  | 'APPROVE_PAYOUTS'
  | 'MANAGE_SUPPORT_TICKETS'
  | 'RESOLVE_DISPUTES'
  | 'MODERATE_REVIEWS'
  | 'MANAGE_GAMIFICATION'
  | 'SEND_BROADCAST_NOTIFICATIONS'
  | 'VIEW_ANALYTICS'
  | 'VIEW_AUDIT_LOGS'
  | 'TOGGLE_FEATURE_FLAGS';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string;
  department: string;
  lastLogin: string;
}

export type AdminBookingStatus = 
  | 'PENDING'
  | 'SEARCHING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface BookingTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'CUSTOMER' | 'PROFESSIONAL' | 'SYSTEM' | 'ADMIN';
}

export interface AdminBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhoneMasked: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerZone: string;
  serviceCategory: string;
  serviceName: string;
  professionalId?: string;
  professionalName?: string;
  professionalPhoneMasked?: string;
  professionalAvatar?: string;
  scheduledDate: string;
  scheduledTime: string;
  amount: number;
  baseAmount: number;
  addonAmount: number;
  platformFee: number;
  proEarnings: number;
  status: AdminBookingStatus;
  paymentMethod: 'ONLINE_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  timeline: BookingTimelineEvent[];
  adminNotes: string[];
  startOtp: string;
  completionOtp: string;
  coordinates?: { lat: number; lng: number };
  disputeReason?: string;
}

export interface LiveTechnicianPosition {
  proId: string;
  proName: string;
  category: string;
  status: 'AVAILABLE' | 'ON_WAY' | 'AT_JOB' | 'OFFLINE';
  activeBookingId?: string;
  customerFirstName?: string;
  serviceName?: string;
  etaMins?: number;
  coordinates: { lat: number; lng: number };
  batteryLevel?: number;
  lastPing: string;
}

export type AdminKYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_ACTION';

export interface AdminKYCDocument {
  id: string;
  documentType: 'Aadhaar Card' | 'PAN Card' | 'Trade Certificate' | 'Address Proof' | 'Police Verification';
  documentNumberMasked: string;
  fileUrl: string;
  verified: boolean;
  uploadedAt: string;
}

export interface AdminKYCApplication {
  id: string;
  proId: string;
  proName: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  experienceYears: number;
  status: AdminKYCStatus;
  submissionDate: string;
  documents: AdminKYCDocument[];
  assignedReviewer?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface AdminServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  professionalPayout: number;
  platformCommission: number;
  customerFee: number;
  isActive: boolean;
  checklist: string[];
  addons: { id: string; name: string; price: number; durationMin: number }[];
  serviceZones: string[];
  totalBookingsCount: number;
  avgRating: number;
}

export interface ServiceZone {
  id: string;
  country: string;
  state: string;
  city: string;
  zoneName: string;
  isActive: boolean;
  activeProsCount: number;
  activeBookingsCount: number;
  avgCompletionRate: number;
  localities: string[];
}

export interface PaymentTransactionRecord {
  id: string;
  transactionRef: string;
  bookingCode: string;
  customerName: string;
  amount: number;
  method: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'WALLET';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  timestamp: string;
  gatewayFee: number;
}

export interface RefundRequestRecord {
  id: string;
  refundCode: string;
  bookingCode: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  requestedAt: string;
  approvedBy?: string;
  resolvedAt?: string;
  adminNote?: string;
}

export interface PayoutRecord {
  id: string;
  payoutRef: string;
  proName: string;
  bankName: string;
  accountNumberMasked: string;
  amount: number;
  jobsCount: number;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
  scheduledDate: string;
  disbursedAt?: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketCode: string;
  category: 'BOOKING' | 'PAYMENT' | 'PROFESSIONAL' | 'CUSTOMER' | 'KYC' | 'SAFETY' | 'REFUND';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  subject: string;
  requesterName: string;
  requesterType: 'CUSTOMER' | 'PROFESSIONAL';
  bookingCode?: string;
  assignedAgent?: string;
  createdAt: string;
  lastReplyAt: string;
  messages: { id: string; sender: string; isAgent: boolean; text: string; time: string }[];
}

export interface DisputeRecord {
  id: string;
  disputeCode: string;
  bookingCode: string;
  customerName: string;
  proName: string;
  category: 'SERVICE_QUALITY' | 'EXTRA_CHARGE' | 'LATE_ARRIVAL' | 'BEHAVIOR' | 'DAMAGE' | 'INCOMPLETE_SERVICE';
  status: 'REPORTED' | 'UNDER_REVIEW' | 'EVIDENCE_REQUESTED' | 'DECISION_PENDING' | 'RESOLVED';
  claimAmount: number;
  reportedAt: string;
  summary: string;
  evidenceFiles: string[];
  resolution?: string;
}

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  resource: string;
  resourceId: string;
  previousState?: string;
  newState?: string;
  timestamp: string;
  ipAddress: string;
}

export interface FeatureFlag {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  targetAudience: 'ALL' | 'CITY_SPECIFIC' | 'BETA_PROS' | 'INTERNAL_ONLY';
  category: 'CORE' | 'GROWTH' | 'AI' | 'GAMIFICATION';
}
