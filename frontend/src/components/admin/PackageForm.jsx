import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../common/Button';

export default function PackageForm({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  adminActiveProgram
}) {
  const [pkgProgramType, setPkgProgramType] = useState('SKD');
  const [pkgStatus, setPkgStatus] = useState('Aktif');
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgDuration, setPkgDuration] = useState(100);
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(0);
  const [pkgDiscountPercentage, setPkgDiscountPercentage] = useState(0);
  const [pkgCategory, setPkgCategory] = useState('Tryout');
  const [pkgImageUrl, setPkgImageUrl] = useState('');
  const [pkgProductType, setPkgProductType] = useState('TRYOUT');
  const [pkgWaGroupLink, setPkgWaGroupLink] = useState('');
  const [pkgEbookFile, setPkgEbookFile] = useState(null);
  const [pkgBenefits, setPkgBenefits] = useState([
    { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
    { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
    { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
    { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
  ]);
  const [pkgShieldText, setPkgShieldText] = useState('Aman & Terpercaya');
  const [pkgAwardText, setPkgAwardText] = useState('Jaminan Lulus Ambang Batas');

  // Load initialData when editing or reset for adding
  useEffect(() => {
    if (initialData) {
      setPkgProgramType(initialData.program_type || 'SKD');
      setPkgStatus(initialData.status || 'Aktif');
      setPkgTitle(initialData.title || '');
      setPkgDescription(initialData.description || '');
      setPkgDuration(initialData.duration || 100);
      setPkgPrice(initialData.price || 0);
      setPkgOriginalPrice(initialData.originalPrice || 0);
      setPkgDiscountPercentage(initialData.discountPercentage || 0);
      setPkgCategory(initialData.category || 'Tryout');
      setPkgImageUrl(initialData.imageUrl || '');
      setPkgProductType(initialData.product_type || 'TRYOUT');
      setPkgWaGroupLink(initialData.wa_group_link || '');
      setPkgEbookFile(null);
      
      const parsedBenefits = initialData.benefits ? (typeof initialData.benefits === 'string' ? JSON.parse(initialData.benefits) : initialData.benefits) : [
        { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
        { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
        { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
        { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
      ];
      setPkgBenefits(parsedBenefits);

      const parsedShieldAward = initialData.shield_award ? (typeof initialData.shield_award === 'string' ? JSON.parse(initialData.shield_award) : initialData.shield_award) : {
        shield: 'Aman & Terpercaya',
        award: 'Jaminan Lulus Ambang Batas'
      };
      setPkgShieldText(parsedShieldAward.shield || 'Aman & Terpercaya');
      setPkgAwardText(parsedShieldAward.award || 'Jaminan Lulus Ambang Batas');
    } else {
      setPkgProgramType(adminActiveProgram || 'SKD');
      setPkgStatus('Aktif');
      setPkgTitle('');
      setPkgDescription('');
      setPkgDuration(100);
      setPkgPrice(0);
      setPkgOriginalPrice(0);
      setPkgDiscountPercentage(0);
      setPkgCategory('Tryout');
      setPkgImageUrl('');
      setPkgProductType('TRYOUT');
      setPkgWaGroupLink('');
      setPkgEbookFile(null);
      setPkgBenefits([
        { title: 'Kurikulum SKD Terupdate', desc: 'Materi disusun sesuai kisi-kisi BKN 2026 terlengkap.' },
        { title: 'Video Pembahasan Modul', desc: 'Penjelasan langkah-demi-langkah penyelesaian soal rumit.' },
        { title: 'Simulasi Sistem CAT BKN', desc: 'Ujian dengan limit waktu dan layout persis CAT BKN.' },
        { title: 'Analisis Hasil Instan', desc: 'Ketahui nilai kelulusan ambang batas passing grade secara langsung.' },
      ]);
      setPkgShieldText('Aman & Terpercaya');
      setPkgAwardText('Jaminan Lulus Ambang Batas');
    }
  }, [initialData, adminActiveProgram]);

  // Adjust program types when active layout filter changes (only for new packages)
  useEffect(() => {
    if (!isEditing && adminActiveProgram) {
      setPkgProgramType(adminActiveProgram);
    }
  }, [adminActiveProgram, isEditing]);

  useEffect(() => {
    if (pkgProgramType === 'PPPK') {
      setPkgDuration(130);
    }
  }, [pkgProgramType]);

  // Calculate dynamic price
  useEffect(() => {
    const original = parseInt(pkgOriginalPrice) || 0;
    const discount = parseInt(pkgDiscountPercentage) || 0;
    if (original > 0) {
      const finalPrice = Math.round(original - (original * discount) / 100);
      setPkgPrice(finalPrice);
    } else {
      setPkgPrice(0);
    }
  }, [pkgOriginalPrice, pkgDiscountPercentage]);

  const handlePkgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPkgImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const pkgData = {
      title: pkgTitle,
      description: pkgDescription,
      duration: pkgProductType === 'TRYOUT' ? parseInt(pkgDuration, 10) : 0,
      status: pkgStatus,
      category: pkgCategory,
      imageUrl: pkgImageUrl,
      originalPrice: parseInt(pkgOriginalPrice, 10) || 0,
      discountPercentage: parseInt(pkgDiscountPercentage, 10) || 0,
      price: parseInt(pkgPrice, 10) || 0,
      program_type: pkgProgramType,
      product_type: pkgProductType,
      wa_group_link: pkgProductType === 'KELAS' ? pkgWaGroupLink : null,
      ebookFile: pkgProductType === 'EBOOK' ? pkgEbookFile : null,
      benefits: pkgBenefits,
      shield_award: {
        shield: pkgShieldText,
        award: pkgAwardText
      }
    };
    onSubmit(pkgData);
  };

  const selectClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";
  const textareaClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Posisi 1 (Paling Atas): Target Program */}
      <div>
        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Target Program</label>
        <select
          value={pkgProgramType}
          onChange={(e) => setPkgProgramType(e.target.value)}
          className={selectClass}
          disabled={!!adminActiveProgram}
          required
        >
          {!adminActiveProgram && <option value="">-- Pilih Program --</option>}
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

      {/* Posisi 2: Status Akses */}
      <div>
        <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1.5">Status Akses</label>
        <select
          value={pkgStatus}
          onChange={(e) => setPkgStatus(e.target.value)}
          className={selectClass}
        >
          <option value="Aktif">Aktif (Gratis)</option>
          <option value="Terkunci">Terkunci (Premium)</option>
        </select>
      </div>

      {/* Posisi 3 dst: Sisa Input */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama / Judul Paket</label>
        <input
          type="text"
          value={pkgTitle}
          onChange={(e) => setPkgTitle(e.target.value)}
          placeholder="Contoh: Tryout Akbar SKD CASN 2026"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Paket</label>
        <textarea
          value={pkgDescription}
          onChange={(e) => setPkgDescription(e.target.value)}
          placeholder="Deskripsi materi ujian, jumlah soal, dan benefit peserta..."
          rows="3"
          className={textareaClass}
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe Produk</label>
          <select
            value={pkgProductType}
            onChange={(e) => {
              const val = e.target.value;
              setPkgProductType(val);
              if (val === 'TRYOUT') setPkgCategory('Tryout');
              else if (val === 'KELAS') setPkgCategory('Kelas Online');
              else if (val === 'EBOOK') setPkgCategory('E-Book');
              else if (val === 'BUNDLE') setPkgCategory('Bundling');
            }}
            className={selectClass}
          >
            <option value="TRYOUT">Try Out (Ujian Simulasi CAT)</option>
            <option value="KELAS">Kelas Online (Materi Zoom/WA)</option>
            <option value="EBOOK">E-Book (Berkas Download PDF)</option>
            <option value="BUNDLE">Bundling Paket Campuran</option>
          </select>
        </div>

        {/* Dynamic Fields based on Product Type */}
        {pkgProductType === 'TRYOUT' && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Durasi (Menit)</label>
            <input
              type="number"
              value={pkgDuration}
              onChange={(e) => setPkgDuration(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        )}

        {pkgProductType === 'KELAS' && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Link Akses Kelas (Grup WhatsApp / URL Zoom)</label>
            <input
              type="url"
              value={pkgWaGroupLink}
              onChange={(e) => setPkgWaGroupLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/... atau https://zoom.us/j/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        )}

        {pkgProductType === 'EBOOK' && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload File E-Book (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPkgEbookFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B1C30] hover:file:bg-slate-200 cursor-pointer"
              required={!isEditing}
            />
            {pkgEbookFile && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Berkas terpilih: {pkgEbookFile.name}</p>
            )}
          </div>
        )}
      </div>

      {/* Pricing / Discount section */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3.5">
        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-slate-200/80 pb-1.5">Skema Diskon Produk</p>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Normal (Rp)</label>
            <input
              type="number"
              value={pkgOriginalPrice}
              onChange={(e) => setPkgOriginalPrice(e.target.value)}
              placeholder="0"
              className="w-full px-2 py-2 rounded-lg bg-white ring-1 ring-slate-200 text-xs font-semibold text-slate-850 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diskon (%)</label>
            <input
              type="number"
              value={pkgDiscountPercentage}
              onChange={(e) => setPkgDiscountPercentage(e.target.value)}
              placeholder="0"
              max="100"
              className="w-full px-2 py-2 rounded-lg bg-white ring-1 ring-slate-200 text-xs font-semibold text-slate-850 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Final (Rp)</label>
            <div className="w-full px-2 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-650 truncate select-all">
              {pkgPrice.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Package cover image */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gambar Cover Paket</label>
        <div className="space-y-2">
          {pkgImageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={pkgImageUrl} alt="Cover Preview" className="w-full h-full object-contain" />
              <button 
                type="button" 
                onClick={() => setPkgImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-755 text-white rounded-full transition-colors border-0 cursor-pointer shadow-md flex items-center justify-center"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePkgImageChange}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B1C30] hover:file:bg-slate-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Materi & Benefit ({pkgBenefits.length})</span>
          <button
            type="button"
            onClick={() => setPkgBenefits([...pkgBenefits, { title: '', desc: '' }])}
            className="px-2.5 py-1 bg-[#0B1C30] hover:bg-[#1E3E66] text-white text-[9px] font-bold rounded-lg transition-colors border-0 cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="h-3 w-3" /> Tambah Benefit
          </button>
        </div>

        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
          {pkgBenefits.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 font-medium">Belum ada benefit. Klik "+ Tambah Benefit" di atas.</p>
          ) : (
            pkgBenefits.map((b, idx) => (
              <div key={idx} className="relative p-3.5 bg-white border border-slate-150 rounded-xl shadow-xs hover:shadow-sm transition-all space-y-2">
                <button
                  type="button"
                  onClick={() => setPkgBenefits(pkgBenefits.filter((_, i) => i !== idx))}
                  className="absolute top-3.5 right-3 text-red-500 hover:text-red-755 bg-transparent border-0 cursor-pointer font-bold text-[10px] uppercase tracking-wider"
                >
                  Hapus
                </button>
                <div className="space-y-2.5 pr-12">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Judul Benefit</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const newB = [...pkgBenefits];
                        newB[idx] = { ...newB[idx], title: e.target.value };
                        setPkgBenefits(newB);
                      }}
                      placeholder="Contoh: Kurikulum SKD Terupdate"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Deskripsi Singkat</label>
                    <textarea
                      value={b.desc}
                      onChange={(e) => {
                        const newB = [...pkgBenefits];
                        newB[idx] = { ...newB[idx], desc: e.target.value };
                        setPkgBenefits(newB);
                      }}
                      placeholder="Contoh: Materi disusun sesuai kisi-kisi BKN 25."
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-650 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Icon custom labels */}
      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-4">
        <div className="border-b border-slate-200/80 pb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kustomisasi Teks Ikon</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Teks Shield (Aman)</label>
            <input
              type="text"
              value={pkgShieldText}
              onChange={(e) => setPkgShieldText(e.target.value)}
              placeholder="Aman & Terpercaya"
              className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-855 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Teks Award (Lulus)</label>
            <input
              type="text"
              value={pkgAwardText}
              onChange={(e) => setPkgAwardText(e.target.value)}
              placeholder="Jaminan Lulus Ambang Batas"
              className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-855 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" className="flex-grow border-slate-200 cursor-pointer" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" className="flex-grow bg-[#0B1C30] hover:bg-[#102A43] text-white border-0 cursor-pointer">
          {isEditing ? 'Simpan Perubahan' : 'Tambah Paket'}
        </Button>
      </div>
    </form>
  );
}
