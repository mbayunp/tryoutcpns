import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  ShieldCheck
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-500/10 selection:text-blue-700">
      <Helmet>
        <title>Tryout Akbar CASN 2026 - WILDAN CASN</title>
      </Helmet>

      {/* ━━━ HERO SECTION (UPGRADED STACKED LAYOUT) ━━━ */}
      <section id="beranda" className="relative overflow-hidden bg-white border-b border-slate-100 bg-grid-pattern pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-24 lg:pb-20 lg:min-h-[calc(100vh-140px)] lg:flex lg:items-center">

        {/* Glow Blobs background */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column — Brand & Copy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <Reveal direction="up" duration={800} delay={100}>
                {/* Brand & Logo */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-xl shadow-premium border border-slate-100 flex items-center justify-center">
                      <img src="/logo.jpg" alt="Logo Wildan CASN" className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-xl" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-normal">
                      WILDAN <span className="text-blue-700">CASN</span>
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-500 leading-relaxed max-w-xl">
                    Temani belajar hari ini, wujudkan impian esok hari. Akses ratusan simulasi CAT BKN terupdate sesuai FR terbaru di bawah bimbingan mentor profesional.
                  </p>
                </div>

                {/* CTA Buttons - Upgraded Contrast & Targets */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6 w-full sm:w-auto">
                  <button
                    onClick={() => navigate('/register')}
                    className="group w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-[#0B1C30] hover:bg-[#1E3E66] text-white text-sm font-extrabold px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-slate-900/10 cursor-pointer"
                  >
                    Daftar Gratis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full sm:w-auto h-12 inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 text-sm font-extrabold px-8 rounded-xl transition-all duration-300 border border-slate-200 active:scale-[0.98] shadow-sm cursor-pointer"
                  >
                    Login Peserta
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right Column — Stacked Visuals with Floating Cards */}
            <div className="lg:col-span-6 relative flex justify-center mt-10 lg:mt-0">
              <Reveal direction="up" duration={900} delay={300}>
                <div className="relative w-full max-w-[420px] sm:max-w-[460px] px-6">

                  {/* Decorative background ring */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-3xl -rotate-3 scale-105 pointer-events-none border border-slate-100"></div>

                  {/* Main Stacked Image Card */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white p-2.5 rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col z-10">
                    <img
                      src={homeImg}
                      alt="Wildan Alwi - Mentor Utama"
                      className="w-full object-cover rounded-2xl"
                    />

                    {/* Badge Name */}
                    <div className="mt-3 py-2 bg-slate-50 rounded-xl border border-slate-200/50 flex items-center justify-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                      <p className="text-xs font-black text-slate-800 tracking-wider uppercase">
                        Wildan Alwi — Mentor Utama
                      </p>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ KELEBIHAN SECTION (REFINED AESTHETICS) ━━━ */}
      <section id="kelebihan" className="py-20 sm:py-28 lg:py-32 bg-slate-50/50 border-b border-slate-100 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Kelebihan Platform</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Mengapa Belajar di <span className="text-gradient-blue">Wildan CASN</span>?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Kami berkomitmen mendampingi perjalanan belajar Anda dengan fasilitas andalan terbaik demi mengamankan NIP impian Anda.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Award className="h-6 w-6 text-blue-600" />,
                title: 'Tutor Berpengalaman',
                desc: 'Belajar langsung dengan para mentor profesional yang memiliki rekam jejak sukses meluluskan ribuan calon ASN.'
              },
              {
                icon: <Monitor className="h-6 w-6 text-blue-600" />,
                title: 'Sistem CAT Identik BKN',
                desc: 'Simulasi ujian CAT dengan format tampilan, limit waktu, tombol ragu-ragu, dan pembobotan skor persis aslinya.'
              },
              {
                icon: <FileText className="h-6 w-6 text-blue-600" />,
                title: 'Bank Soal Terupdate',
                desc: 'Akses ke ribuan soal latihan terbaru yang diperbarui berkala berdasarkan Field Report (FR) peserta ujian.'
              },
              {
                icon: <Layers className="h-6 w-6 text-blue-600" />,
                title: 'Materi Terstruktur & Rapi',
                desc: 'Kurikulum belajar terorganisir lengkap mulai dari tingkat dasar, mempermudah Anda menguasai tiap kompetensi.'
              },
              {
                icon: <Lightbulb className="h-6 w-6 text-blue-600" />,
                title: 'Tips & Trik Taktis',
                desc: 'Kiat praktis serta taktik jitu pengerjaan soal kurang dari 50 detik demi menghemat alokasi waktu ujian.'
              },
              {
                icon: <Coffee className="h-6 w-6 text-blue-600" />,
                title: 'Belajar Interaktif & Seru',
                desc: 'Pendekatan edukatif yang interaktif dan dinamis, menjaga fokus belajar Anda tetap prima tanpa jenuh.'
              }
            ].map((item, i) => (
              <Reveal key={i} direction="up" delay={100 * (i + 1)} duration={700}>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start gap-4 h-full group">
                  <div className="h-12 w-12 rounded-xl bg-blue-50/50 flex items-center justify-center group-hover:bg-[#0B1C30] group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES SECTION (SPLIT SCREEN BROWSER MOCKUP) ━━━ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-white" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Fitur Platform</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Bukan Sekadar Bank Soal Biasa
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto">
                Kami membangun sistem simulasi CAT yang mereplikasi seluruh aspek teknis ujian sesungguhnya agar mental Anda terbiasa dengan tekanan waktu.
              </p>
            </div>
          </Reveal>

          {/* Interactive Split Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Interactive Browser Mockup */}
            <div className="lg:col-span-7 bg-slate-50 p-4 rounded-3xl border border-slate-200/70 shadow-xl relative overflow-hidden">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 block"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400 block"></span>
                </div>
                <div className="bg-white/80 border border-slate-200/60 rounded-lg px-6 py-0.5 text-[10px] text-slate-400 font-mono tracking-wide">
                  wildancasn.id/simulasi-cat
                </div>
                <div className="w-10"></div>
              </div>

              {/* Dynamic Screen Mockup Content */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 min-h-[300px] flex flex-col justify-between text-left text-xs font-semibold relative overflow-hidden">
                {activeFeature === 0 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                      <span className="font-extrabold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">SUB-TES: TIU</span>
                      <span className="font-mono text-red-500 font-bold">Sisa Waktu: 01:32:04</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Soal No 12 dari 110</p>
                      <p className="text-slate-800 text-[13px] leading-relaxed font-bold">
                        Sebuah mobil melaju dengan kecepatan rata-rata 80 km/jam selama 3 jam 45 menit. Berapakah jarak total yang ditempuh mobil tersebut?
                      </p>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      {['A. 280 km', 'B. 300 km', 'C. 320 km', 'D. 340 km'].map((opt, i) => (
                        <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors cursor-pointer ${i === 1 ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500 text-blue-700' : 'border-slate-100 hover:bg-slate-50'}`}>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${i === 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'}`}>{i === 1 && '✓'}</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">Ragu-Ragu</span>
                      <button className="bg-[#0B1C30] text-white px-4 py-2 rounded-xl text-[10px] font-bold border-0">Simpan & Lanjutkan</button>
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
                      <div className="grid grid-cols-12 bg-slate-100 p-2 rounded-lg text-[10px] text-slate-400 font-bold uppercase">
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
                          <span className="col-span-2 text-center font-bold text-slate-800">#{u.rank}</span>
                          <span className="col-span-5 font-bold text-slate-800">{u.name}</span>
                          <span className="col-span-3 text-center font-black text-blue-700">{u.score}</span>
                          <span className="col-span-2 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Lolos</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeFeature === 2 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/50 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                      <div>
                        <h4 className="font-extrabold text-emerald-800 text-[11px] uppercase tracking-wider">Kunci Jawaban & Pembahasan</h4>
                        <p className="text-slate-600 text-[11px] mt-0.5">Kunci Jawaban: <span className="font-bold text-emerald-700">B (300 km)</span></p>
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
                    className={`p-5 sm:p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${isActive
                      ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-3.5 mb-2.5">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isActive ? 'bg-[#0B1C30] text-white' : 'bg-slate-50 text-slate-500'}`}>
                        {item.icon}
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">{item.title}</h3>
                    </div>
                    <p className="text-xs sm:text-xs text-slate-500 font-semibold leading-relaxed pl-12">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS (WITH CONNECTORS) ━━━ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-slate-100/40 border-y border-slate-200/50 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <Reveal direction="right" duration={800}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Tiga Langkah Mudah
                  <br />
                  <span className="text-gradient-blue">Menjadi Abdi Negara.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed mt-3">
                  Kami merancang alur persiapan belajar Anda secara runtut dan terarah agar Anda dapat memetakan kemaan materi secepat mungkin.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center lg:justify-start gap-2 h-12 text-sm font-black text-blue-750 hover:text-blue-900 transition-colors group mt-6 w-full sm:w-auto"
                >
                  <span>Mulai Langkah Pertama Anda Sekarang</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Reveal>
            </div>

            <div className="space-y-6 relative">
              {/* Connector line decoration for desktop/vertical layout */}
              <div className="absolute top-8 bottom-8 left-11 w-0.5 border-l-2 border-dashed border-slate-200/80 z-0"></div>

              {[
                { step: '1', title: 'Registrasi Akun Mudah & Cepat', desc: 'Buat akun belajar dalam hitungan detik menggunakan alamat email Anda secara gratis tanpa langkah rumit.' },
                { step: '2', title: 'Akses Materi & Simulasi CAT', desc: 'Dapatkan akses eksklusif untuk mencoba try out latihan, materi ringkasan, dan modul bank soal terupdate.' },
                { step: '3', title: 'Tingkatkan Skor & Lolos Passing Grade', desc: 'Pantau peningkatan skor Anda secara berkala, evaluasi kesalahan, dan raih passing grade impian BKN.' },
              ].map((item, i) => (
                <Reveal key={i} direction="left" delay={100 * (i + 1)} duration={600}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex gap-4 sm:gap-5 hover:border-slate-350 transition-colors shadow-sm relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1C30] text-white flex items-center justify-center text-sm font-black flex-shrink-0 shadow-md shadow-[#0B1C30]/10">
                      {item.step}
                    </div>
                    <div className="text-left">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIAL SECTION (MULTI-CARD GRID) ━━━ */}
      <section id="testimonials" className="py-20 sm:py-28 lg:py-32 bg-[#0B1C30] text-white relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full inline-block">Testimonial Alumni</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Kisah Sukses Alumni WILDAN CASN
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-semibold max-w-2xl mx-auto">
                Mereka telah membuktikannya. Bergabung sekarang dan jadilah salah satu dari barisan abdi negara berikutnya.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Andi Pratama',
                role: 'CPNS 2025 — Kementerian Keuangan RI',
                initials: 'AP',
                comment: 'Sistem simulasinya luar biasa membantu. Saya merasa sangat familiar dengan durasi, sisa waktu, dan navigasi lembar jawaban CAT saat ujian SKD asli berlangsung. Lolos passing grade Kemenkeu!'
              },
              {
                name: 'Riska Indah',
                role: 'CPNS 2025 — Kementerian Hukum & HAM',
                initials: 'RI',
                comment: 'Soal-soal latihan TWK dan TIU di Wildan CASN benar-benar mirip dengan yang keluar saat tes. Tips pengerjaan dari tutor membantu saya menghemat waktu pengerjaan soal TIU.'
              },
              {
                name: 'Budi Hartono',
                role: 'P3K 2025 — Pemerintah Provinsi Jawa Barat',
                initials: 'BH',
                comment: 'Live ranking nasional sangat memacu semangat belajar saya agar terus meningkatkan skor. Pembahasannya juga sangat mudah dipahami bahkan untuk pemula sekalipun.'
              }
            ].map((testi, i) => (
              <Reveal key={i} direction="up" delay={150 * i} duration={700}>
                <div className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between h-full hover:border-slate-700 transition-colors">
                  <div className="space-y-4 text-left">
                    <div className="flex gap-1">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold italic">
                      "{testi.comment}"
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-800 mt-6 text-left">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-black border border-blue-500/20 text-xs flex-shrink-0">
                      {testi.initials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-extrabold text-xs sm:text-sm text-white truncate">{testi.name}</p>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5 truncate">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━ FAQ SECTION (ELEGANT ACCORDION CARDS) ━━━ */}
      <section className="py-20 sm:py-28 lg:py-32" id="faq">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={700}>
            <div className="text-center mb-12 space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">Bantuan & FAQ</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:border-slate-300 transition-colors">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between text-left p-5 min-h-[56px] focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-800 hover:text-blue-700 transition-colors pr-6">{item.q}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-655' : ''}`} />
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
      </section>

      {/* ━━━ FINAL CTA SECTION (CLEAN GRADIENT BG) ━━━ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-[#0B1C30] text-white relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <Reveal direction="up" duration={800}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Persiapkan Karir Masa Depan Anda
              <br />
              <span className="text-blue-400">Sebagai ASN Sekarang Juga.</span>
            </h2>

            <p className="text-slate-400 font-semibold max-w-md mx-auto leading-relaxed text-xs sm:text-sm pt-2">
              Mulai latihan gratis sekarang. Tingkatkan ke materi premium saat Anda sudah siap untuk serius mengamankan NIP.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto">
              <button
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-sm font-black px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg cursor-pointer"
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