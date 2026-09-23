import React from 'react';
import { TransmittalSettings } from '../types/transmittal';
import {
  FileText,
  Plus,
  Settings,
  Download,
  Search,
  Building2,
  Printer,
  FileCheck
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
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-700/80 overflow-hidden shrink-0">
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
                      'w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-black text-lg shadow-md border border-red-500/40 tracking-tighter';
                    parent.innerText = 'MMC';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-serif">
                  {settings.companyName || 'MICROBASE MOTORBIKE CORP'}
                </span>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-red-500/30 font-bold hidden sm:inline-block">
                  TRANSMITTAL
                </span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search transmittals..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onNewTransmittal}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40 cursor-pointer transition-all active:scale-98"
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
