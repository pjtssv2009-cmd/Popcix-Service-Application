/**
 * POPCIX Support & Help Desk Modal
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mascot } from '../../components/common/Mascot';
import { HelpCircle, CheckCircle2, ArrowLeft, X, MessageSquare } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';

export const SupportTicketModal: React.FC = () => {
  const { closeModal } = useMarketplace();
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setIsSubmitted(true);
    triggerHaptic('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                closeModal();
              }}
              className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </button>
            <h3 className="text-sm font-black text-[#111111]">24/7 Support Desk</h3>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-[#F8F8F5] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-[#EAEAE4] space-y-3">
              <Mascot mood="happy" size={80} />
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <h4 className="text-base font-black text-black">Ticket #POP-TKT-9824 Created</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Our customer care manager will reach out within 15 minutes. All POPCIX services are covered under the 30-Day Happiness Guarantee.
              </p>
              <Button variant="primary" size="md" fullWidth onClick={closeModal}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center text-center mb-2">
                <Mascot mood="thinking" size={70} className="mb-1" />
                <h4 className="text-base font-black text-[#111111]">How can we help?</h4>
                <p className="text-xs text-[#6B6B6B]">Report an issue or ask a question</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Rescheduling AC service visit"
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or feedback in detail..."
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Submit Support Ticket
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
