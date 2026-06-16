const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Tryout, Question } = require('../models');

const seed = async () => {
  try {
    // Authenticate and sync
    await sequelize.authenticate();
    console.log('Database connected. Starting seeding...');

    // Synchronize models
    await sequelize.sync({ alter: true });

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

    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@wildan.com' },
      defaults: {
        name: 'Admin Wildan',
        email: 'admin@wildan.com',
        password: adminPassword,
        role: 'admin',
        is_active: true
      }
    });

    const [regularUser] = await User.findOrCreate({
      where: { email: 'user@wildan.com' },
      defaults: {
        name: 'Candidate User',
        email: 'user@wildan.com',
        password: userPassword,
        role: 'user',
        is_active: true
      }
    });

    console.log('Users seeded: admin@wildan.com, user@wildan.com.');

    // 3. Seed Sample Tryout
    console.log('Seeding Sample Tryout...');
    const [sampleTryout] = await Tryout.findOrCreate({
      where: { title: 'Tryout Akbar CPNS 2026' },
      defaults: {
        title: 'Tryout Akbar CPNS 2026',
        description: 'Paket simulasi ujian CPNS SKD yang terdiri dari TWK, TIU, dan TKP.',
        duration: 100, // 100 minutes
        total_questions: 3,
        status: 'active'
      }
    });

    // 4. Seed Questions
    console.log('Seeding Questions...');
    
    // Clean old sample questions if any
    await Question.destroy({ where: { tryout_id: sampleTryout.id } });

    // Question 1: TWK
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: twkCat.id,
      question: 'Lagu kebangsaan Indonesia Raya diciptakan oleh...',
      option_a: 'W.R. Supratman',
      option_b: 'Kusbini',
      option_c: 'Ibu Soed',
      option_d: 'Ismail Marzuki',
      option_e: 'C. Simanjuntak',
      correct_answer: 'a',
      option_weights: null
    });

    // Question 2: TIU
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tiuCat.id,
      question: 'Tentukan suku berikutnya dari deret: 1, 3, 6, 10, 15, ...',
      option_a: '19',
      option_b: '20',
      option_c: '21',
      option_d: '22',
      option_e: '25',
      correct_answer: 'c',
      option_weights: null
    });

    // Question 3: TKP
    await Question.create({
      tryout_id: sampleTryout.id,
      category_id: tkpCat.id,
      question: 'Ketika Anda menghadapi tugas yang sangat menumpuk dan mendekati batas waktu (deadline), sikap Anda adalah...',
      option_a: 'Menyelesaikan seadanya yang penting selesai tepat waktu.',
      option_b: 'Menunda-nunda pekerjaan hingga mendekati hari akhir karena terbiasa bekerja di bawah tekanan.',
      option_c: 'Membuat skala prioritas, merencanakan jadwal kerja, dan fokus menyelesaikan satu per satu secara detail.',
      option_d: 'Membagi tugas dengan rekan kerja lain dan meminta bantuan mereka agar cepat beres.',
      option_e: 'Mengeluhkan banyaknya pekerjaan kepada atasan dan meminta tambahan waktu pengerjaan.',
      correct_answer: 'c',
      option_weights: {
        a: 3,
        b: 1,
        c: 5,
        d: 4,
        e: 2
      }
    });

    // Update total_questions cache
    const count = await Question.count({ where: { tryout_id: sampleTryout.id } });
    sampleTryout.total_questions = count;
    await sampleTryout.save();

    console.log('Sample Questions seeded successfully.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
