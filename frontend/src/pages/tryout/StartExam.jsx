import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useExamStore } from '../../store/useExamStore';
import { Clock, Award, ChevronLeft, ChevronRight, AlertCircle, Send, Cloud } from 'lucide-react';
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
  const touchStartX = useRef(0);

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
    <div className={`min-h-screen flex flex-col select-none transition-colors duration-300 ${
      isCatMode ? 'bg-[#E5E7EB] font-sans' : 'bg-[#F4F6F9] animate-fadeIn'
    }`}>
      <Helmet>
        <title>Simulasi Ujian Aktif - WILDAN CASN</title>
      </Helmet>
      {/* ─── ZEN HEADER — Minimal Chrome ─── */}
      <header className={`border-b sticky top-0 z-30 relative transition-all duration-300 ${
        isCatMode 
          ? 'bg-[#F3F4F6] border-slate-350 py-2.5 px-4 rounded-none shadow-none text-slate-800' 
          : 'bg-white/90 border-slate-200/60 py-3.5 px-4 sm:px-6 shadow-sm backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 shadow-sm transition-all duration-300 ${
            isCatMode ? 'bg-slate-700 text-white rounded-none' : 'bg-[#0B1C30] text-white rounded-xl'
          }`}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
              Simulasi CAT CPNS
            </h1>
            <p className="text-xs text-slate-400 font-bold">
              {currentPkg.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 animate-fadeIn">
          {/* Toggle Mode CAT BKN */}
          <div className={`flex items-center gap-2 border px-3 py-1.5 transition-all duration-300 ${
            isCatMode 
              ? 'bg-[#E5E7EB] border-slate-350 rounded-none shadow-none' 
              : 'bg-slate-50 border-slate-200 px-3.5 py-2 rounded-xl shadow-sm'
          }`}>
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-700">Mode CAT BKN</span>
            <button
              onClick={() => setIsCatMode(!isCatMode)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isCatMode ? 'bg-slate-700' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isCatMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timer Box and Auto-save Banner */}
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center justify-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 border-2 transition-all duration-350 ${
              isCatMode 
                ? 'bg-white text-slate-800 border-slate-350 rounded-none shadow-none' 
                : timerUrgency === 'critical'
                ? 'bg-red-50 text-red-600 border-red-350 rounded-xl animate-pulse shadow-sm'
                : timerUrgency === 'warning'
                ? 'bg-amber-55/70 text-amber-600 border-amber-250 rounded-xl shadow-sm'
                : 'bg-slate-50 text-[#0B1C30] border-slate-150 rounded-xl shadow-sm'
            }`}>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base tabular-nums font-extrabold tracking-wider font-mono">
                {formatTimer(examTimeLeft)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 animate-pulse">
              <Cloud className="h-3.5 w-3.5" />
              <span>Sistem Auto-Save Aktif</span>
            </div>
          </div>

          {/* Toggle nav on mobile */}
          <button
            onClick={() => setShowBottomSheet(true)}
            className={`lg:hidden p-2 hover:bg-slate-100 transition-colors text-slate-500 border border-slate-200 bg-white animate-fadeIn ${
              isCatMode ? 'rounded-none' : 'rounded-xl'
            }`}
          >
            <span className="text-xs font-bold">{answeredCount}/{examQuestions.length}</span>
          </button>
        </div>

        {/* Visual Progress Timer Line */}
        {!isCatMode && (
          <div className="absolute bottom-0 left-0 right-0 w-full h-[4px] bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                examTimeLeft < 900 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (examTimeLeft / (currentPkg.duration * 60)) * 100))}%` }}
            />
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Panel */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold tracking-tight text-[#0B1C30]">
                Soal No {currentQuestionIndex + 1}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                currentQuestion.category === 'TWK' ? 'bg-red-50 text-red-700 border border-red-200/60' :
                currentQuestion.category === 'TIU' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}>
                {currentQuestion.category}
              </span>
            </div>

            {/* Font Sizer Toolbar */}
            <div className="flex items-center gap-1 bg-white border border-slate-200/60 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                  fontSize === 'sm' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}
                title="Teks Kecil"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`w-7 h-7 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                  fontSize === 'md' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}
                title="Teks Sedang"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`w-7 h-7 flex items-center justify-center text-base font-bold rounded-lg transition-all ${
                  fontSize === 'lg' ? 'bg-[#0B1C30] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
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
            className={`bg-white border-l-4 touch-pan-y transition-all duration-300 ${
              isCatMode 
                ? 'border-l-red-600 border border-slate-350 rounded-none shadow-none p-5 sm:p-6' 
                : 'border-l-[#0B1C30] border border-y-slate-200/60 border-r-slate-200/60 rounded-2xl shadow-premium p-6 sm:p-8'
            }`}
          >
            <p className={`${
              fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
            } transition-all duration-150 ${
              isCatMode 
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
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all duration-200 ease-out group border ${
                    isCatMode 
                      ? isSelected
                        ? 'bg-blue-50 border-blue-600 rounded-none shadow-none'
                        : 'bg-white border-slate-350 rounded-none hover:bg-slate-50'
                      : isSelected
                        ? 'bg-[#0B1C30]/5 border-[#0B1C30] ring-1 ring-[#0B1C30] shadow-sm rounded-xl'
                        : 'bg-white border-slate-200/60 hover:border-[#0B1C30]/45 hover:shadow-premium rounded-xl'
                  }`}
                >
                  <span className={`h-7 w-7 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${
                    isCatMode 
                      ? isSelected
                        ? 'bg-blue-600 text-white rounded-none'
                        : 'bg-slate-200 text-slate-750 rounded-none'
                      : isSelected
                        ? 'bg-[#0B1C30] text-white shadow-sm rounded-lg'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 rounded-lg'
                  }`}>
                    {opt.key}
                  </span>
                  <span className={`text-sm leading-relaxed pt-0.5 transition-colors ${
                    isCatMode 
                      ? isSelected ? 'font-bold text-black' : 'text-slate-850'
                      : isSelected ? 'font-bold text-slate-900' : 'text-slate-600 font-semibold'
                  }`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] ${
                  isCatMode ? 'rounded-none shadow-none border-slate-350' : 'rounded-xl shadow-sm'
                } ${
                  currentQuestionIndex === 0
                    ? 'text-slate-355 bg-slate-100 cursor-not-allowed'
                    : 'text-slate-655 border border-slate-200 hover:border-[#0B1C30]/40 hover:bg-white bg-white'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className={`px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] ${
                  isCatMode ? 'rounded-none shadow-none bg-slate-700 hover:bg-slate-800' : 'rounded-xl shadow-md bg-[#0B1C30] hover:bg-[#102A43]'
                } ${
                  currentQuestionIndex === examQuestions.length - 1
                    ? 'text-slate-300 cursor-not-allowed hidden'
                    : 'text-white'
                }`}
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentQuestionIndex === examQuestions.length - 1 && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 active:scale-[0.97] ${
                    isCatMode ? 'rounded-none shadow-none' : 'rounded-xl shadow-md'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  <span>Selesai Ujian</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION SIDEBAR ─── */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className={`bg-white border sticky top-24 space-y-5 transition-all duration-300 ${
            isCatMode 
              ? 'rounded-none border-slate-350 shadow-none p-4' 
              : 'rounded-2xl border-slate-200/60 shadow-premium p-5'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Navigasi Soal</h3>
              <span className="text-[10px] text-slate-400 font-bold">{answeredCount}/{examQuestions.length} terjawab</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {examQuestions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isActive = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
                      isActive 
                        ? isCatMode 
                          ? 'ring-2 ring-slate-800 scale-100 z-10' 
                          : 'ring-2 ring-[#0B1C30] scale-110 z-10' 
                        : ''
                    } ${
                      isCatMode ? 'rounded-none border-slate-350' : 'rounded-lg border-slate-200/60 hover:bg-slate-100'
                    } ${
                      isAnswered
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 border hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
              {[
                { color: 'bg-emerald-600', label: 'Terjawab', count: answeredCount },
                { color: 'bg-slate-250', label: 'Kosong', count: unansweredCount }
              ].map((item) => (
                <div key={item.label} className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-sm font-extrabold tracking-tight text-slate-800">{item.count}</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
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

      {/* ─── MOBILE NATIVE FAB ─── */}
      <button
        onClick={() => setShowBottomSheet(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-[#0B1C30] hover:bg-[#102A43] text-white px-5 py-3.5 rounded-full shadow-premium-lg flex items-center gap-2 border-0 cursor-pointer transition-all active:scale-95 font-bold text-xs tracking-wider animate-fadeIn"
      >
        <Award className="h-4 w-4" />
        <span>Peta Soal</span>
      </button>

      {/* ─── MOBILE NATIVE BOTTOM SHEET ─── */}
      <div 
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300 ${
          showBottomSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowBottomSheet(false)}
      />

      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 lg:hidden border-t border-slate-200 shadow-premium-lg transform transition-transform duration-300 ease-out ${
        showBottomSheet ? 'translate-y-0' : 'translate-y-full'
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
            {examQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isActive = currentQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setShowBottomSheet(false);
                  }}
                  className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-150 ${
                    isActive ? 'ring-2 ring-[#0B1C30] scale-110 z-10' : ''
                  } ${
                    isAnswered
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            {[
              { color: 'bg-emerald-600', label: 'Terjawab', count: answeredCount },
              { color: 'bg-slate-250', label: 'Kosong', count: unansweredCount }
            ].map((item) => (
              <div key={item.label} className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-sm font-extrabold tracking-tight text-slate-800">{item.count}</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                  <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}