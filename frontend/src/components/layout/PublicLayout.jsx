import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Award, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../common/Button';

export default function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Glassmorphic Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-slate-200/50 py-3'
          : 'bg-transparent py-5'
        }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="bg-slate-900 text-white p-2 rounded-xl shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
                <Award className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                CPNS<span className="text-blue-600">TryOut</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {['Beranda', 'Tentang', 'Paket', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-3.5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Masuk
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                Daftar Gratis
              </Button>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100/60 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 animate-slideDown">
            <div className="px-4 py-4 space-y-1">
              {['Beranda', 'Tentang', 'Paket', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col space-y-2">
                <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                  Masuk
                </Button>
                <Button variant="primary" className="w-full" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                  Daftar Gratis
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {/* Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-2.5">
                <div className="bg-blue-600 text-white p-2 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  CPNS<span className="text-blue-400">TryOut</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Platform simulasi CAT BKN terdepan di Indonesia untuk persiapan ujian CPNS Anda.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm tracking-tight">Navigasi</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#beranda" className="hover:text-white transition-colors duration-200">Beranda</a></li>
                <li><a href="#tentang" className="hover:text-white transition-colors duration-200">Tentang</a></li>
                <li><a href="#paket" className="hover:text-white transition-colors duration-200">Paket</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm tracking-tight">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#privacy" className="hover:text-white transition-colors duration-200">Privasi</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors duration-200">Ketentuan</a></li>
                <li><a href="#refund" className="hover:text-white transition-colors duration-200">Refund</a></li>
                <li><a href="#help" className="hover:text-white transition-colors duration-200">Bantuan</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm tracking-tight">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>support@cpnstryout.id</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Pati, Jawa Tengah</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800/50 text-center text-xs text-slate-600">
            <p>© {new Date().getFullYear()} CPNSTryOut — Didesain untuk kelulusan Anda.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
