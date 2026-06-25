import React, { useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Package, 
  Megaphone, 
  Clock, 
  ArrowRight, 
  FileText, 
  Layers, 
  Receipt, 
  TrendingUp, 
  Ticket 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function DashboardAdmin() {
  const {
    questions,
    fetchQuestions,
    packages,
    fetchPackages,
    announcements,
    fetchAnnouncements,
    transactions,
    fetchTransactions,
    categories,
    fetchCategories
  } = useExamStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions(1);
    fetchPackages();
    fetchAnnouncements();
    fetchTransactions();
    fetchCategories();
  }, [fetchQuestions, fetchPackages, fetchAnnouncements, fetchTransactions, fetchCategories]);

  // Calculations
  const totalQuestions = questions ? questions.length : 0;
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.name.toUpperCase()] = questions ? questions.filter(q => q.category === cat.name.toUpperCase()).length : 0;
    return acc;
  }, {});

  const totalPackages = packages ? packages.length : 0;
  const activePackages = packages ? packages.filter(p => p.status === 'Aktif').length : 0;
  const lockedPackages = totalPackages - activePackages;

  const pendingVerifications = transactions ? transactions.filter(t => t.status === 'pending').length : 0;
  const activeBanners = announcements ? announcements.filter(a => a.is_active).length : 0;

  // Latest 5 transactions
  const sortedTransactions = [...(transactions || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getStatusBadgeVariant = (status) => {
    if (status === 'success') return 'success';
    if (status === 'pending') return 'warning';
    return 'neutral';
  };

  // Quick Action List
  const quickActions = [
    {
      title: 'Kelola Bank Soal',
      description: 'Tambah, edit, dan hapus butir soal CAT serta impor dari file Excel.',
      icon: <FileText className="h-5.5 w-5.5 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      path: '/admin/soal'
    },
    {
      title: 'Kelola Paket Tryout',
      description: 'Atur paket produk, durasi pengerjaan, harga diskon, dan pemetaan soal.',
      icon: <Layers className="h-5.5 w-5.5 text-indigo-650" />,
      bgIcon: 'bg-indigo-50',
      path: '/admin/paket'
    },
    {
      title: 'Verifikasi Pembayaran',
      description: `Konfirmasi transfer pembelian paket peserta CASN. (${pendingVerifications} pending)`,
      icon: <Receipt className="h-5.5 w-5.5 text-amber-600" />,
      bgIcon: 'bg-amber-50',
      path: '/admin/pembayaran',
      badge: pendingVerifications > 0 ? pendingVerifications : null
    },
    {
      title: 'Kelola Banner Promosi',
      description: 'Pasang running text pengumuman serta link promo diskon terbaru.',
      icon: <Megaphone className="h-5.5 w-5.5 text-purple-650" />,
      bgIcon: 'bg-purple-50',
      path: '/admin/banner'
    },
    {
      title: 'Keuangan & Analisis',
      description: 'Pantau omzet penjualan bulanan, statistik registrasi, dan konversi.',
      icon: <TrendingUp className="h-5.5 w-5.5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
      path: '/admin/analytics'
    },
    {
      title: 'Kelola Kode Referal',
      description: 'Buat kode kupon baru untuk program affiliasi dan diskon checkout.',
      icon: <Ticket className="h-5.5 w-5.5 text-red-650" />,
      bgIcon: 'bg-red-50',
      path: '/admin/referal'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans animate-fadeIn">
      {/* Header Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard Ringkasan Admin</h2>
        <p className="text-sm text-slate-500">Pusat kendali dan ringkasan performa platform tryout WILDAN CASN.</p>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Bank Soal */}
        <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Soal</span>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
              {totalQuestions} <span className="text-xs font-semibold text-slate-500">Butir</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              {categories.map((c, i) => `${c.name.toUpperCase()}:${categoryCounts[c.name.toUpperCase()] || 0}`).join(' | ')}
            </span>
          </div>
        </Card>

        {/* Card 2: Paket */}
        <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paket Tryout</span>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
              {totalPackages} <span className="text-xs font-semibold text-slate-500">Produk</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              {activePackages} Gratis | {lockedPackages} Premium
            </span>
          </div>
        </Card>

        {/* Card 3: Banner */}
        <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-650 flex-shrink-0">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Banner Promosi</span>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
              {announcements.length} <span className="text-xs font-semibold text-slate-500">Banner</span>
            </span>
            <span className="text-[10px] text-slate-450 font-bold block mt-1">
              {activeBanners} Banner Aktif Tampil
            </span>
          </div>
        </Card>

        {/* Card 4: Pending Verifikasi */}
        <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verifikasi Pending</span>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
              {pendingVerifications} <span className="text-xs font-semibold text-slate-500">Trx</span>
            </span>
            {pendingVerifications > 0 ? (
              <span className="text-[10px] text-red-500 font-bold animate-pulse block mt-1">
                Butuh tindakan segera
              </span>
            ) : (
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                Semua bersih
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800">Akses Cepat Pengelolaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => (
            <Card 
              key={idx}
              onClick={() => navigate(action.path)}
              className="p-5 border border-slate-200/60 shadow-premium bg-white hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-premium-lg transition-all duration-300 cursor-pointer flex gap-4 items-start relative group"
            >
              <div className={`w-11 h-11 ${action.bgIcon} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="space-y-1.5 flex-grow pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {action.title}
                  </h4>
                  {action.badge && (
                    <span className="h-5 px-1.5 bg-red-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {action.description}
                </p>
              </div>
              <div className="absolute bottom-5 right-5 text-slate-350 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="h-4.5 w-4.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">Aktivitas Transaksi Terbaru</h3>
          <button 
            onClick={() => navigate('/admin/pembayaran')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <span>Lihat Semua Transaksi</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <Card className="p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3">ID Transaksi</th>
                  <th className="px-5 py-3">Nama User</th>
                  <th className="px-5 py-3">Paket Tryout</th>
                  <th className="px-5 py-3 text-center">Nominal</th>
                  <th className="px-5 py-3 text-center w-28">Status</th>
                  <th className="px-5 py-3 text-center w-32">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-sm">
                {sortedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold text-xs">
                      Belum ada aktivitas transaksi terdaftar.
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-5 py-3 font-semibold text-slate-650 text-xs">{trx.id}</td>
                      <td className="px-5 py-3 font-bold text-slate-800">{trx.userName}</td>
                      <td className="px-5 py-3 font-medium text-slate-500">{trx.package}</td>
                      <td className="px-5 py-3 text-center font-extrabold text-slate-700">
                        {trx.amount}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant={getStatusBadgeVariant(trx.status)}>
                          {trx.status === 'success' ? 'Sukses' : trx.status === 'pending' ? 'Pending' : 'Gagal'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-center font-semibold text-slate-400 text-xs">
                        {new Date(trx.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}