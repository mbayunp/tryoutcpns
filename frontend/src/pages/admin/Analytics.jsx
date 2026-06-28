import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import API from '../../utils/api';
import SEO from '../../components/common/SEO';
import * as XLSX from 'xlsx';
import {
  Receipt,
  Users,
  Search,
  Download,
  Calendar,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const formatRupiah = (num) => {
  if (num === undefined || num === null) return 'Rp 0';
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function Analytics() {
  const { transactions, fetchTransactions, adminActiveProgram } = useExamStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (adminActiveProgram) {
          params.program_type = adminActiveProgram;
        }
        const [resAnalytics] = await Promise.all([
          API.get('/admin/analytics', { params }),
          fetchTransactions(adminActiveProgram)
        ]);
        setAnalytics(resAnalytics.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [fetchTransactions, adminActiveProgram]);

  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }

    const dataToExport = transactions.map((t, idx) => ({
      'No': idx + 1,
      'ID Transaksi': t.id,
      'Tanggal': t.date,
      'Nama': t.userName,
      'Email': t.email,
      'Paket': t.package,
      'Nominal': t.amount,
      'Status': t.status.toUpperCase()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
    XLSX.writeFile(wb, 'Laporan_Keuangan_Wildan_CASN.xlsx');
  };

  // Filtered transactions for the table
  const filteredTransactions = (transactions || []).filter(t => {
    const matchesSearch = 
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1C30]"></div>
        <p className="text-sm font-bold text-slate-500">Memuat analisis keuangan...</p>
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalRevenue: 0,
    totalTransactions: 0,
    successTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalUsers: 0,
    activeUsers: 0
  };

  // Format chart data
  const revenueChartData = (analytics?.revenueByDate || []).map(item => {
    const parts = item.date.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date;
    return {
      name: formattedDate,
      'Pendapatan': item.revenue,
      'Transaksi': item.count
    };
  });

  const categoryChartData = (analytics?.categoryDistribution || []).map(item => ({
    name: item.category,
    'Jumlah Pembelian': item.count
  }));

  const COLORS = ['#0B1C30', '#8C0C14', '#D97706', '#10B981'];

  return (
    <>
      <SEO title="Keuangan & Analisis Admin" />
      
      <div className="space-y-8 pb-12 font-body-md text-on-surface animate-fadeIn max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">Keuangan & Analisis</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Dashboard ringkasan finansial dan statistik pengguna platform.</p>
        </div>

        {/* Top Row: Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Revenue */}
          <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Total Pendapatan</span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
                {formatRupiah(summary.totalRevenue)}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 block mt-1">Selesai Berhasil</span>
            </div>
          </Card>

          {/* Card 2: Transactions Success */}
          <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#8C0C14] flex-shrink-0">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Transaksi Sukses</span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
                {summary.successTransactions} <span className="text-xs font-bold text-slate-400">/ {summary.totalTransactions} total</span>
              </span>
              <span className="text-[11px] font-bold text-[#8C0C14] block mt-1">
                {summary.pendingTransactions} Pending, {summary.failedTransactions} Gagal
              </span>
            </div>
          </Card>

          {/* Card 3: Active Users */}
          <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-5 bg-white hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-[#0B1C30]/5 rounded-2xl flex items-center justify-center text-[#0B1C30] flex-shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Pengguna Aktif</span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight block mt-0.5">
                {summary.activeUsers} <span className="text-xs font-bold text-slate-400">/ {summary.totalUsers} total</span>
              </span>
              <span className="text-[11px] font-bold text-[#0B1C30] block mt-1">Status Akun Aktif</span>
            </div>
          </Card>
        </div>

        {/* Middle Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart (Area Chart) */}
          <Card className="lg:col-span-2 p-6 border border-slate-200/60 shadow-premium bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0B1C30] tracking-tight">Tren Penjualan & Pendapatan</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">Pendapatan harian dari transaksi sukses.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Calendar className="h-4 w-4 text-[#8C0C14]" />
                <span>30 Hari Terakhir</span>
              </div>
            </div>
            
            <div className="h-[280px] w-full pt-4">
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8C0C14" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8C0C14" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      fontWeight={600} 
                      tickLine={false}
                      tickFormatter={(val) => `Rp ${val >= 1000000 ? (val / 1000000) + 'M' : val >= 1000 ? (val / 1000) + 'k' : val}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [name === 'Pendapatan' ? formatRupiah(value) : value, name]}
                      contentStyle={{ background: '#0B1C30', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Pendapatan" stroke="#8C0C14" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
                  Belum ada data tren pendapatan.
                </div>
              )}
            </div>
          </Card>

          {/* Category Distribution Chart */}
          <Card className="p-6 border border-slate-200/60 shadow-premium bg-white space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-[#0B1C30] tracking-tight">Kategori Produk Terlaris</h3>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Distribusi pembelian berdasarkan kategori paket.</p>
            </div>

            <div className="h-[280px] w-full pt-4">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0B1C30', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="Jumlah Pembelian" radius={[8, 8, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
                  Belum ada data distribusi kategori.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom Row: Recent Transactions Table */}
        <Card className="border border-slate-200/60 shadow-premium bg-white overflow-hidden">
          {/* Table Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1C30] tracking-tight">Daftar Transaksi Terbaru</h3>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Pantau dan verifikasi pembayaran dari peserta.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari user, email, paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/10 focus:border-[#0B1C30] transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/10"
              >
                <option value="all">Semua Status</option>
                <option value="success">Sukses</option>
                <option value="pending">Pending</option>
                <option value="failed">Gagal</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1C30] hover:bg-[#1E3E66] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer border-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Ekspor Excel</span>
              </button>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10.5px] font-bold text-slate-450 uppercase tracking-wider">
                  <th className="py-4 px-6">ID / User</th>
                  <th className="py-4 px-6">Paket Belajar</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-655">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* User Info */}
                      <td className="py-4.5 px-6">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-100/60 px-1.5 py-0.5 rounded font-bold">
                            {t.id}
                          </span>
                          <div className="font-bold text-slate-800 mt-1">{t.userName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{t.email}</div>
                        </div>
                      </td>

                      {/* Package Name */}
                      <td className="py-4.5 px-6">
                        <span className="font-bold text-slate-800 block max-w-[240px] truncate">
                          {t.package}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4.5 px-6 text-slate-450 text-[11px] font-bold">
                        {t.date}
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-6">
                        <Badge 
                          variant={t.status === 'success' ? 'success' : t.status === 'pending' ? 'warning' : 'danger'}
                          className="font-bold tracking-wide text-[9px] uppercase px-2.5 py-1 rounded-full"
                        >
                          {t.status === 'success' ? 'Sukses' : t.status === 'pending' ? 'Pending' : 'Gagal'}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td className="py-4.5 px-6 text-right font-extrabold text-slate-800 text-[13px]">
                        {t.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-450 font-bold">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="h-6 w-6 text-slate-300" />
                        <span>Tidak ada transaksi yang cocok.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
