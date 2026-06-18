import React, { useEffect } from 'react';

export default function PolicyLayout({ title, description, children, lastUpdated }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [title]);

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20 pt-16">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-16 sm:py-24 text-white border-b border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/2 right-1/4 translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Dokumen Legal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
              {description}
            </p>
          )}
          {lastUpdated && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Terakhir diperbarui: {lastUpdated}
            </p>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 z-10">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium p-6 sm:p-10 lg:p-12 animate-fadeInUp">
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
