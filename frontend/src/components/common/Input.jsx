import React from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  name,
  id,
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-xl bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 ${
          error
            ? 'ring-2 ring-red-400 bg-red-50/50'
            : 'ring-1 ring-slate-200/60 focus:ring-2 focus:ring-blue-500 focus:bg-white'
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
