/**
 * POPCIX App Root Component
 * Composes AuthProvider, GamificationProvider, MarketplaceProvider, DeviceFrame, and AppNavigator.
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { AppNavigator } from './navigation/AppNavigator';

export function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <MarketplaceProvider>
          <DeviceFrame>
            <AppNavigator />
          </DeviceFrame>
        </MarketplaceProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
