import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { Trash, Edit, Plus, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function DashboardAdmin() {
  const { questions, addQuestion, deleteQuestion, updateQuestion, fetchQuestions } = useExamStore();

  useEffect(() => {
    fetchQuestions(1);
  }, [fetchQuestions]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
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
  };

  const handleEditClick = (q) => {
    setIsEditing(true);
    setEditingId(q.id);
    setCategory(q.category);
    setQuestionText(q.question);
    setOptA(q.options.find(o => o.key === 'A')?.text || '');
    setOptB(q.options.find(o => o.key === 'B')?.text || '');
    setOptC(q.options.find(o => o.key === 'C')?.text || '');
    setOptD(q.options.find(o => o.key === 'D')?.text || '');
    setOptE(q.options.find(o => o.key === 'E')?.text || '');
    setCorrectAnswer(q.correctAnswer || 'A');
    setExplanation(q.explanation || '');

    if (q.category === 'TKP' && q.scores) {
      setScoreA(q.scores.A || 5);
      setScoreB(q.scores.B || 4);
      setScoreC(q.scores.C || 3);
      setScoreD(q.scores.D || 2);
      setScoreE(q.scores.E || 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText || !optA || !optB || !optC || !optD || !optE || !explanation) {
      alert('Harap isi seluruh formulir data soal!');
      return;
    }

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

    if (isEditing) {
      updateQuestion({ ...questionData, id: editingId });
      alert('Soal ujian berhasil diperbarui!');
    } else {
      addQuestion(questionData);
      alert('Soal ujian baru berhasil ditambahkan!');
    }

    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      deleteQuestion(id);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Kelola Bank Soal</h2>
        <p className="text-xs text-slate-500">Tambah, edit, dan hapus soal ujian simulasi CAT.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Form */}
        <Card className="lg:col-span-4 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              {isEditing ? 'Edit Soal' : 'Soal Baru'}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <option value="TWK">TWK — Wawasan Kebangsaan</option>
                <option value="TIU">TIU — Inteligensia Umum</option>
                <option value="TKP">TKP — Karakteristik Pribadi</option>
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

            <div className="flex gap-2.5 pt-1">
              {isEditing && (
                <Button variant="outline" className="flex-1" onClick={resetForm}>Batal</Button>
              )}
              <Button type="submit" variant="primary" className="flex-grow">
                {isEditing ? (
                  <>Simpan</>
                ) : (
                  <><Plus className="h-3.5 w-3.5" />Tambah</>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Table */}
        <Card className="lg:col-span-8 p-0 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Bank Soal</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{questions.length} butir soal</p>
            </div>
            <Badge variant="primary">CPNS SKD</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3 w-10 text-center">#</th>
                  <th className="px-5 py-3 w-20">Kat</th>
                  <th className="px-5 py-3">Pertanyaan</th>
                  <th className="px-5 py-3 text-center w-24">Kunci</th>
                  <th className="px-5 py-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-sm">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-5 py-3 text-center text-[10px] font-bold text-slate-400">{q.id}</td>
                    <td className="px-5 py-3">
                      <Badge variant={
                        q.category === 'TWK' ? 'primary' : q.category === 'TIU' ? 'secondary' : 'warning'
                      }>
                        {q.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <p className="line-clamp-2 text-xs font-medium text-slate-700 leading-relaxed">{q.question}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {q.category === 'TKP' ? (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded ring-1 ring-amber-100">1-5</span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded ring-1 ring-blue-100">{q.correctAnswer}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleEditClick(q)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
