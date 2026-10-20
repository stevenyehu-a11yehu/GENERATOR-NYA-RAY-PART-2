export interface CertificateData {
  // Pasien
  patientName: string;
  birthDate: string; // YYYY-MM-DD for picker
  birthDateFormatted: string; // "22 Mei 1997"
  birthDateLabel: string; // "Tangal Lahir" or "Tanggal Lahir"
  gender: 'Male' | 'Female' | 'Pria' | 'Wanita';
  age: number | string;

  // Catatan Dokter
  recommendationDate: string; // YYYY-MM-DD
  recommendationDateFormatted: string; // "29 September 2026"
  diagnosis: string;
  diagnosisExplanation: string; // default standard paragraph
  restStartDate: string; // YYYY-MM-DD
  restStartDateFormatted: string; // "29 September 2026"
  restEndDate: string; // YYYY-MM-DD
  restEndDateFormatted: string; // "29 September 2026"
  closingNote: string;

  // Dokter
  doctorName: string;
  doctorSpecialty: string;
  doctorSip: string; // e.g. "B/500.16.7.2/34.043./IX/2026/DPMPTSPTK"

  // Footer & Branding
  phone: string;
  website: string;
  showWatermark: boolean;
  watermarkOpacity: number;
  watermarkSize?: number;
  customWatermarkUrl?: string;
  logoPosition: 'right' | 'left';
  logoHeight: number;
  customLogoUrl?: string;
  footerSpacing?: number;
}

export interface SipValidationResult {
  isValid: boolean;
  issues: string[];
  parts: {
    prefix?: string;
    classification?: string;
    registration?: string;
    romanMonth?: string;
    year?: string;
    agency?: string;
  };
  matchesDate: boolean;
  dateMismatchMessage?: string;
}
