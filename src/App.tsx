/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CertificateData } from './types';
import { Header } from './components/Header';
import { EditorForm } from './components/EditorForm';
import { DocumentPreview } from './components/DocumentPreview';
import { exportToPdf, exportToImage } from './utils/pdfExport';
import {
  FileCheck2,
  Eye,
  Edit3,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const INITIAL_DATA: CertificateData = {
  patientName: 'Ray Orlando',
  birthDate: '1997-05-22',
  birthDateFormatted: '22 Mei 1997',
  birthDateLabel: 'Tangal Lahir',
  gender: 'Male',
  age: 29,

  recommendationDate: '2026-09-29',
  recommendationDateFormatted: '29 September 2026',
  diagnosis: 'Demam Tinggi dan Radang Tenggorokan',
  diagnosisExplanation:
    'yang dapat disebabkan oleh infeksi maupun non infeksi. Diagnosa tersebut diberikan atas gejala yang dijelaskan pasien pada saat konsultasi.',
  restStartDate: '2026-09-29',
  restStartDateFormatted: '29 September 2026',
  restEndDate: '2026-09-29',
  restEndDateFormatted: '29 September 2026',
  closingNote: 'Demikian informasi dari kami, semoga dapat menjadi bahan pertimbangan',

  doctorName: 'Dr. Puji Rahmi',
  doctorSpecialty: 'General Practitioner',
  doctorSip: 'B/500.16.7.2/34.043./IX/2026/DPMPTSPTK',

  phone: '+6221 3110 6999',
  website: 'www.halodoc.com',
  showWatermark: true,
  watermarkOpacity: 0.08,
  watermarkSize: 420,
  customWatermarkUrl: undefined,
  logoPosition: 'left',
  logoHeight: 34,
  customLogoUrl: undefined,
  footerSpacing: 28,
};

export default function App() {
  const [data, setData] = useState<CertificateData>(INITIAL_DATA);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.85);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-adjust scale on smaller screens
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPreviewScale(0.42);
      } else if (width < 1024) {
        setPreviewScale(0.65);
      } else if (width < 1440) {
        setPreviewScale(0.82);
      } else {
        setPreviewScale(0.95);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleExportPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      showToast('Memproses rendering PDF 1:1 resolusi tinggi...');
      const cleanName = (data.patientName || 'Pasien').replace(/[^a-zA-Z0-9]/g, '_');
      await exportToPdf('certificate-document', `Surat_Sakit_${cleanName}.pdf`);
      showToast('Berhasil mengunduh PDF!');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat PDF. Silakan gunakan tombol Cetak.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportImage = async () => {
    try {
      showToast('Membuat gambar PNG...');
      const cleanName = (data.patientName || 'Pasien').replace(/[^a-zA-Z0-9]/g, '_');
      await exportToImage('certificate-document', `Surat_Sakit_${cleanName}.png`);
      showToast('Berhasil mengunduh gambar PNG!');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat gambar PNG.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToSample = () => {
    setData(INITIAL_DATA);
    showToast('Data dikembalikan persis seperti PDF asli!');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Bar */}
      <Header
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onPrint={handlePrint}
        onReset={handleResetToSample}
        isGeneratingPdf={isGeneratingPdf}
        scale={previewScale}
        onScaleChange={setPreviewScale}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2 sticky top-16 z-20 print:hidden">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'editor'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Form Editor
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'preview'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview Surat 1:1
        </button>
      </div>

      {/* Workspace Body */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls */}
        <div
          className={`lg:col-span-5 xl:col-span-5 space-y-4 print:hidden ${
            mobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Quick Notice Card */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/70 rounded-2xl p-4 text-xs text-rose-950 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-900 block">
                Format Presisi 1:1 dengan Dokumen Contoh
              </span>
              <p className="text-rose-800/90 leading-relaxed text-[11.5px]">
                Semua kolom dapat diedit secara bebas. Umur terhitung otomatis ketika tanggal lahir dipilih, rentang tanggal istirahat dapat disesuaikan, dan nomor SIP dilengkapi generator otomatis serta validasi akurasi rangkaian naskah dinas.
              </p>
            </div>
          </div>

          {/* Form Component */}
          <EditorForm
            data={data}
            onChange={setData}
            onResetToSample={handleResetToSample}
          />
        </div>

        {/* Right Column: Live Document Preview */}
        <div
          className={`lg:col-span-7 xl:col-span-7 flex flex-col items-center print:block print:w-full print:m-0 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Container Card */}
          <div className="w-full bg-slate-200/70 border border-slate-300/70 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start min-h-[600px] overflow-auto shadow-inner">
            <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-300 text-slate-600 text-xs print:hidden">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-slate-700">Pratinjau Dokumen Cetak (A4)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Skala tampilan: {Math.round(previewScale * 100)}% &bull; Output PDF: 100% Crisp
              </span>
            </div>

            {/* Document Preview (A4 1:1 Replica) */}
            <div className="flex justify-center w-full overflow-x-auto py-2">
              <DocumentPreview data={data} scale={previewScale} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
