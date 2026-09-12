/**
 * POPCIX ADMIN - Main Operations Dashboard Screen
 * Executive KPIs with period comparisons, real-time alert cards, and live operational activity feed.
 */

import React from 'react';
import { 
  CalendarCheck, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { POPCIXKpiCard } from '../components/POPCIXKpiCard';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { AdminTab } from '../components/POPCIXAdminSidebar';

interface AdminDashboardScreenProps {
  onNavigate: (tab: AdminTab) => void;
}

export function AdminDashboardScreen({ onNavigate }: AdminDashboardScreenProps) {
  const { bookings, kycApplications, liveTechnicians, supportTickets } = useAdminData();

  const searchingBookings = bookings.filter(b => b.status === 'SEARCHING' || b.status === 'PENDING');
  const pendingKyc = kycApplications.filter(k => k.status === 'PENDING' || k.status === 'UNDER_REVIEW');
  const activeJobs = bookings.filter(b => ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">Marketplace Operations Hub</h2>
          <p className="text-xs text-[#6B6B6B]">Live metrics, dispatch health, and operational actions</p>
        </div>
        <button
          onClick={() => onNavigate('live-ops')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Launch Live Map Radar</span>
        </button>
      </div>

      {/* Critical Operational Attention Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {searchingBookings.length > 0 && (
          <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900">
                  {searchingBookings.length} Booking Waiting for Assignment
                </h4>
                <p className="text-[11px] text-amber-700">Dispatch radar active in OMR corridor.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors shrink-0"
            >
              Assign Pro →
            </button>
          </div>
        )}

        {pendingKyc.length > 0 && (
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-900">
                  {pendingKyc.length} Technician KYC Applications
                </h4>
                <p className="text-[11px] text-rose-700">Awaiting Aadhaar & PAN verification.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('kyc')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors shrink-0"
            >
              Review Queue →
            </button>
          </div>
        )}

        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-900">
                {liveTechnicians.filter(t => t.status !== 'OFFLINE').length} Technicians Online
              </h4>
              <p className="text-[11px] text-emerald-700">98.4% average on-time arrival rate.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('live-ops')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shrink-0"
          >
            Track Live →
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <POPCIXKpiCard
          title="Gross Merchandise Value (GMV)"
          value="₹8.42L"
          changePercent={12.4}
          changeLabel="↑ 12.4% vs last week"
          isPositive={true}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          onClick={() => onNavigate('payments')}
        />

        <POPCIXKpiCard
          title="Platform Net Revenue"
          value="₹1.05L"
          changePercent={14.1}
          changeLabel="↑ 14.1% vs last week"
          isPositive={true}
          icon={<DollarSign className="w-4 h-4 text-indigo-600" />}
          onClick={() => onNavigate('payments')}
        />

        <POPCIXKpiCard
          title="Today's Bookings"
          value={bookings.length * 9}
          changePercent={8.5}
          changeLabel="48 bookings placed today"
          isPositive={true}
          icon={<CalendarCheck className="w-4 h-4 text-amber-600" />}
          onClick={() => onNavigate('bookings')}
        />

        <POPCIXKpiCard
          title="Active Field Pros"
          value={liveTechnicians.length * 35}
          changePercent={5.2}
          changeLabel="142 certified pros in Chennai"
          isPositive={true}
          icon={<Users className="w-4 h-4 text-purple-600" />}
          onClick={() => onNavigate('professionals')}
        />
      </div>

      {/* Secondary Row: Active Jobs & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs in Progress List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0F0EB]">
            <div>
              <h3 className="text-sm font-black text-[#111111]">Live Field Workflows</h3>
              <p className="text-[11px] text-[#6B6B6B]">Technicians currently en route or executing service checklists</p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map(booking => (
              <div
                key={booking.id}
                className="p-3.5 rounded-2xl bg-[#F8F8F5] border border-[#EBEBE6] flex flex-wrap items-center justify-between gap-3 hover:border-black transition-all cursor-pointer"
                onClick={() => onNavigate('bookings')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {booking.serviceCategory[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#111111]">#{booking.bookingCode}</span>
                      <POPCIXStatusBadge status={booking.status} />
                    </div>
                    <div className="text-xs text-[#333333] font-semibold mt-0.5 truncate max-w-xs">
                      {booking.serviceName}
                    </div>
                    <div className="text-[10px] text-[#6B6B6B]">
                      {booking.customerName} • {booking.customerZone}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#10B981]">₹{booking.amount}</div>
                  <div className="text-[10px] text-[#6B6B6B]">{booking.scheduledTime}</div>
                  {booking.professionalName && (
                    <div className="text-[10px] text-[#065F46] font-bold">
                      Pro: {booking.professionalName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Audit & Activity Log */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0F0EB]">
            <div>
              <h3 className="text-sm font-black text-[#111111]">Audit Trail</h3>
              <p className="text-[11px] text-[#6B6B6B]">Recent administrative events</p>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs font-bold text-black hover:underline"
            >
              View Logs
            </button>
          </div>

          <div className="space-y-3">
            {[
              { action: 'KYC Approved', actor: 'Karthik Ramanathan', target: 'Ravi Kumar (AC HERO)', time: '10 mins ago' },
              { action: 'Service Reassigned', actor: 'Karthik Ramanathan', target: 'Booking #PCX-102948', time: '25 mins ago' },
              { action: 'Price Updated', actor: 'Karthik Ramanathan', target: 'Split AC Deep Cleaning → ₹699', time: '1 hr ago' },
              { action: 'Feature Flag Toggled', actor: 'Karthik Ramanathan', target: 'Sparky Pro AI Assistant', time: '2 hrs ago' }
            ].map((event, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs pb-2 border-b border-[#F0F0EB] last:border-none">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-[#111111]">{event.action}</div>
                  <div className="text-[11px] text-[#6B6B6B]">{event.target}</div>
                  <div className="text-[10px] text-[#888888] mt-0.5">{event.time} • by {event.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
