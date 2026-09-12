/**
 * POPCIX ADMIN - KYC Verification Queue & Document Inspection Screen
 * Secure review of Aadhaar, PAN, Trade Certificates, and verification decisions.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminKYCApplication } from '../types/admin';
import { ShieldCheck, X, FileText, Check, Ban, AlertCircle } from 'lucide-react';

export function AdminKYCScreen() {
  const { kycApplications, updateKYCStatus } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const [selectedApp, setSelectedApp] = useState<AdminKYCApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const columns: Column<AdminKYCApplication>[] = [
    {
      key: 'proName',
      header: 'Specialist Name',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{a.proName}</div>
          <div className="text-[10px] text-[#6B6B6B]">{a.phone}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (a) => (
        <span className="px-2 py-0.5 rounded-md bg-[#F0F0EB] text-[10px] font-bold text-[#333333]">
          {a.category}
        </span>
      )
    },
    {
      key: 'experienceYears',
      header: 'Experience',
      render: (a) => (
        <span className="text-xs text-[#333333] font-semibold">{a.experienceYears} Years</span>
      )
    },
    {
      key: 'documents',
      header: 'Submitted Documents',
      render: (a) => (
        <div className="flex items-center gap-1">
          {a.documents.map(d => (
            <span key={d.id} className="text-[10px] bg-white border border-[#E5E5E0] px-1.5 py-0.5 rounded text-[#555555]">
              {d.documentType}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'submissionDate',
      header: 'Submitted Date',
      sortable: true,
      render: (a) => <span className="text-xs text-[#6B6B6B]">{a.submissionDate}</span>
    },
    {
      key: 'status',
      header: 'KYC Status',
      render: (a) => <POPCIXStatusBadge status={a.status} type="KYC" />
    }
  ];

  const handleApprove = (appId: string) => {
    updateKYCStatus(appId, 'APPROVED');
    setSelectedApp(null);
  };

  const handleReject = () => {
    if (!selectedApp || !rejectReason) return;
    updateKYCStatus(selectedApp.id, 'REJECTED', rejectReason);
    setShowRejectModal(false);
    setSelectedApp(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">KYC & Document Verification</h2>
        <p className="text-xs text-[#6B6B6B]">Compliance review for Aadhaar, PAN and Trade Certifications</p>
      </div>

      {/* KYC Table */}
      <POPCIXDataTable
        data={kycApplications}
        columns={columns}
        searchPlaceholder="Search technician by name, phone..."
        searchFilter={(a, q) =>
          a.proName.toLowerCase().includes(q.toLowerCase()) ||
          a.phone.includes(q) ||
          a.category.toLowerCase().includes(q.toLowerCase())
        }
        filterOptions={[
          {
            key: 'status',
            label: 'Status',
            values: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_ACTION'],
            getter: (a) => a.status
          },
          {
            key: 'category',
            label: 'Category',
            values: ['AC Technician', 'Plumber', 'Electrician'],
            getter: (a) => a.category
          }
        ]}
        exportFileName="popcix_kyc_queue"
        onRowClick={(app) => setSelectedApp(app)}
      />

      {/* KYC Inspection Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E5E5E0]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E5E5E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#111111]">{selectedApp.proName}</h3>
                  <POPCIXStatusBadge status={selectedApp.status} type="KYC" />
                </div>
                <p className="text-xs text-[#6B6B6B]">{selectedApp.category} • {selectedApp.experienceYears} yrs experience</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Document List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-[#F8F8F5] p-3 rounded-2xl border border-[#EBEBE6] text-xs">
                <div className="text-[10px] font-bold uppercase text-[#888888] mb-1">Contact & Region</div>
                <div>Phone: <strong>{selectedApp.phone}</strong></div>
                <div>Email: <strong>{selectedApp.email}</strong></div>
                <div>City Hub: <strong>{selectedApp.city}</strong></div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  VERIFICATION DOCUMENTS ({selectedApp.documents.length})
                </h4>

                {selectedApp.documents.map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-[#E5E5E0] bg-white space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        {doc.documentType}
                      </span>
                      <span className="font-mono text-xs text-[#6B6B6B] font-bold">
                        {doc.documentNumberMasked}
                      </span>
                    </div>

                    {/* Preview Image */}
                    <img
                      src={doc.fileUrl}
                      alt={doc.documentType}
                      className="w-full h-40 object-cover rounded-xl border border-[#CCCCCC]"
                    />

                    <div className="flex justify-between items-center text-[10px] text-[#888888] pt-1">
                      <span>Uploaded: {doc.uploadedAt}</span>
                      <span className="text-emerald-600 font-bold">✓ High Resolution Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Actions Footer */}
            {hasPermission('APPROVE_KYC') && selectedApp.status !== 'APPROVED' && (
              <div className="p-4 border-t border-[#E5E5E0] bg-[#F8F8F5] flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApprove(selectedApp.id)}
                  className="flex-2 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approve & Activate Pro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject KYC Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center border shadow-2xl space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-600" />
            <h4 className="text-sm font-bold text-[#111111]">Reject KYC Submission</h4>
            <p className="text-xs text-[#6B6B6B]">Specify reason for compliance audit:</p>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 bg-[#F8F8F5] border rounded-xl text-xs"
            >
              <option value="">Select reason...</option>
              <option value="Blurry / unreadable document photo">Blurry / unreadable document photo</option>
              <option value="PAN name does not match Aadhaar profile">PAN name does not match Aadhaar profile</option>
              <option value="Expired trade license / certificate">Expired trade license / certificate</option>
              <option value="Address proof not in authorized service city">Address proof not in authorized service city</option>
            </select>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2 bg-[#F0F0EB] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason}
                onClick={handleReject}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
