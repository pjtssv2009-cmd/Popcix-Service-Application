/**
 * POPCIX Explore Screen
 * Discovery-oriented Marketplace with Category Filter Chips, Best Rated Pros, and Natural-Language Search.
 */

import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Star,
  Clock,
  ShieldCheck,
  Heart,
  Sparkles,
  Zap,
  Tag,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';
import { MOCK_PROFESSIONALS } from '../../data/mockMarketplaceData';

export const ExploreScreen: React.FC = () => {
  const {
    categories,
    filteredServices,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    openServiceDetail,
    startBookingFlow,
    favorites,
    toggleFavorite,
    preferredPros,
    togglePreferredPro,
    openModal,
  } = useMarketplace();

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-4">
      {/* Top Heading */}
      <div>
        <h2 className="text-2xl font-black text-[#111111] tracking-tight">
          Explore Services
        </h2>
        <p className="text-xs font-medium text-[#6B6B6B]">
          Verified home care professionals at your fingertips
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#8E8E8E] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search e.g. AC, plumbing, leak, cleaning..."
          className="w-full bg-white border border-[#DFDFD6] rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-[#111111] placeholder:text-[#9E9E9E] shadow-sm focus:outline-none focus:border-black transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E8E] hover:text-black"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 select-none">
        <button
          onClick={() => {
            triggerHaptic('light');
            setSelectedCategorySlug(null);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategorySlug === null
              ? 'bg-black text-white shadow-sm'
              : 'bg-white border border-[#DFDFD6] text-[#6B6B6B] hover:text-black'
          }`}
        >
          All Services
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategorySlug(selectedCategorySlug === cat.slug ? null : cat.slug);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategorySlug === cat.slug
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-[#DFDFD6] text-[#6B6B6B] hover:text-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Service Listings */}
      {filteredServices.length === 0 ? (
        <EmptyState
          type="NO_SEARCH_RESULTS"
          title="No services match your query"
          description={`We couldn't find anything for "${searchQuery}". Ask POPCIX Sparky to diagnose your issue.`}
          actionText="Ask AI Assistant"
          onAction={() => openModal('ai-assistant')}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredServices.map((service) => {
            const isFav = favorites.has(service.id);

            return (
              <Card
                key={service.id}
                variant="surface"
                padding="md"
                className="overflow-hidden border-[#EAEAE4] hover:border-black transition-all cursor-pointer"
                onClick={() => openServiceDetail(service)}
              >
                <div className="flex gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#EAEAE4]"
                    />
                    {service.isTrending && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-black rounded-md">
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
                          {service.categoryName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(service.id);
                          }}
                          className="p-1 text-[#8E8E8E] hover:text-[#FF5757]"
                          aria-label="Favorite"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'text-[#FF5757] fill-[#FF5757]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <h3 className="text-sm font-black text-[#111111] leading-snug line-clamp-1">
                        {service.name}
                      </h3>

                      <p className="text-xs text-[#6B6B6B] font-medium line-clamp-2 mt-0.5">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F1ED]">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="amber"
                          size="sm"
                          icon={<Star className="w-3 h-3 fill-black" />}
                        >
                          {service.rating}
                        </Badge>
                        <span className="text-[11px] font-bold text-[#6B6B6B]">
                          {service.bookingsCount}+ booked
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-xs font-black text-black">
                            ₹{service.startingPrice}
                          </span>
                          {service.originalPrice && (
                            <span className="block text-[10px] text-[#8E8E8E] line-through -mt-0.5">
                              ₹{service.originalPrice}
                            </span>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startBookingFlow(service);
                          }}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* BEST RATED VERIFIED PROFESSIONALS SHOWCASE */}
      <div className="mt-6 pt-4 border-t border-[#EAEAE4]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Best Rated Professionals 🌟
            </h3>
            <p className="text-xs font-medium text-[#6B6B6B]">
              Top 1% technicians with 100% background clearance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_PROFESSIONALS.map((pro) => {
            const isPreferred = preferredPros.has(pro.id);

            return (
              <Card key={pro.id} variant="surface" padding="md" className="border-[#EAEAE4]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.profilePhotoUrl}
                      alt={pro.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-black/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-[#111111]">
                          {pro.name}
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      </div>
                      <p className="text-xs font-medium text-[#6B6B6B]">
                        {pro.yearsExperience} yrs exp • {pro.completedJobs}+ jobs completed
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#FFAA00] flex items-center gap-0.5">
                          ⭐ {pro.rating} ({pro.reviewsCount} reviews)
                        </span>
                        <span className="text-[10px] text-[#10B981] font-bold">
                          • {pro.responseRate} response
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePreferredPro(pro.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isPreferred
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                        : 'bg-[#F1F1ED] text-[#111111] hover:bg-[#EAEAE4]'
                    }`}
                  >
                    {isPreferred ? 'Preferred ✓' : '+ Add Preferred'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
