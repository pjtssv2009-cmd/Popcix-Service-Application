/**
 * POPCIX Home Screen
 * Gamified Hero Card, 14 Category Grid, Quick Actions, Trending Services, Maintenance Alerts.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Mascot } from '../../components/common/Mascot';
import {
  Search,
  Zap,
  Flame,
  Crown,
  Sparkles,
  RotateCcw,
  Clock,
  Repeat,
  ShieldCheck,
  Tag,
  Heart,
  Star,
  ArrowRight,
  ChevronRight,
  Wind,
  Droplets,
  Hammer,
  Tv,
  Bug,
  Paintbrush,
  Smile,
  Car,
  Shirt,
  Truck,
  Wrench,
  PackagePlus,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { ServiceItem } from '../../types/marketplace';

export const HomeScreen: React.FC = () => {
  const { profile } = useAuth();
  const { xp, points, streak, levelInfo } = useGamification();
  const {
    categories,
    services,
    setSelectedCategorySlug,
    openServiceDetail,
    startBookingFlow,
    setActiveTab,
    openModal,
    searchQuery,
    setSearchQuery,
    favorites,
    toggleFavorite,
    bookings,
  } = useMarketplace();

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles className="w-6 h-6" />,
      Wind: <Wind className="w-6 h-6" />,
      Zap: <Zap className="w-6 h-6" />,
      Droplets: <Droplets className="w-6 h-6" />,
      Hammer: <Hammer className="w-6 h-6" />,
      Tv: <Tv className="w-6 h-6" />,
      Bug: <Bug className="w-6 h-6" />,
      Paintbrush: <Paintbrush className="w-6 h-6" />,
      Smile: <Smile className="w-6 h-6" />,
      Car: <Car className="w-6 h-6" />,
      Shirt: <Shirt className="w-6 h-6" />,
      Truck: <Truck className="w-6 h-6" />,
      Wrench: <Wrench className="w-6 h-6" />,
      PackagePlus: <PackagePlus className="w-6 h-6" />,
    };
    return map[iconName] || <Sparkles className="w-6 h-6" />;
  };

  const trendingServices = services.filter((s) => s.isTrending || s.isPopular).slice(0, 4);
  const recentCompletedBooking = bookings.find((b) => b.status === 'COMPLETED');

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-5">
      {/* Subheading Prompt */}
      <div>
        <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
          POPCIX HOME CARE
        </p>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">
          What's your home ready for today?
        </h2>
      </div>

      {/* Global Natural-Language Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#8E8E8E] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setActiveTab('explore');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              triggerHaptic('light');
              setActiveTab('explore');
            }
          }}
          placeholder="What do you need help with? e.g. AC not cooling"
          className="w-full bg-white border border-[#DFDFD6] rounded-2xl py-3.5 pl-11 pr-24 text-sm font-semibold text-[#111111] placeholder:text-[#9E9E9E] shadow-sm focus:outline-none focus:border-black transition-colors"
        />
        <button
          onClick={() => {
            triggerHaptic('light');
            openModal('ai-assistant');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#F1F1ED] hover:bg-[#EAEAE4] text-[11px] font-bold text-black rounded-xl border border-[#DFDFD6] flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#7C3AED]" />
          <span>AI Assist</span>
        </button>
      </div>

      {/* GAMIFICATION HERO CARD: "Home Hero — Level 4" */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111111] via-[#1E1E1E] to-[#0A0A0A] p-5 text-white shadow-card">
        {/* Ambient Glows */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#7C3AED]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#FFAA00]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/30 border border-[#7C3AED]/50 text-xs font-extrabold text-[#DDD6FE] mb-2">
              <Crown className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>{levelInfo.currentLevel.title} — Level {levelInfo.currentLevel.level}</span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {profile?.name?.split(' ')[0] || 'Home Hero'}'s Care Progress
            </h3>
          </div>

          <Mascot mood="superhero" size={60} className="-mr-1 -mt-1" />
        </div>

        {/* XP Progress Bar */}
        <div className="relative z-10 mt-3.5">
          <div className="flex justify-between text-xs font-bold text-[#D1D1D1] mb-1.5">
            <span>Level {levelInfo.currentLevel.level} Progress</span>
            <span className="font-extrabold text-white">
              {xp} / {levelInfo.nextLevel ? levelInfo.nextLevel.minXp : levelInfo.currentLevel.maxXp} XP
            </span>
          </div>
          <ProgressBar progress={levelInfo.progressPercentage} color="violet" height="md" />
        </div>

        {/* Stats Row & CTA */}
        <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FFAA00] fill-[#FFAA00]" />
              <span className="text-white">{streak.currentStreak}-Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFAA00]">🪙</span>
              <span className="text-white">{points.toLocaleString()} Points</span>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              playSoundEffect('pop');
              setActiveTab('rewards');
            }}
            className="flex items-center gap-1 text-xs font-extrabold text-[#FFAA00] hover:text-white transition-colors"
          >
            <span>View Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-[#111111] tracking-tight">
            Quick Actions
          </h3>
          <span className="text-xs font-bold text-[#6B6B6B]">1-Tap Shortcuts</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Instant Help Radar */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              openModal('instant-radar');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl hover:scale-105 active:scale-95 transition-transform text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF5757] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:rotate-12 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] font-extrabold text-[#991B1B] leading-tight">Instant Help</span>
            <span className="text-[9px] font-bold text-[#EF4444]">~30 min</span>
          </button>

          {/* Book Again */}
          <button
            onClick={() => {
              triggerHaptic('light');
              if (recentCompletedBooking) {
                const service = services.find((s) => s.id === recentCompletedBooking.services[0]?.serviceId) || services[0];
                startBookingFlow(service);
              } else {
                startBookingFlow(services[0]);
              }
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-white border border-[#EAEAE4] rounded-2xl hover:scale-105 active:scale-95 transition-transform text-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1F1ED] text-black flex items-center justify-center mb-1.5">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-[#111111] leading-tight">Book Again</span>
            <span className="text-[9px] font-bold text-[#6B6B6B]">Last pro</span>
          </button>

          {/* Subscriptions */}
          <button
            onClick={() => {
              triggerHaptic('light');
              openModal('subscriptions');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl hover:scale-105 active:scale-95 transition-transform text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-[#5B21B6] leading-tight">HomeCare</span>
            <span className="text-[9px] font-bold text-[#7C3AED]">Save 20%</span>
          </button>

          {/* Offers & Coupons */}
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('explore');
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl hover:scale-105 active:scale-95 transition-transform text-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFAA00] text-black flex items-center justify-center mb-1.5">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-[#B45309] leading-tight">Offers</span>
            <span className="text-[9px] font-bold text-[#D97706]">Coupons</span>
          </button>
        </div>
      </div>

      {/* 14 SERVICE CATEGORIES GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Service Categories
            </h3>
            <p className="text-xs font-medium text-[#6B6B6B]">14+ Professional Home Services</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategorySlug(null);
              setActiveTab('explore');
            }}
            className="text-xs font-bold text-black hover:underline"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategorySlug(cat.slug);
                setActiveTab('explore');
              }}
              className="flex flex-col items-center justify-center p-2 bg-white border border-[#EAEAE4] rounded-2xl hover:border-black hover:shadow-sm transition-all text-center group active:scale-95"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.accentColor}15`, color: cat.accentColor }}
              >
                {getCategoryIcon(cat.iconName)}
              </div>
              <span className="text-[11px] font-bold text-[#111111] line-clamp-1 group-hover:text-black">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TRENDING HOME SERVICES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Popular Near You 🔥
            </h3>
            <p className="text-xs font-medium text-[#6B6B6B]">Frequently booked by your neighbors</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('explore');
            }}
            className="text-xs font-bold text-black hover:underline"
          >
            View More
          </button>
        </div>

        <div className="space-y-3">
          {trendingServices.map((service) => {
            const isFav = favorites.has(service.id);
            return (
              <Card
                key={service.id}
                variant="surface"
                padding="md"
                className="flex items-center gap-3.5 hover:border-black transition-all group"
              >
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#EAEAE4]"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="amber" size="sm" icon={<Star className="w-3 h-3 fill-black" />}>
                      {service.rating}
                    </Badge>
                    <span className="text-[11px] font-medium text-[#6B6B6B]">
                      ({service.reviewsCount.toLocaleString()})
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#111111] truncate">
                    {service.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-black">
                      ₹{service.startingPrice}
                    </span>
                    {service.originalPrice && (
                      <span className="text-[11px] font-medium text-[#8E8E8E] line-through">
                        ₹{service.originalPrice}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-[#6B6B6B]">
                      • {service.estimatedDurationMins}m
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(service.id);
                    }}
                    className="p-1.5 text-[#8E8E8E] hover:text-[#FF5757]"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-[#FF5757] fill-[#FF5757]' : ''}`} />
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      openServiceDetail(service);
                    }}
                  >
                    Book
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* HOME MAINTENANCE ROUTINE SUGGESTION CARD */}
      <div className="p-5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-3xl flex items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" size="sm" icon={<Sparkles className="w-3 h-3" />} className="mb-1.5">
            MAINTENANCE REMINDER
          </Badge>
          <h4 className="text-sm font-extrabold text-[#065F46]">
            AC Filter & Health Check Due
          </h4>
          <p className="text-xs font-medium text-[#047857] mt-0.5">
            Your AC jet wash was 90 days ago. Keep cooling efficiency high and save power.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="shrink-0"
          onClick={() => {
            const acService = services.find((s) => s.slug === 'ac-deep-cleaning') || services[0];
            startBookingFlow(acService);
          }}
        >
          Clean AC
        </Button>
      </div>
    </div>
  );
};
