import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  CheckCircle2,
  XCircle,
  Award,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import API from '../../utils/api';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveTab, fetchHistory } = useExamStore();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNav, setShowNav] = useState(true);

  const attemptId = location.state?.attemptId;

  useEffect(() => {
    const loadResult = async () => {
      let activeAttemptId = attemptId;
      
      // If we don't have attemptId in state, let's fetch user's history and take the most recent one
      if (!activeAttemptId) {
        try {
          const res = await API.get('/results');
          const historyList = res.data.data;
          if (historyList && historyList.length > 0) {
            activeAttemptId = historyList[0].id;
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (!activeAttemptId) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/results/${activeAttemptId}`);
        const { attempt: apiAttempt, answers: apiAnswers } = res.data.data;
        
        // Map questions
        const mappedQuestions = apiAnswers.map(ans => {
          const q = ans.question;
          const options = [
            { key: 'A', text: q.option_a },
            { key: 'B', text: q.option_b },
            { key: 'C', text: q.option_c },
            { key: 'D', text: q.option_d },
            { key: 'E', text: q.option_e }
          ];
          
          let scores = null;
          if (q.option_weights) {
            scores = {};
            const weights = typeof q.option_weights === 'string'
              ? JSON.parse(q.option_weights)
              : q.option_weights;
            Object.keys(weights).forEach(k => {
              scores[k.toUpperCase()] = weights[k];
            });
          }

          const generatedExplanation = `Pembahasan untuk soal ini: Kunci jawaban adalah opsi ${q.correct_answer ? q.correct_answer.toUpperCase() : 'A'}. Pahami materi tentang sub-topik ${q.category ? q.category.name : 'Tes Wawasan'} untuk memperdalam pemahaman Anda.`;

          return {
            id: q.id,
            category: q.category ? q.category.name.toUpperCase() : 'TWK',
            question: q.question,
            options,
            correctAnswer: q.correct_answer ? q.correct_answer.toUpperCase() : '',
            explanation: generatedExplanation,
            scores
          };
        });

        // Map answers dictionary
        const answersDict = {};
        apiAnswers.forEach(ans => {
          answersDict[ans.question_id] = ans.selected_answer ? ans.selected_answer.toUpperCase() : '';
        });

        setAttempt(apiAttempt);
        setQuestions(mappedQuestions);
        setAnswers(answersDict);
        setLoading(false);
        
        // Refresh history list
        fetchHistory();
      } catch (err) {
        console.error('Failed to load result details:', err);
        setLoading(false);
      }
    };

    loadResult();
  }, [attemptId, fetchHistory]);

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Memuat Hasil Evaluasi...</p>
        </div>
      </div>
    );
  }

  if (!attempt || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="bg-slate-200 p-4 rounded-full w-fit mx-auto">
            <Info className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Tidak Ada Data Ujian</h3>
          <p className="text-sm text-slate-500">Anda belum menyelesaikan try out apa pun.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestion?.id];
  const isPassed = attempt.result === 'LULUS';
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 select-none">
      {/* ─── ZEN HEADER ─── */}
      <header className="bg-white border-b border-slate-200/60 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-800">
              Review Pembahasan
            </h1>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {attempt.tryout?.title || 'Simulasi CPNS'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm ${
            isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {isPassed ? <CheckCircle2 className="h-4 w-4 hidden sm:block" /> : <XCircle className="h-4 w-4 hidden sm:block" />}
            <span className="text-sm font-extrabold tracking-tight">
              SKOR: {attempt.score}
            </span>
          </div>

          {/* Toggle Nav on Mobile */}
          <button
            onClick={() => setShowNav(!showNav)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-bold">{currentQuestionIndex + 1}/{questions.length}</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* KIRI: QUESTION & EXPLANATION PANEL */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Soal No {currentQuestionIndex + 1}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ring-1 ${
                currentQuestion.category === 'TWK' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
                currentQuestion.category === 'TIU' ? 'bg-indigo-50 text-indigo-700 ring-indigo-200' :
                'bg-amber-50 text-amber-700 ring-amber-200'
              }`}>
                {currentQuestion.category}
              </span>
            </div>

            {/* Status Jawaban Badge */}
            <div className="flex items-center">
              {currentQuestion.category !== 'TKP' ? (
                userAnswer === currentQuestion.correctAnswer ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Anda Benar
                  </span>
                ) : userAnswer ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold">
                    <XCircle className="h-4 w-4" /> Anda Salah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold">
                    Kosong
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                  <Award className="h-4 w-4" /> 
                  Poin: {currentQuestion.scores?.[userAnswer] || 0}
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 sm:p-7">
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-[1.8]">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options Review */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = userAnswer === opt.key;
              const isCorrectAnswer = currentQuestion.category !== 'TKP' && currentQuestion.correctAnswer === opt.key;
              const tkpPoint = currentQuestion.category === 'TKP' ? (currentQuestion.scores?.[opt.key] || 0) : null;
              
              let optionStyle = 'bg-white ring-1 ring-slate-200/60 opacity-60';
              let badgeStyle = 'bg-slate-100 text-slate-500';

              if (currentQuestion.category !== 'TKP') {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-50 ring-2 ring-emerald-500 shadow-sm';
                  badgeStyle = 'bg-emerald-500 text-white';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-red-50 ring-2 ring-red-400 shadow-sm';
                  badgeStyle = 'bg-red-500 text-white';
                }
              } else {
                if (isSelected) {
                  optionStyle = 'bg-amber-50 ring-2 ring-amber-400 shadow-sm';
                  badgeStyle = 'bg-amber-500 text-white';
                } else if (tkpPoint === 5) {
                  optionStyle = 'bg-slate-50 ring-1 ring-amber-300';
                  badgeStyle = 'bg-amber-100 text-amber-600';
                }
              }

              return (
                <div
                  key={opt.key}
                  className={`w-full p-4 rounded-xl flex items-start justify-between gap-3 transition-all duration-200 ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${badgeStyle}`}>
                      {opt.key}
                    </span>
                    <span className={`text-sm leading-relaxed pt-0.5 ${isSelected || isCorrectAnswer ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
                      {opt.text}
                    </span>
                  </div>
                  
                  {currentQuestion.category === 'TKP' && (
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold flex-shrink-0 ${tkpPoint === 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-white ring-1 ring-slate-200 text-slate-500'}`}>
                      {tkpPoint} Poin
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Kotak Pembahasan */}
          <div className="bg-blue-50/50 rounded-2xl ring-1 ring-blue-200 p-5 sm:p-6 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider">Pembahasan Detail</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {currentQuestion.explanation || "Pembahasan untuk soal ini belum tersedia."}
            </p>
          </div>

          {/* Action Footer (Prev/Next) */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-[0.97] ${
                currentQuestionIndex === 0
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'text-slate-700 ring-1 ring-slate-200 hover:bg-white bg-white shadow-sm'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-[0.97] ${
                currentQuestionIndex === questions.length - 1
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-premium'
              }`}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* KANAN: NAVIGATION SIDEBAR & SCORE SUMMARY */}
        <div className={`lg:col-span-4 space-y-5 ${showNav ? 'block' : 'hidden lg:block'}`}>
          
          {/* Score Summary Card */}
          <div className="bg-slate-900 rounded-2xl shadow-premium p-5 text-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan Nilai</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-blue-400">TWK</p>
                  <p className="text-xl font-extrabold">{attempt.twk} <span className="text-xs text-slate-500 font-medium">/ 150</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-indigo-400">TIU</p>
                  <p className="text-xl font-extrabold">{attempt.tiu} <span className="text-xs text-slate-500 font-medium">/ 175</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-400">TKP</p>
                  <p className="text-xl font-extrabold">{attempt.tkp} <span className="text-xs text-slate-500 font-medium">/ 225</span></p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <Button variant="ghost" className="w-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white" onClick={handleBackToDashboard}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Akhiri Review
                </Button>
              </div>
            </div>
          </div>

          {/* Grid Navigasi */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Navigasi Soal</h3>
              <span className="text-[10px] text-slate-500 font-semibold">{answeredCount}/{questions.length} dijawab</span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isActive = currentQuestionIndex === idx;
                
                let btnColor = 'bg-slate-50 text-slate-400 ring-1 ring-slate-200/60';

                if (ans) {
                  if (q.category !== 'TKP') {
                    btnColor = ans === q.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white';
                  } else {
                    btnColor = q.scores?.[ans] === 5 ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white';
                  }
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
                      isActive ? 'ring-2 ring-offset-2 ring-slate-900 scale-105 z-10' : ''
                    } ${btnColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}