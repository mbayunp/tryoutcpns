import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { History, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function HistoryTab() {
    const { history } = useExamStore();
    const navigate = useNavigate(); // Inisialisasi navigasi

    // Jika riwayat kosong
    if (history.length === 0) {
        return (
            <Card className="p-12 border border-slate-200/60 shadow-premium flex flex-col items-center justify-center space-y-4 bg-white animate-fadeIn">
                <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                    <History className="h-10 w-10" />
                </div>
                <p className="text-sm font-semibold text-slate-500">Belum ada riwayat tryout. Ayo mulai ujian pertamamu!</p>
            </Card>
        );
    }

    // Jika ada riwayat
    return (
        <Card className="overflow-hidden p-0 border border-slate-200/60 shadow-premium bg-white animate-fadeIn">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0B1C30] text-[11px] font-bold uppercase text-white/90 tracking-wider">
                            <th className="px-6 py-4">Paket Tryout</th>
                            <th className="px-6 py-4">Tanggal Pengerjaan</th>
                            <th className="px-6 py-4 text-center">TWK</th>
                            <th className="px-6 py-4 text-center">TIU</th>
                            <th className="px-6 py-4 text-center">TKP</th>
                            <th className="px-6 py-4 text-center">Total Skor</th>
                            <th className="px-6 py-4 text-center">Status Kelulusan</th>
                            <th className="px-6 py-4 text-center">Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {history.map((h, idx) => (
                            <tr
                                key={idx}
                                onClick={() => navigate('/result', { state: { attemptId: h.id } })} // Navigasi saat diklik dengan passing ID
                                className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group"
                            >
                                {/* Teks judul akan berubah navy saat baris di-hover */}
                                <td className="px-6 py-4 font-bold text-slate-800 group-hover:text-[#0B1C30] transition-colors">
                                    {h.title}
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{h.date}</td>
                                <td className="px-6 py-4 text-center font-bold text-[#0B1C30]">{h.twk}</td>
                                <td className="px-6 py-4 text-center font-bold text-indigo-600">{h.tiu}</td>
                                <td className="px-6 py-4 text-center font-bold text-amber-500">{h.tkp}</td>
                                <td className="px-6 py-4 text-center font-extrabold text-[#0B1C30] text-base">{h.score}</td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant={h.result === 'LULUS' ? 'success' : 'danger'} className="font-bold border-0">
                                        {h.result === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}
                                    </Badge>
                                </td>
                                {/* Ikon panah penanda bisa diklik */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center text-slate-400 group-hover:text-[#0B1C30] group-hover:translate-x-1 transition-all">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}