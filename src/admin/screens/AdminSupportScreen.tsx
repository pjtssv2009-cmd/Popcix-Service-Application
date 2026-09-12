/**
 * POPCIX ADMIN - Support Desk & Dispute Resolution Screen
 * Tickets triage, customer ↔ technician dispute review, and conversation thread responses.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { SupportTicketRecord, DisputeRecord } from '../types/admin';
import { Headphones, AlertTriangle, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export function AdminSupportScreen() {
  const { supportTickets, disputes, replyToSupportTicket, resolveDispute } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'tickets' | 'disputes'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketRecord | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);
  const [disputeResolution, setDisputeResolution] = useState('');

  const ticketColumns: Column<SupportTicketRecord>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-xs">#{t.ticketCode}</span>
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (t) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{t.subject}</div>
          <div className="text-[10px] text-[#6B6B6B]">From: {t.requesterName} ({t.requesterType})</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (t) => <span className="text-xs bg-[#F8F8F5] px-2 py-0.5 rounded border font-semibold">{t.category}</span>
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          t.priority === 'CRITICAL' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
          t.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-zinc-100 text-zinc-700'
        }`}>
          {t.priority}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <POPCIXStatusBadge status={t.status} />
    }
  ];

  const disputeColumns: Column<DisputeRecord>[] = [
    {
      key: 'disputeCode',
      header: 'Dispute Code',
      sortable: true,
      render: (d) => <span className="font-mono font-bold text-xs">#{d.disputeCode}</span>
    },
    {
      key: 'parties',
      header: 'Parties Involved',
      render: (d) => (
        <div className="text-xs">
          <div className="font-bold text-[#111111]">Customer: {d.customerName}</div>
          <div className="text-[10px] text-[#6B6B6B]">Pro: {d.proName} • #{d.bookingCode}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (d) => <span className="text-xs font-bold text-[#333333]">{d.category.replace('_', ' ')}</span>
    },
    {
      key: 'claimAmount',
      header: 'Claim (₹)',
      render: (d) => <span className="font-black text-xs text-rose-600">₹{d.claimAmount}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (d) => <POPCIXStatusBadge status={d.status} />
    }
  ];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    replyToSupportTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !disputeResolution.trim()) return;
    resolveDispute(selectedDispute.id, disputeResolution.trim());
    setSelectedDispute(null);
    setDisputeResolution('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Support Desk & Dispute Center</h2>
        <p className="text-xs text-[#6B6B6B]">Customer support triage, incident logs, and formal dispute settlements</p>
      </div>

      <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tickets' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Support Tickets ({supportTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'disputes' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Customer ↔ Pro Disputes ({disputes.length})</span>
        </button>
      </div>

      {activeTab === 'tickets' && (
        <POPCIXDataTable
          data={supportTickets}
          columns={ticketColumns}
          searchPlaceholder="Search tickets..."
          searchFilter={(t, q) => t.ticketCode.toLowerCase().includes(q.toLowerCase()) || t.subject.toLowerCase().includes(q.toLowerCase())}
          exportFileName="popcix_support_tickets"
          onRowClick={(t) => setSelectedTicket(t)}
        />
      )}

      {activeTab === 'disputes' && (
        <POPCIXDataTable
          data={disputes}
          columns={disputeColumns}
          searchPlaceholder="Search disputes..."
          searchFilter={(d, q) => d.disputeCode.toLowerCase().includes(q.toLowerCase()) || d.customerName.toLowerCase().includes(q.toLowerCase())}
          exportFileName="popcix_disputes"
          onRowClick={(d) => setSelectedDispute(d)}
        />
      )}

      {/* Ticket Conversation Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E5E5E0]">
            <div className="p-5 border-b border-[#E5E5E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="font-bold text-sm text-[#111111]">#{selectedTicket.ticketCode} — {selectedTicket.subject}</h3>
                <p className="text-xs text-[#6B6B6B]">{selectedTicket.requesterName} • {selectedTicket.category}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {selectedTicket.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                    msg.isAgent ? 'bg-[#F8F8F5] border border-[#EBEBE6] ml-6' : 'bg-black text-white mr-6'
                  }`}
                >
                  <div className="flex justify-between font-bold text-[11px] opacity-80">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#E5E5E0] bg-[#FAFAF7] flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type response to ticket..."
                className="flex-1 p-2.5 bg-white border border-[#CCCCCC] rounded-xl text-xs focus:outline-none focus:border-black"
              />
              <button type="submit" className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Resolution Drawer */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E5E5E0]">
            <div className="p-5 border-b border-[#E5E5E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="font-bold text-sm text-[#111111]">Dispute #{selectedDispute.disputeCode}</h3>
                <p className="text-xs text-[#6B6B6B]">Booking: #{selectedDispute.bookingCode}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-full bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-[#F8F8F5] p-4 rounded-2xl border border-[#EBEBE6] space-y-2">
                <div className="font-bold text-sm text-[#111111]">Dispute Summary</div>
                <p className="text-[#444444]">{selectedDispute.summary}</p>
                <div className="font-black text-rose-600">Claim Amount: ₹{selectedDispute.claimAmount}</div>
              </div>

              {selectedDispute.evidenceFiles.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#111111] mb-2">Evidence Photo Proof</h4>
                  <img
                    src={selectedDispute.evidenceFiles[0]}
                    alt="Evidence"
                    className="w-full h-44 object-cover rounded-2xl border"
                  />
                </div>
              )}

              {hasPermission('RESOLVE_DISPUTES') && selectedDispute.status !== 'RESOLVED' && (
                <form onSubmit={handleResolveDispute} className="space-y-3 pt-2">
                  <h4 className="font-bold text-[#111111]">Official Resolution Decision</h4>
                  <textarea
                    rows={3}
                    value={disputeResolution}
                    onChange={(e) => setDisputeResolution(e.target.value)}
                    placeholder="Enter final arbitration verdict..."
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#CCCCCC] rounded-xl text-xs focus:outline-none"
                    required
                  />
                  <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl hover:bg-zinc-800">
                    Record Verdict & Resolve Dispute
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
