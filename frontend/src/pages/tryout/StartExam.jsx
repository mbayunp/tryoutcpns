import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { useExamStore } from '../../store/useExamStore';
import { Clock, Award, ChevronLeft, ChevronRight, AlertCircle, Send, Cloud, Bookmark } from 'lucide-react';
import Swal from 'sweetalert2';

const formatTimer = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function StartExam() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    packages,
    fetchQuestions,
    startExamAttempt,
    submitExamAttempt
  } = useExamStore();

  const pkgId = location.state?.packageId || 1;
  const currentPkg = packages.find(p => p.id === pkgId) || { title: 'Simulasi CPNS', duration: 100 };

  const [loading, setLoading] = useState(true);
  const [examQuestions, setExamQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isExamInitialized, setIsExamInitialized] = useState(false);
  const [isCatMode, setIsCatMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(currentPkg.duration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [fontSize, setFontSize] = useState('md');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [allowExit, setAllowExit] = useState(false);
  const touchStartX = useRef(0);

  // Popstate history prevention (intercepts back button & mobile gestures)
  useEffect(() => {
    if (!isTimerRunning || allowExit) return;

    // Push dummy state so back gesture pops the dummy entry first
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      if (allowExit) return;
      // Re-push dummy state to keep user on exam screen
      window.history.pushState(null, '', window.location.href);
      setShowExitWarning(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isTimerRunning, allowExit]);

  // Browser reload/close protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isTimerRunning && !allowExit) {
        e.preventDefault();
        e.returnValue = ''; // Wajib untuk Chrome modern
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTimerRunning, allowExit]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    const threshold = 50;
    if (diffX > threshold) {
      setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1));
    } else if (diffX < -threshold) {
      setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    }
  };

  const timerRef = useRef(null);

  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  };

  useEffect(() => {
    if (examTimeLeft === 300 || examTimeLeft === 60) {
      playBeep();
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  }, [examTimeLeft]);

  useEffect(() => {
    const initExam = async () => {
      try {
        const questionsList = await fetchQuestions(pkgId);
        setExamQuestions(questionsList);

        const attempt = await startExamAttempt(pkgId);
        setAttemptId(attempt.id);

        if (attempt.started_at) {
          const startedTime = new Date(attempt.started_at).getTime();
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - startedTime) / 1000);
          const totalDurationSeconds = currentPkg.duration * 60;
          const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);
          setExamTimeLeft(remaining);
        } else {
          setExamTimeLeft(currentPkg.duration * 60);
        }

        // Restore cached answers from localStorage
        const cacheKey = `exam_answers_${attempt.id || pkgId}`;
        const cachedAnswers = localStorage.getItem(cacheKey);
        if (cachedAnswers) {
          try {
            const parsed = JSON.parse(cachedAnswers);
            setAnswers(parsed);
          } catch (e) {
            console.error('Failed to parse cached answers:', e);
          }
        }



        setIsExamInitialized(true);
        setIsTimerRunning(true);
        setLoading(false);
      } catch (err) {
        Swal.fire({
          title: 'Gagal Memulai Ujian',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        }).then(() => {
          navigate('/dashboard');
        });
      }
    };
    initExam();
  }, [pkgId, fetchQuestions, startExamAttempt, currentPkg.duration, navigate]);

  // Auto-Save Answers to LocalStorage
  useEffect(() => {
    if (isExamInitialized && (attemptId || pkgId)) {
      const cacheKey = `exam_answers_${attemptId || pkgId}`;
      localStorage.setItem(cacheKey, JSON.stringify(answers));
    }
  }, [answers, attemptId, pkgId, isExamInitialized]);

  const handleFinishExam = useCallback(async () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await submitExamAttempt(attemptId, answers);
      sessionStorage.setItem('last-exam-answers', JSON.stringify(answers));

      // Cleanup localStorage cache
      const cacheKey = `exam_answers_${attemptId || pkgId}`;
      localStorage.removeItem(cacheKey);

      setShowSubmitModal(false);
      navigate('/result', { state: { attemptId: result.attempt_id } });
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengirim Jawaban',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
      setIsTimerRunning(true);
    }
  }, [answers, attemptId, pkgId, submitExamAttempt, navigate]);

  const handleAutoSubmit = useCallback(() => {
    Swal.fire({
      title: 'Waktu Ujian Habis!',
      text: 'Waktu Ujian Simulasi Anda Telah Habis! Sistem akan mengumpulkan lembar jawaban Anda secara otomatis.',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#EF4444',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      handleFinishExam();
    });
  }, [handleFinishExam]);

  const handleAutoSubmitRef = useRef(null);
  useEffect(() => {
    handleAutoSubmitRef.current = handleAutoSubmit;
  }, [handleAutoSubmit]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setExamTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            if (handleAutoSubmitRef.current) {
              handleAutoSubmitRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleClearAnswer = (questionId) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };



  const getGridButtonClass = (q, idx, isMobile = false) => {
    const isAnswered = !!answers[q.id];
    const isActive = currentQuestionIndex === idx;
    const heightClass = isMobile ? 'h-11 text-xs font-bold' : 'h-9 text-[11px] font-bold';
    const roundedClass = isCatMode ? 'rounded-none' : isMobile ? 'rounded-xl' : 'rounded-lg';

    if (isCatMode) {
      let base = `${heightClass} flex items-center justify-center ${roundedClass} border border-slate-350 `;
      if (isActive) {
        return base + 'bg-yellow-400 text-black font-black ring-2 ring-slate-800 scale-100 z-10';
      }
      if (isAnswered) {
        return base + 'bg-green-600 text-white';
      }
      return base + 'bg-red-600 text-white';
    } else {
      let base = `${heightClass} flex items-center justify-center ${roundedClass} border transition-all duration-150 `;
      if (isActive) {
        base += 'ring-2 ring-[#0B1C30] scale-110 z-10 ';
      }
      if (isAnswered) {
        return base + 'bg-emerald-600 text-white border-transparent shadow-sm';
      }
      return base + 'bg-slate-50 text-slate-555 border-slate-200/60 hover:bg-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Memuat Soal Ujian...</p>
        </div>
      </div>
    );
  }

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 max-w-sm px-6">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Soal Belum Tersedia</h3>
          <p className="text-sm text-slate-500">Paket tryout ini belum memiliki soal. Silakan hubungi admin atau pilih paket lainnya.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#0B1C30] hover:bg-[#102A43] text-white py-3 rounded-xl font-bold transition-all text-xs border-0 cursor-pointer"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examQuestions.length - answeredCount;

  // Timer urgency
  const timerUrgency = examTimeLeft < 300 ? 'critical' : examTimeLeft < 900 ? 'warning' : 'normal';

  return (
    <div className={`min-h-screen flex flex-col select-none transition-colors duration-300 ${isCatMode ? 'bg-slate-100 font-sans' : 'bg-[#F4F6F9] animate-fadeIn'
      }`}>
      <SEO title="Simulasi Ujian Aktif" />
      {/* ─── HEADER ─── */}
      {isCatMode ? (
        <header className="bg-[#0B1C30] text-white py-3 px-4 sm:px-6 shadow flex items-center justify-between sticky top-0 z-30 select-none border-b border-slate-850">
          {/* Left Side: Title & Candidate Info */}
          <div className="flex flex-col pointer-events-none">
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-wide leading-tight text-white">
              Simulasi CAT SKD CPNS
            </span>
            <span className="text-[10px] sm:text-xs text-white/80 font-bold leading-none mt-1">
              Peserta: {user?.name || 'Peserta CPNS'}
            </span>
          </div>

          {/* Right Side: Timer & Action Toggles */}
          <div className="flex items-center gap-3">
            {/* Large Timer in Transparent Capsule Box */}
            <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-white/85" />
              <span className="text-base sm:text-lg tabular-nums font-mono font-black text-white">
                {formatTimer(examTimeLeft)}
              </span>
            </div>

            {/* BKN CAT Mode Toggle Button */}
            <button
              onClick={() => setIsCatMode(false)}
              className="text-[10px] sm:text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded cursor-pointer transition-all border border-white/20"
            >
              Mode Premium
            </button>

            {/* Peta Soal Mobile Toggle (BKN Mode) */}
            <button
              onClick={() => setShowBottomSheet(true)}
              className="lg:hidden flex items-center gap-1.5 bg-white/10 border border-white/20 text-white px-2.5 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-white/20 cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-white/85" />
              <span>Peta Soal</span>
            </button>
          </div>
        </header>
      ) : (
        <header className="border-b sticky top-0 z-30 transition-all duration-300 relative bg-white/90 border-slate-200/60 py-2.5 px-4 sm:px-6 shadow-sm backdrop-blur-xl flex items-center justify-between gap-4">
          {/* Left Side: Title */}
          <div className="flex items-center gap-2.5 z-10 pointer-events-none">
            <div className="p-2 shadow-sm transition-all duration-300 bg-[#0B1C30] text-white rounded-xl">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 leading-tight">
                Simulasi CAT CPNS
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold leading-none mt-0.5">
                {currentPkg.title}
              </p>
            </div>
          </div>

          {/* Center: Timer Pill (Premium Mode, Centered on Desktop) */}
          <div className="hidden md:flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 items-center z-20">
            <div className={`flex items-center justify-center gap-2 bg-white shadow-sm border border-slate-200 px-4 py-1.5 rounded-full transition-all duration-350 ${timerUrgency === 'critical'
              ? 'text-red-600 border-red-350 animate-pulse'
              : timerUrgency === 'warning'
                ? 'text-amber-600 border-amber-300'
                : 'text-[#0B1C30]'
              }`}>
              <Clock className="h-4 w-4" />
              <span className="text-xs sm:text-sm tabular-nums font-extrabold tracking-wider font-mono">
                {formatTimer(examTimeLeft)}
              </span>
            </div>
          </div>

          {/* Right Side: Options & Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 z-10">
            {/* Premium Mode Tooltip Auto-Save cloud badge */}
            <div className="relative group cursor-help text-emerald-600 flex items-center justify-center p-2 bg-emerald-50 rounded-full border border-emerald-100/60 shadow-sm transition-colors hover:bg-emerald-100">
              <Cloud className="h-4 w-4" />
              <span className="pointer-events-none absolute top-full right-0 mt-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-md shadow-lg font-semibold z-50">
                Sistem Auto-Save Aktif
              </span>
            </div>

            {/* Toggle Mode CAT Button */}
            <button
              onClick={() => setIsCatMode(true)}
              className="text-[10px] sm:text-xs font-bold bg-slate-100 hover:bg-slate-250 text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all border border-slate-200/60 shadow-sm"
            >
              Mode CAT
            </button>

            {/* Mobile Timer inside Right side (on mobile only) */}
            <div className="flex items-center md:hidden">
              <div className={`flex items-center justify-center gap-1 bg-white shadow-sm border border-slate-200 px-2.5 py-1.5 rounded-full ${timerUrgency === 'critical'
                ? 'text-red-600 border-red-350 animate-pulse'
                : timerUrgency === 'warning'
                  ? 'text-amber-600 border-amber-300'
                  : 'text-[#0B1C30]'
                }`}>
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs tabular-nums font-extrabold tracking-wider font-mono">
                  {formatTimer(examTimeLeft)}
                </span>
              </div>
            </div>

            {/* Peta Soal Mobile Toggle (Zen Mode) */}
            <button
              onClick={() => setShowBottomSheet(true)}
              className="lg:hidden flex items-center gap-1.5 bg-slate-100/70 border border-slate-200/50 text-slate-700 px-3 py-1 rounded-full text-xs font-bold transition-all hover:bg-slate-200/50 cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-slate-500" />
              <span>Peta Soal</span>
            </button>
          </div>

          {/* Visual Progress Timer Line */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-[4px] bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${examTimeLeft < 900 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              style={{ width: `${Math.max(0, Math.min(100, (examTimeLeft / (currentPkg.duration * 60)) * 100))}%` }}
            />
          </div>
        </header>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Panel */}
        <div className="lg:col-span-8 space-y-5 pb-36 lg:pb-0">
          {/* Question header */}
          <div className="flex items-center justify-between gap-3 w-full border-b border-slate-100 pb-3 flex-nowrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0B1C30] whitespace-nowrap">
                Soal No {currentQuestionIndex + 1}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex-shrink-0 ${currentQuestion.category === 'TWK' ? 'bg-red-50 text-red-700 border border-red-200/60' :
                currentQuestion.category === 'TIU' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                }`}>
                {currentQuestion.category}
              </span>
            </div>

            {/* Font Sizer Toolbar */}
            <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200/60 rounded-xl p-1 shadow-sm flex-shrink-0">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === 'sm' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                title="Teks Kecil"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`w-7 h-7 flex items-center justify-center text-sm font-bold rounded-lg transition-all cursor-pointer ${fontSize === 'md' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                title="Teks Sedang"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`w-7 h-7 flex items-center justify-center text-base font-bold rounded-lg transition-all cursor-pointer ${fontSize === 'lg' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                title="Teks Besar"
              >
                A+
              </button>
            </div>
          </div>

          {/* Question Body */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`touch-pan-y transition-all duration-300 ${isCatMode
              ? 'bg-white border-l-4 border-l-red-600 border border-slate-350 rounded-none shadow-none p-5 sm:p-6'
              : 'bg-white rounded-2xl shadow-sm border border-slate-100 p-5'
              }`}
          >
            <p className={`${fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
              } transition-all duration-150 ${isCatMode
                ? 'font-[Arial] text-black font-normal leading-normal'
                : 'font-semibold text-slate-800 leading-[1.8]'
              }`}>
              {currentQuestion.question}
            </p>
          </div>

          {/* Selectable Option Cards */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                  className={`w-full text-left p-3.5 flex items-start gap-3.5 border cursor-pointer transition-all duration-200 group ${isCatMode
                    ? isSelected
                      ? 'bg-blue-50 border-blue-600 rounded-none shadow-none'
                      : 'bg-white border-slate-350 rounded-none hover:bg-slate-50'
                    : isSelected
                      ? 'ring-2 ring-[#0B1C30] bg-blue-50/30 border-transparent rounded-xl'
                      : 'bg-white border-slate-200 hover:border-slate-300 rounded-xl hover:shadow-sm'
                    }`}
                >
                  <span className={`flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${isCatMode
                    ? isSelected
                      ? 'bg-blue-600 text-white rounded-none h-7 w-7'
                      : 'bg-slate-200 text-slate-700 rounded-none h-7 w-7'
                    : isSelected
                      ? 'bg-[#0B1C30] text-white shadow-sm rounded-full h-8 w-8'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 rounded-full h-8 w-8'
                    }`}>
                    {opt.key}
                  </span>
                  <span className={`text-sm leading-relaxed pt-0.5 transition-colors ${isCatMode
                    ? isSelected ? 'font-bold text-black' : 'text-slate-850'
                    : isSelected ? 'font-bold text-slate-900' : 'text-slate-600 font-semibold'
                    }`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Only: Batal Jawab button under options */}
          <div className="lg:hidden mt-4">
            <button
              type="button"
              onClick={() => handleClearAnswer(currentQuestion.id)}
              disabled={!answers[currentQuestion.id]}
              className={`w-full py-2.5 text-xs font-bold text-center border transition-all cursor-pointer ${isCatMode
                ? 'rounded-none border-slate-350 bg-white text-slate-700 disabled:opacity-40'
                : 'rounded-xl border-slate-200 bg-white text-slate-655 disabled:text-slate-300 disabled:border-slate-100'
                }`}
            >
              Batal Jawab
            </button>
          </div>

          {/* Action Footer Wrapper (Desktop & Mobile Controls) */}
          <div className="pt-6">
            {/* ─── DESKTOP CONTROLS (hidden on mobile) ─── */}
            <div className="hidden lg:block space-y-4">
              {/* Row 1: Batal Jawab (Desktop Only) */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleClearAnswer(currentQuestion.id)}
                  disabled={!answers[currentQuestion.id]}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border ${isCatMode
                    ? 'rounded-none border-slate-350 bg-white text-slate-700 hover:bg-slate-55 disabled:opacity-40'
                    : 'rounded-xl border-slate-200 bg-white text-slate-655 hover:bg-slate-55 disabled:text-slate-300 disabled:border-slate-100'
                    }`}
                >
                  Batal Jawab
                </button>
              </div>

              {/* Row 2: Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className={`px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] cursor-pointer ${isCatMode
                      ? 'rounded-none border-slate-350 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40'
                      : 'rounded-xl border border-slate-200 bg-white text-slate-605 hover:bg-slate-55 disabled:opacity-40'
                      }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {currentQuestionIndex === examQuestions.length - 1 ? (
                    <span className="hidden" />
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                      className={`px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] cursor-pointer ${isCatMode
                        ? 'rounded-none bg-blue-600 hover:bg-blue-700 text-white'
                        : 'rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        }`}
                    >
                      <span>Simpan dan Lanjutkan</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex === examQuestions.length - 1 && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 bg-red-650 hover:bg-red-750 text-white transition-all duration-200 active:scale-[0.97] cursor-pointer ${isCatMode ? 'rounded-none shadow-none' : 'rounded-xl shadow-md'
                        }`}
                    >
                      <Send className="h-4 w-4" />
                      <span>Selesai Ujian</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── MOBILE STICKY CONTROLS (hidden on desktop) ─── */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/50 p-4 w-full flex items-center justify-between gap-2.5 ${isCatMode ? 'font-sans' : 'shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-2xl'
            }`}>
            {/* Sebelumnya (Pojok Kiri Bawah) */}
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${isCatMode
                ? 'rounded-none border border-slate-350 bg-white text-slate-700 disabled:opacity-40'
                : 'rounded-xl border border-slate-200 bg-white text-slate-605 disabled:opacity-30'
                }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Simpan & Lanjutkan (Tengah, Lebih Menonjol) */}
            {currentQuestionIndex === examQuestions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-white transition-all ${isCatMode
                  ? 'rounded-none bg-red-600 hover:bg-red-750'
                  : 'rounded-xl bg-red-600 hover:bg-red-700 shadow-md'
                  }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Selesai</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer text-white transition-all ${isCatMode
                  ? 'rounded-none bg-blue-600 hover:bg-blue-700'
                  : 'rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md'
                  }`}
              >
                <span>Simpan & Lanjut</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Lewatkan (Pojok Kanan Bawah) */}
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
              className={`px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${isCatMode
                ? 'rounded-none border border-red-650 bg-white text-red-600 hover:bg-red-50'
                : 'rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
            >
              <span>Lewatkan</span>
            </button>
          </div>

        </div>

        {/* ─── NAVIGATION SIDEBAR ─── */}
        <div className="lg:col-span-4 hidden lg:block">
              <div className={`bg-white border sticky top-24 space-y-5 transition-all duration-300 ${isCatMode
                ? 'rounded-none border-slate-350 shadow-none p-4'
                : 'rounded-2xl border-slate-200/60 shadow-premium p-5'
                }`}>

                {/* Candidate profile card */}
                <div className={`flex items-center gap-3 pb-4 border-b border-slate-100 ${isCatMode ? 'font-sans' : ''}`}>
                  <img
                    src={user?.avatar || "/images/icon.png"}
                    alt="Avatar Peserta"
                    className={`h-11 w-11 object-cover border ${isCatMode ? 'rounded-none border-slate-350' : 'rounded-full border-slate-200'}`}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=CASN";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Peserta Ujian</p>
                    <p className="text-xs font-bold truncate text-slate-800 font-mono">{user?.name || "Peserta CPNS"}</p>
                    <p className="text-[10px] text-slate-550 font-semibold truncate">{user?.email || "casn@wildan.com"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">Navigasi Soal</h3>
                  <span className="text-[10px] text-slate-400 font-bold">{answeredCount}/{examQuestions.length} terjawab</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-6 gap-1.5">
                  {examQuestions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={getGridButtonClass(q, idx, false)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-1.5 pt-4 border-t border-slate-100">
                  {[
                    { color: 'bg-emerald-600', label: 'Terjawab', count: answeredCount },
                    { color: isCatMode ? 'bg-red-600' : 'bg-slate-300', label: 'Kosong', count: unansweredCount }
                  ].map((item) => (
                    <div key={item.label} className="text-center p-1.5 rounded-lg bg-slate-55 border border-slate-100">
                      <span className="block text-xs font-extrabold tracking-tight text-slate-800">{item.count}</span>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                        <span className="text-[9px] font-bold text-slate-400">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── SUBMIT MODAL ─── */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={() => setShowSubmitModal(false)}
              />

              <div className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-premium-lg max-w-sm w-full p-6 text-center space-y-5 animate-scaleUp">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl w-fit mx-auto border border-amber-100">
                  <AlertCircle className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-extrabold tracking-tight text-[#0B1C30]">Selesaikan Ujian?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Jawaban Anda akan langsung dihitung dan tidak bisa diubah lagi.
                  </p>
                </div>

                {/* Stats Modal */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <span className="block text-base font-extrabold text-emerald-600">{answeredCount}</span>
                    <span className="text-[10px] font-bold text-slate-400">Terjawab</span>
                  </div>
                  <div className="text-center border-l border-slate-200/60">
                    <span className="block text-base font-extrabold text-red-500">{unansweredCount}</span>
                    <span className="text-[10px] font-bold text-slate-400">Kosong</span>
                  </div>
                </div>

                {unansweredCount > 0 && (
                  <div className="p-2.5 bg-red-50 border border-red-100 text-red-650 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Masih ada {unansweredCount} soal yang belum diisi!</span>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-650 hover:bg-slate-55 transition-all duration-200 active:scale-[0.98]"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleFinishExam}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-[#0B1C30] text-white hover:bg-[#102A43] shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    Ya, Selesai
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── MOBILE NATIVE BOTTOM SHEET ─── */}
          <div
            className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300 ${showBottomSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setShowBottomSheet(false)}
          />

          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 lg:hidden border-t border-slate-200 shadow-premium-lg transform transition-transform duration-300 ease-out ${showBottomSheet ? 'translate-y-0' : 'translate-y-full'
            }`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Peta Soal</h3>
                <p className="text-[10px] text-slate-400 font-bold">{answeredCount}/{examQuestions.length} Terjawab</p>
              </div>
              <button
                onClick={() => setShowBottomSheet(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pb-4 space-y-5">
              {/* Grid */}
              <div className="grid grid-cols-6 gap-2">
                {examQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowBottomSheet(false);
                    }}
                    className={getGridButtonClass(q, idx, true)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-1.5 pt-4 border-t border-slate-100">
                {[
                  { color: 'bg-emerald-600', label: 'Terjawab', count: answeredCount },
                  { color: isCatMode ? 'bg-red-600' : 'bg-slate-300', label: 'Kosong', count: unansweredCount }
                ].map((item) => (
                  <div key={item.label} className="text-center p-1.5 rounded-lg bg-slate-55 border border-slate-100">
                    <span className="block text-xs font-extrabold tracking-tight text-slate-800">{item.count}</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      <span className="text-[9px] font-bold text-slate-400">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── EXIT CONFIRMATION MODAL ─── */}
          {showExitWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={() => {
                  setShowExitWarning(false);
                }}
              />

              <div className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-premium-lg max-w-sm w-full p-6 text-center space-y-5 animate-scaleUp">
                <div className="bg-red-50 text-red-650 p-3 rounded-2xl w-fit mx-auto border border-red-100">
                  <AlertCircle className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-extrabold tracking-tight text-[#0B1C30]">Tinggalkan Halaman?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Apakah Anda yakin ingin meninggalkan halaman? Ujian Anda sedang berlangsung dan waktu akan terus berjalan.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setShowExitWarning(false);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-655 hover:bg-slate-55 transition-all duration-200 active:scale-[0.98]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setAllowExit(true);
                      setShowExitWarning(false);
                      navigate('/dashboard', { replace: true });
                    }}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-750 shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
}