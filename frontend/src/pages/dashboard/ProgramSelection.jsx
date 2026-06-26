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
      icon: <Landmark className="h-10 w-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/20',
      badge: 'CPNS & KEDINASAN'
    },
    {
      id: 'PPPK',
      title: 'PPPK',
      subtitle: 'Pegawai Pemerintah dengan Perjanjian Kerja',
      description: 'Latihan soal kompetensi teknis, manajerial, sosio-kultural, dan wawancara untuk seleksi PPPK Guru dan Non-Guru.',
      icon: <Briefcase className="h-10 w-10 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border-indigo-500/30 hover:border-indigo-400/60 shadow-indigo-950/20',
      badge: 'GURU & NON-GURU'
    },
    {
      id: 'PPG',
      title: 'PPG',
      subtitle: 'Pendidikan Profesi Guru',
      description: 'Persiapan ujian seleksi akademik / pretest dan UKMPPG untuk sertifikasi guru dalam jabatan maupun prajabatan.',
      icon: <GraduationCap className="h-10 w-10 text-amber-400 group-hover:scale-110 transition-transform duration-300" />,
      colorClass: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/20',
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
      <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden font-sans">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-600/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
          {/* Header text */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-800" />
              <span className="font-extrabold text-sm text-slate-350 tracking-wider">WILDAN CASN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Pilih Ruang Belajar Anda
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Selamat datang kembali! Silakan pilih program belajar yang ingin Anda akses hari ini. Anda dapat berpindah program kapan saja dari menu utama.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => handleSelectProgram(program.id)}
                className={`group text-left flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-900 bg-opacity-40 border backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${program.colorClass}`}
              >
                <div className="space-y-6">
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-900 bg-opacity-60 rounded-2xl border border-slate-800 ring-1 ring-white/5">
                      {program.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400 bg-slate-900 bg-opacity-65 px-3 py-1 rounded-full border border-slate-800">
                      {program.badge}
                    </span>
                  </div>

                  {/* Program Titles */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {program.subtitle}
                    </p>
                  </div>

                  {/* Program Description */}
                  <p className="text-xs text-slate-450 leading-relaxed font-medium">
                    {program.description}
                  </p>
                </div>

                {/* Card Button Indicator */}
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
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
