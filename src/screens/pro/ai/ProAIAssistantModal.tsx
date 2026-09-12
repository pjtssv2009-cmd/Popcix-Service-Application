/**
 * POPCIX PRO - Sparky Pro AI Assistant Modal
 * Smart on-site assistant for technicians:
 * - Customer quote explanations in polite plain English / Tamil
 * - Appliance troubleshooting steps (e.g. Inverter PCB, compressor trip, cooling delta-T)
 * - Authorized earnings queries from pro ledger
 */

import React, { useState } from 'react';
import { useProMarketplace } from '../../../context/ProMarketplaceContext';
import { useProAuth } from '../../../context/ProAuthContext';

interface ProAIAssistantModalProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function ProAIAssistantModal({ onClose }: ProAIAssistantModalProps) {
  const { earnings } = useProMarketplace();
  const { proProfile } = useProAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${proProfile.name.split(' ')[0]}! I'm Sparky Pro, your on-site technical AI assistant. How can I help with your AC service or customer explanation today?`,
      timestamp: 'Just now'
    }
  ]);

  const predefinedPrompts = [
    "How should I explain gas leakage repair to the homeowner?",
    "AC compressor is humming but fan not spinning. Quick check?",
    "How much have I earned this week and when is payout?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    let aiResponseText = '';
    const lower = text.toLowerCase();

    if (lower.includes('explain') || lower.includes('homeowner') || lower.includes('customer')) {
      aiResponseText = `Here is a polite, professional explanation you can say directly to the customer:\n\n"Hello Sir/Madam, your AC's cooling coil has developed minor microscopic leaks near the U-bend due to atmospheric humidity. We recommend brazing the leak, pressure-testing with nitrogen, and refilling fresh refrigerant so the system cools at maximum efficiency without damaging the compressor."`;
    } else if (lower.includes('compressor') || lower.includes('humming') || lower.includes('not spinning') || lower.includes('cooling')) {
      aiResponseText = `Diagnostic Troubleshooting Steps:\n1. Power off mains immediately.\n2. Test Dual Run Capacitor (typical 35+5 µF) with digital multimeter capacitance mode.\n3. Check outdoor condenser fan motor windings for thermal overload cut-off.\n4. Verify if PCB sends 230V DC/AC control trigger to the contactor relay.`;
    } else if (lower.includes('earn') || lower.includes('payout') || lower.includes('money')) {
      aiResponseText = `According to your verified ledger:\n• This week's net earnings: ₹${earnings.thisWeekEarnings.toLocaleString()}\n• Today's earnings: ₹${earnings.todayEarnings.toLocaleString()} (${earnings.todayJobsCount} jobs)\n• Next scheduled bank payout: ₹${earnings.nextPayoutAmount.toLocaleString()} arriving on ${earnings.nextPayoutDate} into your verified ${proProfile.bankDetails.bankName} account.`;
    } else {
      aiResponseText = `Understood! I've analyzed your question for ${proProfile.primaryCategory} operations. Always ensure electrical mains are safely isolated before opening panels, and adhere to POPCIX 5-star doorstep quality standards.`;
    }

    const aiMsg: ChatMessage = {
      id: `a_${Date.now() + 1}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-[88vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#E5E5E0]">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#4F46E5] text-white flex items-center justify-center text-sm font-bold shadow-xs">
              ✨
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider block">
                POPCIX COPILOT
              </span>
              <h3 className="text-sm font-black text-[#111111]">
                Sparky Pro AI Assistant
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

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-black text-white rounded-br-xs'
                    : 'bg-[#F8F8F5] text-[#111111] border border-[#E5E5E0] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick Prompt Suggestions */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block mb-1.5">
              Suggested Questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {predefinedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-2 text-left bg-[#F0F0EB] rounded-xl text-[11px] font-medium text-[#333333] hover:bg-[#E5E5E0] transition-colors"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <footer className="bg-white border-t border-[#E5E5E0] p-3 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder="Ask Sparky Pro about technical issues, quotes..."
            className="flex-1 p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs focus:outline-none focus:border-black"
          />
          <button
            onClick={() => handleSend(inputQuery)}
            className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#222222]"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}
