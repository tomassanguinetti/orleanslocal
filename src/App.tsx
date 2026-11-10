/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DirectoryProvider, useDirectory } from './context/DirectoryContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AdminModal } from './components/AdminModal';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { StoryModal } from './components/StoryModal';
import { DealModal } from './components/DealModal';
import { KidsModal } from './components/KidsModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    activeBusiness, 
    setActiveBusiness, 
    toast 
  } = useDirectory();

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Header */}
      <Header />

      {/* Main Content: Single fused page with tabs */}
      <main className="flex-1">
        {currentView === 'admin' ? <AdminModal /> : <HomePage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Fixed Bottom Nav on Mobile Devices */}
      <MobileBottomNav />

      {/* Modals for Inspecting Details */}
      {activeBusiness && (
        <BusinessProfileModal
          business={activeBusiness}
          onClose={() => setActiveBusiness(null)}
        />
      )}
      <StoryModal />
      <DealModal />
      <KidsModal />

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-neutral-900 text-white px-4 py-3 rounded-none shadow-xl border-2 border-black flex items-center gap-3 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <DirectoryProvider>
      <MainLayout />
    </DirectoryProvider>
  );
}
