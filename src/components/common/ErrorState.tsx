/**
 * POPCIX Friendly Error States
 */

import React from 'react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { AlertCircle, WifiOff, MapPinOff, CreditCard, RefreshCw } from 'lucide-react';

export type ErrorType =
  | 'NO_INTERNET'
  | 'NO_PROS'
  | 'PAYMENT_FAILED'
  | 'BOOKING_FAILED'
  | 'LOCATION_UNAVAILABLE'
  | 'SESSION_EXPIRED'
  | 'GENERIC';

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'GENERIC',
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  const configs = {
    NO_INTERNET: {
      icon: <WifiOff className="w-8 h-8 text-[#FF5757]" />,
      defaultTitle: 'Connection Interrupted',
      defaultDesc: 'We could not reach the POPCIX server. Please check your WiFi or mobile data.',
      defaultAction: 'Try Again',
    },
    NO_PROS: {
      icon: <AlertCircle className="w-8 h-8 text-[#FFAA00]" />,
      defaultTitle: 'All Pros Are Currently Busy',
      defaultDesc: 'Technicians in your zone are finishing ongoing jobs. Would you like to schedule for the next available slot?',
      defaultAction: 'View Next Available Slot',
    },
    PAYMENT_FAILED: {
      icon: <CreditCard className="w-8 h-8 text-[#FF5757]" />,
      defaultTitle: 'Payment Incomplete',
      defaultDesc: 'The transaction was declined by your bank or UPI app. Your card was not charged.',
      defaultAction: 'Retry Payment',
    },
    BOOKING_FAILED: {
      icon: <AlertCircle className="w-8 h-8 text-[#FF5757]" />,
      defaultTitle: 'Slot Just Got Taken',
      defaultDesc: 'Another customer booked that exact minute. Pick an adjacent time slot or try Instant dispatch.',
      defaultAction: 'Select Another Slot',
    },
    LOCATION_UNAVAILABLE: {
      icon: <MapPinOff className="w-8 h-8 text-[#0284C7]" />,
      defaultTitle: 'Location Permission Needed',
      defaultDesc: 'POPCIX needs your approximate location to calculate technician travel time and assign nearby pros.',
      defaultAction: 'Enable Location',
    },
    SESSION_EXPIRED: {
      icon: <RefreshCw className="w-8 h-8 text-[#7C3AED]" />,
      defaultTitle: 'Session Expired',
      defaultDesc: 'Your secure Supabase Auth token has refreshed. Please sign in again to continue.',
      defaultAction: 'Sign In Again',
    },
    GENERIC: {
      icon: <AlertCircle className="w-8 h-8 text-[#111111]" />,
      defaultTitle: 'Something Went Sideways',
      defaultDesc: 'We hit a small bump in the wire. Don’t worry, your data and bookings are safe.',
      defaultAction: 'Reload Page',
    },
  };

  const current = configs[type] || configs.GENERIC;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAEAE4] shadow-sm max-w-md mx-auto my-6 ${className}`}>
      <Mascot mood="thinking" size={90} className="mb-4" />
      <div className="p-3 bg-[#F8F8F5] rounded-full mb-3 border border-[#EAEAE4]">
        {current.icon}
      </div>
      <h3 className="text-xl font-extrabold text-[#111111] mb-2 tracking-tight">
        {title || current.defaultTitle}
      </h3>
      <p className="text-sm font-medium text-[#6B6B6B] leading-relaxed mb-6">
        {description || current.defaultDesc}
      </p>
      {onAction && (
        <Button variant="primary" size="lg" onClick={onAction} fullWidth>
          {actionText || current.defaultAction}
        </Button>
      )}
    </div>
  );
};
