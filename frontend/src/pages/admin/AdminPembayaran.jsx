import React, { useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Receipt,
    Download,
    Trash2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useExamStore } from '../../store/useExamStore';
import SEO from '../../components/common/SEO';

export default function AdminPembayaran() {
    const { transactions, updateTransactionStatus, fetchTransactions, deleteTransaction, adminActiveProgram } = useExamStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    React.useEffect(() => {
        fetchTransactions(adminActiveProgram);
    }, [fetchTransactions, adminActiveProgram]);

    // Fungsi untuk mengaktifkan paket (Approve)
    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Verifikasi Pembayaran',
            text: 'Verifikasi pembayaran ini dan aktifkan paket user?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Verifikasi',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
            try {
                await updateTransactionStatus(id, 'success');
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Pembayaran berhasil diverifikasi dan paket diaktifkan.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal memverifikasi pembayaran.',
                    icon: 'error'
                });
            }
        }
    };

    // Fungsi untuk menolak pembayaran (Reject)
    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: 'Tolak Pembayaran',
            text: 'Tolak pembayaran ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
            try {
                await updateTransactionStatus(id, 'failed');
                Swal.fire({
                    title: 'Ditolak!',
                    text: 'Pembayaran telah ditolak.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal mengubah status pembayaran.',
                    icon: 'error'
                });
            }
        }
    };

    const handleDeleteTransaction = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Transaksi',
            text: 'Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
            try {
                await deleteTransaction(id);
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Transaksi berhasil dihapus.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal menghapus transaksi.',
                    icon: 'error'
                });
            }
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

    const exportToExcel = () => {
        const successTrx = transactions.filter(t => t.status === 'success');
        if (successTrx.length === 0) {
            Swal.fire({
                title: 'Informasi',
                text: 'Tidak ada data transaksi sukses untuk diekspor.',
                icon: 'info',
                confirmButtonColor: '#0B1C30'
            });
            return;
        }
        const dataToExport = successTrx.map((t, idx) => ({
            "No": idx + 1,
            "ID Transaksi": t.id,
            "Tanggal": t.date,
            "Nama User": t.userName,
            "Email": t.email,
            "Paket Tryout": t.package,
            "Nominal": t.amount,
            "Status": "SUKSES"
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");
        XLSX.writeFile(wb, "laporan_keuangan_tryout.xlsx");
    };

    return (
        <>
            <SEO title="Verifikasi Pembayaran" />
            <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
                {/* Header Title */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Verifikasi Pembayaran</h2>
                        <p className="text-sm text-slate-500">Verifikasi transaksi pembayaran tryout premium dan bundling peserta.</p>
                    </div>
                </div>

                <div className="space-y-6 animate-fadeIn">
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
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari ID Transaksi atau Nama..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={exportToExcel}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.97] whitespace-nowrap"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Unduh Laporan (Excel)</span>
                                </button>
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
                            <table className="w-full text-left border-collapse hidden md:table">
                                <thead>
                                    <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/60">
                                        <th className="px-6 py-4">ID & Tanggal</th>
                                        <th className="px-6 py-4">Informasi User</th>
                                        <th className="px-6 py-4">Paket & Nominal</th>
                                        <th className="px-6 py-4 text-center">Bukti</th>
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
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const isFree = trx.proofImage === 'FREE_PROMO' || trx.amount === 'Rp 0' || trx.amount === 'Rp. 0';
                                                            Swal.fire({
                                                                title: 'Bukti Transfer Pembayaran',
                                                                text: `Transaksi ID: ${trx.id} (${trx.userName})`,
                                                                imageUrl: isFree ? undefined : (trx.proofImage || 'https://placehold.co/600x400?text=Bukti+Transfer'),
                                                                html: isFree ? '<div class="p-6 bg-emerald-50 text-emerald-700 font-extrabold text-sm rounded-xl border border-emerald-100">Promo Diskon 100% / Gratis<br/>Tidak memerlukan bukti transfer</div>' : undefined,
                                                                imageWidth: isFree ? undefined : 400,
                                                                imageAlt: 'Bukti Transfer',
                                                                confirmButtonText: 'Tutup',
                                                                confirmButtonColor: '#0B1C35'
                                                            });
                                                        }}
                                                        className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer"
                                                    >
                                                        Lihat Bukti
                                                    </button>
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
                                                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors ring-1 ring-emerald-200 hover:ring-emerald-500 playbook-trigger"
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
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleDeleteTransaction(trx.id)}
                                                                className="p-2 bg-red-50 text-red-650 hover:bg-red-500 hover:text-white rounded-lg transition-colors ring-1 ring-red-200 hover:ring-red-500 cursor-pointer"
                                                                title="Hapus Transaksi"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                <Receipt className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                                <p className="font-semibold text-sm">Tidak ada data transaksi ditemukan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card List View */}
                        <div className="block md:hidden divide-y divide-slate-100 bg-white">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((trx) => (
                                    <div key={trx.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{trx.id}</div>
                                                <div className="text-xs text-slate-400 font-medium mt-0.5">{trx.date}</div>
                                            </div>
                                            <Badge variant={
                                                trx.status === 'success' ? 'success' :
                                                    trx.status === 'pending' ? 'warning' : 'danger'
                                            }>
                                                {trx.status === 'success' ? 'BERHASIL' :
                                                    trx.status === 'pending' ? 'PENDING' : 'GAGAL'}
                                            </Badge>
                                        </div>

                                        <div className="text-xs text-slate-650 space-y-1">
                                            <div>
                                                <span className="font-semibold text-slate-400">Nama:</span> <span className="font-bold text-slate-700">{trx.userName}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-400">Email:</span> <span className="font-medium text-slate-600">{trx.email}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-400">Paket:</span> <span className="font-bold text-blue-600">{trx.package}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-400">Nominal:</span> <span className="font-extrabold text-slate-700">{trx.amount}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => Swal.fire({
                                                    title: 'Bukti Transfer Pembayaran',
                                                    text: `Transaksi ID: ${trx.id} (${trx.userName})`,
                                                    imageUrl: trx.proofImage || 'https://placehold.co/600x400?text=Bukti+Transfer',
                                                    imageWidth: 400,
                                                    imageAlt: 'Bukti Transfer',
                                                    confirmButtonText: 'Tutup',
                                                    confirmButtonColor: '#0B1C35'
                                                })}
                                                className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer"
                                            >
                                                Lihat Bukti
                                            </button>

                                            <div>
                                                {trx.status === 'pending' ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(trx.id)}
                                                            className="px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors ring-1 ring-emerald-200 hover:ring-emerald-500 flex items-center gap-1"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>Setujui</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(trx.id)}
                                                            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors ring-1 ring-red-200 hover:ring-red-500 flex items-center gap-1"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            <span>Tolak</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-400 font-semibold italic mr-1">Selesai</span>
                                                        <button
                                                            onClick={() => handleDeleteTransaction(trx.id)}
                                                            className="px-2.5 py-1.5 bg-red-50 text-red-650 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors ring-1 ring-red-200 hover:ring-red-500 flex items-center gap-1 cursor-pointer"
                                                            title="Hapus Transaksi"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            <span>Hapus</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 px-4 text-center text-slate-400">
                                    <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="font-semibold text-xs">Tidak ada data transaksi ditemukan.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}