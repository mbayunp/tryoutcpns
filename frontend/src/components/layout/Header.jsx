import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';
import { useExamStore } from '../../store/useExamStore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const navigate = useNavigate();
  const location = useLocation();
  const { announcement, fetchActiveAnnouncement } = useExamStore();

  useEffect(() => {
    fetchActiveAnnouncement();
  }, [fetchActiveAnnouncement]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // ScrollSpy Logic (only on Homepage)
      if (location.pathname === '/') {
        const sections = ['beranda', 'features', 'programs', 'testimonials'];
        const scrollPosition = window.scrollY + 200; // Offset for better detection

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger scrollspy on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">

      {/* ─── INJECT CUSTOM CSS UNTUK RUNNING TEXT ─── */}
      <style>
        {`
          @keyframes runningText {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-running-text {
            display: inline-block;
            white-space: nowrap;
            /* Ubah angka 25s menjadi lebih besar untuk memperlambat, atau lebih kecil untuk mempercepat */
            animation: runningText 25s linear infinite;
            will-change: transform;
          }
          /* Pause animasi saat user hover agar link mudah diklik */
          .animate-running-text:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Dynamic Announcement Promo Bar */}
      {announcement && announcement.is_active && (
        <div className="bg-gradient-to-r from-[#0B1C30] via-blue-900 to-[#1E3E66] text-white text-[11px] sm:text-xs py-2.5 relative flex items-center font-semibold tracking-wide shadow-sm overflow-hidden w-full">
          <div className="animate-running-text">
            <span>📢 {announcement.text}</span>
            {announcement.link && (
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-200 font-bold ml-2 transition-colors"
              >
                Lihat Selengkapnya &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-500 ${isScrolled || isOpen
        ? 'bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-b border-slate-200/50 py-3'
        : 'bg-transparent py-5'
        }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="bg-white p-1 rounded-xl shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
                <img src="/logo.jpg" alt="Logo CPNS TryOut" className="h-7 w-7 object-cover rounded-lg" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                WILDAN<span className="text-blue-700"> CASN</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Beranda', href: '#beranda' },
                { label: 'Fitur', href: '#features' },
                { label: 'Paket', href: '#programs' },
                { label: 'Testimoni', href: '#testimonials' }
              ].map((item) => {
                const isActive = isHomePage && activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.label}
                    href={isHomePage ? item.href : `/${item.href}`}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive
                        ? 'text-blue-700 font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                      } after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:bg-blue-700 after:transition-all after:duration-300 after:-translate-x-1/2 ${isActive ? 'after:w-6/12' : 'after:w-0 hover:after:w-6/12'
                      }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Masuk
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
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
              ].map((item) => {
                const isActive = isHomePage && activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.label}
                    href={isHomePage ? item.href : `/${item.href}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col space-y-2">
                <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                  Masuk
                </Button>
                <Button variant="primary" className="w-full" onClick={() => { setIsOpen(false); navigate('/register'); }}>
                  Daftar Gratis
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}