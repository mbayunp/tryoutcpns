import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useExamStore } from '../../store/useExamStore';
import {
  FileText,
  TrendingUp,
  History as HistoryIcon,
  Lock,
  ArrowRight,
  Clock,
  PlusCircle,
  Award,
  X,
  MessageCircle,
  Flame // <-- Ditambahkan untuk Daily Streak
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import HistoryTab from './HistoryTab';
import RankingTab from './RankingTab';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, packages, history, activeTab, setActiveTab, fetchPackages, fetchHistory, createPendingTransaction, transactions } = useExamStore();
  const [selectedLockedPackage, setSelectedLockedPackage] = React.useState(null);
  const [proofFile, setProofFile] = React.useState(null);
  const [proofFilePreview, setProofFilePreview] = React.useState('');
  const [isSubmittingPay, setIsSubmittingPay] = React.useState(false);

  React.useEffect(() => {
    fetchPackages();
    fetchHistory();
  }, [fetchPackages, fetchHistory, activeTab]);

  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const averageScore = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const totalAttempts = history.length;

  const handleStartExam = (pkg) => {
    if (pkg.status === 'Terkunci') {
      setSelectedLockedPackage(pkg);
      return;
    }
    navigate('/exam', { state: { packageId: pkg.id } });
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

  const handleDirectConfirm = async () => {
    if (!proofFilePreview) {
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
      await createPendingTransaction(selectedLockedPackage.id, 'Rp 199.000', proofFilePreview);
      Swal.fire({
        title: 'Bukti Terkirim!',
        text: 'Bukti transfer berhasil disimpan. Admin akan memverifikasi dalam beberapa saat.',
        icon: 'success',
        confirmButtonColor: '#0B1C30'
      });
      setSelectedLockedPackage(null);
      setProofFile(null);
      setProofFilePreview('');
    } catch (err) {
      Swal.fire({
        title: 'Gagal Mengirim',
        text: 'Terjadi kesalahan saat mengirim bukti pembayaran.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // --- FUNGSI KONFIRMASI WHATSAPP ---
  const handleWhatsAppConfirm = () => {
    const adminPhone = "6281297298862"; // <-- GANTI DENGAN NOMOR WA ADMIN
    const message = `Halo Admin WILDAN CASN, saya ingin konfirmasi pembayaran.%0A%0A*Detail Pesanan:*%0ANama: ${user?.name || 'User'}%0AEmail: ${user?.email || 'email'}%0APaket: ${selectedLockedPackage?.title}%0A%0ASaya telah melakukan scan QRIS. Berikut saya lampirkan bukti transfernya:`;

    // Catat di tabel admin bahwa user ini sedang menunggu konfirmasi
    createPendingTransaction(selectedLockedPackage.id, 'Rp 199.000', proofFilePreview || null);

    // Buka tab WhatsApp baru
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');

    // Tutup modal
    setSelectedLockedPackage(null);
    setProofFile(null);
    setProofFilePreview('');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Peserta - WILDAN CASN</title>
      </Helmet>
      <div className="max-w-6xl mx-auto space-y-gutter pb-12 font-body-md text-on-surface animate-fadeIn">

      {/* ═══ DASHBOARD TAB ═══ */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1C30] via-[#102A43] to-[#1E3E66] p-8 md:p-12 text-white mb-gutter shadow-premium transition-all duration-300">
            <div className="relative z-10 max-w-lg space-y-5">
              <span className="bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                Member Premium
              </span>
              <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold tracking-tight">
                Selamat Datang, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="font-body-lg text-sm md:text-base opacity-90 leading-relaxed">
                Anda telah menyelesaikan 85% target belajar minggu ini. Teruslah berjuang untuk impian menjadi ASN bersama WILDAN CASN!
              </p>
              <button
                onClick={() => setActiveTab('tryout')}
                className="bg-white hover:bg-slate-100 text-[#0B1C30] font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-lg border-0 text-sm"
              >
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-1/2 hidden md:block"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
          </section>

          {/* Summary Cards (Bento Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter animate-fadeIn">
            <Card className="p-6 border border-white/40 shadow-premium flex items-start gap-4 hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300 ease-out border-l-4 border-l-[#0B1C30]/80 bg-white/80 backdrop-blur-md">
              <div className="w-12 h-12 bg-[#0B1C30]/10 rounded-xl flex items-center justify-center text-[#0B1C30] flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Tryout Diikuti</p>
                <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                  {totalAttempts} <span className="text-xs font-normal text-slate-400">Paket</span>
                </h3>
              </div>
            </Card>

            <Card className="p-6 border border-white/40 shadow-premium flex items-start gap-4 hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300 ease-out border-l-4 border-l-amber-500 bg-white/80 backdrop-blur-md">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rata-rata Skor</p>
                <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                  {averageScore} <span className="text-xs font-normal text-slate-400">/ 550</span>
                </h3>
              </div>
            </Card>

            <Card className="p-6 border border-white/40 shadow-premium flex items-start gap-4 hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300 ease-out border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-md">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Peringkat Nasional</p>
                <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                  {highestScore >= 311 ? '#1,240' : '#8,495'} <span className="text-xs font-normal text-slate-400">dari 45k</span>
                </h3>
              </div>
            </Card>

            <Card className="p-6 border border-white/40 shadow-premium flex items-start gap-4 hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300 ease-out border-l-4 border-l-orange-500 bg-white/80 backdrop-blur-md">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0 animate-pulse">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Daily Streak</p>
                <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                  3 Hari <span className="text-xs font-normal text-slate-400">Beruntun</span>
                </h3>
              </div>
            </Card>
          </div>

          {/* Two Column Layout (Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Learning Progress Section */}
            <Card className="lg:col-span-2 p-8 border border-slate-200/60 shadow-premium space-y-8 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#0B1C30] tracking-tight">Progres Belajar</h2>
                <div className="text-xs font-bold text-slate-500 px-3.5 py-2 bg-slate-100 rounded-xl">
                  7 Hari Terakhir
                </div>
              </div>

              {/* Chart Recharts */}
              {(() => {
                const chartData = [
                  { name: 'Sen', skor: 320 },
                  { name: 'Sel', skor: 410 },
                  { name: 'Rab', skor: 380 },
                  { name: 'Kam', skor: 490 },
                  { name: 'Jum', skor: 350 },
                  { name: 'Sab', skor: 430 },
                  { name: 'Min', skor: 520 },
                ];

                return (
                  <div className="h-60 w-full animate-fadeIn">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSkorDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 600]}
                          tick={{ fill: '#94A3B8', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0B1C30',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '8px 12px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                          }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="skor"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSkorDashboard)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}

              {/* Progress sliders */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Harian</p>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#0B1C30] h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Akurasi</p>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Latest Tryouts */}
            <Card className="p-6 border border-slate-200/60 shadow-premium flex flex-col justify-between bg-white">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#0B1C30]">Tryout Terbaru</h2>
                  <button onClick={() => setActiveTab('riwayat')} className="text-[#0B1C30] text-xs font-bold hover:underline">
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-4">
                  {history.length > 0 ? (
                    history.slice(0, 3).map((h, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-[#0B1C30] hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#0B1C30] transition-colors truncate max-w-[130px]">{h.title}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{h.date}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Skor</p>
                            <p className="text-sm font-extrabold text-slate-800">{h.score}</p>
                          </div>
                          <div className="w-px h-6 bg-slate-200"></div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                            <p className={`text-xs font-bold ${h.result === 'LULUS' ? 'text-emerald-600' : 'text-red-500'}`}>
                              {h.result === 'LULUS' ? 'Lulus Ambang' : 'Tidak Lulus'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <HistoryIcon className="h-8 w-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">Belum ada riwayat tryout.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('tryout')}
                className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 hover:border-[#0B1C30] hover:text-[#0B1C30] text-slate-400 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs bg-slate-50/50"
              >
                <PlusCircle className="h-4 w-4" />
                Ikuti Tryout Baru
              </button>
            </Card>
          </div>
        </>
      )}

      {/* ═══ TRY OUT LIST TAB ═══ */}
      {activeTab === 'tryout' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const hasPendingTrx = transactions?.some(t => t.package === pkg.title && t.status === 'pending' && t.email === user?.email);
            return (
              <Card key={pkg.id} className={`p-6 flex flex-col justify-between space-y-6 bg-white transition-transform duration-300 transform-gpu hover:-translate-y-2 hover:shadow-2xl border border-slate-200/60 ${pkg.status === 'Terkunci' ? 'opacity-80' : ''}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant={pkg.status === 'Terkunci' ? 'neutral' : 'primary'} className="bg-[#0B1C30]/10 text-[#0B1C30] border-0">
                      SKD CAT
                    </Badge>
                    {pkg.status === 'Terkunci' && (
                      hasPendingTrx ? (
                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                          <Clock className="h-3 w-3 animate-spin" /> Pending
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-[#0B1C30]">{pkg.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Simulasi lengkap TWK, TIU, dan TKP sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-slate-400 font-bold pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#0B1C30]" />{pkg.duration} Min</span>
                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-[#0B1C30]" />{pkg.totalQuestions} Soal</span>
                  </div>

                  <Button
                    variant={pkg.status === 'Terkunci' ? 'outline' : 'primary'}
                    className={`w-full py-3 shadow-sm ${pkg.status === 'Terkunci'
                      ? (hasPendingTrx ? 'bg-amber-50/70 border-amber-200 text-amber-700 cursor-not-allowed shadow-none' : 'border-slate-200 text-slate-500')
                      : 'bg-[#0B1C30] hover:bg-[#102A43] text-white border-0'
                      }`}
                    onClick={() => {
                      if (!hasPendingTrx) handleStartExam(pkg);
                    }}
                    disabled={hasPendingTrx}
                  >
                    {pkg.status === 'Terkunci' ? (
                      hasPendingTrx ? (
                        <span className="flex items-center justify-center gap-1.5"><Clock className="h-4 w-4 animate-pulse" />Menunggu Verifikasi</span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5"><Lock className="h-4 w-4" />Buka Akses</span>
                      )
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">Mulai Ujian<ArrowRight className="h-4 w-4" /></span>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ═══ HISTORY TABLE TAB (Terpisah) ═══ */}
      {activeTab === 'riwayat' && (
        <HistoryTab />
      )}

      {/* ═══ RANKING TABLE TAB (Terpisah) ═══ */}
      {activeTab === 'ranking' && (
        <RankingTab />
      )}

      {/* ═══ PROFILE TAB ═══ */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Avatar Card */}
          <Card className="p-6 border border-slate-200/60 shadow-premium bg-white flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="h-24 w-24 bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] text-white rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-lg overflow-hidden">
                {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                  <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user?.avatar || user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white" title="Active"></span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-800">{user?.name}</h4>
              <Badge className="bg-[#0B1C30]/10 text-[#0B1C30] border-0 text-[10px] font-bold uppercase">
                {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
              </Badge>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status Akun</p>
                <p className="text-sm font-bold text-emerald-600">Aktif</p>
              </div>
              <div className="border-l border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sesi Ujian</p>
                <p className="text-sm font-bold text-slate-800">{totalAttempts}</p>
              </div>
            </div>
          </Card>

          {/* Right Profile Details */}
          <Card className="lg:col-span-2 p-8 border border-slate-200/60 shadow-premium bg-white space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#0B1C30]">Informasi Profil</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola data personal dan keanggotaan Anda di WILDAN CASN.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Nama Lengkap', value: user?.name, desc: 'Nama resmi sesuai kartu identitas' },
                { label: 'Alamat Email', value: user?.email, desc: 'Digunakan untuk login & notifikasi' },
                { label: 'Tipe Keanggotaan', value: user?.role === 'admin' ? 'Administrator System' : 'Premium Tryout Member', desc: 'Hak akses paket simulasi' },
                { label: 'No. Registrasi Akun', value: 'SKD-2026-9012', desc: 'Nomor pendaftaran platform' }
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</label>
                  <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/50 text-sm font-bold text-slate-800">
                    {f.value}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      </div> {/* Close max-w-6xl container */}

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
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
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

              {/* QRIS Box dengan Path yang Benar */}
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

              {/* Harga */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nominal Transfer</p>
                <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  Rp 199.000
                </p>
              </div>

              {/* Upload Proof Area */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Unggah Bukti Transfer</label>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setProofFile(null);
                          setProofFilePreview('');
                        }}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
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

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={handleDirectConfirm}
                  disabled={isSubmittingPay || !proofFilePreview}
                  className="w-full bg-[#0B1C30] hover:bg-[#102A43] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
                >
                  {isSubmittingPay ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                </button>

                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
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