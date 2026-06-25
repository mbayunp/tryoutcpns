import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Search,
  Plus,
  Edit,
  Trash,
  Ticket,
  CheckCircle,
  Copy,
  Calendar,
  Percent,
  TrendingUp,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import API from '../../utils/api';

export default function AdminReferral() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Form Values
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch referrals
  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/referrals');
      if (res.data && res.data.data) {
        setReferrals(res.data.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Gagal memuat data referal.',
        icon: 'error',
        confirmButtonColor: '#0B1C30'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Handle open modal for create
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedId(null);
    setCode('');
    setDiscountPercentage('');
    setIsActive(true);
    setShowModal(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (ref) => {
    setIsEditing(true);
    setSelectedId(ref.id);
    setCode(ref.code);
    setDiscountPercentage(ref.discount_percentage);
    setIsActive(ref.is_active);
    setShowModal(true);
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      Swal.fire('Peringatan', 'Kode referal tidak boleh kosong.', 'warning');
      return;
    }
    const pct = parseInt(discountPercentage, 10);
    if (isNaN(pct) || pct < 1 || pct > 100) {
      Swal.fire('Peringatan', 'Persentase diskon harus berupa angka antara 1 dan 100.', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_percentage: pct,
        is_active: isActive
      };

      if (isEditing) {
        await API.put(`/admin/referrals/${selectedId}`, payload);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kode referal berhasil diupdate.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await API.post('/admin/referrals', payload);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kode referal baru berhasil ditambahkan.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setShowModal(false);
      fetchReferrals();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Gagal',
        text: err.response?.data?.message || 'Terjadi kesalahan sistem.',
        icon: 'error',
        confirmButtonColor: '#0B1C30'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete operation
  const handleDelete = async (id, codeString) => {
    const result = await Swal.fire({
      title: 'Hapus Kode Referal?',
      text: `Apakah Anda yakin ingin menghapus kode "${codeString}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/admin/referrals/${id}`);
        Swal.fire({
          title: 'Dihapus!',
          text: 'Kode referal berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchReferrals();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Gagal!',
          text: err.response?.data?.message || 'Gagal menghapus kode referal.',
          icon: 'error',
          confirmButtonColor: '#0B1C30'
        });
      }
    }
  };

  // Copy code to clipboard helper
  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt);
    Swal.fire({
      title: 'Disalin!',
      text: `Kode "${txt}" berhasil disalin ke clipboard.`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    });
  };

  // Filtering
  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = ref.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && ref.is_active) || 
      (filterStatus === 'inactive' && !ref.is_active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-[#0B1C30]" />
            Manajemen Kode Referal
          </h2>
          <p className="text-sm text-slate-500 font-medium">Buat, kelola, dan pantau penggunaan kode diskon referral.</p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#0B1C30] hover:bg-[#102A43] text-white shadow-premium transition-all font-bold"
        >
          <Plus className="h-4.5 w-4.5" />
          Tambah Kode Baru
        </Button>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
            <Ticket className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kode</p>
            <h3 className="text-2xl font-extrabold text-[#0B1C30]">{referrals.length} <span className="text-xs font-medium text-slate-500">Kode</span></h3>
          </div>
        </Card>

        <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kode Aktif</p>
            <h3 className="text-2xl font-extrabold text-[#0B1C30]">{referrals.filter(r => r.is_active).length} <span className="text-xs font-medium text-slate-500">Aktif</span></h3>
          </div>
        </Card>

        <Card className="p-5 border border-slate-200/60 shadow-premium flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Penggunaan</p>
            <h3 className="text-2xl font-extrabold text-[#0B1C30]">
              {referrals.reduce((sum, r) => sum + (r.usage_count || 0), 0)} <span className="text-xs font-medium text-slate-500">Kali</span>
            </h3>
          </div>
        </Card>
      </div>

      {/* Main Content Table & Filters Container */}
      <Card className="p-0 border border-slate-200/60 shadow-premium overflow-hidden bg-white">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Kode Referal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'active', label: 'Aktif' },
              { id: 'inactive', label: 'Non-aktif' }
            ].map(status => (
              <button
                key={status.id}
                type="button"
                onClick={() => setFilterStatus(status.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === status.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-200/60">
                <th className="px-6 py-4 w-12 text-center">#</th>
                <th className="px-6 py-4">Kode Referal</th>
                <th className="px-6 py-4 text-center">Diskon (%)</th>
                <th className="px-6 py-4 text-center">Total Digunakan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Tanggal Dibuat</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1C30]"></div>
                      <p className="text-xs text-slate-400 font-semibold">Memuat kode referal...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref, idx) => (
                  <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-xs text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 font-mono tracking-wide">{ref.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ref.code)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="Salin Kode"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold border border-blue-100">
                        <Percent className="h-3 w-3" />
                        {ref.discount_percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700 font-mono">{ref.usage_count || 0} kali</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={ref.is_active ? 'success' : 'neutral'}>
                        {ref.is_active ? 'Aktif' : 'Non-aktif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        {new Date(ref.created_at || ref.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(ref)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ref.id, ref.code)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-semibold text-xs">
                    Tidak ada data kode referal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Vertical Cards View */}
        <div className="block md:hidden divide-y divide-slate-100 bg-white">
          {loading ? (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1C30]"></div>
              <p className="text-xs text-slate-400 font-semibold">Memuat data referal...</p>
            </div>
          ) : filteredReferrals.length > 0 ? (
            filteredReferrals.map((ref) => (
              <div key={ref.id} className="p-5 space-y-3 font-semibold text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 font-mono text-sm tracking-wide">{ref.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ref.code)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Badge variant={ref.is_active ? 'success' : 'neutral'}>
                    {ref.is_active ? 'Aktif' : 'Non-aktif'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Diskon</span>
                    <span className="text-slate-800 font-extrabold">{ref.discount_percentage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Digunakan</span>
                    <span className="text-slate-800 font-extrabold">{ref.usage_count || 0} Kali</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-350" />
                    {new Date(ref.created_at || ref.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(ref)}
                      className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 font-bold"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ref.id, ref.code)}
                      className="px-3 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all flex items-center gap-1 font-bold"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 font-semibold text-xs">
              Tidak ada data kode referal.
            </div>
          )}
        </div>
      </Card>

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-premium border border-slate-100 max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-center text-white relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-extrabold tracking-tight mb-1">
                {isEditing ? 'Edit Kode Referal' : 'Tambah Kode Referal'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Isi detail kode referal diskon di bawah</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  Kode Referal
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LULUS10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
                  disabled={isEditing}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase disabled:opacity-60"
                />
              </div>

              {/* Discount Percentage */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  Persentase Diskon (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  placeholder="Contoh: 10"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Status Select Toggle */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  Status Kode
                </label>
                <select
                  value={isActive ? 'aktif' : 'nonaktif'}
                  onChange={(e) => setIsActive(e.target.value === 'aktif')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitLoading && <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>}
                  {isEditing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
