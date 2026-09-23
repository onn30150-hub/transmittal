import React from 'react';
import { TransmittalForm, FilterOptions } from '../types/transmittal';
import {
  FileText,
  Clock,
  CheckCircle2,
  FileCheck,
  Building,
  Filter,
  Layers,
  ArrowUpDown
} from 'lucide-react';

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
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onFilterChange({ ...filters, status: 'all' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filters.status === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, status: 'pending' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filters.status === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, status: 'completed' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filters.status === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, status: 'has_hardcopy' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filters.status === 'has_hardcopy'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          With Proof ({hardCopyCount})
        </button>
      </div>

      {/* Location & View Mode Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Origin filter */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => onFilterChange({ ...filters, locationType: 'all' })}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filters.locationType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, locationType: 'HO' })}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filters.locationType === 'HO'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            HO
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, locationType: 'BR' })}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filters.locationType === 'BR'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Branch
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Table
          </button>
        </div>
      </div>
    </div>
  );
};
