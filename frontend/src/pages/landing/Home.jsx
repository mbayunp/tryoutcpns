import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Play, Star, ChevronDown, Sparkles, Trophy, Users, BookOpen, ShieldCheck, Heart } from 'lucide-react';
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

      {/* ━━━ HERO SECTION ━━━ */}
      <section id="beranda" className="relative overflow-hidden bg-white border-b border-slate-100 bg-grid-pattern pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
        
        {/* Glow Blobs background */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-400/10 blur-[80px] sm:blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left — Copy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <Reveal direction="up" duration={800} delay={100}>
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-blue-600 bg-blue-50/80 border border-blue-100/50 backdrop-blur-md rounded-full px-4 py-1.5 uppercase shadow-sm mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                  <span>Pendaftaran CASN 2026 Dibuka</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-extrabold leading-[1.15] lg:leading-[1.1] tracking-tight text-slate-900">
                  Simulator Ujian CASN 
                  <br />
                  <span className="text-gradient-blue">100% Persis</span>
                  <br />
                  Sistem CAT BKN Asli
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-500 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium mt-4">
                  Kuasai materi TWK, TIU, dan TKP dengan sistem CAT yang identik, pembahasan video oleh mentor ASN, dan perangkingan nasional real-time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold px-8 py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-blue-500/20"
                  >
                    Mulai Ujian Gratis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <a
                    href="#features"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-3"
                  >
                    <span className="w-10 h-10 rounded-full border border-slate-200/80 bg-white flex items-center justify-center shadow-sm group-hover:border-blue-500/30 group-hover:bg-blue-50/50 transition-all duration-200">
                      <Play className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-600 fill-current" />
                    </span>
                    <span>Lihat Fitur</span>
                  </a>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-6 border-t border-slate-100 max-w-sm mx-auto lg:mx-0 mt-6">
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

                {/* ─── MINI QUIZ INTERAKTIF ─── */}
                <div className="mt-8 border border-slate-200 bg-slate-50/50 backdrop-blur-md p-6 rounded-2xl text-left space-y-4 max-w-md mx-auto lg:mx-0 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Coba Simulasi Mini TIU
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Deret Geometri</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed">
                    Tentukan angka berikutnya dalam deret berikutnya:<br />
                    <span className="font-mono text-blue-600 text-sm">2, 4, 8, 16, ...</span>
                  </p>

                  <div className="grid grid-cols-5 gap-1.5">
                    {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                      const textMap = { A: '20', B: '24', C: '32', D: '36', E: '40' };
                      const isSelected = selectedQuizOption === opt;
                      const isCorrect = opt === 'C';
                      
                      let btnClass = 'bg-white border-slate-200 hover:border-slate-350 text-slate-700';
                      if (quizLocked) {
                        if (isCorrect) {
                          btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-50 border-rose-500 text-rose-700 font-bold';
                        } else {
                          btnClass = 'bg-white border-slate-100 text-slate-300 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={quizLocked}
                          onClick={() => {
                            setSelectedQuizOption(opt);
                            setQuizLocked(true);
                          }}
                          className={`h-10 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center border cursor-pointer ${btnClass}`}
                        >
                          <span className="text-[9px] text-slate-400 font-semibold mb-0.5 block">{opt}</span>
                          <span>{textMap[opt]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizLocked && (
                    <div className="space-y-3.5 pt-1 animate-slideDown">
                      <div className="p-3 bg-white border border-slate-100 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Pembahasan</p>
                        <p className="text-xs text-slate-650 font-medium leading-relaxed">
                          Deret ini merupakan deret geometri dengan rasio r = 2. Setiap suku berikutnya dikalikan 2 dari suku sebelumnya: 16 x 2 = <span className="font-bold text-emerald-600">32</span>.
                        </p>
                      </div>

                      {/* CTA Banner */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl space-y-2.5 shadow-md">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-extrabold">
                            Skor Anda: <span className="text-yellow-300 font-mono text-sm">{selectedQuizOption === 'C' ? '+5' : '+0'}</span>
                          </p>
                          <span className="text-[9px] bg-white/20 border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase">Gratis</span>
                        </div>
                        <p className="text-[10px] opacity-90 font-semibold leading-relaxed">
                          Daftar Akun Gratis Sekarang untuk Menyimpan Skor dan Melihat Peringkat Nasional Anda!
                        </p>
                        <button
                          onClick={() => navigate('/register')}
                          className="w-full bg-white hover:bg-slate-100 text-blue-600 font-extrabold py-2 px-3 rounded-lg text-xs transition-colors border-0 cursor-pointer shadow flex items-center justify-center gap-1.5"
                        >
                          <span>Daftar Akun Sekarang</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right — Image & Floating Cards */}
            <div className="lg:col-span-6 relative flex justify-center mt-6 lg:mt-0">
              <Reveal direction="up" duration={900} delay={300}>
                <div className="relative w-full max-w-[450px] lg:max-w-[500px]">
                  {/* Background decorative ring */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-3xl -rotate-2 scale-105 pointer-events-none border border-slate-100"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-2xl bg-white p-2 glow-blue">
                    <img
                      src={homeImg}
                      alt="Dashboard CAT WILDAN CASN"
                      className="w-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Floating Metric Card 1 */}
                  <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-premium-lg px-5 py-4 hidden sm:block animate-float">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rasio Lolos</p>
                        <p className="text-2xl font-extrabold text-slate-800">85.2%</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Metric Card 2 */}
                  <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-premium-lg px-5 py-4 hidden sm:block animate-float animation-delay-2000">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aktif Berlatih</p>
                        <p className="text-lg font-extrabold text-slate-800">50k+ User</p>
                      </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
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

      {/* ━━━ FEATURES SECTION ━━━ */}
      <section className="py-16 sm:py-24 lg:py-32" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={700}>
            <div className="max-w-2xl mb-12 sm:mb-16 space-y-3 sm:space-y-4 text-center lg:text-left">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kenapa WILDAN CASN</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Bukan sekadar bank soal. 
                <br />
                <span className="text-gradient">Ini simulator ujian yang sebenarnya.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">Kami membangun sistem yang menduplikasi setiap aspek teknis ujian CAT sesungguhnya agar Anda terbiasa dengan tekanan waktu di lapangan.</p>
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
                <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/50 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5 group h-full">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200 shadow-sm border border-slate-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-slate-100/40 border-y border-slate-200/50 bg-grid-pattern-dense">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <Reveal direction="right" duration={800}>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Cara Kerja</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Empat langkah praktis
                  <br />
                  <span className="text-gradient-blue">menuju kelulusan ASN.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed mt-3">
                  Kami merancang perjalanan persiapan belajar Anda secara runtut dan terarah agar Anda dapat mengidentifikasi kelemahan materi dengan cepat.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group mt-4"
                >
                  <span>Mulai langkah pertama</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Reveal>
            </div>

            <div className="space-y-4 mt-6 lg:mt-0">
              {[
                { step: '1', title: 'Registrasi Akun Mudah', desc: 'Buat akun dalam hitungan detik menggunakan alamat email Anda secara gratis tanpa ribet.' },
                { step: '2', title: 'Pilih Paket Tryout', desc: 'Mulai dengan uji coba gratis, atau buka akses ke puluhan materi premium kisi-kisi terupdate.' },
                { step: '3', title: 'Kerjakan Simulasi CAT', desc: 'Rasakan simulasi ujian SKD (TWK, TIU, TKP) dengan pengatur waktu persis aslinya.' },
                { step: '4', title: 'Analisis Hasil Detail', desc: 'Dapatkan grafik skor kelulusan, ringkasan per sub-kategori materi, dan penjelasan pembahasan.' }
              ].map((item, i) => (
                <Reveal key={i} direction="left" delay={100 * (i + 1)} duration={600}>
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/50 p-5 sm:p-6 flex gap-4 sm:gap-5 hover:border-slate-300 transition-colors shadow-sm">
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

      {/* ━━━ PRICING SECTION ━━━ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white" id="programs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal direction="up" duration={750}>
            <div className="text-center mb-12 sm:mb-20 max-w-xl mx-auto space-y-3 sm:space-y-4">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Harga Paket</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Investasi masa depan sekali bayar.
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">Beli sekali untuk akses selamanya. Tanpa biaya bulanan atau biaya tersembunyi.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {[
              {
                name: 'Starter Pack',
                price: '99.000',
                desc: 'Sangat cocok untuk pemula yang ingin memahami pola dasar soal SKD.',
                features: ['5 Paket Tryout Premium', 'Pembahasan PDF Detil', 'Statistik Ringkasan Nilai', 'Akses Akun Selamanya'],
                highlighted: false
              },
              {
                name: 'Mastery Pack',
                price: '199.000',
                desc: 'Paket terlengkap. Direkomendasikan untuk persiapan matang.',
                features: ['20+ Paket Tryout SKD Premium', 'Pembahasan Video Tiap Soal', 'VIP Telegram Group + Mentoring', 'E-Book Ringkasan Materi', 'Analisis Kelemahan Kategori', 'Akses Akun Selamanya'],
                highlighted: true
              },
              {
                name: 'Bootcamp Pack',
                price: '499.000',
                desc: 'Kelas bimbingan eksklusif terpadu dipandu langsung mentor ASN.',
                features: ['Semua Fitur Paket Mastery', 'Live Class Mingguan', 'Review Berkas Portofolio', 'Simulasi Wawancara Kerja', 'Akses Akun Selamanya'],
                highlighted: false
              }
            ].map((plan, i) => (
              <Reveal key={i} direction="up" delay={100 * (i + 1)} duration={800}>
                <div
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 h-full ${
                    plan.highlighted
                      ? 'bg-slate-900 text-white ring-2 ring-blue-600 shadow-2xl relative lg:scale-105 lg:-translate-y-2 z-10'
                      : 'bg-white ring-1 ring-slate-200/80 hover:ring-slate-300 hover:shadow-premium'
                  }`}
                >
                  <div className="relative">
                    {plan.highlighted && (
                      <div className="absolute -top-10 lg:-top-12 left-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                        Pilihan Utama
                      </div>
                    )}

                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlighted ? 'text-blue-400' : 'text-blue-600'}`}>
                      {plan.name}
                    </p>
                    
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-[10px] font-bold text-slate-400">Rp</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium">/sekali</span>
                    </div>

                    <p className={`text-xs sm:text-sm mb-6 font-medium leading-relaxed ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.desc}
                    </p>

                    <div className={`w-full h-px my-6 ${plan.highlighted ? 'bg-slate-800' : 'bg-slate-100'}`} />

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-xs sm:text-sm text-left">
                          <Check className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-400' : 'text-emerald-500'}`} />
                          <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 active:scale-[0.98] mt-4 ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                    }`}
                  >
                    Pilih {plan.name}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIAL SECTION ━━━ */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-slate-900 text-white border-y border-slate-800 bg-grid-pattern relative">
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
      <section className="py-16 sm:py-24 lg:py-32" id="faq">
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
                    className="w-full flex items-center justify-between text-left group"
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
      <section className="py-16 sm:py-24 lg:py-28 bg-slate-900 text-white relative overflow-hidden bg-grid-pattern">
        
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-blue-600 text-slate-900 hover:text-white text-xs sm:text-sm font-bold px-8 py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-blue-500/20"
                >
                  Daftar Ujian Gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#programs"
                  className="text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors py-3"
                >
                  Lihat Program Paket →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}