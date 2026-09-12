/**
 * POPCIX ADMIN - Professional Partner Directory & Performance Screen
 * Specialist credentials, ratings, completion rates, service zones, and activation controls.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { POPCIXStatusBadge } from '../components/POPCIXStatusBadge';
import { useAdminData } from '../context/AdminDataContext';
import { AdminKYCApplication } from '../types/admin';
import { Star, Award, Shield, UserX, UserCheck } from 'lucide-react';

export function AdminProfessionalsScreen() {
  const { kycApplications } = useAdminData();
  const [selectedPro, setSelectedPro] = useState<AdminKYCApplication | null>(null);

  const columns: Column<AdminKYCApplication>[] = [
    {
      key: 'proName',
      header: 'Specialist',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{p.proName}</div>
          <div className="text-[10px] text-[#6B6B6B]">{p.phone}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (p) => (
        <span className="px-2 py-0.5 rounded-md bg-[#F0F0EB] text-[10px] font-bold text-[#333333]">
          {p.category}
        </span>
      )
    },
    {
      key: 'experienceYears',
      header: 'Experience',
      render: (p) => <span className="text-xs text-[#333333] font-semibold">{p.experienceYears} Years</span>
    },
    {
      key: 'city',
      header: 'Operating City',
      render: (p) => <span className="text-xs text-[#6B6B6B]">{p.city}</span>
    },
    {
      key: 'status',
      header: 'KYC Status',
      render: (p) => <POPCIXStatusBadge status={p.status} type="KYC" />
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Professional Partner Directory</h2>
        <p className="text-xs text-[#6B6B6B]">Performance scorecards, trade categories, and account status</p>
      </div>

      <POPCIXDataTable
        data={kycApplications}
        columns={columns}
        searchPlaceholder="Search professional by name, phone..."
        searchFilter={(p, q) =>
          p.proName.toLowerCase().includes(q.toLowerCase()) ||
          p.phone.includes(q) ||
          p.category.toLowerCase().includes(q.toLowerCase())
        }
        exportFileName="popcix_professionals"
        onRowClick={(p) => setSelectedPro(p)}
      />
    </div>
  );
}
