import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  FileText,
  Trophy,
  TrendingUp,
  History,
  Lock,
  ArrowRight,
  Flame,
  Clock
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, packages, history, activeTab, setActiveTab } = useExamStore();

  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const averageScore = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const totalAttempts = history.length;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  const handleStartExam = (pkg) => {
    if (pkg.status === 'Terkunci') {
      alert('Paket ini terkunci. Upgrade ke Premium untuk membuka akses.');
      return;
    }
    navigate('/exam', { state: { packageId: pkg.id } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ─── GREETING ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {activeTab === 'dashboard' && `${greeting}, ${user?.name?.split(' ')[0]}`}
            {activeTab === 'tryout' && 'Paket Try Out'}
            {activeTab === 'riwayat' && 'Riwayat Ujian'}
            {activeTab === 'profil' && 'Profil Saya'}
          </h1>
          <p className="text-sm text-slate-500">
            {activeTab === 'dashboard' && 'Pantau perkembangan persiapan CPNS Anda.'}
            {activeTab === 'tryout' && 'Pilih dan kerjakan modul latihan SKD.'}
            {activeTab === 'riwayat' && 'Rincian seluruh hasil simulasi Anda.'}
            {activeTab === 'profil' && 'Kelola informasi akun Anda.'}
          </p>
        </div>
        {activeTab === 'dashboard' && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 w-fit">
            <Flame className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">3 Hari Streak</span>
          </div>
        )}
      </div>

      {/* ═══ DASHBOARD ═══ */}
      {activeTab === 'dashboard' && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Ujian', value: totalAttempts, sub: 'kali simulasi', icon: <FileText className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600 ring-blue-100' },
              { label: 'Skor Tertinggi', value: `${highestScore}`, sub: `/ 550 ${highestScore >= 311 ? '· Lulus' : ''}`, icon: <Trophy className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
              { label: 'Rata-rata', value: averageScore, sub: 'dari semua ujian', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600 ring-amber-100' }
            ].map((stat) => (
              <Card key={stat.label} className="p-5 flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ring-1 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-extrabold tracking-tight text-slate-900 mt-0.5">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Packages */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold tracking-tight text-slate-900">Paket Aktif</h3>
                <button onClick={() => setActiveTab('tryout')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Lihat semua →
                </button>
              </div>

              <div className="space-y-3">
                {packages.slice(0, 3).map((pkg) => (
                  <Card key={pkg.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-premium-hover hover:-translate-y-px transition-all duration-300">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">{pkg.title}</span>
                        {pkg.status === 'Terkunci' ? (
                          <Badge variant="neutral"><Lock className="h-3 w-3 mr-0.5" />Locked</Badge>
                        ) : (
                          <Badge variant="success">Aktif</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pkg.duration} Min</span>
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{pkg.totalQuestions} Soal</span>
                        {pkg.attempts > 0 && <span className="text-blue-500 font-semibold">{pkg.attempts}x dikerjakan</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={pkg.status === 'Terkunci' ? 'outline' : 'primary'}
                      disabled={pkg.status === 'Terkunci'}
                      onClick={() => handleStartExam(pkg)}
                      className="flex-shrink-0"
                    >
                      {pkg.status === 'Terkunci' ? <><Lock className="h-3 w-3" />Locked</> : <>Mulai<ArrowRight className="h-3 w-3" /></>}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* History sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-base font-bold tracking-tight text-slate-900">Riwayat Terakhir</h3>
              <Card className="p-4 divide-y divide-slate-100/80">
                {history.length > 0 ? history.slice(0, 4).map((h, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{h.title}</p>
                        <p className="text-[10px] text-slate-400">{h.date}</p>
                      </div>
                      <Badge variant={h.result === 'LULUS' ? 'success' : 'danger'} className="flex-shrink-0">
                        {h.result}
                      </Badge>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-400">Skor</span>
                      <span className="text-sm font-extrabold tracking-tight text-slate-800">{h.score}<span className="text-[10px] font-normal text-slate-400"> /550</span></span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-400">
                    <History className="h-7 w-7 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">Belum ada riwayat.</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ═══ TRY OUT LIST ═══ */}
      {activeTab === 'tryout' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} hover className={`p-6 flex flex-col justify-between space-y-5 ${pkg.status === 'Terkunci' ? 'opacity-75' : ''}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant={pkg.status === 'Terkunci' ? 'neutral' : 'primary'}>SKD</Badge>
                  {pkg.status === 'Terkunci' && <Lock className="h-4 w-4 text-slate-300" />}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{pkg.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Simulasi lengkap TWK, TIU, dan TKP sesuai kisi-kisi BKN 2026.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-500" />{pkg.duration} Min</span>
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-blue-500" />{pkg.totalQuestions} Soal</span>
                </div>
                <Button variant={pkg.status === 'Terkunci' ? 'outline' : 'primary'} className="w-full" onClick={() => handleStartExam(pkg)}>
                  {pkg.status === 'Terkunci' ? <><Lock className="h-3.5 w-3.5" />Unlock</>  : <>Mulai Ujian<ArrowRight className="h-3.5 w-3.5" /></>}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ═══ HISTORY TABLE ═══ */}
      {activeTab === 'riwayat' && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3.5">Paket</th>
                  <th className="px-5 py-3.5">Tanggal</th>
                  <th className="px-5 py-3.5 text-center">TWK</th>
                  <th className="px-5 py-3.5 text-center">TIU</th>
                  <th className="px-5 py-3.5 text-center">TKP</th>
                  <th className="px-5 py-3.5 text-center">Total</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-sm">
                {history.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{h.title}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{h.date}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-blue-700">{h.twk}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-indigo-600">{h.tiu}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-amber-600">{h.tkp}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-900">{h.score}</td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={h.result === 'LULUS' ? 'success' : 'danger'}>{h.result}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══ PROFILE ═══ */}
      {activeTab === 'profil' && (
        <Card className="p-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
              {user?.avatar || 'CP'}
            </div>
            <div>
              <h4 className="text-lg font-bold tracking-tight text-slate-900">{user?.name}</h4>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-slate-100">
            {[
              { label: 'Nama', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Tipe Akun', value: user?.role === 'admin' ? 'Administrator' : 'Peserta Gratis' },
              { label: 'No. Registrasi', value: 'SKD-2026-9012' }
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{f.label}</label>
                <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200/60 text-sm font-semibold text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
