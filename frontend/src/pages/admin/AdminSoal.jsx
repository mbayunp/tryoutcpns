import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { FileText, Layers, Clock, Megaphone, Plus, UploadCloud, Download, Search, Edit, Trash, X, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import QuestionForm from '../../components/admin/QuestionForm';
import ExcelImporter from '../../components/admin/ExcelImporter';

export default function AdminSoal() {
  const {
    questions,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    fetchQuestions,
    bulkAddQuestions,
    packages,
    fetchPackages,
    categories,
    fetchCategories,
    createCategory,
    deleteCategory: deleteStoreCategory,
    syncCategoryQuestions,
    announcements,
    fetchAnnouncements,
    transactions,
    fetchTransactions,
    adminActiveProgram
  } = useExamStore();

  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setError(null);
        const data = await fetchQuestions(1);
        if (data === null) {
          setError('Data Try Out (ID 1) tidak ditemukan');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Gagal memuat data soal');
      }
    };
    loadQuestions();
    fetchPackages(adminActiveProgram);
    fetchAnnouncements(adminActiveProgram);
    fetchTransactions(adminActiveProgram);
    fetchCategories(adminActiveProgram);
  }, [adminActiveProgram]);

  // State for Bank Soal
  const [showManualForm, setShowManualForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncTargetPackageId, setSyncTargetPackageId] = useState('');
  const [syncTargetCategory, setSyncTargetCategory] = useState('');

  // CRUD state for Questions
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setSelectedQuestion(null);
    setShowManualForm(false);
  };

  const handleEditClick = (q) => {
    setIsEditing(true);
    setEditingId(q.id);
    setSelectedQuestion(q);
    setShowManualForm(true);
  };

  const handleFormSubmit = async (questionData) => {
    try {
      if (isEditing) {
        await updateQuestion({ ...questionData, id: editingId });
        Swal.fire({
          title: 'Berhasil!',
          text: 'Soal ujian berhasil diperbarui!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await addQuestion(questionData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Soal ujian baru berhasil ditambahkan!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      resetForm();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan soal.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Soal',
      text: 'Apakah Anda yakin ingin menghapus soal ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await deleteQuestion(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Soal berhasil dihapus.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus soal.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName('');
      Swal.fire({
        title: 'Berhasil!',
        text: 'Tipe soal baru berhasil ditambahkan!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: err.response?.data?.message || 'Gagal menambahkan tipe soal.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: 'Hapus Tipe Soal',
      text: `Apakah Anda yakin ingin menghapus tipe soal "${name}"? Semua soal dengan tipe ini mungkin akan terpengaruh.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await deleteStoreCategory(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tipe soal berhasil dihapus!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus tipe soal. Pastikan tipe soal tidak digunakan oleh soal aktif.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    if (!syncTargetPackageId || !syncTargetCategory) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap pilih paket try out dan tipe soal!',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const targetPkg = packages.find(p => p.id === parseInt(syncTargetPackageId));

    const result = await Swal.fire({
      title: 'Konfirmasi Sinkronisasi',
      text: `Apakah Anda yakin ingin mensinkronkan semua soal tipe "${syncTargetCategory}" dari bank soal ke paket "${targetPkg?.title || ''}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Sinkronkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Sedang Sinkronisasi...',
        text: 'Harap tunggu sebentar.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await syncCategoryQuestions(parseInt(syncTargetPackageId), syncTargetCategory);
        Swal.fire({
          title: 'Berhasil!',
          text: `Sinkronisasi soal tipe "${syncTargetCategory}" ke paket "${targetPkg?.title || ''}" berhasil!`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        setShowSyncModal(false);
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat mensinkronkan soal.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Metrics
  const totalQuestions = questions ? questions.length : 0;
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.name.toUpperCase()] = questions ? questions.filter(q => q.category === cat.name.toUpperCase()).length : 0;
    return acc;
  }, {});
  const totalPackages = packages ? packages.length : 0;
  const pendingVerifications = transactions ? transactions.filter(t => t.status === 'pending').length : 0;
  const activeBanners = announcements ? announcements.filter(a => a.is_active).length : 0;

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(q.id).includes(searchQuery);
    const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
    const matchesProgram = !adminActiveProgram || q.program_type === adminActiveProgram;
    return matchesSearch && matchesCategory && matchesProgram;
  });

  const getCategoryBadgeVariant = (catName) => {
    if (!catName) return 'neutral';
    const name = catName.toUpperCase();
    if (name === 'TWK') return 'primary';
    if (name === 'TIU') return 'secondary';
    if (name === 'TKP') return 'warning';
    return 'success';
  };

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans animate-fadeIn">
      {/* Header Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manajemen Bank Soal</h2>
        <p className="text-sm text-slate-500">Kelola soal tryout, impor excel, dan mapping kategori.</p>
      </div>

      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bank Soal</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">{totalQuestions} <span className="text-xs font-medium text-slate-500">Soal</span></h3>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                {categories.map((cat, idx) => {
                  const name = cat.name.toUpperCase();
                  const colors = ['text-red-650', 'text-indigo-650', 'text-emerald-600', 'text-amber-600', 'text-purple-650', 'text-pink-650'];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <span key={cat.id} className={colorClass}>
                      {name}: {categoryCounts[name] || 0}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paket Ujian</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">{totalPackages} <span className="text-xs font-medium text-slate-500">Paket</span></h3>
              <p className="text-[10px] text-slate-400 font-semibold">Aktif & Terkunci</p>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verifikasi Pending</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">{pendingVerifications} <span className="text-xs font-medium text-slate-500">Trx</span></h3>
              <p className="text-[10px] text-amber-650 font-semibold animate-pulse">Butuh Tindakan</p>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
              <Megaphone className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Banner Aktif</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">{activeBanners} <span className="text-xs font-medium text-slate-500">Banner</span></h3>
              <p className="text-[10px] text-slate-400 font-semibold">Tampil di Header</p>
            </div>
          </Card>
        </div>

        {/* Top Control Card */}
        <Card className="p-5 flex flex-wrap gap-4 items-center justify-between bg-white border border-slate-200/60 shadow-premium">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowManualForm(true);
              }}
              className="flex items-center gap-2 bg-[#0B1C30] hover:bg-[#102A43] text-white"
            >
              <Plus className="h-4 w-4" />
              Tambah Soal Manual
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
            <Button
              variant="outline"
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center gap-2 text-slate-700"
            >
              <Layers className="h-4 w-4" />
              Kelola Tipe Soal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSyncTargetCategory(filterCategory !== 'ALL' ? filterCategory : '');
                setShowSyncModal(true);
              }}
              className="flex items-center gap-2 text-indigo-700 hover:bg-indigo-50 border-indigo-200"
            >
              <Clock className="h-4 w-4" />
              Sinkronkan ke Try Out
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
        <ExcelImporter
          isOpen={showExcelImport}
          categories={categories}
          bulkAddQuestions={bulkAddQuestions}
          onClose={() => setShowExcelImport(false)}
        />

        {/* Grid Utama Form / Tabel Bank Soal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-12">
            {/* Table Bank Soal */}
            <Card className="p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
              <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Bank Soal</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                    Menampilkan {filteredQuestions.length} dari {questions.length} butir soal
                  </p>
                </div>
                <Badge variant="primary">CPNS SKD</Badge>
              </div>

              {error && (
                <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-xs font-semibold shadow-sm">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Filter and Search Bar Control Row */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari pertanyaan atau ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 text-slate-700"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {[
                    { key: 'ALL', label: 'SEMUA' },
                    ...categories.map(c => ({ key: c.name.toUpperCase(), label: c.name.toUpperCase() }))
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFilterCategory(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCategory === tab.key
                        ? 'bg-[#0B1C30] text-white shadow-sm'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left hidden md:table">
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
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-5 py-3 text-center text-[10px] font-bold text-slate-400">{q.id}</td>
                          <td className="px-5 py-3">
                            <Badge variant={getCategoryBadgeVariant(q.category)}>
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-12 text-center text-slate-400 font-semibold text-xs">
                          Tidak ada soal yang cocok dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden divide-y divide-slate-100 bg-white">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <div key={q.id} className="p-4 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">ID: {q.id}</span>
                        <Badge variant={getCategoryBadgeVariant(q.category)}>
                          {q.category}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <div className="text-[10px] font-bold text-slate-500">
                          Kunci: {q.category === 'TKP' ? (
                            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ring-1 ring-amber-100">1-5</span>
                          ) : (
                            <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ring-1 ring-blue-100">{q.correctAnswer}</span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditClick(q)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Hapus"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-4 text-center text-slate-400 font-semibold text-xs">
                    Tidak ada soal yang cocok dengan filter pencarian.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Modal input manual */}
        <QuestionForm
          isOpen={showManualForm}
          onClose={resetForm}
          onSubmit={handleFormSubmit}
          categories={categories}
          packages={packages}
          selectedQuestion={selectedQuestion}
        />
      </div>

      {/* MODAL KELOLA TIPE SOAL (CATEGORY MANAGER) */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowCategoryManager(false)}
          />

          <div className="relative z-10 bg-white rounded-3xl border border-slate-200/80 shadow-premium-lg max-w-md w-full p-6 sm:p-8 space-y-6 animate-scaleUp flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Kelola Tipe Soal (Kategori)</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Tambahkan atau hapus tipe soal yang tersedia di platform.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryManager(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Tambah Tipe Soal */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: SKB, TIU, TWK, TKP"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                required
              />
              <Button type="submit" variant="primary" className="bg-[#0B1C30] hover:bg-[#102A43] text-white">
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </form>

            {/* List Tipe Soal */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[40vh]">
              {categories.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">Belum ada tipe soal terdaftar.</p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-150 bg-slate-50/30 hover:bg-slate-50 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-800">{cat.name.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">(ID: {cat.id})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCategoryManager(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SINKRONISASI KE TRY OUT */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowSyncModal(false)}
          />

          <div className="relative z-10 bg-white rounded-3xl border border-slate-200/80 shadow-premium-lg max-w-md w-full p-6 sm:p-8 space-y-6 animate-scaleUp flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sinkronisasi ke Try Out</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Petakan semua soal tipe tertentu dari bank soal ke paket try out pilihan.
                </p>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSyncSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Tipe Soal</label>
                <select
                  value={syncTargetCategory}
                  onChange={(e) => setSyncTargetCategory(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">-- Pilih Tipe Soal --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name.toUpperCase()}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Paket Ujian Target</label>
                <select
                  value={syncTargetPackageId}
                  onChange={(e) => setSyncTargetPackageId(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">-- Pilih Paket Try Out --</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 space-y-1.5">
                <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Info Sinkronisasi
                </p>
                <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                  Proses ini akan memperbarui daftar soal dengan tipe yang dipilih pada paket target agar sama persis dengan yang ada di bank soal saat ini. Soal tipe lain pada paket target tidak akan berubah.
                </p>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowSyncModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white">
                  Mulai Sinkronisasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
