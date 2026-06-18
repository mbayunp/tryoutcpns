import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchHelp({ value, onChange, onClear }) {
  return (
    <div className="relative max-w-2xl mx-auto w-full animate-fadeInUp">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Cari pertanyaan, kendala, atau tutorial..."
          className="block w-full pl-11 pr-12 py-4 sm:py-4.5 text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-premium focus:shadow-premium-hover transition-all duration-300 text-sm sm:text-base font-medium"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
