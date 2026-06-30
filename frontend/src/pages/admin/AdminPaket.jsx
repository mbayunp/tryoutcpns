import React, { useState, useEffect, useMemo } from 'react';
import { useExamStore } from '../../store/useExamStore';
import Swal from 'sweetalert2';
import { Plus, X, FileText, Edit, Trash, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PackageForm from '../../components/admin/PackageForm';

export default function AdminPaket() {
  const {
    packages,
    createPackage,
    updatePackage,
    deletePackage,
    fetchPackages,
    questions,
    assignQuestionsToPackage,
    getQuestionsForPackage,
    transactions,
    fetchTransactions,
    adminActiveProgram
  } = useExamStore();

  const [isEditingPkg, setIsEditingPkg] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [selectedPkgForEdit, setSelectedPkgForEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  // Filter States
  const [filterSort, setFilterSort] = useState('newest'); // 'newest', 'oldest'
  const [filterProgram, setFilterProgram] = useState('ALL'); // 'ALL', 'SKD', 'PPPK', 'PPG'
  const [filterProductType, setFilterProductType] = useState('ALL'); // 'ALL', 'TRYOUT', 'KELAS', 'EBOOK', 'BUNDLE'
  const [filterPopularity, setFilterPopularity] = useState('ALL'); // 'ALL', 'POPULAR'

  // Modal for question assignment mapping
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchPackages(adminActiveProgram);
        await fetchTransactions(adminActiveProgram);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPackages, fetchTransactions, adminActiveProgram]);

  const resetPkgForm = () => {
    setIsEditingPkg(false);
    setEditingPkgId(null);
    setSelectedPkgForEdit(null);
    setShowFormModal(false);
  };

  const handleEditPkgClick = (pkg) => {
    setIsEditingPkg(true);
    setEditingPkgId(pkg.id);
    setSelectedPkgForEdit(pkg);
    setShowFormModal(true);
  };

  const handlePkgSubmit = async (pkgData) => {
    const formattedData = {
      ...pkgData,
      id: editingPkgId
    };

    try {
      if (isEditingPkg) {
        await updatePackage(formattedData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Paket tryout berhasil diperbarui!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createPackage(formattedData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Paket tryout baru berhasil ditambahkan!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      resetPkgForm();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Gagal menyimpan paket tryout.';
      Swal.fire({
        title: 'Gagal!',
        text: errMsg,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handlePkgDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Paket',
      text: 'Apakah Anda yakin ingin menghapus paket tryout ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await deletePackage(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Paket tryout berhasil dihapus!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus paket tryout.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const handleManageQuestionsClick = async (pkg) => {
    setSelectedPkg(pkg);
    try {
      const res = await getQuestionsForPackage(pkg.id);
      const mappedIds = res.map(q => q.id);
      setSelectedQuestionIds(mappedIds);
      setShowQuestionModal(true);
    } catch (err) {
      console.error(err);
      setSelectedQuestionIds([]);
      setShowQuestionModal(true);
    }
  };

  const handleToggleQuestionSelection = (qId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSaveQuestionsAssignment = async () => {
    if (!selectedPkg) return;
    try {
      await assignQuestionsToPackage(selectedPkg.id, selectedQuestionIds);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Mapping soal ke paket berhasil disimpan!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setShowQuestionModal(false);
      setSelectedPkg(null);
      setSelectedQuestionIds([]);
      fetchPackages();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memetakan soal ke paket.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const formatRupiah = (num) => {
    if (num === undefined || num === null) return 'Rp 0';
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getCategoryBadgeVariant = (catName) => {
    if (!catName) return 'neutral';
    const name = catName.toUpperCase();
    if (name === 'TWK') return 'primary';
    if (name === 'TIU') return 'secondary';
    if (name === 'TKP') return 'warning';
    return 'success';
  };

  // In-Memory Filter logic
  const filteredPackages = useMemo(() => {
    let result = [...(packages || [])];

    // Filter by Program Type / Category
    if (filterProgram !== 'ALL') {
      result = result.filter(p => p.program_type === filterProgram);
    } else if (adminActiveProgram) {
      result = result.filter(p => p.program_type === adminActiveProgram);
    }

    // Filter by Product Type
    if (filterProductType !== 'ALL') {
      result = result.filter(p => p.product_type === filterProductType);
    }

    // Calculate transaction counts for popularity
    const trxCounts = (transactions || []).reduce((acc, t) => {
      if (t && t.tryout_id) {
        acc[t.tryout_id] = (acc[t.tryout_id] || 0) + 1;
      }
      return acc;
    }, {});

    // Popularity filter/sorting
    if (filterPopularity === 'POPULAR') {
      result.sort((a, b) => (trxCounts[b.id] || 0) - (trxCounts[a.id] || 0));
    } else {
      // Sort: Terbaru/Terlama
      if (filterSort === 'newest') {
        result.sort((a, b) => b.id - a.id);
      } else {
        result.sort((a, b) => a.id - b.id);
      }
    }

    return result;
  }, [packages, filterProgram, adminActiveProgram, filterProductType, filterPopularity, filterSort, transactions]);

  return (
    <div className="max-w-full mx-auto space-y-6 pb-12 font-sans animate-fadeIn">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manajemen Paket & Kategori</h2>
          <p className="text-sm text-slate-500">Buat, perbarui, dan atur paket tryout beserta harga produk secara dinamis.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetPkgForm();
            setShowFormModal(true);
          }}
          className="bg-[#0B1C30] hover:bg-[#102A43] text-white flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md border-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Paket Baru</span>
        </Button>
      </div>

      {/* Filter Bar Card */}
      <Card className="p-4 bg-white border border-slate-200/60 shadow-premium flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filter & Pengurutan</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full sm:w-auto sm:flex-grow max-w-4xl">
          <div>
            <select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Terbaru (Paling Baru)</option>
              <option value="oldest">Terlama (Paling Lama)</option>
            </select>
          </div>

          <div>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!!adminActiveProgram}
            >
              <option value="ALL">Semua Program</option>
              <option value="SKD">SKD CPNS</option>
              <option value="PPPK">PPPK</option>
              <option value="PPG">PPG</option>
            </select>
          </div>

          <div>
            <select
              value={filterProductType}
              onChange={(e) => setFilterProductType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tipe Produk</option>
              <option value="TRYOUT">Try Out</option>
              <option value="KELAS">Kelas Online</option>
              <option value="EBOOK">E-Book</option>
              <option value="BUNDLE">Bundling</option>
            </select>
          </div>

          <div>
            <select
              value={filterPopularity}
              onChange={(e) => setFilterPopularity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Urutan Normal</option>
              <option value="POPULAR">Terpopuler (Paling Laku)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabel Paket Tryout - Full Width Overhaul */}
      <Card className="w-full p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Daftar Paket / Produk</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Menampilkan {filteredPackages.length} paket terdaftar</p>
          </div>
          {adminActiveProgram && (
            <Badge variant="primary" className="font-bold border-0 px-3 py-1 text-xs">
              {adminActiveProgram}
            </Badge>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/50 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider border-b border-slate-200/60">
                <th className="px-6 py-4 w-12 text-center">#</th>
                <th className="px-6 py-4">Nama / Detail Paket</th>
                <th className="px-6 py-4 text-center w-24">Tipe Produk</th>
                <th className="px-6 py-4 text-center w-24">Program</th>
                <th className="px-6 py-4 text-center w-24">Durasi</th>
                <th className="px-6 py-4 text-center w-32">Harga Final</th>
                <th className="px-6 py-4 text-center w-28">Status</th>
                <th className="px-6 py-4 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-xs font-bold text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                      <span>Memuat data paket...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-xs font-bold text-slate-400">
                    Belum ada paket yang cocok atau terdaftar.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-400 bg-slate-50/30">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm hover:text-blue-600 transition-colors cursor-default">{pkg.title}</span>
                        <p className="line-clamp-2 text-xs font-medium text-slate-400 mt-1 max-w-xl leading-relaxed">{pkg.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={pkg.product_type === 'TRYOUT' ? 'primary' : pkg.product_type === 'KELAS' ? 'warning' : 'success'} className="font-bold border-0">
                        {pkg.product_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-650 text-xs">
                      {pkg.program_type}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700 text-xs">
                      {pkg.product_type === 'TRYOUT' ? `${pkg.duration} Min` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 text-sm">
                      {formatRupiah(pkg.price)}
                      {pkg.discountPercentage > 0 && (
                        <div className="text-[10px] text-red-500 font-bold line-through mt-0.5">{formatRupiah(pkg.originalPrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={pkg.status === 'Aktif' ? 'success' : 'neutral'} className="font-bold border-0">
                        {pkg.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => handleManageQuestionsClick(pkg)}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Pilih Soal"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Pilih Soal</span>
                        </button>
                        <button
                          onClick={() => handleEditPkgClick(pkg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePkgDelete(pkg.id)}
                          className="p-2 text-red-500 hover:bg-red-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── DYNAMIC FORM MODAL (ADD & EDIT PACKAGE) ─── */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={resetPkgForm}
          />

          <div className="relative z-10 bg-white rounded-3xl border border-slate-200/80 shadow-premium-lg max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {isEditingPkg ? 'Edit Detail Paket / Produk' : 'Buat Paket / Produk Baru'}
              </h3>
              <button
                onClick={resetPkgForm}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-655 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <PackageForm
              initialData={selectedPkgForEdit}
              isEditing={isEditingPkg}
              onSubmit={handlePkgSubmit}
              onCancel={resetPkgForm}
              adminActiveProgram={adminActiveProgram}
            />
          </div>
        </div>
      )}

      {/* ─── MODAL PILIH SOAL (MANY-TO-MANY MAPPING) ─── */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => { setShowQuestionModal(false); setSelectedPkg(null); }}
          />

          <div className="relative z-10 bg-white rounded-3xl border border-slate-200/80 shadow-premium-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scaleUp flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pilih Soal untuk Paket</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Paket: <span className="text-blue-600 font-bold">{selectedPkg?.title}</span>
                </p>
              </div>
              <button
                onClick={() => { setShowQuestionModal(false); setSelectedPkg(null); }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-655 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of questions with checkbox */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-3 min-h-[200px] max-h-[50vh]">
              {questions.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-12">Belum ada soal terdaftar di Bank Soal.</p>
              ) : (
                questions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleToggleQuestionSelection(q.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${isChecked
                        ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }} // Click handled by parent div
                        className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                      />
                      <div className="flex-grow space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">ID: {q.id}</span>
                          <Badge variant={getCategoryBadgeVariant(q.category)}>
                            {q.category}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400 font-bold">
                {selectedQuestionIds.length} soal terpilih
              </span>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setShowQuestionModal(false); setSelectedPkg(null); }}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveQuestionsAssignment}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 cursor-pointer"
                >
                  Simpan Mapping
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
