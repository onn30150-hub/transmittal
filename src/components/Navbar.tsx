import React from 'react';
import { TransmittalSettings } from '../types/transmittal';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus,
  Settings,
  Search,
  Cloud,
  LogOut,
  LogIn,
  X
} from 'lucide-react';

interface Props {
  settings: TransmittalSettings;
  onNewTransmittal: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<Props> = ({
  settings,
  onNewTransmittal,
  onOpenSettings,
  searchQuery,
  onSearchChange
}) => {
  const { user, cloudConnected, signIn, signOut } = useAuth();

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 p-1 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
              <img
                src={settings.companyLogoUrl || '/logo.png'}
                alt={settings.companyName || 'Logo'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className =
                      'w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-xs';
                    parent.innerText = 'MMC';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 leading-tight">
                  {settings.companyName || 'MICROBASE MOTORBIKE CORP'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                Transmittal Records & Tracking
              </p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="flex-1 max-w-sm lg:max-w-md mx-1 sm:mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search reference #, item, branch..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cloud Sync Status */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px]">
                    {user.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[9px] font-medium text-emerald-600 flex items-center gap-1 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Synced
                  </span>
                </div>
                <button
                  onClick={signOut}
                  title="Sign out of Firebase Cloud"
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                title="Connect with Google for Cloud Backup & Sync"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium cursor-pointer transition-all shadow-2xs"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sync</span>
                <LogIn className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Form & Header Settings"
            >
              <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* New Transmittal Button */}
            <button
              onClick={onNewTransmittal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm cursor-pointer transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Transmittal</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
