/**
 * Transmittal Data Models & Types
 */

export interface TransmittalItem {
  qty: number;
  description: string;
}

export type SignatoryLocationType = 'HO' | 'BR'; // Head Office vs Branch

export interface TransmittalForm {
  id: string;
  formNumber: string;               // e.g. IT26-0181 or HO26-001
  date: string;                     // ISO Date string (defaults to today)
  purpose: string;                  // e.g., "PRINTER INK FOR BAYAMBANG"
  remarks: string;                  // Detailed notes or instructions (e.g., "BAYAMBANG")
  dropTo?: string;                  // Drop-off point / courier (e.g. "VILLASIS")
  branchName?: string;              // Target branch name (e.g. "BAYAMBANG")
  items: TransmittalItem[];          // List of items (min 1, typically up to 9 items)
  
  // 4 Signatory Blocks
  fromName: string;
  fromDesignation: string;
  fromType: SignatoryLocationType;  // HO (Head Office) or BR (Branch)
  fromDate?: string;
  
  deliveredToName: string;
  deliveredToDesignation: string;
  deliveredToType: SignatoryLocationType;
  deliveredDate?: string;
  
  notedByName: string;
  notedByDesignation: string;
  notedByType: SignatoryLocationType;
  notedDate?: string;
  
  receivedByName: string;
  receivedByDesignation: string;
  receivedByType: SignatoryLocationType;
  receivedDate?: string;
  
  completeDelivery: boolean;        // Delivery completion checkbox
  incompleteReason?: string;        // If NO reason
  hardCopyUrl?: string;             // Scanned signed document attachment URL
  authorId?: string;
  authorEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransmittalSettings {
  companyName: string;              // "MICROBASE MOTORBIKE CORP"
  companyAddress: string;           // "MMC Complex, TASCOR Compound, Anabu 1-C, Imus Cavite"
  companyContact: string;           // "TEL: (046) 875-3286 | EMAIL: INFO@MMCMOTORCYCLES.COM"
  companyLogoUrl?: string;
  defaultFromName: string;
  defaultFromType: SignatoryLocationType;
  defaultNotedByName: string;
  defaultNotedByType: SignatoryLocationType;
  quickNamesPreset: string[];       // Quick-click names for fast entry
}

export interface FilterOptions {
  searchQuery: string;
  status: 'all' | 'pending' | 'completed' | 'has_hardcopy';
  locationType: 'all' | 'HO' | 'BR';
  dateFrom: string;
  dateTo: string;
  purpose: string;
}

export type PrintMode = 'full-page' | 'dual-copy'; // Full letter/A4 vs 2-in-1 half sheet (Original + Duplicate)
