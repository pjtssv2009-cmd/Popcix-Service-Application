/**
 * POPCIX ADMIN - Mock Operational Dataset
 * Comprehensive, realistic data for Chennai operations matching Customer & Pro applications.
 */

import { 
  AdminUser, 
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
  FeatureFlag 
} from '../types/admin';

export const CURRENT_ADMIN_USER: AdminUser = {
  id: 'adm_01',
  name: 'Karthik Ramanathan',
  email: 'karthik.ops@popcix.com',
  role: 'SUPER_ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  department: 'Central Operations & Marketplace',
  lastLogin: '2026-09-12 13:45 IST'
};

export const INITIAL_ADMIN_BOOKINGS: AdminBooking[] = [
  {
    id: 'bk_101',
    bookingCode: 'PCX-102948',
    customerName: 'Siddharth V.',
    customerPhoneMasked: '+91 98840 •••••',
    customerEmail: 'siddharth.v@gmail.com',
    customerAddress: 'Flat 402, Block B, Olympia Opaline, Sholinganallur',
    customerCity: 'Chennai',
    customerZone: 'OMR - Sholinganallur',
    serviceCategory: 'AC Services',
    serviceName: 'Split AC Deep Cleaning & Jet Foam Wash',
    professionalId: 'pro_ravi_84920',
    professionalName: 'Ravi Kumar',
    professionalPhoneMasked: '+91 98401 •••••',
    professionalAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    scheduledDate: 'Today, 12 Sep',
    scheduledTime: '4:00 PM',
    amount: 948,
    baseAmount: 699,
    addonAmount: 249,
    platformFee: 100,
    proEarnings: 848,
    status: 'IN_PROGRESS',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    createdAt: '2026-09-12 10:30',
    startOtp: '4829',
    completionOtp: '7193',
    coordinates: { lat: 12.9015, lng: 80.2279 },
    timeline: [
      { id: 't1', timestamp: '10:30', title: 'Booking Created', description: 'Customer booked Split AC Deep Cleaning', actor: 'CUSTOMER' },
      { id: 't2', timestamp: '10:32', title: 'Smart Dispatch Matched', description: 'System matched Ravi Kumar (⭐ 4.86, Level 8 AC HERO)', actor: 'SYSTEM' },
      { id: 't3', timestamp: '10:35', title: 'Job Accepted by Pro', description: 'Technician confirmed pickup', actor: 'PROFESSIONAL' },
      { id: 't4', timestamp: '11:20', title: 'Arrived at Doorstep', description: 'Location verified within 25m', actor: 'PROFESSIONAL' },
      { id: 't5', timestamp: '11:30', title: 'Service Started', description: 'Start OTP 4829 verified successfully', actor: 'PROFESSIONAL' },
      { id: 't6', timestamp: '11:45', title: 'Add-on Approved', description: 'Anti-bacterial coil spray (₹249) approved by customer', actor: 'CUSTOMER' }
    ],
    adminNotes: ['High-value repeat customer. AC blower fan deep cleaned.']
  },
  {
    id: 'bk_102',
    bookingCode: 'PCX-102949',
    customerName: 'Meera Krishnan',
    customerPhoneMasked: '+91 97909 •••••',
    customerEmail: 'meera.k@yahoo.com',
    customerAddress: 'Villa 12, Ceebros Boulevard, Perungudi',
    customerCity: 'Chennai',
    customerZone: 'OMR - Perungudi',
    serviceCategory: 'AC Services',
    serviceName: 'AC Gas Charging (R32 / R410A)',
    scheduledDate: 'Today, 12 Sep',
    scheduledTime: '5:30 PM',
    amount: 1999,
    baseAmount: 1999,
    addonAmount: 0,
    platformFee: 250,
    proEarnings: 1749,
    status: 'SEARCHING',
    paymentMethod: 'ONLINE_CARD',
    paymentStatus: 'PAID',
    createdAt: '2026-09-12 11:58',
    startOtp: '3912',
    completionOtp: '8401',
    coordinates: { lat: 12.9634, lng: 80.2442 },
    timeline: [
      { id: 't1', timestamp: '11:58', title: 'Booking Created', description: 'R32 gas charging request created', actor: 'CUSTOMER' },
      { id: 't2', timestamp: '12:00', title: 'Dispatch Radar Broadcasting', description: 'Radar sent to 3 certified HVAC specialists in 4km radius', actor: 'SYSTEM' }
    ],
    adminNotes: ['Broadcast active. Auto-escalate if unassigned in 10 mins.']
  },
  {
    id: 'bk_103',
    bookingCode: 'PCX-102950',
    customerName: 'Anand R.',
    customerPhoneMasked: '+91 94441 •••••',
    customerEmail: 'anand.r@gmail.com',
    customerAddress: 'Tower 7, 8th Floor, Appaswamy Platina, Thoraipakkam',
    customerCity: 'Chennai',
    customerZone: 'OMR - Thoraipakkam',
    serviceCategory: 'Electrical',
    serviceName: 'Inverter & Battery Health Diagnostic',
    professionalId: 'pro_manoj_192',
    professionalName: 'Manoj Venkatesh',
    professionalPhoneMasked: '+91 98402 •••••',
    professionalAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    scheduledDate: 'Today, 12 Sep',
    scheduledTime: '4:30 PM',
    amount: 499,
    baseAmount: 499,
    addonAmount: 0,
    platformFee: 50,
    proEarnings: 449,
    status: 'ON_THE_WAY',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    createdAt: '2026-09-12 12:15',
    startOtp: '5120',
    completionOtp: '9932',
    coordinates: { lat: 12.9372, lng: 80.2312 },
    timeline: [
      { id: 't1', timestamp: '12:15', title: 'Booking Created', description: 'Customer booked inverter inspection', actor: 'CUSTOMER' },
      { id: 't2', timestamp: '12:18', title: 'Assigned', description: 'Manoj Venkatesh assigned', actor: 'SYSTEM' },
      { id: 't3', timestamp: '12:20', title: 'En Route', description: 'Technician travelling. ETA 12 mins', actor: 'PROFESSIONAL' }
    ],
    adminNotes: []
  },
  {
    id: 'bk_104',
    bookingCode: 'PCX-102951',
    customerName: 'Divya Nair',
    customerPhoneMasked: '+91 99620 •••••',
    customerEmail: 'divya.n@outlook.com',
    customerAddress: 'Apt 101, Ramaniyam Gaurav, Velachery',
    customerCity: 'Chennai',
    customerZone: 'Velachery',
    serviceCategory: 'Cleaning',
    serviceName: 'Complete Deep Home Sanitization',
    professionalId: 'pro_priya_481',
    professionalName: 'Priya Sundaram',
    professionalPhoneMasked: '+91 98403 •••••',
    scheduledDate: 'Yesterday, 11 Sep',
    scheduledTime: '2:30 PM',
    amount: 2499,
    baseAmount: 2499,
    addonAmount: 0,
    platformFee: 300,
    proEarnings: 2199,
    status: 'COMPLETED',
    paymentMethod: 'ONLINE_CARD',
    paymentStatus: 'PAID',
    createdAt: '2026-09-11 11:00',
    startOtp: '6610',
    completionOtp: '3341',
    timeline: [
      { id: 't1', timestamp: '11:00', title: 'Created', description: 'Deep home cleaning', actor: 'CUSTOMER' },
      { id: 't2', timestamp: '14:30', title: 'Started', description: 'Start OTP verified', actor: 'PROFESSIONAL' },
      { id: 't3', timestamp: '17:15', title: 'Completed', description: 'Completion verified with 5-star rating', actor: 'PROFESSIONAL' }
    ],
    adminNotes: ['Flawless service delivery. Customer rated 5.0.']
  },
  {
    id: 'bk_105',
    bookingCode: 'PCX-102952',
    customerName: 'Vikram Seth',
    customerPhoneMasked: '+91 98410 •••••',
    customerEmail: 'vikram.seth@gmail.com',
    customerAddress: 'Villa 4, Casagrand ECR, Thoraipakkam',
    customerCity: 'Chennai',
    customerZone: 'OMR - Thoraipakkam',
    serviceCategory: 'Plumbing',
    serviceName: 'Bathroom Pressure Pump Inspection',
    scheduledDate: '10 Sep',
    scheduledTime: '11:00 AM',
    amount: 599,
    baseAmount: 599,
    addonAmount: 0,
    platformFee: 75,
    proEarnings: 524,
    status: 'DISPUTED',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    disputeReason: 'Customer claims technician arrived 45 mins late and pump still noisy',
    createdAt: '2026-09-10 09:30',
    startOtp: '1190',
    completionOtp: '4482',
    timeline: [
      { id: 't1', timestamp: '09:30', title: 'Created', description: 'Plumbing repair', actor: 'CUSTOMER' },
      { id: 't2', timestamp: '13:00', title: 'Completed', description: 'Work reported done', actor: 'PROFESSIONAL' },
      { id: 't3', timestamp: '15:30', title: 'Dispute Raised', description: 'Customer opened ticket #TKT-DISP-09', actor: 'CUSTOMER' }
    ],
    adminNotes: ['Support team reached out. Scheduled free re-inspection.']
  }
];

export const LIVE_TECHNICIAN_POSITIONS: LiveTechnicianPosition[] = [
  {
    proId: 'pro_ravi_84920',
    proName: 'Ravi Kumar',
    category: 'AC Technician',
    status: 'AT_JOB',
    activeBookingId: 'PCX-102948',
    customerFirstName: 'Siddharth',
    serviceName: 'Split AC Deep Cleaning',
    etaMins: 0,
    coordinates: { lat: 12.9015, lng: 80.2279 },
    batteryLevel: 84,
    lastPing: '1 min ago'
  },
  {
    proId: 'pro_manoj_192',
    proName: 'Manoj Venkatesh',
    category: 'Electrician',
    status: 'ON_WAY',
    activeBookingId: 'PCX-102950',
    customerFirstName: 'Anand',
    serviceName: 'Inverter Health Check',
    etaMins: 12,
    coordinates: { lat: 12.9421, lng: 80.2355 },
    batteryLevel: 92,
    lastPing: 'Just now'
  },
  {
    proId: 'pro_arjun_881',
    proName: 'Arjun S.',
    category: 'AC Technician',
    status: 'AVAILABLE',
    coordinates: { lat: 12.9210, lng: 80.2210 },
    batteryLevel: 78,
    lastPing: '2 mins ago'
  },
  {
    proId: 'pro_priya_481',
    proName: 'Priya Sundaram',
    category: 'Cleaner',
    status: 'AVAILABLE',
    coordinates: { lat: 12.9780, lng: 80.2190 },
    batteryLevel: 65,
    lastPing: '3 mins ago'
  }
];

export const INITIAL_KYC_APPLICATIONS: AdminKYCApplication[] = [
  {
    id: 'kyc_901',
    proId: 'pro_dinesh_512',
    proName: 'Dinesh Prasad',
    phone: '+91 98841 90210',
    email: 'dinesh.p@gmail.com',
    city: 'Chennai',
    category: 'AC Technician',
    experienceYears: 5,
    status: 'PENDING',
    submissionDate: '2026-09-12 09:15',
    documents: [
      { id: 'd1', documentType: 'Aadhaar Card', documentNumberMasked: '•••• •••• 4819', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: false, uploadedAt: '12 Sep 09:15' },
      { id: 'd2', documentType: 'PAN Card', documentNumberMasked: 'ABCDE••••K', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: false, uploadedAt: '12 Sep 09:16' },
      { id: 'd3', documentType: 'Trade Certificate', documentNumberMasked: 'ITI-HVAC-2021', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: false, uploadedAt: '12 Sep 09:18' }
    ]
  },
  {
    id: 'kyc_902',
    proId: 'pro_venkat_110',
    proName: 'Venkatesh Babu',
    phone: '+91 97901 88412',
    email: 'venkat.babu@gmail.com',
    city: 'Chennai',
    category: 'Plumber',
    experienceYears: 3.5,
    status: 'UNDER_REVIEW',
    submissionDate: '2026-09-11 14:20',
    assignedReviewer: 'Karthik Ramanathan',
    documents: [
      { id: 'd4', documentType: 'Aadhaar Card', documentNumberMasked: '•••• •••• 9912', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: true, uploadedAt: '11 Sep 14:20' },
      { id: 'd5', documentType: 'PAN Card', documentNumberMasked: 'XYZPA••••M', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: false, uploadedAt: '11 Sep 14:22' }
    ]
  },
  {
    id: 'kyc_903',
    proId: 'pro_ravi_84920',
    proName: 'Ravi Kumar',
    phone: '+91 98401 23456',
    email: 'ravi.kumar@popcixpro.in',
    city: 'Chennai',
    category: 'AC Technician',
    experienceYears: 4,
    status: 'APPROVED',
    submissionDate: '2024-03-10',
    assignedReviewer: 'Karthik Ramanathan',
    documents: [
      { id: 'd6', documentType: 'Aadhaar Card', documentNumberMasked: '•••• •••• 8492', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: true, uploadedAt: '2024-03-10' },
      { id: 'd7', documentType: 'PAN Card', documentNumberMasked: 'ABCDE••••F', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', verified: true, uploadedAt: '2024-03-10' }
    ]
  }
];

export const INITIAL_SERVICES_CATALOG: AdminServiceItem[] = [
  {
    id: 'srv_ac_deep',
    categoryId: 'cat_ac',
    categoryName: 'AC Services',
    title: 'Split AC Deep Cleaning & Jet Wash',
    description: 'High pressure foam wash, condenser jet spray and cooling test.',
    basePrice: 699,
    durationMinutes: 60,
    professionalPayout: 599,
    platformCommission: 100,
    customerFee: 0,
    isActive: true,
    checklist: [
      'Power off AC mains and isolate breaker',
      'Inspect air filter, fin coils and blower wheel',
      'Apply high-pressure foam jet wash to indoor unit',
      'Clean outdoor condenser unit with fin brush & wash',
      'Flush drain tray and verify free water drainage',
      'Measure cooling temperature drop (16-18°C)',
      'Customer digital satisfaction OTP verification'
    ],
    addons: [
      { id: 'ad_1', name: 'Anti-Bacterial Disinfectant Coating', price: 249, durationMin: 15 },
      { id: 'ad_2', name: 'Epoxy Anti-Rust Fin Spray', price: 349, durationMin: 20 }
    ],
    serviceZones: ['OMR - Sholinganallur', 'OMR - Perungudi', 'OMR - Thoraipakkam', 'Velachery', 'Medavakkam'],
    totalBookingsCount: 1420,
    avgRating: 4.88
  },
  {
    id: 'srv_ac_gas',
    categoryId: 'cat_ac',
    categoryName: 'AC Services',
    title: 'AC Gas Charging (R32 / R410A)',
    description: 'Nitrogen leak testing, vacuum pull, and refrigerant refill.',
    basePrice: 1999,
    durationMinutes: 75,
    professionalPayout: 1749,
    platformCommission: 250,
    customerFee: 0,
    isActive: true,
    checklist: [
      'Check suction and discharge manifold pressures',
      'Nitrogen pressure leak detection',
      'Vacuum system down to 500 microns',
      'Weigh in digital refrigerant charge by grams'
    ],
    addons: [
      { id: 'ad_3', name: 'Copper Flaring & Valve Seal Replacement', price: 399, durationMin: 25 }
    ],
    serviceZones: ['OMR - Sholinganallur', 'OMR - Perungudi', 'OMR - Thoraipakkam', 'Velachery'],
    totalBookingsCount: 680,
    avgRating: 4.82
  },
  {
    id: 'srv_elec_inv',
    categoryId: 'cat_elec',
    categoryName: 'Electrical',
    title: 'Inverter & Battery Health Diagnostic',
    description: 'Specific gravity testing, backup load balancing, and terminal cleaning.',
    basePrice: 499,
    durationMinutes: 45,
    professionalPayout: 449,
    platformCommission: 50,
    customerFee: 0,
    isActive: true,
    checklist: [
      'Specific gravity test with hydrometer on all battery cells',
      'Check distilled water levels and top-up if needed',
      'Clean terminal corrosion with baking soda solution',
      'Load test inverter changeover speed'
    ],
    addons: [],
    serviceZones: ['OMR - Sholinganallur', 'OMR - Perungudi', 'Velachery'],
    totalBookingsCount: 520,
    avgRating: 4.90
  }
];

export const INITIAL_SERVICE_ZONES: ServiceZone[] = [
  {
    id: 'zn_01',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    zoneName: 'OMR - Sholinganallur',
    isActive: true,
    activeProsCount: 42,
    activeBookingsCount: 18,
    avgCompletionRate: 98.6,
    localities: ['Semmancheri', 'Navalur', 'Elcot SEZ', 'Kumaran Nagar']
  },
  {
    id: 'zn_02',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    zoneName: 'OMR - Perungudi',
    isActive: true,
    activeProsCount: 38,
    activeBookingsCount: 14,
    avgCompletionRate: 97.8,
    localities: ['Kandhanchavadi', 'MGR Salai', 'Industrial Estate', 'Seevaram']
  },
  {
    id: 'zn_03',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    zoneName: 'Velachery',
    isActive: true,
    activeProsCount: 29,
    activeBookingsCount: 12,
    avgCompletionRate: 98.1,
    localities: ['Vijayanagar', 'Bypass Road', 'Dhandeeswaram', 'Tansi Nagar']
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransactionRecord[] = [
  {
    id: 'pay_tx_1',
    transactionRef: 'TXN-UPI-992104',
    bookingCode: 'PCX-102948',
    customerName: 'Siddharth V.',
    amount: 948,
    method: 'UPI',
    status: 'SUCCESS',
    timestamp: '2026-09-12 10:31',
    gatewayFee: 0
  },
  {
    id: 'pay_tx_2',
    transactionRef: 'TXN-CARD-883192',
    bookingCode: 'PCX-102949',
    customerName: 'Meera Krishnan',
    amount: 1999,
    method: 'CREDIT_CARD',
    status: 'SUCCESS',
    timestamp: '2026-09-12 11:59',
    gatewayFee: 39.98
  }
];

export const INITIAL_REFUND_REQUESTS: RefundRequestRecord[] = [
  {
    id: 'rf_1',
    refundCode: 'REF-8841',
    bookingCode: 'PCX-102952',
    customerName: 'Vikram Seth',
    amount: 250,
    reason: 'Partial refund requested due to technician late arrival and nozzle leak',
    status: 'REQUESTED',
    requestedAt: '2026-09-11 16:30'
  }
];

export const INITIAL_PAYOUT_RECORDS: PayoutRecord[] = [
  {
    id: 'payout_wk36',
    payoutRef: 'PAY-DISB-2026-W36',
    proName: 'Ravi Kumar',
    bankName: 'HDFC Bank Ltd',
    accountNumberMasked: '•••• •••• 8492',
    amount: 8420,
    jobsCount: 11,
    status: 'PENDING',
    scheduledDate: 'Friday, 18 Sep 2026'
  },
  {
    id: 'payout_wk35_paid',
    payoutRef: 'IMPS/625510948291',
    proName: 'Ravi Kumar',
    bankName: 'HDFC Bank Ltd',
    accountNumberMasked: '•••• •••• 8492',
    amount: 12450,
    jobsCount: 16,
    status: 'PAID',
    scheduledDate: '11 Sep 2026',
    disbursedAt: '2026-09-11 17:00'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicketRecord[] = [
  {
    id: 'tkt_01',
    ticketCode: 'TKT-8841',
    category: 'PAYMENT',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    subject: 'Tip credited from booking not showing on weekly ledger',
    requesterName: 'Ravi Kumar',
    requesterType: 'PROFESSIONAL',
    bookingCode: 'PCX-102948',
    assignedAgent: 'Karthik Ramanathan',
    createdAt: '2026-09-11 16:00',
    lastReplyAt: '2026-09-11 17:30',
    messages: [
      { id: 'm1', sender: 'Ravi Kumar', isAgent: false, text: 'Hello, customer gave ₹100 direct tip in cash and ₹150 in app, but app ledger is showing only base.', time: '16:00' },
      { id: 'm2', sender: 'Karthik (Ops)', isAgent: true, text: 'Looking into gateway ledger now Ravi. Tip will settle in your Friday disbursement.', time: '17:30' }
    ]
  },
  {
    id: 'tkt_02',
    ticketCode: 'TKT-8902',
    category: 'SAFETY',
    priority: 'CRITICAL',
    status: 'OPEN',
    subject: 'High-voltage exposed cable behind customer AC compressor unit',
    requesterName: 'Manoj Venkatesh',
    requesterType: 'PROFESSIONAL',
    bookingCode: 'PCX-102950',
    createdAt: '2026-09-12 11:00',
    lastReplyAt: '2026-09-12 11:00',
    messages: [
      { id: 'm3', sender: 'Manoj Venkatesh', isAgent: false, text: 'Exposed building wire near outdoor unit. Advised homeowner to keep mains off.', time: '11:00' }
    ]
  }
];

export const INITIAL_DISPUTES: DisputeRecord[] = [
  {
    id: 'dsp_01',
    disputeCode: 'DSP-7712',
    bookingCode: 'PCX-102952',
    customerName: 'Vikram Seth',
    proName: 'Suresh Plumber',
    category: 'LATE_ARRIVAL',
    status: 'UNDER_REVIEW',
    claimAmount: 250,
    reportedAt: '2026-09-10 15:30',
    summary: 'Customer requests partial refund for 45 min late arrival and noisy pump test.',
    evidenceFiles: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1',
    adminEmail: 'karthik.ops@popcix.com',
    adminRole: 'SUPER_ADMIN',
    action: 'KYC_APPROVED',
    resource: 'professional_documents',
    resourceId: 'pro_ravi_84920',
    previousState: 'UNDER_REVIEW',
    newState: 'APPROVED',
    timestamp: '2026-09-11 15:20 IST',
    ipAddress: '103.14.24.88'
  },
  {
    id: 'aud_2',
    adminEmail: 'karthik.ops@popcix.com',
    adminRole: 'SUPER_ADMIN',
    action: 'SERVICE_PRICE_UPDATED',
    resource: 'services',
    resourceId: 'srv_ac_deep',
    previousState: 'basePrice: 649',
    newState: 'basePrice: 699',
    timestamp: '2026-09-10 11:00 IST',
    ipAddress: '103.14.24.88'
  },
  {
    id: 'aud_3',
    adminEmail: 'karthik.ops@popcix.com',
    adminRole: 'SUPER_ADMIN',
    action: 'FEATURE_FLAG_TOGGLED',
    resource: 'feature_flags',
    resourceId: 'ai_assistant',
    previousState: 'enabled: false',
    newState: 'enabled: true',
    timestamp: '2026-09-09 09:30 IST',
    ipAddress: '103.14.24.88'
  }
];

export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  { key: 'instant_booking', title: 'Instant Booking Radar', description: 'Real-time 45s broadcast matching to nearest 3 verified technicians', enabled: true, targetAudience: 'ALL', category: 'CORE' },
  { key: 'recurring_booking', title: 'Recurring Maintenance Plans', description: 'Quarterly AC and water purifier subscription slots', enabled: true, targetAudience: 'ALL', category: 'CORE' },
  { key: 'professional_rewards', title: 'Gamified XP & Streak Engine', description: 'Level 8 AC Hero, badges, and weekly sprint cash bonuses', enabled: true, targetAudience: 'BETA_PROS', category: 'GAMIFICATION' },
  { key: 'ai_assistant', title: 'Sparky Pro Technical Assistant', description: 'On-site appliance troubleshooting and plain English customer quote explainer', enabled: true, targetAudience: 'ALL', category: 'AI' },
  { key: 'leaderboard', title: 'Public Pro XP Leaderboard', description: 'Privacy-friendly weekly XP rankings with one-tap opt-out', enabled: true, targetAudience: 'ALL', category: 'GAMIFICATION' }
];
