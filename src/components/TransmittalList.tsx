import React from 'react';
import { TransmittalForm, TransmittalSettings } from '../types/transmittal';
import {
  Printer,
  Edit,
  Copy,
  Trash2,
  FileText,
  FileCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Truck,
  Building,
  Upload,
  AlertCircle,
  ArrowLeftRight,
  MapPin,
  Check
} from 'lucide-react';

interface Props {
  forms: TransmittalForm[];
  settings: TransmittalSettings;
  viewMode: 'table' | 'cards';
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
  settings,
  viewMode,
  onEdit,
  onPrint,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onViewHardCopy,
  onNewTransmittal
}) => {
  if (forms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-sm mx-auto my-8 shadow-xs no-print">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Transmittals</h3>
        <p className="text-xs text-slate-400 mb-5">
          No records match your criteria.
        </p>
        <button
          onClick={onNewTransmittal}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          New Transmittal
        </button>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 no-print">
        {forms.map((form) => {
          const isCompleted = Boolean(form.completeDelivery);
          const hasHardCopy = Boolean(form.hardCopyUrl);
          const formattedDate = new Date(form.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div
              key={form.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Check Circle + Transfer Icon (and proof icon if any) & Status + Form# + Date */}
                <div className="flex items-start justify-between gap-2">
                  {/* Left elements: Selection/status circle, double-arrow badge, hard copy icon */}
                  <div className="flex items-center gap-2.5">
                    {/* Circle checkbox toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(form)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                          : 'border-slate-300 hover:border-indigo-400 bg-white'
                      }`}
                      title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Dual horizontal arrows (transmittal icon) */}
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>

                    {/* Green document/proof icon (shown when proof attached or completed) */}
                    {hasHardCopy && (
                      <button
                        type="button"
                        onClick={() => onViewHardCopy(form)}
                        className="text-emerald-500 hover:text-emerald-600 cursor-pointer p-0.5 transition-colors"
                        title="View Proof"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Right elements: Status badge, Ref #, and Date */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      {/* Status Badge */}
                      <button
                        type="button"
                        onClick={() => onToggleStatus(form)}
                        className={`px-2 py-0.5 font-bold text-[10px] rounded-md tracking-wider uppercase transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-100/90 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Toggle status"
                      >
                        {isCompleted ? 'COMPLETED' : 'PENDING'}
                      </button>

                      {/* Reference Form # */}
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[11px] font-mono rounded-md border border-blue-100/70">
                        {form.formNumber}
                      </span>
                    </div>

                    {/* Right-aligned Date */}
                    <div className="text-[11px] text-slate-400 font-medium text-right mt-1">
                      {formattedDate}
                    </div>
                  </div>
                </div>

                {/* Main Title (Purpose) */}
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight line-clamp-2 mt-4 leading-snug">
                  {form.purpose}
                </h3>

                {/* Location / Destination with Pin Icon */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{form.dropTo || form.receivedByName || 'MAIN OFFICE'}</span>
                </div>

                {/* ITEMS label */}
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 mt-4">
                  ITEMS
                </div>

                {/* Item row(s) with quantity badge */}
                <div className="space-y-1.5 min-h-[36px]">
                  {form.items && form.items.length > 0 ? (
                    form.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {item.qty}
                        </div>
                        <span className="truncate font-medium text-slate-700 uppercase">
                          {item.description}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">No items</div>
                  )}

                  {form.items && form.items.length > 2 && (
                    <div className="text-[10px] text-slate-400 pl-7 font-medium">
                      +{form.items.length - 2} more
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Row: Print + Edit + Delete */}
              <div className="flex items-center gap-2 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => onPrint(form)}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  title="Print Slip"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(form)}
                  className="p-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(form.id)}
                  className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Table View
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden no-print">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              <th className="py-3 px-4">Ref #</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-4">Purpose</th>
              <th className="py-3 px-3 text-center">Items</th>
              <th className="py-3 px-4">Signatories</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Proof</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {forms.map((form) => (
              <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Form Number */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-mono font-black text-sm text-red-700">{form.formNumber}</div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      form.fromType === 'HO' ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {form.fromType === 'HO' ? 'Head Office' : 'Branch'}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono">
                  {new Date(form.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                {/* Purpose & Drop */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-bold text-slate-900 uppercase truncate">{form.purpose}</div>
                  {form.dropTo && (
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{form.dropTo}</span>
                    </div>
                  )}
                </td>

                {/* Items */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="inline-block bg-slate-100 text-slate-800 font-bold px-2 py-1 rounded-md text-[11px]">
                    {form.items.length} items ({form.items.reduce((a, b) => a + (Number(b.qty) || 0), 0)} pcs)
                  </span>
                </td>

                {/* Signatories */}
                <td className="py-3 px-4 text-[11px]">
                  <div className="truncate">
                    <span className="text-slate-400 text-[10px]">From:</span>{' '}
                    <span className="font-semibold text-slate-800">{form.fromName}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 text-[10px]">To:</span>{' '}
                    <span className="font-semibold text-slate-800">{form.receivedByName || '---'}</span>
                  </div>
                </td>

                {/* Delivery Status */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => onToggleStatus(form)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                      form.completeDelivery
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {form.completeDelivery ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-600" /> Pending
                      </>
                    )}
                  </button>
                </td>

                {/* Hard Copy */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => onViewHardCopy(form)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      form.hardCopyUrl
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    {form.hardCopyUrl ? 'Attached' : 'Upload'}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onPrint(form)}
                      className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Print Transmittal Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicate(form)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Transmittal"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(form)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Transmittal"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
