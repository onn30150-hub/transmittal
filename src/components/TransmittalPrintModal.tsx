import React, { useState } from 'react';
import { TransmittalForm, TransmittalSettings, PrintMode } from '../types/transmittal';
import { TransmittalDocument } from './TransmittalDocument';
import { Printer, X, Scissors, FileText, ZoomIn, ZoomOut, Check, Sparkles } from 'lucide-react';

interface Props {
  form: TransmittalForm;
  settings: TransmittalSettings;
  isOpen: boolean;
  onClose: () => void;
  printMode?: PrintMode;
  onPrintModeChange?: (mode: PrintMode) => void;
}

export const TransmittalPrintModal: React.FC<Props> = ({
  form,
  settings,
  isOpen,
  onClose,
  printMode: controlledPrintMode,
  onPrintModeChange
}) => {
  const [localPrintMode, setLocalPrintMode] = useState<PrintMode>('dual-copy');
  const printMode = controlledPrintMode || localPrintMode;
  const setPrintMode = (mode: PrintMode) => {
    setLocalPrintMode(mode);
    if (onPrintModeChange) onPrintModeChange(mode);
  };
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm overflow-hidden no-print">
      {/* Top action toolbar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg text-white font-bold flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Print Slip</h2>
              <span className="bg-slate-800 text-red-400 font-mono px-2 py-0.5 rounded text-xs border border-slate-700 font-bold">
                {form.formNumber}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                8.5" × 13" Long Bond / Folio
              </span>
            </div>
          </div>
        </div>

        {/* Layout toggle & Actions */}
        <div className="flex items-center gap-3">
          {/* Print mode selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setPrintMode('dual-copy')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                printMode === 'dual-copy'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              2-in-1 Dual Copy
            </button>
            <button
              onClick={() => setPrintMode('full-page')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                printMode === 'full-page'
                  ? 'bg-red-600 text-white shadow-sm'
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
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 15))}
              className="p-1 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Document
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

      {/* Sub-bar: Paper Specs Hint */}
      <div className="bg-slate-800/90 text-slate-300 text-xs px-6 py-1.5 flex items-center justify-between border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-2 text-[11.5px]">
          <span className="font-semibold text-white">Target Paper:</span>
          <span>8.5" × 13" (Philippine Long Bond / Folio / F4)</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            {printMode === 'dual-copy'
              ? '2-in-1 layout: Head Office Copy (top) & Branch Copy (bottom) with center cut line'
              : 'Full page layout (expanded items table)'}
          </span>
        </div>
        <span className="text-amber-400 text-[11px] font-medium hidden md:inline">
          Tip: In Print Dialog, select Paper size "Folio", "8.5 × 13", or "Legal" with Margins "Default"
        </span>
      </div>

      {/* Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-6 md:p-10 flex justify-center items-start bg-slate-950/60">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150"
        >
          {printMode === 'full-page' ? (
            /* Full Page View (8.5in x 13in proportion: 800px x 1224px) */
            <div className="w-[800px] min-h-[1224px] bg-white shadow-2xl rounded-sm border border-slate-300 p-4 flex flex-col justify-between">
              <TransmittalDocument
                form={form}
                settings={settings}
                watermarkType="head-office"
                copyLabel="HEAD OFFICE COPY"
                isCompact={false}
              />
            </div>
          ) : (
            /* 2-in-1 Dual Half-Sheet (8.5in x 13in paper proportion: 800px x 1224px) */
            <div className="w-[800px] min-h-[1224px] bg-white shadow-2xl rounded-sm border border-slate-300 p-4 flex flex-col justify-between">
              {/* Top Half: Head Office Copy */}
              <div className="flex-1 pb-3 flex flex-col justify-center">
                <TransmittalDocument
                  form={form}
                  settings={settings}
                  watermarkType="head-office"
                  copyLabel="HEAD OFFICE COPY"
                  isCompact={true}
                />
              </div>

              {/* Scissor Cut Line Divider at Center */}
              <div className="relative my-2 py-1 flex items-center justify-center border-t-2 border-dashed border-slate-400">
                <div className="absolute bg-white px-3 text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-widest border border-slate-300 rounded-full py-0.5">
                  <Scissors className="w-3.5 h-3.5" />
                  ✄ DETACH HERE - BRANCH COPY ✄
                </div>
              </div>

              {/* Bottom Half: Branch Copy */}
              <div className="flex-1 pt-3 flex flex-col justify-center">
                <TransmittalDocument
                  form={form}
                  settings={settings}
                  watermarkType="branch"
                  copyLabel="BRANCH COPY"
                  isCompact={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
