import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useExamStore } from '../../store/useExamStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import { CreditCard, CheckCircle, Upload, X, HelpCircle, ArrowLeft } from 'lucide-react';

export default function Pembayaran() {
  const navigate = useNavigate();
  const { transactions, fetchTransactions, uploadTransactionProof } = useExamStore();
  const [loading, setLoading] = useState(false);

  // Local state for uploading proof
  const [submittingId, setSubmittingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [activeTrxId, setActiveTrxId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTransactions().finally(() => setLoading(false));
  }, [fetchTransactions]);

  const pendingTransactions = (transactions || []).filter(t => t.status === 'pending');

  const handleFileChange = (e, trxId) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Berkas Terlalu Besar',
          text: 'Ukuran berkas maksimal adalah 2MB!',
          icon: 'warning',
          confirmButtonColor: '#0B1C30'
        });
        return;
      }
      setSelectedFile(file);
      setActiveTrxId(trxId);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProof = async (trxId) => {
    if (!filePreview) {
      Swal.fire({
        title: 'Bukti Transfer Wajib',
        text: 'Silakan pilih gambar bukti transfer terlebih dahulu!',
        icon: 'warning',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    setSubmittingId(trxId);
    try {
      await uploadTransactionProof(trxId, filePreview);
      Swal.fire({
        title: 'Bukti Terkirim!',
        text: 'Bukti pembayaran Anda berhasil diunggah. Admin akan memverifikasi secepatnya.',
        icon: 'success',
        confirmButtonColor: '#0B1C30'
      });
      // Clear state
      setSelectedFile(null);
      setFilePreview('');
      setActiveTrxId(null);
      await fetchTransactions();
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengunggah',
        text: err.message || 'Terjadi kesalahan saat mengunggah bukti.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setSubmittingId(null);
    }
  };

  const handleFreeConfirm = async (trxId) => {
    const confirm = await Swal.fire({
      title: 'Konfirmasi Pembelian Gratis',
      text: 'Ajukan aktivasi instan untuk pembelian promo diskon 100% ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280'
    });

    if (confirm.isConfirmed) {
      setSubmittingId(trxId);
      try {
        await uploadTransactionProof(trxId, 'FREE_PROMO');
        Swal.fire({
          title: 'Berhasil Diajukan!',
          text: 'Permintaan aktivasi gratis Anda berhasil dikirim ke Admin.',
          icon: 'success',
          confirmButtonColor: '#10B981'
        });
        await fetchTransactions();
      } catch (err) {
        Swal.fire({
          title: 'Gagal',
          text: err.message || 'Gagal mengirim konfirmasi.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      } finally {
        setSubmittingId(null);
      }
    }
  };

  const isFreeTrx = (trx) => {
    return trx.amount === 'Rp 0' || trx.amount === 'Rp. 0' || trx.amount === 'Rp 0.00' || trx.amount === 'Rp. 0,00';
  };

  return (
    <>
      <SEO title="Konfirmasi Pembayaran" />
      <div className="max-w-full mx-auto space-y-6 pb-12 font-body-md text-on-surface animate-fadeIn">
        {/* Header & Back Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/dashboard/paket')}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0B1C30] font-bold text-xs bg-transparent border-0 cursor-pointer transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
            </button>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Konfirmasi Pembayaran
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Unggah bukti transfer Anda untuk aktivasi akses paket belajar
            </p>
          </div>
        </div>

        {/* Info Rekening */}
        <Card className="p-6 border border-slate-200/60 shadow-premium bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#0B1C30] font-extrabold text-sm">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Informasi Rekening Pembayaran</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
              Silakan lakukan transfer sesuai nominal tagihan transaksi Anda ke rekening resmi kami berikut:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 space-y-1.5 w-fit">
              <p className="font-bold text-slate-800 text-xs tracking-wide">BANK BRI</p>
              <p className="font-mono text-base text-[#0B1C30] font-black tracking-wider">636101008018506</p>
              <p className="text-[10px] text-slate-400 font-bold">a.n. Rosyidatul Khusna</p>
            </div>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4.5 text-xs text-blue-700 font-semibold leading-relaxed max-w-xs space-y-1.5">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="font-bold text-blue-900">Butuh Bantuan?</span>
            </div>
            <p className="text-slate-600 font-medium">
              Jika transfer berhasil tetapi status verifikasi tertunda lama, silakan hubungi tim CS kami via WhatsApp di link pojok kanan bawah.
            </p>
          </div>
        </Card>

        {/* LIST TRANSAKSI PENDING */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Tagihan Pembelian Anda ({pendingTransactions.length})
          </h3>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1C30] mx-auto mb-3"></div>
              <p className="text-xs font-bold text-slate-405">Memuat data transaksi...</p>
            </div>
          ) : pendingTransactions.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto text-slate-350">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Tidak Ada Tagihan Aktif</h4>
              <p className="text-xs text-slate-455 max-w-xs mx-auto font-medium">
                Semua pembelian paket Anda telah sukses diaktifkan atau Anda belum membuat pesanan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTransactions.map((trx) => {
                const isFree = isFreeTrx(trx);
                const hasSelectedProofForThisTrx = activeTrxId === trx.id && filePreview;

                return (
                  <Card key={trx.id} className="p-6 border border-slate-200/60 shadow-premium bg-white space-y-5 animate-scaleUp">
                    {/* Header Item */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
                      <div>
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {trx.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-800 tracking-tight mt-1">
                          {trx.package}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Dipesan pada {trx.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-500 mr-1">Tagihan:</span>
                        <span className="text-sm font-black text-emerald-600">{trx.amount}</span>
                        {isFree && (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">
                            Promo 100%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pembayaran Area */}
                    {isFree ? (
                      /* Free purchase layout */
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex gap-3 items-start text-left">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs font-bold text-emerald-800">Paket Ini Sepenuhnya Gratis</h5>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 leading-relaxed">
                              Kode diskon 100% telah terpasang. Tidak memerlukan pengunggahan bukti transfer Mandiri.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => handleFreeConfirm(trx.id)}
                          disabled={submittingId === trx.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-xl border-0 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        >
                          {submittingId === trx.id ? 'Memproses...' : 'Konfirmasi Pembelian Gratis'}
                        </Button>
                      </div>
                    ) : (
                      /* Normal transfer upload layout */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 items-end">
                          {/* File input */}
                          <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Unggah Bukti Transfer</label>
                            <div
                              className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer relative group min-h-[90px]"
                              onClick={() => document.getElementById(`upload-${trx.id}`).click()}
                            >
                              <input
                                id={`upload-${trx.id}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, trx.id)}
                              />
                              {hasSelectedProofForThisTrx ? (
                                <div className="flex items-center gap-3 w-full">
                                  <img src={filePreview} alt="Bukti Transfer" className="h-14 w-14 object-cover rounded-lg border border-slate-200" />
                                  <div className="overflow-hidden flex-1">
                                    <p className="text-xs font-bold text-slate-800 truncate">{selectedFile?.name}</p>
                                    <p className="text-[10px] text-slate-450 font-semibold">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedFile(null);
                                      setFilePreview('');
                                      setActiveTrxId(null);
                                    }}
                                    className="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors border-0 bg-transparent cursor-pointer"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center space-y-1">
                                  <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                                  <span className="text-xs font-bold text-slate-700">Pilih Berkas Bukti Transfer</span>
                                  <p className="text-[10px] text-slate-405 font-semibold">Maksimal 2MB (.png, .jpg, .jpeg)</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Submit Action */}
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="primary"
                              onClick={() => handleUploadProof(trx.id)}
                              disabled={submittingId === trx.id || !hasSelectedProofForThisTrx}
                              className="w-full bg-[#0B1C30] hover:bg-[#102A43] text-white font-bold text-xs py-3 rounded-xl border-0 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              {submittingId === trx.id ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                            </Button>
                            <p className="text-[10px] text-slate-400 font-semibold leading-normal text-center">
                              *Verifikasi manual memakan waktu maksimal 5-15 menit.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
