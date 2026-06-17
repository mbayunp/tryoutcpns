import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface-bright">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-white p-1 rounded-xl shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
              <img src="/logo.jpg" alt="Logo" className="h-7 w-7 object-cover rounded-lg" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Sentral<span className="text-blue-700"> CPNS</span>
            </span>
          </Link>
          <Link to="/" className="font-label-lg text-sm font-semibold text-primary hover:underline transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-400">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-extrabold text-lg tracking-tight text-white">
            Sentral<span className="text-blue-500"> CPNS</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a className="hover:text-white transition-colors duration-200" href="#contact">Hubungi Kami</a>
            <a className="hover:text-white transition-colors duration-200" href="#privacy">Kebijakan Privasi</a>
            <a className="hover:text-white transition-colors duration-200" href="#terms">Syarat & Ketentuan</a>
            <a className="hover:text-white transition-colors duration-200" href="#help">Pusat Bantuan</a>
            <a className="hover:text-white transition-colors duration-200" href="#about">Tentang Kami</a>
          </div>
          <p className="text-xs opacity-80">
            © 2026 Sentral CPNS. Persiapan CPNS Profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
