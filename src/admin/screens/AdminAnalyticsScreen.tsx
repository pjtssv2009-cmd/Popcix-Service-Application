/**
 * POPCIX ADMIN - Marketplace Analytics & Revenue Insights Screen
 * GMV growth, booking volume by day, completion & cancellation rates, and zone profitability.
 */

import React from 'react';
import { POPCIXKpiCard } from '../components/POPCIXKpiCard';
import { BarChart3, TrendingUp, DollarSign, CalendarCheck, MapPin } from 'lucide-react';

export function AdminAnalyticsScreen() {
  const weeklyData = [
    { day: 'Mon', gmv: 98000, bookings: 38 },
    { day: 'Tue', gmv: 112000, bookings: 42 },
    { day: 'Wed', gmv: 125000, bookings: 46 },
    { day: 'Thu', gmv: 119000, bookings: 44 },
    { day: 'Fri', gmv: 148000, bookings: 54 },
    { day: 'Sat', gmv: 182000, bookings: 68 },
    { day: 'Sun', gmv: 165000, bookings: 60 }
  ];

  const maxGmv = Math.max(...weeklyData.map(d => d.gmv));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Marketplace Business Intelligence</h2>
        <p className="text-xs text-[#6B6B6B]">Revenue analytics, order velocity, and service zone performance</p>
      </div>

      {/* Top High-level KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <POPCIXKpiCard title="Weekly GMV" value="₹8.42L" changePercent={12.4} isPositive={true} />
        <POPCIXKpiCard title="Avg Order Value" value="₹890" changePercent={4.2} isPositive={true} />
        <POPCIXKpiCard title="Completion Rate" value="98.2%" changePercent={0.8} isPositive={true} />
        <POPCIXKpiCard title="Customer Repeat Rate" value="38.5%" changePercent={3.1} isPositive={true} />
      </div>

      {/* Revenue & Booking Velocity Chart */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-[#111111]">Daily GMV Revenue Velocity (Current Week)</h3>
            <p className="text-[11px] text-[#6B6B6B]">Peak service bookings recorded on Saturday & Sunday</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Total Week: ₹8,42,000
          </span>
        </div>

        {/* Custom Pure CSS / SVG Bar Visualizer */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-3 items-end h-48 border-b border-[#E5E5E0] pb-2">
            {weeklyData.map(item => {
              const heightPercent = Math.round((item.gmv / maxGmv) * 100);
              return (
                <div key={item.day} className="flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.gmv / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full max-w-[40px] bg-[#F0F0EB] rounded-xl overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-black group-hover:bg-emerald-600 rounded-xl transition-all duration-300"
                    />
                  </div>
                  <span className="text-xs font-black text-[#111111]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zone Performance Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-3">
        <h3 className="font-black text-sm text-[#111111]">Zone Demand & Fulfillment Heatmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { zone: 'OMR - Sholinganallur', share: '42% GMV Share', pros: '42 Pros', rating: '⭐ 4.88' },
            { zone: 'OMR - Perungudi', share: '32% GMV Share', pros: '38 Pros', rating: '⭐ 4.82' },
            { zone: 'Velachery Hub', share: '26% GMV Share', pros: '29 Pros', rating: '⭐ 4.90' }
          ].map((z, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#EBEBE6] space-y-1 text-xs">
              <div className="flex justify-between font-bold text-[#111111]">
                <span>{z.zone}</span>
                <span className="text-emerald-700">{z.rating}</span>
              </div>
              <div className="text-[#6B6B6B]">{z.share} • {z.pros}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
