/**
 * POPCIX ADMIN - Financial Operations Screen
 * Payments ledger, Friday scheduled partner payouts, and customer refund processing.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { PaymentTransactionRecord, RefundRequestRecord, PayoutRecord } from '../types/admin';
import { CreditCard, RotateCcw, DollarSign, Check, XCircle } from 'lucide-react';

export function AdminFinanceScreen() {
  const { payments, refunds, payouts, processRefund } = useAdminData();
  const { hasPermission } = useAdminAuth();
  const [activeFinanceTab, setActiveFinanceTab] = useState<'payments' | 'payouts' | 'refunds'>('payments');

  const paymentColumns: Column<PaymentTransactionRecord>[] = [
    {
      key: 'transactionRef',
      header: 'Txn Reference',
      sortable: true,
      render: (p) => <span className="font-mono font-bold text-xs">{p.transactionRef}</span>
    },
    {
      key: 'bookingCode',
      header: 'Booking',
      render: (p) => <span className="font-bold text-xs">#{p.bookingCode}</span>
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (p) => <span className="text-xs font-semibold">{p.customerName}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (p) => <span className="font-black text-xs text-[#10B981]">₹{p.amount}</span>
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: (p) => <span className="text-[11px] bg-[#F8F8F5] px-2 py-0.5 rounded border">{p.method}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <POPCIXStatusBadge status={p.status} type="PAYMENT" />
    }
  ];

  const refundColumns: Column<RefundRequestRecord>[] = [
    {
      key: 'refundCode',
      header: 'Refund Code',
      sortable: true,
      render: (r) => <span className="font-mono font-bold text-xs">{r.refundCode}</span>
    },
    {
      key: 'bookingCode',
      header: 'Booking',
      render: (r) => <span className="font-bold text-xs">#{r.bookingCode}</span>
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (r) => <span className="text-xs font-semibold">{r.customerName}</span>
    },
    {
      key: 'amount',
      header: 'Refund Amount',
      sortable: true,
      render: (r) => <span className="font-black text-xs text-rose-600">₹{r.amount}</span>
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r) => <span className="text-xs text-[#6B6B6B] truncate max-w-xs">{r.reason}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <POPCIXStatusBadge status={r.status} />
    },
    {
      key: 'actions',
      header: 'Action',
      render: (r) => r.status === 'REQUESTED' && hasPermission('PROCESS_REFUNDS') ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => processRefund(r.id, true, 'Approved by Finance Admin')}
            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            title="Approve Refund"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => processRefund(r.id, false, 'Rejected by Finance Admin')}
            className="p-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
            title="Reject Refund"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null
    }
  ];

  const payoutColumns: Column<PayoutRecord>[] = [
    {
      key: 'payoutRef',
      header: 'Payout Ref',
      sortable: true,
      render: (p) => <span className="font-mono font-bold text-xs">{p.payoutRef}</span>
    },
    {
      key: 'proName',
      header: 'Specialist',
      render: (p) => <span className="font-bold text-xs text-[#111111]">{p.proName}</span>
    },
    {
      key: 'bankName',
      header: 'Bank Settlement',
      render: (p) => (
        <span className="text-[11px] text-[#555555]">{p.bankName} ({p.accountNumberMasked})</span>
      )
    },
    {
      key: 'amount',
      header: 'Net Payout',
      sortable: true,
      render: (p) => <span className="font-black text-xs text-[#10B981]">₹{p.amount}</span>
    },
    {
      key: 'scheduledDate',
      header: 'Disbursement Date',
      render: (p) => <span className="text-xs text-[#6B6B6B]">{p.scheduledDate}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <POPCIXStatusBadge status={p.status} />
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Financial Operations & Payouts</h2>
        <p className="text-xs text-[#6B6B6B]">Customer payments, Friday automated pro disbursements, and refund approvals</p>
      </div>

      {/* Finance Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
        <button
          onClick={() => setActiveFinanceTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFinanceTab === 'payments' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments Ledger ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveFinanceTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFinanceTab === 'payouts' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Friday Pro Payouts ({payouts.length})</span>
        </button>

        <button
          onClick={() => setActiveFinanceTab('refunds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFinanceTab === 'refunds' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refund Requests ({refunds.length})</span>
        </button>
      </div>

      {/* Tab Data Table */}
      {activeFinanceTab === 'payments' && (
        <POPCIXDataTable
          data={payments}
          columns={paymentColumns}
          searchPlaceholder="Search transactions..."
          searchFilter={(p, q) => p.transactionRef.toLowerCase().includes(q.toLowerCase()) || p.customerName.toLowerCase().includes(q.toLowerCase())}
          exportFileName="popcix_payments"
        />
      )}

      {activeFinanceTab === 'payouts' && (
        <POPCIXDataTable
          data={payouts}
          columns={payoutColumns}
          searchPlaceholder="Search payouts..."
          searchFilter={(p, q) => p.proName.toLowerCase().includes(q.toLowerCase()) || p.payoutRef.toLowerCase().includes(q.toLowerCase())}
          exportFileName="popcix_payouts"
        />
      )}

      {activeFinanceTab === 'refunds' && (
        <POPCIXDataTable
          data={refunds}
          columns={refundColumns}
          searchPlaceholder="Search refund requests..."
          searchFilter={(r, q) => r.refundCode.toLowerCase().includes(q.toLowerCase()) || r.customerName.toLowerCase().includes(q.toLowerCase())}
          exportFileName="popcix_refunds"
        />
      )}
    </div>
  );
}
