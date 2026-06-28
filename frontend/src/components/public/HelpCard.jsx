import React from 'react';

export default function HelpCard({ title, description, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group text-left w-full p-6 rounded-3xl border transition-all duration-350 flex flex-col items-start gap-4 active:scale-[0.98] ${
        isActive
          ? 'bg-white border-blue-500 shadow-premium-lg ring-4 ring-blue-550/5 -translate-y-1'
          : 'bg-white border-slate-200/80 hover:border-slate-350 shadow-sm hover:shadow-premium hover:-translate-y-1'
      }`}
    >
      <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
          : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-105'
      }`}>
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div>
        <h3 className={`font-black text-sm sm:text-base mb-1.5 transition-colors ${
          isActive ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'
        }`}>
          {title}
        </h3>
        <p className="text-slate-450 text-[11px] sm:text-xs leading-relaxed font-semibold">
          {description}
        </p>
      </div>
    </button>
  );
}
