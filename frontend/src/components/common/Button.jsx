import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-300 ease-out rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]';

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-premium hover:shadow-premium-hover focus-visible:ring-slate-900/40',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-premium hover:shadow-premium-hover focus-visible:ring-blue-600/40',
    accent: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-premium hover:shadow-premium-hover focus-visible:ring-emerald-600/40',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-premium hover:shadow-premium-hover focus-visible:ring-amber-500/40',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-premium hover:shadow-premium-hover focus-visible:ring-red-600/40',
    outline: 'ring-1 ring-slate-200 hover:ring-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400/40',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-400/25'
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2'
  };

  const disabledStyles = 'opacity-40 cursor-not-allowed pointer-events-none !shadow-none';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
