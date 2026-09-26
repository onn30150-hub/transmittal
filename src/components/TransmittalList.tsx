import React, { useMemo } from 'react';
import { TransmittalForm, TransmittalSettings } from '../types/transmittal';
import { compareTransmittalsNewestFirst } from '../services/storageService';
import {
  Printer,
  Edit,
  Copy,
  Trash2,
  FileCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Plus,
  ArrowRight,
  Upload
} from 'lucide-react';

interface Props {
  forms: TransmittalForm[];
  settings: TransmittalSettings;
  viewMode: 'table' | 'cards';
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkPrint: () => void;
  onBulkDelete?: () => void;
  onEdit: (form: TransmittalForm) => void;
  onPrint: (form: TransmittalForm) => void;
  onDuplicate: (form: TransmittalForm) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (form: TransmittalForm) => void;
  onViewHardCopy: (form: TransmittalForm) => void;
  onNewTransmittal: () => void;
}

export const TransmittalList: React.FC<Props> = ({
  forms,
  viewMode,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onBulkPrint,
  onBulkDelete,
  onEdit,
  onPrint,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onViewHardCopy,
  onNewTransmittal
}) => {
  const sortedForms = useMemo(() => {
    return [...forms].sort(compareTransmittalsNewestFirst);
  }, [forms]);

  // Empty State
  if (sortedForms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-10 shadow-sm no-print">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1.5">No transmittal records found</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          There are no transmittals matching your current search or filter criteria. Create a new transmittal to get started.
        </p>
        <button
          onClick={onNewTransmittal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm cursor-pointer transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Transmittal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 no-print">
      {/* Bulk Print Action Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-150 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {selectedIds.length === 1
                ? '1 transmittal selected'
                : `${selectedIds.length} transmittals selected for bulk print`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {selectedIds.length === forms.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear
            </button>
            {onBulkDelete && (
              <button
                type="button"
                onClick={onBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg text-xs font-semibold border border-rose-800/60 transition-all cursor-pointer"
                title="Delete all selected records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBulkPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Bulk Preview & Print ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {sortedForms.map((form) => {
            const isCompleted = Boolean(form.completeDelivery);
            const hasHardCopy = Boolean(form.hardCopyUrl);
            const isSelected = selectedIds.includes(form.id);
            const formattedDate = new Date(form.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={form.id}
                className={`bg-white rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-red-400 ring-2 ring-red-500/15 bg-red-50/5 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Header: Small Checkbox + Form Number + Origin Tag + Status Toggle */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <label
                        className="flex items-center justify-center cursor-pointer p-0.5 -ml-1 text-slate-400 hover:text-slate-700"
                        onClick={(e) => e.stopPropagation()}
                        title="Select for bulk print"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(form.id)}
                          className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                        />
                      </label>
                      <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 tracking-tight">
                        {form.formNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                          form.fromType === 'HO'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {form.fromType === 'HO' ? 'HO' : 'Branch'}
                      </span>
                    </div>

                    {/* Status Toggle Button */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(form)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                      title={isCompleted ? 'Click to mark as Pending' : 'Click to mark as Completed'}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Purpose / Subject */}
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight line-clamp-2 mt-3 leading-snug">
                    {form.purpose}
                  </h3>

                  {/* Date & Destination Route */}
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-[11px]">
                        {form.dropTo || form.receivedByName || 'Head Office'}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary Preview */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Items ({form.items.length})
                    </div>
                    <div className="space-y-1">
                      {form.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {item.qty}
                          </span>
                          <span className="truncate text-[11px] uppercase font-medium">
                            {item.description}
                          </span>
                        </div>
                      ))}
                      {form.items.length > 2 && (
                        <div className="text-[10px] text-slate-400 font-medium pl-6">
                          +{form.items.length - 2} more item{form.items.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  {/* Preview and Print button (Primary Action) */}
                  <button
                    type="button"
                    onClick={() => onPrint(form)}
                    className="flex-1 py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-300" />
                    <span>Preview and Print</span>
                  </button>

                  {/* Proof Attachment Button */}
                  <button
                    type="button"
                    onClick={() => onViewHardCopy(form)}
                    className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      hasHardCopy
                        ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                    title={hasHardCopy ? 'View Proof of Receipt' : 'Attach Proof of Receipt'}
                  >
                    {hasHardCopy ? (
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit(form)}
                    className="p-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Edit transmittal"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDelete(form.id)}
                    className="p-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete transmittal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={forms.length > 0 && selectedIds.length === forms.length}
                      onChange={onSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                      title="Select all for bulk print"
                    />
                  </th>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4">Purpose / Subject</th>
                  <th className="py-3 px-3 text-center">Items</th>
                  <th className="py-3 px-4">Origin & Route</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Proof</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedForms.map((form) => {
                  const isCompleted = Boolean(form.completeDelivery);
                  const hasHardCopy = Boolean(form.hardCopyUrl);
                  const isSelected = selectedIds.includes(form.id);

                  return (
                    <tr
                      key={form.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(form.id)}
                          className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                          title="Select for bulk print"
                        />
                      </td>

                      {/* Reference # */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-xs sm:text-[13px] text-slate-900">
                          {form.formNumber}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            form.fromType === 'HO'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {form.fromType === 'HO' ? 'Head Office' : 'Branch'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(form.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Purpose */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 uppercase truncate">
                          {form.purpose}
                        </div>
                        {form.dropTo && (
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{form.dropTo}</span>
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {form.items.length} items
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-4 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="font-medium text-slate-800">{form.fromName}</span>
                          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                          <span className="font-medium text-slate-800">
                            {form.dropTo || form.receivedByName || '---'}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onToggleStatus(form)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Proof */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewHardCopy(form)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                            hasHardCopy
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {hasHardCopy ? (
                            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{hasHardCopy ? 'Attached' : 'Attach'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPrint(form)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview and Print Transmittal Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicate(form)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(form)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(form.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
