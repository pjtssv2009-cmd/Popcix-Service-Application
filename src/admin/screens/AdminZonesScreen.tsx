/**
 * POPCIX ADMIN - Service Zones & Geofencing Screen
 * Manage Country → State → City → Zone hierarchy, active pros, and locality coverage.
 */

import React from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ServiceZone } from '../types/admin';
import { MapPin, Users, CalendarCheck, CheckCircle2 } from 'lucide-react';

export function AdminZonesScreen() {
  const { zones, toggleZoneActive } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const columns: Column<ServiceZone>[] = [
    {
      key: 'zoneName',
      header: 'Service Zone',
      sortable: true,
      render: (z) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{z.zoneName}</div>
          <div className="text-[10px] text-[#6B6B6B]">{z.city}, {z.state}</div>
        </div>
      )
    },
    {
      key: 'localities',
      header: 'Covered Localities',
      render: (z) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {z.localities.map(loc => (
            <span key={loc} className="text-[10px] bg-[#F8F8F5] border border-[#E5E5E0] px-1.5 py-0.5 rounded text-[#444444]">
              {loc}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'activeProsCount',
      header: 'Active Pros',
      sortable: true,
      render: (z) => <span className="font-bold text-xs text-[#111111]">{z.activeProsCount} Pros</span>
    },
    {
      key: 'activeBookingsCount',
      header: 'Active Bookings',
      sortable: true,
      render: (z) => <span className="font-black text-xs text-emerald-600">{z.activeBookingsCount} Live</span>
    },
    {
      key: 'avgCompletionRate',
      header: 'Completion %',
      sortable: true,
      render: (z) => <span className="font-semibold text-xs text-[#333333]">{z.avgCompletionRate}%</span>
    },
    {
      key: 'isActive',
      header: 'Zone Status',
      render: (z) => (
        <button
          onClick={() => hasPermission('MANAGE_ZONES') && toggleZoneActive(z.id)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
            z.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
          }`}
        >
          {z.isActive ? '● Active' : '○ Disabled'}
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Service Zones & Geofencing</h2>
        <p className="text-xs text-[#6B6B6B]">City operational hubs, locality assignments, and live capacity balance</p>
      </div>

      <POPCIXDataTable
        data={zones}
        columns={columns}
        searchPlaceholder="Search service zones..."
        searchFilter={(z, q) => z.zoneName.toLowerCase().includes(q.toLowerCase()) || z.city.toLowerCase().includes(q.toLowerCase())}
        exportFileName="popcix_service_zones"
      />
    </div>
  );
}
