import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-[150px] opacity-[0.08]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500 rounded-full filter blur-[120px] opacity-[0.06]" />

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        <Outlet />
      </div>
    </div>
  );
}
