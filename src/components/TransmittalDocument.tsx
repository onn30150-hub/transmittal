import React from 'react';
import { TransmittalForm, TransmittalSettings } from '../types/transmittal';

interface Props {
  form: TransmittalForm;
  settings: TransmittalSettings;
  copyLabel?: string;
  watermarkType?: 'head-office' | 'branch' | 'none';
  isCompact?: boolean;
}

export const TransmittalDocument: React.FC<Props> = ({
  form,
  settings,
  copyLabel = 'HEAD OFFICE COPY',
  watermarkType,
  isCompact = true
}) => {
  // Determine watermark text
  const determinedWatermark = watermarkType
    ? watermarkType === 'head-office'
      ? 'HEAD OFFICE COPY'
      : watermarkType === 'branch'
      ? 'BRANCH COPY'
      : ''
    : copyLabel.toUpperCase().includes('HEAD')
    ? 'HEAD OFFICE COPY'
    : 'BRANCH COPY';

  // Format date as M/D/YYYY to match sample: 9/19/2026
  const formDate = new Date(form.date);
  const formattedDate = !isNaN(formDate.getTime())
    ? `${formDate.getMonth() + 1}/${formDate.getDate()}/${formDate.getFullYear()}`
    : form.date;

  // Ensure consistent table height: 7 rows for 2-in-1 half-sheet (8.5"x6.5"), 14 rows for full 8.5"x13" page
  const minRows = isCompact ? 7 : 14;
  const items = form.items || [];
  const emptyRowsCount = Math.max(0, minRows - items.length);

  // Checkbox square helper
  const renderCheckSquare = (checked: boolean) => (
    <span className="inline-block w-3 h-3 border border-black align-middle mr-1.5 relative shrink-0 bg-white">
      {checked && (
        <span className="absolute inset-0 bg-black m-[1px]" />
      )}
    </span>
  );

  return (
    <div
      className={`bg-white text-black font-sans relative border-2 border-black select-text overflow-hidden ${
        isCompact ? 'text-[10px] leading-tight' : 'text-[11px] leading-snug'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* 70% Transparent Watermark across the form */}
      {determinedWatermark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 overflow-hidden"
          style={{ opacity: 0.3 }}
        >
          <span
            className="text-black font-black tracking-[0.25em] whitespace-nowrap text-3xl sm:text-4xl md:text-5xl uppercase transform -rotate-18 print:text-black"
            style={{ letterSpacing: '0.22em' }}
          >
            {determinedWatermark}
          </span>
        </div>
      )}

      {/* Form Content (relative to stay on top of watermark) */}
      <div className="relative z-10">
        {/* ROW 1: Header (Company info & Logo on left, Transmittal # box on right) */}
        <div className="flex border-b-2 border-black">
          {/* Left: Logo & Company Address */}
          <div className="flex-1 p-2 flex items-center justify-center gap-3 text-center">
            <img
              src={settings.companyLogoUrl || '/logo.png'}
              alt={settings.companyName || 'Logo'}
              className="w-12 h-12 object-contain shrink-0"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fb = target.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-red-700 text-white hidden items-center justify-center font-black text-sm rounded shrink-0">
              MMC
            </div>
            <div className="text-center">
              <h1 className="font-extrabold text-sm sm:text-base uppercase tracking-tight text-black font-sans leading-none mb-1 text-center">
                {settings.companyName || 'MICROBASE MOTORBIKE CORPORATION'}
              </h1>
              <p className="text-[9px] text-black leading-tight text-center">
                {settings.companyAddress || 'MMC Complex, TASCOR Compound, Pag-Asa St., Anabu 1-C, Imus Cavite'}
              </p>
              <p className="text-[8.5px] text-black leading-tight mt-0.5 text-center">
                {settings.companyContact || 'Contact: (046) 875-3286 • E-mail: info@mmcmotorcycles.com'}
              </p>
            </div>
          </div>

          {/* Right: TRANSMITTAL FORM #: TF#: IT26-XXXX */}
          <div className="w-48 sm:w-56 border-l-2 border-black flex flex-col shrink-0">
            <div className="bg-black text-white text-center py-1 text-[9px] font-bold tracking-wider uppercase">
              TRANSMITTAL FORM #:
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 bg-white">
              <span className="font-black text-xs text-black uppercase">TF#:</span>
              <span className="font-black text-base sm:text-lg text-red-600 font-mono tracking-wider">
                {form.formNumber}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: TRANSMITTAL FORM Banner + Date Created */}
        <div className="flex border-b-2 border-black bg-white">
          <div className="flex-1 text-center py-1 font-black text-xs sm:text-sm tracking-[0.3em] uppercase">
            T R A N S M I T T A L &nbsp; F O R M
          </div>
          <div className="w-48 sm:w-56 border-l-2 border-black text-center py-1 font-bold text-[9px] uppercase flex items-center justify-center tracking-wider">
            DATE CREATED:&nbsp;<span className="font-black">{formattedDate}</span>
          </div>
        </div>

        {/* ROW 3: PURPOSE */}
        <div className="flex border-b-2 border-black">
          <div className="bg-black text-white px-3 py-1 text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center shrink-0 w-24 sm:w-28">
            PURPOSE:
          </div>
          <div className="flex-1 px-3 py-1 font-bold text-[11px] uppercase tracking-wide flex items-center text-black">
            {form.purpose || 'EQUIPMENT & DOCUMENT TRANSMITTAL'}
          </div>
        </div>

        {/* ROW 4: Table (QTY | DESCRIPTION | REMARKS) */}
        <div className="border-b-2 border-black">
          {/* Table Header */}
          <div className="flex border-b border-black text-[9px] font-black uppercase text-center bg-white">
            <div className="w-16 border-r border-black py-0.5 shrink-0">QTY</div>
            <div className="flex-1 border-r border-black py-0.5">DESCRIPTION</div>
            <div className="w-48 sm:w-56 shrink-0 py-0.5">REMARKS</div>
          </div>

          {/* Table Content: Left side rows (Qty + Description), Right side Remarks with aligned dividers */}
          <div className="flex">
            {/* Left Items Column (Qty + Description) */}
            <div className="flex-1 flex flex-col divide-y divide-black border-r border-black">
              {items.map((item, idx) => (
                <div key={idx} className="flex h-[26px] items-center text-[10px]">
                  <div className="w-16 border-r border-black text-center font-bold py-0.5 self-stretch flex items-center justify-center shrink-0">
                    {item.qty}
                  </div>
                  <div className="flex-1 px-2 font-bold uppercase py-0.5 truncate">
                    {item.description}
                  </div>
                </div>
              ))}

              {/* Empty filler rows for authentic spacing */}
              {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                <div key={`empty-${idx}`} className="flex h-[26px] items-center text-[10px]">
                  <div className="w-16 border-r border-black text-center py-0.5 self-stretch flex items-center justify-center text-transparent shrink-0">
                    -
                  </div>
                  <div className="flex-1 px-2 py-0.5 text-transparent">
                    -
                  </div>
                </div>
              ))}
            </div>

            {/* Right REMARKS Column with aligned divider and prominent DROP TO */}
            <div className="w-48 sm:w-56 shrink-0 flex flex-col text-center bg-white/40">
              {/* Row 1: DROP TO with increased font size and aligned horizontal divider */}
              <div className="h-[26px] border-b border-black px-2 flex items-center text-left">
                <span className="font-black text-xs sm:text-[13px] uppercase tracking-tight text-black truncate">
                  {form.dropTo ? `DROP TO: ${form.dropTo}` : ''}
                </span>
              </div>

              {/* Remaining space: Centered Destination Branch / Remarks */}
              <div className="flex-1 flex items-center justify-center p-2">
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black block">
                  {form.branchName || form.remarks || ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 5: 4 Signatory Blocks (2x2 Grid) */}
        <div className="grid grid-cols-2 border-b-2 border-black divide-x-2 divide-black">
          {/* Top Left: FROM */}
          <div className="p-2 flex flex-col justify-between border-b-2 border-black min-h-[96px] bg-white">
            <div className="font-black text-[9.5px] uppercase tracking-wide text-black mb-1">
              FROM:
            </div>

            <div className="space-y-1.5 my-auto">
              {/* Row 1: Head Office & Department */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.fromType === 'HO' || !form.fromType)}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  HEAD OFFICE &amp; DEPARTMENT:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {(form.fromType === 'HO' || !form.fromType) && (form.fromName || 'EARL LIAN NAZAIRE') && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.fromName || 'EARL LIAN NAZAIRE'}
                      </span>
                    )}
                  </div>
                  {(form.fromType === 'HO' || !form.fromType) ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Row 2: Branch / OIC Name */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.fromType === 'BR')}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  BRANCH/OIC NAME:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {form.fromType === 'BR' && (form.fromName || 'EARL LIAN NAZAIRE') && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.fromName || 'EARL LIAN NAZAIRE'}
                      </span>
                    )}
                  </div>
                  {form.fromType === 'BR' ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-[8px] font-black uppercase text-black tracking-tight mt-1">
              DATE PREPARED &amp; SIGNED
            </div>
          </div>

          {/* Top Right: DELIVERED TO */}
          <div className="p-2 flex flex-col justify-between border-b-2 border-black min-h-[96px] bg-white">
            <div className="font-black text-[9.5px] uppercase tracking-wide text-black mb-1">
              DELIVERED TO:
            </div>

            <div className="space-y-1.5 my-auto">
              {/* Row 1: Head Office & Department */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.deliveredToType === 'HO')}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  HEAD OFFICE &amp; DEPARTMENT:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {form.deliveredToType === 'HO' && form.deliveredToName && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.deliveredToName}
                      </span>
                    )}
                  </div>
                  {form.deliveredToType === 'HO' ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Row 2: Branch / AM Name */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.deliveredToType === 'BR' || !form.deliveredToType)}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  BRANCH/AM NAME:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {(form.deliveredToType === 'BR' || !form.deliveredToType) && form.deliveredToName && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.deliveredToName}
                      </span>
                    )}
                  </div>
                  {(form.deliveredToType === 'BR' || !form.deliveredToType) ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-[8px] font-black uppercase text-black tracking-tight mt-1">
              DATE DELIVERED &amp; SIGNED
            </div>
          </div>

          {/* Bottom Left: NOTED BY */}
          <div className="p-2 flex flex-col justify-between min-h-[96px] bg-white">
            <div className="font-black text-[9.5px] uppercase tracking-wide text-black mb-1">
              NOTED BY:
            </div>

            <div className="space-y-1.5 my-auto">
              {/* Row 1: Head Office & Department */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.notedByType === 'HO' || !form.notedByType)}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  HEAD OFFICE &amp; DEPARTMENT:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {(form.notedByType === 'HO' || !form.notedByType) && (form.notedByName || 'MARCO SAN MATEO') && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.notedByName || 'MARCO SAN MATEO'}
                      </span>
                    )}
                  </div>
                  {(form.notedByType === 'HO' || !form.notedByType) ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Row 2: Branch / OIC Name */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.notedByType === 'BR')}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  BRANCH/OIC NAME:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {form.notedByType === 'BR' && (form.notedByName || 'MARCO SAN MATEO') && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.notedByName || 'MARCO SAN MATEO'}
                      </span>
                    )}
                  </div>
                  {form.notedByType === 'BR' ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-[8px] font-black uppercase text-black tracking-tight mt-1">
              DATE APPROVED &amp; SIGNED
            </div>
          </div>

          {/* Bottom Right: RECEIVED BY */}
          <div className="p-2 flex flex-col justify-between min-h-[96px] bg-white">
            <div className="font-black text-[9.5px] uppercase tracking-wide text-black mb-1">
              RECEIVED BY:
            </div>

            <div className="space-y-1.5 my-auto">
              {/* Row 1: Head Office & Department */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.receivedByType === 'HO')}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  HEAD OFFICE &amp; DEPARTMENT:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {form.receivedByType === 'HO' && form.receivedByName && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.receivedByName}
                      </span>
                    )}
                  </div>
                  {form.receivedByType === 'HO' ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Row 2: Branch / OIC Name */}
              <div className="flex items-center text-[8.5px] font-bold">
                {renderCheckSquare(form.receivedByType === 'BR' || !form.receivedByType)}
                <span className="shrink-0 uppercase font-black tracking-tight">
                  BRANCH/OIC NAME:
                </span>
                <div className="flex-1 ml-1.5 relative">
                  <div className="border-b border-black w-full relative h-[18px] flex items-end justify-center">
                    {(form.receivedByType === 'BR' || !form.receivedByType) && form.receivedByName && (
                      <span className="font-black text-[9.5px] uppercase tracking-wider text-black">
                        {form.receivedByName}
                      </span>
                    )}
                  </div>
                  {(form.receivedByType === 'BR' || !form.receivedByType) ? (
                    <div className="text-[6.5px] font-black text-black uppercase text-center tracking-tight leading-none mt-0.5">
                      SIGNATURE OVER PRINTED NAME
                    </div>
                  ) : (
                    <div className="h-[9px]" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-[8px] font-black uppercase text-black tracking-tight mt-1">
              DATE RECEIVED &amp; SIGNED
            </div>
          </div>
        </div>

        {/* ROW 6: COMPLETE DELIVERY: YES / NO / If NO */}
        <div className="px-3 py-1.5 flex items-center text-[9.5px] font-black bg-white">
          <span className="uppercase tracking-wide mr-8 font-black text-black">
            COMPLETE DELIVERY:
          </span>
          <span className="uppercase mr-8 font-black text-black">
            YES
          </span>
          <span className="uppercase mr-8 font-black text-black">
            NO
          </span>
          <div className="flex items-center flex-1 max-w-sm">
            <span className="italic font-bold uppercase shrink-0 mr-2 text-black">
              If NO
            </span>
            <div className="border-b-2 border-black flex-1 min-h-[16px] flex items-center px-2">
              {form.incompleteReason && (
                <span className="text-[9px] font-bold text-black uppercase">
                  {form.incompleteReason}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
