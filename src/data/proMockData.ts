/**
 * POPCIX PRO - Mock Data & Initial State
 * Realistic operational data for service professionals.
 */

import { 
  ProProfile, 
  ProJob, 
  ProEarningsSummary, 
  PayoutTransaction, 
  ProBadge, 
  ProChallenge, 
  TrainingLesson, 
  TrainingQuiz,
  ProSupportTicket,
  RepeatCustomerRecord
} from '../types/pro';

export const INITIAL_PRO_PROFILE: ProProfile = {
  id: 'pro_ravi_84920',
  userId: 'usr_pro_0912',
  name: 'Ravi Kumar',
  phone: '+91 98401 23456',
  email: 'ravi.kumar@popcixpro.in',
  avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  gender: 'MALE',
  preferredLanguage: 'English / Tamil',
  city: 'Chennai',
  serviceZones: ['OMR', 'Sholinganallur', 'Perungudi', 'Thoraipakkam', 'Velachery', 'Medavakkam'],
  primaryCategory: 'AC Technician',
  skills: [
    'Split AC Deep Cleaning',
    'Window AC Service',
    'Gas Leakage Repair',
    'Compressor Replacement',
    'PCB Circuit Repair',
    'Inverter AC Specialist',
    'Uninstallation & Relocation'
  ],
  experienceYears: 4,
  aboutText: 'Certified HVAC & Inverter AC Specialist with over 4 years of hands-on experience across Daikin, Voltas, LG and Blue Star systems. Committed to 100% on-time service and spotless cleanup.',
  isVerified: true,
  kycStatus: 'APPROVED',
  availability: 'ONLINE',
  serviceRadiusKm: 12,
  workingHours: {
    startTime: '08:30',
    endTime: '19:30',
    daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  rating: 4.86,
  ratingCount: 842,
  completedJobsCount: 1284,
  completionRate: 98.4,
  onTimeRate: 96.8,
  acceptanceRate: 94.5,
  cancellationRate: 1.1,
  level: 'AC HERO',
  xp: 8420,
  nextLevelXp: 10000,
  streakDays: 6,
  streakActiveToday: true,
  weeklyTargetJobs: 30,
  weeklyCompletedJobs: 23,
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountHolderName: 'RAVI KUMAR',
    accountNumberMasked: '•••• •••• 8492',
    ifscCode: 'HDFC0001245',
    isVerified: true,
    upiId: 'ravikumar84@okhdfcbank'
  },
  referralCode: 'RAVI-HERO99',
  optedIntoLeaderboard: true
};

export const INITIAL_PRO_JOBS: ProJob[] = [
  {
    id: 'job_active_01',
    bookingCode: 'PX-7729',
    category: 'AC Technician',
    serviceName: 'Split AC Deep Cleaning & Foam Jet Wash',
    serviceDescription: 'Complete indoor unit foam wash, blower fan degreasing, condenser jet spray and cooling efficiency test.',
    customerFirstName: 'Siddharth',
    customerPhoneMasked: '+91 98840 •••••',
    customerRating: 4.9,
    customerAddressApprox: 'Sholinganallur, OMR (2.4 km away)',
    customerAddressFull: 'Flat 402, Block B, Olympia Opaline, Rajiv Gandhi IT Expressway, Sholinganallur, Chennai - 600119',
    customerInstructions: 'Please buzz flat 402 directly from security gate. 1.5 Ton Voltas Inverter AC in Master Bedroom.',
    customerCoordinates: { lat: 12.9015, lng: 80.2279 },
    distanceKm: 2.4,
    estimatedDurationMin: 60,
    scheduledDate: 'Today',
    scheduledTime: '4:00 PM',
    basePrice: 799,
    platformFee: 100,
    netPayout: 699,
    status: 'ACCEPTED',
    startOtp: '4829',
    completionOtp: '7193',
    checklist: [
      { id: 'c1', title: 'Power off AC mains and isolate circuit', completed: true, required: true },
      { id: 'c2', title: 'Inspect air filters, fins and blower wheel', completed: true, required: true },
      { id: 'c3', title: 'Apply high-pressure foam jet cleaning to indoor coil', completed: false, required: true },
      { id: 'c4', title: 'Clean outdoor condenser unit and remove debris', completed: false, required: true },
      { id: 'c5', title: 'Flush drain pipe to prevent water leakage', completed: false, required: true },
      { id: 'c6', title: 'Test compressor cooling temperature (target 16-18°C)', completed: false, required: true },
      { id: 'c7', title: 'Get customer satisfaction sign-off & OTP', completed: false, required: true }
    ],
    addons: [
      {
        id: 'add_01',
        name: 'Anti-Bacterial Coil Sanitization Coating',
        price: 249,
        description: 'Hospital-grade disinfectant spray prevents mold, bacterial odors and allergens for 90 days.',
        status: 'PENDING_CUSTOMER_APPROVAL',
        requestedAt: '2026-09-12T11:45:00Z'
      }
    ],
    beforePhotos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'
    ],
    afterPhotos: [],
    jobNotes: 'Customer mentioned cooling drops during peak afternoon heat. Checked gas pressure: normal at 125 PSI.',
    paymentMode: 'ONLINE_PAID',
    paymentCollected: true,
    createdAt: '2026-09-12T10:30:00Z',
    acceptedAt: '2026-09-12T10:35:00Z',
    startedAt: '2026-09-12T11:30:00Z',
    xpEarned: 140
  },
  {
    id: 'job_radar_02',
    bookingCode: 'PX-8831',
    category: 'AC Technician',
    serviceName: 'AC Gas Charging (R32 / R410A)',
    serviceDescription: 'Complete leak test with nitrogen, vacuum evacuation, and precision refrigerant top-up with digital manifold gauge.',
    customerFirstName: 'Meera',
    customerPhoneMasked: '+91 97909 •••••',
    customerRating: 4.8,
    customerAddressApprox: 'Perungudi Toll Plaza (3.1 km away)',
    customerAddressFull: 'Villa 12, Ceebros Boulevard, MGR Salai, Perungudi, Chennai - 600096',
    customerInstructions: 'Outdoor unit is safely accessible on the 1st floor balcony. Please bring R32 refrigerant cylinder.',
    customerCoordinates: { lat: 12.9634, lng: 80.2442 },
    distanceKm: 3.1,
    estimatedDurationMin: 75,
    scheduledDate: 'Today',
    scheduledTime: '5:30 PM',
    basePrice: 1999,
    platformFee: 250,
    netPayout: 1749,
    status: 'BROADCAST_PENDING',
    startOtp: '3912',
    completionOtp: '8401',
    checklist: [
      { id: 'cg1', title: 'Check suction and discharge pressure', completed: false, required: true },
      { id: 'cg2', title: 'Soap bubble / electronic leak detection', completed: false, required: true },
      { id: 'cg3', title: 'Vacuum line down to 500 microns', completed: false, required: true },
      { id: 'cg4', title: 'Weigh in specified refrigerant by grams', completed: false, required: true },
      { id: 'cg5', title: 'Measure subcooling and superheat delta-T', completed: false, required: true }
    ],
    addons: [],
    beforePhotos: [],
    afterPhotos: [],
    paymentMode: 'ONLINE_PAID',
    createdAt: '2026-09-12T11:58:00Z',
    xpEarned: 220
  },
  {
    id: 'job_upcoming_03',
    bookingCode: 'PX-9012',
    category: 'AC Technician',
    serviceName: 'Inverter AC PCB Diagnostic & Repair',
    serviceDescription: 'Error code E6 troubleshooting, capacitor testing, and communication wire inspection between indoor & outdoor boards.',
    customerFirstName: 'Anand',
    customerPhoneMasked: '+91 94441 •••••',
    customerRating: 5.0,
    customerAddressApprox: 'Thoraipakkam (4.0 km away)',
    customerAddressFull: 'Tower 7, 8th Floor, Appaswamy Platina, Thoraipakkam, Chennai - 600097',
    customerInstructions: 'Call before reaching security. AC switches off automatically after 5 minutes of run time.',
    customerCoordinates: { lat: 12.9372, lng: 80.2312 },
    distanceKm: 4.0,
    estimatedDurationMin: 90,
    scheduledDate: 'Tomorrow',
    scheduledTime: '10:00 AM',
    basePrice: 1499,
    platformFee: 200,
    netPayout: 1299,
    status: 'ACCEPTED',
    startOtp: '5120',
    completionOtp: '9932',
    checklist: [
      { id: 'pcb1', title: 'Read digital error code on display', completed: false, required: true },
      { id: 'pcb2', title: 'Test AC/DC supply voltages on IPM', completed: false, required: true },
      { id: 'pcb3', title: 'Check thermal sensors resistance (kΩ)', completed: false, required: true }
    ],
    addons: [],
    beforePhotos: [],
    afterPhotos: [],
    paymentMode: 'UPI_COLLECTION',
    createdAt: '2026-09-12T09:15:00Z',
    acceptedAt: '2026-09-12T09:20:00Z',
    xpEarned: 180
  },
  {
    id: 'job_completed_04',
    bookingCode: 'PX-6540',
    category: 'AC Technician',
    serviceName: 'Master AC Deep Cleaning & Anti-Rust Treatment',
    serviceDescription: 'Daikin 2.0 Ton Inverter split deep wash with epoxy anti-rust spray on outdoor coil fins.',
    customerFirstName: 'Karthik',
    customerPhoneMasked: '+91 98410 •••••',
    customerRating: 5.0,
    customerAddressApprox: 'Velachery Bypass Road',
    customerAddressFull: 'Apt 101, Ramaniyam Gaurav, Velachery, Chennai - 600042',
    distanceKm: 5.2,
    estimatedDurationMin: 70,
    scheduledDate: 'Yesterday',
    scheduledTime: '2:30 PM',
    basePrice: 1199,
    platformFee: 150,
    netPayout: 1049,
    status: 'COMPLETED',
    startOtp: '6610',
    completionOtp: '3341',
    checklist: [
      { id: 'c1', title: 'Power isolation safety check', completed: true, required: true },
      { id: 'c2', title: 'Jet foam wash & sanitization', completed: true, required: true },
      { id: 'c3', title: 'Epoxy anti-rust coating applied', completed: true, required: true },
      { id: 'c4', title: '16.2°C grill temperature verified', completed: true, required: true }
    ],
    addons: [
      {
        id: 'add_prev',
        name: 'Epoxy Anti-Rust Fin Protection',
        price: 349,
        description: 'Coastal air anti-corrosion barrier for outdoor unit.',
        status: 'APPROVED',
        requestedAt: '2026-09-11T14:40:00Z',
        approvedAt: '2026-09-11T14:42:00Z'
      }
    ],
    beforePhotos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'],
    afterPhotos: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'],
    jobNotes: 'Completed flawlessly. Customer was very impressed with the quiet operation after service.',
    paymentMode: 'ONLINE_PAID',
    paymentCollected: true,
    createdAt: '2026-09-11T13:00:00Z',
    acceptedAt: '2026-09-11T13:05:00Z',
    startedAt: '2026-09-11T14:30:00Z',
    completedAt: '2026-09-11T15:45:00Z',
    xpEarned: 180
  },
  {
    id: 'job_cancelled_05',
    bookingCode: 'PX-5109',
    category: 'AC Technician',
    serviceName: 'Window AC Uninstallation',
    serviceDescription: 'Remove 1.5 Ton window unit from wooden frame and seal opening safely.',
    customerFirstName: 'Divya',
    customerPhoneMasked: '+91 99620 •••••',
    customerRating: 4.6,
    customerAddressApprox: 'Medavakkam Main Road',
    distanceKm: 6.8,
    estimatedDurationMin: 45,
    scheduledDate: '10 Sep',
    scheduledTime: '11:00 AM',
    basePrice: 499,
    platformFee: 50,
    netPayout: 449,
    status: 'CANCELLED',
    startOtp: '1190',
    completionOtp: '4482',
    checklist: [],
    addons: [],
    beforePhotos: [],
    afterPhotos: [],
    jobNotes: 'Customer requested reschedule due to unexpected building power maintenance.',
    paymentMode: 'ONLINE_PAID',
    createdAt: '2026-09-10T10:00:00Z',
    xpEarned: 0
  }
];

export const INITIAL_PRO_EARNINGS: ProEarningsSummary = {
  todayEarnings: 2450,
  todayJobsCount: 6,
  thisWeekEarnings: 13800,
  thisMonthEarnings: 52400,
  lifetimeEarnings: 842600,
  availableBalance: 8420,
  pendingBalance: 1450,
  paidBalance: 832730,
  nextPayoutDate: 'Friday, 18 Sep',
  nextPayoutAmount: 8420,
  breakdown: {
    baseEarnings: 11200,
    addons: 1850,
    bonuses: 750,
    incentives: 400,
    tips: 350,
    platformFees: 750
  }
};

export const INITIAL_PAYOUT_HISTORY: PayoutTransaction[] = [
  {
    id: 'pay_tx_901',
    payoutDate: '11 Sep 2026',
    amount: 12450,
    referenceId: 'IMPS/625510948291',
    bankAccountMasked: 'HDFC •••• 8492',
    status: 'COMPLETED',
    jobIds: ['PX-6540', 'PX-6539', 'PX-6532', 'PX-6528']
  },
  {
    id: 'pay_tx_902',
    payoutDate: '04 Sep 2026',
    amount: 14200,
    referenceId: 'IMPS/624810847265',
    bankAccountMasked: 'HDFC •••• 8492',
    status: 'COMPLETED',
    jobIds: ['PX-6401', 'PX-6398', 'PX-6390']
  },
  {
    id: 'pay_tx_903',
    payoutDate: '28 Aug 2026',
    amount: 11800,
    referenceId: 'IMPS/624110738210',
    bankAccountMasked: 'HDFC •••• 8492',
    status: 'COMPLETED',
    jobIds: ['PX-6210', 'PX-6204', 'PX-6199']
  }
];

export const PRO_BADGES: ProBadge[] = [
  {
    id: 'b1',
    title: 'First Job Completed',
    icon: '🏆',
    description: 'Completed your very first service on POPCIX PRO with 5-star rating.',
    category: 'MILESTONE',
    unlockedAt: '2024-03-15',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'b2',
    title: '100 Five-Star Jobs',
    icon: '⭐',
    description: 'Earned 5.0 perfect ratings from 100 happy homeowners.',
    category: 'QUALITY',
    unlockedAt: '2025-01-20',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'b3',
    title: '7-Day Power Streak',
    icon: '🔥',
    description: 'Maintained online service streak for 7 consecutive days.',
    category: 'STREAK',
    unlockedAt: '2026-08-10',
    isUnlocked: true,
    progressPercent: 86 // Currently 6/7
  },
  {
    id: 'b4',
    title: '50 Fast Completions',
    icon: '⚡',
    description: 'Finished 50 services within estimated duration with flawless checklist verification.',
    category: 'SPEED',
    unlockedAt: '2025-11-04',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'b5',
    title: '1,000 Jobs Legend',
    icon: '👑',
    description: 'Surpassed 1,000 completed marketplace bookings on POPCIX PRO.',
    category: 'HERO',
    unlockedAt: '2026-06-18',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'b6',
    title: '100 Repeat Customers',
    icon: '❤️',
    description: '100 homeowners specifically re-booked you as their preferred specialist.',
    category: 'QUALITY',
    unlockedAt: '2026-07-29',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'b7',
    title: 'Perfect Week',
    icon: '🎯',
    description: 'Achieved 100% acceptance, 0 cancellations, and 100% on-time rate in a single week.',
    category: 'MILESTONE',
    isUnlocked: false,
    progressPercent: 92
  }
];

export const PRO_CHALLENGES: ProChallenge[] = [
  {
    id: 'ch_1',
    title: 'Weekly Sprint Champion',
    description: 'Complete 30 jobs this week to unlock ₹1,000 cash bonus + 500 XP.',
    xpReward: 500,
    cashBonus: 1000,
    currentValue: 23,
    targetValue: 30,
    deadline: 'Sunday, 11:59 PM',
    completed: false,
    category: 'WEEKLY'
  },
  {
    id: 'ch_2',
    title: 'Punctuality Master',
    description: 'Maintain 95% on-time arrival rate across all accepted jobs this week.',
    xpReward: 250,
    cashBonus: 400,
    currentValue: 96.8,
    targetValue: 95.0,
    deadline: 'Sunday, 11:59 PM',
    completed: true,
    category: 'WEEKLY'
  },
  {
    id: 'ch_3',
    title: 'Five-Star Trio',
    description: 'Collect 3 five-star ratings today from completed jobs.',
    xpReward: 150,
    currentValue: 3,
    targetValue: 3,
    deadline: 'Today, 11:59 PM',
    completed: true,
    category: 'DAILY'
  },
  {
    id: 'ch_4',
    title: 'Inverter AC Mastery Certification',
    description: 'Complete the Inverter AC PCB troubleshooting video module & pass the quiz.',
    xpReward: 350,
    cashBonus: 500,
    currentValue: 80,
    targetValue: 100,
    deadline: '18 Sep 2026',
    completed: false,
    category: 'SPECIAL'
  }
];

export const TRAINING_LESSONS: TrainingLesson[] = [
  {
    id: 'trn_01',
    title: 'Split AC Foam Jet Wash - Step by Step',
    category: 'Technical Skills',
    durationMin: 12,
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    completed: true,
    progressPercent: 100,
    quizId: 'q_01',
    summary: 'Master the high-pressure indoor foam application without splashing walls, water collection bag assembly, and blower wheel degreasing.'
  },
  {
    id: 'trn_02',
    title: 'R32 & R410A Refrigerant Safety & Gas Charging',
    category: 'Safety',
    durationMin: 18,
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    completed: true,
    progressPercent: 100,
    quizId: 'q_02',
    summary: 'Pressure testing with dry nitrogen, electronic leak detection, flaring techniques, and digital manifold charging protocols.'
  },
  {
    id: 'trn_03',
    title: 'Inverter AC PCB Diagnostic & Error Code Resolution',
    category: 'Technical Skills',
    durationMin: 22,
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
    completed: false,
    progressPercent: 80,
    quizId: 'q_03',
    summary: 'IPM testing, compressor UVW coil resistance balance, optical sensor inspection, and communication loop diagnostics.'
  },
  {
    id: 'trn_04',
    title: 'Professional Doorstep Etiquette & 5-Star Customer Service',
    category: 'Customer Service',
    durationMin: 10,
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=80',
    completed: true,
    progressPercent: 100,
    summary: 'Shoe cover protocol, greeting etiquette, transparent quote explanation, clean workspace handover, and requesting ratings.'
  },
  {
    id: 'trn_05',
    title: 'POPCIX PRO Platform Rules & Cancellation Policies',
    category: 'POPCIX Policies',
    durationMin: 8,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80',
    completed: true,
    progressPercent: 100,
    summary: 'Understanding customer OTP verification, why add-ons require customer digital approval, and safety cancellation protocols.'
  }
];

export const TRAINING_QUIZZES: TrainingQuiz[] = [
  {
    id: 'q_01',
    title: 'AC Deep Wash Safety & Procedure Assessment',
    questionsCount: 10,
    passingScorePercent: 80,
    userScorePercent: 100,
    passed: true,
    certificateName: 'POPCIX Certified AC Deep Cleaning Specialist'
  },
  {
    id: 'q_02',
    title: 'Refrigerant Handling & Flaring Safety',
    questionsCount: 10,
    passingScorePercent: 80,
    userScorePercent: 90,
    passed: true,
    certificateName: 'POPCIX Refrigerant Safety Level 2'
  },
  {
    id: 'q_03',
    title: 'Inverter PCB Board Diagnostics Test',
    questionsCount: 15,
    passingScorePercent: 85,
    passed: false
  }
];

export const REPEAT_CUSTOMERS_LIST: RepeatCustomerRecord[] = [
  {
    id: 'rc_1',
    customerFirstName: 'Siddharth',
    totalServicesCount: 4,
    lastServiceDate: 'Today, 4:00 PM',
    lastServiceName: 'Split AC Deep Cleaning & Foam Jet Wash',
    customerRatingGiven: 5.0,
    isFavorite: true
  },
  {
    id: 'rc_2',
    customerFirstName: 'Karthik',
    totalServicesCount: 3,
    lastServiceDate: '11 Sep 2026',
    lastServiceName: 'Master AC Deep Cleaning & Anti-Rust Treatment',
    customerRatingGiven: 5.0,
    isFavorite: true
  },
  {
    id: 'rc_3',
    customerFirstName: 'Rajesh',
    totalServicesCount: 5,
    lastServiceDate: '28 Aug 2026',
    lastServiceName: 'Quarterly Inverter AC Maintenance',
    customerRatingGiven: 4.9,
    isFavorite: false
  },
  {
    id: 'rc_4',
    customerFirstName: 'Priya',
    totalServicesCount: 2,
    lastServiceDate: '14 Aug 2026',
    lastServiceName: 'AC Gas Top Up & Leak Fixing',
    customerRatingGiven: 5.0,
    isFavorite: true
  }
];

export const PRO_SUPPORT_TICKETS: ProSupportTicket[] = [
  {
    id: 'st_1',
    ticketCode: 'TKT-8841',
    category: 'PAYMENT',
    subject: 'Tip credited from booking PX-6540 not showing in weekly statement',
    status: 'RESOLVED',
    createdAt: '2026-09-11T16:00:00Z',
    lastReplyAt: '2026-09-11T17:30:00Z',
    messagesCount: 3
  },
  {
    id: 'st_2',
    ticketCode: 'TKT-8902',
    category: 'ACTIVE_JOB',
    subject: 'Customer location pin in Sholinganallur is 200m off actual street entrance',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-12T11:00:00Z',
    lastReplyAt: '2026-09-12T11:15:00Z',
    messagesCount: 2
  }
];

export const XP_LEADERBOARD_LIST = [
  { rank: 1, name: 'Ravi Kumar (You)', xp: 8420, level: 'AC HERO', jobs: 23, isCurrentUser: true },
  { rank: 2, name: 'Arjun S.', xp: 7910, level: 'Elite Pro', jobs: 21, isCurrentUser: false },
  { rank: 3, name: 'Manoj V.', xp: 7450, level: 'Elite Pro', jobs: 20, isCurrentUser: false },
  { rank: 4, name: 'Venkatesh K.', xp: 6980, level: 'Expert Pro', jobs: 18, isCurrentUser: false },
  { rank: 5, name: 'Dinesh P.', xp: 6420, level: 'Expert Pro', jobs: 17, isCurrentUser: false }
];
