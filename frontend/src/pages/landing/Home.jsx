import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  FileText,
  User,
  BookOpen,
  Award,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Check,
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart3,
  Target
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function Home() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(null);

  const steps = [
    { number: '01', title: 'Daftar Akun', description: 'Buat akun gratis dengan email aktif dalam hitungan detik.', icon: <User className="h-5 w-5" /> },
    { number: '02', title: 'Pilih Paket', description: 'Pilih dari puluhan paket soal SKD sesuai kisi-kisi terbaru.', icon: <BookOpen className="h-5 w-5" /> },
    { number: '03', title: 'Kerjakan Simulasi', description: 'Latihan dengan interface CAT BKN asli dan pembatas waktu.', icon: <Clock className="h-5 w-5" /> },
    { number: '04', title: 'Analisis Hasil', description: 'Lihat skor realtime beserta pembahasan detail tiap soal.', icon: <Award className="h-5 w-5" /> }
  ];

  const packages = [
    {
      title: 'Gratis',
      price: 'Rp 0',
      desc: 'Sempurna untuk mencoba platform',
      features: ['30 Soal Simulasi', 'Waktu 90 Menit', 'Rincian Skor', 'Akses Selamanya'],
      cta: 'Mulai Gratis',
      popular: false
    },
    {
      title: 'Pro',
      price: 'Rp 99k',
      desc: 'Untuk persiapan serius',
      features: ['10+ Paket Lengkap', '110 Soal/Paket', 'Pembahasan Detail', 'Grafik Kemajuan', 'Grup Diskusi'],
      cta: 'Pilih Pro',
      popular: true
    },
    {
      title: 'Premium',
      price: 'Rp 249k',
      desc: 'Persiapan menyeluruh terbaik',
      features: ['Semua Fitur Pro', '30+ Live Class', 'E-Book Materi', 'Try Out Nasional', 'Konsultasi Mentor'],
      cta: 'Pilih Premium',
      popular: false
    }
  ];

  const faqs = [
    { question: 'Apakah sistem try out mirip dengan CAT BKN asli?', answer: 'Ya, simulasi kami dirancang 100% mengikuti spesifikasi CAT BKN — dari tata letak, navigasi soal, tombol ragu-ragu, hingga skema penilaian passing grade.' },
    { question: 'Bagaimana sistem penilaian dihitung?', answer: 'TWK benar = +15 poin (maks 150), TIU benar = +17.5 poin (maks 175), TKP menggunakan skala 1-5 per opsi (maks 225). Passing grade: TWK ≥ 65, TIU ≥ 80, TKP ≥ 166.' },
    { question: 'Bisa akses pembahasan setelah selesai?', answer: 'Tentu! Setelah submit, Anda langsung diarahkan ke halaman hasil dengan pembahasan komprehensif di setiap butir soal.' },
    { question: 'Apakah soal diperbarui secara rutin?', answer: 'Ya, tim kami memperbarui bank soal berkala mengikuti Field Report (FR) terbaru dari peserta ujian periode sebelumnya.' }
  ];

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section id="beranda" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern" />
        {/* Ambient blobs */}
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob" />
        <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.06] animate-blob animation-delay-2000" />
        {/* Radial fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 ring-1 ring-blue-100 text-blue-700 text-xs font-semibold animate-fadeInUp">
              <Zap className="h-3.5 w-3.5" />
              Platform Persiapan CPNS #1 di Indonesia
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Kuasai Seleksi CPNS<br />
              dengan <span className="text-gradient-blue">Simulasi CAT</span> Asli
            </h1>

            {/* Sub */}
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Latih kecepatan dan ketepatan Anda dengan sistem yang 100% mereplikasi ujian CAT BKN resmi. Ribuan peserta telah lulus bersama kami.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto">
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href="#paket"
                className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 bg-white hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
              >
                Lihat Paket
              </a>
            </div>

            {/* Stats row */}
            <div className="pt-10 flex flex-wrap justify-center gap-8 sm:gap-14 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              {[
                { val: '10,000+', label: 'Peserta Lulus' },
                { val: '5,000+', label: 'Bank Soal' },
                { val: '98%', label: 'Kemiripan CAT' }
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{s.val}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Card */}
          <div className="mt-16 max-w-lg mx-auto animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <Card className="p-6 shadow-premium-lg ring-1 ring-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded ring-1 ring-emerald-100">
                  Simulasi Aktif
                </span>
              </div>

              {/* Score preview */}
              <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Skor Simulasi SKD</span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">475</span>
                  <span className="text-xs font-medium text-slate-400">/ 550</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '86%' }} />
                </div>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> Melewati Passing Grade
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-blue-50/60 rounded-xl ring-1 ring-blue-100/60 text-center">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Durasi</span>
                  <span className="block text-xs font-bold text-slate-800">90 Menit</span>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl ring-1 ring-indigo-100/60 text-center">
                  <FileText className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Soal</span>
                  <span className="block text-xs font-bold text-slate-800">30 Butir</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section id="tentang" className="py-20 sm:py-28 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Mengapa Kami?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Persiapan CPNS yang Terstruktur</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Setiap fitur dirancang berdasarkan kebutuhan nyata peserta CPNS untuk memaksimalkan peluang kelulusan.
            </p>
          </div>

          {/* Bento Grid — Asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large card */}
            <Card hover className="md:col-span-2 p-8 flex flex-col justify-between min-h-[240px]">
              <div className="p-3 rounded-xl bg-blue-50 ring-1 ring-blue-100 w-fit">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Simulasi 100% Mirip CAT BKN</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                  Interface, timer, navigasi soal, dan skema penilaian didesain identik dengan sistem Computer Assisted Test BKN asli.
                </p>
              </div>
            </Card>

            {/* Small card */}
            <Card hover className="p-8 flex flex-col justify-between min-h-[240px]">
              <div className="p-3 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 w-fit">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">Analisis Skor Instant</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Hasil keluar dalam hitungan detik dengan breakdown TWK, TIU, TKP.
                </p>
              </div>
            </Card>

            {/* Small card */}
            <Card hover className="p-8 flex flex-col justify-between min-h-[200px]">
              <div className="p-3 rounded-xl bg-amber-50 ring-1 ring-amber-100 w-fit">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">Bank Soal Terupdate</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  5,000+ soal berdasarkan Field Report terbaru. Diperbarui berkala.
                </p>
              </div>
            </Card>

            {/* Large card */}
            <Card hover className="md:col-span-2 p-8 flex flex-col justify-between min-h-[200px]">
              <div className="p-3 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 w-fit">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Pembahasan Komprehensif</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                  Setiap soal dilengkapi pembahasan mendalam dari tim pengajar berpengalaman, termasuk tips dan trik menjawab.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 sm:py-28 bg-slate-50 bg-grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Cara Kerja</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">4 Langkah Menuju Kelulusan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <Card hover key={idx} className="p-6 relative group">
                <span className="absolute top-5 right-5 text-3xl font-black text-slate-100 group-hover:text-blue-100 transition-colors duration-300">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-xl bg-slate-900 text-white w-fit mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                  {step.icon}
                </div>
                <h3 className="text-base font-bold tracking-tight text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="paket" className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Paket Belajar</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Pilih Paket Terbaik Anda</h2>
            <p className="text-slate-500 text-sm">Investasi kecil untuk masa depan karir ASN Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl flex flex-col justify-between p-7 transition-all duration-300 relative ${
                  pkg.popular
                    ? 'ring-2 ring-blue-600 shadow-premium-lg scale-[1.02] z-10'
                    : 'ring-1 ring-slate-200/60 shadow-premium hover:shadow-premium-hover hover:-translate-y-1'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
                    POPULER
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{pkg.desc}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-900">{pkg.price}</span>
                      {pkg.price !== 'Rp 0' && <span className="text-xs text-slate-400">/sekali</span>}
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <Button
                    variant={pkg.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    {pkg.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 sm:py-28 bg-slate-50 bg-grid-pattern">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">FAQ</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl ring-1 transition-all duration-300 ${
                    isOpen ? 'ring-slate-300/60 shadow-premium' : 'ring-slate-200/50 hover:ring-slate-300/50'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
                  >
                    <span className="font-semibold text-sm text-slate-800">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
