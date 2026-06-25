import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Megaphone } from 'lucide-react';
import Button from '../common/Button';
import { useExamStore } from '../../store/useExamStore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
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
        const sections = ['beranda', 'features', 'kelebihan', 'testimonials'];
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

  const activeAnnouncements = Array.isArray(announcement)
    ? announcement
    : (announcement && announcement.is_active ? [announcement] : []);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">

      {/* ─── INJECT CUSTOM CSS UNTUK FADE TRANSITION ─── */}
      <style>
        {`
          .announcement-fade {
            animation: announcementFade 0.5s ease-in-out forwards;
          }
          @keyframes announcementFade {
            from { opacity: 0; transform: translateY(2px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Dynamic Announcement Promo Bar */}
      {isBannerVisible && activeAnnouncements.length > 0 && (
        <div className="bg-slate-900 text-slate-200 text-[11px] sm:text-xs py-2 relative flex items-center justify-center font-semibold tracking-wide shadow-sm w-full border-b border-white/5 px-10">
          <div key={currentAnnouncementIndex} className="announcement-fade inline-flex items-center justify-center gap-2 text-center">
            <Megaphone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
            <span>{activeAnnouncements[currentAnnouncementIndex].text}</span>
            {activeAnnouncements[currentAnnouncementIndex].link && (
              <a
                href={activeAnnouncements[currentAnnouncementIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-400 font-bold ml-1 transition-colors"
              >
                Lihat Selengkapnya &rarr;
              </a>
            )}
          </div>
          <button
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 hover:text-white transition-colors p-1"
            title="Tutup Pengumuman"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${isScrolled || isOpen
        ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3'
        : 'bg-transparent border-b border-transparent py-5'
        }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="bg-white p-1 rounded-xl shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
                <img src="/logo.jpg" alt="Logo CPNS TryOut" className="h-7 w-7 object-cover rounded-lg" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900">
                WILDAN<span className="text-blue-700"> CASN</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Beranda', href: '#beranda' },
                { label: 'Fitur', href: '#features' },
                { label: 'Kelebihan', href: '#kelebihan' },
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
                Login
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
                { label: 'Kelebihan', href: '#kelebihan' },
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
                  Login
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