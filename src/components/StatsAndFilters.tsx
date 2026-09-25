import React from 'react';
import { TransmittalForm, FilterOptions } from '../types/transmittal';
import { LayoutGrid, List } from 'lucide-react';

interface Props {
  forms: TransmittalForm[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export const StatsAndFilters: React.FC<Props> = ({
  forms,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange
}) => {
  const totalCount = forms.length;
  const completedCount = forms.filter((f) => f.completeDelivery).length;
  const pendingCount = totalCount - completedCount;
  const hardCopyCount = forms.filter((f) => Boolean(f.hardCopyUrl)).length;

  return (
    <div className="space-y-3 no-print">
      {/* Light Clean Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Records */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, status: 'all' })}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'all'
              ? 'bg-white border-slate-300 ring-2 ring-slate-900/5 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Total Transmittals</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
            {totalCount}
          </div>
        </button>

        {/* Pending Delivery */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, status: 'pending' })}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'pending'
              ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Pending Delivery</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5 tabular-nums">
            {pendingCount}
          </div>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, status: 'completed' })}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'completed'
              ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Completed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5 tabular-nums">
            {completedCount}
          </div>
        </button>

        {/* With Proof of Receipt */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, status: 'has_hardcopy' })}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'has_hardcopy'
              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Proof Attached</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-0.5 tabular-nums">
            {hardCopyCount}
          </div>
        </button>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs">
        {/* Status segmented filters */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => onFilterChange({ ...filters, status: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filters.status === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All <span className="opacity-70 text-[11px]">({totalCount})</span>
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, status: 'pending' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filters.status === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            Pending <span className="opacity-70 text-[11px]">({pendingCount})</span>
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, status: 'completed' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filters.status === 'completed'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Completed <span className="opacity-70 text-[11px]">({completedCount})</span>
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, status: 'has_hardcopy' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filters.status === 'has_hardcopy'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            With Proof <span className="opacity-70 text-[11px]">({hardCopyCount})</span>
          </button>
        </div>

        {/* Origin Filter & View Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Origin: All / Head Office / Branch */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => onFilterChange({ ...filters, locationType: 'all' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filters.locationType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, locationType: 'HO' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filters.locationType === 'HO'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              HO
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, locationType: 'BR' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filters.locationType === 'BR'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Branch
            </button>
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg">
            <button
              onClick={() => onViewModeChange('cards')}
              title="Card View"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
