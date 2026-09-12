/**
 * POPCIX App Shell & Responsive Container
 * Provides edge-to-edge native viewport on mobile devices / APK,
 * and elegant responsive presentation on desktop.
 */

import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { listenNetworkStatus } from '../../services/nativeMobile';

export interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const cleanup = listenNetworkStatus((online) => {
      setIsOnline(online);
    });
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F8F8F5] text-black antialiased flex justify-center selection:bg-black selection:text-white">
      {/* Offline Status Toast */}
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-[100000] bg-black text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-bounce">
          <WifiOff className="w-4 h-4 text-[#EF4444]" />
          <span>You are currently offline. Changes will sync once connected.</span>
        </div>
      )}

      {/* Main Fullscreen Mobile App Viewport */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-[#F8F8F5] relative">
        {children}
      </div>
    </div>
  );
};
