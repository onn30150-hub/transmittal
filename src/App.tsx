import React, { useState, useEffect, useMemo } from 'react';
import {
  TransmittalForm,
  TransmittalSettings,
  FilterOptions,
  SignatoryLocationType,
  PrintMode
} from './types/transmittal';
import { StorageService, compareTransmittalsNewestFirst } from './services/storageService';
import { Navbar } from './components/Navbar';
import { StatsAndFilters } from './components/StatsAndFilters';
import { TransmittalList } from './components/TransmittalList';
import { TransmittalEditorModal } from './components/TransmittalEditorModal';
import { TransmittalPrintModal } from './components/TransmittalPrintModal';
import { HardCopyModal } from './components/HardCopyModal';
import { SettingsModal } from './components/SettingsModal';
import { TransmittalDocument } from './components/TransmittalDocument';
import { Plus, Printer, RefreshCw, Scissors, FileText } from 'lucide-react';

export default function App() {
  const [forms, setForms] = useState<TransmittalForm[]>([]);
  const [settings, setSettings] = useState<TransmittalSettings>({
    companyName: 'MICROBASE MOTORBIKE CORPORATION',
    companyAddress: 'MMC Complex, TASCOR Compound, Pag-Asa St., Anabu 1-C, Imus Cavite',
    companyContact: 'Contact: (046) 875-3286 • E-mail: info@mmcmotorcycles.com',
    companyLogoUrl: '/logo.png',
    defaultFromName: 'EARL LIAN NAZAIRE',
    defaultFromType: 'HO',
    defaultNotedByName: 'MARCO SAN MATEO',
    defaultNotedByType: 'HO',
    quickNamesPreset: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    status: 'all',
    locationType: 'all',
    dateFrom: '',
    dateTo: '',
    purpose: ''
  });

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<TransmittalForm | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activePrintForm, setActivePrintForm] = useState<TransmittalForm | null>(null);
  const [printBatchForms, setPrintBatchForms] = useState<TransmittalForm[]>([]);
  const [activePrintMode, setActivePrintMode] = useState<PrintMode>('dual-copy');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isHardCopyModalOpen, setIsHardCopyModalOpen] = useState(false);
  const [activeHardCopyForm, setActiveHardCopyForm] = useState<TransmittalForm | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      await StorageService.init();
      const [loadedForms, loadedSettings] = await Promise.all([
        StorageService.getTransmittals(),
        StorageService.getSettings()
      ]);
      setForms(loadedForms);
      setSettings(loadedSettings);
      if (loadedForms.length > 0 && !activePrintForm) {
        setActivePrintForm(loadedForms[0]);
      }
    } catch (err) {
      console.error('Failed to load storage data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = StorageService.subscribe(() => {
      StorageService.getTransmittals().then(setForms);
      StorageService.getSettings().then(setSettings);
    });
    return () => unsubscribe();
  }, []);

  // Filtered forms calculation (guaranteed sorted from newer to older)
  const filteredForms = useMemo(() => {
    const list = forms.filter((f) => {
      // Search query (form number, recipient, purpose, dropTo, items)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = f.formNumber.toLowerCase().includes(q);
        const matchPurpose = f.purpose.toLowerCase().includes(q);
        const matchDrop = (f.dropTo || '').toLowerCase().includes(q);
        const matchRecipient = (f.receivedByName || '').toLowerCase().includes(q);
        const matchFrom = (f.fromName || '').toLowerCase().includes(q);
        const matchItem = f.items.some((it) => it.description.toLowerCase().includes(q));

        if (!matchNumber && !matchPurpose && !matchDrop && !matchRecipient && !matchFrom && !matchItem) {
          return false;
        }
      }

      // Status filter
      if (filters.status === 'pending' && f.completeDelivery) return false;
      if (filters.status === 'completed' && !f.completeDelivery) return false;
      if (filters.status === 'has_hardcopy' && !f.hardCopyUrl) return false;

      // Location type
      if (filters.locationType === 'HO' && f.fromType !== 'HO') return false;
      if (filters.locationType === 'BR' && f.fromType !== 'BR') return false;

      return true;
    });

    return [...list].sort(compareTransmittalsNewestFirst);
  }, [forms, searchQuery, filters]);

  // Handlers
  const handleNewTransmittal = () => {
    setEditingForm(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (form: TransmittalForm) => {
    setEditingForm(form);
    setIsEditorOpen(true);
  };

  const handlePrint = (form: TransmittalForm) => {
    setActivePrintForm(form);
    setPrintBatchForms([form]);
    setIsPrintModalOpen(true);
  };

  const handleBulkPrint = () => {
    const selected = forms.filter((f) => selectedIds.includes(f.id));
    if (selected.length > 0) {
      setActivePrintForm(selected[0]);
      setPrintBatchForms(selected);
      setIsPrintModalOpen(true);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredForms.length && filteredForms.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredForms.map((f) => f.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleDuplicate = async (form: TransmittalForm) => {
    const nextNum = await StorageService.generateNextFormNumber(form.fromType);
    const duplicated: TransmittalForm = {
      ...form,
      id: 'trans-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      formNumber: nextNum,
      date: new Date().toISOString().slice(0, 10),
      completeDelivery: false,
      hardCopyUrl: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: undefined
    };
    await StorageService.saveTransmittal(duplicated);
    const updated = await StorageService.getTransmittals();
    setForms(updated);
    setEditingForm(duplicated);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transmittal record?')) {
      await StorageService.deleteTransmittal(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      const updated = await StorageService.getTransmittals();
      setForms(updated);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg =
      selectedIds.length === forms.length
        ? `Are you sure you want to delete ALL ${selectedIds.length} transmittal records? This action cannot be undone.`
        : `Are you sure you want to delete the ${selectedIds.length} selected transmittal records?`;

    if (window.confirm(confirmMsg)) {
      for (const id of selectedIds) {
        await StorageService.deleteTransmittal(id);
      }
      setSelectedIds([]);
      const updated = await StorageService.getTransmittals();
      setForms(updated);
    }
  };

  const handleToggleStatus = async (form: TransmittalForm) => {
    const updated: TransmittalForm = {
      ...form,
      completeDelivery: !form.completeDelivery
    };
    await StorageService.saveTransmittal(updated);
    const fresh = await StorageService.getTransmittals();
    setForms(fresh);
  };

  const handleViewHardCopy = (form: TransmittalForm) => {
    setActiveHardCopyForm(form);
    setIsHardCopyModalOpen(true);
  };

  const handleSaveHardCopy = async (formId: string, hardCopyUrl?: string) => {
    const target = forms.find((f) => f.id === formId);
    if (!target) return;
    const updated: TransmittalForm = {
      ...target,
      hardCopyUrl,
      completeDelivery: hardCopyUrl ? true : target.completeDelivery
    };
    await StorageService.saveTransmittal(updated);
    const fresh = await StorageService.getTransmittals();
    setForms(fresh);
  };

  const handleSaveForm = async (savedForm: TransmittalForm, andPrint = false) => {
    await StorageService.saveTransmittal(savedForm);
    const fresh = await StorageService.getTransmittals();
    setForms(fresh);
    if (andPrint) {
      setActivePrintForm(savedForm);
      setIsPrintModalOpen(true);
    }
  };

  const handleSaveSettings = async (newSettings: TransmittalSettings) => {
    await StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onNewTransmittal={handleNewTransmittal}
        onOpenSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5 no-print">
        {/* Statistics & Filter Controls */}
        <StatsAndFilters
          forms={forms}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Divider Separation Line */}
        <div className="border-t border-slate-200/80" />

        {/* List of Transmittals */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-red-600" />
            <p className="text-xs font-medium text-slate-500">Loading transmittal records...</p>
          </div>
        ) : (
          <TransmittalList
            forms={filteredForms}
            settings={settings}
            viewMode={viewMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkPrint={handleBulkPrint}
            onBulkDelete={handleBulkDelete}
            onEdit={handleEdit}
            onPrint={handlePrint}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onViewHardCopy={handleViewHardCopy}
            onNewTransmittal={handleNewTransmittal}
          />
        )}
      </main>

      {/* Clean Light Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-3 text-center text-xs text-slate-400 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="font-medium text-slate-600">
            {settings.companyName}
          </div>
          <div className="text-[11px] text-slate-400">
            Transmittal Record Management
          </div>
        </div>
      </footer>

      {/* Floating Quick Action Button on Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden no-print z-20">
        <button
          onClick={handleNewTransmittal}
          className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      {isEditorOpen && (
        <TransmittalEditorModal
          initialForm={editingForm}
          settings={settings}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveForm}
        />
      )}

      {isPrintModalOpen && (printBatchForms.length > 0 || activePrintForm) && (
        <TransmittalPrintModal
          forms={printBatchForms.length > 0 ? printBatchForms : activePrintForm ? [activePrintForm] : []}
          settings={settings}
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          printMode={activePrintMode}
          onPrintModeChange={setActivePrintMode}
        />
      )}

      {isHardCopyModalOpen && activeHardCopyForm && (
        <HardCopyModal
          form={activeHardCopyForm}
          isOpen={isHardCopyModalOpen}
          onClose={() => setIsHardCopyModalOpen(false)}
          onSaveHardCopy={handleSaveHardCopy}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          onRefreshData={loadData}
        />
      )}

      {/* PRINT-ONLY DOM CONTAINER:
          Targeted directly by `@media print` when window.print() is called.
          Optimized for 8.5in x 13in (Philippine Long Bond / Folio) paper!
          Supports bulk printing: each slip renders on its own separate sheet.
      */}
      {(printBatchForms.length > 0 ? printBatchForms : activePrintForm ? [activePrintForm] : []).length > 0 && (
        <div className="print-only">
          {(printBatchForms.length > 0 ? printBatchForms : activePrintForm ? [activePrintForm] : []).map((batchForm) => (
            <div key={batchForm.id} className="print-page">
              {activePrintMode === 'dual-copy' ? (
                <div className="w-full h-full flex flex-col justify-between">
                  {/* Top Half: Head Office Copy (fits top 6.25 inches) */}
                  <div className="flex-1 flex flex-col justify-center pb-2">
                    <TransmittalDocument
                      form={batchForm}
                      settings={settings}
                      watermarkType="head-office"
                      copyLabel="HEAD OFFICE COPY"
                      isCompact={true}
                    />
                  </div>

                  {/* Center Cut Line Divider */}
                  <div className="w-full my-1.5 border-t-2 border-dashed border-black" />

                  {/* Bottom Half: Branch Copy (fits bottom 6.25 inches) */}
                  <div className="flex-1 flex flex-col justify-center pt-2">
                    <TransmittalDocument
                      form={batchForm}
                      settings={settings}
                      watermarkType="branch"
                      copyLabel="BRANCH COPY"
                      isCompact={true}
                    />
                  </div>
                </div>
              ) : (
                /* Full Page Mode on 8.5in x 13in sheet */
                <div className="w-full h-full flex flex-col justify-center">
                  <TransmittalDocument
                    form={batchForm}
                    settings={settings}
                    watermarkType="head-office"
                    copyLabel="HEAD OFFICE COPY"
                    isCompact={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
