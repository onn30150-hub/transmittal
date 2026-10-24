import React, { useState, useMemo } from 'react';
import { TransmittalForm } from '../types/transmittal';
import { StorageService } from '../services/storageService';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Search,
  Building,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

interface Props {
  deletedForms: TransmittalForm[];
  activeForms: TransmittalForm[];
  onBackToActive: () => void;
  onRestore: (form: TransmittalForm, newNumber?: string) => Promise<void>;
  onPermanentlyDelete: (id: string) => Promise<void>;
  onEmptyRecycleBin: () => Promise<void>;
  onBulkRestore: (formsToRestore: { form: TransmittalForm; newNumber?: string }[]) => Promise<void>;
  onBulkPermanentDelete: (ids: string[]) => Promise<void>;
}

export const RecycleBinView: React.FC<Props> = ({
  deletedForms,
  activeForms,
  onBackToActive,
  onRestore,
  onPermanentlyDelete,
  onEmptyRecycleBin,
  onBulkRestore,
  onBulkPermanentDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Conflict Resolution Modal State
  const [conflictTargetForm, setConflictTargetForm] = useState<TransmittalForm | null>(null);
  const [suggestedNewNumber, setSuggestedNewNumber] = useState('');
  const [activeConflictRecord, setActiveConflictRecord] = useState<TransmittalForm | null>(null);

  // Active form number lookup set for rapid O(1) duplicate checks
  const activeNumbersMap = useMemo(() => {
    const map = new Map<string, TransmittalForm>();
    activeForms.forEach((f) => {
      const num = f.formNumber?.trim().toUpperCase();
      if (num) {
        map.set(num, f);
      }
    });
    return map;
  }, [activeForms]);

  // Filtered deleted forms based on search query
  const filteredDeletedForms = useMemo(() => {
    if (!searchQuery.trim()) return deletedForms;
    const q = searchQuery.toLowerCase().trim();
    return deletedForms.filter((f) => {
      const matchNumber = f.formNumber?.toLowerCase().includes(q);
      const matchPurpose = f.purpose?.toLowerCase().includes(q);
      const matchBranch = (f.branchName || '').toLowerCase().includes(q);
      const matchDrop = (f.dropTo || '').toLowerCase().includes(q);
      const matchItem = f.items?.some((it) => it.description.toLowerCase().includes(q));
      return matchNumber || matchPurpose || matchBranch || matchDrop || matchItem;
    });
  }, [deletedForms, searchQuery]);

  // Total conflicting records in the recycle bin
  const conflictCount = useMemo(() => {
    return deletedForms.filter((f) => {
      const num = f.formNumber?.trim().toUpperCase();
      return num ? activeNumbersMap.has(num) : false;
    }).length;
  }, [deletedForms, activeNumbersMap]);

  // Handle Restore button click
  const handleInitiateRestore = async (form: TransmittalForm) => {
    const trimmedNum = form.formNumber?.trim().toUpperCase();
    const conflictingActive = trimmedNum ? activeNumbersMap.get(trimmedNum) : undefined;

    if (conflictingActive) {
      // Flagged! Active transmittal with same number exists
      const nextNum = await StorageService.generateNextFormNumber(form.fromType);
      setActiveConflictRecord(conflictingActive);
      setSuggestedNewNumber(nextNum);
      setConflictTargetForm(form);
      return;
    }

    // No conflict: restore directly
    try {
      setIsProcessing(true);
      await onRestore(form);
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm restore with new auto-generated number
  const handleConfirmConflictRestore = async () => {
    if (!conflictTargetForm || !suggestedNewNumber) return;
    try {
      setIsProcessing(true);
      await onRestore(conflictTargetForm, suggestedNewNumber);
      setConflictTargetForm(null);
      setActiveConflictRecord(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Single Permanent Delete
  const handleSinglePermanentDelete = async (form: TransmittalForm) => {
    if (
      window.confirm(
        `Are you sure you want to PERMANENTLY delete transmittal #${form.formNumber}? This action cannot be undone.`
      )
    ) {
      try {
        setIsProcessing(true);
        await onPermanentlyDelete(form.id);
        setSelectedIds((prev) => prev.filter((id) => id !== form.id));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Empty Recycle Bin
  const handleEmptyRecycleBinClick = async () => {
    if (deletedForms.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete all ${deletedForms.length} transmittals in the Recycle Bin? This action cannot be undone.`
      )
    ) {
      try {
        setIsProcessing(true);
        await onEmptyRecycleBin();
        setSelectedIds([]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Bulk Restore
  const handleBulkRestoreClick = async () => {
    if (selectedIds.length === 0) return;

    const targets = deletedForms.filter((f) => selectedIds.includes(f.id));
    const conflicts = targets.filter((f) => {
      const num = f.formNumber?.trim().toUpperCase();
      return num ? activeNumbersMap.has(num) : false;
    });

    if (conflicts.length > 0) {
      const conflictNumbers = conflicts.map((c) => `#${c.formNumber}`).join(', ');
      const proceed = window.confirm(
        `Notice: ${conflicts.length} selected transmittal(s) (${conflictNumbers}) have duplicate numbers with currently active transmittals.\n\nWould you like to restore them with newly generated sequential numbers to resolve the conflict?`
      );
      if (!proceed) return;

      try {
        setIsProcessing(true);
        const restoreList: { form: TransmittalForm; newNumber?: string }[] = [];
        for (const f of targets) {
          const num = f.formNumber?.trim().toUpperCase();
          if (num && activeNumbersMap.has(num)) {
            const nextNum = await StorageService.generateNextFormNumber(f.fromType);
            restoreList.push({ form: f, newNumber: nextNum });
          } else {
            restoreList.push({ form: f });
          }
        }
        await onBulkRestore(restoreList);
        setSelectedIds([]);
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        setIsProcessing(true);
        await onBulkRestore(targets.map((f) => ({ form: f })));
        setSelectedIds([]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Bulk Permanent Delete
  const handleBulkPermanentDeleteClick = async () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete the ${selectedIds.length} selected transmittals? This action cannot be undone.`
      )
    ) {
      try {
        setIsProcessing(true);
        await onBulkPermanentDelete(selectedIds);
        setSelectedIds([]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDeletedForms.length && filteredDeletedForms.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDeletedForms.map((f) => f.id));
    }
  };

  return (
    <div className="space-y-4 no-print animate-fadeIn">
      {/* Top Banner & Navigation */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToActive}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Return to Active Transmittals"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Recycle Bin
              </h2>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                {deletedForms.length} {deletedForms.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Soft-deleted transmittals. Restore records to active use or permanently remove them.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {deletedForms.length > 0 && (
            <button
              type="button"
              onClick={handleEmptyRecycleBinClick}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-xl text-xs font-semibold border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Empty Recycle Bin</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBackToActive}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Back to Active Transmittals</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Banner if any duplicates exist in Recycle Bin */}
      {conflictCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">
              {conflictCount} transmittal{conflictCount > 1 ? 's' : ''} in the Recycle Bin share form numbers with currently active records.
            </span>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              These records are flagged with a conflict warning below. Restoring a conflicting record will safely prompt you to assign the next available sequential number so active numbers never collide.
            </p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recycled transmittal #, branch, purpose..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkRestoreClick}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={handleBulkPermanentDeleteClick}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Recycled Items List / Table */}
      {filteredDeletedForms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-6 shadow-xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {deletedForms.length === 0 ? 'Recycle Bin is empty' : 'No matching records found'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            {deletedForms.length === 0
              ? 'When transmittals are soft-deleted from the main list, they will appear here safely for restoration or permanent removal.'
              : 'No recycled transmittals matched your search keyword.'}
          </p>
          <button
            type="button"
            onClick={onBackToActive}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Return to Active Transmittals</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredDeletedForms.length > 0 &&
                        selectedIds.length === filteredDeletedForms.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                      title="Select all"
                    />
                  </th>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-3">Original Date</th>
                  <th className="py-3 px-4">Purpose / Destination</th>
                  <th className="py-3 px-3 text-center">Items</th>
                  <th className="py-3 px-3">Date Deleted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDeletedForms.map((form) => {
                  const isSelected = selectedIds.includes(form.id);
                  const trimmedNum = form.formNumber?.trim().toUpperCase();
                  const conflictActive = trimmedNum ? activeNumbersMap.get(trimmedNum) : undefined;
                  const hasConflict = Boolean(conflictActive);

                  return (
                    <tr
                      key={form.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-rose-50/30' : hasConflict ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(form.id)}
                          className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                        />
                      </td>

                      {/* Reference # + Flagged Conflict Indicator */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-900">
                            {form.formNumber}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              form.fromType === 'HO'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {form.fromType === 'HO' ? 'Head Office' : 'Branch'}
                          </span>
                        </div>

                        {/* Duplicate Flag Alert */}
                        {hasConflict && (
                          <div
                            className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100/90 text-amber-900 text-[10px] font-bold border border-amber-300"
                            title={`Conflict: Active transmittal "${conflictActive?.purpose}" is using this number`}
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Duplicate Number Conflict</span>
                          </div>
                        )}
                      </td>

                      {/* Original Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(form.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Purpose / Branch */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 uppercase truncate">
                          {form.purpose}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700">
                            {form.branchName || form.dropTo || form.receivedByName || '---'}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {form.items?.length || 0} items
                        </span>
                      </td>

                      {/* Deleted Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {form.deletedAt ? (
                          <span title={form.deletedAt}>
                            {new Date(form.deletedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-400">Recently</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Restore Button */}
                          <button
                            type="button"
                            onClick={() => handleInitiateRestore(form)}
                            disabled={isProcessing}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              hasConflict
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                            title={
                              hasConflict
                                ? 'Restore transmittal (will resolve number collision)'
                                : 'Restore transmittal back to active list'
                            }
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>

                          {/* Permanent Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleSinglePermanentDelete(form)}
                            disabled={isProcessing}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                            title="Permanently Delete (Cannot be undone)"
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

      {/* Duplicate Number Conflict Alert Modal */}
      {conflictTargetForm && activeConflictRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-amber-200 overflow-hidden animate-scaleIn">
            <div className="bg-amber-500 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Duplicate Transmittal Number Detected
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConflictTargetForm(null)}
                className="text-amber-100 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
                <div className="font-bold">
                  Transmittal #{conflictTargetForm.formNumber} is already in use by an active record:
                </div>
                <div className="text-[11px] text-amber-800">
                  <span className="font-semibold">Active Transmittal:</span> {activeConflictRecord.purpose} ({activeConflictRecord.branchName || activeConflictRecord.dropTo || 'Head Office'})
                </div>
              </div>

              <p className="leading-relaxed">
                To prevent duplicate reference numbers and preserve audit integrity, restoring this transmittal requires assigning a unique sequential number.
              </p>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                  New Transmittal Number to Assign:
                </label>
                <input
                  type="text"
                  value={suggestedNewNumber}
                  onChange={(e) => setSuggestedNewNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-sm text-red-600 bg-white uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Suggested next available sequential number. You can edit this if needed.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConflictTargetForm(null)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmConflictRestore}
                  disabled={!suggestedNewNumber.trim() || isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Assign #{suggestedNewNumber} &amp; Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
