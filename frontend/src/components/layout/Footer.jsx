import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

// Custom SVG icons styled like lucide icons
const InstagramIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const TiktokIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const TelegramIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-16 pb-10 overflow-hidden border-t border-slate-900">
      {/* Background Dots Grid & Ambient Light */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-dots)" />
        </svg>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-3">
            <div className="flex items-center space-x-2.5">
              <div className="bg-white p-1 rounded-xl">
                {/* Gambar Logo dari folder public */}
                <img src="/logo.jpg" alt="Logo CPNS TryOut" className="h-6 w-6 object-cover rounded-md" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                WILDAN<span className="text-blue-700"> CASN</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Platform simulasi CAT BKN terdepan di Indonesia untuk persiapan ujian CPNS Anda.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3.5 pt-2">
              {[
                { icon: <InstagramIcon className="h-4 w-4" />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <YoutubeIcon className="h-4 w-4" />, href: 'https://youtube.com', label: 'YouTube' },
                { icon: <TiktokIcon className="h-4 w-4" />, href: 'https://tiktok.com', label: 'TikTok' },
                { icon: <TelegramIcon className="h-4 w-4" />, href: 'https://telegram.org', label: 'Telegram' }
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-blue-450 hover:border-slate-700 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm"
                  aria-label={soc.label}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-white font-semibold text-sm tracking-tight">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href={isHomePage ? '#beranda' : '/#beranda'} className="hover:text-white transition-colors duration-200">Beranda</a></li>
              <li><a href={isHomePage ? '#features' : '/#features'} className="hover:text-white transition-colors duration-200">Fitur</a></li>
              <li><a href={isHomePage ? '#kelebihan' : '/#kelebihan'} className="hover:text-white transition-colors duration-200">Kelebihan</a></li>
              <li><a href={isHomePage ? '#faq' : '/#faq'} className="hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-white font-semibold text-sm tracking-tight">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privasi</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Ketentuan</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors duration-200">Refund</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors duration-200">Bantuan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-white font-semibold text-sm tracking-tight">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="truncate">alwydan06@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>+62 882 2179 5154</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Pati, Jawa Tengah</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4 md:col-span-3">
            <h4 className="text-white font-semibold text-sm tracking-tight">Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dapatkan update info CPNS, tips ujian, dan info promo langsung di email Anda.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="w-full px-3.5 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-blue-500/10"
              >
                Langganan
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} WILDAN CASN</p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-premium-lg hover:shadow-premium-hover hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
        </button>
      )}
    </footer>
  );
}