const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Tryout, Question, ReferralCode } = require('../models');

const seed = async () => {
  try {
    // Authenticate and sync
    await sequelize.authenticate();
    console.log('Database connected. Starting seeding...');

    // Synchronize models
    try {
      await sequelize.query("ALTER TABLE `transactions` ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL;");
      console.log('Added referral_code column to transactions table.');
    } catch (err) {
      console.log('referral_code column already exists or table not ready.');
    }
    await sequelize.sync();

    // 1. Seed Categories
    console.log('Seeding Categories...');
    const [twkCat] = await Category.findOrCreate({
      where: { name: 'TWK' },
      defaults: { name: 'TWK' }
    });

    const [tiuCat] = await Category.findOrCreate({
      where: { name: 'TIU' },
      defaults: { name: 'TIU' }
    });

    const [tkpCat] = await Category.findOrCreate({
      where: { name: 'TKP' },
      defaults: { name: 'TKP' }
    });

    console.log('Categories seeded: TWK, TIU, TKP.');

    // 2. Seed Users
    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    let adminUser = await User.findOne({ where: { email: 'admin@wildan.com' } });
    if (adminUser) {
      adminUser.password = adminPassword;
      adminUser.phone_number = '081234567890';
      await adminUser.save();
    } else {
      adminUser = await User.create({
        name: 'Admin Wildan',
        email: 'admin@wildan.com',
        password: adminPassword,
        role: 'admin',
        phone_number: '081234567890',
        is_active: true
      });
    }

    let regularUser = await User.findOne({ where: { email: 'user@wildan.com' } });
    if (regularUser) {
      regularUser.password = userPassword;
      regularUser.phone_number = '089876543210';
      await regularUser.save();
    } else {
      regularUser = await User.create({
        name: 'Candidate User',
        email: 'user@wildan.com',
        password: userPassword,
        role: 'user',
        phone_number: '089876543210',
        is_active: true
      });
    }

    console.log('Users seeded & passwords updated: admin@wildan.com, user@wildan.com.');

    // 3. Seed Sample Tryouts
    console.log('Seeding Sample Tryouts...');
    const [sampleTryout] = await Tryout.findOrCreate({
      where: { title: 'BONUS DARI BUKU SKD Wildan CANS 2026' },
      defaults: {
        title: 'BONUS DARI BUKU SKD Wildan CANS 2026',
        description: 'PAKET INI KHUSUS UNTUK PEMILIK BUKU Wildan CANS SKD CPNS & KEDINASAN 2026.',
        duration: 100,
        total_questions: 4,
        status: 'active',
        category: 'Tryout',
        image_url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800',
        original_price: 9999999,
        discount_percentage: 0,
        price: 9999999
      }
    });

    const [premiumTryout] = await Tryout.findOrCreate({
      where: { title: 'KELAS ZOOM/YOUTUBE SKD 2026 PART 2' },
      defaults: {
        title: 'KELAS ZOOM/YOUTUBE SKD 2026 PART 2',
        description: 'Join kelas online melalui website dan terintegrasi ke Zoom & youtube Wildan CANS. (Start 13 Juni 2026)',
        duration: 120,
        total_questions: 3,
        status: 'inactive',
        category: 'Kelas Online',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        original_price: 300000,
        discount_percentage: 17,
        price: 250000
      }
    });

    const [tryout3] = await Tryout.findOrCreate({
      where: { title: 'BONUS DARI BUKU SKD Wildan CANS 2025' },
      defaults: {
        title: 'BONUS DARI BUKU SKD Wildan CANS 2025',
        description: 'PAKET INI KHUSUS UNTUK PEMILIK BUKU Wildan CANS SKD CPNS & KEDINASAN 2025.',
        duration: 100,
        total_questions: 1,
        status: 'active',
        category: 'E-Book',
        image_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800',
        original_price: 9999999,
        discount_percentage: 0,
        price: 9999999
      }
    });

    const [tryout4] = await Tryout.findOrCreate({
      where: { title: 'BUNDLING 3 TO SKD 2026 (PART 30, 31, 32)' },
      defaults: {
        title: 'BUNDLING 3 TO SKD 2026 (PART 30, 31, 32)',
        description: 'KEJAR SKD BUAT PEJUANG ASN! ✨ Berisi 3 Paket Try Out dengan soal HOTS berdasarkan pengalaman peserta SKD.',
        duration: 120,
        total_questions: 1,
        status: 'inactive',
        category: 'Bundling',
        image_url: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=800',
        original_price: 60000,
        discount_percentage: 75,
        price: 15000
      }
    });

    // 4. Seed Questions
    console.log('Seeding Questions...');
    
    // Clean old questions
    await Question.destroy({ where: { tryout_id: sampleTryout.id } });
    await Question.destroy({ where: { tryout_id: premiumTryout.id } });
    await Question.destroy({ where: { tryout_id: tryout3.id } });
    await Question.destroy({ where: { tryout_id: tryout4.id } });

    // ─── TRYOUT 1 (ACTIVE / SAMPLE) QUESTIONS ───
    
    // Soal 1: TWK (Nasionalisme - Era Digital)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: twkCat.id,
      question: 'Di era digital saat ini, penyebaran berita bohong (hoaks) dan propaganda di media sosial marak terjadi yang berpotensi memecah belah keharmonisan bangsa. Upaya yang mencerminkan rasa nasionalisme yang tepat dalam menyikapi fenomena ini adalah...',
      option_a: 'Membatasi akses internet secara nasional demi meredam isu provokatif.',
      option_b: 'Mempercayai seluruh informasi yang dibagikan oleh tokoh publik terkenal.',
      option_c: 'Melakukan verifikasi fakta secara mandiri sebelum membagikan informasi ke media sosial.',
      option_d: 'Mengabaikan setiap berita yang beredar agar tidak terpengaruh oleh isu sosial.',
      option_e: 'Melaporkan setiap pengguna yang berbeda pandangan politik ke pihak berwajib.',
      correct_answer: 'c',
      option_weights: null
    });

    // Soal 2: TWK (Integritas ASN)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: twkCat.id,
      question: 'Seorang ASN ditawari sejumlah uang oleh pihak rekanan (vendor) sebagai ucapan terima kasih karena proyek pengadaan barang berjalan lancar, tanpa memengaruhi objektivitas penilaian barang. Tindakan ASN yang paling berintegritas adalah...',
      option_a: 'Menerima uang tersebut karena proyek sudah selesai dan tidak ada manipulasi kualitas barang.',
      option_b: 'Menolak dengan sopan pemberian tersebut dan melaporkannya ke Unit Pengendalian Gratifikasi (UPG) instansi.',
      option_c: 'Menerima uang tersebut lalu menyumbangkannya ke panti asuhan agar bermanfaat bagi sesama.',
      option_d: 'Menolak uang tersebut tetapi meminta agar diganti dalam bentuk barang penunjang kerja kantor.',
      option_e: 'Menerima uang tersebut dengan syarat tidak ada orang lain di instansi yang mengetahuinya.',
      correct_answer: 'b',
      option_weights: null
    });

    // Soal 3: TWK (Pilar Negara - Sejarah)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: twkCat.id,
      question: 'Siapakah ketua Panitia Sembilan yang merumuskan Piagam Jakarta (Jakarta Charter) pada tanggal 22 Juni 1945?',
      option_a: 'Drs. Moh. Hatta',
      option_b: 'Ir. Soekarno',
      option_c: 'Mr. A.A. Maramis',
      option_d: 'Mr. Muhammad Yamin',
      option_e: 'K.H. Wachid Hasyim',
      correct_answer: 'b',
      option_weights: null
    });

    // Soal 4: TIU (Silogisme)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tiuCat.id,
      question: 'Semua ASN memiliki kartu identitas pegawai. Sebagian orang yang memiliki kartu identitas pegawai mendapatkan tunjangan kinerja bulanan. Kesimpulan yang paling tepat adalah...',
      option_a: 'Sebagian ASN mendapatkan tunjangan kinerja bulanan.',
      option_b: 'Semua ASN mendapatkan tunjangan kinerja bulanan.',
      option_c: 'Semua orang yang mendapatkan tunjangan kinerja bulanan adalah ASN.',
      option_d: 'Sebagian ASN tidak memiliki kartu identitas pegawai.',
      option_e: 'Tidak ada ASN yang mendapatkan tunjangan kinerja bulanan.',
      correct_answer: 'a',
      option_weights: null
    });

    // Soal 5: TIU (Deret Angka)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tiuCat.id,
      question: 'Tentukan angka berikutnya dari pola deret berikut: 1, 3, 6, 10, 15, ...',
      option_a: '19',
      option_b: '20',
      option_c: '21',
      option_d: '22',
      option_e: '25',
      correct_answer: 'c',
      option_weights: null
    });

    // Soal 6: TIU (Numerik Perbandingan)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tiuCat.id,
      question: 'Sebuah proyek pembangunan jembatan dapat diselesaikan oleh 12 pekerja dalam waktu 20 hari. Jika proyek tersebut ditargetkan selesai dalam 15 hari, jumlah pekerja tambahan yang harus direkrut adalah...',
      option_a: '3 orang',
      option_b: '4 orang',
      option_c: '6 orang',
      option_d: '8 orang',
      option_e: '16 orang',
      correct_answer: 'b',
      option_weights: null
    });

    // Soal 7: TKP (Profesionalisme)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tkpCat.id,
      question: 'Ketika Anda dihadapkan pada tumpukan tugas yang sangat banyak sedangkan waktu pengumpulan (deadline) sudah dekat, sikap profesional yang Anda ambil adalah...',
      option_a: 'Menyelesaikan seadanya yang penting selesai tepat waktu.',
      option_b: 'Menunda pekerjaan hingga mendekati batas waktu karena terbiasa bekerja di bawah tekanan.',
      option_c: 'Membuat skala prioritas, merencanakan jadwal kerja yang terukur, dan fokus menyelesaikannya satu per satu secara detail.',
      option_d: 'Membagi tugas tersebut dengan rekan kerja lain dan meminta bantuan mereka agar cepat selesai.',
      option_e: 'Mengeluhkan banyaknya tugas kepada atasan dan meminta kompensasi tambahan waktu.',
      correct_answer: 'c',
      option_weights: { a: 3, b: 1, c: 5, d: 4, e: 2 }
    });

    // Soal 8: TKP (Anti Radikalisme)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tkpCat.id,
      question: 'Anda melihat salah satu rekan kerja mulai sering membagikan konten di grup WhatsApp kantor yang cenderung menyebarkan narasi kebencian terhadap kelompok tertentu dan meragukan ideologi Pancasila. Sikap Anda menghadapi hal ini adalah...',
      option_a: 'Membiarkan hal tersebut selama tidak mengganggu kinerja kerja tim secara langsung.',
      option_b: 'Menegur rekan tersebut secara terbuka di dalam grup WhatsApp agar yang lain tidak menirunya.',
      option_c: 'Mengajak rekan tersebut berdiskusi secara personal, mengingatkannya tentang pentingnya menjaga kerukunan, serta melaporkannya ke atasan/pihak SDM jika perilaku tersebut berlanjut.',
      option_d: 'Ikut membagikan konten serupa agar tidak dikucilkan oleh rekan kerja tersebut.',
      option_e: 'Keluar dari grup WhatsApp kantor agar pikiran Anda tetap fokus pada pekerjaan saja.',
      correct_answer: 'c',
      option_weights: { a: 2, b: 3, c: 5, d: 1, e: 4 }
    });

    // Soal 9: TKP (Teknologi Informasi & Komunikasi)
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tkpCat.id,
      question: 'Instansi tempat Anda bekerja meluncurkan aplikasi pelayanan publik digital yang baru. Namun, banyak rekan kerja senior yang merasa kesulitan dan enggan menggunakannya karena terbiasa dengan metode manual. Sikap Anda adalah...',
      option_a: 'Tetap menggunakan metode manual demi menjaga hubungan baik dan kekompakan dengan senior.',
      option_b: 'Mempelajari sistem aplikasi baru secara mendiri dan menawarkan bantuan untuk membimbing rekan senior secara bertahap.',
      option_c: 'Mengusulkan kepada atasan untuk menunda penggunaan aplikasi baru agar pelayanan tidak terganggu.',
      option_d: 'Menggunakan aplikasi tersebut untuk tugas mandiri tanpa peduli dengan kendala rekan kerja yang lain.',
      option_e: 'Menyarankan rekan senior untuk segera mengajukan pensiun jika tidak mampu lagi beradaptasi dengan teknologi.',
      correct_answer: 'b',
      option_weights: { a: 2, b: 5, c: 1, d: 4, e: 3 }
    });


    // ─── TRYOUT 2 (PREMIUM) QUESTIONS ───
    
    // Soal 1: TWK Premium (Pilar Negara)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: twkCat.id,
      question: 'Pancasila sebagai dasar negara Republik Indonesia secara resmi disahkan oleh Panitia Persiapan Kemerdekaan Indonesia (PPKI) pada tanggal...',
      option_a: '17 Agustus 1945',
      option_b: '18 Agustus 1945',
      option_c: '1 Juni 1945',
      option_d: '22 Juni 1945',
      option_e: '17 Agustus 1950',
      correct_answer: 'b',
      option_weights: null
    });

    // Soal 2: TWK Premium (Bela Negara Modern)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: twkCat.id,
      question: 'Keikutsertaan warga negara dalam upaya pembelaan negara yang paling mendasar di era modern saat ini dapat diwujudkan melalui...',
      option_a: 'Mengikuti pelatihan militer sukarela secara intensif.',
      option_b: 'Melakukan demonstrasi massa untuk mengkritik kebijakan luar negeri pemerintah.',
      option_c: 'Mengabdi secara tulus dan profesional sesuai bidang keahlian demi kemajuan bangsa.',
      option_d: 'Menggunakan produk buatan luar negeri untuk menunjang gaya hidup modern.',
      option_e: 'Mengisolasi diri dari perkembangan teknologi global demi melindungi identitas budaya.',
      correct_answer: 'c',
      option_weights: null
    });

    // Soal 3: TIU Premium (Aljabar Kuantitatif)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tiuCat.id,
      question: 'Jika diketahui persamaan 3a + 4b = 17 dan 2a - b = 4, maka nilai dari operasi a - b adalah...',
      option_a: '1',
      option_b: '2',
      option_c: '3',
      option_d: '-1',
      option_e: '0',
      correct_answer: 'a',
      option_weights: null
    });

    // Soal 4: TIU Premium (Kecepatan & Jarak Berpapasan)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tiuCat.id,
      question: 'Andi berkendara dari kota A ke kota B dengan kecepatan rata-rata 60 km/jam. Pada saat yang sama Budi berkendara dari kota B ke kota A dengan kecepatan rata-rata 40 km/jam. Jika jarak kota A ke kota B adalah 150 km, menit ke berapakah mereka akan saling berpapasan?',
      option_a: '60 menit',
      option_b: '75 menit',
      option_c: '90 menit',
      option_d: '100 menit',
      option_e: '120 menit',
      correct_answer: 'c',
      option_weights: null
    });

    // Soal 5: TIU Premium (Analitis Permutasi Siklis)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tiuCat.id,
      question: 'Lima orang anak (A, B, C, D, E) duduk melingkar di sebuah meja bundar. Jika posisi duduk anak A harus selalu bersebelahan dengan anak B, berapa banyak variasi konfigurasi posisi duduk berbeda yang dapat mereka bentuk?',
      option_a: '6 posisi',
      option_b: '12 posisi',
      option_c: '24 posisi',
      option_d: '48 posisi',
      option_e: '120 posisi',
      correct_answer: 'b',
      option_weights: null
    });

    // Soal 6: TKP Premium (Jejaring Kerja / Konflik Tim)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tkpCat.id,
      question: 'Terjadi perselisihan paham antara dua rekan kerja di bawah proyek yang Anda pimpin. Hal ini menyebabkan komunikasi kerja terganggu dan proyek mulai mengalami kelambatan. Tindakan Anda selaku pimpinan adalah...',
      option_a: 'Mengeluarkan kedua anggota tersebut dari tim proyek agar tidak mengganggu anggota lain.',
      option_b: 'Membiarkan mereka menyelesaikan masalah pribadi sendiri demi kedewasaan kerja.',
      option_c: 'Memanggil keduanya secara persuasif, mendengarkan argumen masing-masing secara objektif, lalu membantu memediasi solusi yang disepakati bersama.',
      option_d: 'Memihak kepada rekan kerja yang memiliki rekam jejak kerja paling produktif.',
      option_e: 'Mengambil alih seluruh pekerjaan mereka agar proyek selesai tepat waktu tanpa ketergantungan.',
      correct_answer: 'c',
      option_weights: { a: 2, b: 3, c: 5, d: 1, e: 4 }
    });

    // Soal 7: TKP Premium (Sosial Budaya)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tkpCat.id,
      question: 'Anda ditempatkan bertugas di wilayah pedalaman yang kental dengan adat istiadat tradisional. Banyak warga lokal enggan pergi ke puskesmas karena lebih mempercayai pengobatan dukun adat. Sikap Anda menghadapi hal ini adalah...',
      option_a: 'Menolak memberikan layanan kesehatan kepada warga yang kedapatan berobat ke dukun adat.',
      option_b: 'Menjalin koordinasi persuasif dengan tokoh adat dan dukun adat untuk berkolaborasi mensosialisasikan pentingnya medis modern.',
      option_c: 'Memaksa warga datang ke puskesmas dengan ancaman denda administratif dari instansi daerah.',
      option_d: 'Mengajukan surat pemindahan tugas ke daerah perkotaan yang masyarakatnya lebih modern.',
      option_e: 'Mengabaikan adat setempat dan hanya melayani seadanya warga lokal yang sukarela datang saja.',
      correct_answer: 'b',
      option_weights: { a: 2, b: 5, c: 3, d: 1, e: 4 }
    });

    // Soal 8: TKP Premium (Anti Radikalisme - Isu SARA)
    await Question.create({
      tryout_id: premiumTryout.id,
      category_id: tkpCat.id,
      question: 'Rekan kerja Anda secara pribadi membisikkan isu miring bernada SARA yang memojokkan kelompok tertentu di divisi sebelah. Sikap Anda menghadapi hal ini adalah...',
      option_a: 'Ikut membicarakan isu tersebut dengan rekan kerja lainnya agar terkesan akrab.',
      option_b: 'Menolak mentah-mentah secara kasar dan menjauhi rekan tersebut secara sepihak.',
      option_c: 'Mendengarkan secara tenang tanpa terprovokasi, meluruskan informasi berdasarkan fakta objektif, dan menasehatinya secara baik-baik agar tidak memicu polarisasi.',
      option_d: 'Melaporkan langsung rekan tersebut kepada kepolisian atas dugaan ujaran kebencian.',
      option_e: 'Mengangguk setuju saja demi menghindari konflik perdebatan berkepanjangan dengan rekan kerja.',
      correct_answer: 'c',
      option_weights: { a: 1, b: 3, c: 5, d: 2, e: 4 }
    });

    // Seed questions for tryout3
    await Question.create({
      tryout_id: tryout3.id,
      category_id: twkCat.id,
      question: 'Apa nama lambang sila ke-3 dalam Pancasila?',
      option_a: 'Bintang',
      option_b: 'Rantai',
      option_c: 'Pohon Beringin',
      option_d: 'Kepala Banteng',
      option_e: 'Padi dan Kapas',
      correct_answer: 'c',
      option_weights: null
    });

    // Seed questions for tryout4
    await Question.create({
      tryout_id: tryout4.id,
      category_id: tiuCat.id,
      question: 'Jika x = 5 dan y = 3, maka nilai dari 2x + 3y adalah...',
      option_a: '15',
      option_b: '19',
      option_c: '20',
      option_d: '25',
      option_e: '30',
      correct_answer: 'b',
      option_weights: null
    });

    // Update total_questions cache
    const count1 = await Question.count({ where: { tryout_id: sampleTryout.id } });
    sampleTryout.total_questions = count1;
    await sampleTryout.save();

    const count2 = await Question.count({ where: { tryout_id: premiumTryout.id } });
    premiumTryout.total_questions = count2;
    await premiumTryout.save();

    const count3 = await Question.count({ where: { tryout_id: tryout3.id } });
    tryout3.total_questions = count3;
    await tryout3.save();

    const count4 = await Question.count({ where: { tryout_id: tryout4.id } });
    tryout4.total_questions = count4;
    await tryout4.save();

    console.log('Seeding Referral Codes...');
    await ReferralCode.findOrCreate({
      where: { code: 'WILDANCASN10' },
      defaults: {
        code: 'WILDANCASN10',
        discount_percentage: 10,
        is_active: true,
        usage_count: 0
      }
    });

    await ReferralCode.findOrCreate({
      where: { code: 'LULUS10' },
      defaults: {
        code: 'LULUS10',
        discount_percentage: 10,
        is_active: true,
        usage_count: 0
      }
    });
    console.log('Referral Codes seeded.');

    console.log('All packages and questions seeded successfully.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
