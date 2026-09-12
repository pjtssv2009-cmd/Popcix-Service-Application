/**
 * POPCIX ADMIN - Services Catalogue, Checklists & Pricing Engine Screen
 * Real-time price formula adjustments, checklist configuration, and zone availability.
 */

import React, { useState } from 'react';
import { POPCIXDataTable, Column } from '../components/POPCIXDataTable';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminServiceItem } from '../types/admin';
import { Wrench, Edit3, CheckCircle, XCircle, Plus, Check } from 'lucide-react';

export function AdminServicesScreen() {
  const { services, updateServicePricing, toggleServiceActive } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const [selectedService, setSelectedService] = useState<AdminServiceItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editPayout, setEditPayout] = useState('');
  const [editPlatformFee, setEditPlatformFee] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const columns: Column<AdminServiceItem>[] = [
    {
      key: 'title',
      header: 'Service Name',
      sortable: true,
      render: (s) => (
        <div>
          <div className="font-bold text-xs text-[#111111]">{s.title}</div>
          <div className="text-[10px] text-[#6B6B6B]">{s.categoryName} • {s.durationMinutes} mins</div>
        </div>
      )
    },
    {
      key: 'basePrice',
      header: 'Customer Price',
      sortable: true,
      render: (s) => (
        <span className="font-black text-xs text-[#111111]">₹{s.basePrice}</span>
      )
    },
    {
      key: 'professionalPayout',
      header: 'Pro Net Payout',
      sortable: true,
      render: (s) => (
        <span className="font-bold text-xs text-[#10B981]">₹{s.professionalPayout}</span>
      )
    },
    {
      key: 'platformCommission',
      header: 'Platform Fee',
      render: (s) => (
        <span className="font-semibold text-xs text-[#6B6B6B]">₹{s.platformCommission}</span>
      )
    },
    {
      key: 'checklist',
      header: 'Checklist Items',
      render: (s) => (
        <span className="text-xs bg-[#F8F8F5] px-2 py-0.5 rounded-md border text-[#444444]">
          {s.checklist.length} Steps
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Availability',
      render: (s) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasPermission('MANAGE_SERVICES')) toggleServiceActive(s.id);
          }}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
            s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
          }`}
        >
          {s.isActive ? '● Active' : '○ Disabled'}
        </button>
      )
    }
  ];

  const handleOpenEdit = (service: AdminServiceItem) => {
    setSelectedService(service);
    setEditPrice(service.basePrice.toString());
    setEditPayout(service.professionalPayout.toString());
    setEditPlatformFee(service.platformCommission.toString());
    setSaveSuccess(false);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    const p = parseFloat(editPrice) || selectedService.basePrice;
    const pay = parseFloat(editPayout) || selectedService.professionalPayout;
    const fee = parseFloat(editPlatformFee) || selectedService.platformCommission;

    updateServicePricing(selectedService.id, p, pay, fee);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedService(null);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Services Catalogue & Dynamic Pricing</h2>
        <p className="text-xs text-[#6B6B6B]">Configure service categories, pricing equations, and mandatory doorstep checklists</p>
      </div>

      {/* Services Table */}
      <POPCIXDataTable
        data={services}
        columns={columns}
        searchPlaceholder="Search service catalogue..."
        searchFilter={(s, q) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.categoryName.toLowerCase().includes(q.toLowerCase())
        }
        filterOptions={[
          {
            key: 'categoryName',
            label: 'Category',
            values: ['AC Services', 'Electrical'],
            getter: (s) => s.categoryName
          }
        ]}
        exportFileName="popcix_services_catalog"
        onRowClick={(s) => handleOpenEdit(s)}
      />

      {/* Service Pricing & Checklist Editor Drawer */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E5E5E0]">
            <div className="p-5 border-b border-[#E5E5E0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="font-bold text-sm text-[#111111]">{selectedService.title}</h3>
                <p className="text-xs text-[#6B6B6B]">{selectedService.categoryName}</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Pricing Form */}
              <form onSubmit={handleSavePricing} className="bg-[#F8F8F5] p-4 rounded-2xl border border-[#EBEBE6] space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">
                  DYNAMIC PRICING ENGINE (₹)
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#444444] mb-1">Customer Base Price</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    disabled={!hasPermission('EDIT_PRICING')}
                    className="w-full p-2.5 bg-white border border-[#CCCCCC] rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#444444] mb-1">Pro Net Payout</label>
                    <input
                      type="number"
                      value={editPayout}
                      onChange={(e) => setEditPayout(e.target.value)}
                      disabled={!hasPermission('EDIT_PRICING')}
                      className="w-full p-2.5 bg-white border border-[#CCCCCC] rounded-xl text-xs font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#444444] mb-1">Platform Fee</label>
                    <input
                      type="number"
                      value={editPlatformFee}
                      onChange={(e) => setEditPlatformFee(e.target.value)}
                      disabled={!hasPermission('EDIT_PRICING')}
                      className="w-full p-2.5 bg-white border border-[#CCCCCC] rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {hasPermission('EDIT_PRICING') && (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                    <span>{saveSuccess ? 'Price Updated!' : 'Save Pricing Changes'}</span>
                  </button>
                )}
              </form>

              {/* Mandatory Checklist Items */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] shadow-2xs space-y-2.5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">
                  MANDATORY SERVICE CHECKLIST ({selectedService.checklist.length} STEPS)
                </h4>
                <div className="space-y-1.5">
                  {selectedService.checklist.map((step, idx) => (
                    <div key={idx} className="p-2.5 bg-[#F8F8F5] rounded-xl border border-[#EBEBE6] flex items-start gap-2">
                      <span className="font-bold text-[10px] text-zinc-500">{idx + 1}.</span>
                      <span className="text-[#333333] font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved Add-on Services */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] shadow-2xs space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#888888]">
                  CONFIGURED ADD-ONS ({selectedService.addons.length})
                </h4>
                {selectedService.addons.length > 0 ? (
                  selectedService.addons.map(a => (
                    <div key={a.id} className="p-2.5 bg-[#F8F8F5] rounded-xl border border-[#EBEBE6] flex justify-between items-center">
                      <span className="font-bold text-[#111111]">{a.name}</span>
                      <span className="font-black text-[#10B981]">₹{a.price} ({a.durationMin}m)</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#888888] italic">No add-ons linked.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
