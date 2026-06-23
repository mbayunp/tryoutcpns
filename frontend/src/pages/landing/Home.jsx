import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, Play, Star, ChevronDown, Sparkles, Trophy, Users, BookOpen, Award, Monitor, FileText, Layers, Lightbulb, Coffee } from 'lucide-react';
import homeImg from '../../components/images/home.png';
import Reveal from '../../components/common/Reveal';

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizLocked, setQuizLocked] = useState(false);

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-500/10 selection:text-blue-700">
      <Helmet>
        <title>Tryout Akbar CASN 2026 - WILDAN CASN</title>
      </Helmet>

      {/* ━━━ HERO SECTION ━━━ */}
      <section id="beranda" className="relative overflow-hidden bg-white border-b border-slate-100 bg-grid-pattern pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-20 lg:pb-16 lg:min-h-[calc(100vh-162px)] lg:flex lg:items-center">

        {/* Glow Blobs background */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left — Copy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <Reveal direction="up" duration={800} delay={100}>
                {/* Brand & Logo */}
                <div className="flex flex-col items-center lg:items-start gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-xl shadow-premium border border-slate-100 flex items-center justify-center">
                      <img src="/logo.jpg" alt="Logo Wildan CASN" className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-xl" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-normal">
                      WILDAN <span className="text-blue-700">CASN</span>
                    </h1>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-500 leading-relaxed text-center lg:text-left max-w-lg">
                    Temani belajar hari ini, wujudkan impian esok hari
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 pt-3 lg:pt-2 w-full md:w-auto">
                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full md:w-auto h-12 inline-flex items-center justify-center gap-2.5 bg-blue-750 hover:bg-blue-800 text-black text-sm font-bold px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-blue-500/20 shadow-blue-500/10 cursor-pointer"
                  >
                    Mulai Belajar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full md:w-auto h-12 inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-slate-500/10 cursor-pointer"
                  >
                    Login
                  </button>

                  <a
                    href="#features"
                    className="group w-full md:w-auto h-12 inline-flex items-center justify-center gap-3 text-sm font-bold text-slate-655 hover:text-slate-950 transition-colors py-3"
                  >
                    <span className="w-10 h-10 rounded-full border border-slate-200/80 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-500/30 group-hover:bg-blue-50/50 transition-all duration-200 flex-shrink-0">
                      <Play className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-700 fill-current" />
                    </span>
                    <span>Lihat Fitur</span>
                  </a>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3.5 lg:pt-3 border-t border-slate-100 max-w-sm mx-auto lg:mx-0 mt-4 lg:mt-3">
                  <div className="flex -space-x-2.5">
                    {['bg-blue-600', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'].map((bg, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${bg} ring-2 ring-white flex items-center justify-center text-[10px] font-extrabold text-white shadow-sm`}>
                        {['WK', 'AP', 'RN', 'DS'][i]}
                      </div>
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-bold text-slate-700">4.9★ <span className="text-[11px] sm:text-xs text-slate-400 font-medium">dari 12,800+ Peserta</span></p>
                    <p className="text-[10px] sm:text-[11px] text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Telah Lolos SKD CASN</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Image & Keterangan */}
            <div className="lg:col-span-6 relative flex justify-center mt-6 lg:mt-0">
              <Reveal direction="up" duration={900} delay={300}>
                <div className="relative w-full max-w-[450px] lg:max-w-[500px]">
                  {/* Background decorative ring */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-3xl -rotate-2 scale-105 pointer-events-none border border-slate-100"></div>

                  {/* Image Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-2xl bg-white p-2 glow-blue flex flex-col">
                    <img
                      src={homeImg}
                      alt="Wildan Alwi - WILDAN CASN"
                      className="w-full object-cover rounded-xl"
                    />

                    {/* Keterangan Wildan Alwi */}
                    <div className="mt-2 py-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                        Wildan Alwi
                      </p>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TRUSTED BY / LOGO BAR ━━━ */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-3.5">
          <Reveal direction="up" duration={600} delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Sesuai Kisi-Kisi BKN Terbaru</span>
              </div>
              <div className="flex items-center justify-center gap-2 border-y sm:border-y-0 sm:border-x border-slate-800 py-2 sm:py-0">
                <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Kurikulum Simulasi SKD 2026</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Modul Soal Terintegrasi</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ KELEBIHAN SECTION ━━━ */}
      <section id="kelebihan" className="py-20 sm:py-28 lg:py-36 bg-slate-50/50 border-b border-slate-100 bg-grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={700}>
            <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kelebihan Kami</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Mengapa Belajar di <span className="text-gradient-blue">Wildan CASN</span>?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Kami berkomitmen mendampingi perjalanan belajar Anda dengan fasilitas andalan terbaik.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Award className="h-6 w-6 text-blue-600" />,
                title: 'Tutor berpengalaman',
                desc: 'Belajar langsung dengan para mentor profesional yang memiliki rekam jejak sukses membimbing calon ASN.'
              },
              {
                icon: <Monitor className="h-6 w-6 text-indigo-600" />,
                title: 'Sistem TO sesuai dengan tes aslinya',
                desc: 'Simulasi ujian menggunakan CAT dengan format tampilan, durasi, dan bobot nilai yang persis aslinya.'
              },
              {
                icon: <FileText className="h-6 w-6 text-emerald-600" />,
                title: 'Soal terbaru',
                desc: 'Akses ke koleksi soal terupdate yang terus diperbarui berdasarkan kisi-kisi BKN dan field report.'
              },
              {
                icon: <Layers className="h-6 w-6 text-amber-600" />,
                title: 'Materi Terstruktur',
                desc: 'Kurikulum belajar terorganisir rapi mulai tingkat dasar agar Anda menguasai setiap subtopik.'
              },
              {
                icon: <Lightbulb className="h-6 w-6 text-rose-600" />,
                title: 'Tips pengerjaan soal',
                desc: 'Kiat praktis serta taktik jitu dalam mengerjakan soal dengan cepat untuk menghemat alokasi waktu.'
              },
              {
                icon: <Coffee className="h-6 w-6 text-teal-600" />,
                title: 'Belajar bersama tanpa ngantuk',
                desc: 'Pendekatan edukatif yang interaktif dan dinamis untuk menjaga fokus Anda tetap prima sepanjang sesi.'
              }
            ].map((item, i) => (
              <Reveal key={i} direction="up" delay={100 * (i + 1)} duration={700}>
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 h-full group">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200 shadow-sm border border-slate-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 lg:py-36" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="max-w-2xl mb-12 sm:mb-16 space-y-3 sm:space-y-4 text-center lg:text-left">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kenapa WILDAN CASN</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Bukan sekadar bank soal.
                <br />
                <span className="text-gradient">Ini simulator ujian yang sebenarnya.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">Kami membangun sistem yang menduplikasi setiap aspek teknis ujian CAT sesungguhnya agar Anda terbiasa dengan tekanan waktu di lapangan.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Trophy className="h-6 w-6 text-blue-600" />,
                title: 'Simulasi CAT 1:1 BKN',
                desc: 'Tampilan antarmuka, timer hitung mundur, tata letak soal, navigasi lembar jawaban, hingga tombol ragu-ragu dibuat persis 100% seperti ujian asli.'
              },
              {
                icon: <Users className="h-6 w-6 text-indigo-600" />,
                title: 'Live Ranking Nasional',
                desc: 'Ketahui nilai kelulusan Anda secara real-time. Skor Anda akan disandingkan dengan puluhan ribu peserta lainnya se-Indonesia per sub-kategori.'
              },
              {
                icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
                title: 'Evaluasi & Pembahasan Soal',
                desc: 'Setiap soal dilengkapi pembahasan terperinci. Pelajari trik pengerjaan cepat ala mentor ASN untuk memaksimalkan perolehan poin Anda.'
              }
            ].map((item, i) => (
              <Reveal key={i} direction="up" delay={100 * (i + 1)} duration={700}>
                <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5 group h-full">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200 shadow-sm border border-slate-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-20 sm:py-28 lg:py-36 bg-slate-100/40 border-y border-slate-200/50 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <Reveal direction="right" duration={800}>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Cara Kerja</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Tiga langkah
                  <br />
                  <span className="text-gradient-blue">menjadi ASN.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed mt-3">
                  Kami merancang perjalanan persiapan belajar Anda secara runtut dan terarah agar Anda dapat mengidentifikasi kelemahan materi dengan cepat.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center md:justify-start gap-2 h-12 text-sm font-bold text-blue-650 hover:text-blue-800 transition-colors group mt-4 w-full md:w-auto"
                >
                  <span>Mulai langkah pertama</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Reveal>
            </div>

            <div className="space-y-4 mt-6 lg:mt-0">
              {[
                { step: '1', title: 'Registrasi Akun Mudah', desc: 'Buat akun dalam hitungan detik menggunakan alamat email Anda secara gratis tanpa ribet.' },
                { step: '2', title: 'Mulai Belajar', desc: 'Dapatkan akses eksekutif terhadap bimbel, try out, materi dan soal.' },
                { step: '3', title: 'Jadi Juara', desc: 'Tingkatkan skor dan jadi juara bersama kami.' },
              ].map((item, i) => (
                <Reveal key={i} direction="left" delay={100 * (i + 1)} duration={600}>
                  <div className="bg-white/80 backdrop-blur-md rounded-xl border border-slate-200/50 p-5 sm:p-6 flex gap-4 sm:gap-5 hover:border-slate-350 transition-colors shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-[15px] text-slate-800 mb-1 text-left">{item.title}</h3>
                      <p className="text-left text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIAL SECTION ━━━ */}
      <section id="testimonials" className="py-20 sm:py-28 lg:py-36 bg-slate-900 text-white border-y border-slate-800 bg-grid-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="up" duration={800}>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-center gap-1">
                {Array(5).fill(null).map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-base sm:text-lg lg:text-2xl font-bold leading-normal tracking-tight text-slate-100 max-w-2xl mx-auto">
                "Sistem simulasinya luar biasa membantu. Saya merasa sangat familiar dengan durasi, sisa waktu, dan navigasi lembar jawaban CAT saat ujian SKD asli berlangsung. Syukur, saya berhasil lolos passing grade Kemenkeu!"
              </blockquote>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-extrabold border border-blue-500/30 text-xs">
                  AP
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-white">Andi Pratama</p>
                  <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">CPNS 2025 — Kementerian Keuangan RI</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ FAQ SECTION ━━━ */}
      <section className="py-20 sm:py-28 lg:py-36" id="faq">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" duration={700}>
            <div className="text-center mb-10 sm:mb-16 space-y-3">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">FAQ</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
            </div>
          </Reveal>

          <div className="divide-y divide-slate-200/60 border-t border-b border-slate-200/60">
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
                q: 'Apakah saya bisa melihat pembahasan setelah submit?',
                a: 'Tentu saja. Begitu ujian diselesaikan, Anda akan diarahkan ke halaman evaluasi lengkap. Anda dapat membaca pembahasan detail per butir soal untuk memahami konsep materi yang diujikan.'
              },
              {
                q: 'Apakah bank soal diupdate berkala?',
                a: 'Ya. Kami memperbarui bank soal secara berkala menyesuaikan field report (FR) terbaru dari para peserta ujian SKD CPNS periode sebelumnya dan kisi-kisi resmi yang diterbitkan oleh BKN.'
              }
            ].map((item, i) => (
              <Reveal key={i} direction="up" delay={50 * i} duration={600}>
                <div className="py-4 sm:py-5">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between text-left group min-h-[48px]"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors pr-6">{item.q}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 pr-8 font-medium animate-slideDown">{item.a}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA SECTION ━━━ */}
      <section className="py-20 sm:py-28 lg:py-36 bg-slate-900 text-white relative overflow-hidden bg-grid-pattern">

        {/* Glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="up" duration={800}>
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Persiapkan karir masa depan Anda
                <br />
                <span className="text-blue-400">sekarang juga.</span>
              </h2>

              <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed text-xs sm:text-sm">
                Mulai latihan secara gratis tanpa ikatan. Tingkatkan ke materi premium saat Anda sudah siap untuk serius lulus.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 w-full md:w-auto">
                <button
                  onClick={() => navigate('/login')}
                  className="group w-full md:w-auto h-12 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-blue-600 text-slate-900 hover:text-white text-sm font-bold px-8 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                >
                  Mulai Belajar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}