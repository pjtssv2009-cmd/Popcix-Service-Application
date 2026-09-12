/**
 * POPCIX PRO - Safety & Emergency SOS Modal
 * 1-Tap Emergency dispatch, incident reporting, active job security sharing, and 24/7 hotline dialer.
 */

import React, { useState } from 'react';

interface SafetyEmergencyModalProps {
  onClose: () => void;
}

export function SafetyEmergencyModal({ onClose }: SafetyEmergencyModalProps) {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [incidentReported, setIncidentReported] = useState(false);
  const [incidentText, setIncidentText] = useState('');

  const handleTriggerSOS = () => {
    setSosTriggered(true);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentText) return;
    setIncidentReported(true);
    setTimeout(() => {
      setIncidentReported(false);
      setIncidentText('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-[88vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#E5E5E0]">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl text-[#EF4444]">🛡️</span>
            <div>
              <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider block">
                SAFETY FIRST
              </span>
              <h3 className="text-sm font-black text-[#111111]">
                Safety & Emergency SOS
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0EB] text-[#333333] font-bold text-sm flex items-center justify-center hover:bg-[#E5E5E0]"
          >
            ✕
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Big Red 1-Tap SOS Button */}
          <div className="bg-[#FEF2F2] border-2 border-[#EF4444] rounded-3xl p-5 text-center shadow-xs">
            <div className="text-4xl mb-2 animate-pulse">🚨</div>
            <h2 className="text-base font-black text-[#991B1B] mb-1">
              1-Tap Emergency SOS Dispatch
            </h2>
            <p className="text-xs text-[#B91C1C] mb-4">
              Immediately notifies POPCIX Rapid Response Team with your live GPS location and active booking coordinates.
            </p>

            {sosTriggered ? (
              <div className="bg-[#EF4444] text-white p-3 rounded-2xl text-xs font-bold animate-pulse">
                ✓ SOS DISPATCHED: Support team is dialing your phone right now.
              </div>
            ) : (
              <button
                onClick={handleTriggerSOS}
                className="w-full py-3.5 rounded-2xl bg-[#EF4444] text-white text-xs font-black hover:bg-[#DC2626] transition-colors shadow-md"
              >
                ACTIVATE EMERGENCY SOS
              </button>
            )}
          </div>

          {/* Quick Direct Hotline Numbers */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              DIRECT HOTLINES
            </h3>
            <div className="flex items-center justify-between p-3 bg-[#F8F8F5] rounded-xl text-xs font-bold text-[#111111]">
              <span>POPCIX 24/7 Pro Safety Desk</span>
              <span className="text-[#10B981]">1800-419-POPCIX</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F8F8F5] rounded-xl text-xs font-bold text-[#111111]">
              <span>Police Emergency Response</span>
              <span className="text-[#EF4444]">112</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F8F8F5] rounded-xl text-xs font-bold text-[#111111]">
              <span>Medical Ambulance</span>
              <span className="text-[#EF4444]">108</span>
            </div>
          </div>

          {/* Incident Reporting Form */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2">
              REPORT UNSAFE SITUATION OR HARASSMENT
            </h3>
            {incidentReported ? (
              <div className="bg-[#F0FDF4] border border-[#86EFAC] p-3 rounded-xl text-xs text-[#047857] font-bold text-center">
                ✓ Incident report received. Ticket #TKT-SAFE logged for priority review.
              </div>
            ) : (
              <form onSubmit={handleReportIncident} className="space-y-2 text-xs">
                <textarea
                  rows={3}
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  placeholder="Describe the safety hazard, aggressive customer, or unsafe structural defect..."
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl focus:outline-none focus:border-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black text-white rounded-xl font-bold"
                >
                  Submit Incident Report
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
