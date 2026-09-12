/**
 * POPCIX ADMIN - Reviews & Ratings Moderation Screen
 * Inspect customer ratings, verified comments, flagged reviews, and service feedback.
 */

import React from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { Star, Flag, CheckCircle } from 'lucide-react';

interface ReviewItem {
  id: string;
  bookingCode: string;
  customerName: string;
  proName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'RESOLVED';
}

const REVIEWS_DATA: ReviewItem[] = [
  { id: 'r1', bookingCode: 'PCX-102948', customerName: 'Siddharth V.', proName: 'Ravi Kumar', serviceName: 'Split AC Deep Cleaning', rating: 5.0, comment: 'Ravi was on-time, professional and wore shoe covers. AC cooling is silent and ice cold!', date: 'Today', status: 'PUBLISHED' },
  { id: 'r2', bookingCode: 'PCX-102951', customerName: 'Divya Nair', proName: 'Priya Sundaram', serviceName: 'Deep Home Sanitization', rating: 5.0, comment: 'Priya did a spotless job in kitchen and bathrooms. Highly recommend POPCIX.', date: 'Yesterday', status: 'PUBLISHED' },
  { id: 'r3', bookingCode: 'PCX-102952', customerName: 'Vikram Seth', proName: 'Suresh Plumber', serviceName: 'Pressure Pump Repair', rating: 2.0, comment: 'Technician was late by 45 mins. Issue took longer than estimated duration.', date: '10 Sep', status: 'FLAGGED' }
];

export function AdminReviewsScreen() {
  const columns: Column<ReviewItem>[] = [
    {
      key: 'bookingCode',
      header: 'Booking',
      render: (r) => <span className="font-bold text-xs">#{r.bookingCode}</span>
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (r) => (
        <span className="font-bold text-xs text-[#FFAA00] flex items-center gap-1">
          ⭐ {r.rating.toFixed(1)}
        </span>
      )
    },
    {
      key: 'comment',
      header: 'Customer Review',
      render: (r) => (
        <div>
          <p className="text-xs text-[#111111] font-medium leading-relaxed">"{r.comment}"</p>
          <span className="text-[10px] text-[#6B6B6B]">By {r.customerName} for {r.proName}</span>
        </div>
      )
    },
    {
      key: 'serviceName',
      header: 'Service Category',
      render: (r) => <span className="text-xs text-[#555555]">{r.serviceName}</span>
    },
    {
      key: 'status',
      header: 'Moderation',
      render: (r) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          r.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Customer Reviews & Ratings</h2>
        <p className="text-xs text-[#6B6B6B]">Transparent customer feedback and policy-compliant moderation</p>
      </div>

      <POPCIXDataTable
        data={REVIEWS_DATA}
        columns={columns}
        searchPlaceholder="Search reviews by pro, customer, comment..."
        searchFilter={(r, q) => r.comment.toLowerCase().includes(q.toLowerCase()) || r.proName.toLowerCase().includes(q.toLowerCase())}
        exportFileName="popcix_reviews"
      />
    </div>
  );
}
