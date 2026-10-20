import React from 'react';
import {
  Download,
  Printer,
  FileImage,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
} from 'lucide-react';

interface HeaderProps {
  onExportPdf: () => void;
  onExportImage: () => void;
  onPrint: () => void;
  onReset: () => void;
  isGeneratingPdf: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportPdf,
  onExportImage,
  onPrint,
  onReset,
  isGeneratingPdf,
  scale,
  onScaleChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E0004D] to-[#FF4B7D] flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                Generator Surat Sakit
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                1:1 Precision
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
              Standar Format Halodoc &bull; Auto Kalkulasi Umur &bull; SIP Generator & Validator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-xl p-1 gap-1 text-slate-600">
            <button
              type="button"
              onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
              className="p-1.5 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
              title="Perkecil Preview"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold px-1 w-12 text-center text-slate-700">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onScaleChange(Math.min(1.4, scale + 0.1))}
              className="p-1.5 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
              title="Perbesar Preview"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onScaleChange(0.85)}
              className="p-1.5 hover:text-slate-900 rounded-lg hover:bg-white transition-colors text-[10px] font-bold"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset / Sample Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            title="Reset ke Data Sampel PDF Asli"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Data Asli</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            title="Cetak Langsung / Print (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Cetak</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={onExportImage}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            title="Download PNG Gambar"
          >
            <FileImage className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden lg:inline">Gambar</span>
          </button>

          {/* Main Download PDF Button */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={onExportPdf}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#E0004D] hover:bg-[#C70044] rounded-xl transition-all shadow-md shadow-rose-600/25 active:scale-95 flex items-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Download PDF (1:1)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
