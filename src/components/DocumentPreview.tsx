import React from 'react';
import { CertificateData } from '../types';
import { HalodocLogo } from './HalodocLogo';

interface DocumentPreviewProps {
  data: CertificateData;
  scale?: number;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, scale = 1 }) => {
  const isRightAligned = data.logoPosition === 'right';

  return (
    <div
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className="transition-transform duration-200"
    >
      {/* 
        A4 Standard: 210mm x 297mm 
        Aspect ratio: 1 : 1.41421356
        At 96 DPI: 794px x 1123px (standard A4 web dimensions)
      */}
      <div
        id="certificate-document"
        className="relative bg-white text-[#212529] shadow-2xl mx-auto overflow-hidden font-sans select-text print:shadow-none print:m-0"
        style={{
          width: '794px',
          minHeight: '1123px',
          height: '1123px',
          boxSizing: 'border-box',
          padding: '52px 64px 44px 64px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Subtle Watermark in background */}
        {data.showWatermark && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden"
            style={{
              opacity: data.watermarkOpacity,
              zIndex: 1,
            }}
          >
            {data.customWatermarkUrl ? (
              <img
                src={data.customWatermarkUrl}
                alt="Custom Watermark"
                style={{
                  width: `${data.watermarkSize || 420}px`,
                  maxHeight: '600px',
                  objectFit: 'contain',
                }}
                className="pointer-events-none select-none"
              />
            ) : (
              <svg
                width={data.watermarkSize || 440}
                height={data.watermarkSize || 440}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#E0004D]"
              >
                <path
                  d="M100 170c-3.5 0-6.8-1.4-9.3-3.9L42.5 118C28.3 103.8 28.3 80.8 42.5 66.6c13.7-13.7 35.8-14.1 50-1l7.5 7 7.5-7c14.2-13.1 36.3-12.7 50 1 14.2 14.2 14.2 37.2 0 51.4l-48.2 48.1c-2.5 2.5-5.8 3.9-9.3 3.9z"
                  stroke="currentColor"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="70" cy="46" r="6" fill="currentColor" />
                <circle cx="130" cy="46" r="6" fill="currentColor" />
                <path
                  d="M70 52v16c0 16.6 13.4 30 30 30s30-13.4 30-30V52"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  d="M100 98v28"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="132" r="7" fill="currentColor" />
              </svg>
            )}
          </div>
        )}

        {/* Top Content Area */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header with new logo positioned at the right corner */}
          <div className="pb-4 border-b border-[#E7E9ED]">
            <div
              className={`flex items-center ${
                isRightAligned ? 'justify-end' : 'justify-start'
              }`}
            >
              {data.customLogoUrl ? (
                <img
                  src={data.customLogoUrl}
                  alt="Halodoc Logo"
                  style={{ height: `${data.logoHeight || 34}px` }}
                  className="object-contain"
                />
              ) : (
                <HalodocLogo height={data.logoHeight || 34} />
              )}
            </div>
          </div>

          {/* Section: Informasi Pasien */}
          <div className="mt-8">
            <h2 className="text-[#1F2937] font-semibold text-[16px] mb-4 tracking-tight">
              Informasi Pasien
            </h2>

            <div className="grid grid-cols-2 gap-x-10 gap-y-3.5 text-[14.5px]">
              {/* Row 1 Left: Nama Pasien */}
              <div className="flex items-center">
                <span className="w-[124px] text-[#263238] font-normal shrink-0">
                  Nama Pasien
                </span>
                <div className="flex-1 bg-[#F5F6F8] rounded-[5px] px-4 py-2.5 text-[#111827] font-normal truncate">
                  {data.patientName || 'Ray Orlando'}
                </div>
              </div>

              {/* Row 1 Right: Gender */}
              <div className="flex items-center">
                <span className="w-[100px] text-[#263238] font-normal shrink-0">
                  Gender
                </span>
                <div className="flex-1 bg-[#F5F6F8] rounded-[5px] px-4 py-2.5 text-[#111827] font-normal">
                  {data.gender || 'Male'}
                </div>
              </div>

              {/* Row 2 Left: Tangal Lahir */}
              <div className="flex items-center">
                <span className="w-[124px] text-[#263238] font-normal shrink-0">
                  {data.birthDateLabel || 'Tangal Lahir'}
                </span>
                <div className="flex-1 bg-[#F5F6F8] rounded-[5px] px-4 py-2.5 text-[#111827] font-normal">
                  {data.birthDateFormatted || '22 Mei 1997'}
                </div>
              </div>

              {/* Row 2 Right: Umur */}
              <div className="flex items-center">
                <span className="w-[100px] text-[#263238] font-normal shrink-0">
                  Umur
                </span>
                <div className="flex-1 bg-[#F5F6F8] rounded-[5px] px-4 py-2.5 text-[#111827] font-normal">
                  {data.age ?? '29'}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Catatan Dokter */}
          <div className="mt-9">
            <h2 className="text-[#1F2937] font-semibold text-[16px] mb-5 tracking-tight">
              Catatan Dokter
            </h2>

            <div className="text-[14.5px] leading-[1.65] text-[#263238] space-y-4">
              <p className="font-normal text-[#1F2937]">
                Tanggal rekomendasi terbit:{' '}
                <span className="font-normal">
                  {data.recommendationDateFormatted || '29 September 2026'}
                </span>
              </p>

              <p className="font-normal text-[#1F2937] pt-1">
                Untuk perhatian,
              </p>

              <p className="font-normal text-[#263238] text-justify">
                Kami informasikan bahwa pasien di atas kemungkinan didiagnosa:{' '}
                <span className="text-[#1F2937] font-medium">
                  {data.diagnosis || 'Demam Tinggi dan Radang Tenggorokan'}
                </span>{' '}
                {data.diagnosisExplanation ||
                  'yang dapat disebabkan oleh infeksi maupun non infeksi. Diagnosa tersebut diberikan atas gejala yang dijelaskan pasien pada saat konsultasi.'}
              </p>

              <p className="font-normal text-[#263238] text-justify pt-1">
                Berdasarkan keadaan tersebut, kami memberikan rekomendasi istirahat kepada pasien
                tersebut dari{' '}
                <span className="text-[#1F2937] font-medium">
                  {data.restStartDateFormatted || '29 September 2026'}
                </span>{' '}
                hingga{' '}
                <span className="text-[#1F2937] font-medium">
                  {data.restEndDateFormatted || '29 September 2026'}
                </span>
              </p>

              <p className="font-normal text-[#263238] pt-2">
                {data.closingNote ||
                  'Demikian informasi dari kami, semoga dapat menjadi bahan pertimbangan'}
              </p>
            </div>
          </div>

          {/* Section: Konsultasi Dengan & Doctor Info (Right Aligned) */}
          {/* Section: Konsultasi Dengan & Doctor Info (Right Aligned) */}
          <div className="mt-14 flex flex-col items-end text-right">
            <div className="text-[14.5px] font-semibold text-[#1F2937] mb-4 tracking-tight">
              Konsultasi Dengan
            </div>

            <div className="space-y-1 text-right">
              <div className="text-[14.5px] font-medium text-[#111827]">
                {data.doctorName || 'Dr. Puji Rahmi'}
              </div>
              <div className="text-[13.5px] text-[#4B5563] font-normal">
                {data.doctorSpecialty || 'General Practitioner'}
              </div>
              <div className="text-[13px] text-[#1F2937] tracking-tight font-mono sm:font-sans">
                {data.doctorSip || 'B/500.16.7.2/34.043./IX/2026/DPMPTSPTK'}
              </div>
            </div>
          </div>

          {/* Footer Kontak - Naik ke atas persis di bawah Nomor Izin Praktik */}
          <div
            className="relative z-10 pt-4 border-t border-[#E7E9ED]"
            style={{ marginTop: `${data.footerSpacing ?? 28}px` }}
          >
            <div className="flex items-center justify-between text-[13.5px] text-[#1F2937]">
              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#E0004D] flex items-center justify-center shrink-0">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.61c0-.55-.45-1-.99-1z" />
                  </svg>
                </div>
                <span className="font-medium text-[#263238] tracking-tight">
                  {data.phone || '+6221 3110 6999'}
                </span>
              </div>

              {/* Website */}
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#E0004D] flex items-center justify-center shrink-0">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="font-medium text-[#263238] tracking-tight">
                  {data.website || 'www.halodoc.com'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
