import React from 'react';

export default function PolicySection({ title, number, children }) {
  return (
    <section className="py-6 border-b border-slate-100 last:border-b-0 animate-fadeIn">
      <div className="flex items-start gap-4">
        {number && (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50/80 text-blue-600 font-bold text-sm border border-blue-100/50 mt-0.5">
            {number}
          </div>
        )}
        <div className="flex-grow space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
