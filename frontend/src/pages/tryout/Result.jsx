import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  CheckCircle2,
  XCircle,
  Award,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/common/Button';

export default function Result() {
  const navigate = useNavigate();
  const { history, questions, setActiveTab } = useExamStore();

  const lastAttempt = history[0];
  const answers = JSON.parse(sessionStorage.getItem('last-exam-answers') || '{}');

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
    navigate('/dashboard');
  };

  if (!lastAttempt) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-5 animate-fadeInUp">
        <div className="bg-slate-100 p-4 rounded-2xl w-fit mx-auto">
          <Award className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-extrabold tracking-tight text-slate-800">Belum Ada Hasil</h3>
        <p className="text-sm text-slate-500">Ikuti simulasi try out terlebih dahulu.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Ke Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const isPassed = lastAttempt.result === 'LULUS';
  const scorePercent = Math.round(((lastAttempt.score || 0) / 550) * 100);

  const categories = [
    { key: 'TWK', label: 'Wawasan Kebangsaan', score: lastAttempt.twk, max: 150, threshold: 65, color: 'blue' },
    { key: 'TIU', label: 'Inteligensia Umum', score: lastAttempt.tiu, max: 175, threshold: 80, color: 'indigo' },
    { key: 'TKP', label: 'Karakteristik Pribadi', score: lastAttempt.tkp, max: 225, threshold: 166, color: 'amber' }
  ];

  const colorMap = {
    blue: { bar: 'bg-blue-600', text: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
    indigo: { bar: 'bg-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-100' }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeInUp">
      {/* ─── HEADER ─── */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 ring-1 ring-blue-100 text-blue-700 text-[11px] font-bold">
          <Award className="h-3 w-3" /> Hasil Simulasi CAT
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Evaluasi Kelulusan SKD
        </h2>
        <p className="text-sm text-slate-500">{lastAttempt.title} — {lastAttempt.date}</p>
      </div>

      {/* ─── SCORE HERO ─── */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-8 text-center relative overflow-hidden">
        {/* Accent line */}
        <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${isPassed ? 'from-transparent via-emerald-400 to-transparent' : 'from-transparent via-red-400 to-transparent'}`} />

        {/* Circle score */}
        <div className="relative inline-flex items-center justify-center h-44 w-44 mb-5">
          <svg className="absolute w-full h-full -rotate-90">
            <circle cx="88" cy="88" r="78" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
            <circle
              cx="88" cy="88" r="78"
              stroke={isPassed ? '#10b981' : '#ef4444'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 78}
              strokeDashoffset={2 * Math.PI * 78 * (1 - (lastAttempt.score || 0) / 550)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{lastAttempt.score}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">/ 550 ({scorePercent}%)</span>
          </div>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ${isPassed
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            : 'bg-red-50 text-red-700 ring-red-200'
          }`}>
          {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {isPassed ? 'LULUS PASSING GRADE' : 'BELUM MEMENUHI SYARAT'}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">TWK ≥ 65 · TIU ≥ 80 · TKP ≥ 166</p>
      </div>

      {/* ─── CATEGORY BREAKDOWN ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const cm = colorMap[cat.color];
          const passed = cat.score >= cat.threshold;
          return (
            <div key={cat.key} className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat.key}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{cat.label}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ring-1 ${passed ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-red-50 text-red-600 ring-red-100'
                  }`}>
                  {passed ? 'Lolos' : 'Gagal'}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold tracking-tight ${cm.text}`}>{cat.score}</span>
                <span className="text-xs text-slate-400 font-medium">/ {cat.max}</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${cm.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${(cat.score / cat.max) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Ambang: {cat.threshold}</span>
                  <span>Maks: {cat.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ANSWER RATIO ─── */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-slate-700">Rasio Jawaban</span>
          <span className="text-xs font-semibold text-slate-400">{answeredCount}/{questions.length} terjawab</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full" style={{ width: `${((lastAttempt.correctCount || 0) / questions.length) * 100}%` }} />
          <div className="bg-amber-400 h-full" style={{ width: `${((answeredCount - (lastAttempt.correctCount || 0)) / questions.length) * 100}%` }} />
          <div className="bg-slate-200 h-full" style={{ width: `${(unansweredCount / questions.length) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Benar</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Salah/TKP</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" />Kosong</span>
        </div>
      </div>

      {/* ─── REVIEW ─── */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">Pembahasan Soal</h3>
          <p className="text-xs text-slate-400 mt-0.5">Analisis detail setiap jawaban Anda.</p>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            const isCorrect = q.category !== 'TKP' ? (userAns === q.correctAnswer) : null;
            const tkpPoints = q.category === 'TKP' ? (q.scores?.[userAns] || 0) : null;

            return (
              <details key={q.id} className="group rounded-xl ring-1 ring-slate-200/60 bg-slate-50/50 hover:ring-slate-300/60 transition-all duration-200">
                <summary className="flex justify-between items-center cursor-pointer px-4 py-3 list-none">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-8">{String(idx + 1).padStart(2, '0')}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ring-1 ${q.category === 'TWK' ? 'bg-blue-50 text-blue-600 ring-blue-100' :
                        q.category === 'TIU' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' :
                          'bg-amber-50 text-amber-600 ring-amber-100'
                      }`}>{q.category}</span>
                    <span className="text-xs font-medium text-slate-600 line-clamp-1 max-w-xs">{q.question.substring(0, 60)}...</span>
                  </div>

                  {q.category !== 'TKP' ? (
                    isCorrect ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Benar
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5 flex-shrink-0">
                        <XCircle className="h-3.5 w-3.5" /> {userAns ? 'Salah' : 'Kosong'}
                      </span>
                    )
                  ) : (
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 flex-shrink-0 ${tkpPoints >= 4 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      <Award className="h-3.5 w-3.5" /> {tkpPoints}/5
                    </span>
                  )}
                </summary>

                <div className="px-4 pb-4 pt-2 border-t border-slate-200/60 space-y-3 animate-fadeIn">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.question}</p>

                  <div className="text-xs space-y-1.5 pl-3 border-l-2 border-slate-200">
                    <p className="text-slate-600">
                      <span className="font-bold">Jawaban Anda:</span>{' '}
                      {userAns ? `${userAns}. ${q.options.find(o => o.key === userAns)?.text}` : <span className="text-red-500 font-bold">Tidak Menjawab</span>}
                    </p>
                    {q.category !== 'TKP' && (
                      <p className="text-slate-600">
                        <span className="font-bold">Kunci:</span> {q.correctAnswer}. {q.options.find(o => o.key === q.correctAnswer)?.text}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl ring-1 ring-slate-100 text-xs">
                    <span className="font-bold text-blue-700 block mb-1">Pembahasan:</span>
                    <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                    {q.category === 'TKP' && q.scores && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                        {Object.entries(q.scores).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded ring-1 ring-slate-100 font-semibold text-slate-600">
                            {k}: <strong className="text-slate-800">{v}p</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="flex justify-center pt-2">
        <Button onClick={handleBackToDashboard} className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
