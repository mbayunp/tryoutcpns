import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, ShieldCheck, BarChart3, ArrowLeft, CheckCircle2, KeyRound, Smartphone } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import API from '../../utils/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // Flow steps: 1 (Email), 2 (Phone), 3 (New Password), 4 (Success)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Harap masukkan alamat email Anda.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password/check-email', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Email tidak terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Harap masukkan nomor telepon konfirmasi.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password/verify-phone', { email, phone_number: phoneNumber });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Nomor telepon konfirmasi salah.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Harap isi semua kolom kata sandi.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Kata sandi baru harus minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password/reset', {
        email,
        phone_number: phoneNumber,
        new_password: newPassword
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mereset kata sandi. Silakan coba lagi.');
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
            Pemulihan Akun<br />Lebih Aman
          </h1>
          <p className="text-lg mb-12 text-blue-100 leading-relaxed font-medium">
            Sistem pemulihan kata sandi instan menggunakan verifikasi nomor telepon yang terdaftar di akun Anda.
          </p>
          
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <KeyRound className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Tanpa Link Email</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Reset sandi instan langsung di halaman ini.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <Smartphone className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Verifikasi Ponsel</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Cukup konfirmasi no HP/WhatsApp terdaftar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KANAN: FORM WIZARD ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-6">
          
          {step < 4 && (
            <button 
              type="button" 
              onClick={() => {
                if (step === 1) navigate('/login');
                else setStep(step - 1);
              }} 
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors border-0 bg-transparent cursor-pointer p-0 animate-fadeIn"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{step === 1 ? 'Kembali ke Halaman Masuk' : 'Kembali ke Langkah Sebelumnya'}</span>
            </button>
          )}

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Lupa Kata Sandi</h2>
            {step < 4 && (
              <div className="text-xs font-bold text-blue-600 bg-blue-50 ring-1 ring-blue-100 px-3 py-1.5 rounded-lg inline-block mb-3">
                Langkah {step} dari 3: {step === 1 ? 'Cari Email' : step === 2 ? 'Verifikasi HP' : 'Ubah Sandi'}
              </div>
            )}
            <p className="text-sm text-slate-500 font-medium">
              {step === 1 && 'Masukkan alamat email terdaftar untuk mencari akun Anda.'}
              {step === 2 && 'Email ditemukan! Masukkan nomor telepon terdaftar untuk konfirmasi.'}
              {step === 3 && 'Langkah terakhir, masukkan kata sandi baru Anda.'}
              {step === 4 && 'Akun Anda telah berhasil dipulihkan.'}
            </p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-50 ring-1 ring-red-200 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: INPUT EMAIL */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
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

              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-3 border-0"
              >
                {loading ? 'Mencari Akun...' : 'Cari Email'}
              </Button>
            </form>
          )}

          {/* STEP 2: VERIFIKASI TELEPON */}
          {step === 2 && (
            <form className="space-y-4" onSubmit={handlePhoneSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 font-mono text-blue-600 mb-1 block">Akun: {email}</label>
                <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp Konfirmasi</label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                  placeholder="Masukkan nomor telepon terdaftar"
                  required
                  className="w-full h-11"
                />
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-3 border-0"
              >
                {loading ? 'Memverifikasi...' : 'Konfirmasi Nomor Telepon'}
              </Button>
            </form>
          )}

          {/* STEP 3: INPUT KATA SANDI BARU */}
          {step === 3 && (
            <form className="space-y-4" onSubmit={handlePasswordResetSubmit}>
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
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
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Ulangi kata sandi baru"
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

              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-3 border-0"
              >
                {loading ? 'Memperbarui Sandi...' : 'Ubah Kata Sandi'}
              </Button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fadeIn py-4">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 shadow-md">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Kata Sandi Berhasil Diubah!</h3>
                <p className="text-sm text-slate-500 font-medium">
                  Selamat, kata sandi Anda telah berhasil diperbarui. Silakan gunakan kata sandi baru untuk masuk ke dashboard.
                </p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200 border-0"
              >
                Masuk Sekarang
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
