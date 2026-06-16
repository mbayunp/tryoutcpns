import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { Clock, Award, ChevronLeft, ChevronRight, AlertCircle, Flag, Send } from 'lucide-react';

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
    questions,
    addAttempt,
    incrementPackageAttempts
  } = useExamStore();

  const pkgId = location.state?.packageId || 1;
  const currentPkg = packages.find(p => p.id === pkgId) || packages[0];

  const [answers, setAnswers] = useState({});
  const [raguRagu, setRaguRagu] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(currentPkg.duration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const timerRef = useRef(null);

  const handleFinishExam = useCallback(() => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let twkCorrect = 0;
    let tiuCorrect = 0;
    let tkpRawSum = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.category === 'TWK') {
        if (userAnswer === q.correctAnswer) twkCorrect += 1;
      } else if (q.category === 'TIU') {
        if (userAnswer === q.correctAnswer) tiuCorrect += 1;
      } else if (q.category === 'TKP') {
        const optionScore = q.scores?.[userAnswer] || 0;
        tkpRawSum += optionScore;
      }
    });

    const computedTWK = twkCorrect * 15;
    const computedTIU = tiuCorrect * 17.5;
    const computedTKP = tkpRawSum * 4.5;

    const finalScore = Math.round(computedTWK + computedTIU + computedTKP);
    const passed = (computedTWK >= 65) && (computedTIU >= 80) && (computedTKP >= 166);
    const resultStatus = passed ? 'LULUS' : 'TIDAK LULUS';

    const newAttempt = {
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      title: currentPkg.title,
      score: finalScore,
      result: resultStatus,
      twk: computedTWK,
      tiu: computedTIU,
      tkp: computedTKP,
      correctCount: twkCorrect + tiuCorrect
    };

    addAttempt(newAttempt);
    incrementPackageAttempts(currentPkg.id);
    sessionStorage.setItem('last-exam-answers', JSON.stringify(answers));

    setShowSubmitModal(false);
    navigate('/result');
  }, [answers, currentPkg, questions, addAttempt, incrementPackageAttempts, navigate]);

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

  const handleToggleRaguRagu = (questionId) => {
    setRaguRagu(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const raguRaguCount = Object.values(raguRagu).filter(Boolean).length;

  // Timer urgency
  const timerUrgency = examTimeLeft < 300 ? 'critical' : examTimeLeft < 900 ? 'warning' : 'normal';

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Memuat Soal Ujian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 select-none">
      {/* ─── ZEN HEADER — Minimal Chrome ─── */}
      <header className="bg-white border-b border-slate-200/60 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800">
              Simulasi CAT CPNS
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              {currentPkg.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Pill */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${
            timerUrgency === 'critical'
              ? 'bg-red-50 text-red-600 ring-1 ring-red-200 animate-pulse'
              : timerUrgency === 'warning'
              ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
              : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60'
          }`}>
            <Clock className="h-3.5 w-3.5" />
            <span className="tabular-nums font-extrabold">{formatTimer(examTimeLeft)}</span>
          </div>

          {/* Toggle nav on mobile */}
          <button
            onClick={() => setShowNav(!showNav)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <span className="text-xs font-bold">{answeredCount}/{questions.length}</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Panel */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">{currentQuestionIndex + 1}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">dari {questions.length} soal</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ring-1 ${
                    currentQuestion.category === 'TWK' ? 'bg-blue-50 text-blue-700 ring-blue-100' :
                    currentQuestion.category === 'TIU' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' :
                    'bg-amber-50 text-amber-700 ring-amber-100'
                  }`}>
                    {currentQuestion.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
          </div>

          {/* Question Body */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 sm:p-7">
            <p className="text-sm font-semibold text-slate-800 leading-[1.8]">
              {currentQuestion.question}
            </p>
          </div>

          {/* Selectable Option Cards */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all duration-200 ease-out group ${
                    isSelected
                      ? 'bg-blue-50 ring-2 ring-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.1)]'
                      : 'bg-white ring-1 ring-slate-200/60 hover:ring-slate-300 hover:shadow-premium'
                  }`}
                >
                  <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {opt.key}
                  </span>
                  <span className={`text-sm leading-relaxed pt-0.5 transition-colors ${
                    isSelected ? 'font-semibold text-slate-900' : 'text-slate-600 font-medium'
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
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-[0.97] ${
                  currentQuestionIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 ring-1 ring-slate-200/60 hover:ring-slate-300 hover:bg-white bg-white'
                }`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-[0.97] ${
                  currentQuestionIndex === questions.length - 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-premium'
                }`}
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Ragu-Ragu */}
              <button
                onClick={() => handleToggleRaguRagu(currentQuestion.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-[0.97] ${
                  raguRagu[currentQuestion.id]
                    ? 'bg-amber-500 text-white shadow-premium'
                    : 'ring-1 ring-slate-200/60 text-slate-500 hover:ring-amber-300 hover:text-amber-600 bg-white'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>Ragu</span>
              </button>

              {/* Submit */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-premium transition-all duration-200 active:scale-[0.97]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Selesai</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION SIDEBAR ─── */}
        <div className={`lg:col-span-4 ${showNav ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 sticky top-20 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Navigasi Soal</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{answeredCount}/{questions.length} terjawab</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isRagu = !!raguRagu[q.id];
                const isActive = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
                      isActive ? 'ring-2 ring-slate-900 scale-110 z-10' : ''
                    } ${
                      isRagu
                        ? 'bg-amber-500 text-white'
                        : isAnswered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-50 text-slate-500 ring-1 ring-slate-200/60 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
              {[
                { color: 'bg-emerald-500', label: 'Terjawab', count: answeredCount },
                { color: 'bg-amber-500', label: 'Ragu', count: raguRaguCount },
                { color: 'bg-slate-200', label: 'Kosong', count: unansweredCount }
              ].map((item) => (
                <div key={item.label} className="text-center p-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100">
                  <span className="block text-sm font-extrabold tracking-tight text-slate-800">{item.count}</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-medium text-slate-400">{item.label}</span>
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

          <div className="relative z-10 bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium-lg max-w-sm w-full p-6 text-center space-y-5 animate-scaleUp">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl w-fit mx-auto ring-1 ring-amber-100">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-extrabold tracking-tight text-slate-900">Selesaikan Ujian?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jawaban Anda akan langsung dihitung dan tidak bisa diubah lagi.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-100">
              <div className="text-center">
                <span className="block text-base font-extrabold text-emerald-600">{answeredCount}</span>
                <span className="text-[10px] font-medium text-slate-400">Terjawab</span>
              </div>
              <div className="text-center border-x border-slate-200/60">
                <span className="block text-base font-extrabold text-amber-500">{raguRaguCount}</span>
                <span className="text-[10px] font-medium text-slate-400">Ragu</span>
              </div>
              <div className="text-center">
                <span className="block text-base font-extrabold text-red-500">{unansweredCount}</span>
                <span className="text-[10px] font-medium text-slate-400">Kosong</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-2.5 bg-red-50 ring-1 ring-red-100 text-red-600 text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Masih ada {unansweredCount} soal yang belum diisi!</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-3 rounded-xl text-xs font-semibold ring-1 ring-slate-200/60 text-slate-600 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
              >
                Kembali
              </button>
              <button
                onClick={handleFinishExam}
                className="flex-1 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-premium transition-all duration-200 active:scale-[0.98]"
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
