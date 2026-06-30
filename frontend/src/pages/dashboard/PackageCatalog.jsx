import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Swal from 'sweetalert2';
import {
  FileText,
  Clock,
  ArrowRight,
  X,
  MessageCircle,
  Package,
  Search,
  Download
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';

const formatRupiah = (num) => {
  if (num === undefined || num === null) return 'Rp 0';
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function PackageCatalog({ showOnlyPurchased = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('cat'); // e.g. "Tryout", "Kelas Online", "E-Book", "Bundling"

  const {
    user,
    packages,
    fetchPackages,
    createPendingTransaction,
    transactions,
    searchQuery,
    setSearchQuery,
    validateReferralCode,
    activeProgram,
    downloadPackageEbook
  } = useExamStore();

  const [selectedLockedPackage, setSelectedLockedPackage] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofFilePreview, setProofFilePreview] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [appliedReferral, setAppliedReferral] = useState(null);
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);
  const [referralError, setReferralError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const basePrice = selectedLockedPackage?.price || 0;
  const finalPrice = appliedReferral
    ? Math.round(basePrice - (basePrice * appliedReferral.percentage / 100))
    : basePrice;

  const handleDownloadEbook = async (pkgId, title) => {
    setDownloadingId(pkgId);
    try {
      await downloadPackageEbook(pkgId, title);
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengunduh',
        text: err.message || 'Gagal mengunduh file e-book.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    fetchPackages(activeProgram);
  }, [fetchPackages, activeProgram]);

  const handleStartExam = (pkg) => {
    if (pkg.status === 'Terkunci') {
      setSelectedLockedPackage(pkg);
      return;
    }

    if (pkg.product_type === 'KELAS' || (pkg.wa_group_link && (!pkg.totalQuestions || pkg.totalQuestions === 0))) {
      if (pkg.wa_group_link) {
        window.open(pkg.wa_group_link, '_blank', 'noopener,noreferrer');
      } else {
        Swal.fire({
          title: 'Info',
          text: 'Link akses belum tersedia. Silakan hubungi admin.',
          icon: 'info',
          confirmButtonColor: '#0B1C30'
        });
      }
      return;
    }

    if (pkg.product_type === 'EBOOK') {
      handleDownloadEbook(pkg.id, pkg.title);
      return;
    }
    
    Swal.fire({
      title: 'Mulai Ujian?',
      text: 'Apakah Anda yakin ingin memulai ujian sekarang? Waktu akan mulai berjalan.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mulai Ujian',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#0B1C30',
      cancelButtonColor: '#6B7280',
      customClass: {
        popup: 'rounded-2xl font-body-md'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/exam', { state: { packageId: pkg.id } });
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Berkas Terlalu Besar',
          text: 'Ukuran berkas maksimal adalah 2MB!',
          icon: 'warning',
          confirmButtonText: 'Mengerti',
          confirmButtonColor: '#0B1C30'
        });
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyReferral = async () => {
    if (!referralInput.trim()) return;
    setIsApplyingReferral(true);
    setReferralError('');
    try {
      const referral = await validateReferralCode(referralInput.trim());
      setAppliedReferral({
        code: referral.code,
        percentage: referral.discount_percentage
      });
      Swal.fire({
        title: 'Referal Berhasil!',
        text: `Kode "${referral.code}" berhasil diterapkan. Diskon tambahan ${referral.discount_percentage}%!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setReferralError(err.message || 'Kode referal tidak valid.');
    } finally {
      setIsApplyingReferral(false);
    }
  };

  const handleDirectConfirm = async () => {
    if (finalPrice > 0 && !proofFilePreview) {
      Swal.fire({
        title: 'Bukti Pembayaran Wajib',
        text: 'Harap unggah bukti transfer QRIS terlebih dahulu!',
        icon: 'warning',
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    setIsSubmittingPay(true);
    try {
      const formattedAmount = formatRupiah(finalPrice);

      await createPendingTransaction(
        selectedLockedPackage.id,
        formattedAmount,
        proofFilePreview || 'FREE_PROMO',
        appliedReferral?.code || null
      );

      Swal.fire({
        title: 'Bukti Terkirim!',
        text: 'Bukti transfer berhasil disimpan. Admin akan memverifikasi dalam beberapa saat.',
        icon: 'success',
        confirmButtonColor: '#0B1C30'
      });
      setSelectedLockedPackage(null);
      setProofFile(null);
      setProofFilePreview('');
      setReferralInput('');
      setAppliedReferral(null);
      setReferralError('');
      navigate('/dashboard/pembayaran');
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengirim',
        text: err.message || 'Terjadi kesalahan saat mengirim bukti pembayaran.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const handleWhatsAppConfirm = async () => {
    const adminPhone = "6281297298862";
    const formattedAmount = formatRupiah(finalPrice);

    const referralText = appliedReferral
      ? `%0AKode Referal: ${appliedReferral.code} (Diskon ${appliedReferral.percentage}%)`
      : '';
    const message = `Halo Admin WILDAN CASN, saya ingin konfirmasi pembayaran.%0A%0A*Detail Pesanan:*%0ANama: ${user?.name || 'User'}%0AEmail: ${user?.email || 'email'}%0APaket: ${selectedLockedPackage?.title}${referralText}%0ANominal: ${formattedAmount}%0A%0ASaya telah melakukan scan QRIS. Berikut saya lampirkan bukti transfernya:`;

    setIsSubmittingPay(true);
    try {
      await createPendingTransaction(
        selectedLockedPackage.id,
        formattedAmount,
        proofFilePreview || (finalPrice === 0 ? 'FREE_PROMO' : null),
        appliedReferral?.code || null
      );

      if (finalPrice > 0) {
        window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
      }

      setSelectedLockedPackage(null);
      setProofFile(null);
      setProofFilePreview('');
      setReferralInput('');
      setAppliedReferral(null);
      setReferralError('');
      navigate('/dashboard/pembayaran');
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengirim',
        text: err.message || 'Terjadi kesalahan saat memproses transaksi.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    // Search query filter
    const matchesSearch = searchQuery
      ? pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch) return false;

    // "Paket Saya" tab - show only purchased packages
    if (showOnlyPurchased) {
      return pkg.isPurchased;
    }

    // Category filtering
    if (categoryFilter) {
      return pkg.category === categoryFilter;
    }

    return true;
  });

  const categories = [
    { key: 'Tryout', title: 'Paket Tryout' },
    { key: 'Kelas Online', title: 'Kelas Online Bimbingan' },
    { key: 'E-Book', title: 'E-Book & Modul Belajar' },
    { key: 'Bundling', title: 'Paket Bundling Hemat' }
  ];

  const categorizedData = categories.map(cat => {
    const items = filteredPackages.filter(pkg => pkg.category === cat.key);
    return { ...cat, items };
  }).filter(group => group.items.length > 0);

  const renderPackagesGrid = (packagesList) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {packagesList.map((pkg) => {
        const hasPendingTrx = transactions?.some(t => t.package === pkg.title && t.status === 'pending' && t.email === user?.email);

        return (
          <div key={pkg.id} className={`bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${pkg.status === 'Terkunci' ? 'opacity-95' : ''}`}>
            {/* Package Cover Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 flex-shrink-0">
              {pkg.imageUrl ? (
                <img src={pkg.imageUrl} alt={pkg.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] flex items-center justify-center text-white">
                  <Package className="h-10 w-10 opacity-45" />
                </div>
              )}
              {pkg.status === 'Terkunci' && hasPendingTrx && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5 animate-spin" /> Pending Verification
                </div>
              )}
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="font-extrabold text-[15px] text-slate-800 tracking-tight leading-snug group-hover:text-[#0B1C30] transition-colors line-clamp-2">
                  {pkg.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                  {pkg.description || 'Simulasi lengkap sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.'}
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {/* Duration and Questions Count */}
                {pkg.product_type === 'TRYOUT' ? (
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-50">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" />{pkg.duration} Min</span>
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-slate-400" />{pkg.totalQuestions} Soal</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-50">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider">
                      {pkg.product_type === 'KELAS' ? 'Kelas Online' : 'E-Book PDF'}
                    </span>
                  </div>
                )}

                {/* Price Section */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {pkg.discountPercentage > 0 && (
                      <>
                        <span className="bg-[#E6F4EA] text-[#137333] font-bold px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                          {pkg.discountPercentage}%
                        </span>
                        <span className="text-[11px] text-slate-400 line-through truncate font-medium">
                          {formatRupiah(pkg.originalPrice)}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[#0B1C30] font-extrabold text-base whitespace-nowrap">
                    {formatRupiah(pkg.price)}
                  </span>
                </div>

                {/* CTA Button */}
                {showOnlyPurchased ? (
                  hasPendingTrx && pkg.status === 'Terkunci' ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-full font-bold text-xs bg-amber-100 text-amber-700 transition-all flex items-center justify-center gap-1 border-0 cursor-not-allowed shadow-none"
                    >
                      <Clock className="h-3.5 w-3.5 animate-pulse" />Verifikasi...
                    </button>
                  ) : pkg.product_type === 'KELAS' ? (
                    <button
                      onClick={() => {
                        if (pkg.wa_group_link) {
                          window.open(pkg.wa_group_link, '_blank');
                        } else {
                          Swal.fire('Info', 'Link WhatsApp grup belum tersedia, silakan hubungi admin.', 'info');
                        }
                      }}
                      className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1 border-0 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" /> Gabung Grup WA
                    </button>
                  ) : pkg.product_type === 'EBOOK' ? (
                    <button
                      onClick={() => handleDownloadEbook(pkg.id, pkg.title)}
                      disabled={downloadingId === pkg.id}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1 border-0 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> {downloadingId === pkg.id ? 'Mengunduh...' : 'Download E-Book'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartExam(pkg)}
                      className="w-full py-2.5 bg-[#0B1C30] hover:bg-[#1E3E66] text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1 border-0 cursor-pointer"
                    >
                      Kerjakan Try Out <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => navigate(`/paket/${pkg.id}`)}
                    className="w-full py-2.5 bg-[#0B1C30] hover:bg-[#1E3E66] active:scale-[0.98] text-white rounded-full font-bold text-xs shadow-md shadow-slate-900/10 hover:shadow-lg transition-all flex items-center justify-center gap-1 border-0 cursor-pointer"
                  >
                    Selengkapnya
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <SEO title={showOnlyPurchased ? 'Paket Saya' : 'Katalog Paket'} />
      <div className="max-w-full mx-auto space-y-6 pb-12 animate-fadeIn font-body-md text-on-surface">
        {/* Search Bar Input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari paket belajar..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/20 focus:border-[#0B1C30] transition-all shadow-sm"
          />
        </div>

        {filteredPackages.length > 0 ? (
          // If no search filter and showing all categories, group by categories
          !showOnlyPurchased && !categoryFilter ? (
            <div className="space-y-10">
              {categorizedData.map((group) => (
                <div key={group.key} className="space-y-4">
                  <div className="border-b border-slate-200/60 pb-2 mt-8 mb-4">
                    <h3 className="text-lg md:text-xl font-extrabold text-[#0B1C30] tracking-tight">
                      {group.title}
                    </h3>
                  </div>
                  {renderPackagesGrid(group.items)}
                </div>
              ))}
            </div>
          ) : (
            renderPackagesGrid(filteredPackages)
          )
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-premium">
            <FileText className="h-10 w-10 mx-auto text-slate-350 mb-3" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada paket belajar</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? `Tidak ada paket yang cocok dengan pencarian "${searchQuery}"` : 'Kategori ini belum memiliki paket belajar.'}
            </p>
          </div>
        )}
      </div>

      {/* ─── MODAL PEMBAYARAN QRIS ─── */}
      {selectedLockedPackage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fadeIn">
          {/* Overlay background blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedLockedPackage(null);
              setProofFile(null);
              setProofFilePreview('');
              setReferralInput('');
              setAppliedReferral(null);
              setReferralError('');
            }}
          ></div>

          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleUp">
            {/* Header Modal */}
            <div className="bg-slate-900 p-6 text-center text-white relative">
              <button
                onClick={() => {
                  setSelectedLockedPackage(null);
                  setProofFile(null);
                  setProofFilePreview('');
                  setReferralInput('');
                  setAppliedReferral(null);
                  setReferralError('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold tracking-tight mb-1">Checkout Premium</h3>
              <p className="text-xs text-slate-400 font-medium">Buka akses untuk paket tryout</p>
            </div>

            <div className="p-6 sm:p-8 space-y-5 text-center">
              {/* Detail Paket */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paket Pilihan</p>
                <p className="text-sm font-bold text-slate-800">{selectedLockedPackage.title}</p>
              </div>

              {/* QRIS Box */}
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 w-fit mx-auto relative group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Scan QRIS untuk Membayar</p>
                <img
                  src="/image/qris.jpeg"
                  alt="QRIS WILDAN CASN"
                  className="w-44 h-44 object-contain rounded-xl shadow-sm bg-white p-2 mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";
                  }}
                />
              </div>

              {/* Referral Input Box */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Kode Referal (Opsional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan Kode Referal"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    disabled={isApplyingReferral || appliedReferral}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyReferral}
                    disabled={isApplyingReferral || !referralInput.trim() || appliedReferral}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer border-0"
                  >
                    {isApplyingReferral ? 'Applying...' : appliedReferral ? 'Terpasang' : 'Gunakan'}
                  </button>
                </div>
                {referralError && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">{referralError}</p>
                )}
                {appliedReferral && (
                  <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    <span>Kode "{appliedReferral.code}" aktif</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedReferral(null);
                        setReferralInput('');
                      }}
                      className="text-red-500 hover:text-red-700 font-bold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              {/* Harga */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nominal Transfer</p>
                {appliedReferral ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-semibold text-slate-450 line-through">
                      {formatRupiah(selectedLockedPackage.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                        {formatRupiah(Math.round((selectedLockedPackage.price || 0) - ((selectedLockedPackage.price || 0) * appliedReferral.percentage / 100)))}
                      </p>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                        + Diskon Referal {appliedReferral.percentage}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                    {formatRupiah(selectedLockedPackage.price)}
                  </p>
                )}
              </div>

              {/* Upload Proof Area */}
              {finalPrice > 0 ? (
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Unggah Bukti Transfer</label>
                  <div
                    className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer relative group min-h-[90px]"
                    onClick={() => document.getElementById('proof-upload-input').click()}
                  >
                    <input
                      id="proof-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {proofFilePreview ? (
                      <div className="flex items-center gap-3 w-full">
                        <img src={proofFilePreview} alt="Bukti Transfer" className="h-14 w-14 object-cover rounded-lg border border-slate-200" />
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{proofFile?.name}</p>
                          <p className="text-[10px] text-slate-450 font-semibold">{(proofFile?.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProofFile(null);
                            setProofFilePreview('');
                          }}
                          className="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <span className="text-xs font-bold text-slate-700">Pilih Berkas Bukti Transfer</span>
                        <p className="text-[10px] text-slate-405 font-semibold">Maksimal 2MB (.png, .jpg, .jpeg)</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold animate-pulse">
                  <span>🎉 Diskon 100% Referal Diterapkan! Pembelian Gratis.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={handleDirectConfirm}
                  disabled={isSubmittingPay || (finalPrice > 0 && !proofFilePreview)}
                  className="w-full bg-[#0B1C30] hover:bg-[#102A43] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] border-0 cursor-pointer"
                >
                  {isSubmittingPay ? 'Mengirim...' : finalPrice === 0 ? 'Konfirmasi Pembelian Gratis' : 'Kirim Bukti Pembayaran'}
                </button>

                <button
                  onClick={handleWhatsAppConfirm}
                  disabled={isSubmittingPay}
                  className="w-full bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-[0.98] border-0 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  Hubungi Admin WA (Backup)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
