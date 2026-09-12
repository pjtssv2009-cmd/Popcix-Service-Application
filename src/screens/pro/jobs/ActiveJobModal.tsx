/**
 * POPCIX PRO - Active Job 14-Step Execution Modal
 * Complete real-time operational journey:
 * 1. Confirmed booking view & masked communication
 * 2. GPS Navigation & ETA simulation
 * 3. Arrival location check
 * 4. 4-Digit Customer Start OTP verification
 * 5. In-progress service timer & interactive checklist
 * 6. Chargeable Add-on proposal with customer digital approval
 * 7. Before & After photo uploads
 * 8. Customer Completion OTP verification
 * 9. Payout settlement & gamified XP celebration!
 */

import React, { useState } from 'react';
import { ProJob } from '../../../types/pro';
import { useProMarketplace } from '../../../context/ProMarketplaceContext';
import { useProGamification } from '../../../context/ProGamificationContext';

interface ActiveJobModalProps {
  job: ProJob;
  onClose: () => void;
  onOpenSafety?: () => void;
}

export function ActiveJobModal({ job, onClose, onOpenSafety }: ActiveJobModalProps) {
  const {
    startNavigation,
    confirmArrival,
    verifyStartOtp,
    toggleChecklistItem,
    requestAddon,
    addJobPhoto,
    verifyCompletionOtp,
    cancelJobWithReason
  } = useProMarketplace();

  const { addXp } = useProGamification();

  // Local state for interactive steps
  const [startOtpInput, setStartOtpInput] = useState('');
  const [completionOtpInput, setCompletionOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [addonName, setAddonName] = useState('');
  const [addonPrice, setAddonPrice] = useState('');
  const [addonReason, setAddonReason] = useState('');
  const [chatMessageSent, setChatMessageSent] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCompletionOtpModal, setShowCompletionOtpModal] = useState(false);

  const isCompleted = job.status === 'COMPLETED';

  // Checklist completion calculation
  const totalChecklist = job.checklist.length;
  const completedChecklist = job.checklist.filter(c => c.completed).length;
  const checklistPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 100;

  // Handle Start OTP submission
  const handleVerifyStartOtp = () => {
    setOtpError('');
    const success = verifyStartOtp(job.id, startOtpInput);
    if (success) {
      setStartOtpInput('');
    } else {
      setOtpError(`Invalid Start OTP. (Demo OTP is ${job.startOtp} or 0000)`);
    }
  };

  // Handle Completion OTP submission
  const handleVerifyCompletionOtp = () => {
    setOtpError('');
    const success = verifyCompletionOtp(job.id, completionOtpInput);
    if (success) {
      addXp(job.xpEarned || 180, `Completed job #${job.bookingCode}`);
      setShowCompletionOtpModal(false);
    } else {
      setOtpError(`Invalid Completion OTP. (Customer OTP is ${job.completionOtp} or 0000)`);
    }
  };

  // Handle Propose Addon
  const handleProposeAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonName || !addonPrice) return;
    requestAddon(job.id, {
      name: addonName,
      price: parseFloat(addonPrice) || 0,
      description: addonReason || 'Recommended enhancement during on-site inspection'
    });
    setAddonName('');
    setAddonPrice('');
    setAddonReason('');
    setShowAddonForm(false);
  };

  // Handle simulate quick messages
  const handleSendQuickMessage = (msg: string) => {
    setChatMessageSent(`Sent to ${job.customerFirstName}: "${msg}"`);
    setTimeout(() => setChatMessageSent(''), 3500);
  };

  // Handle simulated photo capture
  const handleAddSimulatedPhoto = (type: 'BEFORE' | 'AFTER') => {
    const samplePhoto = type === 'BEFORE'
      ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80';
    addJobPhoto(job.id, type, samplePhoto);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-[92vh] sm:h-[86vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#E5E5E0]">
        {/* Modal Header */}
        <header className="bg-white border-b border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#000000] text-white">
              #{job.bookingCode}
            </span>
            <span className="text-xs font-semibold text-[#6B6B6B]">
              {job.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSafety && (
              <button
                onClick={onOpenSafety}
                className="px-2 py-1 rounded-lg bg-[#EF4444]/10 text-[#EF4444] text-[11px] font-bold"
              >
                🛡️ SOS
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F0F0EB] text-[#333333] font-bold text-sm flex items-center justify-center hover:bg-[#E5E5E0]"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top Banner: Service & Customer Info */}
          <div className="bg-[#F8F8F5] rounded-2xl p-4 border border-[#EBEBE6]">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h2 className="text-base font-bold text-[#111111] leading-snug">
                {job.serviceName}
              </h2>
              <div className="text-right shrink-0">
                <span className="text-base font-black text-[#10B981]">₹{job.netPayout}</span>
                <span className="text-[10px] text-[#6B6B6B] block">Net</span>
              </div>
            </div>

            <p className="text-xs text-[#555555] mb-3 leading-relaxed">
              {job.serviceDescription}
            </p>

            {/* Customer Details */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#E5E5E0] text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  {job.customerFirstName[0]}
                </div>
                <div>
                  <span className="font-bold text-[#111111]">{job.customerFirstName}</span>
                  <span className="text-[#6B6B6B] ml-1.5">⭐ {job.customerRating}</span>
                </div>
              </div>

              {/* Masked Call & Chat Action */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSendQuickMessage("I am calling you regarding the booking")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E5E0] text-[11px] font-bold text-[#111111] hover:bg-[#F0F0EB]"
                >
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          {/* Chat Quick Toast */}
          {chatMessageSent && (
            <div className="bg-[#000000] text-white text-xs p-2.5 rounded-xl text-center animate-fade-in shadow-md">
              💬 {chatMessageSent}
            </div>
          )}

          {/* STAGE 1: ACCEPTED - Ready to Navigate */}
          {job.status === 'ACCEPTED' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2">
                  CUSTOMER ADDRESS & ACCESS
                </h3>
                <p className="text-xs font-medium text-[#111111] mb-1.5 leading-relaxed">
                  📍 {job.customerAddressFull || job.customerAddressApprox}
                </p>
                {job.customerInstructions && (
                  <div className="bg-[#FFFDF5] border border-[#FDE68A] p-2.5 rounded-xl text-[11px] text-[#92400E] mb-3">
                    <strong>Note from customer:</strong> {job.customerInstructions}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-[#6B6B6B] bg-[#F8F8F5] p-2.5 rounded-xl">
                  <span>Distance: <strong>{job.distanceKm} km</strong></span>
                  <span>Estimated travel: <strong>8 mins</strong></span>
                </div>
              </div>

              {/* Quick Communication Chips */}
              <div>
                <h4 className="text-[11px] font-bold text-[#6B6B6B] mb-1.5 uppercase">Quick Updates to Customer</h4>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    "I'm on my way, arriving in 10 mins.",
                    "I've reached the security gate.",
                    "Please confirm building/floor number."
                  ].map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuickMessage(msg)}
                      className="px-2.5 py-1.5 rounded-full bg-[#F0F0EB] text-[#333333] text-[11px] font-medium whitespace-nowrap hover:bg-[#E5E5E0]"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => startNavigation(job.id)}
                className="w-full py-3.5 rounded-2xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>🗺️</span>
                <span>START GPS NAVIGATION</span>
              </button>
            </div>
          )}

          {/* STAGE 2: NAVIGATING - En Route Map Simulation */}
          {job.status === 'NAVIGATING' && (
            <div className="space-y-3">
              {/* Simulated Map View */}
              <div className="bg-[#1F2937] text-white rounded-2xl p-4 relative overflow-hidden h-44 flex flex-col justify-between shadow-inner">
                {/* Route visualization graphics */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs font-bold">Turn Right on Rajiv Gandhi IT Expressway</span>
                  </div>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-md">8 mins</span>
                </div>

                <div className="text-center relative z-10 py-2">
                  <div className="text-2xl animate-bounce">📍</div>
                  <span className="text-xs text-white/80 font-semibold">{job.customerAddressApprox}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/70 relative z-10 pt-2 border-t border-white/10">
                  <span>Speed: 38 km/h</span>
                  <span>Remaining: 1.6 km</span>
                </div>
              </div>

              <button
                onClick={() => confirmArrival(job.id)}
                className="w-full py-3.5 rounded-2xl bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>🚪</span>
                <span>I'VE ARRIVED AT CUSTOMER'S DOORSTEP</span>
              </button>
            </div>
          )}

          {/* STAGE 3: ARRIVED - Start OTP Verification */}
          {job.status === 'ARRIVED' && (
            <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs space-y-3 text-center">
              <div className="text-3xl">🔑</div>
              <h3 className="text-sm font-bold text-[#111111]">
                Enter Customer Start OTP
              </h3>
              <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto">
                Ask <strong>{job.customerFirstName}</strong> for the 4-digit start verification code sent to their POPCIX app or SMS.
              </p>

              {/* Demo Hint */}
              <div className="text-[11px] text-[#7C3AED] bg-[#7C3AED]/10 p-2 rounded-xl font-medium">
                💡 Demo Start OTP for this booking: <strong>{job.startOtp}</strong> (or 0000)
              </div>

              {/* OTP Input */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={4}
                  value={startOtpInput}
                  onChange={(e) => setStartOtpInput(e.target.value)}
                  placeholder="• • • •"
                  className="w-40 text-center tracking-widest text-2xl font-black py-2 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {otpError && (
                <p className="text-xs text-[#EF4444] font-semibold">{otpError}</p>
              )}

              <button
                onClick={handleVerifyStartOtp}
                className="w-full py-3 rounded-xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors shadow-xs"
              >
                VERIFY OTP & START SERVICE
              </button>
            </div>
          )}

          {/* STAGE 4: IN_PROGRESS - Live Checklist, Add-ons & Photos */}
          {job.status === 'IN_PROGRESS' && (
            <div className="space-y-4">
              {/* Live Service Status Bar */}
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-xs font-bold text-[#047857]">Service In Progress</span>
                </div>
                <span className="text-xs font-black text-[#047857]">
                  Checklist: {completedChecklist}/{totalChecklist} ({checklistPercent}%)
                </span>
              </div>

              {/* Service Checklist */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2.5">
                  MANDATORY SERVICE CHECKLIST
                </h3>
                <div className="space-y-2">
                  {job.checklist.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(job.id, item.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-[#F0FDF4] border-[#86EFAC]'
                          : 'bg-[#F8F8F5] border-[#EBEBE6] hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className={`text-xs ${item.completed ? 'text-[#065F46] font-semibold line-through opacity-80' : 'text-[#222222] font-medium'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chargeable Add-on Section */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                    APPROVED ADD-ON SERVICES
                  </h3>
                  {!showAddonForm && (
                    <button
                      onClick={() => setShowAddonForm(true)}
                      className="text-xs font-bold text-[#000000] hover:underline"
                    >
                      + Propose Add-on
                    </button>
                  )}
                </div>

                {/* Existing Add-ons List */}
                {job.addons.length > 0 ? (
                  <div className="space-y-2 mb-2">
                    {job.addons.map(addon => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F8F5] border border-[#EBEBE6] text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#111111]">{addon.name}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{addon.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-[#10B981]">₹{addon.price}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            addon.status === 'APPROVED' ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-[#FFAA00]/20 text-[#B45309]'
                          }`}>
                            {addon.status === 'APPROVED' ? '✓ Customer Approved' : '⏳ Awaiting Approval'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B6B6B] italic mb-2">
                    No extra add-on services requested yet.
                  </p>
                )}

                {/* Add-on Request Form */}
                {showAddonForm && (
                  <form onSubmit={handleProposeAddon} className="bg-[#F8F8F5] p-3 rounded-xl border border-[#E5E5E0] space-y-2 text-xs">
                    <h4 className="font-bold text-[#111111]">Recommend Chargeable Service</h4>
                    <input
                      type="text"
                      placeholder="Add-on Name (e.g. Anti-Bacterial Sanitization)"
                      value={addonName}
                      onChange={(e) => setAddonName(e.target.value)}
                      className="w-full p-2 bg-white border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price in ₹ (e.g. 249)"
                      value={addonPrice}
                      onChange={(e) => setAddonPrice(e.target.value)}
                      className="w-full p-2 bg-white border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Technical Reason for Customer"
                      value={addonReason}
                      onChange={(e) => setAddonReason(e.target.value)}
                      className="w-full p-2 bg-white border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-black"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddonForm(false)}
                        className="flex-1 py-1.5 bg-white border border-[#CCCCCC] rounded-lg font-semibold text-[#666666]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-black text-white rounded-lg font-bold"
                      >
                        Send Approval Request
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Photo Proof (Before / After) */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2.5">
                  SERVICE PHOTO PROOF
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <span className="text-[11px] font-bold text-[#333333] block mb-1">Before Service</span>
                    {job.beforePhotos.length > 0 ? (
                      <img src={job.beforePhotos[0]} alt="Before" className="w-full h-24 rounded-xl object-cover border" />
                    ) : (
                      <button
                        onClick={() => handleAddSimulatedPhoto('BEFORE')}
                        className="w-full h-24 rounded-xl border border-dashed border-[#CCCCCC] bg-[#F8F8F5] flex flex-col items-center justify-center text-xs font-bold text-[#6B6B6B] hover:bg-[#F0F0EB]"
                      >
                        <span>📷</span>
                        <span>Add Photo</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#333333] block mb-1">After Service</span>
                    {job.afterPhotos.length > 0 ? (
                      <img src={job.afterPhotos[0]} alt="After" className="w-full h-24 rounded-xl object-cover border" />
                    ) : (
                      <button
                        onClick={() => handleAddSimulatedPhoto('AFTER')}
                        className="w-full h-24 rounded-xl border border-dashed border-[#CCCCCC] bg-[#F8F8F5] flex flex-col items-center justify-center text-xs font-bold text-[#6B6B6B] hover:bg-[#F0F0EB]"
                      >
                        <span>✨</span>
                        <span>Add Photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Service CTA Button */}
              <button
                onClick={() => setShowCompletionOtpModal(true)}
                className="w-full py-3.5 rounded-2xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>🏁</span>
                <span>REQUEST CUSTOMER COMPLETION OTP</span>
              </button>
            </div>
          )}

          {/* STAGE 5: COMPLETED - Celebration & Payout Ledger Update */}
          {isCompleted && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] mx-auto flex items-center justify-center text-3xl font-black animate-bounce">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-black text-[#111111]">Job Successfully Completed!</h3>
                <p className="text-xs text-[#6B6B6B]">Payment collected and net earnings credited to your available balance.</p>
              </div>

              {/* Payout Summary Box */}
              <div className="bg-[#F8F8F5] rounded-2xl p-4 text-xs space-y-2 border border-[#EBEBE6]">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Base Service Amount:</span>
                  <span>₹{job.basePrice}</span>
                </div>
                {job.addons.map(a => (
                  <div key={a.id} className="flex justify-between text-[#6B6B6B]">
                    <span>Add-on ({a.name}):</span>
                    <span>₹{a.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>POPCIX Platform Fee:</span>
                  <span>-₹{job.platformFee}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#10B981] pt-2 border-t border-[#E5E5E0]">
                  <span>Net Payout Credited:</span>
                  <span>₹{job.netPayout}</span>
                </div>
              </div>

              {/* XP Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7C3AED]/15 text-[#6D28D9] text-xs font-bold border border-[#7C3AED]/30">
                <span>⚡</span>
                <span>+{job.xpEarned || 180} XP Earned</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors"
              >
                BACK TO DASHBOARD
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer: Cancel / Safety Controls */}
        {!isCompleted && (
          <footer className="bg-[#F8F8F5] border-t border-[#E5E5E0] px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
            <button
              onClick={() => setShowCancelDialog(true)}
              className="text-[#EF4444] font-semibold hover:underline"
            >
              Request Cancellation
            </button>
            <span className="text-[#6B6B6B] text-[11px]">POPCIX PRO Verified Session</span>
          </footer>
        )}

        {/* Completion OTP Popup Dialogue */}
        {showCompletionOtpModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center border shadow-2xl space-y-3">
              <div className="text-3xl">🎉</div>
              <h4 className="text-base font-bold text-[#111111]">Enter Customer Completion OTP</h4>
              <p className="text-xs text-[#6B6B6B]">
                Ask {job.customerFirstName} for the 4-digit completion code to verify finished checklist.
              </p>
              <div className="text-[11px] text-[#7C3AED] bg-[#7C3AED]/10 p-2 rounded-xl font-medium">
                💡 Demo OTP: <strong>{job.completionOtp}</strong> (or 0000)
              </div>
              <input
                type="text"
                maxLength={4}
                value={completionOtpInput}
                onChange={(e) => setCompletionOtpInput(e.target.value)}
                placeholder="• • • •"
                className="w-40 text-center tracking-widest text-2xl font-black py-2 border-2 border-black rounded-xl focus:outline-none"
              />
              {otpError && <p className="text-xs text-[#EF4444]">{otpError}</p>}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowCompletionOtpModal(false)}
                  className="flex-1 py-2 bg-[#F0F0EB] text-[#333333] rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyCompletionOtp}
                  className="flex-1 py-2 bg-[#000000] text-white rounded-xl text-xs font-bold"
                >
                  Verify & Finish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Reason Dialogue */}
        {showCancelDialog && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center border shadow-2xl space-y-3">
              <div className="text-3xl text-[#EF4444]">⚠️</div>
              <h4 className="text-sm font-bold text-[#111111]">Cancel Booking #{job.bookingCode}</h4>
              <p className="text-xs text-[#6B6B6B]">Select a reason for backend audit:</p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 bg-[#F8F8F5] border rounded-xl text-xs text-[#111111]"
              >
                <option value="">Select reason...</option>
                <option value="Customer unavailable / not answering">Customer unavailable / not answering</option>
                <option value="Unsafe working conditions / site hazard">Unsafe working conditions / site hazard</option>
                <option value="Wrong service category booked">Wrong service category booked</option>
                <option value="Vehicle breakdown / transit emergency">Vehicle breakdown / transit emergency</option>
              </select>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 py-2 bg-[#F0F0EB] rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  disabled={!cancelReason}
                  onClick={() => {
                    cancelJobWithReason(job.id, cancelReason);
                    setShowCancelDialog(false);
                    onClose();
                  }}
                  className="flex-1 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
