import React from 'react';
import { TransmittalSettings } from '../types/transmittal';
import {
  Plus,
  Settings,
  Search,
  Cloud,
  X,
  LayoutGrid,
  List
} from 'lucide-react';

interface Props {
  settings: TransmittalSettings;
  onNewTransmittal: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export const Navbar: React.FC<Props> = ({
  settings,
  onNewTransmittal,
  onOpenSettings,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <header className="bg-white text-slate-800 border-b border-slate-200/80 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 p-1 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
              <img
                src={settings.companyLogoUrl || `${import.meta.env.BASE_URL}logo.png`}
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
            {/* View Mode Toggle (Cards vs Table) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cloud Sync Status */}
            <div
              className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl px-2.5 py-1.5 shadow-xs text-emerald-800"
              title="Connected to Firebase Cloud: Real-time Multi-User Sync Active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold hidden sm:inline text-emerald-800">Live Sync</span>
            </div>

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
