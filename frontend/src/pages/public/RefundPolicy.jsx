import React from 'react';
import PolicyLayout from '../../components/public/PolicyLayout';
import PolicySection from '../../components/public/PolicySection';

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Kebijakan Pengembalian Dana"
      description="Aturan, batasan kelayakan, dan alur prosedur pengajuan pengembalian dana (refund) transaksi Anda."
      lastUpdated="18 Juni 2026"
    >
      <div className="space-y-6">
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base border-b border-slate-100 pb-6">
          Terima kasih telah memilih platform kami sebagai partner persiapan kelulusan CASN Anda. Harap membaca kebijakan refund ini secara saksama sebelum melakukan pembelian paket premium.
        </p>

        <PolicySection number="1" title="Ketentuan Umum">
          <p className="text-slate-600 text-sm sm:text-base">
            Mengingat produk yang kami sediakan berupa produk digital (simulasi CAT, bank soal, dan materi e-learning), maka berlaku batasan tertentu untuk layanan digital. Pembelian bersifat final dan tidak dapat dibatalkan, kecuali jika memenuhi kondisi kelayakan di bawah ini.
          </p>
        </PolicySection>

        <PolicySection number="2" title="Refund Dapat Diajukan Jika">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Pengguna dapat mengajukan pengembalian dana apabila terjadi situasi berikut:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Sistem Gagal Aktivasi:</span> Pembayaran berhasil tetapi sistem kami gagal mengaktifkan paket soal / akses belajar Anda dalam waktu 1x24 jam setelah pembayaran diverifikasi.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Double Payment:</span> Terjadi gangguan sistem pembayaran yang menyebabkan tagihan Anda terbayar ganda untuk pesanan yang sama.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-500 mt-1">•</span>
              <span><span className="font-semibold text-slate-800">Kesalahan Sistem Platform:</span> Terjadi malfungsi backend platform yang menyebabkan akses terputus total dan tidak dapat digunakan.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="3" title="Refund Tidak Berlaku Jika">
          <p className="mb-4 text-slate-600 text-sm sm:text-base">Pengajuan refund akan otomatis ditolak atas kondisi-kondisi berikut:</p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Pengguna berubah pikiran, merasa salah memilih paket, atau salah membeli tipe paket belajar.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Layanan atau paket soal sudah digunakan untuk pengerjaan try out / simulasi belajar.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-red-500 mt-1">✗</span>
              <span>Kesalahan disebabkan oleh kegagalan perangkat atau koneksi internet pengguna itu sendiri.</span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection number="4" title="Proses Refund">
          <p className="mb-5 text-slate-600 text-sm sm:text-base">Untuk mempermudah proses refund, ikuti langkah-langkah di bawah ini:</p>
          
          <div className="space-y-5">
            {/* Langkah 1 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ring-1 ring-blue-100 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Hubungi Admin</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">Kirim pesan support ke admin WhatsApp kami atau email resmi dengan melampirkan nomor invoice / bukti bayar yang sah.</p>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ring-1 ring-blue-100 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Verifikasi Transaksi</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">Tim finansial kami akan melakukan pencocokan data transaksi di dashboard gateway pembayaran dan log sistem platform.</p>
              </div>
            </div>

            {/* Langkah 3 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ring-1 ring-blue-100 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Proses Pengembalian</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">Jika pengajuan disetujui, kami akan memproses pengembalian dana langsung ke rekening bank atau e-wallet asal pengguna.</p>
              </div>
            </div>

            {/* Langkah 4 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ring-1 ring-blue-100 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Dana Kembali</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">Dana refund akan ditransfer kembali dalam waktu <span className="font-semibold text-slate-700">3 hingga 14 hari kerja</span>, bergantung pada bank penerima dan gateway pembayaran terkait.</p>
              </div>
            </div>
          </div>
        </PolicySection>
      </div>
    </PolicyLayout>
  );
}