import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

import { useExamStore } from '../../store/useExamStore';
 
export default function QuestionForm({
  isOpen,
  onClose,
  onSubmit,
  categories,
  packages = [],
  selectedQuestion
}) {
  const adminActiveProgram = useExamStore((state) => state.adminActiveProgram);
  const [tryoutId, setTryoutId] = useState(1);
  const [scoringMethod, setScoringMethod] = useState('BINARY');
  const [programType, setProgramType] = useState('SKD');
  const [category, setCategory] = useState('TWK');
  const [subCategory, setSubCategory] = useState('Teknis');
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
      setTryoutId(selectedQuestion.tryout_id || 1);
      setCategory(selectedQuestion.category || 'TWK');
      setQuestionText(selectedQuestion.question);
      setOptA(selectedQuestion.options?.find(o => o.key === 'A')?.text || selectedQuestion.option_a || '');
      setOptB(selectedQuestion.options?.find(o => o.key === 'B')?.text || selectedQuestion.option_b || '');
      setOptC(selectedQuestion.options?.find(o => o.key === 'C')?.text || selectedQuestion.option_c || '');
      setOptD(selectedQuestion.options?.find(o => o.key === 'D')?.text || selectedQuestion.option_d || '');
      setOptE(selectedQuestion.options?.find(o => o.key === 'E')?.text || selectedQuestion.option_e || '');
      setCorrectAnswer(selectedQuestion.correctAnswer || selectedQuestion.correct_answer?.toUpperCase() || 'A');
      setExplanation(selectedQuestion.explanation || '');
      setProgramType(selectedQuestion.program_type || 'SKD');
      setSubCategory(selectedQuestion.sub_category || 'Teknis');

      setScoringMethod(selectedQuestion.scoring_type || 'BINARY');

      const weights = selectedQuestion.options_weights || selectedQuestion.option_weights || selectedQuestion.scores;
      if (weights) {
        setScoreA(weights.A !== undefined ? weights.A : (weights.a !== undefined ? weights.a : 5));
        setScoreB(weights.B !== undefined ? weights.B : (weights.b !== undefined ? weights.b : 4));
        setScoreC(weights.C !== undefined ? weights.C : (weights.c !== undefined ? weights.c : 3));
        setScoreD(weights.D !== undefined ? weights.D : (weights.d !== undefined ? weights.d : 2));
        setScoreE(weights.E !== undefined ? weights.E : (weights.e !== undefined ? weights.e : 1));
      } else {
        setScoreA(5);
        setScoreB(4);
        setScoreC(3);
        setScoreD(2);
        setScoreE(1);
      }
    } else {
      const defaultTryoutId = packages && packages.length > 0 ? packages[0].id : 1;
      setTryoutId(defaultTryoutId);
      const activePkg = (packages || []).find(p => p.id === parseInt(defaultTryoutId));
      setScoringMethod(activePkg ? (activePkg.scoring_type || 'BINARY') : 'BINARY');
      setCategory('TWK');
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setOptE('');
      setCorrectAnswer('A');
      setExplanation('');
      setProgramType(adminActiveProgram || 'SKD');
      setSubCategory('Teknis');
      setScoreA(5);
      setScoreB(4);
      setScoreC(3);
      setScoreD(2);
      setScoreE(1);
    }
  }, [selectedQuestion, isOpen, adminActiveProgram, packages]);

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

  const handleScoringMethodChange = (method) => {
    setScoringMethod(method);
    if (method === 'BINARY') {
      setScoreA(5);
      setScoreB(0);
      setScoreC(0);
      setScoreD(0);
      setScoreE(0);
    } else if (method === 'WEIGHTED_1_5') {
      setScoreA(5);
      setScoreB(4);
      setScoreC(3);
      setScoreD(2);
      setScoreE(1);
    } else if (method === 'WEIGHTED_1_4') {
      setScoreA(4);
      setScoreB(3);
      setScoreC(2);
      setScoreD(1);
      setScoreE(0);
    }
  };

  const handleScoreChange = (optKey, val) => {
    const maxVal = scoringMethod === 'WEIGHTED_1_4' ? 4 : 5;
    const numVal = parseInt(val) || 0;
    let clampedVal = numVal;
    if (numVal < 0) clampedVal = 0;
    if (numVal > maxVal) clampedVal = maxVal;

    if (optKey === 'A') setScoreA(clampedVal);
    if (optKey === 'B') setScoreB(clampedVal);
    if (optKey === 'C') setScoreC(clampedVal);
    if (optKey === 'D') setScoreD(clampedVal);
    if (optKey === 'E') setScoreE(clampedVal);
  };

  const isWeighted = scoringMethod === 'WEIGHTED_1_5' || scoringMethod === 'WEIGHTED_1_4' || (scoringMethod === 'BINARY' && category === 'TKP');
  const showE = scoringMethod !== 'WEIGHTED_1_4';
  const activeOptions = showE ? optionSetters : optionSetters.slice(0, 4);
  const showWeightInput = isWeighted;
  const isPPPK = programType === 'PPPK';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const options = [
      { key: 'A', text: optA || "-" },
      { key: 'B', text: optB || "-" },
      { key: 'C', text: optC || "-" },
      { key: 'D', text: optD || "-" },
      { key: 'E', text: optE || "-" }
    ];

    const optionsWeights = {
      A: parseInt(scoreA) || 0,
      B: parseInt(scoreB) || 0,
      C: parseInt(scoreC) || 0,
      D: parseInt(scoreD) || 0,
      E: parseInt(scoreE) || 0
    };

    const questionData = {
      tryout_id: parseInt(tryoutId),
      category,
      question: questionText,
      program_type: programType,
      sub_category: isPPPK ? subCategory : null,
      options,
      explanation,
      correctAnswer: programType === 'PPPK' ? null : (correctAnswer ? correctAnswer.toLowerCase() : 'a'),
      correct_answer: programType === 'PPPK' ? null : (correctAnswer ? correctAnswer.toLowerCase() : 'a'),
      option_a: optA || "-",
      option_b: optB || "-",
      option_c: optC || "-",
      option_d: optD || "-",
      option_e: optE || "-",
      options_weights: isWeighted ? optionsWeights : null,
      scores: isWeighted ? optionsWeights : null,
      scoring_type: scoringMethod
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
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pilih Metode Penilaian</label>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Metode ini akan menentukan bagaimana skor dihitung dalam Try Out ini.
                </p>
              </div>
              <select
                value={scoringMethod}
                onChange={(e) => handleScoringMethodChange(e.target.value)}
                className="w-full sm:w-72 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              >
                <option value="BINARY">BINARY: SKD (Benar = 5 Poin, Salah = 0)</option>
                <option value="WEIGHTED_1_5">WEIGHTED_1_5: PPPK Teknis (Bobot 1-5)</option>
                <option value="WEIGHTED_1_4">WEIGHTED_1_4: PPPK Manajerial/Sosial/Wawancara (Bobot 1-4)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Paket Ujian</label>
              <select
                value={tryoutId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setTryoutId(selectedId);
                  const targetPkg = (packages || []).find(p => p.id === parseInt(selectedId));
                  if (targetPkg) {
                    setProgramType(targetPkg.program_type || 'SKD');
                  }
                }}
                className={selectClass}
                required
              >
                {(packages || []).map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </div>

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
                {(categories || []).map(cat => (
                  <option key={cat.id} value={cat.name.toUpperCase()}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
 
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Program</label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
                className={selectClass}
                disabled={!!adminActiveProgram}
                required
              >
                {!adminActiveProgram && <option value="">-- Pilih Program --</option>}
                <option value="SKD">SKD CPNS</option>
                <option value="PPPK">PPPK</option>
                <option value="PPG">PPG</option>
              </select>
            </div>
          </div>

          {isPPPK && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sub Kategori PPPK</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className={selectClass}
                required
              >
                <option value="Teknis">Teknis</option>
                <option value="Manajerial">Manajerial</option>
                <option value="Sosial Kultural">Sosial Kultural</option>
                <option value="Wawancara">Wawancara</option>
              </select>
            </div>
          )}

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
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isWeighted ? 'Opsi Jawaban & Bobot Nilai' : 'Opsi Jawaban & Kunci'}
            </label>
            {activeOptions.map((opt) => (
              <div key={opt.key} className="flex items-center gap-2">
                {!isWeighted && (
                  <input
                    type="radio"
                    name="correctAnswerOption"
                    checked={correctAnswer === opt.key}
                    onChange={() => setCorrectAnswer(opt.key)}
                    className="h-4.5 w-4.5 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    title="Jadikan Kunci Jawaban"
                  />
                )}
                <span className="text-[10px] font-bold text-slate-400 w-4 text-center">{opt.key}</span>
                <input
                  placeholder={`Opsi ${opt.key}`}
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                  required={opt.key !== 'E' || showE}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 ring-1 ring-slate-200/60 text-xs font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {showWeightInput && (
                  <input
                    type="number"
                    min="0"
                    max={scoringMethod === 'WEIGHTED_1_4' ? "4" : "5"}
                    value={opt.score}
                    onChange={(e) => handleScoreChange(opt.key, e.target.value)}
                    className={scoreInputClass}
                    title={`Skor opsi ${opt.key} (0 s.d. ${scoringMethod === 'WEIGHTED_1_4' ? '4' : '5'})`}
                    required
                  />
                )}
              </div>
            ))}
          </div>

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
