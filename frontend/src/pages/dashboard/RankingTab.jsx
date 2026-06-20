import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { Trophy, Medal, Flame, Search, AlertCircle, RefreshCw, Award } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function RankingTab() {
  const { user, packages, rankings, fetchRankings, fetchPackages } = useExamStore();
  const [selectedPkgId, setSelectedPkgId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('overall'); // 'overall', 'twk', 'tiu', 'tkp'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPackagesAndRankings = async () => {
      setLoading(true);
      await fetchPackages();
      // Use first package id as default if available
      const defaultId = packages.length > 0 ? packages[0].id : 1;
      setSelectedPkgId(defaultId);
      await fetchRankings(defaultId);
      setLoading(false);
    };
    loadPackagesAndRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPackages, fetchRankings]);

  const handlePackageChange = async (e) => {
    const pkgId = parseInt(e.target.value);
    setSelectedPkgId(pkgId);
    setLoading(true);
    await fetchRankings(pkgId);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchRankings(selectedPkgId);
    setLoading(false);
  };

  // 1. Filter by search term
  const searchedRankings = rankings.filter(item => 
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sort dynamically based on category
  const sortedRankings = [...searchedRankings].sort((a, b) => {
    if (activeCategory === 'twk') return b.twk - a.twk;
    if (activeCategory === 'tiu') return b.tiu - a.tiu;
    if (activeCategory === 'tkp') return b.tkp - a.tkp;
    return b.score - a.score; // overall
  });

  // Find current user's best rank in this package
  const userRankIndex = sortedRankings.findIndex(r => r.userId === user?.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const userBestAttempt = userRankIndex !== -1 ? sortedRankings[userRankIndex] : null;

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500 fill-amber-500/10" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400 fill-slate-400/10" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-700/10" />;
    return <span className="text-xs font-bold text-slate-400 w-5 text-center">{rank}</span>;
  };

  const getRankRowStyle = (rank, isSelf) => {
    let style = "transition-all duration-150 ";
    if (isSelf) style += "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-l-blue-600 font-semibold";
    else if (rank === 1) style += "bg-amber-50/20 hover:bg-amber-50/30";
    else style += "hover:bg-slate-50/50";
    return style;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1C30] tracking-tight">Ranking Nasional</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Lihat peringkat belajar Anda bersaing secara nasional dengan data real peserta lain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Package */}
          <select
            value={selectedPkgId}
            onChange={handlePackageChange}
            className="px-3.5 py-2.5 rounded-xl bg-white ring-1 ring-slate-200 text-sm font-bold text-[#0B1C30] outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer min-w-[200px]"
          >
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title}
              </option>
            ))}
          </select>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 active:scale-[0.97]"
            title="Refresh Ranking"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* USER STATS BANNER */}
      {userBestAttempt && (
        <Card className="p-5 bg-gradient-to-r from-[#0B1C30] to-[#1E3E66] border-0 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-1/4 hidden md:block"></div>
          <div className="flex items-center gap-4.5 relative z-10">
            <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
              <Flame className="h-7 w-7 text-amber-400 animate-pulse fill-amber-400/10" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Peringkat Anda</p>
              <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
                # {userRank} <span className="text-xs font-normal text-slate-300">dari {sortedRankings.length} peserta</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center w-full md:w-auto relative z-10 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
            <div>
              <p className="text-[9px] font-bold text-slate-300 uppercase">TWK</p>
              <p className="text-sm font-extrabold mt-0.5 text-blue-300">{userBestAttempt.twk}</p>
            </div>
            <div className="border-l border-white/10">
              <p className="text-[9px] font-bold text-slate-300 uppercase">TIU</p>
              <p className="text-sm font-extrabold mt-0.5 text-indigo-300">{userBestAttempt.tiu}</p>
            </div>
            <div className="border-l border-white/10">
              <p className="text-[9px] font-bold text-slate-300 uppercase">TKP</p>
              <p className="text-sm font-extrabold mt-0.5 text-amber-300">{userBestAttempt.tkp}</p>
            </div>
            <div className="border-l border-white/10 bg-white/5 rounded-lg px-2 py-1">
              <p className="text-[9px] font-bold text-slate-300 uppercase">SKOR</p>
              <p className="text-sm font-extrabold mt-0.5 text-emerald-400">{userBestAttempt.score}</p>
            </div>
          </div>
        </Card>
      )}

      {/* PODIUM JUARA (TOP 3) */}
      {!loading && sortedRankings.length > 0 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-5 py-6 px-5 bg-white border border-slate-200/60 rounded-2xl shadow-premium">
          {/* Peringkat 2 (Kiri) */}
          {sortedRankings.length > 1 && (() => {
            const item = sortedRankings[1];
            return (
              <div className="flex flex-col items-center bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 w-full md:w-44 h-36 justify-between order-2 md:order-1 transition-all hover:-translate-y-0.5 duration-200">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {item.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-slate-400 text-white rounded-full p-0.5 border border-white">
                      <Award className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-xs font-bold text-slate-800 truncate px-1">{item.userName}</p>
                    <p className="text-[9px] text-slate-400 font-bold truncate px-1">{item.email}</p>
                  </div>
                </div>
                <div className="text-center w-full border-t border-slate-100 pt-1.5">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Perak (#2)</span>
                  <span className="block text-xs font-black text-slate-700">{item.score} Poin</span>
                </div>
              </div>
            );
          })()}

          {/* Peringkat 1 (Tengah - Lebih Tinggi) */}
          {sortedRankings.length > 0 && (() => {
            const item = sortedRankings[0];
            return (
              <div className="flex flex-col items-center bg-gradient-to-b from-amber-50/20 to-white border-2 border-amber-300 rounded-2xl p-5 w-full md:w-52 h-44 justify-between order-1 md:order-2 shadow-md transition-all hover:-translate-y-0.5 duration-200 scale-105">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-800 text-sm shadow-sm">
                      {item.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-550 text-white rounded-full p-1 border border-white shadow animate-pulse">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-xs font-black text-slate-900 truncate px-1">{item.userName}</p>
                    <p className="text-[9px] text-slate-400 font-bold truncate px-1">{item.email}</p>
                  </div>
                </div>
                <div className="text-center w-full border-t border-amber-100 pt-1.5">
                  <span className="block text-[9px] font-extrabold text-yellow-600 uppercase tracking-widest">🏆 Emas (#1)</span>
                  <span className="block text-sm font-black text-amber-700">{item.score} Poin</span>
                </div>
              </div>
            );
          })()}

          {/* Peringkat 3 (Kanan) */}
          {sortedRankings.length > 2 && (() => {
            const item = sortedRankings[2];
            return (
              <div className="flex flex-col items-center bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 w-full md:w-44 h-36 justify-between order-3 md:order-3 transition-all hover:-translate-y-0.5 duration-200">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-full bg-slate-100 border-2 border-amber-700/30 flex items-center justify-center font-bold text-amber-850 text-xs">
                      {item.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full p-0.5 border border-white">
                      <Award className="h-3 w-3 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-xs font-bold text-slate-800 truncate px-1">{item.userName}</p>
                    <p className="text-[9px] text-slate-400 font-bold truncate px-1">{item.email}</p>
                  </div>
                </div>
                <div className="text-center w-full border-t border-slate-100 pt-1.5">
                  <span className="block text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">Perunggu (#3)</span>
                  <span className="block text-xs font-black text-slate-700">{item.score} Poin</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* FILTER & SEARCH */}
      <Card className="p-0 border border-slate-200/60 shadow-premium overflow-hidden bg-white">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sub-tabs for sorting categories */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 w-full md:w-auto">
            {[
              { id: 'overall', name: 'Keseluruhan' },
              { id: 'twk', name: 'TWK' },
              { id: 'tiu', name: 'TIU' },
              { id: 'tkp', name: 'TKP' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-white text-[#0B1C30] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama peserta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* RANKINGS TABLE */}
        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-2 border-slate-350 border-t-slate-800 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">Memuat data ranking...</p>
          </div>
        ) : sortedRankings.length === 0 ? (
          <div className="text-center py-16 text-slate-400 px-6">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-slate-700">Belum Ada Data</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Belum ada peserta yang menyelesaikan simulasi tryout untuk versi soal ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 w-20 text-center">Rank</th>
                  <th className="px-6 py-4">Peserta</th>
                  <th className="px-6 py-4 text-center">TWK</th>
                  <th className="px-6 py-4 text-center">TIU</th>
                  <th className="px-6 py-4 text-center">TKP</th>
                  <th className="px-6 py-4 text-center">Total Skor</th>
                  <th className="px-6 py-4 text-center">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedRankings.map((item, idx) => {
                  const currentRank = idx + 1;
                  const isSelf = item.userId === user?.id;
                  
                  return (
                    <tr 
                      key={item.userId} 
                      className={getRankRowStyle(currentRank, isSelf)}
                    >
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center h-6">
                          {getMedalIcon(currentRank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelf 
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-655'
                          }`}>
                            {item.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                              <span>{item.userName}</span>
                              {isSelf && <span className="bg-blue-100 text-blue-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded">ANDA</span>}
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600 text-xs">{item.twk}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600 text-xs">{item.tiu}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600 text-xs">{item.tkp}</td>
                      <td className="px-6 py-4 text-center font-extrabold text-slate-800 text-sm">
                        <span className={activeCategory === 'overall' ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded-md' : ''}>
                          {item.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={item.result === 'LULUS' ? 'success' : 'neutral'}>
                          {item.result}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
