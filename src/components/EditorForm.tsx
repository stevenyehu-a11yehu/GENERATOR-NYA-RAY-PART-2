import React, { useState, useMemo, useRef } from 'react';
import { CertificateData } from '../types';
import { HalodocLogo } from './HalodocLogo';
import {
  formatIndonesianDate,
  calculateAge,
  addDaysToIso,
} from '../utils/dateUtils';
import {
  generateSipNumber,
  validateSipNumber,
  syncSipWithDate,
} from '../utils/sipGenerator';
import {
  User,
  Calendar,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  FileText,
  Sliders,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlignLeft,
  AlignRight,
} from 'lucide-react';

interface EditorFormProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
  onResetToSample: () => void;
}

const COMMON_DIAGNOSES = [
  'Demam Tinggi dan Radang Tenggorokan',
  'ISPA (Infeksi Saluran Pernapasan Akut)',
  'Dispepsia Akut (Gastritis)',
  'Gastroenteritis Akut (GEA)',
  'Cephalea / Tension Headache',
  'Fatique & Kelelahan Fisik Berat',
  'Common Cold / Influenza Like Illness',
  'Vertigo Perifer',
];

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onChange,
  onResetToSample,
}) => {
  const [activeTab, setActiveTab] = useState<'pasien' | 'catatan' | 'dokter' | 'logo'>('pasien');
  const [showSipDetails, setShowSipDetails] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);

  // Validate SIP live against current recommendation date
  const sipValidation = useMemo(() => {
    return validateSipNumber(data.doctorSip, data.recommendationDate);
  }, [data.doctorSip, data.recommendationDate]);

  // Handle Birth Date Change -> Auto calculate Age & format Indonesian date
  const handleBirthDateChange = (isoDate: string) => {
    const formatted = formatIndonesianDate(isoDate);
    const computedAge = calculateAge(isoDate, data.recommendationDate);

    onChange({
      ...data,
      birthDate: isoDate,
      birthDateFormatted: formatted,
      age: computedAge,
    });
  };

  // Handle Recommendation Date Change -> Auto recalculate age & link dates
  const handleRecommendationDateChange = (isoDate: string) => {
    const formatted = formatIndonesianDate(isoDate);

    const isLinked = data.restStartDate === data.recommendationDate;
    const newRestStart = isLinked ? isoDate : data.restStartDate;
    const newRestStartFormatted = isLinked ? formatted : data.restStartDateFormatted;

    const computedAge = data.birthDate
      ? calculateAge(data.birthDate, isoDate)
      : data.age;

    onChange({
      ...data,
      recommendationDate: isoDate,
      recommendationDateFormatted: formatted,
      restStartDate: newRestStart,
      restStartDateFormatted: newRestStartFormatted,
      age: computedAge,
    });
  };

  // Handle Rest Duration Quick Set (e.g. 1 day, 2 days, 3 days)
  const handleSetRestDuration = (days: number) => {
    const startIso = data.restStartDate || data.recommendationDate;
    if (!startIso) return;

    const endIso = addDaysToIso(startIso, days - 1);
    onChange({
      ...data,
      restStartDate: startIso,
      restStartDateFormatted: formatIndonesianDate(startIso),
      restEndDate: endIso,
      restEndDateFormatted: formatIndonesianDate(endIso),
    });
  };

  // Generator Action: Generate Fresh SIP
  const handleGenerateSip = () => {
    const newSip = generateSipNumber({
      classification: '500.16.7.2',
      date: data.recommendationDate,
      agency: 'DPMPTSPTK',
    });
    onChange({
      ...data,
      doctorSip: newSip,
    });
  };

  // Fix Action: Auto-sync existing SIP's Roman Month & Year with recommendation date
  const handleAutoSyncSip = () => {
    const fixedSip = syncSipWithDate(data.doctorSip, data.recommendationDate);
    onChange({
      ...data,
      doctorSip: fixedSip,
    });
  };

  // File Upload Handlers
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, SVG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        ...data,
        customLogoUrl: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleWatermarkFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid untuk watermark (PNG, SVG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        ...data,
        customWatermarkUrl: e.target?.result as string,
        showWatermark: true,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pasien')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'pasien'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informasi Pasien</span>
        </button>

        <button
          onClick={() => setActiveTab('catatan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'catatan'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Catatan & Rekomendasi</span>
        </button>

        <button
          onClick={() => setActiveTab('dokter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'dokter'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Dokter & SIP</span>
          {!sipValidation.isValid ? (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'logo'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Upload Logo & Branding</span>
          {data.customLogoUrl && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* ================= TAB 1: INFORMASI PASIEN ================= */}
        {activeTab === 'pasien' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Data Identitas Pasien
                </h3>
                <p className="text-xs text-slate-500">
                  Umur dihitung otomatis saat tanggal lahir diisi, dan tetap dapat disesuaikan manual.
                </p>
              </div>
            </div>

            {/* Nama Pasien */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Pasien
              </label>
              <input
                type="text"
                value={data.patientName}
                onChange={(e) => onChange({ ...data, patientName: e.target.value })}
                placeholder="Contoh: Ray Orlando"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium transition-all"
              />
            </div>

            {/* Tanggal Lahir & Label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Pilih Tanggal Lahir
                  </label>
                  <span className="text-[11px] text-rose-600 font-medium">Auto-kalkulasi Umur</span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={data.birthDate}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teks Tanggal Lahir di Surat
                </label>
                <input
                  type="text"
                  value={data.birthDateFormatted}
                  onChange={(e) => onChange({ ...data, birthDateFormatted: e.target.value })}
                  placeholder="22 Mei 1997"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Gender & Umur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender / Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Male', 'Female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onChange({ ...data, gender: g })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        data.gender === g
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={data.gender}
                    onChange={(e) => onChange({ ...data, gender: e.target.value as any })}
                    placeholder="Atau ketik manual: Male / Female / Pria / Wanita"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Umur Pasien (Tahun)
                  </label>
                  <span className="text-[11px] text-emerald-600 font-medium">Bisa diedit manual</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={data.age}
                    onChange={(e) => onChange({ ...data, age: e.target.value })}
                    placeholder="29"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Secara default otomatis dihitung dari selisih tahun lahir ke tanggal rekomendasi.
                </p>
              </div>
            </div>

            {/* Opsi ejaan label di surat */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-700">Format Label Tanggal Lahir:</span>
                <span className="text-xs text-slate-500 ml-2">PDF asli menuliskan "Tangal Lahir" (1 huruf 'g')</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, birthDateLabel: 'Tangal Lahir' })}
                  className={`px-2.5 py-1 text-xs rounded-lg border ${
                    data.birthDateLabel === 'Tangal Lahir'
                      ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  "Tangal Lahir" (Asli PDF)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...data, birthDateLabel: 'Tanggal Lahir' })}
                  className={`px-2.5 py-1 text-xs rounded-lg border ${
                    data.birthDateLabel === 'Tanggal Lahir'
                      ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  "Tanggal Lahir" (Baku)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CATATAN & REKOMENDASI ================= */}
        {activeTab === 'catatan' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Catatan Dokter & Tanggal Istirahat
              </h3>
              <p className="text-xs text-slate-500">
                Atur tanggal rekomendasi terbit dan rentang tanggal rekomendasi istirahat pasien.
              </p>
            </div>

            {/* Tanggal Rekomendasi Terbit */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  Tanggal Rekomendasi Terbit
                </label>
                <span className="text-[11px] text-slate-500">Sesuai teks "Tanggal rekomendasi terbit: ..."</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Pilih Dari Kalender
                  </label>
                  <input
                    type="date"
                    value={data.recommendationDate}
                    onChange={(e) => handleRecommendationDateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Teks Manual di Surat
                  </label>
                  <input
                    type="text"
                    value={data.recommendationDateFormatted}
                    onChange={(e) =>
                      onChange({ ...data, recommendationDateFormatted: e.target.value })
                    }
                    placeholder="29 September 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Periode Istirahat */}
            <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  Periode Rekomendasi Istirahat
                </label>

                {/* Quick Presets */}
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-500 font-medium mr-1">Durasi Cepat:</span>
                  {[1, 2, 3, 5, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => handleSetRestDuration(days)}
                      className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 text-[11px] transition-all"
                    >
                      {days} Hari
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mulai Dari */}
                <div className="space-y-2 bg-white p-3 rounded-lg border border-rose-100/80">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Mulai Istirahat Dari:
                  </span>
                  <input
                    type="date"
                    value={data.restStartDate}
                    onChange={(e) => {
                      const iso = e.target.value;
                      onChange({
                        ...data,
                        restStartDate: iso,
                        restStartDateFormatted: formatIndonesianDate(iso),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={data.restStartDateFormatted}
                    onChange={(e) =>
                      onChange({ ...data, restStartDateFormatted: e.target.value })
                    }
                    placeholder="29 September 2026"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* Hingga */}
                <div className="space-y-2 bg-white p-3 rounded-lg border border-rose-100/80">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Hingga Tanggal:
                  </span>
                  <input
                    type="date"
                    value={data.restEndDate}
                    onChange={(e) => {
                      const iso = e.target.value;
                      onChange({
                        ...data,
                        restEndDate: iso,
                        restEndDateFormatted: formatIndonesianDate(iso),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={data.restEndDateFormatted}
                    onChange={(e) =>
                      onChange({ ...data, restEndDateFormatted: e.target.value })
                    }
                    placeholder="29 September 2026"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Teks di surat: "...rekomendasi istirahat kepada pasien tersebut dari{' '}
                <strong className="text-slate-700">{data.restStartDateFormatted || '29 September 2026'}</strong> hingga{' '}
                <strong className="text-slate-700">{data.restEndDateFormatted || '29 September 2026'}</strong>"
              </p>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Diagnosa Pasien
              </label>
              <input
                type="text"
                value={data.diagnosis}
                onChange={(e) => onChange({ ...data, diagnosis: e.target.value })}
                placeholder="Demam Tinggi dan Radang Tenggorokan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />

              {/* Diagnosis Quick Pick */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 self-center mr-1">Preset:</span>
                {COMMON_DIAGNOSES.map((diag) => (
                  <button
                    key={diag}
                    type="button"
                    onClick={() => onChange({ ...data, diagnosis: diag })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                      data.diagnosis === diag
                        ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {diag}
                  </button>
                ))}
              </div>
            </div>

            {/* Paragraf Penjelasan Diagnosis */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Keterangan Tambahan Diagnosa (Opsional)
              </label>
              <textarea
                rows={2}
                value={data.diagnosisExplanation}
                onChange={(e) => onChange({ ...data, diagnosisExplanation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 3: DOKTER & SIP ================= */}
        {activeTab === 'dokter' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Dokter & Nomor Izin Praktik (SIP)
                </h3>
                <p className="text-xs text-slate-500">
                  Dapat diisi manual atau gunakan Generator Otomatis dengan validasi format presisi.
                </p>
              </div>
            </div>

            {/* Nama & Spesialis Dokter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Dokter
                </label>
                <input
                  type="text"
                  value={data.doctorName}
                  onChange={(e) => onChange({ ...data, doctorName: e.target.value })}
                  placeholder="Dr. Puji Rahmi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Spesialisasi / Gelar
                </label>
                <input
                  type="text"
                  value={data.doctorSpecialty}
                  onChange={(e) => onChange({ ...data, doctorSpecialty: e.target.value })}
                  placeholder="General Practitioner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            {/* SIP Generator & Input Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Nomor Izin Praktik (SIP)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSip}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Nomor SIP Baru
                </button>
              </div>

              {/* SIP Manual Input Field */}
              <div>
                <input
                  type="text"
                  value={data.doctorSip}
                  onChange={(e) => onChange({ ...data, doctorSip: e.target.value })}
                  placeholder="B/500.16.7.2/34.043./IX/2026/DPMPTSPTK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-xs sm:text-sm tracking-wide focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold"
                />
              </div>

              {/* SIP Validation Live Indicator */}
              <div className="space-y-2">
                {sipValidation.isValid ? (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-900">
                        Format Nomor SIP Valid & Sesuai Standar PDF!
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Rangkaian 6 bagian (Klasifikasi, Registrasi, Bulan Romawi, Tahun, Instansi) telah terpenuhi.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Format SIP Memerlukan Penyesuaian:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-800">
                        {sipValidation.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Date Mismatch Warning & Auto-sync */}
                {!sipValidation.matchesDate && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs gap-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{sipValidation.dateMismatchMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoSyncSip}
                      className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 shrink-0 transition-all"
                    >
                      Sinkronkan Otomatis
                    </button>
                  </div>
                )}
              </div>

              {/* Detailed Breakdown Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowSipDetails(!showSipDetails)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline flex items-center gap-1"
                >
                  {showSipDetails ? 'Sembunyikan' : 'Tampilkan'} Rincian Bagian Nomor SIP
                </button>

                {showSipDetails && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">1. Sifat Berkas</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.prefix || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Surat Biasa</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">2. Klasifikasi</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.classification || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Pelayanan Medik</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">3. No. Urut Berkas</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.registration || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">No. Register Dokter</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">4. Bulan Romawi</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.romanMonth || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Bulan Terbit</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">5. Tahun</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.year || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Tahun Terbit</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 block uppercase">6. Instansi</span>
                      <strong className="text-slate-800 font-mono">
                        {sipValidation.parts.agency || '-'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Dinas Terkait</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: UPLOAD LOGO & BRANDING ================= */}
        {activeTab === 'logo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-600" />
                  Fitur Upload Logo & Kustomisasi Header
                </h3>
                <p className="text-xs text-slate-500">
                  Unggah file logo instansi/klinik Anda atau gunakan logo resmi Halodoc di pojok kiri.
                </p>
              </div>
            </div>

            {/* 1. Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-rose-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileProcess(file);
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Klik untuk Memilih File atau Drag & Drop ke Sini
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Mendukung file PNG (transparan), JPG, SVG, atau WebP (resolusi bebas, otomatis disesuaikan).
              </p>
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:border-slate-300">
                Pilih File Logo Dari Komputer
              </span>
            </div>

            {/* 2. Current Active Logo Preview & Reset */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Logo yang Sedang Digunakan Saat Ini:
                </span>
                {data.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...data, customLogoUrl: undefined })}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset ke Logo Halodoc Asli
                  </button>
                )}
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 flex items-center justify-center min-h-[70px]">
                {data.customLogoUrl ? (
                  <img
                    src={data.customLogoUrl}
                    alt="Logo Kustom"
                    style={{ height: `${data.logoHeight || 34}px` }}
                    className="object-contain max-w-full"
                  />
                ) : (
                  <HalodocLogo height={data.logoHeight || 34} />
                )}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {data.customLogoUrl
                  ? '✨ Menggunakan file logo kustom yang Anda unggah.'
                  : '🌿 Menggunakan logo resmi Halodoc terbaru (vektor resolusi tinggi).'}
              </p>
            </div>

            {/* 3. Posisi Logo: Pojok Kiri vs Pojok Kanan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Posisi Logo di Header Output PDF
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sesuai instruksi: Default telah diatur di Pojok Kiri
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, logoPosition: 'left' })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    data.logoPosition === 'left'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Pojok Kiri (Aktif)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...data, logoPosition: 'right' })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    data.logoPosition === 'right'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                  <span>Pojok Kanan</span>
                </button>
              </div>
            </div>

            {/* 4. Ukuran / Tinggi Logo */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                <span>Tinggi / Ukuran Logo di PDF:</span>
                <span className="text-rose-600 font-bold">{data.logoHeight || 34} px</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="1"
                value={data.logoHeight || 34}
                onChange={(e) =>
                  onChange({ ...data, logoHeight: parseInt(e.target.value, 10) })
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Kecil (20px)</span>
                <span>Standar (34px)</span>
                <span>Besar (60px)</span>
              </div>
            </div>

            {/* 5. Pengaturan & Upload Watermark Kustom */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Watermark Latar Belakang</span>
                  <span className="text-[11px] text-slate-500">
                    Gambar transparan di tengah kertas A4 (Bisa di-upload kustom)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.showWatermark}
                    onChange={(e) => onChange({ ...data, showWatermark: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {data.showWatermark && (
                <div className="space-y-4 pt-2 border-t border-slate-200/80">
                  {/* Watermark File Upload Area */}
                  <div
                    onClick={() => watermarkFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-xl p-4 text-center cursor-pointer bg-white hover:bg-rose-50/30 transition-all"
                  >
                    <input
                      ref={watermarkFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWatermarkFileProcess(file);
                      }}
                    />
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Klik untuk Upload Gambar Watermark Sendiri
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Disarankan PNG berlatar transparan atau SVG / JPG
                    </span>
                  </div>

                  {/* Watermark Active Preview & Controls */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-slate-200 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:10px_10px] flex items-center justify-center p-1 overflow-hidden">
                        {data.customWatermarkUrl ? (
                          <img
                            src={data.customWatermarkUrl}
                            alt="Watermark Preview"
                            className="max-h-full max-w-full object-contain"
                            style={{ opacity: Math.max(0.3, data.watermarkOpacity * 2) }}
                          />
                        ) : (
                          <div className="w-8 h-8 text-[#E0004D] flex items-center justify-center">
                            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#E0004D]">
                              <path
                                d="M100 170c-3.5 0-6.8-1.4-9.3-3.9L42.5 118C28.3 103.8 28.3 80.8 42.5 66.6c13.7-13.7 35.8-14.1 50-1l7.5 7 7.5-7c14.2-13.1 36.3-12.7 50 1 14.2 14.2 14.2 37.2 0 51.4l-48.2 48.1c-2.5 2.5-5.8 3.9-9.3 3.9z"
                                stroke="currentColor"
                                strokeWidth="15"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          {data.customWatermarkUrl
                            ? 'Watermark Kustom Terpasang'
                            : 'Watermark Logo Halodoc (Bawaan)'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {data.customWatermarkUrl
                            ? 'File gambar kustom sedang aktif'
                            : 'Logo stetoskop halus standar'}
                        </span>
                      </div>
                    </div>

                    {data.customWatermarkUrl && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...data, customWatermarkUrl: undefined })}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Watermark Opacity Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Ketebalan / Transparansi Watermark:</span>
                      <span className="font-semibold text-rose-600">{Math.round(data.watermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.35"
                      step="0.01"
                      value={data.watermarkOpacity}
                      onChange={(e) =>
                        onChange({ ...data, watermarkOpacity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Sangat Halus (2%)</span>
                      <span>Sedang (8%)</span>
                      <span>Jelas (35%)</span>
                    </div>
                  </div>

                  {/* Watermark Size Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Ukuran / Lebar Watermark di Dokumen:</span>
                      <span className="font-semibold text-rose-600">{data.watermarkSize || 420} px</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="650"
                      step="10"
                      value={data.watermarkSize || 420}
                      onChange={(e) =>
                        onChange({ ...data, watermarkSize: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Kecil (180px)</span>
                      <span>Standar (420px)</span>
                      <span>Sangat Besar (650px)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Footer Kontak Dokumen */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor Telepon Footer
                  </label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => onChange({ ...data, phone: e.target.value })}
                    placeholder="+6221 3110 6999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Website Footer
                  </label>
                  <input
                    type="text"
                    value={data.website}
                    onChange={(e) => onChange({ ...data, website: e.target.value })}
                    placeholder="www.halodoc.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Jarak Footer ke SIP */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>Posisi Jarak Garis Footer di Bawah Nomor SIP:</span>
                  <span className="text-rose-600 font-bold">{data.footerSpacing ?? 28} px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="80"
                  step="2"
                  value={data.footerSpacing ?? 28}
                  onChange={(e) =>
                    onChange({ ...data, footerSpacing: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Rapat (12px)</span>
                  <span>Persis Bawah SIP (28px - Rekomendasi)</span>
                  <span>Agak Jauh (80px)</span>
                </div>
              </div>
            </div>

            {/* Tombol Kembalikan ke Standar */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onResetToSample}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Kembalikan ke Contoh Persis Dokumen Awal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
