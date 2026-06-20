import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-[400px] flex-grow flex items-center justify-center bg-slate-50/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="text-center space-y-4">
        {/* Outer Ring with Glow */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 scale-110 blur-sm"></div>
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">Memuat Halaman...</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Harap tunggu beberapa saat</p>
        </div>
      </div>
    </div>
  );
}
