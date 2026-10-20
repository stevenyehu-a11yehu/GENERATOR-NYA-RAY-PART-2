import { getRomanMonth, getMonthFromRoman } from './dateUtils';
import { SipValidationResult } from '../types';

export interface SipOptions {
  prefix?: string; // 'B'
  classification?: string; // '500.16.7.2'
  registrationCode?: string; // e.g. '34.043.'
  date?: string; // YYYY-MM-DD
  agency?: string; // 'DPMPTSPTK' | 'DPMPTSP' | 'DINKES'
}

/**
 * Common agencies in Indonesian regional licensing
 */
export const AGENCIES = [
  { id: 'DPMPTSPTK', label: 'DPMPTSPTK (Sesuai PDF Asli)' },
  { id: 'DPMPTSP', label: 'DPMPTSP (Dinas Penanaman Modal & PTSP)' },
  { id: 'DINKES', label: 'DINKES (Dinas Kesehatan)' },
];

/**
 * Standard classification codes for medical practices (Permendagri/Kemenkes)
 */
export const CLASSIFICATIONS = [
  { code: '500.16.7.2', label: '500.16.7.2 - SIP Dokter Umum (Sesuai PDF)' },
  { code: '500.16.7.1', label: '500.16.7.1 - SIP Dokter Spesialis' },
  { code: '500.16.7.3', label: '500.16.7.3 - SIP Dokter Gigi' },
  { code: '446.1', label: '446.1 - Kode SIP Standar Dinkes Tradisional' },
];

/**
 * Generate a valid SIP string matching the format:
 * B/500.16.7.2/34.043./IX/2026/DPMPTSPTK
 */
export function generateSipNumber(options: SipOptions = {}): string {
  const prefix = options.prefix || 'B';
  const classification = options.classification || '500.16.7.2';
  
  // Registration: e.g. '34.043.' (province/city code + 3 digit sequence + dot)
  let reg = options.registrationCode;
  if (!reg) {
    const regionCode = Math.floor(10 + Math.random() * 89); // e.g. 34
    const seqCode = String(Math.floor(10 + Math.random() * 890)).padStart(3, '0'); // e.g. 043
    reg = `${regionCode}.${seqCode}.`;
  } else if (!reg.endsWith('.')) {
    reg = `${reg}.`;
  }

  // Determine Roman month and year
  let romanMonth = 'IX';
  let year = '2026';

  if (options.date) {
    const parts = options.date.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y)) year = String(y);
      if (!isNaN(m)) romanMonth = getRomanMonth(m);
    }
  }

  const agency = options.agency || 'DPMPTSPTK';

  return `${prefix}/${classification}/${reg}/${romanMonth}/${year}/${agency}`;
}

/**
 * Validate a SIP string against the standard Halodoc & Indonesian Health Dept format:
 * Pattern: Prefix / Classification / Registration / RomanMonth / Year / Agency
 * Example: B/500.16.7.2/34.043./IX/2026/DPMPTSPTK
 */
export function validateSipNumber(sip: string, referenceDate?: string): SipValidationResult {
  const trimmed = sip.trim();
  const issues: string[] = [];

  if (!trimmed) {
    return {
      isValid: false,
      issues: ['Nomor izin praktik (SIP) tidak boleh kosong.'],
      parts: {},
      matchesDate: false,
    };
  }

  const parts = trimmed.split('/');
  // Expected exactly 6 segments separated by '/'
  // [0]: Prefix (e.g. B)
  // [1]: Classification (e.g. 500.16.7.2)
  // [2]: Registration (e.g. 34.043.)
  // [3]: Roman Month (e.g. IX)
  // [4]: Year (e.g. 2026)
  // [5]: Agency (e.g. DPMPTSPTK)

  if (parts.length !== 6) {
    issues.push(
      `Format harus terdiri dari 6 bagian dipisahkan tanda garis miring (/). Terdeteksi: ${parts.length} bagian.`
    );
  }

  const prefix = parts[0] || '';
  const classification = parts[1] || '';
  const registration = parts[2] || '';
  const romanMonth = parts[3] || '';
  const year = parts[4] || '';
  const agency = parts[5] || '';

  // Validate prefix
  if (!/^[A-Z]{1,3}$/.test(prefix)) {
    issues.push(`Awalan surat '${prefix}' tidak standar (umumnya 'B' untuk surat biasa/izin).`);
  }

  // Validate classification
  if (!/^(\d{3}(\.\d{1,2})+|\d{3}\.\d+)$/.test(classification)) {
    issues.push(`Kode klasifikasi '${classification}' harus berupa kode angka berformat seperti 500.16.7.2`);
  }

  // Validate registration
  if (!/^\d{2,4}\.\d{3,4}\.?$/.test(registration)) {
    issues.push(`Nomor registrasi '${registration}' harus berupa kode wilayah dan nomor urut (contoh: 34.043.)`);
  }

  // Validate Roman month
  const monthNum = getMonthFromRoman(romanMonth);
  if (monthNum === 0) {
    issues.push(`Bulan '${romanMonth}' bukan angka Romawi yang valid (I sampai XII).`);
  }

  // Validate year
  if (!/^(19|20)\d{2}$/.test(year)) {
    issues.push(`Tahun '${year}' harus 4 digit tahun yang valid.`);
  }

  // Validate agency
  if (!/^[A-Z0-9\.\-]{3,15}$/.test(agency)) {
    issues.push(`Instansi penerbit '${agency}' harus berupa singkatan huruf kapital (contoh: DPMPTSPTK).`);
  }

  // Check matching with referenceDate if provided
  let matchesDate = true;
  let dateMismatchMessage: string | undefined;

  if (referenceDate) {
    const dateParts = referenceDate.split('-');
    if (dateParts.length === 3) {
      const refYear = dateParts[0];
      const refMonthNum = parseInt(dateParts[1], 10);
      const expectedRoman = getRomanMonth(refMonthNum);

      const yearMismatch = year !== refYear;
      const monthMismatch = monthNum !== refMonthNum;

      if (yearMismatch || monthMismatch) {
        matchesDate = false;
        dateMismatchMessage = `Bulan/tahun pada SIP (${romanMonth}/${year}) tidak sinkron dengan Tanggal Rekomendasi Terbit (${expectedRoman}/${refYear}).`;
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    parts: {
      prefix,
      classification,
      registration,
      romanMonth,
      year,
      agency,
    },
    matchesDate,
    dateMismatchMessage,
  };
}

/**
 * Synchronize an existing or draft SIP with a given reference date
 */
export function syncSipWithDate(currentSip: string, date: string): string {
  const parts = currentSip.trim().split('/');
  const dateParts = date.split('-');
  if (dateParts.length !== 3) return currentSip;

  const y = dateParts[0];
  const m = parseInt(dateParts[1], 10);
  const roman = getRomanMonth(m);

  if (parts.length === 6) {
    parts[3] = roman;
    parts[4] = y;
    return parts.join('/');
  }

  // If malformed, regenerate fresh with matching date
  return generateSipNumber({ date });
}
