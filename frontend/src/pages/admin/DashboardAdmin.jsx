import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { Trash, Edit, Plus, X, FileText, Receipt, UploadCloud, Download, Table, AlertCircle, Check, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import AdminPembayaran from './AdminPembayaran'; // <-- Import halaman pembayaran

export default function DashboardAdmin() {
  const { 
    questions, 
    addQuestion, 
    deleteQuestion, 
    updateQuestion, 
    fetchQuestions, 
    bulkAddQuestions,
    packages,
    createPackage,
    updatePackage,
    deletePackage,
    fetchPackages
  } = useExamStore();

  // State untuk Tab Navigasi Admin
  const [activeTab, setActiveTab] = useState('soal'); // 'soal', 'pembayaran', 'paket'

  const [showManualForm, setShowManualForm] = useState(true);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);

  // CRUD state for Packages
  const [isEditingPkg, setIsEditingPkg] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgDuration, setPkgDuration] = useState(100);
  const [pkgPrice, setPkgPrice] = useState('Rp 199.000');
  const [pkgStatus, setPkgStatus] = useState('Aktif');

  const resetPkgForm = () => {
    setIsEditingPkg(false);
    setEditingPkgId(null);
    setPkgTitle('');
    setPkgDescription('');
    setPkgDuration(100);
    setPkgPrice('Rp 199.000');
    setPkgStatus('Aktif');
  };

  const handleEditPkgClick = (pkg) => {
    setIsEditingPkg(true);
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgDescription(pkg.description);
    setPkgDuration(pkg.duration);
    setPkgPrice(pkg.price || 'Rp 199.000');
    setPkgStatus(pkg.status);
  };

  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    if (!pkgTitle || !pkgDescription || !pkgDuration) {
      alert('Harap isi seluruh formulir data paket!');
      return;
    }

    const pkgData = {
      id: editingPkgId,
      title: pkgTitle,
      description: pkgDescription,
      duration: pkgDuration,
      status: pkgStatus
    };

    try {
      if (isEditingPkg) {
        await updatePackage(pkgData);
        alert('Paket tryout berhasil diperbarui!');
      } else {
        await createPackage(pkgData);
        alert('Paket tryout baru berhasil ditambahkan!');
      }
      resetPkgForm();
    } catch (err) {
      alert('Gagal menyimpan paket tryout.');
    }
  };

  const handlePkgDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket tryout ini?')) {
      try {
        await deletePackage(id);
        alert('Paket tryout berhasil dihapus!');
      } catch (err) {
        alert('Gagal menghapus paket tryout.');
      }
    }
  };

  useEffect(() => {
    fetchQuestions(1);
    fetchPackages();
  }, [fetchQuestions, fetchPackages]);

  const handleDownloadTemplate = () => {
    const headers = [
      "Kategori",
      "Pertanyaan",
      "Opsi A",
      "Opsi B",
      "Opsi C",
      "Opsi D",
      "Opsi E",
      "Kunci",
      "Skor A",
      "Skor B",
      "Skor C",
      "Skor D",
      "Skor E",
      "Pembahasan"
    ];

    const worksheetData = [
      headers,
      ["TWK", "Apa dasar negara Indonesia?", "Pancasila", "UUD 1945", "Proklamasi", "Dekrit Presiden", "Supersemar", "A", "", "", "", "", "", "Pancasila adalah dasar negara Indonesia."],
      ["TKP", "Ketika menghadapi pelanggan yang marah, sikap Anda adalah...", "Mendengarkan dengan sabar", "Melaporkan ke atasan", "Membalas dengan marah", "Mengabaikannya", "Meninggalkannya", "", "5", "4", "3", "2", "1", "Mendengarkan keluhan pelanggan adalah sikap pelayanan terbaik."]
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    ws['!cols'] = [
      { wch: 10 },
      { wch: 40 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 30 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Bank Soal");
    XLSX.writeFile(wb, "template_bank_soal.xlsx");
  };

  const processExcelFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rows.length === 0) {
          alert('Berkas Excel kosong!');
          return;
        }

        const fileHeaders = rows[0].map(h => String(h).trim().toLowerCase());
        const getColIndex = (names) => {
          return fileHeaders.findIndex(h => names.some(name => h === name.toLowerCase()));
        };

        const idxKat = getColIndex(["Kategori"]);
        const idxPertanyaan = getColIndex(["Pertanyaan", "Soal"]);
        const idxOpsiA = getColIndex(["Opsi A", "Pilihan A"]);
        const idxOpsiB = getColIndex(["Opsi B", "Pilihan B"]);
        const idxOpsiC = getColIndex(["Opsi C", "Pilihan C"]);
        const idxOpsiD = getColIndex(["Opsi D", "Pilihan D"]);
        const idxOpsiE = getColIndex(["Opsi E", "Pilihan E"]);
        const idxKunci = getColIndex(["Kunci", "Jawaban"]);
        const idxSkorA = getColIndex(["Skor A"]);
        const idxSkorB = getColIndex(["Skor B"]);
        const idxSkorC = getColIndex(["Skor C"]);
        const idxSkorD = getColIndex(["Skor D"]);
        const idxSkorE = getColIndex(["Skor E"]);
        const idxPembahasan = getColIndex(["Pembahasan", "Keterangan"]);

        const parsed = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || row.every(val => val === undefined || val === null || val === '')) {
            continue;
          }

          const getVal = (idx) => {
            if (idx === -1 || idx >= row.length) return '';
            return row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '';
          };

          const rawCategory = getVal(idxKat).toUpperCase();
          const questionText = getVal(idxPertanyaan);
          const valA = getVal(idxOpsiA);
          const valB = getVal(idxOpsiB);
          const valC = getVal(idxOpsiC);
          const valD = getVal(idxOpsiD);
          const valE = getVal(idxOpsiE);
          const rawKey = getVal(idxKunci).toUpperCase();
          
          const rawSkorA = getVal(idxSkorA);
          const rawSkorB = getVal(idxSkorB);
          const rawSkorC = getVal(idxSkorC);
          const rawSkorD = getVal(idxSkorD);
          const rawSkorE = getVal(idxSkorE);

          const explanation = getVal(idxPembahasan);

          const errors = [];
          
          if (!rawCategory || !['TWK', 'TIU', 'TKP'].includes(rawCategory)) {
            errors.push('Kategori harus TWK, TIU, atau TKP');
          }
          if (!questionText) {
            errors.push('Pertanyaan tidak boleh kosong');
          }
          if (!valA || !valB || !valC || !valD || !valE) {
            errors.push('Seluruh Opsi A - E harus diisi');
          }

          let formattedScores = null;
          let correctAnswer = rawKey;

          if (rawCategory === 'TKP') {
            const scoreA = rawSkorA ? parseInt(rawSkorA) : 5;
            const scoreB = rawSkorB ? parseInt(rawSkorB) : 4;
            const scoreC = rawSkorC ? parseInt(rawSkorC) : 3;
            const scoreD = rawSkorD ? parseInt(rawSkorD) : 2;
            const scoreE = rawSkorE ? parseInt(rawSkorE) : 1;

            if (isNaN(scoreA) || scoreA < 1 || scoreA > 5 ||
                isNaN(scoreB) || scoreB < 1 || scoreB > 5 ||
                isNaN(scoreC) || scoreC < 1 || scoreC > 5 ||
                isNaN(scoreD) || scoreD < 1 || scoreD > 5 ||
                isNaN(scoreE) || scoreE < 1 || scoreE > 5) {
              errors.push('Skor A-E untuk TKP harus berkisar antara 1-5');
            }

            formattedScores = { A: scoreA, B: scoreB, C: scoreC, D: scoreD, E: scoreE };
            correctAnswer = null;
          } else {
            if (!rawKey || !['A', 'B', 'C', 'D', 'E'].includes(rawKey)) {
              errors.push('Kunci jawaban harus A, B, C, D, atau E');
            }
          }

          if (!explanation) {
            errors.push('Pembahasan tidak boleh kosong');
          }

          parsed.push({
            category: rawCategory,
            question: questionText,
            options: {
              A: valA,
              B: valB,
              C: valC,
              D: valD,
              E: valE
            },
            correctAnswer,
            scores: formattedScores,
            explanation,
            isValid: errors.length === 0,
            errors
          });
        }

        setPreviewQuestions(parsed);
      } catch (err) {
        console.error(err);
        alert('Gagal membaca file Excel. Pastikan format berkas benar.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processExcelFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processExcelFile(file);
  };

  const handleSaveBulk = async () => {
    const validQuestions = previewQuestions.filter(pq => pq.isValid);
    if (validQuestions.length === 0) {
      alert('Tidak ada soal valid untuk disimpan.');
      return;
    }

    try {
      const mapped = validQuestions.map(pq => ({
        category: pq.category,
        question: pq.question,
        options: [
          { key: 'A', text: pq.options.A },
          { key: 'B', text: pq.options.B },
          { key: 'C', text: pq.options.C },
          { key: 'D', text: pq.options.D },
          { key: 'E', text: pq.options.E }
        ],
        correctAnswer: pq.correctAnswer,
        scores: pq.scores,
        explanation: pq.explanation
      }));

      await bulkAddQuestions(mapped);
      alert(`Berhasil mengimpor ${mapped.length} soal ke bank soal!`);
      setPreviewQuestions([]);
      setShowExcelImport(false);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan soal.');
    }
  };

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
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">

      {/* ─── HEADER & NAVIGASI TAB ADMIN ─── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard Administrator</h2>
          <p className="text-sm text-slate-500">Pusat kendali untuk konten tryout dan verifikasi pembayaran.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('soal')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'soal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            <FileText className="h-4 w-4" />
            Kelola Bank Soal
          </button>

          <button
            onClick={() => setActiveTab('pembayaran')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'pembayaran'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            <Receipt className="h-4 w-4" />
            Verifikasi Pembayaran
            {/* Indikator notifikasi kecil (opsional) */}
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('paket')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'paket'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            <Layers className="h-4 w-4" />
            Kelola Paket Tryout
          </button>
        </div>
      </div>

      {/* ─── KONTEN TAB KELOLA SOAL ─── */}
      {activeTab === 'soal' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Control Card */}
          <Card className="p-5 flex flex-wrap gap-4 items-center justify-between bg-white border border-slate-200/60 shadow-premium">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={showManualForm ? "primary" : "outline"} 
                onClick={() => {
                  setShowManualForm(!showManualForm);
                  setShowExcelImport(false);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showManualForm ? "Tutup Form" : "Tambah Manual"}
              </Button>
              <Button 
                variant={showExcelImport ? "primary" : "outline"} 
                onClick={() => {
                  setShowExcelImport(!showExcelImport);
                  setShowManualForm(false);
                }}
                className="flex items-center gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                Import Excel
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 text-slate-700"
            >
              <Download className="h-4 w-4" />
              Download Template Excel
            </Button>
          </Card>

          {/* Area Import Excel */}
          {showExcelImport && (
            <Card className="p-6 space-y-6 bg-white border border-slate-200/60 shadow-premium animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-800">Import Soal dari Excel</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Unggah berkas template Excel yang telah diisi.</p>
              </div>

              {/* Upload Dropzone */}
              <div 
                className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('excel-file-input').click()}
              >
                <input 
                  id="excel-file-input" 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  onChange={handleFileSelect} 
                />
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Pilih berkas Excel atau tarik & letakkan di sini</p>
                  <p className="text-xs text-slate-400 mt-1">Hanya mendukung format .xlsx atau .xls</p>
                </div>
              </div>

              {/* Preview Table */}
              {previewQuestions.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Table className="h-4 w-4 text-blue-600" />
                        Pratinjau Data Soal
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Ditemukan {previewQuestions.length} baris. ({previewQuestions.filter(q => q.isValid).length} valid, {previewQuestions.filter(q => !q.isValid).length} cacat)
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/60">
                          <th className="px-4 py-3 text-center w-12">No</th>
                          <th className="px-4 py-3 w-16">Kat</th>
                          <th className="px-4 py-3 max-w-[200px]">Pertanyaan</th>
                          <th className="px-4 py-3">Opsi (A - E)</th>
                          <th className="px-4 py-3 text-center w-16">Kunci</th>
                          <th className="px-4 py-3 text-center w-24">Skor (A-E)</th>
                          <th className="px-4 py-3 max-w-[150px]">Pembahasan</th>
                          <th className="px-4 py-3 text-red-500 w-32">Status / Eror</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 font-medium">
                        {previewQuestions.map((pq, idx) => (
                          <tr key={idx} className={`hover:bg-slate-50/30 transition-colors ${!pq.isValid ? 'bg-red-50 text-red-900' : 'text-slate-700'}`}>
                            <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <Badge variant={pq.category === 'TWK' ? 'primary' : pq.category === 'TIU' ? 'secondary' : 'warning'}>
                                {pq.category || 'N/A'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 max-w-[200px] truncate" title={pq.question}>{pq.question || <span className="italic text-red-400">Kosong</span>}</td>
                            <td className="px-4 py-3">
                              <div className="space-y-0.5 text-[10px]">
                                <div><span className="font-bold">A:</span> {pq.options.A || <span className="italic text-red-400">Kosong</span>}</div>
                                <div><span className="font-bold">B:</span> {pq.options.B || <span className="italic text-red-400">Kosong</span>}</div>
                                <div><span className="font-bold">C:</span> {pq.options.C || <span className="italic text-red-400">Kosong</span>}</div>
                                <div><span className="font-bold">D:</span> {pq.options.D || <span className="italic text-red-400">Kosong</span>}</div>
                                <div><span className="font-bold">E:</span> {pq.options.E || <span className="italic text-red-400">Kosong</span>}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-bold">{pq.correctAnswer || '-'}</td>
                            <td className="px-4 py-3 text-center text-[10px]">
                              {pq.category === 'TKP' && pq.scores ? (
                                <span>A:{pq.scores.A}, B:{pq.scores.B}, C:{pq.scores.C}, D:{pq.scores.D}, E:{pq.scores.E}</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 max-w-[150px] truncate" title={pq.explanation}>{pq.explanation || '-'}</td>
                            <td className="px-4 py-3">
                              {pq.isValid ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="h-3 w-3" /> Valid</span>
                              ) : (
                                <span className="text-red-500 font-bold flex items-center gap-1.5 leading-snug">
                                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span>{pq.errors.join(', ')}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setPreviewQuestions([])}
                    >
                      Batal
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSaveBulk}
                      disabled={previewQuestions.filter(q => q.isValid).length === 0}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                    >
                      💾 Simpan {previewQuestions.filter(q => q.isValid).length} Soal Valid
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Grid Utama Form / Tabel Bank Soal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {showManualForm && (
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
                        <>Simpan Perubahan</>
                      ) : (
                        <><Plus className="h-3.5 w-3.5 mr-1" />Tambah Soal</>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className={showManualForm ? "lg:col-span-8" : "lg:col-span-12"}>
              {/* Table Bank Soal */}
              <Card className="p-0 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Bank Soal</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{questions.length} butir soal</p>
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
        </div>
      )}

      {/* ─── KONTEN TAB PEMBAYARAN ─── */}
      {activeTab === 'pembayaran' && (
        <div className="animate-fadeIn">
          <AdminPembayaran />
        </div>
      )}

      {/* ─── KONTEN TAB KELOLA PAKET TRYOUT ─── */}
      {activeTab === 'paket' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fadeIn">
          {/* Form Paket */}
          <Card className="lg:col-span-4 p-5 space-y-5 bg-white border border-slate-200/60 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {isEditingPkg ? 'Edit Paket Tryout' : 'Paket Tryout Baru'}
              </h3>
              {isEditingPkg && (
                <button onClick={resetPkgForm} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form onSubmit={handlePkgSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Paket</label>
                <input
                  type="text"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  placeholder="Contoh: Tryout Premium Akbar 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea
                  value={pkgDescription}
                  onChange={(e) => setPkgDescription(e.target.value)}
                  placeholder="Deskripsi paket tryout..."
                  rows="3"
                  className={textareaClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Harga</label>
                  <input
                    type="text"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="Rp 199.000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={pkgStatus}
                  onChange={(e) => setPkgStatus(e.target.value)}
                  className={selectClass}
                >
                  <option value="Aktif">Aktif (Gratis)</option>
                  <option value="Terkunci">Terkunci (Premium)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-1">
                {isEditingPkg && (
                  <Button variant="outline" className="flex-1" onClick={resetPkgForm}>Batal</Button>
                )}
                <Button type="submit" variant="primary" className="flex-grow">
                  {isEditingPkg ? (
                    <>Simpan Perubahan</>
                  ) : (
                    <><Plus className="h-3.5 w-3.5 mr-1" />Tambah Paket</>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Tabel Paket Tryout */}
          <Card className="lg:col-span-8 p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Daftar Paket Tryout</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{packages.length} paket terdaftar</p>
              </div>
              <Badge variant="primary">CPNS SKD</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 w-10 text-center">ID</th>
                    <th className="px-5 py-3">Nama Paket</th>
                    <th className="px-5 py-3">Deskripsi</th>
                    <th className="px-5 py-3 text-center w-20">Durasi</th>
                    <th className="px-5 py-3 text-center w-24">Harga</th>
                    <th className="px-5 py-3 text-center w-24">Status</th>
                    <th className="px-5 py-3 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-sm">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-5 py-3 text-center text-[10px] font-bold text-slate-400">{pkg.id}</td>
                      <td className="px-5 py-3 font-bold text-slate-800">{pkg.title}</td>
                      <td className="px-5 py-3">
                        <p className="line-clamp-2 text-xs font-medium text-slate-500 leading-relaxed">{pkg.description}</p>
                      </td>
                      <td className="px-5 py-3 text-center font-semibold text-slate-700">{pkg.duration} Min</td>
                      <td className="px-5 py-3 text-center font-bold text-slate-700">{pkg.price || 'Rp 199.000'}</td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant={pkg.status === 'Aktif' ? 'success' : 'neutral'}>
                          {pkg.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditPkgClick(pkg)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handlePkgDelete(pkg.id)}
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
      )}

    </div>
  );
}