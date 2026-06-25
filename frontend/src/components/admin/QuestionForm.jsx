import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

export default function QuestionForm({
  isOpen,
  onClose,
  onSubmit,
  categories,
  selectedQuestion
}) {
  const [category, setCategory] = useState('TWK');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');

  const [scoreA, setScoreA] = useState(5);
  const [scoreB, setScoreB] = useState(4);
  const [scoreC, setScoreC] = useState(3);
  const [scoreD, setScoreD] = useState(2);
  const [scoreE, setScoreE] = useState(1);

  useEffect(() => {
    if (selectedQuestion) {
      setCategory(selectedQuestion.category);
      setQuestionText(selectedQuestion.question);
      setOptA(selectedQuestion.options?.find(o => o.key === 'A')?.text || '');
      setOptB(selectedQuestion.options?.find(o => o.key === 'B')?.text || '');
      setOptC(selectedQuestion.options?.find(o => o.key === 'C')?.text || '');
      setOptD(selectedQuestion.options?.find(o => o.key === 'D')?.text || '');
      setOptE(selectedQuestion.options?.find(o => o.key === 'E')?.text || '');
      setCorrectAnswer(selectedQuestion.correctAnswer || 'A');
      setExplanation(selectedQuestion.explanation || '');

      if (selectedQuestion.category === 'TKP' && selectedQuestion.scores) {
        setScoreA(selectedQuestion.scores.A || 5);
        setScoreB(selectedQuestion.scores.B || 4);
        setScoreC(selectedQuestion.scores.C || 3);
        setScoreD(selectedQuestion.scores.D || 2);
        setScoreE(selectedQuestion.scores.E || 1);
      }
    } else {
      setCategory('TWK');
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setOptE('');
      setCorrectAnswer('A');
      setExplanation('');
      setScoreA(5);
      setScoreB(4);
      setScoreC(3);
      setScoreD(2);
      setScoreE(1);
    }
  }, [selectedQuestion, isOpen]);

  if (!isOpen) return null;

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const textareaClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const scoreInputClass = "w-14 px-2 py-2.5 bg-slate-50 ring-1 ring-slate-200/60 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  const optionSetters = [
    { key: 'A', val: optA, set: setOptA, score: scoreA, setScore: setScoreA },
    { key: 'B', val: optB, set: setOptB, score: scoreB, setScore: setScoreB },
    { key: 'C', val: optC, set: setOptC, score: scoreC, setScore: setScoreC },
    { key: 'D', val: optD, set: setOptD, score: scoreD, setScore: setScoreD },
    { key: 'E', val: optE, set: setOptE, score: scoreE, setScore: setScoreE }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      category,
      question: questionText,
      options: [
        { key: 'A', text: optA },
        { key: 'B', text: optB },
        { key: 'C', text: optC },
        { key: 'D', text: optD },
        { key: 'E', text: optE }
      ],
      explanation,
      correctAnswer: category === 'TKP' ? null : correctAnswer,
      scores: category === 'TKP' ? {
        A: parseInt(scoreA),
        B: parseInt(scoreB),
        C: parseInt(scoreC),
        D: parseInt(scoreD),
        E: parseInt(scoreE)
      } : null
    };
    onSubmit(questionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-3xl border border-slate-200/60 shadow-premium-lg max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            {selectedQuestion ? 'Edit Soal Ujian' : 'Input Soal Manual Baru'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value === 'TKP') setCorrectAnswer('A');
              }}
              className={selectClass}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name.toUpperCase()}>
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Soal</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Tuliskan pertanyaan..."
              rows="3"
              className={textareaClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opsi Jawaban</label>
            {optionSetters.map((opt) => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 w-4">{opt.key}</span>
                <input
                  placeholder={`Opsi ${opt.key}`}
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 ring-1 ring-slate-200/60 text-xs font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {category === 'TKP' && (
                  <input
                    type="number" min="1" max="5"
                    value={opt.score}
                    onChange={(e) => opt.setScore(e.target.value)}
                    className={scoreInputClass}
                    title={`Skor opsi ${opt.key}`}
                  />
                )}
              </div>
            ))}
          </div>

          {category !== 'TKP' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kunci Jawaban</label>
              <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className={selectClass}>
                {['A', 'B', 'C', 'D', 'E'].map(k => <option key={k} value={k}>Opsi {k}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pembahasan</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Pembahasan detail..."
              rows="2"
              className={textareaClass}
              required
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white">
              {selectedQuestion ? 'Simpan Perubahan' : 'Tambah Soal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
