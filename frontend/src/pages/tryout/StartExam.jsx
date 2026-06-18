import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { Clock, Award, ChevronLeft, ChevronRight, AlertCircle, Send } from 'lucide-react';

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(currentPkg.duration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const timerRef = useRef(null);

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

        setIsTimerRunning(true);
        setLoading(false);
      } catch (err) {
        alert('Gagal memulai ujian: ' + err.message);
        navigate('/dashboard');
      }
    };
    initExam();
  }, [pkgId, fetchQuestions, startExamAttempt, currentPkg.duration, navigate]);

  const handleFinishExam = useCallback(async () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await submitExamAttempt(attemptId, answers);
      sessionStorage.setItem('last-exam-answers', JSON.stringify(answers));
      
      setShowSubmitModal(false);
      navigate('/result', { state: { attemptId: result.attempt_id } });
    } catch (err) {
      alert('Gagal mengirim jawaban: ' + err.message);
      setIsTimerRunning(true);
    }
  }, [answers, attemptId, submitExamAttempt, navigate]);

  const handleAutoSubmit = useCallback(() => {
    alert('Waktu Ujian Simulasi Anda Telah Habis! Sistem akan mengumpulkan lembar jawaban Anda secara otomatis.');
    handleFinishExam();
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
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] select-none animate-fadeIn">
      {/* ─── ZEN HEADER — Minimal Chrome ─── */}
      <header className="bg-white border-b border-slate-200/60 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1C30] text-white p-2 rounded-xl shadow-sm">
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

        <div className="flex items-center gap-4">
          {/* Timer Box */}
          <div className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl border-2 transition-all duration-500 shadow-sm ${
            timerUrgency === 'critical'
              ? 'bg-red-50 text-red-600 border-red-350 animate-pulse'
              : timerUrgency === 'warning'
              ? 'bg-amber-55/70 text-amber-600 border-amber-250'
              : 'bg-slate-50 text-[#0B1C30] border-slate-150'
          }`}>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg tabular-nums font-extrabold tracking-wider font-mono">
              {formatTimer(examTimeLeft)}
            </span>
          </div>

          {/* Toggle nav on mobile */}
          <button
            onClick={() => setShowNav(!showNav)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 border border-slate-200 bg-white"
          >
            <span className="text-xs font-bold">{answeredCount}/{examQuestions.length}</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Panel */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question header */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight text-[#0B1C30]">
              Soal No {currentQuestionIndex + 1}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion.category === 'TWK' ? 'bg-[#0B1C30]/10 text-[#0B1C30]' :
              currentQuestion.category === 'TIU' ? 'bg-indigo-55/10 text-indigo-700' :
              'bg-amber-55/10 text-amber-700'
            }`}>
              {currentQuestion.category}
            </span>
          </div>

          {/* Question Body */}
          <div className="bg-white rounded-2xl border-l-4 border-l-[#0B1C30] border border-y-slate-200/60 border-r-slate-200/60 shadow-premium p-6 sm:p-8">
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-[1.8]">
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
                  className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all duration-200 ease-out group border ${
                    isSelected
                      ? 'bg-[#0B1C30]/5 border-[#0B1C30] ring-1 ring-[#0B1C30] shadow-sm'
                      : 'bg-white border-slate-200/60 hover:border-[#0B1C30]/40 hover:shadow-premium'
                  }`}
                >
                  <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#0B1C30] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {opt.key}
                  </span>
                  <span className={`text-sm leading-relaxed pt-0.5 transition-colors ${
                    isSelected ? 'font-bold text-slate-900' : 'text-slate-600 font-semibold'
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
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] ${
                  currentQuestionIndex === 0
                    ? 'text-slate-350 bg-slate-100 cursor-not-allowed'
                    : 'text-slate-650 border border-slate-200 hover:border-[#0B1C30]/40 hover:bg-white bg-white shadow-sm'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] ${
                  currentQuestionIndex === examQuestions.length - 1
                    ? 'text-slate-300 cursor-not-allowed hidden'
                    : 'bg-[#0B1C30] text-white hover:bg-[#102A43] shadow-md'
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200 active:scale-[0.97]"
                >
                  <Send className="h-4 w-4" />
                  <span>Selesai Ujian</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION SIDEBAR ─── */}
        <div className={`lg:col-span-4 ${showNav ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-premium p-5 sticky top-24 space-y-5">
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
                    className={`h-9 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
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
    </div>
  );
}