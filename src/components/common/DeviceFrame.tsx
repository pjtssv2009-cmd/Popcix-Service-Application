/**
 * POPCIX Device Frame & Responsive Wrapper
 * Provides an authentic smartphone viewport container with status bar,
 * dynamic island / notch, and mode toggles.
 */

import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

export interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [deviceFrameEnabled, setDeviceFrameEnabled] = useState<boolean>(true);
  const [currentDevice, setCurrentDevice] = useState<'iphone' | 'android'>('iphone');

  return (
    <div className="min-h-screen bg-[#EFEFEA] flex flex-col items-center justify-start sm:py-6 px-0 sm:px-4">
      {/* Top Desktop Controls Bar (Only visible on wide screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs font-semibold text-[#6B6B6B]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-extrabold text-black tracking-wider">POPCIX MOBILE PREVIEW</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#DFDFD6] shadow-2xs">
          <button
            onClick={() => {
              setDeviceFrameEnabled(true);
              setCurrentDevice('iphone');
            }}
            className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
              deviceFrameEnabled && currentDevice === 'iphone'
                ? 'bg-black text-white font-bold'
                : 'text-[#6B6B6B] hover:text-black'
            }`}
          >
            iPhone Frame
          </button>
          <button
            onClick={() => {
              setDeviceFrameEnabled(true);
              setCurrentDevice('android');
            }}
            className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
              deviceFrameEnabled && currentDevice === 'android'
                ? 'bg-black text-white font-bold'
                : 'text-[#6B6B6B] hover:text-black'
            }`}
          >
            Android Frame
          </button>
          <button
            onClick={() => setDeviceFrameEnabled(false)}
            className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
              !deviceFrameEnabled ? 'bg-black text-white font-bold' : 'text-[#6B6B6B] hover:text-black'
            }`}
          >
            Full Width
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          deviceFrameEnabled
            ? 'max-w-[420px] min-h-[860px] max-h-[92vh] bg-[#F8F8F5] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border-[10px] border-[#181818] overflow-hidden'
            : 'max-w-md min-h-screen bg-[#F8F8F5] shadow-lg'
        }`}
      >
        {/* Device Top Status Bar (Only in Frame Mode) */}
        {deviceFrameEnabled && (
          <div className="sticky top-0 z-50 bg-[#F8F8F5] px-7 pt-3 pb-1 flex items-center justify-between select-none">
            <span className="text-xs font-black text-black">9:41</span>

            {/* Dynamic Island / Notch */}
            {currentDevice === 'iphone' ? (
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#222222]" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto" />
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-black">
              <span>5G</span>
              <span className="w-4 h-2.5 border border-black rounded-[3px] p-[1px] inline-flex items-center">
                <span className="w-full h-full bg-black rounded-[1px]" />
              </span>
            </div>
          </div>
        )}

        {/* Screen Content Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-[#F8F8F5] pb-24">
          {children}
        </div>

        {/* Home Indicator Bar (iPhone frame) */}
        {deviceFrameEnabled && currentDevice === 'iphone' && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/30 rounded-full z-50 pointer-events-none" />
        )}
      </div>
    </div>
  );
};
