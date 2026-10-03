import React, { useState } from 'react';
import { TransmittalForm, TransmittalSettings, PrintMode } from '../types/transmittal';
import { TransmittalDocument } from './TransmittalDocument';
import {
  Printer,
  X,
  Scissors,
  Files,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Calendar,
  FileText,
  Maximize2
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

  const [localPrintMode, setLocalPrintMode] = useState<PrintMode>('2in1-copy');
  const printMode = controlledPrintMode || localPrintMode;
  const setPrintMode = (mode: PrintMode) => {
    setLocalPrintMode(mode);
    if (onPrintModeChange) onPrintModeChange(mode);
  };
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen || formsList.length === 0) return null;

  const isBulk = formsList.length > 1;
  const is2pages = printMode === '2pages-copy' || printMode === 'full-page';
  const is2in1 = !is2pages;

  const handlePrint = () => {
    window.print();
  };

  const scrollToSheet = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/85 backdrop-blur-sm overflow-hidden no-print">
      {/* Dynamic @page sizing matching Folio paper width */}
      <style>{`
        @page {
          size: 8.5in 13in portrait;
          margin: 0.25in 0.25in 0.25in 0.25in;
        }
        @media print {
          html, body {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Top Action Toolbar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg text-white font-bold flex items-center justify-center">
            {isBulk ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold tracking-tight">
                {isBulk ? 'Bulk Print Preview' : 'Print Slip Preview'}
              </h2>
              {isBulk ? (
                <span className="bg-red-500/20 text-red-300 font-bold px-2.5 py-0.5 rounded text-xs border border-red-500/30 flex items-center gap-1.5">
                  <span>
                    {is2pages
                      ? `${formsList.length} Slips (${formsList.length * 2} Pages Fit to Width)`
                      : `${formsList.length} Sheets (2in1 Folio)`}
                  </span>
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
              <span className="text-slate-400 font-medium">Jump:</span>
              <div className="flex items-center gap-1 max-w-[280px] overflow-x-auto no-scrollbar py-0.5">
                {formsList.map((f, idx) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => scrollToSheet(is2pages ? `preview-sheet-${idx}-p1` : `preview-sheet-${idx}`)}
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
              onClick={() => setPrintMode('2in1-copy')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                is2in1
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="HO Copy and Branch Copy together on a single 8.5x13 paper with cut line"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>2in1 copy</span>
            </button>
            <button
              onClick={() => setPrintMode('2pages-copy')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                is2pages
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="2 separate pages fitted to 100% width on Folio paper (Page 1: HO Copy, Page 2: Branch Copy)"
            >
              <Files className="w-3.5 h-3.5" />
              <span>2pages copy</span>
            </button>
          </div>

          {/* Zoom & Fit-to-Width controls */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-300 px-2 py-1 gap-1.5">
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
            <button
              onClick={() => setZoom(100)}
              className="px-2 py-0.5 ml-1 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Fit to Width 100%"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit Width</span>
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer text-xs sm:text-sm active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>
              {isBulk
                ? is2pages
                  ? `Print All (${formsList.length * 2} Pages)`
                  : `Print All (${formsList.length} Sheets)`
                : is2pages
                ? 'Print 2 Pages (Fit to Width)'
                : 'Print 2in1 Slip (8.5" x 13")'}
            </span>
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
          className="transition-transform duration-150 flex flex-col items-center space-y-10 pb-16 w-full max-w-[880px]"
        >
          {formsList.map((itemForm, index) => {
            const formattedDate = new Date(itemForm.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            // 2 PAGES COPY MODE: 2 separate pages fitted to width
            if (is2pages) {
              return (
                <div key={itemForm.id} className="flex flex-col items-center space-y-6 w-full">
                  {/* PAGE 1: HEAD OFFICE COPY (Fitted to Width) */}
                  <div
                    id={`preview-sheet-${index}-p1`}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Page 1 Header Ribbon */}
                    <div className="w-full bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg border-t border-x border-slate-700 flex items-center justify-between text-xs shadow-sm mb-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                          {isBulk ? `Slip ${index + 1} • ` : ''}Page 1 of 2
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {itemForm.formNumber}
                        </span>
                        <span className="bg-red-950/60 text-red-200 font-semibold px-2 py-0.5 rounded text-[10px] border border-red-800/60">
                          HEAD OFFICE COPY
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
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        Fit to Width (Folio)
                      </div>
                    </div>

                    {/* Page 1 Body */}
                    <div className="w-full bg-white shadow-2xl rounded-b-lg border border-slate-300 p-3.5 flex flex-col justify-center">
                      <TransmittalDocument
                        form={itemForm}
                        settings={settings}
                        watermarkType="head-office"
                        copyLabel="HEAD OFFICE COPY"
                        isCompact={true}
                      />
                    </div>
                  </div>

                  {/* PAGE 2: BRANCH COPY (Fitted to Width) */}
                  <div
                    id={`preview-sheet-${index}-p2`}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Page 2 Header Ribbon */}
                    <div className="w-full bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg border-t border-x border-slate-700 flex items-center justify-between text-xs shadow-sm mb-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                          {isBulk ? `Slip ${index + 1} • ` : ''}Page 2 of 2
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {itemForm.formNumber}
                        </span>
                        <span className="bg-emerald-950/60 text-emerald-200 font-semibold px-2 py-0.5 rounded text-[10px] border border-emerald-800/60">
                          BRANCH COPY
                        </span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {itemForm.dropTo || itemForm.receivedByName || 'Branch'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        Fit to Width (Folio)
                      </div>
                    </div>

                    {/* Page 2 Body */}
                    <div className="w-full bg-white shadow-2xl rounded-b-lg border border-slate-300 p-3.5 flex flex-col justify-center">
                      <TransmittalDocument
                        form={itemForm}
                        settings={settings}
                        watermarkType="branch"
                        copyLabel="BRANCH COPY"
                        isCompact={true}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // 2IN1 COPY MODE: Head Office Copy and Branch Copy in single 8.5" x 13" paper with cut line
            return (
              <div
                key={itemForm.id}
                id={`preview-sheet-${index}`}
                className="flex flex-col items-center w-full"
              >
                {/* Continuous Page Header Ribbon */}
                <div className="w-full bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg border-t border-x border-slate-700 flex items-center justify-between text-xs shadow-sm mb-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
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
                  <div className="text-[11px] text-amber-400 font-mono font-semibold">
                    2in1 Copy (Single 8.5" x 13" Paper)
                  </div>
                </div>

                {/* Sheet Body (8.5in x 13in proportion: 850px x 1300px) */}
                <div className="w-full min-h-[1224px] bg-white shadow-2xl rounded-b-lg border border-slate-300 p-4 flex flex-col justify-between">
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
                    <span className="bg-white px-2 text-[10px] text-slate-500 uppercase font-mono font-semibold">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
