import React, { useState, useEffect } from 'react';
import { User, BookOpen, CreditCard, Cpu } from 'lucide-react';
import SearchHelp from '../../components/public/SearchHelp';
import HelpCard from '../../components/public/HelpCard';
import FAQAccordion from '../../components/public/FAQAccordion';
import ContactSupport from '../../components/public/ContactSupport';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('akun');
  const [openFaqKey, setOpenFaqKey] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const categories = {
    akun: {
      id: 'akun',
      title: 'Akun',
      description: 'Cara Daftar, Cara Login, Lupa Password.',
      icon: User,
      faqs: [
        { q: 'Cara Daftar', a: 'Klik tombol "Daftar Gratis" di kanan atas halaman utama, isi data lengkap (Nama Lengkap, Email, nomor WhatsApp, dan Password). Klik daftar dan Anda siap menggunakan platform.' },
        { q: 'Cara Login', a: 'Klik tombol "Masuk", ketik Email dan Password terdaftar Anda, lalu klik tombol "Masuk". Jika berhasil Anda akan diarahkan ke Dashboard.' },
        { q: 'Lupa Password', a: 'Pada halaman login, klik link "Lupa Password". Masukkan alamat email terdaftar Anda, lalu periksa kotak masuk email Anda untuk melakukan reset password.' }
      ]
    },
    tryout: {
      id: 'tryout',
      title: 'Try Out',
      description: 'Memulai TO, Melihat Hasil, Mengulang TO.',
      icon: BookOpen,
      faqs: [
        { q: 'Memulai TO', a: 'Pilih menu "Dashboard" lalu navigasi ke "Daftar Paket". Klik "Mulai" pada paket simulasi yang Anda inginkan. Harap pastikan jaringan internet stabil.' },
        { q: 'Melihat Hasil', a: 'Setelah menekan tombol selesai ujian atau waktu habis, skor akan terhitung secara otomatis. Hasil lengkap beserta pembahasan detail dapat diakses di menu "Riwayat Ujian" atau halaman hasil.' },
        { q: 'Mengulang TO', a: 'Bisa. Bergantung paket yang Anda ikuti, opsi pengerjaan ulang (Retake) tersedia di bagian detail riwayat try out bersangkutan.' }
      ]
    },
    pembayaran: {
      id: 'pembayaran',
      title: 'Pembayaran',
      description: 'Transfer, QRIS, E-Wallet, Status Pembayaran.',
      icon: CreditCard,
      faqs: [
        { q: 'Transfer', a: 'Pilih opsi pembayaran Virtual Account saat checkout. Lakukan transfer ke nomor rekening unik yang tertera melalui mobile banking, ATM, atau internet banking.' },
        { q: 'QRIS', a: 'Pindai kode QRIS dengan aplikasi e-wallet (GoPay, OVO, Dana, LinkAja) atau aplikasi M-Banking Anda. Sistem akan memverifikasi pembayaran secara otomatis.' },
        { q: 'E-Wallet', a: 'Kami mendukung pembayaran instan e-wallet populer. Anda akan diarahkan ke aplikasi terkait untuk menyelesaikan pembayaran secara aman.' },
        { q: 'Status Pembayaran', a: 'Untuk metode pembayaran otomatis (QRIS/VA), aktivasi akun premium biasanya instan dalam 1 hingga 5 menit setelah transaksi sukses.' }
      ]
    },
    teknis: {
      id: 'teknis',
      title: 'Kendala Teknis',
      description: 'Web Lambat, Tidak Bisa Login, Nilai Tidak Muncul.',
      icon: Cpu,
      faqs: [
        { q: 'Web Lambat', a: 'Pastikan koneksi internet stabil. Disarankan menggunakan Google Chrome/Firefox terbaru, dan bersihkan cache atau cookie browser Anda secara berkala.' },
        { q: 'Tidak Bisa Login', a: 'Periksa kembali penulisan email/password (sensitif huruf). Ingat bahwa satu akun dibatasi maksimal aktif di 2 perangkat secara bersamaan.' },
        { q: 'Nilai Tidak Muncul', a: 'Segera refresh halaman dashboard atau hubungi kami melalui CS WhatsApp dengan melampirkan email akun dan bukti pengerjaan try out.' }
      ]
    }
  };

  // Filter FAQs based on query
  const allFaqs = Object.values(categories).flatMap(cat => 
    cat.faqs.map(faq => ({ ...faq, categoryTitle: cat.title, categoryId: cat.id }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleToggleFaq = (key) => {
    setOpenFaqKey(openFaqKey === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-16 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-20 sm:py-28 text-white border-b border-slate-800">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/2 right-1/4 translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Pusat Bantuan Sentral CPNS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Bagaimana Kami Bisa Membantu?
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-medium">
            Temukan panduan, jawaban atas pertanyaan umum, atau hubungi tim support kami secara langsung.
          </p>
          
          <div className="pt-4 max-w-xl mx-auto">
            <SearchHelp 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16 relative z-10">
        {searchQuery ? (
          // Search Results
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Hasil Pencarian: <span className="text-blue-600">"{searchQuery}"</span>
              </h2>
              <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full ring-1 ring-blue-100">
                {filteredFaqs.length} ditemukan
              </span>
            </div>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const key = `search-${index}`;
                  return (
                    <FAQAccordion
                      key={key}
                      question={`[${faq.categoryTitle}] ${faq.q}`}
                      answer={faq.a}
                      isOpen={openFaqKey === key}
                      onToggle={() => handleToggleFaq(key)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <p className="text-slate-500 font-medium">Pertanyaan tidak ditemukan. Coba gunakan kata kunci lain.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-4 transition-colors"
                >
                  Lihat Semua Kategori Bantuan
                </button>
              </div>
            )}
          </div>
        ) : (
          // Categories & Accordions
          <div className="space-y-12">
            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.values(categories).map((cat) => (
                <HelpCard
                  key={cat.id}
                  title={cat.title}
                  description={cat.description}
                  icon={cat.icon}
                  isActive={selectedCategory === cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenFaqKey(null);
                  }}
                />
              ))}
            </div>

            {/* Selected Category FAQs */}
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Pertanyaan seputar {categories[selectedCategory].title}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {categories[selectedCategory].description}
                </p>
              </div>

              <div className="space-y-4">
                {categories[selectedCategory].faqs.map((faq, index) => {
                  const key = `${selectedCategory}-${index}`;
                  return (
                    <FAQAccordion
                      key={key}
                      question={faq.q}
                      answer={faq.a}
                      isOpen={openFaqKey === key}
                      onToggle={() => handleToggleFaq(key)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contact Support section */}
        <div className="pt-8">
          <ContactSupport />
        </div>
      </div>
    </div>
  );
}