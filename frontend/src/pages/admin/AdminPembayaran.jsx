import React, { useState } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    Receipt
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useExamStore } from '../../store/useExamStore';

export default function AdminPembayaran() {
    const { transactions, updateTransactionStatus, fetchTransactions } = useExamStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    React.useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Fungsi untuk mengaktifkan paket (Approve)
    const handleApprove = (id) => {
        if (window.confirm('Verifikasi pembayaran ini dan aktifkan paket user?')) {
            updateTransactionStatus(id, 'success');
        }
    };

    // Fungsi untuk menolak pembayaran (Reject)
    const handleReject = (id) => {
        if (window.confirm('Tolak pembayaran ini?')) {
            updateTransactionStatus(id, 'failed');
        }
    };

    // Filter & Search Logic
    const filteredTransactions = transactions.filter(trx => {
        const matchSearch = trx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.package.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'all' || trx.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Hitung ringkasan
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const successCount = transactions.filter(t => t.status === 'success').length;

    // Hitung pendapatan total secara dinamis
    const totalRevenue = transactions
        .filter(t => t.status === 'success')
        .reduce((sum, t) => {
            const num = parseInt(t.amount.replace(/[^0-9]/g, '')) || 0;
            return sum + num;
        }, 0);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num).replace(/,00$/, '');
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Verifikasi</p>
                        <h3 className="text-2xl font-extrabold text-[#0B1C30]">{pendingCount} <span className="text-sm font-medium text-slate-500">Transaksi</span></h3>
                    </div>
                </Card>

                <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pembayaran Berhasil</p>
                        <h3 className="text-2xl font-extrabold text-[#0B1C30]">{successCount} <span className="text-sm font-medium text-slate-500">Transaksi</span></h3>
                    </div>
                </Card>

                <Card className="p-6 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white hover:-translate-y-0.5 transition-all">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                        <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
                        <h3 className="text-2xl font-extrabold text-[#0B1C30]">{formatRupiah(totalRevenue)}</h3>
                    </div>
                </Card>
            </div>

            {/* Main Table Section */}
            <Card className="p-0 border border-slate-200/60 shadow-premium overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari ID Transaksi atau Nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {['all', 'pending', 'success', 'failed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === status
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {status === 'all' ? 'Semua' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/60">
                                <th className="px-6 py-4">ID & Tanggal</th>
                                <th className="px-6 py-4">Informasi User</th>
                                <th className="px-6 py-4">Paket & Nominal</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{trx.id}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">{trx.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{trx.userName}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">{trx.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-blue-600">{trx.package}</div>
                                            <div className="text-xs font-extrabold text-slate-700 mt-0.5">{trx.amount}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={
                                                trx.status === 'success' ? 'success' :
                                                    trx.status === 'pending' ? 'warning' : 'danger'
                                            }>
                                                {trx.status === 'success' ? 'BERHASIL' :
                                                    trx.status === 'pending' ? 'PENDING' : 'GAGAL'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {trx.status === 'pending' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(trx.id)}
                                                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors ring-1 ring-emerald-200 hover:ring-emerald-500 tooltip-trigger"
                                                        title="Verifikasi Pembayaran"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(trx.id)}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors ring-1 ring-red-200 hover:ring-red-500"
                                                        title="Tolak"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        <Receipt className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                        <p className="font-semibold text-sm">Tidak ada data transaksi ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}