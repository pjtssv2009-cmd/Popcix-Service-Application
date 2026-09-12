/**
 * POPCIX ADMIN - Broadcast Notification Center Screen
 * Send push & in-app broadcasts targeted by Audience (Customers / Pros) and City Zone.
 */

import React, { useState } from 'react';
import { Bell, Send, Users, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export function AdminNotificationsScreen() {
  const { logAuditAction } = useAdminData();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'CUSTOMERS' | 'PROFESSIONALS'>('PROFESSIONALS');
  const [targetZone, setTargetZone] = useState('ALL_CHENNAI');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    logAuditAction('BROADCAST_SENT', 'notifications', targetAudience, undefined, `${title} (${targetZone})`);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setTitle('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Broadcast Notifications Hub</h2>
        <p className="text-xs text-[#6B6B6B]">Dispatch operational announcements, weather alerts, and milestone updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <form onSubmit={handleSendBroadcast} className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-black text-[#111111]">Compose Operational Announcement</h3>

          <div>
            <label className="block font-bold text-[#444444] mb-1">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'PROFESSIONALS', label: 'Field Pros (POPCIX PRO)' },
                { key: 'CUSTOMERS', label: 'Homeowners (Customer App)' },
                { key: 'ALL', label: 'All Users' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setTargetAudience(opt.key as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    targetAudience === opt.key ? 'bg-black text-white border-black shadow-xs' : 'bg-[#F8F8F5] text-[#555555] border-[#E5E5E0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#444444] mb-1">Target City Zone</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs"
            >
              <option value="ALL_CHENNAI">All Chennai Service Zones</option>
              <option value="OMR_CORRIDOR">OMR Corridor (Sholinganallur, Perungudi)</option>
              <option value="VELACHERY">Velachery & Medavakkam</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#444444] mb-1">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Peak Surge Incentive Active in OMR"
              className="w-full p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs font-bold focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#444444] mb-1">Broadcast Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type announcement copy..."
              className="w-full p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {sentSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
            <span>{sentSuccess ? 'Broadcast Dispatched!' : 'Send Operational Notification'}</span>
          </button>
        </form>

        {/* Recent Broadcasts */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-3 text-xs">
          <h3 className="font-black text-sm text-[#111111]">Recent Dispatched Broadcasts</h3>
          <div className="space-y-2.5">
            {[
              { title: 'Monsoon AC Care Demand Surge', target: 'POPCIX PRO', time: 'Today 09:00', reach: '142 Pros' },
              { title: 'Free Safety Inspection Month', target: 'Customer App', time: 'Yesterday', reach: '3,840 Users' },
              { title: 'Friday Automated Payouts Processed', target: 'POPCIX PRO', time: '11 Sep', reach: '128 Pros' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-[#F8F8F5] rounded-2xl border border-[#EBEBE6] space-y-1">
                <div className="flex justify-between font-bold text-[#111111]">
                  <span>{item.title}</span>
                  <span className="text-[10px] text-emerald-700">{item.reach}</span>
                </div>
                <div className="text-[10px] text-[#6B6B6B]">{item.target} • {item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
