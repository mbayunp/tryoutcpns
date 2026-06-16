import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import { Award, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const login = useExamStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan kata sandi Anda.');
      return;
    }
    login(email);

    const isAdmin = email.toLowerCase() === 'admin@cpnstryout.id';
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleFillDemoUser = () => {
    setEmail('peserta.cpns@gmail.com');
    setPassword('cpnslolos2026');
    setError('');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@cpnstryout.id');
    setPassword('adminlolos2026');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-white/10 shadow-premium-lg p-7 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali
      </Link>

      {/* Brand */}
      <div className="text-center space-y-3">
        <div className="bg-slate-900 text-white p-3 rounded-2xl w-fit mx-auto shadow-premium">
          <Award className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Masuk ke Akun</h2>
          <p className="text-xs text-slate-400 mt-1">Gunakan email pendaftaran simulasi CAT Anda</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 ring-1 ring-red-100 text-red-600 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="nama@email.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all duration-200"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
            <a href="#forgot-password" className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">Lupa?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all duration-200"
          />
        </div>

        <Button type="submit" className="w-full py-3" variant="primary">
          Masuk
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="p-3.5 bg-slate-50 rounded-xl ring-1 ring-slate-100 space-y-2.5 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Akun Demo</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleFillDemoUser}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg ring-1 ring-slate-200/60 hover:ring-slate-300 transition-all duration-200 active:scale-[0.97]"
          >
            Peserta
          </button>
          <button
            onClick={handleFillDemoAdmin}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg ring-1 ring-slate-200/60 hover:ring-slate-300 transition-all duration-200 active:scale-[0.97]"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Sign up */}
      <div className="text-center text-xs pt-2 border-t border-slate-100">
        <span className="text-slate-400">Belum punya akun? </span>
        <button onClick={handleFillDemoUser} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Daftar
        </button>
      </div>
    </div>
  );
}
