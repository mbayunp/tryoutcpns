import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  Award,
  LayoutDashboard,
  FileText,
  History,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, activeTab, setActiveTab } = useExamStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    navigate('/dashboard');
  };

  const handleAdminClick = () => {
    setMobileOpen(false);
    navigate('/admin');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { id: 'tryout', name: 'Try Out', icon: <FileText className="h-[18px] w-[18px]" /> },
    { id: 'riwayat', name: 'Riwayat', icon: <History className="h-[18px] w-[18px]" /> },
    { id: 'profil', name: 'Profil', icon: <UserIcon className="h-[18px] w-[18px]" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-white border-r border-slate-200/60 py-5">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Award className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              CPNS<span className="text-blue-600">TryOut</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User card */}
        <div className="px-3">
          <div className="bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
              {user.avatar || 'CP'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-sm font-bold text-slate-800 truncate">{user.name}</h5>
              <span className="text-[10px] text-slate-400 font-semibold">
                {user.role === 'admin' ? 'Administrator' : 'Peserta'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
          {menuItems.map((item) => {
            const isDashboardRoute = location.pathname === '/dashboard';
            const isActive = isDashboardRoute && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-premium'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}

          {user.role === 'admin' && (
            <>
              <div className="border-t border-slate-100 my-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Admin</p>
              <button
                onClick={handleAdminClick}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  location.pathname === '/admin'
                    ? 'bg-slate-900 text-white shadow-premium'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <ShieldAlert className="h-[18px] w-[18px]" />
                <span>Kelola Soal</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-3">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden transition-transform duration-300 ease-out`}>
        {sidebarContent}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">
            CPNS<span className="text-blue-600">TryOut</span>
          </span>
          <div className="h-8 w-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-[10px]">
            {user.avatar || 'CP'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
