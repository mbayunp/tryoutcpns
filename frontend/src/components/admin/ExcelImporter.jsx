import React, { useState } from 'react';
import { UploadCloud, Table, Check, AlertCircle, X as XIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function ExcelImporter({
  isOpen,
  categories,
  bulkAddQuestions,
  onClose
}) {
  const [previewQuestions, setPreviewQuestions] = useState([]);

  if (!isOpen) return null;

  const getCategoryBadgeVariant = (catName) => {
    if (!catName) return 'neutral';
    const name = catName.toUpperCase();
    if (name === 'TWK') return 'primary';
    if (name === 'TIU') return 'secondary';
    if (name === 'TKP') return 'warning';
    return 'success';
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
          Swal.fire({
            title: 'Berkas Kosong',
            text: 'Berkas Excel kosong!',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
          });
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

          const categoryNames = categories.map(c => c.name.toUpperCase());
          if (!rawCategory || !categoryNames.includes(rawCategory.trim())) {
            errors.push(`Kategori harus salah satu dari: ${categoryNames.join(', ')}`);
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
        Swal.fire({
          title: 'Gagal Membaca Excel',
          text: 'Gagal membaca file Excel. Pastikan format berkas benar.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
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
      Swal.fire({
        title: 'Peringatan',
        text: 'Tidak ada soal valid untuk disimpan.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
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
      Swal.fire({
        title: 'Berhasil!',
        text: `Berhasil mengimpor ${mapped.length} soal ke bank soal!`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
      setPreviewQuestions([]);
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan soal.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-white border border-slate-200/60 shadow-premium animate-fadeIn">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-800">Import Soal dari Excel</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-semibold">Unggah berkas template Excel yang telah diisi.</p>
        </div>
        <button onClick={() => { setPreviewQuestions([]); onClose(); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors">
          <XIcon className="h-5 w-5" />
        </button>
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
                      <Badge variant={getCategoryBadgeVariant(pq.category)}>
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
  );
}
