import React from 'react';
import { TransmittalForm, FilterOptions } from '../types/transmittal';
import { Trash2 } from 'lucide-react';

interface Props {
  forms: TransmittalForm[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  deletedCount?: number;
  viewTab?: 'active' | 'recycle_bin';
  onViewTabChange?: (tab: 'active' | 'recycle_bin') => void;
}

export const StatsAndFilters: React.FC<Props> = ({
  forms,
  filters,
  onFilterChange,
  deletedCount = 0,
  viewTab = 'active',
  onViewTabChange
}) => {
  // Only calculate metrics from active forms
  const activeForms = forms.filter((f) => !f.isDeleted);
  const totalCount = activeForms.length;
  const completedCount = activeForms.filter((f) => f.completeDelivery).length;
  const pendingCount = totalCount - completedCount;
  const hardCopyCount = activeForms.filter((f) => Boolean(f.hardCopyUrl)).length;

  const handleActiveFilterClick = (status: FilterOptions['status']) => {
    if (viewTab === 'recycle_bin' && onViewTabChange) {
      onViewTabChange('active');
    }
    onFilterChange({ ...filters, status });
  };

  const isRecycleActive = viewTab === 'recycle_bin';

  return (
    <div className="no-print">
      {/* Light Clean Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Total Active Records */}
        <button
          type="button"
          onClick={() => handleActiveFilterClick('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            !isRecycleActive && filters.status === 'all'
              ? 'bg-white border-slate-300 ring-2 ring-slate-900/5 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Active Transmittals</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
            {totalCount}
          </div>
        </button>

        {/* Pending Delivery */}
        <button
          type="button"
          onClick={() =>
            handleActiveFilterClick(
              !isRecycleActive && filters.status === 'pending' ? 'all' : 'pending'
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            !isRecycleActive && filters.status === 'pending'
              ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Pending Delivery</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5 tabular-nums">
            {pendingCount}
          </div>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() =>
            handleActiveFilterClick(
              !isRecycleActive && filters.status === 'completed' ? 'all' : 'completed'
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            !isRecycleActive && filters.status === 'completed'
              ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Completed</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5 tabular-nums">
            {completedCount}
          </div>
        </button>

        {/* With Proof of Receipt */}
        <button
          type="button"
          onClick={() =>
            handleActiveFilterClick(
              !isRecycleActive && filters.status === 'has_hardcopy' ? 'all' : 'has_hardcopy'
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            !isRecycleActive && filters.status === 'has_hardcopy'
              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Proof Attached</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-0.5 tabular-nums">
            {hardCopyCount}
          </div>
        </button>

        {/* Recycle Bin Card */}
        <button
          type="button"
          onClick={() => {
            if (onViewTabChange) {
              onViewTabChange(isRecycleActive ? 'active' : 'recycle_bin');
            }
          }}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            isRecycleActive
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
              : deletedCount > 0
              ? 'bg-white/80 border-rose-200/70 hover:bg-rose-50/40 hover:border-rose-300'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
          title="View soft-deleted transmittals (restore or permanent delete)"
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-medium ${isRecycleActive ? 'text-rose-700' : 'text-slate-500'}`}>
              Recycle Bin
            </span>
            <Trash2 className={`w-3.5 h-3.5 ${isRecycleActive || deletedCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-0.5 tabular-nums ${
            isRecycleActive ? 'text-rose-800' : deletedCount > 0 ? 'text-rose-700' : 'text-slate-400'
          }`}>
            {deletedCount}
          </div>
        </button>
      </div>
    </div>
  );
};
