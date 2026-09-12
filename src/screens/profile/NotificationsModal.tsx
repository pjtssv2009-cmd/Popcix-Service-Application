/**
 * POPCIX Notification Center Modal
 * 9 Notification Types: Booking, Professional, Payment, Rewards, Subscription, Offers, Reminder, Maintenance, Security.
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Bell,
  X,
  ArrowLeft,
  Flame,
  Tag,
  ShieldCheck,
  Zap,
  CreditCard,
  Wrench,
  Lock,
} from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';

export const NotificationsModal: React.FC = () => {
  const { notifications, markNotificationRead, closeModal } = useMarketplace();
  const [filterType, setFilterType] = useState<string>('ALL');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
      case 'PROFESSIONAL':
        return <Zap className="w-4 h-4 text-[#7C3AED]" />;
      case 'REWARDS':
        return <Flame className="w-4 h-4 text-[#FFAA00]" />;
      case 'OFFERS':
        return <Tag className="w-4 h-4 text-[#10B981]" />;
      case 'SUBSCRIPTION':
        return <ShieldCheck className="w-4 h-4 text-[#0284C7]" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-[#10B981]" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-[#FFAA00]" />;
      case 'SECURITY':
        return <Lock className="w-4 h-4 text-[#FF5757]" />;
      default:
        return <Bell className="w-4 h-4 text-black" />;
    }
  };

  const filtered = notifications.filter((n) => filterType === 'ALL' || n.type === filterType);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                closeModal();
              }}
              className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </button>
            <h3 className="text-sm font-black text-[#111111]">Notifications</h3>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-[#F8F8F5] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EAEAE4]">
              <p className="text-xs text-[#6B6B6B]">No notifications right now.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <Card
                key={n.id}
                variant={n.isRead ? 'surface' : 'surface'}
                padding="md"
                className={`border transition-all cursor-pointer ${
                  !n.isRead ? 'border-black/30 shadow-2xs' : 'border-[#EAEAE4] opacity-85'
                }`}
                onClick={() => markNotificationRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F1F1ED] rounded-xl shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-[#111111]">{n.title}</h4>
                      <span className="text-[10px] text-[#8E8E8E] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#444444] mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
