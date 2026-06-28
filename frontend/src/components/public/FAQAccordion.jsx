import React, { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
      isOpen 
        ? 'border-blue-200 bg-blue-550/[0.02] shadow-sm' 
        : 'border-slate-200/85 bg-white hover:border-slate-350'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-black text-slate-850 hover:text-blue-750 transition-colors"
      >
        <span className="text-xs sm:text-sm pr-4 leading-relaxed">{question}</span>
        <ChevronDown className={`h-4.5 w-4.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
          isOpen ? 'rotate-180 text-blue-600' : ''
        }`} />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
        className="transition-all duration-300 ease-in-out"
      >
        <div className="px-5 pb-5 pt-1 text-slate-450 text-xs sm:text-sm border-t border-slate-50 leading-relaxed font-semibold">
          {answer}
        </div>
      </div>
    </div>
  );
}
