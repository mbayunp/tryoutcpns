import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useExamStore } from '../../store/useExamStore';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function UserProfile() {
  const { user, history, fetchHistory, updateEmail, updateAvatar } = useExamStore();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingAvatar, setIsSubmittingAvatar] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (user?.email) {
      setEmailInput(user.email);
    }
  }, [user]);

  const totalAttempts = history.length;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'File Terlalu Besar',
        text: 'Ukuran foto profil tidak boleh melebihi 2MB!',
        icon: 'warning',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Format Tidak Valid',
        text: 'File yang diunggah harus berupa gambar!',
        icon: 'warning',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    setIsSubmittingAvatar(true);
    try {
      await updateAvatar(file);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Foto profil berhasil diperbarui.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Gagal mengunggah foto profil.',
        icon: 'error',
        confirmButtonColor: '#0B1C30'
      });
    } finally {
      setIsSubmittingAvatar(false);
    }
  };

  const handleEmailSave = async () => {
    if (!emailInput.trim()) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Email tidak boleh kosong!',
        icon: 'warning',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Format email tidak valid!',
        icon: 'warning',
        confirmButtonColor: '#0B1C30'
      });
      return;
    }

    setIsSubmittingEmail(true);
    try {
      await updateEmail(emailInput);
      setIsEditingEmail(false);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Alamat email berhasil diperbarui.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Gagal memperbarui email.',
        icon: 'error',
        confirmButtonColor: '#0B1C30'
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleEmailCancel = () => {
    setEmailInput(user?.email || '');
    setIsEditingEmail(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Left Avatar Card */}
      <Card className="p-6 border border-slate-200/60 shadow-premium bg-white flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="h-24 w-24 bg-gradient-to-br from-[#0B1C30] to-[#1E3E66] text-white rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-lg overflow-hidden">
            {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
              <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              user?.avatar || user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'
            )}
          </div>
          <span className="absolute bottom-0 right-0 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white" title="Active"></span>
        </div>

        <div className="space-y-1">
          <h4 className="text-lg font-bold text-slate-800">{user?.name}</h4>
          <Badge className="bg-[#0B1C30]/10 text-[#0B1C30] border-0 text-[10px] font-bold uppercase">
            {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
          </Badge>
        </div>

        {/* Avatar upload file triggers */}
        <div className="w-full pt-1">
          <input
            type="file"
            id="avatar-file-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={isSubmittingAvatar}
          />
          <label
            htmlFor="avatar-file-upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer active:scale-[0.98]"
          >
            {isSubmittingAvatar ? 'Memproses...' : 'Edit Foto'}
          </label>
        </div>

        <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Status Akun</p>
            <p className="text-sm font-bold text-emerald-600">Aktif</p>
          </div>
          <div className="border-l border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Sesi Ujian</p>
            <p className="text-sm font-bold text-slate-800">{totalAttempts}</p>
          </div>
        </div>
      </Card>

      {/* Right Profile Details */}
      <Card className="lg:col-span-2 p-8 border border-slate-200/60 shadow-premium bg-white space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-[#0B1C30]">Informasi Profil</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola data personal dan keanggotaan Anda di WILDAN CASN.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
            <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/50 text-sm font-bold text-slate-800">
              {user?.name}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Nama resmi sesuai kartu identitas</p>
          </div>

          {/* Alamat Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email</label>
            {isEditingEmail ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#0B1C30]/20 focus:border-[#0B1C30] transition-all"
                  required
                />
                <button
                  onClick={handleEmailSave}
                  disabled={isSubmittingEmail}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer border-0 shadow-sm active:scale-95"
                >
                  {isSubmittingEmail ? 'Simpan...' : 'Simpan'}
                </button>
                <button
                  onClick={handleEmailCancel}
                  className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer border-0 shadow-sm"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/50">
                <span className="text-sm font-bold text-slate-800">{user?.email}</span>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-[11px] font-bold text-[#0B1C30] hover:text-[#1E3E66] bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-medium">Digunakan untuk login & notifikasi</p>
          </div>

          {/* Tipe Keanggotaan */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipe Keanggotaan</label>
            <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/50 text-sm font-bold text-slate-800">
              {user?.role === 'admin' ? 'Administrator System' : 'Premium Tryout Member'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Hak akses paket simulasi</p>
          </div>

          {/* No. Registrasi Akun */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. Registrasi Akun</label>
            <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/50 text-sm font-bold text-slate-800">
              {user?.registration_number || 'Belum Ada'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Nomor pendaftaran platform</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
