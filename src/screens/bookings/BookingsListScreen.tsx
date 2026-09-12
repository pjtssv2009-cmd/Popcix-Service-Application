/**
 * POPCIX Bookings Management Screen
 * Filter Tabs: Upcoming, Active, Completed, Cancelled, Recurring with Rescheduling and Tracking CTAs.
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  RotateCcw,
  Navigation,
  FileText,
  CheckCircle2,
  AlertCircle,
  Repeat,
  ChevronRight,
} from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';
import { BookingStatus } from '../../types/marketplace';

export const BookingsListScreen: React.FC = () => {
  const {
    bookings,
    openLiveTracking,
    startBookingFlow,
    services,
    setActiveTab,
    completeServiceAndCelebrate,
  } = useMarketplace();

  type BookingTab = 'all' | 'active' | 'upcoming' | 'completed' | 'recurring';
  const [currentTab, setCurrentTab] = useState<BookingTab>('all');

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'ON_THE_WAY':
      case 'ARRIVED':
      case 'SERVICE_STARTED':
        return <Badge variant="emerald" size="sm">ACTIVE & ON ROUTE</Badge>;
      case 'CONFIRMED':
      case 'PRO_ASSIGNED':
        return <Badge variant="violet" size="sm">SCHEDULED</Badge>;
      case 'COMPLETED':
        return <Badge variant="black" size="sm">COMPLETED ✓</Badge>;
      case 'CANCELLED':
        return <Badge variant="coral" size="sm">CANCELLED</Badge>;
      default:
        return <Badge variant="muted" size="sm">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (currentTab === 'all') return true;
    if (currentTab === 'active') {
      return ['ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED'].includes(b.status);
    }
    if (currentTab === 'upcoming') {
      return ['CONFIRMED', 'PRO_ASSIGNED'].includes(b.status);
    }
    if (currentTab === 'completed') {
      return b.status === 'COMPLETED';
    }
    if (currentTab === 'recurring') {
      return b.bookingType === 'RECURRING';
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-4">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-black text-[#111111] tracking-tight">
          Your Bookings
        </h2>
        <p className="text-xs font-medium text-[#6B6B6B]">
          Track ongoing visits, history, and recurring schedules
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none -mx-4 px-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active (Live)' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'recurring', label: 'Recurring' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic('light');
              setCurrentTab(tab.id as BookingTab);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              currentTab === tab.id
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-[#DFDFD6] text-[#6B6B6B] hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          type={currentTab === 'recurring' ? 'NO_RECURRING' : 'NO_BOOKINGS'}
          actionText="Book a Service"
          onAction={() => setActiveTab('explore')}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredBookings.map((booking) => {
            const isLive = ['ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED'].includes(booking.status);

            return (
              <Card
                key={booking.id}
                variant="surface"
                padding="md"
                className={`border transition-all ${
                  isLive ? 'border-[#10B981] shadow-card ring-2 ring-[#10B981]/10' : 'border-[#EAEAE4]'
                }`}
              >
                {/* Top Row: Code & Status */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#F1F1ED]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#111111] font-mono">
                      {booking.bookingCode}
                    </span>
                    {booking.bookingType === 'RECURRING' && (
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Repeat className="w-3 h-3" /> Recurring
                      </span>
                    )}
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                {/* Service Details */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-[#111111]">
                      {booking.services[0]?.serviceName}
                    </h3>
                    {booking.services.length > 1 && (
                      <p className="text-[11px] text-[#7C3AED] font-bold mt-0.5">
                        + {booking.services.length - 1} Stacked Add-ons
                      </p>
                    )}

                    <div className="space-y-1 mt-2 text-xs font-medium text-[#6B6B6B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8E8E8E]" />
                        <span>{booking.scheduledDate}</span>
                        <span className="text-[#DFDFD6]">•</span>
                        <Clock className="w-3.5 h-3.5 text-[#8E8E8E]" />
                        <span>{booking.scheduledTimeSlot}</span>
                      </div>

                      {booking.professional && (
                        <div className="flex items-center gap-1.5 text-black font-bold">
                          <span>Pro: {booking.professional.name}</span>
                          <span className="text-[#FFAA00] text-[10px]">⭐ {booking.professional.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-black">
                      ₹{booking.totalAmount}
                    </span>
                    <span className="block text-[10px] font-bold text-[#10B981]">
                      Paid via {booking.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Card CTAs */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F1ED] gap-2">
                  {isLive ? (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => openLiveTracking(booking)}
                      leftIcon={<Navigation className="w-3.5 h-3.5" />}
                    >
                      Track Live ({booking.estimatedArrivalTime || '18m away'})
                    </Button>
                  ) : booking.status === 'COMPLETED' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const s = services.find((srv) => srv.id === booking.services[0]?.serviceId) || services[0];
                          startBookingFlow(s);
                        }}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Book Again
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          completeServiceAndCelebrate(booking.id);
                        }}
                      >
                        Rate & Review
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => openLiveTracking(booking)}
                    >
                      View Details & Instructions
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
