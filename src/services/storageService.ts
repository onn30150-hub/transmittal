import { TransmittalForm, TransmittalSettings, SignatoryLocationType, ItemTemplate } from '../types/transmittal';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

const DB_NAME = 'TransmittalDB';
const DB_VERSION = 1;
const FORMS_STORE = 'transmittal_forms';
const SETTINGS_STORE = 'transmittal_settings';

export const DEFAULT_ITEM_TEMPLATES: ItemTemplate[] = [
  {
    id: 'tmpl-epson-ink',
    label: 'Epson Ink 003 (BK/Y/C)',
    purpose: 'PRINTER INK',
    items: [
      { qty: 1, description: 'EPSON INK 003 (BK)' },
      { qty: 1, description: 'EPSON INK 003 (Y)' },
      { qty: 1, description: 'EPSON INK 003 (C)' }
    ]
  },
  {
    id: 'tmpl-pos-setup',
    label: 'POS Setup',
    purpose: 'POS HARDWARE SETUP',
    items: [
      { qty: 1, description: 'Epson TM-T82III Thermal Receipt Printer (S/N: )' },
      { qty: 1, description: 'Honeywell Handheld Barcode Scanner' },
      { qty: 5, description: 'Thermal Paper Rolls 80mm' }
    ]
  },
  {
    id: 'tmpl-orcr-docs',
    label: 'OR/CR Docs',
    purpose: 'OR/CR DOCUMENTS',
    items: [
      { qty: 5, description: 'Original LTO OR/CR documents (Motorcycle Units)' },
      { qty: 5, description: 'Original Sales Invoice with Notarized Deed of Sale' },
      { qty: 5, description: 'Ignition Duplicate Keys with barcode tags' }
    ]
  },
  {
    id: 'tmpl-promo-pack',
    label: 'Promo Pack',
    purpose: 'MARKETING PROMO PACK',
    items: [
      { qty: 2, description: 'Roll-up Display Banner Standees (6ft x 2.5ft)' },
      { qty: 300, description: 'Promo Marketing Brochures & Financing Guides' },
      { qty: 15, description: 'Company Uniform Polo Shirts (M/L/XL)' }
    ]
  }
];

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
  ],
  templates: DEFAULT_ITEM_TEMPLATES
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
    deliveredToDesignation: 'Logistics Courier',
    deliveredToType: 'HO',
    notedByName: 'ENG. EDUARDO B. SANTOS',
    notedByDesignation: 'IT Operations Head',
    notedByType: 'HO',
    receivedByName: 'CONCEPCION BRANCH OIC',
    receivedByDesignation: 'Branch Custodian',
    receivedByType: 'BR',
    completeDelivery: false,
    createdAt: '2026-06-20T08:00:00.000Z'
  },
  {
    id: 'it26-0102',
    formNumber: 'IT26-0102',
    date: '2026-06-06',
    purpose: 'COMPUTER PARTS AND HARDWARE',
    remarks: 'Replacement SSD drive and 8GB RAM module for Calasiao admin desktop workstation.',
    dropTo: 'CALASIAO',
    branchName: 'CALASIAO',
    items: [
      { qty: 1, description: 'KINGSTON SSD 480GB 2.5" SATA' },
      { qty: 1, description: 'RAM DDR4 8GB 2666MHZ KINGSTON' }
    ],
    fromName: 'MARK ANTHONY REYES',
    fromDesignation: 'IT Systems Specialist',
    fromType: 'HO',
    deliveredToName: 'RAMIL C. VALENCIA',
    deliveredToDesignation: 'Logistics Coordinator',
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

// Broadcast Channel for multi-tab notification
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('transmittal_system_channel');
  }
} catch {}

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
      const target = e.target as IDBOpenDBRequest;
      const idb = target.result;
      if (!idb.objectStoreNames.contains(FORMS_STORE)) {
        idb.createObjectStore(FORMS_STORE, { keyPath: 'id' });
      }
      if (!idb.objectStoreNames.contains(SETTINGS_STORE)) {
        idb.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const LS_FORMS_KEY = 'transmittal_forms_v1';
const LS_SETTINGS_KEY = 'transmittal_settings_v1';
const STORAGE_INITIALIZED_KEY = 'transmittal_app_seeded_v2';

export function compareTransmittalsNewestFirst(a: TransmittalForm, b: TransmittalForm): number {
  // 1. Primary: Compare calendar date (newer date comes first)
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  if (!isNaN(dateA) && !isNaN(dateB) && dateB !== dateA) {
    return dateB - dateA;
  }

  // 2. Secondary: If dates match, compare createdAt timestamp (newer creation comes first)
  const createdA = new Date(a.createdAt || a.date).getTime();
  const createdB = new Date(b.createdAt || b.date).getTime();
  if (!isNaN(createdA) && !isNaN(createdB) && createdB !== createdA) {
    return createdB - createdA;
  }

  // 3. Tertiary: compare updatedAt if available
  const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  if (updatedB !== updatedA) {
    return updatedB - updatedA;
  }

  // 4. Natural numeric fallback: compare Form Number descending (e.g., IT26-0182 before IT26-0181)
  return (b.formNumber || '').localeCompare(a.formNumber || '', undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

function getFormsFromLocalStorage(): TransmittalForm[] {
  try {
    const raw = localStorage.getItem(LS_FORMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort(compareTransmittalsNewestFirst);
    }
    return [];
  } catch {
    return [];
  }
}

function saveFormsToLocalStorage(forms: TransmittalForm[]) {
  try {
    const sorted = [...forms].sort(compareTransmittalsNewestFirst);
    localStorage.setItem(STORAGE_INITIALIZED_KEY, 'true');
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(sorted));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Real-time Firestore Listeners - Always Active for All Users
let transmittalsUnsubscribe: Unsubscribe | null = null;
let settingsUnsubscribe: Unsubscribe | null = null;
let isRealtimeListening = false;

function setupFirestoreListeners() {
  if (isRealtimeListening) return;
  isRealtimeListening = true;

  try {
    // 1. Transmittals collection real-time listener (all users share this live)
    const transmittalsColl = collection(db, 'transmittals');
    transmittalsUnsubscribe = onSnapshot(
      transmittalsColl,
      (snapshot) => {
        const forms: TransmittalForm[] = [];
        snapshot.forEach((docSnap) => {
          forms.push(docSnap.data() as TransmittalForm);
        });

        forms.sort(compareTransmittalsNewestFirst);

        saveFormsToLocalStorage(forms);

        // Mirror to IndexedDB
        openDB()
          .then((idb) => {
            const tx = idb.transaction(FORMS_STORE, 'readwrite');
            const store = tx.objectStore(FORMS_STORE);
            store.clear();
            forms.forEach((f) => store.put(f));
          })
          .catch(() => {});

        notifySubscribers();
      },
      (error) => {
        console.warn('Real-time transmittals sync warning:', error);
      }
    );

    // 2. Settings document real-time listener
    const settingsDocRef = doc(db, 'settings', 'main_settings');
    settingsUnsubscribe = onSnapshot(
      settingsDocRef,
      (snap) => {
        if (snap.exists()) {
          const remoteSettings = snap.data() as TransmittalSettings;
          localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(remoteSettings));
          openDB()
            .then((idb) => {
              const tx = idb.transaction(SETTINGS_STORE, 'readwrite');
              tx.objectStore(SETTINGS_STORE).put({ key: 'main_settings', data: remoteSettings });
            })
            .catch(() => {});
          notifySubscribers();
        }
      },
      (error) => {
        console.warn('Real-time settings sync warning:', error);
      }
    );
  } catch (err) {
    console.warn('Could not initialize realtime Firestore listeners:', err);
  }
}

// Start listeners immediately upon script load
setupFirestoreListeners();

export const StorageService = {
  async init(): Promise<void> {
    setupFirestoreListeners();

    try {
      // Check if Firestore already has records
      const snap = await getDocs(collection(db, 'transmittals'));
      if (snap.empty) {
        // If the shared Firebase database is completely fresh, seed default records once
        const hasLocal = localStorage.getItem(STORAGE_INITIALIZED_KEY) === 'true';
        if (!hasLocal) {
          localStorage.setItem(STORAGE_INITIALIZED_KEY, 'true');
          for (const form of SEED_FORMS) {
            await this.saveTransmittal(form);
          }
        }
      } else {
        // Hydrate local cache from live Firestore
        const forms: TransmittalForm[] = [];
        snap.forEach((d) => forms.push(d.data() as TransmittalForm));
        forms.sort(compareTransmittalsNewestFirst);
        saveFormsToLocalStorage(forms);
      }

      // Ensure settings exist in Firestore
      const settingsSnap = await getDoc(doc(db, 'settings', 'main_settings'));
      if (!settingsSnap.exists()) {
        await this.saveSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.warn('Initial Firebase sync check failed, operating with local cache:', err);
    }
  },

  async getTransmittals(): Promise<TransmittalForm[]> {
    // 1. Try Live Firestore First (Guarantees every user sees the latest synchronized version)
    try {
      const snap = await getDocs(collection(db, 'transmittals'));
      const forms: TransmittalForm[] = [];
      snap.forEach((d) => forms.push(d.data() as TransmittalForm));
      forms.sort(compareTransmittalsNewestFirst);
      saveFormsToLocalStorage(forms);
      return forms;
    } catch {
      // Offline fallback: Use IndexedDB then LocalStorage
    }

    try {
      const dbInstance = await openDB();
      return new Promise((resolve) => {
        const tx = dbInstance.transaction(FORMS_STORE, 'readonly');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          let forms = req.result as TransmittalForm[];
          if (!forms || forms.length === 0) {
            forms = getFormsFromLocalStorage();
          }
          forms.sort(compareTransmittalsNewestFirst);
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
      const docSnap = await getDoc(doc(db, 'transmittals', id));
      if (docSnap.exists()) {
        return docSnap.data() as TransmittalForm;
      }
    } catch {}

    const all = await this.getTransmittals();
    return all.find((f) => f.id === id) || null;
  },

  async saveTransmittal(form: TransmittalForm): Promise<TransmittalForm> {
    const updatedForm: TransmittalForm = {
      ...form,
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Save directly to shared Firebase Firestore
    const path = `transmittals/${updatedForm.id}`;
    try {
      const payload: Record<string, any> = {
        ...updatedForm,
        authorId: updatedForm.authorId || auth.currentUser?.uid || 'user',
        authorEmail: updatedForm.authorEmail || auth.currentUser?.email || ''
      };

      // Clean undefined properties
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await setDoc(doc(db, 'transmittals', updatedForm.id), payload);
    } catch (err) {
      console.warn('Direct Firestore save failed, saving to local cache:', err);
    }

    // 2. Mirror into LocalStorage
    const localForms = getFormsFromLocalStorage();
    const existingIdx = localForms.findIndex((f) => f.id === updatedForm.id);
    if (existingIdx >= 0) {
      localForms[existingIdx] = updatedForm;
    } else {
      localForms.unshift(updatedForm);
    }
    saveFormsToLocalStorage(localForms);

    // 3. Mirror into IndexedDB
    try {
      const dbInstance = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = dbInstance.transaction(FORMS_STORE, 'readwrite');
        const store = tx.objectStore(FORMS_STORE);
        const req = store.put(updatedForm);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Could not save to IndexedDB', err);
    }

    notifySubscribers();
    return updatedForm;
  },

  async deleteTransmittal(id: string): Promise<void> {
    // 1. Delete from shared Firebase Firestore
    try {
      await deleteDoc(doc(db, 'transmittals', id));
    } catch (err) {
      console.warn('Direct Firestore delete failed:', err);
    }

    // 2. Remove from LocalStorage
    const localForms = getFormsFromLocalStorage().filter((f) => f.id !== id);
    saveFormsToLocalStorage(localForms);

    // 3. Remove from IndexedDB
    try {
      const dbInstance = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = dbInstance.transaction(FORMS_STORE, 'readwrite');
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
    const ensureTemplates = (s: Partial<TransmittalSettings>): TransmittalSettings => {
      return {
        ...DEFAULT_SETTINGS,
        ...s,
        templates: s.templates && s.templates.length > 0 ? s.templates : DEFAULT_ITEM_TEMPLATES
      };
    };

    try {
      const snap = await getDoc(doc(db, 'settings', 'main_settings'));
      if (snap.exists()) {
        const remoteSettings = snap.data() as TransmittalSettings;
        return ensureTemplates(remoteSettings);
      }
    } catch {}

    try {
      const dbInstance = await openDB();
      return new Promise((resolve) => {
        const tx = dbInstance.transaction(SETTINGS_STORE, 'readonly');
        const store = tx.objectStore(SETTINGS_STORE);
        const req = store.get('main_settings');
        req.onsuccess = () => {
          if (req.result?.data) {
            resolve(ensureTemplates(req.result.data));
          } else {
            const raw = localStorage.getItem(LS_SETTINGS_KEY);
            resolve(raw ? ensureTemplates(JSON.parse(raw)) : DEFAULT_SETTINGS);
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem(LS_SETTINGS_KEY);
          resolve(raw ? ensureTemplates(JSON.parse(raw)) : DEFAULT_SETTINGS);
        };
      });
    } catch {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      return raw ? ensureTemplates(JSON.parse(raw)) : DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: TransmittalSettings): Promise<TransmittalSettings> {
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}

    try {
      const dbInstance = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = dbInstance.transaction(SETTINGS_STORE, 'readwrite');
        const store = tx.objectStore(SETTINGS_STORE);
        const req = store.put({ key: 'main_settings', data: settings });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to save settings to IndexedDB', err);
    }

    // Save directly to shared Firestore
    try {
      const payload: Record<string, any> = {
        ...settings,
        updatedAt: new Date().toISOString()
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      await setDoc(doc(db, 'settings', 'main_settings'), payload);
    } catch (err) {
      console.warn('Direct Firestore save settings failed:', err);
    }

    notifySubscribers();
    return settings;
  },

  async generateNextFormNumber(locationType: SignatoryLocationType = 'HO'): Promise<string> {
    const forms = await this.getTransmittals();
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `${locationType}${currentYear}-`;

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
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        company: settings.companyName,
        forms,
        settings
      },
      null,
      2
    );
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

  async deleteAllTransmittals(): Promise<void> {
    const current = await this.getTransmittals();
    for (const f of current) {
      await this.deleteTransmittal(f.id);
    }
    saveFormsToLocalStorage([]);
    try {
      const dbInstance = await openDB();
      const tx = dbInstance.transaction(FORMS_STORE, 'readwrite');
      tx.objectStore(FORMS_STORE).clear();
    } catch {}
    notifySubscribers();
  },

  async resetToSampleData(): Promise<void> {
    for (const seed of SEED_FORMS) {
      await this.saveTransmittal(seed);
    }
    notifySubscribers();
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
