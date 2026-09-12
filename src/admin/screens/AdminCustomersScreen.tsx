/**
 * POPCIX ADMIN - Customer Management & CRM Screen
 * Homeowner profiles, lifetime spend, booking frequency, and operational support history.
 */

import React from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { Users, Star, DollarSign } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  totalBookings: number;
  totalSpend: number;
  lastBookingDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const CUSTOMERS_LIST: CustomerRecord[] = [
  { id: 'c1', name: 'Siddharth V.', phone: '+91 98840 19201', email: 'siddharth.v@gmail.com', zone: 'OMR - Sholinganallur', totalBookings: 8, totalSpend: 7420, lastBookingDate: 'Today', status: 'ACTIVE' },
  { id: 'c2', name: 'Meera Krishnan', phone: '+91 97909 44102', email: 'meera.k@yahoo.com', zone: 'OMR - Perungudi', totalBookings: 5, totalSpend: 6200, lastBookingDate: 'Today', status: 'ACTIVE' },
  { id: 'c3', name: 'Anand R.', phone: '+91 94441 88319', email: 'anand.r@gmail.com', zone: 'OMR - Thoraipakkam', totalBookings: 6, totalSpend: 4890, lastBookingDate: 'Today', status: 'ACTIVE' },
  { id: 'c4', name: 'Divya Nair', phone: '+91 99620 77120', email: 'divya.n@outlook.com', zone: 'Velachery', totalBookings: 4, totalSpend: 5400, lastBookingDate: 'Yesterday', status: 'ACTIVE' }
];

export function AdminCustomersScreen() {
  const columns: Column<CustomerRecord>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{c.name}</div>
          <div className="text-[10px] text-[#6B6B6B]">{c.phone} • {c.email}</div>
        </div>
      )
    },
    {
      key: 'zone',
      header: 'Primary Hub',
      render: (c) => <span className="text-xs text-[#555555]">{c.zone}</span>
    },
    {
      key: 'totalBookings',
      header: 'Bookings',
      sortable: true,
      render: (c) => <span className="font-bold text-xs text-[#111111]">{c.totalBookings} Completed</span>
    },
    {
      key: 'totalSpend',
      header: 'Lifetime Spend',
      sortable: true,
      render: (c) => <span className="font-black text-xs text-[#10B981]">₹{c.totalSpend.toLocaleString()}</span>
    },
    {
      key: 'lastBookingDate',
      header: 'Last Active',
      render: (c) => <span className="text-xs text-[#6B6B6B]">{c.lastBookingDate}</span>
    },
    {
      key: 'status',
      header: 'Account',
      render: (c) => (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          ✓ {c.status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Customer CRM & Spend Ledger</h2>
        <p className="text-xs text-[#6B6B6B]">Homeowner accounts, lifetime booking frequency, and service loyalty</p>
      </div>

      <POPCIXDataTable
        data={CUSTOMERS_LIST}
        columns={columns}
        searchPlaceholder="Search customer by name, email, phone..."
        searchFilter={(c, q) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q) || c.email.toLowerCase().includes(q.toLowerCase())}
        exportFileName="popcix_customers"
      />
    </div>
  );
}
