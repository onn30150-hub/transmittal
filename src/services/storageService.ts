import { TransmittalForm, TransmittalSettings, SignatoryLocationType } from '../types/transmittal';

const DB_NAME = 'TransmittalDB';
const DB_VERSION = 1;
const FORMS_STORE = 'transmittal_forms';
const SETTINGS_STORE = 'transmittal_settings';

const DEFAULT_SETTINGS: TransmittalSettings = {
  companyName: 'MICROBASE MOTORBIKE CORPORATION',
  companyAddress: 'MMC Complex, TASCOR Compound, Pag-Asa St., Anabu 1-C, Imus Cavite',
  companyContact: 'Contact: (046) 875-3286 • E-mail: info@mmcmotorcycles.com',
  companyLogoUrl: '/logo.png',
  defaultFromName: 'EARL LIAN NAZAIRE',
  defaultFromType: 'HO',
  defaultNotedByName: 'MARCO SAN MATEO',
  defaultNotedByType: 'HO',
  quickNamesPreset: [
    'EARL LIAN NAZAIRE',
    'MARCO SAN MATEO',
    'MARK ANTHONY REYES',
    'ENG. EDUARDO B. SANTOS',
    'RAMIL C. VALENCIA',
    'JHONATAN M. SERRANO',
    'ROLANDO DELA CRUZ',
    'MARIA CRISTINA SANTOS',
    'JASMIN P. MORALES',
    'ARNEL B. MENDOZA'
  ]
};

const SEED_FORMS: TransmittalForm[] = [
  {
    id: 'it26-0181',
    formNumber: 'IT26-0181',
    date: '2026-09-19',
    purpose: 'PRINTER INK FOR BAYAMBANG',
    remarks: 'BAYAMBANG',
    branchName: 'BAYAMBANG',
    dropTo: 'VILLASIS',
    items: [
      { qty: 1, description: 'EPSON INK 003 (BK)' },
      { qty: 1, description: 'EPSON INK 003 (Y)' },
      { qty: 1, description: 'EPSON INK 003 (C)' }
    ],
    fromName: 'EARL LIAN NAZAIRE',
    fromDesignation: 'IT Systems Staff',
    fromType: 'HO',
    fromDate: '09/19/26',
    deliveredToName: '',
    deliveredToDesignation: 'Area Manager',
    deliveredToType: 'BR',
    notedByName: 'MARCO SAN MATEO',
    notedByDesignation: 'Operations Head',
    notedByType: 'HO',
    notedDate: '09/19/26',
    receivedByName: '',
    receivedByDesignation: 'Branch OIC',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-09-19T09:00:00.000Z'
  },
  {
    id: 'it26-0109',
    formNumber: 'IT26-0109',
    date: '2026-06-20',
    purpose: 'PRINTER INK',
    remarks: 'Original Canon refill ink bottles for Pandi branch office printer.',
    dropTo: 'PANDI',
    items: [
      { qty: 1, description: 'CANON INK 71 (BK)' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'JHONATAN M. SERRANO',
    deliveredToDesignation: 'Courier / Logistics',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'PANDI BRANCH CUSTODIAN',
    receivedByDesignation: 'Branch Staff',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-20T08:30:00.000Z'
  },
  {
    id: 'it26-0108',
    formNumber: 'IT26-0108',
    date: '2026-06-20',
    purpose: 'PRINTER INK',
    remarks: 'Standard OEM refill bottle for Concepcion branch counter unit.',
    dropTo: 'CONCEPCION',
    items: [
      { qty: 1, description: 'EPSON INK 003 (BK)' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'JHONATAN M. SERRANO',
    deliveredToDesignation: 'Courier',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'CONCEPCION BRANCH CASHIER',
    receivedByDesignation: 'Branch Custodian',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-20T09:15:00.000Z'
  },
  {
    id: 'it26-0107',
    formNumber: 'IT26-0107',
    date: '2026-06-18',
    purpose: 'PRINTER FOR SAN LUIS',
    remarks: 'New all-in-one printer unit with complete power cable and USB interface.',
    dropTo: 'SAN LUIS',
    items: [
      { qty: 1, description: 'CANON G2020 PRINTER' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'ROLANDO DELA CRUZ',
    deliveredToDesignation: 'Company Messenger',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'Operations Manager',
    notedByType: 'HO',
    receivedByName: 'SAN LUIS BRANCH MANAGER',
    receivedByDesignation: 'Branch Head',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-18T10:00:00.000Z'
  },
  {
    id: 'it26-0106',
    formNumber: 'IT26-0106',
    date: '2026-06-18',
    purpose: 'BIOMETRIC FOR ARAYAT',
    remarks: 'Time and attendance fingerprint biometric device pre-configured with network IP.',
    dropTo: 'ARAYAT',
    items: [
      { qty: 1, description: 'BRANDNEW BIOMETRIC' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'ROLANDO DELA CRUZ',
    deliveredToDesignation: 'Company Driver',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'Operations Manager',
    notedByType: 'HO',
    receivedByName: 'ARAYAT BRANCH SUPERVISOR',
    receivedByDesignation: 'Branch Supervisor',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-18T14:30:00.000Z'
  },
  {
    id: 'it26-0105',
    formNumber: 'IT26-0105',
    date: '2026-06-13',
    purpose: 'POWER SUPPLY FOR BIOMETRIC OF ROSARIO LU',
    remarks: 'Replacement 6V power adaptor for biometric unit at Rosario La Union.',
    dropTo: 'ROSARIO LA UNION',
    items: [
      { qty: 1, description: 'BRANDNEW 6V POWERSUPPLY FOR BIOMETRIC' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'JEFFREY T. LIM',
    deliveredToDesignation: 'Logistics Liaison',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'ROSARIO BRANCH CUSTODIAN',
    receivedByDesignation: 'Branch Staff',
    receivedByType: 'BR',
    completeDelivery: true,
    hardCopyUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="760" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="4"/><text x="300" y="80" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b" text-anchor="middle">MICROBASE MOTORBIKE CORP</text><text x="300" y="110" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">TRANSMITTAL PROOF - IT26-0105</text><rect x="60" y="150" width="480" height="50" fill="%23e2e8f0" rx="6"/><text x="80" y="180" font-family="monospace" font-size="15" font-weight="bold" fill="%230f172a">REF: IT26-0105 | ROSARIO LA UNION</text><path d="M100 480 Q 160 410, 230 460 T 340 440" fill="none" stroke="%231d4ed8" stroke-width="3"/><text x="140" y="510" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e293b">RECEIVED IN GOOD ORDER &amp; CONDITION</text><text x="140" y="530" font-family="sans-serif" font-size="12" fill="%2364748b">Signed by Rosario Branch Custodian • June 14, 2026</text><circle cx="450" cy="500" r="45" fill="none" stroke="%2316a34a" stroke-width="2" stroke-dasharray="3"/><text x="450" y="495" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2316a34a" text-anchor="middle">RECEIVED</text><text x="450" y="510" font-family="sans-serif" font-size="10" fill="%2316a34a" text-anchor="middle">BRANCH SEAL</text></svg>',
    createdAt: '2026-06-13T08:00:00.000Z'
  },
  {
    id: 'it26-0104',
    formNumber: 'IT26-0104',
    date: '2026-06-13',
    purpose: 'PRINTER INK FOR MANAOAG',
    remarks: 'Epson T664 series bottled black ink for branch daily report printing.',
    dropTo: 'Manaoag',
    items: [
      { qty: 1, description: 'EPSON 664 BLACK INK FOR EPSON L360' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'JHONATAN M. SERRANO',
    deliveredToDesignation: 'Cargo Dispatcher',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'MANAOAG BRANCH STAFF',
    receivedByDesignation: 'Branch Custodian',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-13T11:20:00.000Z'
  },
  {
    id: 'it26-0103',
    formNumber: 'IT26-0103',
    date: '2026-06-07',
    purpose: 'Printer printhead replacement',
    remarks: 'Genuine Canon replacement printhead BH-70 (Black) in factory sealed blister pack.',
    dropTo: 'Pulong buhangin',
    items: [
      { qty: 1, description: 'Canon Print head BH-70' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'ROLANDO DELA CRUZ',
    deliveredToDesignation: 'Company Driver',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'Operations Manager',
    notedByType: 'HO',
    receivedByName: 'PULONG BUHANGIN BRANCH CUSTODIAN',
    receivedByDesignation: 'Branch Staff',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-07T09:40:00.000Z'
  },
  {
    id: 'it26-0102',
    formNumber: 'IT26-0102',
    date: '2026-06-06',
    purpose: 'MONITOR ADAPTER',
    remarks: '12V 2A DC regulated switching adapter with standard plug for cashier monitor.',
    dropTo: 'CALASIAO',
    items: [
      { qty: 1, description: '12V 2A POWER SUPPLY' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'JEFFREY T. LIM',
    deliveredToDesignation: 'Courier Liaison',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'CALASIAO BRANCH SUPERVISOR',
    receivedByDesignation: 'Branch Supervisor',
    receivedByType: 'BR',
    completeDelivery: true,
    hardCopyUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="760" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="4"/><text x="300" y="80" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b" text-anchor="middle">MICROBASE MOTORBIKE CORP</text><text x="300" y="110" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">PROOF OF RECEIPT - IT26-0102</text><rect x="60" y="150" width="480" height="50" fill="%23e2e8f0" rx="6"/><text x="80" y="180" font-family="monospace" font-size="15" font-weight="bold" fill="%230f172a">REF: IT26-0102 | CALASIAO</text><path d="M110 470 Q 170 410, 240 450 T 330 430" fill="none" stroke="%231d4ed8" stroke-width="3"/><text x="140" y="510" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e293b">RECEIVED BY: Calasiao Branch Supervisor</text><text x="140" y="530" font-family="sans-serif" font-size="12" fill="%2364748b">Verified working • June 7, 2026</text><circle cx="450" cy="500" r="45" fill="none" stroke="%2316a34a" stroke-width="2" stroke-dasharray="3"/><text x="450" y="495" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2316a34a" text-anchor="middle">COMPLETED</text><text x="450" y="510" font-family="sans-serif" font-size="10" fill="%2316a34a" text-anchor="middle">ACKNOWLEDGMENT</text></svg>',
    createdAt: '2026-06-06T08:15:00.000Z'
  }
];

// Broadcast Channel for real-time multi-tab event communication
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('transmittal_system_channel');
  }
} catch {
  // Ignored if unavailable
}

function notifySubscribers() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('transmittal_data_updated'));
  }
}

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(FORMS_STORE)) {
        db.createObjectStore(FORMS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback wrappers
const LS_FORMS_KEY = 'transmittal_forms_v1';
const LS_SETTINGS_KEY = 'transmittal_settings_v1';

function getFormsFromLocalStorage(): TransmittalForm[] {
  try {
    const raw = localStorage.getItem(LS_FORMS_KEY);
    if (!raw) {
      localStorage.setItem(LS_FORMS_KEY, JSON.stringify(SEED_FORMS));
      return SEED_FORMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && (parsed.length === 0 || parsed.every((f: TransmittalForm) => f.id.startsWith('seed-ho26')))) {
      localStorage.setItem(LS_FORMS_KEY, JSON.stringify(SEED_FORMS));
      return SEED_FORMS;
    }
    return parsed;
  } catch {
    return SEED_FORMS;
  }
}

function saveFormsToLocalStorage(forms: TransmittalForm[]) {
  try {
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(forms));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export const StorageService = {
  async init(): Promise<void> {
    try {
      const forms = await this.getTransmittals();
      const hasOldSeedsOnly = forms.length > 0 && forms.every((f) => f.id.startsWith('seed-ho26'));
      if (forms.length === 0 || hasOldSeedsOnly) {
        if (hasOldSeedsOnly) {
          for (const old of forms) {
            await this.deleteTransmittal(old.id);
          }
        }
        for (const form of SEED_FORMS) {
          await this.saveTransmittal(form);
        }
      }
      const settings = await this.getSettings();
      if (!settings || !settings.companyName) {
        await this.saveSettings(DEFAULT_SETTINGS);
      }
    } catch {
      // Fallback already initializes default in catch blocks
    }
  },

  async getTransmittals(): Promise<TransmittalForm[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(FORMS_STORE, 'readonly');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          let forms = req.result as TransmittalForm[];
          if (!forms || forms.length === 0) {
            // Seed
            forms = getFormsFromLocalStorage();
            // sync to indexeddb
            forms.forEach((f) => {
              try {
                const wtx = db.transaction(FORMS_STORE, 'readwrite');
                wtx.objectStore(FORMS_STORE).put(f);
              } catch {}
            });
          }
          // Sort descending by date / createdAt
          forms.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
          resolve(forms);
        };
        req.onerror = () => {
          resolve(getFormsFromLocalStorage());
        };
      });
    } catch {
      return getFormsFromLocalStorage();
    }
  },

  async getTransmittal(id: string): Promise<TransmittalForm | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(FORMS_STORE, 'readonly');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) resolve(req.result);
          else {
            const all = getFormsFromLocalStorage();
            resolve(all.find((f) => f.id === id) || null);
          }
        };
        req.onerror = () => {
          const all = getFormsFromLocalStorage();
          resolve(all.find((f) => f.id === id) || null);
        };
      });
    } catch {
      const all = getFormsFromLocalStorage();
      return all.find((f) => f.id === id) || null;
    }
  },

  async saveTransmittal(form: TransmittalForm): Promise<TransmittalForm> {
    const updatedForm: TransmittalForm = {
      ...form,
      updatedAt: new Date().toISOString(),
      createdAt: form.createdAt || new Date().toISOString()
    };

    // Save to LocalStorage
    const localForms = getFormsFromLocalStorage();
    const existingIndex = localForms.findIndex((f) => f.id === updatedForm.id);
    if (existingIndex >= 0) {
      localForms[existingIndex] = updatedForm;
    } else {
      localForms.unshift(updatedForm);
    }
    saveFormsToLocalStorage(localForms);

    // Save to IndexedDB
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(FORMS_STORE, 'readwrite');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.put(updatedForm);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Could not save to IndexedDB, fallback stored in LocalStorage', err);
    }

    notifySubscribers();
    return updatedForm;
  },

  async deleteTransmittal(id: string): Promise<void> {
    const localForms = getFormsFromLocalStorage().filter((f) => f.id !== id);
    saveFormsToLocalStorage(localForms);

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(FORMS_STORE, 'readwrite');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to delete from IndexedDB', err);
    }

    notifySubscribers();
  },

  async getSettings(): Promise<TransmittalSettings> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(SETTINGS_STORE, 'readonly');
        const store = tx.objectStore(SETTINGS_STORE);
        const req = store.get('main_settings');
        req.onsuccess = () => {
          if (req.result?.data) {
            resolve({ ...DEFAULT_SETTINGS, ...req.result.data });
          } else {
            const raw = localStorage.getItem(LS_SETTINGS_KEY);
            if (raw) {
              resolve({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
            } else {
              resolve(DEFAULT_SETTINGS);
            }
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem(LS_SETTINGS_KEY);
          resolve(raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS);
        };
      });
    } catch {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: TransmittalSettings): Promise<TransmittalSettings> {
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(SETTINGS_STORE, 'readwrite');
        const store = tx.objectStore(SETTINGS_STORE);
        const req = store.put({ key: 'main_settings', data: settings });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to save settings to IndexedDB', err);
    }

    notifySubscribers();
    return settings;
  },

  async generateNextFormNumber(locationType: SignatoryLocationType = 'HO'): Promise<string> {
    const forms = await this.getTransmittals();
    const currentYear = new Date().getFullYear().toString().slice(-2); // "26" for 2026
    const prefix = `${locationType}${currentYear}-`; // e.g. "HO26-"

    let maxNumber = 0;
    forms.forEach((f) => {
      if (f.formNumber && f.formNumber.startsWith(prefix)) {
        const numPart = parseInt(f.formNumber.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNumber) {
          maxNumber = numPart;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  },

  async exportJSON(): Promise<string> {
    const forms = await this.getTransmittals();
    const settings = await this.getSettings();
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      company: settings.companyName,
      forms,
      settings
    }, null, 2);
  },

  async exportCSV(): Promise<string> {
    const forms = await this.getTransmittals();
    const headers = [
      'Form Number',
      'Date',
      'Purpose',
      'Status',
      'Drop To / Courier',
      'From (Name)',
      'From (Designation)',
      'From (HO/BR)',
      'Delivered To (Name)',
      'Delivered To (Designation)',
      'Delivered To (HO/BR)',
      'Noted By (Name)',
      'Noted By (Designation)',
      'Noted By (HO/BR)',
      'Received By (Name)',
      'Received By (Designation)',
      'Received By (HO/BR)',
      'Total Items',
      'Items Summary',
      'Remarks',
      'Hard Copy Attached'
    ];

    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const rows = forms.map((f) => {
      const itemsSummary = f.items.map((i) => `[${i.qty}x ${i.description}]`).join('; ');
      return [
        escapeCsv(f.formNumber),
        escapeCsv(f.date),
        escapeCsv(f.purpose),
        escapeCsv(f.completeDelivery ? 'COMPLETED' : 'PENDING'),
        escapeCsv(f.dropTo || ''),
        escapeCsv(f.fromName),
        escapeCsv(f.fromDesignation),
        escapeCsv(f.fromType),
        escapeCsv(f.deliveredToName),
        escapeCsv(f.deliveredToDesignation),
        escapeCsv(f.deliveredToType),
        escapeCsv(f.notedByName),
        escapeCsv(f.notedByDesignation),
        escapeCsv(f.notedByType),
        escapeCsv(f.receivedByName),
        escapeCsv(f.receivedByDesignation),
        escapeCsv(f.receivedByType),
        escapeCsv(f.items.length),
        escapeCsv(itemsSummary),
        escapeCsv(f.remarks),
        escapeCsv(f.hardCopyUrl ? 'YES' : 'NO')
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  },

  async importJSON(jsonString: string): Promise<{ count: number }> {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.forms)) {
      throw new Error('Invalid file structure. Expected JSON with "forms" array.');
    }

    let count = 0;
    for (const form of parsed.forms) {
      if (form.formNumber && form.items) {
        await this.saveTransmittal(form);
        count++;
      }
    }

    if (parsed.settings) {
      await this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
    }

    notifySubscribers();
    return { count };
  },

  subscribe(callback: () => void): () => void {
    const handler = () => callback();

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handler);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('transmittal_data_updated', handler);
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handler);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('transmittal_data_updated', handler);
      }
    };
  }
};
