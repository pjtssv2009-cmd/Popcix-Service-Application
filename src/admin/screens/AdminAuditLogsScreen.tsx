/**
 * POPCIX ADMIN - Immutable Security Audit Trail Screen
 * Append-only historical log of all administrative actions, role modifications, and financial approvals.
 */

import React from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { useAdminData } from '../context/AdminDataContext';
import { AuditLogEntry } from '../types/admin';
import { ShieldCheck, FileText } from 'lucide-react';

export function AdminAuditLogsScreen() {
  const { auditLogs } = useAdminData();

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'action',
      header: 'Admin Action',
      sortable: true,
      render: (a) => (
        <span className="font-bold text-xs text-[#111111] bg-[#F8F8F5] px-2 py-0.5 rounded border">
          {a.action}
        </span>
      )
    },
    {
      key: 'resource',
      header: 'Resource Target',
      render: (a) => (
        <div>
          <span className="font-mono text-xs text-[#111111]">{a.resourceId}</span>
          <span className="text-[10px] text-[#6B6B6B] block">table: {a.resource}</span>
        </div>
      )
    },
    {
      key: 'adminEmail',
      header: 'Executed By',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{a.adminEmail}</div>
          <div className="text-[10px] text-[#065F46] font-semibold">{a.adminRole}</div>
        </div>
      )
    },
    {
      key: 'stateChange',
      header: 'State Delta',
      render: (a) => a.previousState || a.newState ? (
        <div className="text-[11px] font-mono">
          {a.previousState && <span className="text-rose-600 line-through mr-1">{a.previousState}</span>}
          {a.newState && <span className="text-emerald-700 font-bold">→ {a.newState}</span>}
        </div>
      ) : (
        <span className="text-zinc-400 italic">Logged</span>
      )
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (a) => <span className="text-xs text-[#6B6B6B]">{a.timestamp}</span>
    },
    {
      key: 'ipAddress',
      header: 'IP / Terminal',
      render: (a) => <span className="font-mono text-[10px] text-[#888888]">{a.ipAddress}</span>
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Security Audit Logs</h2>
        <p className="text-xs text-[#6B6B6B]">Append-only compliance log of administrative actions, pricing edits, and KYC decisions</p>
      </div>

      <POPCIXDataTable
        data={auditLogs}
        columns={columns}
        searchPlaceholder="Search audit logs by admin email, action..."
        searchFilter={(a, q) =>
          a.action.toLowerCase().includes(q.toLowerCase()) ||
          a.adminEmail.toLowerCase().includes(q.toLowerCase()) ||
          a.resourceId.toLowerCase().includes(q.toLowerCase())
        }
        exportFileName="popcix_security_audit_logs"
      />
    </div>
  );
}
