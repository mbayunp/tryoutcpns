import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  FileText,
  TrendingUp,
  History,
  Lock,
  ArrowRight,
  Clock,
  PlusCircle,
  Award
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, packages, history, activeTab, setActiveTab, fetchPackages, fetchHistory } = useExamStore();

  React.useEffect(() => {
    fetchPackages();
    fetchHistory();
  }, [fetchPackages, fetchHistory, activeTab]);

  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const averageScore = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const totalAttempts = history.length;

  const handleStartExam = (pkg) => {
    if (pkg.status === 'Terkunci') {
      alert('Paket ini terkunci. Upgrade ke Premium untuk membuka akses.');
      return;
    }
    navigate('/exam', { state: { packageId: pkg.id } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-gutter pb-12 font-body-md text-on-surface">
      
      {/* ═══ DASHBOARD TAB ═══ */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-primary-container p-8 md:p-12 text-white mb-gutter shadow-premium relative">
            <div className="relative z-10 max-w-lg space-y-4">
              <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold tracking-tight">
                Selamat Datang, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="font-body-lg text-sm md:text-base opacity-90 leading-relaxed">
                Anda telah menyelesaikan 85% target belajar minggu ini. Teruslah berjuang untuk impian menjadi ASN bersama Sentral CPNS!
              </p>
              <Button 
                variant="secondary" 
                onClick={() => setActiveTab('tryout')} 
                className="bg-secondary-container hover:bg-secondary text-white font-bold py-3 px-8 rounded-lg transition-transform active:scale-95 flex items-center gap-2 shadow-md border-0"
              >
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-1/2 hidden md:block"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          </section>

          {/* Summary Cards (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <Card className="p-6 border border-slate-200/60 shadow-premium flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Tryout Diikuti</p>
                <h3 className="text-2xl font-extrabold text-on-surface">
                  {totalAttempts} <span className="text-xs font-normal text-slate-400">Paket</span>
                </h3>
              </div>
            </Card>

            <Card className="p-6 border border-slate-200/60 shadow-premium flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-secondary">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Rata-rata Skor</p>
                <h3 className="text-2xl font-extrabold text-on-surface">
                  {averageScore} <span className="text-xs font-normal text-slate-400">/ 550</span>
                </h3>
              </div>
            </Card>

            <Card className="p-6 border border-slate-200/60 shadow-premium flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Peringkat Nasional</p>
                <h3 className="text-2xl font-extrabold text-on-surface">
                  {highestScore >= 311 ? '#1,240' : '#8,495'} <span className="text-xs font-normal text-slate-400">dari 45k</span>
                </h3>
              </div>
            </Card>
          </div>

          {/* Two Column Layout (Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Learning Progress Section */}
            <Card className="lg:col-span-2 p-8 border border-slate-200/60 shadow-premium space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Progres Belajar</h2>
                <div className="text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
                  7 Hari Terakhir
                </div>
              </div>

              {/* Chart Mockup */}
              <div className="h-60 flex items-end justify-between gap-4 relative pt-4">
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[40%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">320</div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[65%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">410</div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[55%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">380</div>
                </div>
                <div className="flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/90 group relative h-[85%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">490</div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[45%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">350</div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[70%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">430</div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-primary/20 group relative h-[95%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">520</div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-semibold text-slate-400 px-2">
                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
              </div>

              {/* Progress sliders */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Harian</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Akurasi</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Latest Tryouts */}
            <Card className="p-6 border border-slate-200/60 shadow-premium flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Tryout Terbaru</h2>
                  <button onClick={() => setActiveTab('riwayat')} className="text-primary text-xs font-semibold hover:underline">
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-4">
                  {history.length > 0 ? (
                    history.slice(0, 3).map((h, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[120px]">{h.title}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{h.date}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Skor</p>
                            <p className="text-sm font-bold text-slate-800">{h.score}</p>
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
                      <History className="h-8 w-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">Belum ada riwayat tryout.</p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setActiveTab('tryout')}
                className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 hover:border-primary hover:text-primary text-slate-400 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
              >
                <PlusCircle className="h-4 w-4" />
                Ikuti Tryout Baru
              </Button>
            </Card>
          </div>
        </>
      )}

      {/* ═══ TRY OUT LIST TAB ═══ */}
      {activeTab === 'tryout' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`p-6 flex flex-col justify-between space-y-6 ${pkg.status === 'Terkunci' ? 'opacity-80' : ''}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant={pkg.status === 'Terkunci' ? 'neutral' : 'primary'}>SKD</Badge>
                  {pkg.status === 'Terkunci' && <Lock className="h-4 w-4 text-slate-300" />}
                </div>
                <h4 className="text-base font-bold text-slate-800 leading-snug">{pkg.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Simulasi lengkap TWK, TIU, dan TKP sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400 font-semibold pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{pkg.duration} Min</span>
                  <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" />{pkg.totalQuestions} Soal</span>
                </div>
                
                <Button 
                  variant={pkg.status === 'Terkunci' ? 'outline' : 'primary'} 
                  className="w-full py-3 bg-primary hover:bg-primary-container text-white" 
                  onClick={() => handleStartExam(pkg)}
                >
                  {pkg.status === 'Terkunci' ? (
                    <span className="flex items-center justify-center gap-1.5"><Lock className="h-4 w-4" />Locked</span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">Mulai Ujian<ArrowRight className="h-4 w-4" /></span>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ═══ HISTORY TABLE TAB ═══ */}
      {activeTab === 'riwayat' && (
        <Card className="overflow-hidden p-0 border border-slate-200/60 shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/60">
                  <th className="px-6 py-4">Paket Tryout</th>
                  <th className="px-6 py-4">Tanggal Pengerjaan</th>
                  <th className="px-6 py-4 text-center">TWK</th>
                  <th className="px-6 py-4 text-center">TIU</th>
                  <th className="px-6 py-4 text-center">TKP</th>
                  <th className="px-6 py-4 text-center">Total Skor</th>
                  <th className="px-6 py-4 text-center">Status Kelulusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {history.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 font-bold text-slate-800">{h.title}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{h.date}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{h.twk}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{h.tiu}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500">{h.tkp}</td>
                    <td className="px-6 py-4 text-center font-extrabold text-slate-900 text-base">{h.score}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={h.result === 'LULUS' ? 'success' : 'danger'}>
                        {h.result === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══ PROFILE TAB ═══ */}
      {activeTab === 'profil' && (
        <Card className="p-8 max-w-2xl border border-slate-200/60 shadow-premium">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md">
              {user?.avatar || 'CP'}
            </div>
            <div>
              <h4 className="text-xl font-bold tracking-tight text-slate-900">{user?.name}</h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-150/40">
            {[
              { label: 'Nama Lengkap', value: user?.name },
              { label: 'Alamat Email', value: user?.email },
              { label: 'Tipe Keanggotaan', value: user?.role === 'admin' ? 'Administrator' : 'Premium Member' },
              { label: 'No. Registrasi Akun', value: 'SKD-2026-9012' }
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200/50 text-sm font-semibold text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
