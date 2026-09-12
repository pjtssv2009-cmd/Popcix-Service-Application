/**
 * POPCIX Marketplace & Booking Domain Types
 */

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  accentColor: string;
  displayOrder: number;
}

export interface ServiceVariant {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  price: number;
  durationMins: number;
  isAddon: boolean;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullOverview: string;
  startingPrice: number;
  originalPrice?: number;
  estimatedDurationMins: number;
  rating: number;
  reviewsCount: number;
  bookingsCount: number;
  imageUrl: string;
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  safetyProtocols: string[];
  faqs: { question: string; answer: string }[];
  variants?: ServiceVariant[];
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  profilePhotoUrl: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  yearsExperience: number;
  bio: string;
  skills: string[];
  languages: string[];
  serviceArea: string;
  responseRate: string;
  isVerified: boolean;
  isAvailable: boolean;
  estimatedArrivalMins?: number;
  distanceKm?: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other' | string;
  streetAddress: string;
  apartmentSuite?: string;
  landmark?: string;
  city: string;
  postalCode: string;
  instructionsForPro?: string;
  isDefault: boolean;
}

export type BookingType = 'INSTANT' | 'SCHEDULED' | 'RECURRING';

export type BookingStatus =
  | 'CONFIRMED'
  | 'PRO_ASSIGNED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'SERVICE_STARTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export interface BookingItem {
  id: string;
  serviceId: string;
  serviceName: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  isBundleAddon?: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  services: BookingItem[];
  professional?: Professional;
  address: Address;
  bookingType: BookingType;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  estimatedArrivalTime?: string;
  subtotal: number;
  discountAmount: number;
  bundleDiscountAmount: number;
  taxAmount: number;
  totalAmount: number;
  tipAmount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'RAZORPAY';
  pointsEarned: number;
  xpEarned: number;
  specialNotes?: string;
  createdAt: string;
  completedAt?: string;
  isReviewed?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  validUntil: string;
}

export interface HomeCarePlan {
  id: string;
  tier: 'BASIC' | 'PLUS' | 'PREMIUM';
  name: string;
  monthlyPrice: number;
  billingPeriod: 'MONTHLY' | 'ANNUAL';
  includedServicesCount: number;
  discountPercentage: number;
  perks: string[];
  isRecommended?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'BOOKING' | 'PROFESSIONAL' | 'PAYMENT' | 'REWARDS' | 'SUBSCRIPTION' | 'OFFERS' | 'REMINDER' | 'MAINTENANCE' | 'SECURITY';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
