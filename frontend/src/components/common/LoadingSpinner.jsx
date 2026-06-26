import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ease-in-out animate-fadeIn">
      {/* Sleek, glowing container */}
      <div className="relative flex flex-col items-center">
        {/* Modern Thinner Spinner */}
        <div className="relative">
          {/* Subtle background track */}
          <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full"></div>
          {/* Spinning track */}
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Elegant typography */}
        <p className="mt-6 text-slate-300 font-medium tracking-wide animate-pulse">
          Menyiapkan ruang belajar...
        </p>
      </div>
    </div>
  );
}

