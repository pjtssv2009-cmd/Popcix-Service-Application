/**
 * POPCIX Marketplace & Booking Context
 * 
 * Manages service discovery, 8-step booking wizard, instant booking radar,
 * live tracking status, subscriptions, addresses, coupons, and ratings.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  ServiceCategory,
  ServiceItem,
  ServiceVariant,
  Professional,
  Address,
  Booking,
  BookingItem,
  BookingType,
  BookingStatus,
  Coupon,
  HomeCarePlan,
  NotificationItem,
} from '../types/marketplace';
import {
  MOCK_CATEGORIES,
  MOCK_SERVICES,
  MOCK_PROFESSIONALS,
  MOCK_ADDRESSES,
  MOCK_COUPONS,
  MOCK_HOMECARE_PLANS,
  INITIAL_BOOKINGS,
} from '../data/mockMarketplaceData';
import { ActiveModal, MainTab } from '../types/navigation';
import { AIAssistantService } from '../services/aiAssistant';
import { GamificationEngine } from '../services/gamification/gamificationEngine';
import { playSoundEffect, triggerHaptic } from '../theme/haptics';

export interface BookingDraft {
  service: ServiceItem | null;
  selectedVariants: ServiceVariant[];
  selectedAddress: Address;
  bookingType: BookingType;
  scheduledDate: string;
  scheduledTimeSlot: string;
  appliedCoupon: Coupon | null;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'RAZORPAY';
  specialNotes: string;
  isInstantRadarActive?: boolean;
}

interface MarketplaceContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  activeModal: ActiveModal;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  
  categories: ServiceCategory[];
  services: ServiceItem[];
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedService: ServiceItem | null;
  openServiceDetail: (service: ServiceItem) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredServices: ServiceItem[];
  
  bookingDraft: BookingDraft;
  bookingStep: number;
  setBookingStep: (step: number) => void;
  startBookingFlow: (service: ServiceItem, initialAddon?: ServiceVariant) => void;
  toggleAddonInDraft: (variant: ServiceVariant) => void;
  setBookingDraftAddress: (address: Address) => void;
  setBookingDraftType: (type: BookingType) => void;
  setBookingDraftSlot: (date: string, timeSlot: string) => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setPaymentMethod: (method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'RAZORPAY') => void;
  confirmBooking: () => Promise<Booking>;
  
  bookings: Booking[];
  activeTrackingBooking: Booking | null;
  openLiveTracking: (booking: Booking) => void;
  simulateTrackingStep: () => void;
  
  completedBookingForCelebration: Booking | null;
  completeServiceAndCelebrate: (bookingId: string) => void;
  submitServiceReview: (bookingId: string, rating: number, reviewText: string, tip: number) => void;
  
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  coupons: Coupon[];
  
  homeCarePlans: HomeCarePlan[];
  activeSubscriptionTier: 'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM';
  upgradeSubscription: (tier: 'BASIC' | 'PLUS' | 'PREMIUM') => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
  
  favorites: Set<string>;
  toggleFavorite: (serviceId: string) => void;
  preferredPros: Set<string>;
  togglePreferredPro: (proId: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{
  children: ReactNode;
  onBookingCelebration?: (booking: Booking, xpEarned: number, pointsEarned: number) => void;
}> = ({ children, onBookingCelebration }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  
  const [categories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [services] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [coupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [homeCarePlans] = useState<HomeCarePlan[]>(MOCK_HOMECARE_PLANS);
  const [activeSubscriptionTier, setActiveSubscriptionTier] = useState<'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM'>('PLUS');
  
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(INITIAL_BOOKINGS[0]);
  const [completedBookingForCelebration, setCompletedBookingForCelebration] = useState<Booking | null>(null);
  
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['s1111111-1111-1111-1111-111111111111']));
  const [preferredPros, setPreferredPros] = useState<Set<string>>(new Set(['p1111111-1111-1111-1111-111111111111']));
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'BOOKING',
      title: 'POPCIX Pro is On The Way! 🚀',
      message: 'Rajesh Sharma is 2.4 km away and arriving at approximately 11:18 AM.',
      timestamp: '5 mins ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      type: 'REWARDS',
      title: 'Streak Fire! 🔥 7 Days',
      message: 'You earned 30 bonus XP for keeping your home care streak active.',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: 'notif-3',
      type: 'OFFERS',
      title: 'Bundle Bonus Activated 🎉',
      message: 'Use code STACKSAVE to get ₹250 off when booking cleaning + AC service.',
      timestamp: '1 day ago',
      isRead: true,
    }
  ]);

  // Booking Flow Draft State
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    service: null,
    selectedVariants: [],
    selectedAddress: MOCK_ADDRESSES[0],
    bookingType: 'SCHEDULED',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTimeSlot: '10:00 AM - 11:00 AM',
    appliedCoupon: null,
    paymentMethod: 'UPI',
    specialNotes: '',
  });

  // Natural Language + Category Search Filter
  const filteredServices = services.filter((service) => {
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat && service.categoryId !== cat.id) return false;
    }

    if (searchQuery.trim()) {
      const intent = AIAssistantService.mapSearchIntent(searchQuery);
      const queryLower = searchQuery.toLowerCase();
      const nameMatch = service.name.toLowerCase().includes(queryLower);
      const descMatch = service.shortDescription.toLowerCase().includes(queryLower);
      const catMatch = service.categoryName.toLowerCase().includes(queryLower);
      const keywordMatch = intent.matchedKeywords.some(
        (kw) =>
          service.name.toLowerCase().includes(kw) ||
          service.shortDescription.toLowerCase().includes(kw)
      );

      return nameMatch || descMatch || catMatch || keywordMatch;
    }

    return true;
  });

  const openModal = (modal: ActiveModal) => {
    triggerHaptic('light');
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const openServiceDetail = (service: ServiceItem) => {
    setSelectedService(service);
    openModal('service-detail');
  };

  const startBookingFlow = (service: ServiceItem, initialAddon?: ServiceVariant) => {
    setSelectedService(service);
    setBookingStep(1);
    setBookingDraft({
      service,
      selectedVariants: initialAddon ? [initialAddon] : [],
      selectedAddress: addresses[0] || MOCK_ADDRESSES[0],
      bookingType: 'SCHEDULED',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '11:00 AM - 12:00 PM',
      appliedCoupon: null,
      paymentMethod: 'UPI',
      specialNotes: '',
    });
    openModal('booking-flow');
  };

  const toggleAddonInDraft = (variant: ServiceVariant) => {
    triggerHaptic('light');
    setBookingDraft((prev) => {
      const exists = prev.selectedVariants.some((v) => v.id === variant.id);
      return {
        ...prev,
        selectedVariants: exists
          ? prev.selectedVariants.filter((v) => v.id !== variant.id)
          : [...prev.selectedVariants, variant],
      };
    });
  };

  const setBookingDraftAddress = (address: Address) => {
    setBookingDraft((prev) => ({ ...prev, selectedAddress: address }));
  };

  const setBookingDraftType = (type: BookingType) => {
    triggerHaptic('medium');
    setBookingDraft((prev) => ({ ...prev, bookingType: type }));
  };

  const setBookingDraftSlot = (date: string, timeSlot: string) => {
    setBookingDraft((prev) => ({ ...prev, scheduledDate: date, scheduledTimeSlot: timeSlot }));
  };

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      triggerHaptic('error');
      return { success: false, message: 'Invalid coupon code.' };
    }

    const subtotal = (bookingDraft.service?.startingPrice || 0) +
      bookingDraft.selectedVariants.reduce((sum, v) => sum + v.price, 0);

    if (subtotal < coupon.minOrderAmount) {
      triggerHaptic('error');
      return { success: false, message: `Minimum order amount of ₹${coupon.minOrderAmount} required.` };
    }

    setBookingDraft((prev) => ({ ...prev, appliedCoupon: coupon }));
    triggerHaptic('success');
    playSoundEffect('coin');
    return { success: true, message: `Coupon "${coupon.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setBookingDraft((prev) => ({ ...prev, appliedCoupon: null }));
  };

  const setPaymentMethod = (method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'RAZORPAY') => {
    setBookingDraft((prev) => ({ ...prev, paymentMethod: method }));
  };

  const confirmBooking = async (): Promise<Booking> => {
    const service = bookingDraft.service!;
    const isBundle = bookingDraft.selectedVariants.length > 0;
    const basePrice = service.startingPrice;
    const addonsTotal = bookingDraft.selectedVariants.reduce((sum, v) => sum + v.price, 0);
    const subtotal = basePrice + addonsTotal;
    
    // Bundle discount (e.g. ₹50 off when stacked)
    const bundleDiscount = isBundle ? 50 : 0;
    
    // Coupon discount
    let couponDiscount = 0;
    if (bookingDraft.appliedCoupon) {
      if (bookingDraft.appliedCoupon.discountType === 'PERCENTAGE') {
        couponDiscount = Math.min(
          bookingDraft.appliedCoupon.maxDiscount || 9999,
          (subtotal * bookingDraft.appliedCoupon.discountValue) / 100
        );
      } else {
        couponDiscount = bookingDraft.appliedCoupon.discountValue;
      }
    }

    const taxAmount = Math.round((subtotal - bundleDiscount - couponDiscount) * 0.08 * 100) / 100;
    const totalAmount = Math.max(0, subtotal - bundleDiscount - couponDiscount + taxAmount);

    const { xpEarned, pointsEarned } = GamificationEngine.calculateBookingRewards(totalAmount, isBundle);

    // Assign top verified pro
    const pro = MOCK_PROFESSIONALS[Math.floor(Math.random() * MOCK_PROFESSIONALS.length)];

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: `POP-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: 'demo-user-profile-id',
      services: [
        {
          id: `bi-${Date.now()}-1`,
          serviceId: service.id,
          serviceName: service.name,
          price: service.startingPrice,
          quantity: 1,
        },
        ...bookingDraft.selectedVariants.map((v, i) => ({
          id: `bi-${Date.now()}-${i + 2}`,
          serviceId: service.id,
          variantId: v.id,
          variantName: v.name,
          price: v.price,
          quantity: 1,
          isBundleAddon: true,
        }))
      ],
      professional: pro,
      address: bookingDraft.selectedAddress,
      bookingType: bookingDraft.bookingType,
      status: bookingDraft.bookingType === 'INSTANT' ? 'ON_THE_WAY' : 'CONFIRMED',
      scheduledDate: bookingDraft.scheduledDate,
      scheduledTimeSlot: bookingDraft.scheduledTimeSlot,
      estimatedArrivalTime: '18 mins away',
      subtotal,
      discountAmount: couponDiscount,
      bundleDiscountAmount: bundleDiscount,
      taxAmount,
      totalAmount,
      tipAmount: 0,
      paymentStatus: 'SUCCESSFUL',
      paymentMethod: bookingDraft.paymentMethod,
      pointsEarned,
      xpEarned,
      specialNotes: bookingDraft.specialNotes,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveTrackingBooking(newBooking);

    // Trigger celebration / callback
    if (onBookingCelebration) {
      onBookingCelebration(newBooking, xpEarned, pointsEarned);
    }

    playSoundEffect('success');
    triggerHaptic('success');
    return newBooking;
  };

  const openLiveTracking = (booking: Booking) => {
    setActiveTrackingBooking(booking);
    openModal('live-tracking');
  };

  const simulateTrackingStep = () => {
    if (!activeTrackingBooking) return;
    const timeline: BookingStatus[] = [
      'CONFIRMED',
      'PRO_ASSIGNED',
      'ON_THE_WAY',
      'ARRIVED',
      'SERVICE_STARTED',
      'COMPLETED'
    ];
    const currentIndex = timeline.indexOf(activeTrackingBooking.status);
    if (currentIndex < timeline.length - 1) {
      const nextStatus = timeline[currentIndex + 1];
      const updated = {
        ...activeTrackingBooking,
        status: nextStatus,
        completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
      };
      setActiveTrackingBooking(updated);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      triggerHaptic('medium');
      playSoundEffect('pop');

      if (nextStatus === 'COMPLETED') {
        completeServiceAndCelebrate(updated.id);
      }
    }
  };

  const completeServiceAndCelebrate = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId) || activeTrackingBooking;
    if (target) {
      const updated: Booking = { ...target, status: 'COMPLETED', completedAt: new Date().toISOString() };
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      setCompletedBookingForCelebration(updated);
      openModal('completion-celebration');
    }
  };

  const submitServiceReview = (bookingId: string, rating: number, reviewText: string, tip: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, isReviewed: true, tipAmount: tip } : b))
    );
    closeModal();
    triggerHaptic('success');
    playSoundEffect('coin');
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const addressWithId: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [addressWithId, ...prev]);
    triggerHaptic('success');
  };

  const upgradeSubscription = (tier: 'BASIC' | 'PLUS' | 'PREMIUM') => {
    setActiveSubscriptionTier(tier);
    triggerHaptic('success');
    playSoundEffect('levelUp');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const toggleFavorite = (serviceId: string) => {
    triggerHaptic('light');
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const togglePreferredPro = (proId: string) => {
    triggerHaptic('light');
    setPreferredPros((prev) => {
      const next = new Set(prev);
      if (next.has(proId)) next.delete(proId);
      else next.add(proId);
      return next;
    });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeModal,
        openModal,
        closeModal,
        categories,
        services,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedService,
        openServiceDetail,
        searchQuery,
        setSearchQuery,
        filteredServices,
        bookingDraft,
        bookingStep,
        setBookingStep,
        startBookingFlow,
        toggleAddonInDraft,
        setBookingDraftAddress,
        setBookingDraftType,
        setBookingDraftSlot,
        applyCouponCode,
        removeCoupon,
        setPaymentMethod,
        confirmBooking,
        bookings,
        activeTrackingBooking,
        openLiveTracking,
        simulateTrackingStep,
        completedBookingForCelebration,
        completeServiceAndCelebrate,
        submitServiceReview,
        addresses,
        addAddress,
        coupons,
        homeCarePlans,
        activeSubscriptionTier,
        upgradeSubscription,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        favorites,
        toggleFavorite,
        preferredPros,
        togglePreferredPro,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
