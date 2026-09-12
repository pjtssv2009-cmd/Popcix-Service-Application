/**
 * POPCIX ADMIN - Booking Management & Full Lifecycle Operations Screen
 * Search, filter, timeline inspection, technician reassignment, cancellation, and refund trigger.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminBooking } from '../types/admin';
import { X, CheckCircle2, AlertTriangle, UserCheck, RotateCcw, Clock, Shield } from 'lucide-react';

export function AdminBookingsScreen() {
  const { bookings, reassignBooking, updateBookingStatus, addBookingNote, processRefund } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedNewProName, setSelectedNewProName] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');

  const columns: Column<AdminBooking>[] = [
    {
      key: 'bookingCode',
      header: 'Booking Code',
      sortable: true,
      render: (b) => (
        <span className="font-mono font-black text-xs text-[#111111]">
          #{b.bookingCode}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (b) => (
        <div>
          <div className="font-bold text-[#111111]">{b.customerName}</div>
          <div className="text-[10px] text-[#6B6B6B]">{b.customerPhoneMasked}</div>
        </div>
      )
    },
    {
      key: 'serviceName',
      header: 'Service',
      render: (b) => (
        <div>
          <div className="font-semibold text-[#111111] truncate max-w-[180px]">{b.serviceName}</div>
          <div className="text-[10px] text-[#6B6B6B]">{b.customerZone}</div>
        </div>
      )
    },
    {
      key: 'professionalName',
      header: 'Assigned Pro',
      render: (b) => b.professionalName ? (
        <span className="font-bold text-[#065F46]">{b.professionalName}</span>
      ) : (
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          ⏳ Searching...
        </span>
      )
    },
    {
      key: 'scheduledDate',
      header: 'Slot',
      render: (b) => (
        <div className="text-[11px] text-[#444444]">
          <div>{b.scheduledDate}</div>
          <div className="text-[10px] text-[#888888]">{b.scheduledTime}</div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (b) => (
        <span className="font-black text-xs text-[#10B981]">₹{b.amount}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (b) => <POPCIXStatusBadge status={b.status} />
    }
  ];

  const handleReassign = () => {
    if (!selectedBooking || !selectedNewProName) return;
    reassignBooking(selectedBooking.id, `pro_${Date.now()}`, selectedNewProName);
    setShowReassignModal(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking || !cancelReason) return;
    updateBookingStatus(selectedBooking.id, 'CANCELLED', `Admin Cancel: ${cancelReason}`);
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !newAdminNote.trim()) return;
    addBookingNote(selectedBooking.id, newAdminNote.trim());
    setNewAdminNote('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Booking Management</h2>
        <p className="text-xs text-[#6B6B6B]">Lifecycle monitoring, reassignment dispatch, and customer resolution</p>
      </div>

      {/* Main Data Table */}
      <POPCIXDataTable
        data={bookings}
        columns={columns}
        searchPlaceholder="Search by booking code, customer, service..."
        searchFilter={(b, q) =>
          b.bookingCode.toLowerCase().includes(q.toLowerCase()) ||
          b.customerName.toLowerCase().includes(q.toLowerCase()) ||
          b.serviceName.toLowerCase().includes(q.toLowerCase())
        }
        filterOptions={[
          {
            key: 'status',
            label: 'Status',
            values: ['SEARCHING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
            getter: (b) => b.status
          },
          {
            key: 'serviceCategory',
            label: 'Category',
            values: ['AC Services', 'Electrical', 'Cleaning', 'Plumbing'],
            getter: (b) => b.serviceCategory
          }
        ]}
        exportFileName="popcix_bookings"
        onRowClick={(booking) => setSelectedBooking(booking)}
      />

      {/* Booking Detail Side Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E5E5E0]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E5E5E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-black text-sm text-[#111111]">
                    #{selectedBooking.bookingCode}
                  </h3>
                  <POPCIXStatusBadge status={selectedBooking.status} />
                </div>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{selectedBooking.serviceName}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Financial Summary Box */}
              <div className="bg-[#F8F8F5] rounded-2xl p-4 border border-[#EBEBE6] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Base Amount:</span>
                  <span>₹{selectedBooking.baseAmount}</span>
                </div>
                {selectedBooking.addonAmount > 0 && (
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Approved Add-on:</span>
                    <span className="text-[#10B981] font-bold">+₹{selectedBooking.addonAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Platform Commission:</span>
                  <span>-₹{selectedBooking.platformFee}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#111111] pt-2 border-t border-[#E5E5E0]">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#10B981]">₹{selectedBooking.amount} ({selectedBooking.paymentMethod})</span>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-2xs space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">Customer Information</h4>
                <div className="font-black text-[#111111] text-sm">{selectedBooking.customerName}</div>
                <div className="text-[#555555]">{selectedBooking.customerPhoneMasked} • {selectedBooking.customerEmail}</div>
                <div className="text-[#333333] pt-1">📍 {selectedBooking.customerAddress}</div>
              </div>

              {/* Technician & Verification Details */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">Assigned Specialist</h4>
                  {hasPermission('REASSIGN_BOOKINGS') && (
                    <button
                      onClick={() => setShowReassignModal(true)}
                      className="text-[11px] font-bold text-black hover:underline"
                    >
                      Reassign Pro
                    </button>
                  )}
                </div>
                {selectedBooking.professionalName ? (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                      {selectedBooking.professionalName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[#111111]">{selectedBooking.professionalName}</div>
                      <div className="text-[11px] text-[#6B6B6B]">{selectedBooking.professionalPhoneMasked}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-amber-800 italic">No professional currently assigned.</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[#F0F0EB] text-[11px]">
                  <span>Start OTP: <strong>{selectedBooking.startOtp}</strong></span>
                  <span>Completion OTP: <strong>{selectedBooking.completionOtp}</strong></span>
                </div>
              </div>

              {/* Lifecycle Timeline */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-2xs space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">Booking Lifecycle Timeline</h4>
                <div className="space-y-3 relative pl-3 border-l-2 border-black/10">
                  {selectedBooking.timeline.map(event => (
                    <div key={event.id} className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-black absolute -left-[17px] top-1" />
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#111111]">{event.title}</span>
                        <span className="text-[10px] text-[#888888]">{event.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B]">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-2xs space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">Internal Administrative Notes</h4>
                {selectedBooking.adminNotes.length > 0 ? (
                  <ul className="space-y-1.5 list-disc pl-4 text-[#444444]">
                    {selectedBooking.adminNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#888888] italic">No internal notes added.</p>
                )}

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newAdminNote}
                    onChange={(e) => setNewAdminNote(e.target.value)}
                    placeholder="Add operational memo..."
                    className="flex-1 p-2 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                  <button type="submit" className="px-3 py-2 bg-black text-white rounded-xl font-bold">
                    Save
                  </button>
                </form>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div className="p-4 border-t border-[#E5E5E0] bg-[#F8F8F5] flex items-center justify-between gap-2 shrink-0">
              {hasPermission('CANCEL_BOOKINGS') && selectedBooking.status !== 'CANCELLED' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100"
                >
                  Cancel Booking
                </button>
              )}
              {hasPermission('PROCESS_REFUNDS') && selectedBooking.paymentStatus === 'PAID' && (
                <button
                  onClick={() => {
                    processRefund(selectedBooking.id, true, 'Immediate admin refund approval');
                    alert(`Refund of ₹${selectedBooking.amount} approved for #${selectedBooking.bookingCode}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800"
                >
                  Issue Full Refund (₹{selectedBooking.amount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reassign Pro Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center border shadow-2xl space-y-3">
            <UserCheck className="w-8 h-8 mx-auto text-black" />
            <h4 className="text-sm font-bold text-[#111111]">Reassign Specialist</h4>
            <p className="text-xs text-[#6B6B6B]">Select replacement verified technician for booking:</p>
            <select
              value={selectedNewProName}
              onChange={(e) => setSelectedNewProName(e.target.value)}
              className="w-full p-2 bg-[#F8F8F5] border rounded-xl text-xs"
            >
              <option value="">Select Technician...</option>
              <option value="Ravi Kumar (AC HERO ⭐ 4.86)">Ravi Kumar (AC HERO ⭐ 4.86)</option>
              <option value="Arjun S. (Elite Pro ⭐ 4.90)">Arjun S. (Elite Pro ⭐ 4.90)</option>
              <option value="Manoj Venkatesh (Expert Pro ⭐ 4.80)">Manoj Venkatesh (Expert Pro ⭐ 4.80)</option>
            </select>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowReassignModal(false)}
                className="flex-1 py-2 bg-[#F0F0EB] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                disabled={!selectedNewProName}
                onClick={handleReassign}
                className="flex-1 py-2 bg-black text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center border shadow-2xl space-y-3">
            <AlertTriangle className="w-8 h-8 mx-auto text-rose-600" />
            <h4 className="text-sm font-bold text-[#111111]">Cancel Booking</h4>
            <p className="text-xs text-[#6B6B6B]">Provide reason for administrative cancellation:</p>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Customer requested rescheduling"
              className="w-full p-2 bg-[#F8F8F5] border rounded-xl text-xs"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 bg-[#F0F0EB] rounded-xl text-xs font-bold"
              >
                Back
              </button>
              <button
                disabled={!cancelReason}
                onClick={handleCancelBooking}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
