/**
 * POPCIX PRO - Type Definitions
 * Shared types for Service Professionals, Jobs, KYC, Earnings, Gamification, and Training.
 */

export type ProCategory = 
  | 'AC Technician'
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Cleaner'
  | 'Pest Control Professional'
  | 'Appliance Technician'
  | 'Beauty Professional'
  | 'Painter';

export type KYCStatus = 
  | 'NOT_STARTED'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_ACTION';

export type ProLevel = 
  | 'Starter'
  | 'Rising Pro'
  | 'Skilled Pro'
  | 'Expert Pro'
  | 'Elite Pro'
  | 'AC HERO';

export type ProAvailabilityStatus = 'ONLINE' | 'OFFLINE' | 'ON_JOB' | 'ON_BREAK';

export interface ProProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  preferredLanguage: string;
  city: string;
  serviceZones: string[];
  primaryCategory: ProCategory;
  skills: string[];
  experienceYears: number;
  aboutText: string;
  isVerified: boolean;
  kycStatus: KYCStatus;
  kycRejectionReason?: string;
  availability: ProAvailabilityStatus;
  serviceRadiusKm: number;
  workingHours: {
    startTime: string; // '08:00'
    endTime: string;   // '20:00'
    daysAvailable: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };
  rating: number;
  ratingCount: number;
  completedJobsCount: number;
  completionRate: number; // e.g. 98.2 (%)
  onTimeRate: number;     // e.g. 96.5 (%)
  acceptanceRate: number; // e.g. 94.0 (%)
  cancellationRate: number; // e.g. 1.2 (%)
  level: ProLevel;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  streakActiveToday: boolean;
  weeklyTargetJobs: number;
  weeklyCompletedJobs: number;
  bankDetails: {
    bankName: string;
    accountHolderName: string;
    accountNumberMasked: string;
    ifscCode: string;
    isVerified: boolean;
    upiId?: string;
  };
  referralCode: string;
  optedIntoLeaderboard: boolean;
}

export type ProJobStatus = 
  | 'BROADCAST_PENDING' // Radar notification
  | 'ACCEPTED'          // Pro accepted
  | 'NAVIGATING'        // On the way to customer
  | 'ARRIVED'           // At customer doorstep, waiting for start OTP
  | 'IN_PROGRESS'       // Service ongoing with checklist
  | 'COMPLETED'         // Service completed, verified via completion OTP
  | 'CANCELLED'         // Cancelled with reason
  | 'DECLINED';         // Pro declined job

export interface JobChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  required: boolean;
}

export interface JobAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  status: 'PENDING_CUSTOMER_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedAt?: string;
}

export interface ProJob {
  id: string;
  bookingCode: string;
  category: ProCategory;
  serviceName: string;
  serviceDescription: string;
  customerFirstName: string;
  customerPhoneMasked: string;
  customerRating: number;
  customerAddressApprox: string;
  customerAddressFull?: string;
  customerInstructions?: string;
  customerCoordinates?: { lat: number; lng: number };
  distanceKm: number;
  estimatedDurationMin: number;
  scheduledDate: string; // 'Today', 'Tomorrow', '14 Sep'
  scheduledTime: string; // '4:00 PM'
  basePrice: number;
  platformFee: number;
  netPayout: number;
  status: ProJobStatus;
  startOtp: string;        // E.g. '4829'
  completionOtp: string;   // E.g. '7193'
  checklist: JobChecklistItem[];
  addons: JobAddon[];
  beforePhotos: string[];
  afterPhotos: string[];
  jobNotes?: string;
  paymentMode: 'ONLINE_PAID' | 'CASH_ON_DELIVERY' | 'UPI_COLLECTION';
  paymentCollected?: boolean;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  xpEarned?: number;
}

export interface ProEarningsSummary {
  todayEarnings: number;
  todayJobsCount: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  lifetimeEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  paidBalance: number;
  nextPayoutDate: string; // 'Friday, 18 Sep'
  nextPayoutAmount: number;
  breakdown: {
    baseEarnings: number;
    addons: number;
    bonuses: number;
    incentives: number;
    tips: number;
    platformFees: number;
  };
}

export interface PayoutTransaction {
  id: string;
  payoutDate: string;
  amount: number;
  referenceId: string;
  bankAccountMasked: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  jobIds: string[];
}

export interface ProBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'MILESTONE' | 'QUALITY' | 'SPEED' | 'STREAK' | 'HERO';
  unlockedAt?: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface ProChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  cashBonus?: number;
  currentValue: number;
  targetValue: number;
  deadline: string;
  completed: boolean;
  category: 'WEEKLY' | 'DAILY' | 'SPECIAL';
}

export interface TrainingLesson {
  id: string;
  title: string;
  category: 'Technical Skills' | 'Customer Service' | 'Safety' | 'Product Knowledge' | 'POPCIX Policies';
  durationMin: number;
  videoUrl?: string;
  thumbnail: string;
  completed: boolean;
  progressPercent: number;
  quizId?: string;
  summary: string;
}

export interface TrainingQuiz {
  id: string;
  title: string;
  questionsCount: number;
  passingScorePercent: number;
  userScorePercent?: number;
  passed: boolean;
  certificateName?: string;
}

export interface ProSupportTicket {
  id: string;
  ticketCode: string;
  category: 'ACTIVE_JOB' | 'PAYMENT' | 'CUSTOMER_ISSUE' | 'TECHNICAL' | 'KYC' | 'SAFETY';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  lastReplyAt: string;
  messagesCount: number;
}

export interface RepeatCustomerRecord {
  id: string;
  customerFirstName: string;
  totalServicesCount: number;
  lastServiceDate: string;
  lastServiceName: string;
  customerRatingGiven: number;
  isFavorite: boolean;
}
