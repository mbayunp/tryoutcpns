import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { AlertCircle, Eye, EyeOff, ShieldCheck, BarChart3, Key } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Swal from 'sweetalert2';

export default function Login() {
  const navigate = useNavigate();
  const login = useExamStore((state) => state.login);
  const loginWithGoogle = useExamStore((state) => state.loginWithGoogle);
  // const forgotPassword = useExamStore((state) => state.forgotPassword);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLoginCallback = useCallback(async (response) => {
    try {
      setError('');
      Swal.fire({
        title: 'Menghubungkan...',
        text: 'Sedang masuk dengan akun Google Anda.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const loggedUser = await loginWithGoogle(response.credential);
      Swal.close();

      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/program-selection');
      }
    } catch (err) {
      Swal.close();
      setError(err.message || 'Login Google gagal.');
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "1036814674751-nsc1h2b04tqerhpt6f4ebt9kdfuibsh3.apps.googleusercontent.com", // Google Client ID
          callback: handleGoogleLoginCallback
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "outline",
            size: "large",
            width: 352,
            text: "signin_with",
            shape: "rectangular"
          }
        );
      }
    };

    initGoogle();

    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.addEventListener('load', initGoogle);
    }
    return () => {
      if (script) script.removeEventListener('load', initGoogle);
    };
  }, [handleGoogleLoginCallback]);

  /*
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { value: targetEmail } = await Swal.fire({
      title: 'Lupa Kata Sandi',
      text: 'Masukkan alamat email Anda untuk menerima tautan atur ulang kata sandi.',
      input: 'email',
      inputPlaceholder: 'nama@email.com',
      showCancelButton: true,
      confirmButtonText: 'Kirim Link Reset',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Alamat email wajib diisi!';
        }
      }
    });

    if (targetEmail) {
      Swal.fire({
        title: 'Mengirim...',
        text: 'Sedang memproses pengiriman email.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await forgotPassword(targetEmail);
        Swal.fire({
          title: 'Email Terkirim!',
          text: 'Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda. Silakan cek kotak masuk atau folder spam Anda.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        });
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: err.message || 'Gagal mengirim email reset.',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        });
      }
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan kata sandi Anda.');
      return;
    }
    setError('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/program-selection');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Email atau kata sandi tidak valid.');
    }
  };

  const handleFillDemoUser = () => {
    setEmail('user@wildan.com');
    setPassword('user123');
    setError('');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@wildan.com');
    setPassword('admin123');
    setError('');
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
            Wujudkan Impian<br />Menjadi ASN
          </h1>
          <p className="text-lg mb-12 text-blue-100 leading-relaxed font-medium">
            Platform persiapan CPNS paling komprehensif dengan simulasi CAT real-time, pembahasan mendalam, dan kurikulum yang selalu terupdate.
          </p>

          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <ShieldCheck className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Materi Terverifikasi</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Sesuai kisi-kisi terbaru standar BKN.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
              <BarChart3 className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Analisis Detail</h3>
                <p className="text-xs text-blue-200 leading-relaxed">Pantau progres & evaluasi kelemahan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KANAN: FORM LOGIN ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        {/* Container Form (Diperlebar menjadi max-w-[400px]) */}
        <div className="w-full max-w-[400px] space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-slate-500 font-medium">Masuk ke akun Anda untuk melanjutkan persiapan.</p>
          </div>

          {/* Tombol Demo Cepat */}
          <button
            onClick={handleFillDemoUser}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 active:scale-[0.98] shadow-sm font-bold text-sm"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Masuk Cepat (Demo Peserta)</span>
          </button>

          {/* Google Sign In Button */}
          <div className="space-y-3 flex flex-col items-center justify-center">
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Atau dengan Email</span>
            <div className="flex-grow border-t border-slate-200"></div>
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="nama@email.com"
                required
                className="w-full h-12"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer transition-colors" type="checkbox" />
                <span className="text-slate-500 group-hover:text-slate-800 transition-colors">Ingat saya</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:text-blue-800 transition-colors border-0 bg-transparent cursor-pointer font-semibold"
              >
                Lupa sandi?
              </button>
            </div>

            <Button variant="primary" type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-2">
              Masuk Ke Dashboard
            </Button>
          </form>

          {/* Kotak Akun Demo Alternatif */}
          <Card className="p-5 bg-slate-50/50 border border-slate-200/60 flex flex-col gap-3 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Akses Cepat Penguji</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleFillDemoUser}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-white py-2.5 px-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 active:scale-[0.97]"
              >
                Isi Akun Peserta
              </button>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-white py-2.5 px-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 active:scale-[0.97]"
              >
                Isi Akun Admin
              </button>
            </div>
          </Card>

          <p className="text-center text-sm font-medium text-slate-500">
            Belum punya akun?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition-colors border-0 bg-transparent cursor-pointer">
              Daftar gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}