import React, { useState } from 'react';
import { TransmittalForm, TransmittalSettings, PrintMode } from '../types/transmittal';
import { TransmittalDocument } from './TransmittalDocument';
import {
  Printer,
  X,
  Scissors,
  FileText,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';

interface Props {
  form?: TransmittalForm | null;
  forms?: TransmittalForm[];
  settings: TransmittalSettings;
  isOpen: boolean;
  onClose: () => void;
  printMode?: PrintMode;
  onPrintModeChange?: (mode: PrintMode) => void;
}

export const TransmittalPrintModal: React.FC<Props> = ({
  form,
  forms,
  settings,
  isOpen,
  onClose,
  printMode: controlledPrintMode,
  onPrintModeChange
}) => {
  const formsList: TransmittalForm[] =
    forms && forms.length > 0 ? forms : form ? [form] : [];

  const [localPrintMode, setLocalPrintMode] = useState<PrintMode>('dual-copy');
  const printMode = controlledPrintMode || localPrintMode;
  const setPrintMode = (mode: PrintMode) => {
    setLocalPrintMode(mode);
    if (onPrintModeChange) onPrintModeChange(mode);
  };
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen || formsList.length === 0) return null;

  const isBulk = formsList.length > 1;

  const handlePrint = () => {
    window.print();
  };

  const scrollToSheet = (index: number) => {
    const el = document.getElementById(`preview-sheet-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/85 backdrop-blur-sm overflow-hidden no-print">
      {/* Top Action Toolbar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg text-white font-bold flex items-center justify-center">
            {isBulk ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold tracking-tight">
                {isBulk ? 'Bulk Print Preview' : 'Print Slip'}
              </h2>
              {isBulk ? (
                <span className="bg-red-500/20 text-red-300 font-bold px-2.5 py-0.5 rounded text-xs border border-red-500/30 flex items-center gap-1.5">
                  <span>{formsList.length} Continuous Sheets</span>
                </span>
              ) : (
                <span className="bg-slate-800 text-red-400 font-mono px-2 py-0.5 rounded text-xs border border-slate-700 font-bold">
                  {formsList[0].formNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Layout Toggle, Zoom & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Quick jump to sheet for bulk */}
          {isBulk && (
            <div className="hidden xl:flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2 py-1 text-xs gap-1.5">
              <span className="text-slate-400 font-medium">Jump to:</span>
              <div className="flex items-center gap-1 max-w-[280px] overflow-x-auto no-scrollbar py-0.5">
                {formsList.map((f, idx) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => scrollToSheet(idx)}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded text-[11px] font-mono font-medium transition-colors cursor-pointer shrink-0"
                    title={`Go to ${f.formNumber}: ${f.purpose}`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Print mode selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setPrintMode('dual-copy')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                printMode === 'dual-copy'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              2-in-1 Dual Copy
            </button>
            <button
              onClick={() => setPrintMode('full-page')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                printMode === 'full-page'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Full Page
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-300 px-2 py-1 gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(40, z - 10))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer text-xs sm:text-sm active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>{isBulk ? `Print All (${formsList.length}) Slips` : 'Print Document'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Canvas Area: Continuous vertical scroll for all slips */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start bg-slate-950/70">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 flex flex-col items-center space-y-10 pb-16"
        >
          {formsList.map((itemForm, index) => {
            const formattedDate = new Date(itemForm.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={itemForm.id}
                id={`preview-sheet-${index}`}
                className="flex flex-col items-center"
              >
                {/* Continuous Page Header Ribbon */}
                <div className="w-[800px] bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg border-t border-x border-slate-700 flex items-center justify-between text-xs shadow-sm mb-0">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                      Sheet {index + 1} of {formsList.length}
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {itemForm.formNumber}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {itemForm.dropTo || itemForm.receivedByName || 'Head Office'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">
                    {printMode === 'dual-copy' ? '2-in-1 Dual Half-Sheet' : 'Full Page Mode'}
                  </div>
                </div>

                {/* Sheet Body (8.5in x 13in proportion: 800px x 1224px) */}
                {printMode === 'full-page' ? (
                  <div className="w-[800px] min-h-[1224px] bg-white shadow-2xl rounded-b-lg border border-slate-300 p-4 flex flex-col justify-between">
                    <TransmittalDocument
                      form={itemForm}
                      settings={settings}
                      watermarkType="head-office"
                      copyLabel="HEAD OFFICE COPY"
                      isCompact={false}
                    />
                  </div>
                ) : (
                  <div className="w-[800px] min-h-[1224px] bg-white shadow-2xl rounded-b-lg border border-slate-300 p-4 flex flex-col justify-between">
                    {/* Top Half: Head Office Copy */}
                    <div className="flex-1 pb-3 flex flex-col justify-center">
                      <TransmittalDocument
                        form={itemForm}
                        settings={settings}
                        watermarkType="head-office"
                        copyLabel="HEAD OFFICE COPY"
                        isCompact={true}
                      />
                    </div>

                    {/* Center Cut Line Divider */}
                    <div className="w-full my-2 border-t-2 border-dashed border-slate-400 relative flex items-center justify-center">
                      <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-mono font-semibold">
                        ✂ Cut along line • Top: Head Office Copy / Bottom: Branch Copy
                      </span>
                    </div>

                    {/* Bottom Half: Branch Copy */}
                    <div className="flex-1 pt-3 flex flex-col justify-center">
                      <TransmittalDocument
                        form={itemForm}
                        settings={settings}
                        watermarkType="branch"
                        copyLabel="BRANCH COPY"
                        isCompact={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
