import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import {
  FileText,
  TrendingUp,
  History as HistoryIcon,
  ArrowRight,
  PlusCircle,
  Trophy,
  ShoppingBag,
  Package
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExamStore } from '../../store/useExamStore';
import Card from '../../components/common/Card';

const formatRupiah = (num) => {
  if (num === undefined || num === null) return 'Rp 0';
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user, packages, history, fetchPackages, fetchHistory, activeProgram } = useExamStore();

  useEffect(() => {
    fetchPackages();
    fetchHistory();
  }, [fetchPackages, fetchHistory, activeProgram]);

  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const averageScore = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const totalAttempts = history.length;
  const purchasedPackageCount = packages.filter(p => p.isPurchased).length;

  // Build chart data from real history (last 7 attempts)
  const chartData = useMemo(() => {
    if (history.length === 0) return [];
    return history
      .slice(0, 7)
      .reverse()
      .map((h, idx) => ({
        name: h.date ? h.date.split(' ').slice(0, 2).join(' ') : `#${idx + 1}`,
        skor: h.score || 0,
      }));
  }, [history]);

  // Real accuracy: average score / 550 (passing threshold)
  const accuracyPercent = history.length > 0 ? Math.round((averageScore / 550) * 100) : 0;
  // Real daily target: attempts done out of a target of 1 tryout/day (7 days = 7 target)
  const weeklyTarget = history.length > 0 ? Math.min(Math.round((Math.min(history.length, 7) / 7) * 100), 100) : 0;

  return (
    <>
      <SEO title="Ruang Belajar" />
      <div className="max-w-full mx-auto space-y-gutter pb-12 font-body-md text-on-surface animate-fadeIn">
        
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
              {totalAttempts > 0 
                ? `Anda telah menyelesaikan ${totalAttempts} tryout dengan rata-rata skor ${averageScore}. Teruslah berjuang untuk impian menjadi ASN bersama WILDAN CASN!`
                : 'Mulai perjalanan Anda menuju ASN bersama WILDAN CASN! Ikuti tryout pertama Anda sekarang.'
              }
            </p>
            <button
              onClick={() => navigate('/dashboard/paket')}
              className="bg-white hover:bg-slate-100 text-[#0B1C30] font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-lg border-0 text-sm cursor-pointer"
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
              <Trophy className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Skor Tertinggi</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                {highestScore} <span className="text-xs font-normal text-slate-400">/ 550</span>
              </h3>
            </div>
          </Card>

          <Card className="p-6 border border-white/40 shadow-premium flex items-start gap-4 hover:-translate-y-1 hover:shadow-premium-hover transition-all duration-300 ease-out border-l-4 border-l-violet-500 bg-white/80 backdrop-blur-md">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-600 flex-shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Paket Dimiliki</p>
              <h3 className="text-2xl font-extrabold text-[#0B1C30]">
                {purchasedPackageCount} <span className="text-xs font-normal text-slate-400">Paket</span>
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
            {chartData.length > 0 ? (
              <div className="h-60 w-full animate-fadeIn">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={240}>
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
            ) : (
              <div className="h-60 w-full flex items-center justify-center text-slate-300">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-10 w-10 mx-auto text-slate-200" />
                  <p className="text-xs font-semibold text-slate-400">Belum ada data. Ikuti tryout untuk melihat grafik progres Anda.</p>
                </div>
              </div>
            )}

            {/* Progress sliders */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Mingguan <span className="text-slate-300 normal-case">({Math.min(totalAttempts, 7)}/7 tryout)</span></p>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0B1C30] h-full rounded-full transition-all duration-500" style={{ width: `${weeklyTarget}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rata-rata Akurasi <span className="text-slate-300 normal-case">({accuracyPercent}%)</span></p>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${accuracyPercent}%` }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Latest Tryouts */}
          <Card className="p-6 border border-slate-200/60 shadow-premium flex flex-col justify-between bg-white">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-[#0B1C30]">Tryout Terbaru</h2>
                <button onClick={() => navigate('/dashboard/riwayat')} className="text-[#0B1C30] text-xs font-bold hover:underline bg-transparent border-0 cursor-pointer">
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
              onClick={() => navigate('/dashboard/paket')}
              className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 hover:border-[#0B1C30] hover:text-[#0B1C30] text-slate-400 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs bg-slate-50/50 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Ikuti Tryout Baru
            </button>
          </Card>
        </div>

        {/* Rekomendasi Untukmu! */}
        <div className="space-y-6 pt-8 border-t border-slate-250/20 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-[#0B1C30] tracking-tight">Rekomendasi Untukmu!</h2>
            <button
              onClick={() => navigate('/dashboard/paket?cat=Tryout')}
              className="text-[#0B1C30] hover:text-[#1E3E66] font-bold text-sm flex items-center gap-1 hover:underline transition-colors border-0 bg-transparent cursor-pointer"
            >
              Lainnya <span className="text-xs">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.slice(0, 4).map((pkg) => (
              <div key={pkg.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                {/* Package Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] flex items-center justify-center text-white">
                      <Package className="h-10 w-10 opacity-45" />
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-[15px] text-slate-800 tracking-tight leading-snug group-hover:text-[#0B1C30] transition-colors line-clamp-2">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {pkg.description || 'Simulasi lengkap sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.'}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Price Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {pkg.discountPercentage > 0 && (
                          <>
                            <span className="bg-[#E6F4EA] text-[#137333] font-bold px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                              {pkg.discountPercentage}%
                            </span>
                            <span className="text-[11px] text-slate-400 line-through truncate font-medium">
                              {formatRupiah(pkg.originalPrice)}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[#0B1C30] font-extrabold text-base whitespace-nowrap">
                        {formatRupiah(pkg.price)}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(`/paket/${pkg.id}`)}
                      className="w-full py-2.5 bg-[#0B1C30] hover:bg-[#1E3E66] active:scale-[0.98] text-white rounded-full font-bold text-xs shadow-md shadow-slate-900/10 hover:shadow-lg transition-all flex items-center justify-center gap-1 border-0 cursor-pointer"
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
