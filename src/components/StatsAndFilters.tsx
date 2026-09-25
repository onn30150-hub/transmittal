import React from 'react';
import { TransmittalForm, FilterOptions } from '../types/transmittal';

interface Props {
  forms: TransmittalForm[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const StatsAndFilters: React.FC<Props> = ({
  forms,
  filters,
  onFilterChange
}) => {
  const totalCount = forms.length;
  const completedCount = forms.filter((f) => f.completeDelivery).length;
  const pendingCount = totalCount - completedCount;
  const hardCopyCount = forms.filter((f) => Boolean(f.hardCopyUrl)).length;

  return (
    <div className="no-print">
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
          onClick={() =>
            onFilterChange({
              ...filters,
              status: filters.status === 'pending' ? 'all' : 'pending'
            })
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'pending'
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
            onFilterChange({
              ...filters,
              status: filters.status === 'completed' ? 'all' : 'completed'
            })
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'completed'
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
            onFilterChange({
              ...filters,
              status: filters.status === 'has_hardcopy' ? 'all' : 'has_hardcopy'
            })
          }
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.status === 'has_hardcopy'
              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/10 shadow-xs'
              : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Proof Attached</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-0.5 tabular-nums">
            {hardCopyCount}
          </div>
        </button>
      </div>
    </div>
  );
};
