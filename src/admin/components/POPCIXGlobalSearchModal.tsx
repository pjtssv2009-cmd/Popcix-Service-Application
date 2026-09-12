/**
 * POPCIX ADMIN - Global Command Palette & Search Modal (Cmd + K)
 * Instant search across Bookings, Technicians, Services, and Support Tickets.
 */

import React, { useState, useEffect } from 'react';
import { Search, CalendarCheck, Users, Wrench, Headphones, X } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { AdminTab } from './POPCIXAdminSidebar';

interface POPCIXGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AdminTab) => void;
}

export function POPCIXGlobalSearchModal({ isOpen, onClose, onNavigate }: POPCIXGlobalSearchModalProps) {
  const { bookings, kycApplications, services, supportTickets } = useAdminData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBookings = query.trim()
    ? bookings.filter(b => b.bookingCode.toLowerCase().includes(query.toLowerCase()) || b.customerName.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredPros = query.trim()
    ? kycApplications.filter(k => k.proName.toLowerCase().includes(query.toLowerCase()) || k.phone.includes(query))
    : [];

  const filteredServices = query.trim()
    ? services.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredTickets = query.trim()
    ? supportTickets.filter(t => t.ticketCode.toLowerCase().includes(query.toLowerCase()) || t.subject.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-[#E5E5E0] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#E5E5E0] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#888888]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a booking code, pro name, service, or ticket..."
            className="w-full text-sm text-[#111111] placeholder-[#999999] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#F8F8F5] text-[#666666] hover:bg-[#EBEBE6] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-[#888888]">
              <div className="text-2xl mb-1">⚡</div>
              <p className="font-semibold text-[#111111]">Quick Operational Jump</p>
              <p className="text-[11px] text-[#666666]">Search across any customer booking, pro profile, or safety ticket.</p>
            </div>
          ) : (
            <>
              {/* Bookings Section */}
              {filteredBookings.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider px-2 block mb-1">
                    Bookings ({filteredBookings.length})
                  </span>
                  {filteredBookings.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onNavigate('bookings');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F8F5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <CalendarCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-[#111111]">#{b.bookingCode} — {b.customerName}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{b.serviceName} • {b.status}</div>
                        </div>
                      </div>
                      <span className="font-black text-[#10B981]">₹{b.amount}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Professionals Section */}
              {filteredPros.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider px-2 block mb-1">
                    Professionals ({filteredPros.length})
                  </span>
                  {filteredPros.map(k => (
                    <button
                      key={k.id}
                      onClick={() => {
                        onNavigate('professionals');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F8F5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-bold text-[#111111]">{k.proName}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{k.category} • {k.phone}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black text-white">{k.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Services Section */}
              {filteredServices.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider px-2 block mb-1">
                    Services ({filteredServices.length})
                  </span>
                  {filteredServices.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigate('services');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F8F5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold text-[#111111]">{s.title}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{s.categoryName} • {s.durationMinutes} mins</div>
                        </div>
                      </div>
                      <span className="font-bold text-[#111111]">₹{s.basePrice}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Support Tickets */}
              {filteredTickets.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider px-2 block mb-1">
                    Support Tickets ({filteredTickets.length})
                  </span>
                  {filteredTickets.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onNavigate('support');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F8F5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Headphones className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-bold text-[#111111]">#{t.ticketCode} — {t.subject}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{t.requesterName} • {t.priority}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-600">{t.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredBookings.length === 0 && filteredPros.length === 0 && filteredServices.length === 0 && filteredTickets.length === 0 && (
                <div className="p-6 text-center text-[#888888]">
                  No records matching "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
