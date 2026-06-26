import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { GraduationCap, Briefcase, Landmark } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ProgramSelection() {
  const navigate = useNavigate();
  const setActiveProgram = useExamStore((state) => state.setActiveProgram);

  const programs = [
    {
      id: 'SKD',
      title: 'SKD CPNS',
      subtitle: 'Seleksi Kompetensi Dasar',
      description: 'Persiapan Tes Wawasan Kebangsaan (TWK), Tes Inteligensia Umum (TIU), dan Tes Karakteristik Pribadi (TKP) CPNS & Sekolah Kedinasan.',
      icon: <Landmark className="h-10 w-10 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'bg-gradient-to-b from-white to-white hover:from-white hover:to-emerald-50/20 border-slate-200/80 hover:border-emerald-300 shadow-premium hover:shadow-premium-lg hover:shadow-emerald-100/30',
      iconContainerClass: 'bg-emerald-50/50 border-emerald-100/50 group-hover:bg-emerald-50 group-hover:border-emerald-200',
      badgeClass: 'text-emerald-700 bg-emerald-50/50 border-emerald-100/50',
      titleHoverClass: 'group-hover:text-emerald-700',
      btnHoverClass: 'group-hover:text-emerald-600',
      badge: 'CPNS & KEDINASAN'
    },
    {
      id: 'PPPK',
      title: 'PPPK',
      subtitle: 'Pegawai Pemerintah dengan Perjanjian Kerja',
      description: 'Latihan soal kompetensi teknis, manajerial, sosio-kultural, dan wawancara untuk seleksi PPPK Guru dan Non-Guru.',
      icon: <Briefcase className="h-10 w-10 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'bg-gradient-to-b from-white to-white hover:from-white hover:to-indigo-50/20 border-slate-200/80 hover:border-indigo-300 shadow-premium hover:shadow-premium-lg hover:shadow-indigo-100/30',
      iconContainerClass: 'bg-indigo-50/50 border-indigo-100/50 group-hover:bg-indigo-50 group-hover:border-indigo-200',
      badgeClass: 'text-indigo-700 bg-indigo-50/50 border-indigo-100/50',
      titleHoverClass: 'group-hover:text-indigo-700',
      btnHoverClass: 'group-hover:text-indigo-600',
      badge: 'GURU & NON-GURU'
    },
    {
      id: 'PPG',
      title: 'PPG',
      subtitle: 'Pendidikan Profesi Guru',
      description: 'Persiapan ujian seleksi akademik / pretest dan UKMPPG untuk sertifikasi guru dalam jabatan maupun prajabatan.',
      icon: <GraduationCap className="h-10 w-10 text-amber-600 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'bg-gradient-to-b from-white to-white hover:from-white hover:to-amber-50/20 border-slate-200/80 hover:border-amber-300 shadow-premium hover:shadow-premium-lg hover:shadow-amber-100/30',
      iconContainerClass: 'bg-amber-50/50 border-amber-100/50 group-hover:bg-amber-50 group-hover:border-amber-200',
      badgeClass: 'text-amber-800 bg-amber-50/50 border-amber-100/50',
      titleHoverClass: 'group-hover:text-amber-700',
      btnHoverClass: 'group-hover:text-amber-600',
      badge: 'SERTIFIKASI GURU'
    }
  ];

  const handleSelectProgram = (programId) => {
    setActiveProgram(programId);
    navigate('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Pilih Ruang Belajar - WILDAN CASN</title>
      </Helmet>
      <div className="w-full min-h-screen bg-slate-50 bg-grid-pattern flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden font-sans">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-400/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
          {/* Header text */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200" />
              <span className="font-extrabold text-sm text-slate-500 tracking-wider">WILDAN CASN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Pilih Ruang Belajar Anda
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Selamat datang kembali! Silakan pilih program belajar yang ingin Anda akses hari ini. Anda dapat berpindah program kapan saja dari menu utama.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => handleSelectProgram(program.id)}
                className={`group text-left flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white border backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${program.colorClass}`}
              >
                <div className="space-y-6">
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border transition-all duration-300 ${program.iconContainerClass}`}>
                      {program.icon}
                    </div>
                    <span className={`text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full border transition-all duration-300 ${program.badgeClass}`}>
                      {program.badge}
                    </span>
                  </div>

                  {/* Program Titles */}
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold text-slate-900 transition-colors ${program.titleHoverClass}`}>
                      {program.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      {program.subtitle}
                    </p>
                  </div>

                  {/* Program Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {program.description}
                  </p>
                </div>

                {/* Card Button Indicator */}
                <div className={`mt-8 flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors ${program.btnHoverClass}`}>
                  <span>Masuk Belajar</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

