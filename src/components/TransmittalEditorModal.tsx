import React, { useState, useEffect } from 'react';
import {
  TransmittalForm,
  TransmittalSettings,
  TransmittalItem,
  SignatoryLocationType
} from '../types/transmittal';
import { StorageService } from '../services/storageService';
import { compressAndFormatImage } from '../services/imageService';
import {
  X,
  Plus,
  Trash2,
  Save,
  Printer,
  Sparkles,
  FileCheck,
  Building,
  Truck,
  CheckCircle,
  HelpCircle,
  Upload,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

interface Props {
  initialForm?: TransmittalForm | null;
  settings: TransmittalSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: TransmittalForm, andPrint?: boolean) => Promise<void>;
}

const COMMON_PURPOSES = [
  'PRINTER INK FOR BAYAMBANG',
  'BRANCH DEPLOYMENT / REPLACEMENT',
  'POS HARDWARE & IT PERIPHERALS',
  'MOTORCYCLE DOCUMENTATION & ORIGINAL OR/CR',
  'DEFECTIVE UNIT RETURN / REPAIR',
  'MARKETING COLLATERAL & PROMO UNIFORMS',
  'SPARE PARTS & SERVICE TOOLS DISPATCH',
  'OFFICE SUPPLIES & CASHIER VAULT KEYS'
];

const COMMON_DROPS = [
  'VILLASIS',
  'BAYAMBANG',
  'PANDI',
  'CONCEPCION',
  'SAN LUIS',
  'LBC Express Cargo',
  'J&T Express Courier',
  'Company Messenger'
];

const QUICK_ITEM_TEMPLATES: { label: string; items: TransmittalItem[] }[] = [
  {
    label: '+ Epson Ink 003 (BK/Y/C)',
    items: [
      { qty: 1, description: 'EPSON INK 003 (BK)' },
      { qty: 1, description: 'EPSON INK 003 (Y)' },
      { qty: 1, description: 'EPSON INK 003 (C)' }
    ]
  },
  {
    label: '+ POS Setup',
    items: [
      { qty: 1, description: 'Epson TM-T82III Thermal Receipt Printer (S/N: )' },
      { qty: 1, description: 'Honeywell Handheld Barcode Scanner' },
      { qty: 5, description: 'Thermal Paper Rolls 80mm' }
    ]
  },
  {
    label: '+ OR/CR Docs',
    items: [
      { qty: 5, description: 'Original LTO OR/CR documents (Motorcycle Units)' },
      { qty: 5, description: 'Original Sales Invoice with Notarized Deed of Sale' },
      { qty: 5, description: 'Ignition Duplicate Keys with barcode tags' }
    ]
  },
  {
    label: '+ Promo Pack',
    items: [
      { qty: 2, description: 'Roll-up Display Banner Standees (6ft x 2.5ft)' },
      { qty: 300, description: 'Promo Marketing Brochures & Financing Guides' },
      { qty: 15, description: 'Company Uniform Polo Shirts (M/L/XL)' }
    ]
  }
];

export const TransmittalEditorModal: React.FC<Props> = ({
  initialForm,
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(initialForm);

  const [formData, setFormData] = useState<TransmittalForm>({
    id: '',
    formNumber: '',
    date: new Date().toISOString().slice(0, 10),
    purpose: COMMON_PURPOSES[0],
    remarks: '',
    dropTo: COMMON_DROPS[0],
    items: [{ qty: 1, description: '' }],
    fromName: settings.defaultFromName || '',
    fromDesignation: 'IT Systems / Liaison',
    fromType: settings.defaultFromType || 'HO',
    deliveredToName: '',
    deliveredToDesignation: 'Courier / Driver',
    deliveredToType: 'BR',
    notedByName: settings.defaultNotedByName || '',
    notedByDesignation: 'Operations Manager',
    notedByType: settings.defaultNotedByType || 'HO',
    receivedByName: '',
    receivedByDesignation: 'Branch Supervisor',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: new Date().toISOString()
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeSignatoryTarget, setActiveSignatoryTarget] = useState<'from' | 'delivered' | 'noted' | 'received'>('from');

  useEffect(() => {
    if (initialForm) {
      setFormData({
        ...initialForm,
        date: initialForm.date ? initialForm.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        items: initialForm.items?.length > 0 ? initialForm.items : [{ qty: 1, description: '' }]
      });
    } else {
      // Create new: generate next Form Number
      StorageService.generateNextFormNumber(settings.defaultFromType || 'HO').then((num) => {
        setFormData({
          id: 'trans-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          formNumber: num,
          date: new Date().toISOString().slice(0, 10),
          purpose: COMMON_PURPOSES[0],
          remarks: 'Please check items and serial numbers upon receipt. Report any damage within 24 hours.',
          dropTo: COMMON_DROPS[0],
          items: [{ qty: 1, description: '' }],
          fromName: settings.defaultFromName || 'MARK ANTHONY REYES',
          fromDesignation: 'IT Systems / Logistics',
          fromType: settings.defaultFromType || 'HO',
          deliveredToName: '',
          deliveredToDesignation: 'Courier / Messenger',
          deliveredToType: 'BR',
          notedByName: settings.defaultNotedByName || 'ENG. EDUARDO B. SANTOS',
          notedByDesignation: 'Operations Head',
          notedByType: settings.defaultNotedByType || 'HO',
          receivedByName: '',
          receivedByDesignation: 'Branch Staff / Custodian',
          receivedByType: 'BR',
          completeDelivery: false,
          createdAt: new Date().toISOString()
        });
      });
    }
  }, [initialForm, settings, isOpen]);

  if (!isOpen) return null;

  const handleRegenerateFormNumber = async (type: SignatoryLocationType) => {
    const num = await StorageService.generateNextFormNumber(type);
    setFormData((prev) => ({ ...prev, formNumber: num, fromType: type }));
  };

  const handleItemChange = (index: number, field: keyof TransmittalItem, val: string | number) => {
    const updated = [...formData.items];
    if (field === 'qty') {
      updated[index] = { ...updated[index], qty: Math.max(1, Number(val) || 1) };
    } else {
      updated[index] = { ...updated[index], description: String(val) };
    }
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { qty: 1, description: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) {
      // Keep at least 1 row
      setFormData({
        ...formData,
        items: [{ qty: 1, description: '' }]
      });
      return;
    }
    const updated = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: updated });
  };

  const applyItemTemplate = (items: TransmittalItem[]) => {
    // If only 1 empty row, replace it; else append
    if (formData.items.length === 1 && !formData.items[0].description) {
      setFormData({ ...formData, items: [...items] });
    } else {
      setFormData({ ...formData, items: [...formData.items, ...items] });
    }
  };

  const applyQuickName = (name: string) => {
    if (activeSignatoryTarget === 'from') {
      setFormData((prev) => ({ ...prev, fromName: name }));
    } else if (activeSignatoryTarget === 'delivered') {
      setFormData((prev) => ({ ...prev, deliveredToName: name }));
    } else if (activeSignatoryTarget === 'noted') {
      setFormData((prev) => ({ ...prev, notedByName: name }));
    } else if (activeSignatoryTarget === 'received') {
      setFormData((prev) => ({ ...prev, receivedByName: name }));
    }
  };

  const handleHardCopyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndFormatImage(file);
      setFormData((prev) => ({ ...prev, hardCopyUrl: dataUrl, completeDelivery: true }));
    } catch {
      alert('Failed to process image');
    }
  };

  const handleSubmit = async (andPrint = false) => {
    if (!formData.formNumber.trim()) {
      alert('Form Number is required.');
      return;
    }
    // Clean empty items if multiple
    const validItems = formData.items.filter((it) => it.description.trim().length > 0);
    if (validItems.length === 0) {
      alert('Please provide at least one valid item description.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave({ ...formData, items: validItems }, andPrint);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save transmittal.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[94vh] border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditing ? `Edit ${formData.formNumber}` : 'New Transmittal'}
                </h3>
                <span className="bg-red-50 text-red-700 text-xs font-mono font-bold px-2 py-0.5 rounded border border-red-200">
                  {formData.fromType === 'HO' ? 'Head Office' : 'Branch'}
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

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Document Parameters */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-red-600" /> Details
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Origin:</span>
                <button
                  type="button"
                  onClick={() => handleRegenerateFormNumber('HO')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    formData.fromType === 'HO'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  HO
                </button>
                <button
                  type="button"
                  onClick={() => handleRegenerateFormNumber('BR')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    formData.fromType === 'BR'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Branch
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Form #
                </label>
                <input
                  type="text"
                  value={formData.formNumber}
                  onChange={(e) => setFormData({ ...formData, formNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold uppercase text-red-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Courier / Drop-off
                </label>
                <input
                  type="text"
                  list="drops-list"
                  value={formData.dropTo || ''}
                  onChange={(e) => setFormData({ ...formData, dropTo: e.target.value.toUpperCase() })}
                  placeholder="e.g. VILLASIS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <datalist id="drops-list">
                  {COMMON_DROPS.map((drop, i) => (
                    <option key={i} value={drop} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Branch / Destination
                </label>
                <input
                  type="text"
                  value={formData.branchName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      branchName: e.target.value.toUpperCase(),
                      remarks: e.target.value.toUpperCase()
                    })
                  }
                  placeholder="e.g. BAYAMBANG"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white uppercase font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Purpose
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  list="purposes-list"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value.toUpperCase() })}
                  placeholder="Enter or select purpose..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium uppercase bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <datalist id="purposes-list">
                  {COMMON_PURPOSES.map((purp, i) => (
                    <option key={i} value={purp} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" /> Items ({formData.items.length})
                </h4>
              </div>

              {/* Quick Template Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">Templates:</span>
                {QUICK_ITEM_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyItemTemplate(tmpl.items)}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-600">
                  <tr>
                    <th className="py-2 px-3 w-12 text-center">#</th>
                    <th className="py-2 px-3 w-24 text-center">Qty</th>
                    <th className="py-2 px-3">Description &amp; Serial Number</th>
                    <th className="py-2 px-3 w-14 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          className="w-full text-center py-1 px-2 border border-slate-300 rounded text-xs font-bold focus:ring-1 focus:ring-red-500"
                          required
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Item name / serial number"
                          className="w-full py-1 px-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-500"
                          required
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {/* Section 3: Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Optional notes or instructions..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Section 4: 4 Signatory Blocks */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-red-600" /> Signatories
                </h4>
              </div>

              {/* Quick Signatory Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-600">Quick-fill:</span>
                <select
                  value={activeSignatoryTarget}
                  onChange={(e) => setActiveSignatoryTarget(e.target.value as any)}
                  className="text-xs py-1 px-2 border border-slate-300 rounded bg-white font-semibold"
                >
                  <option value="from">1. Prepared By</option>
                  <option value="noted">2. Noted By</option>
                  <option value="delivered">3. Delivered To</option>
                  <option value="received">4. Received By</option>
                </select>
                <div className="flex gap-1 flex-wrap">
                  {settings.quickNamesPreset.slice(0, 5).map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyQuickName(name)}
                      className="text-[10px] px-2 py-0.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded font-semibold transition-colors cursor-pointer"
                    >
                      {name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Block 1: Prepared By */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    1. Prepared By
                  </span>
                  <input
                    type="text"
                    value={formData.fromName}
                    onChange={(e) => setFormData({ ...formData, fromName: e.target.value.toUpperCase() })}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold uppercase focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex gap-3 text-xs pt-1 border-t border-slate-100 font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.fromType === 'HO'}
                      onChange={() => setFormData({ ...formData, fromType: 'HO' })}
                    />
                    <span>HO</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.fromType === 'BR'}
                      onChange={() => setFormData({ ...formData, fromType: 'BR' })}
                    />
                    <span>Branch</span>
                  </label>
                </div>
              </div>

              {/* Block 2: Noted By */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    2. Noted By
                  </span>
                  <input
                    type="text"
                    value={formData.notedByName}
                    onChange={(e) => setFormData({ ...formData, notedByName: e.target.value.toUpperCase() })}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold uppercase focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex gap-3 text-xs pt-1 border-t border-slate-100 font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.notedByType === 'HO'}
                      onChange={() => setFormData({ ...formData, notedByType: 'HO' })}
                    />
                    <span>HO</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.notedByType === 'BR'}
                      onChange={() => setFormData({ ...formData, notedByType: 'BR' })}
                    />
                    <span>Branch</span>
                  </label>
                </div>
              </div>

              {/* Block 3: Delivered To */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    3. Delivered To
                  </span>
                  <input
                    type="text"
                    value={formData.deliveredToName}
                    onChange={(e) => setFormData({ ...formData, deliveredToName: e.target.value.toUpperCase() })}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold uppercase focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex gap-3 text-xs pt-1 border-t border-slate-100 font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.deliveredToType === 'HO'}
                      onChange={() => setFormData({ ...formData, deliveredToType: 'HO' })}
                    />
                    <span>HO</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.deliveredToType === 'BR'}
                      onChange={() => setFormData({ ...formData, deliveredToType: 'BR' })}
                    />
                    <span>Branch</span>
                  </label>
                </div>
              </div>

              {/* Block 4: Received By */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    4. Received By
                  </span>
                  <input
                    type="text"
                    value={formData.receivedByName}
                    onChange={(e) => setFormData({ ...formData, receivedByName: e.target.value.toUpperCase() })}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold uppercase focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex gap-3 text-xs pt-1 border-t border-slate-100 font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.receivedByType === 'HO'}
                      onChange={() => setFormData({ ...formData, receivedByType: 'HO' })}
                    />
                    <span>HO</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.receivedByType === 'BR'}
                      onChange={() => setFormData({ ...formData, receivedByType: 'BR' })}
                    />
                    <span>Branch</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Delivery Status & Physical Proof */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="checkbox"
                id="completeDelivery"
                checked={formData.completeDelivery}
                onChange={(e) => setFormData({ ...formData, completeDelivery: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="completeDelivery" className="cursor-pointer">
                <span className="text-xs font-bold text-emerald-950 uppercase">
                  Complete Delivery ({formData.completeDelivery ? 'YES' : 'NO'})
                </span>
              </label>
              {!formData.completeDelivery && (
                <input
                  type="text"
                  value={formData.incompleteReason || ''}
                  onChange={(e) => setFormData({ ...formData, incompleteReason: e.target.value.toUpperCase() })}
                  placeholder="If NO, specify reason..."
                  className="px-2.5 py-1 text-xs border border-amber-300 bg-white rounded-md uppercase text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <label className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                {formData.hardCopyUrl ? 'Change Proof' : 'Attach Proof'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHardCopyUpload}
                  className="hidden"
                />
              </label>
              {formData.hardCopyUrl && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Attached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              Save &amp; Print
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
