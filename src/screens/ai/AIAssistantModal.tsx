/**
 * POPCIX AI Home Assistant ("Sparky")
 * Interactive conversational home issue troubleshooter with 1-tap service booking recommendations.
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Mascot } from '../../components/common/Mascot';
import { AIAssistantService, ChatMessage, AIRecommendation } from '../../services/aiAssistant';
import {
  Sparkles,
  Send,
  X,
  Zap,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';

export const AIAssistantModal: React.FC = () => {
  const { closeModal, startBookingFlow, services } = useMarketplace();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'sparky',
      text: "Hey there! I'm Sparky, your POPCIX smart home assistant. What problem is your home facing today?",
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'My AC is not cooling',
    'I need to prepare my house for a party',
    'Water leakage under the sink',
    'MCB is tripping frequently',
    'Cockroaches in the kitchen cabinets',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    triggerHaptic('light');
    playSoundEffect('pop');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI diagnostic
    setTimeout(() => {
      const rec = AIAssistantService.diagnoseProblem(query);
      const sparkyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'sparky',
        text: `Let's figure this out! ${rec.analysisText}`,
        timestamp: 'Just now',
        recommendation: rec,
      };
      setMessages((prev) => [...prev, sparkyMsg]);
      triggerHaptic('medium');
      playSoundEffect('coin');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-[#FDE047]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-[#111111]">POPCIX Sparky AI</h3>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <p className="text-[10px] text-[#6B6B6B] font-medium">Smart Home Diagnostics & Solutions</p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.sender === 'sparky' && (
                <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <Mascot mood="happy" size={32} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 text-xs font-medium leading-relaxed select-none ${
                  msg.sender === 'user'
                    ? 'bg-black text-white rounded-br-none'
                    : 'bg-white border border-[#EAEAE4] text-[#111111] rounded-bl-none shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* AI Recommendation Card */}
                {msg.recommendation && (
                  <div className="mt-3.5 pt-3 border-t border-[#F1F1ED] space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={msg.recommendation.isEmergency ? 'coral' : 'violet'} size="sm">
                        RECOMMENDED FIX
                      </Badge>
                      <span className="text-[10px] font-bold text-[#6B6B6B]">1-Tap Dispatch</span>
                    </div>

                    {/* Pro tips */}
                    {msg.recommendation.proTips && msg.recommendation.proTips.length > 0 && (
                      <div className="p-2.5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#B45309]">
                          <Lightbulb className="w-3.5 h-3.5 text-[#FFAA00]" />
                          <span>Sparky's Safety Advice</span>
                        </div>
                        {msg.recommendation.proTips.map((tip, i) => (
                          <p key={i} className="text-[10px] text-[#92400E] leading-tight">
                            • {tip}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Matched Services */}
                    {msg.recommendation.suggestedServiceIds.map((srvId) => {
                      const service = services.find((s) => s.id === srvId) || services[0];
                      return (
                        <Card
                          key={service.id}
                          variant="surface"
                          padding="sm"
                          className="flex items-center justify-between gap-3 border-[#EAEAE4]"
                        >
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-[#111111] truncate">
                              {service.name}
                            </h5>
                            <span className="text-xs font-black text-black">
                              ₹{service.startingPrice}
                            </span>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              closeModal();
                              startBookingFlow(service);
                            }}
                          >
                            Book Now
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-[#EAEAE4] overflow-x-auto no-scrollbar flex items-center gap-1.5 select-none shrink-0">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 bg-[#F8F8F5] border border-[#DFDFD6] hover:border-black rounded-full text-[11px] font-bold text-[#444444] shrink-0 active:scale-95 transition-all"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="bg-white p-3.5 border-t border-[#EAEAE4] flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type your home issue e.g. AC leaking water..."
            className="flex-1 bg-[#F8F8F5] border border-[#DFDFD6] rounded-2xl py-2.5 px-4 text-xs font-medium text-black focus:outline-none focus:border-black transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#1A1A1A] active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
