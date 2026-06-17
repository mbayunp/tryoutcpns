import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
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
          <p>© {new Date().getFullYear()} WILDAN CASN</p>
        </div>
      </div>
    </footer>
  );
}