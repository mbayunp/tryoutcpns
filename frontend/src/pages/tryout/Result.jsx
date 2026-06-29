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
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data langsung dari store sebagai cadangan (Fallback)
  const { fetchHistory, questions: storeQuestions, history: storeHistory } = useExamStore();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [reviewFilter, setReviewFilter] = useState('ALL');

  const attemptId = location.state?.attemptId;

  useEffect(() => {
    const loadResult = async () => {
      let activeAttemptId = attemptId;
      
      // Data cadangan dari memori lokal (sangat berguna jika API Backend bermasalah)
      const fallbackAttempt = storeHistory[0];
      const fallbackAnswers = JSON.parse(sessionStorage.getItem('last-exam-answers') || '{}');

      try {
        if (!activeAttemptId) {
          const res = await API.get('/results');
          const historyList = res.data.data;
          if (historyList && historyList.length > 0) {
            activeAttemptId = historyList[0].id;
          }
        }

        if (activeAttemptId) {
          const res = await API.get(`/results/${activeAttemptId}`);
          const apiAttempt = res.data.data.attempt || res.data.data;
          // Akali bug backend yang mungkin mengembalikan nama key yang berbeda
          const apiAnswers = res.data.data.answers || res.data.data.attempt_answers || res.data.data.attemptAnswers || [];
          
          if (apiAnswers && apiAnswers.length > 0) {
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
              const weights = q.options_weights || q.option_weights;
              if (weights) {
                scores = {};
                const weightsObj = typeof weights === 'string' ? JSON.parse(weights) : weights;
                Object.keys(weightsObj).forEach(k => { scores[k.toUpperCase()] = weightsObj[k]; });
              }

              return {
                id: q.id,
                category: q.category ? q.category.name.toUpperCase() : 'TWK',
                question: q.question,
                options,
                correctAnswer: q.correct_answer ? q.correct_answer.toUpperCase() : '',
                explanation: q.explanation || `Kunci jawaban: ${q.correct_answer?.toUpperCase() || 'A'}.`,
                scores
              };
            });

            const answersDict = {};
            apiAnswers.forEach(ans => {
              answersDict[ans.question_id] = ans.selected_answer ? ans.selected_answer.toUpperCase() : '';
            });

            setAttempt(apiAttempt);
            setQuestions(mappedQuestions);
            setAnswers(answersDict);
            setLoading(false);
            return; // Berhenti di sini jika API sukses
          }
        }
      } catch (err) {
        console.warn('API Error atau kosong, mengaktifkan Fallback Lokal...', err);
      }

      // ===== SMART FALLBACK =====
      // Jika backend gagal atau mengembalikan array kosong (karena bug tabel 'answers' vs 'attempt_answers')
      if (storeQuestions && storeQuestions.length > 0) {
        setAttempt(fallbackAttempt || { score: 0, twk: 0, tiu: 0, tkp: 0 });
        setQuestions(storeQuestions);
        setAnswers(fallbackAnswers);
      }
      
      setLoading(false);
      fetchHistory(); // Refresh riwayat di background
    };

    loadResult();
  }, [attemptId, fetchHistory, storeQuestions, storeHistory]);

  const handleBackToDashboard = () => {
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
          <Button onClick={handleBackToDashboard} className="mt-4">
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
  
  const filteredQuestionsIndices = questions.map((q, idx) => ({ q, idx })).filter(({ q }) => {
    const ans = answers[q.id];
    if (reviewFilter === 'ALL') return true;
    if (reviewFilter === 'CORRECT') {
      return ans && (q.category !== 'TKP' ? ans === q.correctAnswer : q.scores?.[ans] === 5);
    }
    if (reviewFilter === 'WRONG') {
      return ans && (q.category !== 'TKP' ? ans !== q.correctAnswer : q.scores?.[ans] !== 5);
    }
    if (reviewFilter === 'EMPTY') {
      return !ans;
    }
    return true;
  }).map(({ idx }) => idx);
  
  const displayDate = attempt?.finished_at || attempt?.created_at
    ? new Date(attempt.finished_at || attempt.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : attempt?.date || '';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] select-none animate-fadeIn">
      {/* ─── ZEN HEADER ─── */}
      <header className="bg-white border-b border-slate-200/60 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1C30] text-white p-2 rounded-xl shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
              Review Pembahasan
            </h1>
            <p className="text-xs text-slate-400 font-bold line-clamp-1">
              {attempt.tryout?.title || attempt.title || 'Simulasi CPNS'} {displayDate && `• ${displayDate}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-sm ${
            isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {isPassed ? <CheckCircle2 className="h-4 w-4 hidden sm:block" /> : <XCircle className="h-4 w-4 hidden sm:block" />}
            <span className="text-sm font-extrabold tracking-tight">
              SKOR: {attempt.score || 0}
            </span>
          </div>

          <button
            onClick={() => setShowNav(!showNav)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors bg-white"
          >
            <span className="text-xs font-bold">{currentQuestionIndex + 1}/{questions.length}</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* KIRI: QUESTION & EXPLANATION PANEL */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold tracking-tight text-[#0B1C30]">
                Soal No {currentQuestionIndex + 1}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                currentQuestion.category === 'TWK' ? 'bg-[#0B1C30]/10 text-[#0B1C30]' :
                currentQuestion.category === 'TIU' ? 'bg-indigo-50 text-indigo-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {currentQuestion.category}
              </span>
            </div>

            <div className="flex items-center">
              {currentQuestion.category !== 'TKP' ? (
                userAnswer === currentQuestion.correctAnswer ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Anda Benar
                  </span>
                ) : userAnswer ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    <XCircle className="h-4 w-4" /> Anda Salah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold border border-slate-300">
                    Kosong
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  <Award className="h-4 w-4" /> 
                  Poin Anda: {currentQuestion.scores?.[userAnswer] || 0}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-l-4 border-l-[#0B1C30] border border-y-slate-200/60 border-r-slate-200/60 shadow-premium p-6 sm:p-8">
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-[1.8]">
              {currentQuestion.question}
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.filter(opt => opt.text).map((opt) => {
              const isSelected = userAnswer === opt.key;
              const isWeighted = currentQuestion.category === 'TKP' || attempt.tryout?.program_type === 'PPPK' || !!currentQuestion.scores;
              const isCorrectAnswer = !isWeighted && currentQuestion.correctAnswer === opt.key;
              const tkpPoint = isWeighted ? (currentQuestion.scores?.[opt.key] || 0) : null;
              
              let optionStyle = 'bg-white border border-slate-200 opacity-70';
              let badgeStyle = 'bg-slate-100 text-slate-500';

              if (!isWeighted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-bold shadow-sm opacity-100';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-red-50 border-2 border-red-500 text-red-900 font-bold shadow-sm opacity-100';
                  badgeStyle = 'bg-red-600 text-white';
                }
              } else {
                const maxPoint = currentQuestion.scores ? Math.max(...Object.values(currentQuestion.scores)) : 5;
                if (isSelected) {
                  optionStyle = 'bg-amber-50 border-2 border-amber-500 text-amber-900 font-bold shadow-sm opacity-100';
                  badgeStyle = 'bg-amber-600 text-white';
                } else if (tkpPoint === maxPoint) {
                  optionStyle = 'bg-[#0B1C30]/5 border-2 border-[#0B1C30] text-[#0B1C30] font-bold shadow-sm opacity-100';
                  badgeStyle = 'bg-[#0B1C30] text-white';
                }
              }

              return (
                <div key={opt.key} className={`w-full p-4 rounded-xl flex items-start justify-between gap-3 transition-all duration-200 ${optionStyle}`}>
                  <div className="flex items-start gap-3">
                    <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${badgeStyle}`}>
                      {opt.key}
                    </span>
                    <span className={`text-sm leading-relaxed pt-0.5 ${isSelected || isCorrectAnswer ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {opt.text}
                    </span>
                  </div>
                  {isWeighted && (
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold flex-shrink-0 ${tkpPoint === (currentQuestion.scores ? Math.max(...Object.values(currentQuestion.scores)) : 5) ? 'bg-[#0B1C30] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500'}`}>
                      {tkpPoint} Poin
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#0B1C30]/5 rounded-2xl border border-[#0B1C30]/10 p-6 mt-6">
            <div className="flex items-center gap-2.5 mb-3.5">
              <BookOpen className="h-5 w-5 text-[#0B1C30]" />
              <h3 className="text-xs font-extrabold text-[#0B1C30] uppercase tracking-wider">Pembahasan Detail</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
              {currentQuestion.explanation || "Pembahasan untuk soal ini belum tersedia."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-[0.97] ${
                currentQuestionIndex === 0 ? 'text-slate-300 bg-slate-100 cursor-not-allowed' : 'text-slate-700 border border-slate-200 hover:border-[#0B1C30]/40 hover:bg-white bg-white shadow-sm'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-[0.97] ${
                currentQuestionIndex === questions.length - 1 ? 'text-slate-300 bg-slate-100 cursor-not-allowed' : 'bg-[#0B1C30] text-white hover:bg-[#102A43] shadow-md'
              }`}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* KANAN: NAVIGATION SIDEBAR & SCORE SUMMARY */}
        <div className={`lg:col-span-4 space-y-5 ${showNav ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] rounded-2xl shadow-premium p-6 text-white space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ringkasan Nilai</h3>
            {(() => {
              const isPPPK = attempt.tryout?.program_type === 'PPPK';
              const label1 = isPPPK ? 'Teknis' : 'TWK';
              const max1 = isPPPK ? 450 : 150;
              const label2 = isPPPK ? 'Manajerial' : 'TIU';
              const max2 = isPPPK ? 100 : 175;
              const label3 = isPPPK ? 'Sosial Kultural & Wawancara' : 'TKP';
              const max3 = isPPPK ? 120 : 225;
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-end gap-2 text-center">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-blue-300">{label1}</p>
                      <p className="text-base sm:text-lg font-extrabold">{attempt.twk || 0} <span className="text-[10px] text-slate-400 font-medium">/ {max1}</span></p>
                    </div>
                    <div className="border-l border-white/10 h-8"></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-indigo-300">{label2}</p>
                      <p className="text-base sm:text-lg font-extrabold">{attempt.tiu || 0} <span className="text-[10px] text-slate-400 font-medium">/ {max2}</span></p>
                    </div>
                    <div className="border-l border-white/10 h-8"></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-amber-300 truncate max-w-[80px]" title={label3}>{isPPPK ? 'Soskult & Waw' : label3}</p>
                      <p className="text-base sm:text-lg font-extrabold">{attempt.tkp || 0} <span className="text-[10px] text-slate-400 font-medium">/ {max3}</span></p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <button 
                      className="w-full text-xs font-bold bg-white text-[#0B1C30] hover:bg-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02]" 
                      onClick={handleBackToDashboard}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Akhiri Review
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Card: Analisis Penguasaan Materi */}
          {(() => {
            const isPPPK = attempt.tryout?.program_type === 'PPPK';
            const label1 = isPPPK ? 'Teknis' : 'TWK';
            const max1 = isPPPK ? 450 : 150;
            const label2 = isPPPK ? 'Manajerial' : 'TIU';
            const max2 = isPPPK ? 100 : 175;
            const label3 = isPPPK ? 'Sosial Kultural & Wawancara' : 'TKP';
            const max3 = isPPPK ? 120 : 225;

            const radarData = [
              { subject: `${label1} (${attempt.twk || 0}/${max1})`, skor: Math.round(((attempt.twk || 0) / max1) * 100), passing: isPPPK ? 0 : Math.round((65 / 150) * 100) },
              { subject: `${label2} (${attempt.tiu || 0}/${max2})`, skor: Math.round(((attempt.tiu || 0) / max2) * 100), passing: isPPPK ? 0 : Math.round((80 / 175) * 100) },
              { subject: `${label3} (${attempt.tkp || 0}/${max3})`, skor: Math.round(((attempt.tkp || 0) / max3) * 100), passing: isPPPK ? 0 : Math.round((166 / 225) * 100) }
            ];

            return (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-premium p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 tracking-tight">Analisis Penguasaan Materi</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">Persentase (%)</span>
                </div>
                
                <div className="flex justify-center items-center w-full min-h-[260px]">
                  <ResponsiveContainer width="100%" height={260} minWidth={1} minHeight={260}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <defs>
                        <linearGradient id="colorSkor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#94A3B8', fontSize: 9 }}
                      />
                      <Radar 
                        name="Target Passing Grade" 
                        dataKey="passing" 
                        stroke="#94A3B8" 
                        strokeDasharray="4 4"
                        fill="#F1F5F9" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name="Skor Anda" 
                        dataKey="skor" 
                        stroke="#10B981" 
                        fill="url(#colorSkor)" 
                        fillOpacity={1} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend info */}
                <div className="text-[10px] text-slate-400 font-bold flex justify-center gap-4 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border border-dashed border-slate-400 bg-slate-100 inline-block rounded-sm"></span>
                    <span>Passing Grade</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-sm"></span>
                    <span>Skor Anda</span>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-premium p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Navigasi Soal</h3>
              <span className="text-[10px] text-slate-500 font-bold">{answeredCount}/{questions.length} dijawab</span>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-1 mb-4 bg-slate-100 p-1.5 rounded-xl">
              {[
                { id: 'ALL', name: 'SEMUA' },
                { id: 'CORRECT', name: 'BENAR' },
                { id: 'WRONG', name: 'SALAH' },
                { id: 'EMPTY', name: 'KOSONG' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReviewFilter(item.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-extrabold transition-all text-center tracking-tight ${
                    reviewFilter === item.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {filteredQuestionsIndices.map((idx) => {
                const q = questions[idx];
                const ans = answers[q.id];
                const isActive = currentQuestionIndex === idx;
                let btnColor = 'bg-slate-50 text-slate-400 border border-slate-200/60';

                if (ans) {
                  if (q.category !== 'TKP') {
                    btnColor = ans === q.correctAnswer ? 'bg-emerald-600 text-white border-transparent shadow-sm' : 'bg-red-500 text-white border-transparent shadow-sm';
                  } else {
                    btnColor = q.scores?.[ans] === 5 ? 'bg-emerald-600 text-white border-transparent shadow-sm' : 'bg-amber-500 text-white border-transparent shadow-sm';
                  }
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
                      isActive ? 'ring-2 ring-offset-2 ring-[#0B1C30] scale-105 z-10' : ''
                    } ${btnColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-5 mt-5 border-t border-slate-100">
              <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="block text-[10px] font-bold text-emerald-700">Benar</span>
                <span className="text-[8px] text-emerald-500">Atau Poin 5</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-50 border border-red-100">
                <span className="block text-[10px] font-bold text-red-700">Salah</span>
                <span className="text-[8px] text-red-500">Poin 0</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-500">Kosong</span>
                <span className="text-[8px] text-slate-400">Terlewat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}