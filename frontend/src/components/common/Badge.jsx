import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide';

  const variants = {
    primary: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
    secondary: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    danger: 'bg-red-50 text-red-700 ring-1 ring-red-100',
    neutral: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
