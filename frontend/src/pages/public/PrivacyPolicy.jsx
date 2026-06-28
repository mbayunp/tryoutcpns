import React from 'react';
import PolicyLayout from '../../components/public/PolicyLayout';
import PolicySection from '../../components/public/PolicySection';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Kebijakan Privasi"
      description="Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda."
      lastUpdated="18 Juni 2026"
    >
      <div className="space-y-6">
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base border-b border-slate-100 pb-6">
          Kami berkomitmen untuk menjaga keamanan dan kerahasiaan data pribadi pengguna yang menggunakan layanan platform Try Out CPNS Online. Kebijakan ini menjelaskan bagaimana data Anda dikelola saat berinteraksi dengan layanan kami.
        </p>

        <PolicySection number="1" title="Informasi yang Dikumpulkan">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Kami mengumpulkan informasi berikut untuk menunjang kualitas layanan:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Data Akun:</span> Nama Lengkap, Email, WhatsApp (opsional), dan Password terenkripsi.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Data Aktivitas:</span> Riwayat pengerjaan Try Out, perolehan nilai, durasi pengerjaan, dan perangkat yang digunakan.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Data Teknis:</span> Alamat IP, jenis browser, sistem operasi, dan Device ID.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="2" title="Penggunaan Data">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Data pribadi yang dikumpulkan digunakan untuk keperluan:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Proses pendaftaran dan pengelolaan akun pengguna.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Autentikasi keamanan saat login.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Mengolah dan menampilkan hasil simulasi Try Out secara akurat.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Analisis performa belajar dan memberikan saran peningkatan.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Keamanan akun dan pemantauan aktivitas mencurigakan.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="3" title="Penyimpanan Data">
          <p className="text-slate-600 text-sm sm:text-base">
            Seluruh data pribadi Anda disimpan pada infrastruktur cloud server kami yang aman dan dilindungi enkripsi standar industri. Akses terhadap data ini sangat dibatasi dan hanya diberikan kepada personel berwenang yang memerlukan akses untuk menunjang operasional sistem.
          </p>
        </PolicySection>

        <PolicySection number="4" title="Pembagian Data">
          <p className="text-slate-600 text-sm sm:text-base">
            Kami menjamin privasi Anda sepenuhnya. Wildan CASN tidak akan menjual, menyewakan, meminjamkan, atau membagikan data pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan tertulis sebelumnya, kecuali jika diwajibkan oleh ketentuan hukum yang berlaku.
          </p>
        </PolicySection>

        <PolicySection number="5" title="Keamanan Data">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Kami menerapkan perlindungan berlapis demi keamanan data Anda:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Kerahasiaan password menggunakan enkripsi satu arah (hash).</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Pengiriman data terenkripsi melalui protokol HTTPS SSL.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Manajemen sesi login aktif (Session Management).</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Pemantauan perangkat yang digunakan (Device Monitoring) untuk mencegah akses ilegal.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="6" title="Hak Pengguna">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Sebagai pengguna, Anda memiliki kendali penuh atas informasi Anda:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Hak untuk melihat dan mengubah data profil Anda kapan saja.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Hak untuk meminta penghapusan akun beserta seluruh data yang tersimpan.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span>Hak untuk mendapatkan salinan informasi data pribadi Anda yang kami simpan.</span>
            </li>
          </ul>
        </PolicySection>
      </div>
    </PolicyLayout>
  );
}