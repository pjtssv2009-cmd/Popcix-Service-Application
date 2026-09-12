/**
 * POPCIX Navigation Types
 */

export type MainTab = 'home' | 'explore' | 'bookings' | 'rewards' | 'profile';

export type ActiveModal =
  | null
  | 'onboarding'
  | 'auth-signin'
  | 'auth-signup'
  | 'auth-forgot'
  | 'service-detail'
  | 'booking-flow'
  | 'instant-radar'
  | 'live-tracking'
  | 'completion-celebration'
  | 'rating-modal'
  | 'subscriptions'
  | 'ai-assistant'
  | 'address-manager'
  | 'notifications-center'
  | 'support-ticket';
