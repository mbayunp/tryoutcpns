import React, { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <div className={`border rounded-xl transition-all duration-300 overflow-hidden ${
      isOpen 
        ? 'border-blue-200 bg-blue-50/10 shadow-sm' 
        : 'border-slate-200/85 bg-white hover:border-slate-350'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-slate-900 transition-colors"
      >
        <span className="text-sm sm:text-base pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
          isOpen ? 'rotate-180 text-blue-500' : ''
        }`} />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
        className="transition-all duration-300 ease-in-out"
      >
        <div className="px-5 pb-5 pt-1 text-slate-650 text-sm sm:text-base border-t border-slate-100/70 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}
