/**
 * POPCIX ADMIN - Live Operations Radar & GPS Map Screen
 * Real-time technician tracking across Chennai service zones with ETA and status inspection.
 */

import React, { useState } from 'react';
import { Radio, MapPin, Navigation, Battery, Clock, Phone, UserCheck, Shield } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { LiveTechnicianPosition } from '../types/admin';

export function AdminLiveOpsScreen() {
  const { liveTechnicians, bookings } = useAdminData();
  const [selectedPro, setSelectedPro] = useState<LiveTechnicianPosition | null>(liveTechnicians[0]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'ON_WAY' | 'AT_JOB'>('ALL');

  const filteredPros = liveTechnicians.filter(t => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-xl font-black text-[#111111] tracking-tight">Live Field Radar & Dispatch</h2>
          </div>
          <p className="text-xs text-[#6B6B6B]">Real-time GPS telemetry in Chennai OMR & Velachery corridor</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F0F0EB] p-1 rounded-2xl">
          {[
            { key: 'ALL', label: `All Pros (${liveTechnicians.length})` },
            { key: 'AT_JOB', label: `At Job (${liveTechnicians.filter(t => t.status === 'AT_JOB').length})` },
            { key: 'ON_WAY', label: `En Route (${liveTechnicians.filter(t => t.status === 'ON_WAY').length})` },
            { key: 'AVAILABLE', label: `Available (${liveTechnicians.filter(t => t.status === 'AVAILABLE').length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab.key ? 'bg-black text-white shadow-xs' : 'text-[#6B6B6B] hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Live Simulated Map View + Technician Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 bg-[#1F2937] text-white rounded-3xl p-6 relative overflow-hidden h-[520px] flex flex-col justify-between shadow-inner border border-[#374151]">
          {/* Subtle Grid Map Texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top Map HUD */}
          <div className="flex items-center justify-between relative z-10 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Chennai Metro Region (12.9015° N, 80.2279° E)</span>
            </div>
            <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-md text-emerald-400 font-bold">
              GPS Signal: 100% Lock
            </span>
          </div>

          {/* Simulated Active Pins on Map */}
          <div className="relative z-10 flex-1 my-6 flex items-center justify-center">
            <div className="w-full h-full relative">
              {filteredPros.map((pro, idx) => {
                const isSelected = selectedPro?.proId === pro.proId;
                // Simulated coordinates positioning
                const topOffsets = ['25%', '60%', '40%', '75%'];
                const leftOffsets = ['30%', '65%', '50%', '20%'];

                return (
                  <div
                    key={pro.proId}
                    onClick={() => setSelectedPro(pro)}
                    style={{ top: topOffsets[idx % 4], left: leftOffsets[idx % 4] }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                    }`}
                  >
                    <div
                      className={`px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xl border ${
                        pro.status === 'AT_JOB'
                          ? 'bg-emerald-500 text-black border-emerald-300'
                          : pro.status === 'ON_WAY'
                          ? 'bg-amber-500 text-black border-amber-300'
                          : 'bg-white text-black border-white'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-black whitespace-nowrap">{pro.proName}</span>
                      {pro.etaMins !== undefined && pro.etaMins > 0 && (
                        <span className="text-[10px] font-bold bg-black/20 px-1 rounded">
                          {pro.etaMins}m ETA
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>At Customer Job</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>En Route to Location</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                <span>Available for Dispatch</span>
              </span>
            </div>
            <span className="text-[11px] text-white/60">Privacy Protected: Precision active only during bookings</span>
          </div>
        </div>

        {/* Selected Field Pro Detailed Telemetry Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EB]">
              <div>
                <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                  TELEMETRY INSPECTION
                </span>
                <h3 className="text-base font-black text-[#111111]">{selectedPro?.proName}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-black text-white">
                {selectedPro?.status}
              </span>
            </div>

            {selectedPro ? (
              <div className="space-y-3 pt-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8F8F5]">
                  <span className="text-[#6B6B6B]">Category:</span>
                  <span className="font-bold text-[#111111]">{selectedPro.category}</span>
                </div>

                {selectedPro.activeBookingId && (
                  <div className="bg-[#F8F8F5] p-3 rounded-2xl border border-[#EBEBE6] space-y-1.5">
                    <div className="flex items-center justify-between text-[#111111] font-bold">
                      <span>Booking: #{selectedPro.activeBookingId}</span>
                      <span className="text-emerald-600">Active</span>
                    </div>
                    <div className="text-[#555555]">Service: {selectedPro.serviceName}</div>
                    <div className="text-[#555555]">Customer: {selectedPro.customerFirstName}</div>
                    {selectedPro.etaMins !== undefined && (
                      <div className="text-[11px] font-bold text-amber-700">
                        ⏱️ Estimated Arrival: {selectedPro.etaMins === 0 ? 'Arrived on-site' : `${selectedPro.etaMins} mins away`}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-[#F8F8F5]">
                  <span className="text-[#6B6B6B]">Device Battery:</span>
                  <span className="font-bold text-[#111111] flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    {selectedPro.batteryLevel}%
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-[#6B6B6B]">Last Ping:</span>
                  <span className="font-semibold text-[#111111]">{selectedPro.lastPing}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#888888]">
                Select a technician on the map to inspect live metrics.
              </div>
            )}
          </div>

          {selectedPro && (
            <div className="space-y-2 pt-2 border-t border-[#F0F0EB]">
              <button
                onClick={() => alert(`Calling verified dispatcher for ${selectedPro.proName}...`)}
                className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Masked Call to Field Pro</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
