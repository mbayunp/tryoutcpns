const express = require('express');
const cors = require('cors');
const path = require('path');
const corsConfig = require('./config/cors');
const errorMiddleware = require('./middlewares/errorMiddleware');
const response = require('./utils/response');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');
const tryoutRoutes = require('./routes/tryoutRoutes');
const resultRoutes = require('./routes/resultRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');

const app = express();

// Konfigurasi agar Express mempercayai IP yang diteruskan oleh Nginx
// Ini akan menghilangkan error 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR' pada express-rate-limit
app.set('trust proxy', 1);

// Global Middlewares
app.use(cors(corsConfig));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Default Root Route
app.get('/', (req, res) => {
  return response.success(res, {
    app: "CPNS Tryout API Service",
    version: "1.0.0",
    status: "healthy"
  }, "Welcome to CPNS Tryout API Service");
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tryouts', tryoutRoutes);
app.use('/api/packages', tryoutRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin/referrals', referralRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Catch 404 Route Not Found (Anti-Crash untuk Bot Scanner)
app.use((req, res, next) => {
  // Langsung kembalikan response JSON tanpa membuat objek Error yang memberatkan server
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;