# Security Specification & Test Definitions

## 1. Data Invariants
- **Transmittals (`/transmittals/{transmittalId}`)**:
  - Requires authenticated access (`request.auth != null`).
  - Document ID `{transmittalId}` must be a valid alphanumeric/hyphen ID up to 128 characters (`isValidId`).
  - Transmittal payload must conform to `isValidTransmittal`:
    - `formNumber` is a string (up to 64 chars).
    - `date` is a string (up to 32 chars).
    - `purpose` is a string (up to 500 chars).
    - `items` is a non-empty array with max 50 items, where each item is a valid map with positive quantity and non-empty description.
    - `fromName` and `fromType` are required strings with length constraints and valid enum values ('HO' | 'BR').
    - Immutable identity tracking: Author cannot spoof author ID upon creation, and cannot change `id`, `formNumber`, or `authorId` upon update.
- **Settings (`/settings/{settingId}`)**:
  - Readable by authenticated users.
  - Writable only by authenticated users (or admin).
  - Conforms to `isValidSettings`: `companyName`, `companyAddress`, `companyContact` are bounded strings.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Read/Write**: Attempt to list or create transmittals without `request.auth`.
2. **Path Traversal / Malformed Document ID**: Attempt to write to `/transmittals/../../../etc/passwd` or oversized ID (> 128 chars).
3. **Ghost / Shadow Field Injection**: Attempt to create a transmittal with an unauthorized field (`isAdmin: true`, `__proto__`, etc.).
4. **Author Spoofing**: Attempt to create a transmittal where `authorId` does not match `request.auth.uid`.
5. **Array Bomb / Denial-of-Wallet Attack**: Attempt to save an `items` array with 50,000 elements.
6. **Oversized String / Memory Attack**: Attempt to set `purpose` with 5MB text.
7. **Invalid Signatory Enum**: Attempt to inject `fromType: "HACKER_ROLE"`.
8. **Negative Quantity Poisoning**: Attempt to specify `qty: -999` in items.
9. **Tampering with Immutable Creation Fields**: Attempt to mutate `authorId` or `createdAt` on an existing transmittal.
10. **State Corruption on Terminal Transmittal**: Attempting to un-complete or alter closed records without permissions.
11. **Settings Resource Poisoning**: Attempt to write 2MB malicious script in `companyName`.
12. **Blanket Query Scraping**: Attempting an unrestricted collection query without proper filter boundaries.
