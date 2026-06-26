import React, { useState, useEffect } from 'react';
import { useExamStore } from '../../store/useExamStore';
import Swal from 'sweetalert2';
import { Plus, X, Edit, Trash } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function AdminBanner() {
  const {
    announcements,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    adminActiveProgram
  } = useExamStore();

  const [bannerProgramType, setBannerProgramType] = useState('SKD');

  // CRUD state for Announcements / Banners
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerText, setBannerText] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);

  useEffect(() => {
    fetchAnnouncements(adminActiveProgram);
  }, [fetchAnnouncements, adminActiveProgram]);

  useEffect(() => {
    if (!isEditingBanner) {
      setBannerProgramType(adminActiveProgram || 'SKD');
    }
  }, [adminActiveProgram, isEditingBanner]);

  const resetBannerForm = () => {
    setIsEditingBanner(false);
    setEditingBannerId(null);
    setBannerText('');
    setBannerLink('');
    setBannerIsActive(true);
    setBannerProgramType(adminActiveProgram || 'SKD');
  };

  const handleEditBannerClick = (ann) => {
    setIsEditingBanner(true);
    setEditingBannerId(ann.id);
    setBannerText(ann.text);
    setBannerLink(ann.link || '');
    setBannerIsActive(ann.is_active);
    setBannerProgramType(ann.program_type || 'SKD');
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerText) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Harap isi teks pengumuman!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const bannerData = {
      text: bannerText,
      link: bannerLink || null,
      is_active: bannerIsActive,
      program_type: bannerProgramType
    };

    try {
      if (isEditingBanner) {
        await updateAnnouncement(editingBannerId, bannerData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner berhasil diperbarui!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createAnnouncement(bannerData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner baru berhasil ditambahkan!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      resetBannerForm();
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal menyimpan pengumuman/banner.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleBannerDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Banner',
      text: 'Apakah Anda yakin ingin menghapus pengumuman/banner ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengumuman/Banner berhasil dihapus!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus pengumuman/banner.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const textareaClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans animate-fadeIn">
      {/* Header Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manajemen Banner Promosi</h2>
        <p className="text-sm text-slate-500">Kelola pengumuman dan banner promosi yang tampil di running text.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Form Banner */}
        <Card className="lg:col-span-4 p-5 space-y-5 bg-white border border-slate-200/60 shadow-premium">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              {isEditingBanner ? 'Edit Banner Pengumuman' : 'Banner Pengumuman Baru'}
            </h3>
            {isEditingBanner && (
              <button onClick={resetBannerForm} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleBannerSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Banner</label>
              <textarea
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Contoh: Diskon 50% untuk Paket Premium dengan kode promo: MERDEKA50!"
                rows="3"
                className={textareaClass}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Link Halaman / URL (Opsional)</label>
              <input
                type="text"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="Contoh: /pricing atau https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Aktif</label>
              <select
                value={bannerIsActive ? 'aktif' : 'nonaktif'}
                onChange={(e) => setBannerIsActive(e.target.value === 'aktif')}
                className={selectClass}
              >
                <option value="aktif">Aktif (Tampilkan di Header)</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                * Mengaktifkan banner ini akan menampilkannya di running text header (Mendukung beberapa banner aktif sekaligus).
              </p>
            </div>
 
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Program</label>
              <select
                value={bannerProgramType}
                onChange={(e) => setBannerProgramType(e.target.value)}
                className={selectClass}
                disabled={!!adminActiveProgram}
                required
              >
                <option value="SKD">SKD CPNS</option>
                <option value="PPPK">PPPK</option>
                <option value="PPG">PPG</option>
              </select>
              {!!adminActiveProgram && (
                <p className="text-[10px] text-slate-450 mt-1 font-semibold">
                  Terkunci ke program filter aktif.
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              {isEditingBanner && (
                <Button type="button" variant="outline" className="flex-1" onClick={resetBannerForm}>Batal</Button>
              )}
              <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white">
                {isEditingBanner ? (
                  <>Simpan Perubahan</>
                ) : (
                  <><Plus className="h-3.5 w-3.5 mr-1" />Tambah Banner</>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tabel Banner */}
        <Card className="lg:col-span-8 p-0 overflow-hidden bg-white border border-slate-200/60 shadow-premium">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Daftar Banner Pengumuman</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                {announcements ? announcements.length : 0} banner terdaftar
              </p>
            </div>
            <Badge variant="primary">Pengumuman</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3 w-10 text-center">ID</th>
                  <th className="px-5 py-3">Teks Pengumuman</th>
                  <th className="px-5 py-3">Link Tujuan</th>
                  <th className="px-5 py-3 text-center w-24">Status</th>
                  <th className="px-5 py-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-sm">
                {!announcements || announcements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-medium">
                      Belum ada pengumuman/banner yang didaftarkan.
                    </td>
                  </tr>
                ) : (
                  announcements.map((ann) => (
                    <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-5 py-3 text-center text-[10px] font-bold text-slate-400">{ann.id}</td>
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        <p className="line-clamp-2 leading-relaxed">{ann.text}</p>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-500">
                        {ann.link ? (
                          <a
                            href={ann.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {ann.link}
                          </a>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={async () => {
                            try {
                              await updateAnnouncement(ann.id, { is_active: !ann.is_active });
                              Swal.fire({
                                title: 'Berhasil!',
                                text: 'Status banner berhasil diubah!',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false
                              });
                            } catch (err) {
                              Swal.fire({
                                title: 'Gagal!',
                                text: 'Gagal mengubah status banner.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#EF4444'
                              });
                            }
                          }}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Badge variant={ann.is_active ? 'success' : 'neutral'}>
                            {ann.is_active ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          <button
                            onClick={() => handleEditBannerClick(ann)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleBannerDelete(ann.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200/40 rounded-xl transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
