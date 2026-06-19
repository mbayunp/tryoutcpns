import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Swal from 'sweetalert2';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const resetPassword = useExamStore((state) => state.resetPassword);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Tautan atur ulang kata sandi tidak valid atau tidak memiliki token.');
      Swal.fire({
        title: 'Error!',
        text: 'Token atur ulang kata sandi tidak ditemukan.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Tautan atur ulang kata sandi tidak valid.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Harap isi semua kolom formulir.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi baru harus minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Kata sandi Anda telah berhasil diperbarui. Silakan login dengan kata sandi baru Anda.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      setError(err.message || 'Gagal mengatur ulang kata sandi.');
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Terjadi kesalahan saat mengatur ulang kata sandi.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* ─── KIRI: BRANDING & ILUSTRASI ─── */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-700 to-blue-900 overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

        <div className="relative z-10 text-white w-full max-w-lg text-center">
          <KeyRound className="h-20 w-20 text-blue-300 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl font-extrabold mb-6 leading-tight tracking-tight">
            Amankan Akun Anda
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed font-medium">
            Atur ulang kata sandi Anda untuk memastikan keamanan akses tryout CPNS CAT di platform WILDAN CASN.
          </p>
        </div>
      </div>

      {/* ─── KANAN: FORM RESET ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Kata Sandi Baru</h2>
            <p className="text-sm text-slate-500 font-medium">Masukkan kata sandi baru Anda untuk memulihkan akses.</p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-50 ring-1 ring-red-200 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Minimal 6 karakter"
                  required
                  disabled={!token || loading}
                  className="w-full h-12 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
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
                  disabled={!token || loading}
                  className="w-full h-12 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={!token || loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-2"
            >
              {loading ? 'Mengatur Ulang...' : 'Simpan Kata Sandi'}
            </Button>
          </form>
          
          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-all duration-200 active:scale-[0.95]"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
