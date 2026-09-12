/**
 * POPCIX Address Manager Modal
 * Add and select home, work, or custom delivery addresses.
 */

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MapPin, Plus, Check, X, ArrowLeft, Home, Briefcase, Navigation, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';
import { getCurrentUserLocation } from '../../services/nativeMobile';

export const AddressManagerModal: React.FC = () => {
  const { addresses, addAddress, closeModal } = useMarketplace();
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('Home');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [apartmentSuite, setApartmentSuite] = useState<string>('');
  const [city, setCity] = useState<string>('Bengaluru');
  const [postalCode, setPostalCode] = useState<string>('560038');
  const [instructions, setInstructions] = useState<string>('');

  const handleUseCurrentGPS = async () => {
    setIsLocating(true);
    triggerHaptic('medium');
    try {
      const loc = await getCurrentUserLocation();
      setStreetAddress(loc.address);
      setCity(loc.city);
      triggerHaptic('success');
    } catch {
      triggerHaptic('error');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress) return;

    addAddress({
      label,
      streetAddress,
      apartmentSuite,
      city,
      postalCode,
      instructionsForPro: instructions,
      isDefault: addresses.length === 0,
    });

    setIsAddingNew(false);
    triggerHaptic('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#EAEAE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                if (isAddingNew) setIsAddingNew(false);
                else closeModal();
              }}
              className="w-9 h-9 rounded-full bg-[#F8F8F5] border border-[#DFDFD6] flex items-center justify-center hover:bg-[#EAEAE4]"
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </button>
            <h3 className="text-sm font-black text-[#111111]">
              {isAddingNew ? 'Add New Address' : 'Saved Addresses'}
            </h3>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-[#F8F8F5] flex items-center justify-center hover:bg-[#EAEAE4]"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isAddingNew ? (
            <form onSubmit={handleSave} className="space-y-3.5">
              {/* Label selector */}
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Work', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLabel(type)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        label === type
                          ? 'bg-black text-white'
                          : 'bg-white border border-[#DFDFD6] text-[#6B6B6B]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS Auto Detect Button */}
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                disabled={isLocating}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FEF3C7] active:scale-[0.98] transition-all"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span>{isLocating ? 'Detecting exact GPS...' : 'Use Current Device Location'}</span>
              </button>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Street Address / Building
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Flat 301, Lakeview Enclave, 12th Cross"
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Apartment / Floor (Optional)
                </label>
                <input
                  type="text"
                  value={apartmentSuite}
                  onChange={(e) => setApartmentSuite(e.target.value)}
                  placeholder="Tower A, 3rd Floor"
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Instructions for Pro
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring Bell 301, lift available"
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl p-3 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Save Address
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <Card key={addr.id} variant="surface" padding="md" className="border-[#EAEAE4]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F1F1ED] rounded-xl text-black shrink-0">
                      {addr.label === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#111111]">{addr.label}</h4>
                        {addr.isDefault && <Badge variant="black" size="sm">Default</Badge>}
                      </div>
                      <p className="text-xs text-[#444444] mt-0.5">
                        {addr.streetAddress} {addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ''}
                      </p>
                      <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                        {addr.city} - {addr.postalCode}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => setIsAddingNew(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Address
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
