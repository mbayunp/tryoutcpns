import React from 'react';
import PolicyLayout from '../../components/public/PolicyLayout';
import PolicySection from '../../components/public/PolicySection';

export default function TermsConditions() {
  return (
    <PolicyLayout
      title="Syarat dan Ketentuan Penggunaan"
      description="Aturan, pedoman, dan tanggung jawab hukum penggunaan platform Wildan CASN."
      lastUpdated="18 Juni 2026"
    >
      <div className="space-y-6">
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base border-b border-slate-100 pb-6">
          Selamat datang di platform Wildan CASN. Dengan mengakses atau menggunakan situs dan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang dijelaskan di bawah ini. Jika Anda tidak menyetujui salah satu poin ketentuan, mohon untuk tidak menggunakan layanan kami.
        </p>

        <PolicySection number="1" title="Ketentuan Umum">
          <p className="text-slate-600 text-sm sm:text-base">
            Pengguna dianggap membaca & menyetujui syarat yang berlaku secara otomatis ketika melakukan pendaftaran akun atau mengakses layanan kami. Penggunaan layanan ditujukan sepenuhnya untuk tujuan belajar mandiri dalam persiapan seleksi CPNS/PPPK dan simulasi CAT BKN.
          </p>
        </PolicySection>

        <PolicySection number="2" title="Akun Pengguna">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Untuk mengakses fitur try out tertentu, pengguna diwajibkan mendaftar akun dengan ketentuan:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Wajib menggunakan identitas benar, akurat, dan terbaru.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Jaga kerahasiaan password dan kredensial login Anda sepenuhnya.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Dilarang keras membagikan atau memindahtangankan detail login akun Anda kepada orang lain.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="3" title="Pembatasan Akun">
          <p className="text-slate-600 text-sm sm:text-base">
            Demi menjaga stabilitas sistem dan keamanan konten, satu akun pengguna dibatasi untuk digunakan secara bersamaan maksimal dari <span className="font-semibold text-slate-800">2 (dua) perangkat aktif</span> saja. Sistem secara otomatis akan memblokir login baru jika mendeteksi penggunaan melebihi kuota perangkat ini.
          </p>
        </PolicySection>

        <PolicySection number="4" title="Larangan Pengguna">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Sebagai pengguna platform, Anda dilarang keras untuk:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Membagikan soal secara massal, menyalin, mengunduh, mendokumentasikan (screenshot), atau mempublikasikan materi try out ke media publik.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Menjual ulang akses akun, paket soal, atau materi pembelajaran di dalam platform tanpa persetujuan resmi.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Melakukan tindakan eksploitasi, hacking, bypass otentikasi, atau aktivitas lain yang merugikan sistem platform.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="5" title="Hak Platform">
          <p className="text-slate-600 text-sm sm:text-base">
            Wildan CASN berhak penuh untuk menonaktifkan akun, menolak akses, serta menghapus akun pelanggar secara sepihak jika terbukti melakukan pelanggaran terhadap syarat & ketentuan ini, tanpa kewajiban memberikan ganti rugi atau pengembalian dana.
          </p>
        </PolicySection>

        <PolicySection number="6" title="Perubahan Ketentuan">
          <p className="text-slate-600 text-sm sm:text-base">
            Syarat dan ketentuan ini dapat diubah sewaktu-waktu oleh pihak manajemen Wildan CASN dengan pemberitahuan di website. Perubahan akan berlaku seketika setelah dipublikasikan. Pengguna diharapkan memantau halaman ini secara berkala.
          </p>
        </PolicySection>
      </div>
    </PolicyLayout>
  );
}