import React, { useState, useEffect } from 'react';
import { TransmittalSettings, SignatoryLocationType, ItemTemplate, TransmittalItem } from '../types/transmittal';
import { StorageService, DEFAULT_ITEM_TEMPLATES } from '../services/storageService';
import {
  Settings,
  Building,
  Users,
  Database,
  Plus,
  Trash2,
  X,
  Check,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Edit2,
  RotateCcw,
  FileCheck,
  Package,
  ArrowRight
} from 'lucide-react';

interface Props {
  settings: TransmittalSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: TransmittalSettings) => Promise<void>;
  onRefreshData: () => Promise<void>;
  initialTab?: 'company' | 'signatories' | 'templates' | 'data';
}

export const SettingsModal: React.FC<Props> = ({
  settings,
  isOpen,
  onClose,
  onSave,
  onRefreshData,
  initialTab = 'company'
}) => {
  const [formData, setFormData] = useState<TransmittalSettings>({
    ...settings,
    templates: settings.templates && settings.templates.length > 0 ? settings.templates : DEFAULT_ITEM_TEMPLATES
  });
  const [activeTab, setActiveTab] = useState<'company' | 'signatories' | 'templates' | 'data'>(initialTab);
  const [newQuickName, setNewQuickName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Template editing state
  const [editingTemplate, setEditingTemplate] = useState<ItemTemplate | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'company');
      setFormData({
        ...settings,
        templates: settings.templates && settings.templates.length > 0 ? settings.templates : DEFAULT_ITEM_TEMPLATES
      });
    }
  }, [isOpen, initialTab, settings]);

  if (!isOpen) return null;

  const handleStartAddTemplate = () => {
    setEditingTemplate({
      id: 'tmpl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      label: '',
      purpose: '',
      items: [{ qty: 1, description: '' }]
    });
    setIsNewTemplate(true);
  };

  const handleStartEditTemplate = (tmpl: ItemTemplate) => {
    setEditingTemplate({
      ...tmpl,
      items: tmpl.items.map((it) => ({ ...it }))
    });
    setIsNewTemplate(false);
  };

  const handleCancelEditTemplate = () => {
    setEditingTemplate(null);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    const trimmedLabel = editingTemplate.label.trim();
    if (!trimmedLabel) {
      alert('Template Name / Label is required.');
      return;
    }
    const validItems = editingTemplate.items.filter((it) => it.description.trim().length > 0);
    if (validItems.length === 0) {
      alert('Please specify at least one valid item description for the template.');
      return;
    }

    const templateToSave: ItemTemplate = {
      ...editingTemplate,
      label: trimmedLabel,
      purpose: editingTemplate.purpose?.trim() || undefined,
      items: validItems
    };

    setFormData((prev) => {
      const currentList = prev.templates || DEFAULT_ITEM_TEMPLATES;
      const index = currentList.findIndex((t) => t.id === templateToSave.id);
      let updated: ItemTemplate[];
      if (index >= 0) {
        updated = [...currentList];
        updated[index] = templateToSave;
      } else {
        updated = [...currentList, templateToSave];
      }
      return { ...prev, templates: updated };
    });

    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    setFormData((prev) => {
      const currentList = prev.templates || DEFAULT_ITEM_TEMPLATES;
      return {
        ...prev,
        templates: currentList.filter((t) => t.id !== id)
      };
    });
    if (editingTemplate?.id === id) {
      setEditingTemplate(null);
    }
  };

  const handleResetTemplates = () => {
    if (window.confirm('Reset all templates to the factory default presets?')) {
      setFormData((prev) => ({
        ...prev,
        templates: DEFAULT_ITEM_TEMPLATES
      }));
      setEditingTemplate(null);
    }
  };

  const handleTemplateItemChange = (idx: number, field: keyof TransmittalItem, val: string | number) => {
    if (!editingTemplate) return;
    const newItems = [...editingTemplate.items];
    if (field === 'qty') {
      newItems[idx] = { ...newItems[idx], qty: Math.max(1, Number(val) || 1) };
    } else {
      newItems[idx] = { ...newItems[idx], description: String(val).toUpperCase() };
    }
    setEditingTemplate({ ...editingTemplate, items: newItems });
  };

  const handleAddTemplateItem = () => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      items: [...editingTemplate.items, { qty: 1, description: '' }]
    });
  };

  const handleRemoveTemplateItem = (idx: number) => {
    if (!editingTemplate) return;
    if (editingTemplate.items.length <= 1) {
      setEditingTemplate({
        ...editingTemplate,
        items: [{ qty: 1, description: '' }]
      });
      return;
    }
    const newItems = editingTemplate.items.filter((_, i) => i !== idx);
    setEditingTemplate({ ...editingTemplate, items: newItems });
  };

  const handleAddQuickName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newQuickName.trim().toUpperCase();
    if (!trimmed) return;
    if (formData.quickNamesPreset.includes(trimmed)) {
      setMsg({ text: 'Name is already in quick presets.', type: 'error' });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      quickNamesPreset: [...prev.quickNamesPreset, trimmed]
    }));
    setNewQuickName('');
  };

  const handleRemoveQuickName = (nameToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      quickNamesPreset: prev.quickNamesPreset.filter((n) => n !== nameToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSave(formData);
      setMsg({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      setMsg({ text: 'Failed to save settings.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = async () => {
    const json = await StorageService.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transmittal_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    const csv = await StorageService.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transmittal_records_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await StorageService.importJSON(text);
      setMsg({ text: `Successfully restored ${res.count} transmittal records!`, type: 'success' });
      await onRefreshData();
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Failed to import JSON backup. Invalid format.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Settings</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab('company')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'company'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" /> Company
          </button>
          <button
            onClick={() => setActiveTab('signatories')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'signatories'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Signatories
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'data'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" /> Backup
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company Complete Address
                </label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Numbers &amp; Email
                </label>
                <input
                  type="text"
                  value={formData.companyContact}
                  onChange={(e) => setFormData({ ...formData, companyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Transmittal Logo
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={formData.companyLogoUrl || '/logo.png'}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.companyLogoUrl || '/logo.png'}
                      onChange={(e) => setFormData({ ...formData, companyLogoUrl: e.target.value })}
                      placeholder="/logo.png"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'signatories' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Default "From" Signatory
                  </span>
                  <input
                    type="text"
                    value={formData.defaultFromName}
                    onChange={(e) => setFormData({ ...formData, defaultFromName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold uppercase mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex gap-4 text-xs font-medium">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.defaultFromType === 'HO'}
                        onChange={() => setFormData({ ...formData, defaultFromType: 'HO' })}
                      />
                      <span>Head Office (HO)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.defaultFromType === 'BR'}
                        onChange={() => setFormData({ ...formData, defaultFromType: 'BR' })}
                      />
                      <span>Branch (BR)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Default "Noted By" Signatory
                  </span>
                  <input
                    type="text"
                    value={formData.defaultNotedByName}
                    onChange={(e) => setFormData({ ...formData, defaultNotedByName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold uppercase mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex gap-4 text-xs font-medium">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.defaultNotedByType === 'HO'}
                        onChange={() => setFormData({ ...formData, defaultNotedByType: 'HO' })}
                      />
                      <span>Head Office (HO)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.defaultNotedByType === 'BR'}
                        onChange={() => setFormData({ ...formData, defaultNotedByType: 'BR' })}
                      />
                      <span>Branch (BR)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quick Names Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quick Names Preset (Clickable Quick-Fill Chips in Editor)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Enter employee / supervisor name..."
                    value={newQuickName}
                    onChange={(e) => setNewQuickName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickName}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {formData.quickNamesPreset.map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickName(name)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" /> Export Data
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" /> JSON Backup
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> CSV Spreadsheet
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" /> Restore Backup
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Restore initial sample transmittals? Existing records will be preserved.')) {
                        await StorageService.resetToSampleData();
                        await onRefreshData();
                        setMsg({ text: 'Sample transmittals restored.', type: 'success' });
                      }
                    }}
                    className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Restore Demo Records
                  </button>
                </div>
              </div>
            </div>
          )}

          {msg && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {msg.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {msg.text}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
