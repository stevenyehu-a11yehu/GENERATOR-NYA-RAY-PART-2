const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const ROMAN_MONTHS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
];

/**
 * Format a YYYY-MM-DD string to Indonesian formatted date "DD MMMM YYYY"
 * Example: "1997-05-22" -> "22 Mei 1997"
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(monthIdx) || isNaN(day)) return dateStr;
  if (monthIdx < 0 || monthIdx > 11) return dateStr;

  return `${day} ${INDONESIAN_MONTHS[monthIdx]} ${year}`;
}

/**
 * Parse Indonesian formatted date back to YYYY-MM-DD if possible
 */
export function parseIndonesianDateToIso(formatted: string): string {
  if (!formatted) return '';
  const parts = formatted.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const monthName = parts[1];
    const year = parts[2];
    const monthIdx = INDONESIAN_MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase()
    );
    if (monthIdx !== -1) {
      const month = String(monthIdx + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return '';
}

/**
 * Calculate age based on birth date and reference date (defaulting to today or recommendation date)
 */
export function calculateAge(birthDateStr: string, refDateStr?: string): number {
  if (!birthDateStr) return 0;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 0;

  const ref = refDateStr ? new Date(refDateStr) : new Date();
  if (isNaN(ref.getTime())) return 0;

  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Get Roman numeral for a month (1-based, 1 = I, 9 = IX, etc.)
 */
export function getRomanMonth(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) return 'I';
  return ROMAN_MONTHS[monthNumber - 1];
}

/**
 * Get month number from Roman numeral
 */
export function getMonthFromRoman(roman: string): number {
  const clean = roman.trim().toUpperCase();
  const idx = ROMAN_MONTHS.indexOf(clean);
  return idx !== -1 ? idx + 1 : 0;
}

/**
 * Add days to ISO date string (YYYY-MM-DD)
 */
export function addDaysToIso(dateStr: string, days: number): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  date.setDate(date.getDate() + days);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
