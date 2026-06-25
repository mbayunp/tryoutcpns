import React, { useState, useEffect, Suspense } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { Trash, Edit, Plus, X, FileText, Receipt, UploadCloud, Download, Table, AlertCircle, Check, Layers, Megaphone, Search, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPembayaran = React.lazy(() => import('./AdminPembayaran')); // <-- Lazy-load halaman pembayaran

const formatRupiah = (num) => {
  if (num === undefined || num === null) return 'Rp 0';
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
    fetchPackages,
    assignQuestionsToPackage,
    getQuestionsForPackage,
    categories,
    fetchCategories,
    createCategory,
    deleteCategory: deleteStoreCategory, // Rename to avoid clash with deleteQuestion
    syncCategoryQuestions,
    announcements,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    transactions,
    fetchTransactions
  } = useExamStore();

  // State untuk Tab Navigasi Admin
  const [activeTab, setActiveTab] = useState('soal'); // 'soal', 'pembayaran', 'paket'

  const [showManualForm, setShowManualForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncTargetPackageId, setSyncTargetPackageId] = useState('');
  const [syncTargetCategory, setSyncTargetCategory] = useState('');

  // CRUD state for Packages
  const [isEditingPkg, setIsEditingPkg] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgDuration, setPkgDuration] = useState(100);
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgStatus, setPkgStatus] = useState('Aktif');
  const [pkgCategory, setPkgCategory] = useState('Tryout');
  const [pkgImageUrl, setPkgImageUrl] = useState('');
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(0);
  const [pkgDiscountPercentage, setPkgDiscountPercentage] = useState(0);

  // CRUD state for Announcements / Banners
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerText, setBannerText] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);

  const resetBannerForm = () => {
    setIsEditingBanner(false);
    setEditingBannerId(null);
    setBannerText('');
    setBannerLink('');
    setBannerIsActive(true);
  };

  const handleEditBannerClick = (ann) => {
    setIsEditingBanner(true);
    setEditingBannerId(ann.id);
    setBannerText(ann.text);
    setBannerLink(ann.link || '');
    setBannerIsActive(ann.is_active);
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerText) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap isi teks pengumuman!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const bannerData = {
      text: bannerText,
      link: bannerLink || null,
      is_active: bannerIsActive
    };

    try {
      if (isEditingBanner) {
        await updateAnnouncement(editingBannerId, bannerData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner berhasil diperbarui!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createAnnouncement(bannerData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner baru berhasil ditambahkan!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      resetBannerForm();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal menyimpan pengumuman/banner.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleBannerDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Banner',
      text: 'Apakah Anda yakin ingin menghapus pengumuman/banner ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner berhasil dihapus!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus pengumuman/banner.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  // Modal for many-to-many question assignment
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

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

  const resetPkgForm = () => {
    setIsEditingPkg(false);
    setEditingPkgId(null);
    setPkgTitle('');
    setPkgDescription('');
    setPkgDuration(100);
    setPkgPrice(0);
    setPkgStatus('Aktif');
    setPkgCategory('Tryout');
    setPkgImageUrl('');
    setPkgOriginalPrice(0);
    setPkgDiscountPercentage(0);
  };

  const handleEditPkgClick = (pkg) => {
    setIsEditingPkg(true);
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgDescription(pkg.description);
    setPkgDuration(pkg.duration);
    setPkgPrice(pkg.price || 0);
    setPkgStatus(pkg.status);
    setPkgCategory(pkg.category || 'Tryout');
    setPkgImageUrl(pkg.imageUrl || '');
    setPkgOriginalPrice(pkg.originalPrice || 0);
    setPkgDiscountPercentage(pkg.discountPercentage || 0);
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
    if (!pkgTitle || !pkgDescription || !pkgDuration) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap isi seluruh formulir data paket!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const pkgData = {
      id: editingPkgId,
      title: pkgTitle,
      description: pkgDescription,
      duration: pkgDuration,
      status: pkgStatus,
      category: pkgCategory,
      imageUrl: pkgImageUrl,
      originalPrice: pkgOriginalPrice,
      discountPercentage: pkgDiscountPercentage,
      price: pkgPrice
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

  useEffect(() => {
    fetchQuestions(1);
    fetchPackages();
    fetchAnnouncements();
    fetchTransactions();
    fetchCategories();
  }, [fetchQuestions, fetchPackages, fetchAnnouncements, fetchTransactions, fetchCategories]);

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
      setShowExcelImport(false);
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
    setShowManualForm(false);
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
    setShowManualForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText || !optA || !optB || !optC || !optD || !optE || !explanation) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap isi seluruh formulir data soal!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
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

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const getCategoryBadgeVariant = (catName) => {
    if (!catName) return 'neutral';
    const name = catName.toUpperCase();
    if (name === 'TWK') return 'primary';
    if (name === 'TIU') return 'secondary';
    if (name === 'TKP') return 'warning';
    return 'success';
  };
  const textareaClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const scoreInputClass = "w-14 px-2 py-2.5 bg-slate-50 ring-1 ring-slate-200/60 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  const optionSetters = [
    { key: 'A', val: optA, set: setOptA, score: scoreA, setScore: setScoreA },
    { key: 'B', val: optB, set: setOptB, score: scoreB, setScore: setScoreB },
    { key: 'C', val: optC, set: setOptC, score: scoreC, setScore: setScoreC },
    { key: 'D', val: optD, set: setOptD, score: scoreD, setScore: setScoreD },
    { key: 'E', val: optE, set: setOptE, score: scoreE, setScore: setScoreE }
  ];

  // Hitung ringkasan metrics
  const totalQuestions = questions ? questions.length : 0;
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.name.toUpperCase()] = questions ? questions.filter(q => q.category === cat.name.toUpperCase()).length : 0;
    return acc;
  }, {});

  const totalPackages = packages ? packages.length : 0;
  const pendingVerifications = transactions ? transactions.filter(t => t.status === 'pending').length : 0;
  const activeBanners = announcements ? announcements.filter(a => a.is_active).length : 0;

  // Filter questions berdasarkan query pencarian dan filter kategori
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(q.id).includes(searchQuery);
    const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

          <button
            onClick={() => setActiveTab('banner')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'banner'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            <Megaphone className="h-4 w-4" />
            Kelola Banner
          </button>
        </div>
      </div>

      {/* ─── KONTEN TAB KELOLA SOAL ─── */}
      {activeTab === 'soal' && (
        <div className="space-y-6 animate-fadeIn">
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
          )}

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
              </Card>
            </div>
          </div>

          {/* ─── MODAL INPUT SOAL MANUAL (OVERLAY) ─── */}
          {showManualForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={resetForm}
              />

              <div className="relative z-10 bg-white rounded-3xl border border-slate-200/60 shadow-premium-lg max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isEditing ? 'Edit Soal Ujian' : 'Input Soal Manual Baru'}
                  </h3>
                  <button onClick={resetForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
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
                    <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Batal</Button>
                    <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white">
                      {isEditing ? 'Simpan Perubahan' : 'Tambah Soal'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── KONTEN TAB PEMBAYARAN ─── */}
      {activeTab === 'pembayaran' && (
        <div className="animate-fadeIn">
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPembayaran />
          </Suspense>
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Tryout">Tryout</option>
                    <option value="Kelas Online">Kelas Online</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Bundling">Bundling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Diskon (%)</label>
                  <input
                    type="number"
                    value={pkgDiscountPercentage}
                    onChange={(e) => setPkgDiscountPercentage(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Harga Normal (Rp)</label>
                  <input
                    type="number"
                    value={pkgOriginalPrice}
                    onChange={(e) => setPkgOriginalPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Harga Final (Rp)</label>
                  <input
                    type="number"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    required
                  />
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
                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="Pilih Soal"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Pilih Soal</span>
                          </button>
                          <button
                            onClick={() => handleEditPkgClick(pkg)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200/40 rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handlePkgDelete(pkg.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200/40 rounded-xl transition-colors"
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

      {/* ─── KONTEN TAB KELOLA BANNER ─── */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fadeIn font-sans">
          {/* Form Banner */}
          <Card className="lg:col-span-4 p-5 space-y-5 bg-white border border-slate-200/60 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {isEditingBanner ? 'Edit Banner Pengumuman' : 'Banner Pengumuman Baru'}
              </h3>
              {isEditingBanner && (
                <button onClick={resetBannerForm} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Banner</label>
                <textarea
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="Contoh: Diskon 50% untuk Paket Premium dengan kode promo: MERDEKA50!"
                  rows="3"
                  className={textareaClass}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Link Halaman / URL (Opsional)</label>
                <input
                  type="text"
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  placeholder="Contoh: /pricing atau https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Aktif</label>
                <select
                  value={bannerIsActive ? 'aktif' : 'nonaktif'}
                  onChange={(e) => setBannerIsActive(e.target.value === 'aktif')}
                  className={selectClass}
                >
                  <option value="aktif">Aktif (Tampilkan di Header)</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                  * Mengaktifkan banner ini akan menampilkannya di running text header (Mendukung beberapa banner aktif sekaligus).
                </p>
              </div>

              <div className="flex gap-2.5 pt-1">
                {isEditingBanner && (
                  <Button type="button" variant="outline" className="flex-1" onClick={resetBannerForm}>Batal</Button>
                )}
                <Button type="submit" variant="primary" className="flex-grow">
                  {isEditingBanner ? (
                    <>Simpan Perubahan</>
                  ) : (
                    <><Plus className="h-3.5 w-3.5 mr-1" />Tambah Banner</>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Tabel Banner */}
          <Card className="lg:col-span-8 p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Daftar Banner Pengumuman</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold font-sans">
                  {announcements ? announcements.length : 0} banner terdaftar
                </p>
              </div>
              <Badge variant="primary">Pengumuman</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 w-10 text-center">ID</th>
                    <th className="px-5 py-3">Teks Pengumuman</th>
                    <th className="px-5 py-3">Link Tujuan</th>
                    <th className="px-5 py-3 text-center w-24">Status</th>
                    <th className="px-5 py-3 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-sm">
                  {!announcements || announcements.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-medium">
                        Belum ada pengumuman/banner yang didaftarkan.
                      </td>
                    </tr>
                  ) : (
                    announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-5 py-3 text-center text-[10px] font-bold text-slate-400">{ann.id}</td>
                        <td className="px-5 py-3 font-semibold text-slate-700">
                          <p className="line-clamp-2 leading-relaxed">{ann.text}</p>
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-500">
                          {ann.link ? (
                            <a
                              href={ann.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {ann.link}
                            </a>
                          ) : (
                            <span className="text-slate-300 italic">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={async () => {
                              try {
                                await updateAnnouncement(ann.id, { is_active: !ann.is_active });
                                Swal.fire({
                                  title: 'Berhasil!',
                                  text: 'Status banner berhasil diubah!',
                                  icon: 'success',
                                  timer: 1500,
                                  showConfirmButton: false
                                });
                              } catch (err) {
                                Swal.fire({
                                  title: 'Gagal!',
                                  text: 'Gagal mengubah status banner.',
                                  icon: 'error',
                                  confirmButtonText: 'OK',
                                  confirmButtonColor: '#EF4444'
                                });
                              }
                            }}
                            className="focus:outline-none"
                          >
                            <Badge variant={ann.is_active ? 'success' : 'neutral'}>
                              {ann.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => handleEditBannerClick(ann)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200/40 rounded-xl transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleBannerDelete(ann.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200/40 rounded-xl transition-colors"
                              title="Hapus"
                            >
                              <Trash className="h-3.5 w-3.5" />
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
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of questions with checkbox */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[200px] max-h-[50vh]">
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Simpan Mapping
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL KELOLA TIPE SOAL (CATEGORY MANAGER) ─── */}
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

      {/* ─── MODAL SINKRONISASI KE TRY OUT ─── */}
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