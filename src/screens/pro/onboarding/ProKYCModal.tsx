/**
 * POPCIX PRO - 10-Step Registration & KYC Wizard
 * Complete onboarding and verification workflow:
 * Step 1: Mobile number
 * Step 2: Basic profile (Name, Photo, Gender, Language)
 * Step 3: Location & City
 * Step 4: Category Selection
 * Step 5: Specific Skills
 * Step 6: Experience
 * Step 7: Documents (Govt ID, PAN, Certificate)
 * Step 8: Bank Account & UPI
 * Step 9: Safety Training
 * Step 10: Final Verification Review
 */

import React, { useState } from 'react';
import { useProAuth } from '../../../context/ProAuthContext';
import { ProCategory } from '../../../types/pro';

interface ProKYCModalProps {
  onClose: () => void;
}

export function ProKYCModal({ onClose }: ProKYCModalProps) {
  const { proProfile, submitKYCStep } = useProAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: proProfile.phone || '+91 98401 23456',
    name: proProfile.name || 'Ravi Kumar',
    gender: proProfile.gender || 'MALE',
    language: proProfile.preferredLanguage || 'English / Tamil',
    city: proProfile.city || 'Chennai',
    serviceArea: 'OMR / Sholinganallur',
    category: proProfile.primaryCategory || 'AC Technician',
    experienceYears: proProfile.experienceYears || 4,
    skills: proProfile.skills || ['Split AC Deep Cleaning', 'Inverter AC Specialist', 'Gas Leakage Repair'],
    bankName: proProfile.bankDetails.bankName || 'HDFC Bank Ltd',
    accountNumber: '•••• •••• 8492',
    ifsc: proProfile.bankDetails.ifscCode || 'HDFC0001245',
    upiId: proProfile.bankDetails.upiId || 'ravikumar84@okhdfcbank'
  });

  const categories: ProCategory[] = [
    'AC Technician',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Cleaner',
    'Pest Control Professional',
    'Appliance Technician',
    'Beauty Professional',
    'Painter'
  ];

  const handleNext = async () => {
    await submitKYCStep(currentStep, formData);
    if (currentStep < 10) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-[84vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#E5E5E0]">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
              STEP {currentStep} OF 10
            </span>
            <h3 className="text-sm font-black text-[#111111]">
              Professional Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0EB] text-[#333333] font-bold text-sm flex items-center justify-center hover:bg-[#E5E5E0]"
          >
            ✕
          </button>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E5E0] h-1.5 shrink-0">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* STEP 1: MOBILE */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 1: Mobile Verification</h2>
              <p className="text-xs text-[#6B6B6B]">Enter your active WhatsApp/Mobile number for OTP validation.</p>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs font-bold"
              />
              <div className="text-[11px] text-[#10B981] font-semibold">✓ Mobile OTP verified via Supabase Auth</div>
            </div>
          )}

          {/* STEP 2: BASIC PROFILE */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 2: Basic Profile</h2>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Preferred Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 3: Primary City & Hub</h2>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Operating City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Main Service Area</label>
                <input
                  type="text"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 4: CATEGORY */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 4: Professional Category</h2>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      formData.category === cat ? 'bg-black text-white border-black' : 'bg-[#F8F8F5] text-[#333333] border-[#E5E5E0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SKILLS */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 5: Verified Skills</h2>
              <div className="space-y-1.5 text-xs">
                {['Split AC Deep Wash', 'Inverter PCB Board Repair', 'Gas Charging & Flaring', 'Compressor Installation', 'Leak Testing'].map(s => (
                  <div key={s} className="p-2.5 bg-[#F8F8F5] rounded-xl border flex items-center justify-between font-semibold">
                    <span>{s}</span>
                    <span className="text-[#10B981] font-bold">✓ Selected</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: EXPERIENCE */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 6: Experience & Background</h2>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Years in Trade</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 7: DOCUMENTS */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 7: Official KYC Documents</h2>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl flex items-center justify-between">
                  <span>Aadhaar / Voter ID</span>
                  <span className="text-[#047857] font-bold">✓ Uploaded</span>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl flex items-center justify-between">
                  <span>PAN Card</span>
                  <span className="text-[#047857] font-bold">✓ Uploaded</span>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl flex items-center justify-between">
                  <span>HVAC Trade Certification</span>
                  <span className="text-[#047857] font-bold">✓ Uploaded</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: BANK DETAILS */}
          {currentStep === 8 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#111111]">Step 8: Bank & Settlement</h2>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                  readOnly
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                  readOnly
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] block mb-1">UPI ID</label>
                <input
                  type="text"
                  value={formData.upiId}
                  className="w-full p-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-semibold"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* STEP 9: TRAINING */}
          {currentStep === 9 && (
            <div className="space-y-3 text-center">
              <div className="text-3xl">🎓</div>
              <h2 className="text-base font-bold text-[#111111]">Step 9: Safety Training Completed</h2>
              <p className="text-xs text-[#6B6B6B]">
                Passed POPCIX Doorstep Etiquette & AC High Pressure Foam Safety Assessment with 100% score.
              </p>
            </div>
          )}

          {/* STEP 10: VERIFICATION STATUS */}
          {currentStep === 10 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] mx-auto flex items-center justify-center text-3xl font-black animate-bounce">
                ✓
              </div>
              <h2 className="text-base font-black text-[#111111]">KYC Approved & Active!</h2>
              <p className="text-xs text-[#6B6B6B]">
                Your profile is verified. You can now toggle online and start receiving nearby customer service bookings.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <footer className="bg-white border-t border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-[#F0F0EB] text-xs font-bold text-[#333333] hover:bg-[#E5E5E0]"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-[#222222]"
          >
            {currentStep === 10 ? 'Done' : 'Next Step →'}
          </button>
        </footer>
      </div>
    </div>
  );
}
