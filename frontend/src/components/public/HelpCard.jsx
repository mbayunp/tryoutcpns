import React from 'react';

export default function HelpCard({ title, description, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group text-left w-full p-6 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-4 ${
        isActive
          ? 'bg-white border-blue-600 ring-4 ring-blue-600/5 shadow-premium'
          : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-premium'
      }`}
    >
      <div className={`p-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
          : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className={`font-bold text-base sm:text-lg mb-1 transition-colors ${
          isActive ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
        }`}>
          {title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
