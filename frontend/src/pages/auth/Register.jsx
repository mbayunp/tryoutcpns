import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { AlertCircle, Eye, EyeOff, ShieldCheck, BarChart3, ArrowLeft, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: 'bg-slate-200', width: 'w-0' };
  const hasNum = /\d/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const len = pass.length;

  if (len >= 8 && hasNum && hasUpper) {
    return { score: 3, label: 'Kuat', color: 'bg-emerald-500', width: 'w-full' };
  }
  if (len >= 6 && hasNum) {
    return { score: 2, label: 'Sedang', color: 'bg-amber-500', width: 'w-2/3' };
  }
  return { score: 1, label: 'Lemah', color: 'bg-rose-500', width: 'w-1/3' };
};

export default function Register() {
  const navigate = useNavigate();
  const register = useExamStore((state) => state.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Anti-spam Math CAPTCHA
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaNum1(num1);
    setCaptchaNum2(num2);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Harap isi semua kolom formulir.');
      return;
    }
    if (phoneNumber.length < 8 || phoneNumber.length > 20) {
      setError('Nomor telepon harus antara 8 sampai 20 karakter.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // CAPTCHA verification
    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaInput) !== expected) {
      setError('Jawaban verifikasi keamanan (CAPTCHA) salah. Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(name, email, password, phoneNumber);
      // Automatically logs in and routes to program selection
      navigate('/program-selection');
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Email mungkin sudah digunakan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">

      {/* ─── KIRI: BRANDING & ILUSTRASI ─── */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-700 to-blue-900 overflow-hidden items-center justify-center p-20">
        {/* Dekorasi Latar */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

        <div className="relative z-10 text-white w-full max-w-lg">
          <h1 className="text-4xl font-extrabold mb-6 leading-tight tracking-tight">
            Mulai Langkah<br />Sukses Anda
          </h1>
          <p className="text-lg mb-12 text-blue-100 leading-relaxed font-medium">
            Gabung bersama ribuan calon ASN lainnya. Buat akun sekarang untuk langsung mengikuti simulasi tryout CPNS CAT terupdate.
          </p>

          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <ShieldCheck className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Akun Terintegrasi</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Satu akun untuk semua fitur simulasi.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <BarChart3 className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Rekomendasi Cerdas</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Statistik performa belajar personal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KANAN: FORM REGISTRASI ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        {/* Container Form */}
        <div className="w-full max-w-[400px] space-y-6">

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors border-0 bg-transparent cursor-pointer p-0 animate-fadeIn"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Halaman Masuk</span>
          </button>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Daftar Akun Baru</h2>
            <p className="text-sm text-slate-500 font-medium">Buat akun untuk memulai belajar anda</p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-50 ring-1 ring-red-200 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Nama Lengkap Anda"
                required
                className="w-full h-11"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="nama@email.com"
                required
                className="w-full h-11"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp</label>
              <Input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                placeholder="Contoh: 081234567890"
                required
                className="w-full h-11"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none border-0 bg-transparent cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Strength Visualizer */}
              {password && (
                <div className="space-y-1.5 pt-1.5 animate-fadeIn">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrength(password).color} ${getPasswordStrength(password).width}`}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Kekuatan Sandi:</span>
                    <span className={
                      getPasswordStrength(password).score === 3 ? 'text-emerald-600 animate-pulse' :
                        getPasswordStrength(password).score === 2 ? 'text-amber-600' :
                          'text-rose-600'
                    }>
                      {getPasswordStrength(password).label}
                    </span>
                  </div>
                </div>
              )}

              {/* Password Criteria Checklist */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] font-bold">
                <div className={`flex items-center gap-1 transition-colors duration-200 ${password.length >= 6 ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                  <Check className="h-3.5 w-3.5" />
                  <span>Minimal 6 karakter</span>
                </div>
                <div className={`flex items-center gap-1 transition-colors duration-200 ${(/[a-zA-Z]/.test(password) && /\d/.test(password)) ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                  <Check className="h-3.5 w-3.5" />
                  <span>Mengandung huruf & angka</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Ulangi kata sandi"
                  required
                  className="w-full h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none border-0 bg-transparent cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Math Captcha / Spam Prevention */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl animate-fadeIn">
              <label className="text-[11px] font-bold text-slate-600 block">
                Verifikasi Keamanan (Anti-Spam)
              </label>
              <div className="flex items-center gap-3">
                <div className="bg-slate-200 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-extrabold text-slate-700 tracking-wider select-none">
                  {captchaNum1} + {captchaNum2} =
                </div>
                <Input
                  type="number"
                  id="captcha"
                  value={captchaInput}
                  onChange={(e) => { setCaptchaInput(e.target.value); setError(''); }}
                  placeholder="?"
                  required
                  className="w-16 text-center font-bold text-sm h-9"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline bg-transparent border-0 cursor-pointer focus:outline-none"
                >
                  Ganti soal
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-3 border-0"
            >
              {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 pt-2">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition-colors border-0 bg-transparent cursor-pointer"
            >
              Masuk disini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
