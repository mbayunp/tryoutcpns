import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-slate-200/50 py-3'
        : 'bg-transparent py-5'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-white p-1 rounded-xl shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
              {/* Gambar Logo dari folder public */}
              <img src="/logo.jpg" alt="Logo CPNS TryOut" className="h-7 w-7 object-cover rounded-lg" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Sentral<span className="text-blue-700"> CPNS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { label: 'Beranda', href: '#beranda' },
              { label: 'Fitur', href: '#features' },
              { label: 'Paket', href: '#programs' },
              { label: 'Testimoni', href: '#testimonials' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-all duration-200"
              >
                {item.label}
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
            {[
              { label: 'Beranda', href: '#beranda' },
              { label: 'Fitur', href: '#features' },
              { label: 'Paket', href: '#programs' },
              { label: 'Testimoni', href: '#testimonials' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                {item.label}
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
  );
}