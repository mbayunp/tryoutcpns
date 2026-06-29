import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { Eye, EyeOff, ShieldCheck, BarChart3 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SEO from '../../components/common/SEO';

export default function Login() {
  const navigate = useNavigate();
  const login = useExamStore((state) => state.login);
  // const loginWithGoogle = useExamStore((state) => state.loginWithGoogle);
  // const forgotPassword = useExamStore((state) => state.forgotPassword);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /*
  const handleGoogleLoginCallback = useCallback(async (response) => {
    try {
      setError('');
      Swal.fire({
        title: 'Menghubungkan...',
        text: 'Sedang masuk dengan akun Google Anda.',
        allowOutsideClick: false,per
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
  */

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
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Harap isi email dan kata sandi Anda.',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#ef4444',
      });
      return;
    }
    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/program-selection');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Email atau password salah!';
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: errorMessage,
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <SEO title="Masuk" />

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


          {/* Form Input */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mt-2"
            >
              {isLoading ? 'Memproses...' : 'Masuk Ke Dashboard'}
            </Button>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-555">Atau masuk dengan</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-3 px-4 py-2 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  // onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
            */}
          </form>


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