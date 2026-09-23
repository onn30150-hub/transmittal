import React, { useState, useRef } from 'react';
import { TransmittalForm } from '../types/transmittal';
import { compressAndFormatImage } from '../services/imageService';
import {
  Upload,
  Camera,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  X,
  FileCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  form: TransmittalForm;
  isOpen: boolean;
  onClose: () => void;
  onSaveHardCopy: (formId: string, hardCopyUrl?: string) => Promise<void>;
}

export const HardCopyModal: React.FC<Props> = ({
  form,
  isOpen,
  onClose,
  onSaveHardCopy
}) => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(form.hardCopyUrl);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusMessage('Optimizing and compressing scanned document...');
      const dataUrl = await compressAndFormatImage(file, 1600, 0.85);
      setCurrentUrl(dataUrl);
      setRotation(0);
      setZoom(100);
      setStatusMessage('Document uploaded. Click "Save & Attach" to persist.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      await onSaveHardCopy(form.id, currentUrl);
      onClose();
    } catch (err) {
      console.error(err);
      setStatusMessage('Error saving attachment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this attached hard copy?')) {
      setCurrentUrl(undefined);
    }
  };

  const handleDownload = () => {
    if (!currentUrl) return;
    const a = document.createElement('a');
    a.href = currentUrl;
    a.download = `Signed_Transmittal_${form.formNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Proof of Delivery</h3>
                <span className="font-mono bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded font-semibold">
                  {form.formNumber}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 shadow-sm cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              Upload
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 shadow-sm cursor-pointer transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              Camera
            </button>
          </div>

          {currentUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(40, z - 20))}
                className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs w-12 text-center text-slate-600">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(250, z + 20))}
                className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemove}
                className="p-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Preview Canvas */}
        <div className="flex-1 min-h-[380px] max-h-[520px] bg-slate-900/95 overflow-auto p-6 flex items-center justify-center relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 text-white flex-col gap-2">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">{statusMessage || 'Processing...'}</p>
            </div>
          )}

          {currentUrl ? (
            <div
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out'
              }}
              className="max-w-full shadow-2xl rounded"
            >
              <img
                src={currentUrl}
                alt={`Scanned Hard Copy for ${form.formNumber}`}
                className="max-w-full max-h-[480px] object-contain rounded bg-white"
              />
            </div>
          ) : (
            <div className="text-center text-slate-400 max-w-sm p-6 border-2 border-dashed border-slate-700 rounded-2xl">
              <FileCheck className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="font-semibold text-slate-300 text-base mb-1">No Hard Copy Attached Yet</p>
              <p className="text-xs text-slate-500 mb-4">
                Attach a photo or scan of the signed transmittal slip to verify acknowledgment and maintain complete compliance records.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md"
                >
                  Choose File
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-700"
                >
                  Camera Capture
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        {statusMessage && (
          <div className="px-6 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            {currentUrl ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Attached
              </span>
            ) : (
              <span>No attachment</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
