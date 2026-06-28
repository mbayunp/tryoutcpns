import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import {
  ArrowRight,
  Star,
  ChevronDown,
  Sparkles,
  Trophy,
  Users,
  BookOpen,
  Award,
  Monitor,
  FileText,
  Layers,
  Lightbulb,
  Coffee,
  ShieldCheck,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';
import homeImg from '../../components/images/Home.jpeg';
import Reveal from '../../components/common/Reveal';

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  // Data Fitur Interaktif
  const featureDemo = [
    {
      title: 'Simulasi CAT BKN Asli',
      desc: 'Tampilan antarmuka, timer hitung mundur, tata letak soal, navigasi lembar jawaban, hingga tombol ragu-ragu dibuat persis seperti ujian asli.',
      icon: <Trophy className="h-5 w-5" />
    },
    {
      title: 'Live Ranking Nasional',
      desc: 'Ketahui nilai kelulusan Anda secara real-time. Skor Anda akan disandingkan dengan peserta lainnya secara nasional per sub-kategori.',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Evaluasi & Pembahasan Soal',
      desc: 'Setiap soal dilengkapi pembahasan terperinci. Pelajari trik pengerjaan cepat ala mentor ASN untuk memaksimalkan perolehan poin Anda.',
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans selection:bg-blue-500/10 selection:text-blue-700">
      <SEO />

      {/* ━━━ HERO SECTION (MODERN ASYMMETRIC LAYOUT WITH FLOATING WIDGETS) ━━━ */}
      <section id="beranda" className="relative overflow-hidden bg-white border-b border-slate-100 bg-grid-pattern pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">

        {/* Glow Blobs background */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-blue-400/10 blur-[80px] sm:blur-[140px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-indigo-400/10 blur-[80px] sm:blur-[140px] pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column — Brand & Copy */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <Reveal direction="up" duration={800} delay={100}>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Temani belajar hari ini, wujudkan impian esok hari.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800">
                    wujudkan impian esok hari.
                  </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 pt-2">
                  Akses ratusan simulasi CAT BKN terupdate sesuai FR terbaru di bawah bimbingan mentor profesional.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6 w-full sm:w-auto">
                  <button
                    onClick={() => navigate('/register')}
                    className="group w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-850 text-white text-sm font-extrabold px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    Mulai Belajar Gratis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <a
                    href="#features"
                    className="group w-full sm:w-auto h-12 inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 text-sm font-extrabold px-8 rounded-xl transition-all duration-300 border border-slate-200 active:scale-[0.98] shadow-sm cursor-pointer"
                  >
                    Pelajari Fitur
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column — Stacked Visuals with Floating Cards */}
            <div className="lg:col-span-5 relative flex justify-center mt-12 lg:mt-0">
              <Reveal direction="up" duration={900} delay={300}>
                <div className="relative w-full max-w-[360px] sm:max-w-[400px] px-6">

                  {/* Decorative background gradients */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 rounded-3xl -rotate-3 scale-105 pointer-events-none border border-slate-100"></div>

                  {/* Main Stacked Image Card */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white p-2.5 rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col z-10">
                    <img
                      src={homeImg}
                      alt="Wildan Alwi - Mentor Utama"
                      className="w-full object-cover rounded-2xl aspect-[4/5] object-top"
                    />

                    {/* Badge Name */}
                    <div className="mt-3 py-2 bg-slate-50 rounded-xl border border-slate-200/50 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[10px] font-black text-slate-700 tracking-wider uppercase">
                        Wildan Alwi — Mentor Utama
                      </p>
                    </div>
                  </div>

                  {/* Floater 1: Live Scoring */}
                  <div className="absolute -top-6 -left-6 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/70 shadow-xl flex items-center gap-3 animate-float pointer-events-none">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tryout Score</p>
                      <p className="text-sm font-black text-slate-800">485 <span className="text-[10px] text-emerald-600 font-bold">+15%</span></p>
                    </div>
                  </div>

                  {/* Floater 2: Passing Grade Badge */}
                  <div className="absolute bottom-16 -right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/70 shadow-xl flex items-center gap-2.5 animate-float animation-delay-2000 pointer-events-none">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 fill-emerald-50" />
                    </div>
                    <span className="text-xs font-black text-slate-800">Lolos Passing Grade</span>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ KELEBIHAN SECTION (PREMIUM BENTO GRID LAYOUT) ━━━ */}
      <section id="kelebihan" className="py-20 sm:py-28 bg-slate-50/50 border-b border-slate-100 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Kelebihan Platform</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Alasan Memilih Platform <span className="text-blue-700">Wildan CASN</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Kami merancang sistem dengan pendekatan modern yang memadukan materi akurat, simulasi identik, dan pendampingan mentor untuk memaksimalkan tingkat kelulusan Anda.
              </p>
            </div>
          </Reveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Bento Card 1: Simulasi CAT (Col Span 2) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium bento-card relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3 z-10 max-w-md">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Monitor className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">Sistem CAT Identik 1:1 BKN</h3>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">
                  Format, visual layar ujian, navigasi soal, sisa timer, hingga aturan tombol ragu-ragu dirancang semirip mungkin dengan aplikasi ujian resmi BKN untuk melatih mental ujian Anda.
                </p>
              </div>

              {/* Sub-test Preview Grid */}
              <div className="mt-8 grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 z-10">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/40 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tes TIU</span>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-blue-600 w-[85%] rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">PG: 80</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/40 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tes TWK</span>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[70%] rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">PG: 65</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/40 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tes TKP</span>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[90%] rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">PG: 166</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Mentor (Col Span 1) */}
            <div className="md:col-span-1 bg-gradient-to-br from-[#0B1C30] to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-premium bento-card flex flex-col justify-between min-h-[300px]">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">Mentor Utama Profesional</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                  Dibimbing langsung oleh praktisi berpengalaman yang memahami kisi-kisi dan pola pembuat soal ujian.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3.5 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-650 flex items-center justify-center font-black text-xs text-white border border-blue-500">
                  WA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Wildan Alwi</h4>
                  <div className="flex gap-0.5 items-center mt-0.5">
                    {Array(5).fill(null).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 font-bold ml-1">5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Bank Soal & FR (Col Span 1) */}
            <div className="md:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium bento-card flex flex-col justify-between min-h-[300px]">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">Soal Update Berbasis FR</h3>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">
                  Bank soal kami diperbarui secara berkala mengikuti Field Report (FR) asli dari ujian periode sebelumnya untuk relevansi maksimal.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200/30">#FR_CPNS</span>
                <span className="px-2.5 py-1 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600 border border-blue-100/30">#TIU_HOTS</span>
                <span className="px-2.5 py-1 bg-emerald-50 rounded-lg text-[10px] font-bold text-emerald-600 border border-emerald-100/30">Live Update</span>
              </div>
            </div>

            {/* Bento Card 4: Analytics (Col Span 2) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium bento-card relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3 z-10 max-w-md">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">Rapor Evaluasi & Pembahasan Cepat</h3>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">
                  Analisis mendalam setelah ujian memberikan peta kelemahan materi Anda. Dilengkapi tips taktis pengerjaan soal di bawah 50 detik dari mentor.
                </p>
              </div>

              {/* Graphics Analytics Placeholder (Styled HTML/CSS) */}
              <div className="mt-8 flex items-end justify-between gap-2 z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-sm">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400 font-bold">TO #1</span>
                  <div className="w-8 bg-red-400 rounded-t-lg transition-all" style={{ height: '36px' }} />
                  <span className="text-[10px] font-bold text-slate-600">320</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400 font-bold">TO #2</span>
                  <div className="w-8 bg-amber-400 rounded-t-lg transition-all" style={{ height: '54px' }} />
                  <span className="text-[10px] font-bold text-slate-600">390</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400 font-bold">TO #3</span>
                  <div className="w-8 bg-emerald-500 rounded-t-lg transition-all" style={{ height: '80px' }} />
                  <span className="text-[10px] font-black text-slate-800">475</span>
                </div>
                <div className="bg-emerald-100 text-emerald-800 text-[10px] font-black py-1.5 px-3 rounded-xl flex items-center gap-1">
                  <span>🚀</span>
                  <span>Lolos!</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ━━━ FEATURES SECTION (SPLIT SCREEN BROWSER MOCKUP) ━━━ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-white" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Fitur Platform</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Simulasi Ujian Tanpa Tekanan
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto">
                Kami membangun sistem simulasi CAT dengan performa andal untuk membiasakan Anda dengan atmosfer ujian sesungguhnya.
              </p>
            </div>
          </Reveal>

          {/* Interactive Split Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Interactive Browser Mockup */}
            <div className="lg:col-span-7 bg-slate-100 p-4 rounded-3xl border border-slate-200/80 shadow-2xl relative overflow-hidden glow-border-subtle">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block"></span>
                </div>
                <div className="bg-white border border-slate-200/60 rounded-lg px-6 py-0.5 text-[10px] text-slate-400 font-mono tracking-wide">
                  wildancasn.id/simulasi-cat
                </div>
                <div className="w-10"></div>
              </div>

              {/* Dynamic Screen Mockup Content */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 min-h-[320px] flex flex-col justify-between text-left text-xs font-semibold relative overflow-hidden">
                {activeFeature === 0 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center bg-slate-550/5 p-3 rounded-xl border border-slate-200/30">
                      <span className="font-extrabold text-[10px] text-blue-700 bg-blue-100/50 px-2.5 py-0.5 rounded">SUB-TES: TIU</span>
                      <span className="font-mono text-red-500 font-black tracking-wide">Sisa Waktu: 01:32:04</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Soal No 12 dari 110</p>
                      <p className="text-slate-800 text-[13px] leading-relaxed font-black">
                        Sebuah mobil melaju dengan kecepatan rata-rata 80 km/jam selama 3 jam 45 menit. Berapakah jarak total yang ditempuh mobil tersebut?
                      </p>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      {['A. 280 km', 'B. 300 km', 'C. 320 km', 'D. 340 km'].map((opt, i) => (
                        <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors cursor-pointer ${i === 1 ? 'border-blue-500 bg-blue-550/5 ring-1 ring-blue-500 text-blue-700 font-bold' : 'border-slate-100 hover:bg-slate-50'}`}>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[10px] font-black ${i === 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'}`}>{i === 1 && '✓'}</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">Ragu-Ragu</span>
                      <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black tracking-wide border-0 shadow-sm">Simpan & Lanjutkan</button>
                    </div>
                  </div>
                )}

                {activeFeature === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/30 flex justify-between items-center">
                      <span className="font-bold text-slate-700">Live Skor Ujian Nasional</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-md">Real-Time Update</span>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 bg-slate-100/80 p-2 rounded-lg text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="col-span-2 text-center">Rank</span>
                        <span className="col-span-5">Nama Peserta</span>
                        <span className="col-span-3 text-center">Skor Akhir</span>
                        <span className="col-span-2 text-center">Status</span>
                      </div>
                      {[
                        { rank: '1', name: 'Andi Pratama', score: '485', status: 'Lolos' },
                        { rank: '2', name: 'Siti Rahma', score: '462', status: 'Lolos' },
                        { rank: '3', name: 'Budi Santoso', score: '445', status: 'Lolos' }
                      ].map((u, i) => (
                        <div key={i} className="grid grid-cols-12 items-center bg-white p-2.5 border-b border-slate-100 text-slate-700">
                          <span className="col-span-2 text-center font-black text-slate-800">#{u.rank}</span>
                          <span className="col-span-5 font-bold text-slate-850">{u.name}</span>
                          <span className="col-span-3 text-center font-black text-blue-700">{u.score}</span>
                          <span className="col-span-2 text-center"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-black">Lolos</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeFeature === 2 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-250/30 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                      <div>
                        <h4 className="font-extrabold text-emerald-800 text-[11px] uppercase tracking-wider">Kunci Jawaban & Pembahasan</h4>
                        <p className="text-slate-650 text-[11px] mt-0.5">Kunci Jawaban: <span className="font-bold text-emerald-700">B (300 km)</span></p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Formula Pengerjaan Cepat:</p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 font-mono text-[10px] text-slate-655 space-y-1">
                        <div>Jarak (S) = Kecepatan (V) x Waktu (t)</div>
                        <div>t = 3 jam 45 menit = 3,75 jam</div>
                        <div>S = 80 km/jam x 3,75 jam</div>
                        <div className="font-bold text-slate-800 text-[11px] border-t border-slate-200 pt-1 mt-1">S = 300 km</div>
                      </div>
                    </div>
                    <p className="text-slate-500 font-semibold text-[11px] leading-relaxed">
                      Trik: Ubah menit ke pecahan jam terlebih dahulu (45 menit = 3/4 jam = 0.75 jam) baru kalikan dengan kecepatan dasar.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Controller List */}
            <div className="lg:col-span-5 space-y-4">
              {featureDemo.map((item, index) => {
                const isActive = activeFeature === index;
                return (
                  <div
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${isActive
                      ? 'border-blue-500 bg-blue-550/5 ring-1 ring-blue-500 shadow-md'
                      : 'border-slate-200 hover:border-slate-350 bg-white shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-3.5 mb-2">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-50 text-slate-500'}`}>
                        {item.icon}
                      </div>
                      <h3 className="font-black text-sm sm:text-base text-slate-900 leading-none">{item.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed pl-12">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS (WITH TIMELINE CARDS) ━━━ */}
      <section className="py-20 sm:py-28 bg-slate-100/40 border-y border-slate-200/50 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16 space-y-4 max-w-xl mx-auto">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Alur Belajar</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Tiga Langkah Menuju Abdi Negara
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Alur persiapan belajar terstruktur yang telah dirancang untuk membantu Anda memetakan penguasaan materi seefisien mungkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 z-0" />

            {[
              {
                step: '01',
                title: 'Registrasi Akun Instan',
                desc: 'Buat akun belajar Anda dalam hitungan detik. Cukup masukkan email aktif secara gratis untuk memulai.'
              },
              {
                step: '02',
                title: 'Simulasi CAT & Evaluasi',
                desc: 'Lakukan tryout mandiri untuk memetakan kelemahan materi Anda berdasarkan hasil rapor evaluasi instan.'
              },
              {
                step: '03',
                title: 'Akselerasi & Kelulusan',
                desc: 'Akses tips taktis pengerjaan cepat dari mentor, tingkatkan skor tryout Anda secara berkala, dan amankan passing grade.'
              },
            ].map((item, i) => (
              <Reveal key={i} direction="up" delay={100 * (i + 1)} duration={600}>
                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col items-center text-center hover:border-blue-400 transition-colors shadow-sm relative z-10 group h-full">
                  <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-sm font-black shadow-md shadow-blue-500/10 mb-5 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-850 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900 transition-colors group"
            >
              <span>Buat Akun Belajar Pertama Anda Sekarang</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>

      {/* ━━━ TESTIMONIAL SECTION (GLASSMORPHIC CARDS IN DARK CONTAINER) ━━━ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-[#0B1C30] text-white relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/2 right-1/4 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full inline-block">Kisah Sukses</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Bukti Kelulusan Alumni Kami
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-semibold max-w-2xl mx-auto">
                Dengarkan langsung ulasan para alumni Wildan CASN yang sukses mengamankan NIP di berbagai instansi impian.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Andi Pratama',
                role: 'Kementerian Keuangan RI',
                initials: 'AP',
                comment: 'Sistem simulasinya luar biasa membantu. Saya merasa sangat familiar dengan durasi dan navigasi lembar jawaban CAT saat ujian SKD asli berlangsung. Lolos passing grade Kemenkeu!'
              },
              {
                name: 'Riska Indah',
                role: 'Kementerian Hukum & HAM',
                initials: 'RI',
                comment: 'Soal TWK dan TIU di Wildan CASN benar-benar sesuai dengan pola soal yang keluar saat tes. Tips pengerjaan dari tutor membantu saya menghemat banyak waktu pengerjaan soal hitungan.'
              },
              {
                name: 'Budi Hartono',
                role: 'Pemprov Jawa Barat',
                initials: 'BH',
                comment: 'Live ranking nasional memacu semangat belajar saya secara signifikan untuk terus memperbaiki kelemahan materi. Penjelasan di pembahasan soalnya sangat runtun.'
              }
            ].map((testi, i) => (
              <Reveal key={i} direction="up" delay={150 * i} duration={700}>
                <div className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col justify-between h-full hover:border-slate-700 transition-colors glow-border-subtle-dark">
                  <div className="space-y-4 text-left">
                    <div className="flex gap-0.5">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold italic">
                      "{testi.comment}"
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-800/60 mt-6 text-left">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-black border border-blue-500/20 text-xs flex-shrink-0">
                      {testi.initials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-extrabold text-xs sm:text-sm text-white truncate">{testi.name}</p>
                      <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mt-0.5 truncate">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━ FAQ SECTION (SPLIT VIEW) ━━━ */}
      <section className="py-20 sm:py-28 bg-white" id="faq">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Title & CS Link */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left sticky top-28">
              <Reveal direction="up" duration={700}>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Bantuan & FAQ</p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Ada Pertanyaan? <br />
                  Kami Punya Jawabannya.
                </h2>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Jika pertanyaan Anda tidak terdaftar di sini, silakan kunjungi pusat bantuan resmi kami atau hubungi tim customer service.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => navigate('/help')}
                    className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl text-xs font-black transition-colors"
                  >
                    <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
                    <span>Kunjungi Help Center</span>
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Accordions */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  q: 'Apakah simulasinya benar-benar mirip ujian CAT BKN?',
                  a: 'Ya. Tampilan visual lembar ujian, kalkulator sisa waktu, tata letak soal, navigasi halaman, hingga penentuan ambang batas kelulusan (passing grade) TWK, TIU, dan TKP dibuat identik dengan sistem CAT BKN asli.'
                },
                {
                  q: 'Bagaimana sistem penilaian tryout dihitung?',
                  a: 'Skema penilaian kami otomatis dikalkulasi di backend: TWK dan TIU bernilai 5 poin untuk setiap jawaban benar (0 jika salah). TKP menggunakan bobot nilai 1-5 poin bergantung pada opsi yang Anda pilih.'
                },
                {
                  q: 'Apakah saya bisa melihat pembahasan setelah selesai?',
                  a: 'Tentu saja. Begitu ujian diselesaikan, Anda akan diarahkan ke halaman evaluasi lengkap. Anda dapat membaca pembahasan detail per butir soal untuk memahami konsep materi yang diujikan.'
                },
                {
                  q: 'Apakah bank soal diupdate secara berkala?',
                  a: 'Ya. Kami memperbarui bank soal secara berkala menyesuaikan Field Report (FR) terbaru dari para peserta ujian SKD CPNS periode sebelumnya dan kisi-kisi resmi yang diterbitkan oleh BKN.'
                }
              ].map((item, i) => (
                <Reveal key={i} direction="up" delay={50 * i} duration={600}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:border-slate-350 transition-colors">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between text-left p-5 min-h-[56px] focus:outline-none"
                    >
                      <span className="text-xs sm:text-sm font-black text-slate-800 hover:text-blue-700 transition-colors pr-6">{item.q}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-50 animate-slideDown">
                        <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA SECTION (CLEAN GRADIENT BG) ━━━ */}
      <section className="py-20 sm:py-28 bg-[#0B1C30] text-white relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Reveal direction="up" duration={800}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Persiapkan Karir Masa Depan Anda <br />
              <span className="text-blue-400">Sebagai ASN Sekarang Juga.</span>
            </h2>

            <p className="text-slate-450 font-semibold max-w-md mx-auto leading-relaxed text-xs sm:text-sm pt-2">
              Mulai latihan gratis sekarang. Tingkatkan ke materi premium saat Anda sudah siap untuk mengamankan NIP Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto">
              <button
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-black px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg cursor-pointer"
              >
                Mulai Belajar Gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}