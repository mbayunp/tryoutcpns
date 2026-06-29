import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import Swal from 'sweetalert2';
import { Plus, X, FileText, Edit, Trash } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function AdminPaket() {
  const {
    packages,
    createPackage,
    updatePackage,
    deletePackage,
    fetchPackages,
    questions,
    fetchQuestions,
    assignQuestionsToPackage,
    getQuestionsForPackage,
    adminActiveProgram
  } = useExamStore();

  const [pkgProgramType, setPkgProgramType] = useState('SKD');

  // CRUD state for Packages
  const [isEditingPkg, setIsEditingPkg] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgDuration, setPkgDuration] = useState(100);
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(0);
  const [pkgDiscountPercentage, setPkgDiscountPercentage] = useState(0);
  const [pkgStatus, setPkgStatus] = useState('Aktif');
  const [pkgCategory, setPkgCategory] = useState('Tryout');
  const [pkgImageUrl, setPkgImageUrl] = useState('');
  const [pkgProductType, setPkgProductType] = useState('TRYOUT');
  const [pkgWaGroupLink, setPkgWaGroupLink] = useState('');
  const [pkgEbookFile, setPkgEbookFile] = useState(null);
  const [pkgBenefits, setPkgBenefits] = useState([
    { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
    { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
    { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
    { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
  ]);
  const [pkgShieldText, setPkgShieldText] = useState('Aman & Terpercaya');
  const [pkgAwardText, setPkgAwardText] = useState('Jaminan Lulus Ambang Batas');
  const [pkgScoringType, setPkgScoringType] = useState('BINARY');

  useEffect(() => {
    fetchPackages(adminActiveProgram);
    fetchQuestions(1).catch(err => console.error('fetchQuestions error in AdminPaket:', err));
  }, [adminActiveProgram]);

  useEffect(() => {
    if (!isEditingPkg) {
      setPkgProgramType(adminActiveProgram || '');
    }
  }, [adminActiveProgram, isEditingPkg]);

  useEffect(() => {
    if (pkgProgramType === 'PPPK') {
      setPkgDuration(130);
    }
  }, [pkgProgramType]);

  // Modal for question assignment mapping
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Calculate dynamic price based on Discount stacking
  useEffect(() => {
    const original = parseInt(pkgOriginalPrice) || 0;
    const discount = parseInt(pkgDiscountPercentage) || 0;
    if (original > 0) {
      const finalPrice = Math.round(original - (original * discount) / 100);
      setPkgPrice(finalPrice);
    } else {
      setPkgPrice(0);
    }
  }, [pkgOriginalPrice, pkgDiscountPercentage]);

  const resetPkgForm = () => {
    setIsEditingPkg(false);
    setEditingPkgId(null);
    setPkgTitle('');
    setPkgDescription('');
    setPkgDuration(100);
    setPkgPrice(0);
    setPkgOriginalPrice(0);
    setPkgDiscountPercentage(0);
    setPkgStatus('Aktif');
    setPkgCategory('Tryout');
    setPkgImageUrl('');
    setPkgProgramType(adminActiveProgram || '');
    setPkgProductType('TRYOUT');
    setPkgWaGroupLink('');
    setPkgEbookFile(null);
    setPkgBenefits([
      { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
      { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
      { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
      { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
    ]);
    setPkgShieldText('Aman & Terpercaya');
    setPkgAwardText('Jaminan Lulus Ambang Batas');
    setPkgScoringType('BINARY');
  };

  const handleEditPkgClick = (pkg) => {
    setIsEditingPkg(true);
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgDescription(pkg.description);
    setPkgDuration(pkg.duration);
    setPkgPrice(pkg.price || 0);
    setPkgOriginalPrice(pkg.originalPrice || 0);
    setPkgDiscountPercentage(pkg.discountPercentage || 0);
    setPkgStatus(pkg.status);
    setPkgCategory(pkg.category || 'Tryout');
    setPkgImageUrl(pkg.imageUrl || '');
    setPkgProgramType(pkg.program_type || 'SKD');
    setPkgProductType(pkg.product_type || 'TRYOUT');
    setPkgWaGroupLink(pkg.wa_group_link || '');
    setPkgEbookFile(null);
    
    const parsedBenefits = pkg.benefits ? (typeof pkg.benefits === 'string' ? JSON.parse(pkg.benefits) : pkg.benefits) : [
      { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
      { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
      { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
      { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
    ];
    setPkgBenefits(parsedBenefits);

    const parsedShieldAward = pkg.shield_award ? (typeof pkg.shield_award === 'string' ? JSON.parse(pkg.shield_award) : pkg.shield_award) : {
      shield: 'Aman & Terpercaya',
      award: 'Jaminan Lulus Ambang Batas'
    };
    setPkgShieldText(parsedShieldAward.shield || 'Aman & Terpercaya');
    setPkgAwardText(parsedShieldAward.award || 'Jaminan Lulus Ambang Batas');
    setPkgScoringType(pkg.scoring_type || 'BINARY');
  };

  const handlePkgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPkgImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    if (!pkgTitle || !pkgDescription) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap isi judul dan deskripsi paket!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    if (pkgProductType === 'TRYOUT' && !pkgDuration) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Durasi wajib diisi untuk tipe Tryout!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    if (pkgProductType === 'KELAS' && !pkgWaGroupLink) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Link grup WhatsApp wajib diisi untuk Kelas Online!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    if (pkgProductType === 'EBOOK' && !isEditingPkg && !pkgEbookFile) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap unggah berkas e-book (.pdf) terlebih dahulu!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    const pkgData = {
      id: editingPkgId,
      title: pkgTitle,
      description: pkgDescription,
      duration: pkgProductType === 'TRYOUT' ? parseInt(pkgDuration, 10) : 0,
      status: pkgStatus,
      category: pkgCategory,
      imageUrl: pkgImageUrl,
      originalPrice: parseInt(pkgOriginalPrice, 10) || 0,
      discountPercentage: parseInt(pkgDiscountPercentage, 10) || 0,
      price: parseInt(pkgPrice, 10) || 0,
      program_type: pkgProgramType,
      product_type: pkgProductType,
      wa_group_link: pkgProductType === 'KELAS' ? pkgWaGroupLink : null,
      ebookFile: pkgProductType === 'EBOOK' ? pkgEbookFile : null,
      benefits: pkgBenefits,
      shield_award: {
        shield: pkgShieldText,
        award: pkgAwardText
      },
      scoring_type: pkgScoringType
    };

    try {
      if (isEditingPkg) {
        await updatePackage(pkgData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Paket tryout berhasil diperbarui!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createPackage(pkgData);
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
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal menyimpan paket tryout.',
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

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const textareaClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans animate-fadeIn">
      {/* Header Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manajemen Paket & Kategori</h2>
        <p className="text-sm text-slate-500">Buat, perbarui, dan atur paket tryout beserta harga produk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama / Judul Paket</label>
              <input
                type="text"
                value={pkgTitle}
                onChange={(e) => setPkgTitle(e.target.value)}
                placeholder="Contoh: Tryout Akbar SKD CASN 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Paket</label>
              <textarea
                value={pkgDescription}
                onChange={(e) => setPkgDescription(e.target.value)}
                placeholder="Deskripsi materi ujian, jumlah soal, dan benefit peserta..."
                rows="3"
                className={textareaClass}
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe Produk</label>
                <select
                  value={pkgProductType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPkgProductType(val);
                    if (val === 'TRYOUT') setPkgCategory('Tryout');
                    else if (val === 'KELAS') setPkgCategory('Kelas Online');
                    else if (val === 'EBOOK') setPkgCategory('E-Book');
                    else if (val === 'BUNDLE') setPkgCategory('Bundling');
                  }}
                  className={selectClass}
                >
                  <option value="TRYOUT">Try Out</option>
                  <option value="KELAS">Kelas Online</option>
                  <option value="EBOOK">E-Book</option>
                  <option value="BUNDLE">Bundling</option>
                </select>
              </div>

              {pkgProductType === 'TRYOUT' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              )}

              {pkgProductType === 'KELAS' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Link Grup WhatsApp</label>
                  <input
                    type="url"
                    value={pkgWaGroupLink}
                    onChange={(e) => setPkgWaGroupLink(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              )}

              {pkgProductType === 'EBOOK' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload File E-Book (PDF)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPkgEbookFile(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B1C30] hover:file:bg-slate-200 cursor-pointer"
                  />
                  {pkgEbookFile && (
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Berkas terpilih: {pkgEbookFile.name}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3.5">
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-slate-200/80 pb-1.5">Skema Diskon Produk</p>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Normal (Rp)</label>
                  <input
                    type="number"
                    value={pkgOriginalPrice}
                    onChange={(e) => setPkgOriginalPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-2 rounded-lg bg-white ring-1 ring-slate-200 text-xs font-semibold text-slate-850 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diskon (%)</label>
                  <input
                    type="number"
                    value={pkgDiscountPercentage}
                    onChange={(e) => setPkgDiscountPercentage(e.target.value)}
                    placeholder="0"
                    max="100"
                    className="w-full px-2 py-2 rounded-lg bg-white ring-1 ring-slate-200 text-xs font-semibold text-slate-850 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Final (Rp)</label>
                  <div className="w-full px-2 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-650 truncate select-all">
                    {pkgPrice.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gambar Cover Paket</label>
              <div className="space-y-2">
                {pkgImageUrl && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={pkgImageUrl} alt="Cover Preview" className="w-full h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => setPkgImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-750 text-white rounded-full transition-colors border-0 cursor-pointer shadow-md flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePkgImageChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B1C30] hover:file:bg-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Materi & Benefit yang Didapat */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Materi & Benefit ({pkgBenefits.length})</span>
                <button
                  type="button"
                  onClick={() => setPkgBenefits([...pkgBenefits, { title: '', desc: '' }])}
                  className="px-2.5 py-1 bg-[#0B1C30] hover:bg-[#1E3E66] text-white text-[9px] font-bold rounded-lg transition-colors border-0 cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-3 w-3" /> Tambah Benefit
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {pkgBenefits.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 font-medium">Belum ada benefit. Klik "+ Tambah Benefit" di atas.</p>
                ) : (
                  pkgBenefits.map((b, idx) => (
                    <div key={idx} className="relative p-3.5 bg-white border border-slate-150 rounded-xl shadow-xs hover:shadow-sm transition-all space-y-2">
                      <button
                        type="button"
                        onClick={() => setPkgBenefits(pkgBenefits.filter((_, i) => i !== idx))}
                        className="absolute top-3.5 right-3 text-red-500 hover:text-red-750 bg-transparent border-0 cursor-pointer font-bold text-[10px] uppercase tracking-wider"
                      >
                        Hapus
                      </button>
                      <div className="space-y-2.5 pr-12">
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Judul Benefit</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => {
                              const newB = [...pkgBenefits];
                              newB[idx] = { ...newB[idx], title: e.target.value };
                              setPkgBenefits(newB);
                            }}
                            placeholder="Contoh: Kurikulum SKD Terupdate"
                            className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Deskripsi Singkat</label>
                          <textarea
                            value={b.desc}
                            onChange={(e) => {
                              const newB = [...pkgBenefits];
                              newB[idx] = { ...newB[idx], desc: e.target.value };
                              setPkgBenefits(newB);
                            }}
                            placeholder="Contoh: Materi disusun sesuai kisi-kisi BKN 25."
                            rows="2"
                            className="w-full px-2.5 py-1.5 text-xs text-slate-650 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Shield & Award Text Customization */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-200/80 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kustomisasi Teks Ikon</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Teks Shield (Aman)</label>
                  <input
                    type="text"
                    value={pkgShieldText}
                    onChange={(e) => setPkgShieldText(e.target.value)}
                    placeholder="Aman & Terpercaya"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Teks Award (Lulus)</label>
                  <input
                    type="text"
                    value={pkgAwardText}
                    onChange={(e) => setPkgAwardText(e.target.value)}
                    placeholder="Jaminan Lulus Ambang Batas"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe Penilaian Paket</label>
              <select
                value={pkgScoringType}
                onChange={(e) => setPkgScoringType(e.target.value)}
                className={selectClass}
                required
              >
                <option value="BINARY">Binary/SKD (Benar/Salah)</option>
                <option value="WEIGHTED_1_5">PPPK Teknis (Bobot 1-5)</option>
                <option value="WEIGHTED_1_4">PPPK Lainnya (Bobot 1-4)</option>
              </select>
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
 
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Program</label>
              <select
                value={pkgProgramType}
                onChange={(e) => setPkgProgramType(e.target.value)}
                className={selectClass}
                disabled={!!adminActiveProgram}
                required
              >
                {!adminActiveProgram && <option value="">-- Pilih Program --</option>}
                <option value="SKD">SKD CPNS</option>
                <option value="PPPK">PPPK</option>
                <option value="PPG">PPG</option>
              </select>
              {!!adminActiveProgram && (
                <p className="text-[10px] text-slate-450 mt-1 font-semibold">
                  Terkunci ke program filter aktif.
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              {isEditingPkg && (
                <Button variant="outline" className="flex-1" onClick={resetPkgForm}>Batal</Button>
              )}
              <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white">
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
                    <td className="px-5 py-3 text-center font-bold text-slate-700">{formatRupiah(pkg.price)}</td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={pkg.status === 'Aktif' ? 'success' : 'neutral'}>
                        {pkg.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-center">
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
                          className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handlePkgDelete(pkg.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
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
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
