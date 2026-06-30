import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Swal from 'sweetalert2';
import { useExamStore } from '../store/useExamStore';
import { Clock, FileText, ArrowLeft, CheckCircle, Shield, Award, BookOpen } from 'lucide-react';

const formatRupiah = (num) => {
  if (num === undefined || num === null) return 'Rp 0';
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packages, user, fetchPackages, validateReferralCode, createPendingTransaction, downloadPackageEbook } = useExamStore();

  React.useEffect(() => {
    if (packages.length === 0) {
      fetchPackages();
    }
  }, [packages, fetchPackages]);

  const pkg = packages.find(p => p.id === parseInt(id));

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B1C30]"></div>
        <p className="text-sm font-semibold text-slate-500">Memuat detail paket...</p>
      </div>
    );
  }

  const handleBuyNow = async () => {
    if (pkg.status === 'Aktif') {
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
      } else if (pkg.product_type === 'EBOOK') {
        Swal.fire({
          title: 'Mengunduh E-Book...',
          text: 'Harap tunggu sebentar.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        try {
          await downloadPackageEbook(pkg.id, pkg.title);
          Swal.close();
        } catch (err) {
          Swal.fire({
            title: 'Gagal Mengunduh',
            text: err.message || 'Gagal mengunduh file e-book.',
            icon: 'error',
            confirmButtonColor: '#EF4444'
          });
        }
      } else {
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
      }
      return;
    }

    let appliedCode = null;
    let finalPrice = pkg.price || 0;

    const { value: refCode } = await Swal.fire({
      title: 'Punya Kode Referal?',
      input: 'text',
      inputPlaceholder: 'Masukkan Kode Referal (Opsional)',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Lewati',
      confirmButtonColor: '#0B1C30',
      cancelButtonColor: '#6B7280',
      inputAttributes: {
        autocapitalize: 'characters',
        autocorrect: 'off'
      }
    });

    if (refCode && refCode.trim()) {
      try {
        const referral = await validateReferralCode(refCode.trim());
        appliedCode = referral.code;
        // Discount Stacking: extra discount off the already discounted pkg.price
        finalPrice = Math.round(finalPrice - (finalPrice * referral.discount_percentage / 100));

        await Swal.fire({
          title: 'Referal Diterapkan!',
          text: `Diskon tambahan ${referral.discount_percentage}% dari kode "${referral.code}"`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        await Swal.fire({
          title: 'Gagal',
          text: err.message || 'Kode referal tidak valid.',
          icon: 'error',
          confirmButtonColor: '#0B1C30'
        });
        return;
      }
    }

    if (finalPrice === 0) {
      try {
        const formattedAmount = formatRupiah(finalPrice);
        await createPendingTransaction(
          pkg.id,
          formattedAmount,
          'FREE_PROMO',
          appliedCode
        );
        await Swal.fire({
          title: 'Transaksi Berhasil!',
          text: 'Pendaftaran paket gratis Anda berhasil diajukan. Silakan konfirmasi pendaftaran Anda.',
          icon: 'success',
          confirmButtonColor: '#0B1C30'
        });
        navigate('/dashboard/paket');
      } catch (err) {
        Swal.fire({
          title: 'Gagal',
          text: err.message || 'Gagal memproses pendaftaran gratis.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
      return;
    }

    Swal.fire({
      title: 'Metode Pembayaran Transfer',
      html: `
        <div class="text-left space-y-3 font-body-md text-slate-700">
          <p>Silakan lakukan transfer pembayaran untuk membuka akses paket belajar Anda:</p>
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <p class="font-bold text-slate-800 text-sm">BANK BRI</p>
            <p class="font-mono text-lg text-[#0B1C30] font-bold">636101008018506</p>
            <p class="text-xs text-slate-400 font-bold">a.n. Rosyidatul Khusna</p>
            <p class="font-bold text-slate-850 mt-2 text-sm">Jumlah Transfer: <span class="text-[#0B1C30]">${formatRupiah(finalPrice)}</span></p>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">Setelah melakukan transfer, silakan konfirmasi pembayaran ke WhatsApp Admin dengan melampirkan bukti transfer untuk aktivasi instan.</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Konfirmasi via WhatsApp',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#25D366',
      cancelButtonColor: '#6B7280'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formattedAmount = formatRupiah(finalPrice);
          await createPendingTransaction(
            pkg.id,
            formattedAmount,
            null,
            appliedCode
          );

          const referralMsg = appliedCode ? `%0AKode Referal: ${appliedCode}` : '';
          const message = `Halo Admin, saya ingin konfirmasi pembayaran.%0A%0ANama: ${user?.name || 'User'}%0AEmail: ${user?.email || 'email'}%0APaket: ${pkg.title}${referralMsg}%0A%0ASaya telah melakukan transfer sebesar ${formatRupiah(finalPrice)}. Berikut bukti transfernya:`;
          window.open(`https://wa.me/6281297298862?text=${message}`, '_blank');

          navigate('/dashboard/pembayaran');
        } catch (err) {
          Swal.fire({
            title: 'Gagal',
            text: err.message || 'Gagal membuat transaksi. Silakan coba lagi.',
            icon: 'error',
            confirmButtonColor: '#EF4444'
          });
        }
      }
    });
  };

  const benefits = pkg.benefits ? (typeof pkg.benefits === 'string' ? JSON.parse(pkg.benefits) : pkg.benefits) : [
    { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
    { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
    { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
    { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
  ];

  const shieldAward = pkg.shield_award ? (typeof pkg.shield_award === 'string' ? JSON.parse(pkg.shield_award) : pkg.shield_award) : {
    shield: 'Aman & Terpercaya',
    award: 'Jaminan Lulus Ambang Batas'
  };

  return (
    <>
      <SEO title={pkg.title} />
      <div className="max-w-full mx-auto space-y-6 pb-12 font-body-md text-on-surface animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0B1C30] font-bold text-xs bg-transparent border-0 cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </button>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Large Cover */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {pkg.imageUrl ? (
                <img src={pkg.imageUrl} alt={pkg.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] flex items-center justify-center text-white">
                  <BookOpen className="h-16 w-16 opacity-40" />
                </div>
              )}
            </div>

            {/* Title Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <span className="bg-[#0B1C30]/10 text-[#0B1C30] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                {pkg.category}
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#0B1C30] tracking-tight leading-snug">
                {pkg.title}
              </h1>

              {/* Specs */}
              <div className="flex gap-6 text-xs font-bold text-slate-500 pt-4 border-t border-slate-50">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#0B1C30]" /> {pkg.duration} Menit Pengerjaan</span>
                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-[#0B1C30]" /> {pkg.totalQuestions} Soal Ujian</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Deskripsi Paket</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                {pkg.description || 'Simulasi lengkap sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.'}
              </p>
            </div>

            {/* Benefits list */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Materi & Benefit yang Didapat</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{b.title}</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Checkout Card */}
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-lg space-y-6">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Ringkasan Harga</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Harga Normal</span>
                  <div className="flex items-center gap-2">
                    {pkg.discountPercentage > 0 && (
                      <>
                        <span className="bg-[#E6F4EA] text-[#137333] font-bold px-1.5 py-0.5 rounded text-[10px]">
                          {pkg.discountPercentage}%
                        </span>
                        <span className="text-xs text-slate-400 line-through font-medium">
                          {formatRupiah(pkg.originalPrice)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm font-extrabold text-[#0B1C30]">Harga Final</span>
                  <span className="text-[#0B1C30] font-extrabold text-xl">
                    {formatRupiah(pkg.price)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-[#0B1C30] hover:bg-[#1E3E66] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] border-0 cursor-pointer"
              >
                {pkg.status === 'Aktif' ? 'Akses Sekarang' : 'Beli Sekarang'}
              </button>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-450 font-bold">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>{shieldAward.shield || 'Aman & Terpercaya'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-450 font-bold">
                  <Award className="h-4 w-4 text-emerald-500" />
                  <span>{shieldAward.award || 'Jaminan Lulus Ambang Batas'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
