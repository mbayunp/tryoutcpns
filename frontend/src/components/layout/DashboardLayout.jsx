import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import {
  LayoutDashboard,
  FileText,
  History,
  User as UserIcon,
  Trophy,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, activeTab, setActiveTab } = useExamStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Command+K or Control+K focus search listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    { id: 'ranking', name: 'Ranking', icon: <Trophy className="h-[18px] w-[18px]" /> },
    { id: 'profil', name: 'Profil', icon: <UserIcon className="h-[18px] w-[18px]" /> },
  ];

  const renderSidebarContent = (isMobile = false) => {
    const collapsed = !isMobile && isSidebarCollapsed;
    return (
      <div className="flex flex-col justify-between h-full bg-white border-r border-slate-200/60 py-5 transition-all duration-300">
        <div className="space-y-6">
          {/* Brand Logo & Collapse toggle */}
          <div className={`px-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed ? (
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                  <img src="/logo.jpg" alt="Logo WILDAN CASN" className="h-6 w-6 object-cover rounded-md" />
                </div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight whitespace-nowrap">
                  WILDAN<span className="text-[#0B1C30]"> CASN</span>
                </span>
              </Link>
            ) : (
              <Link to="/" className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm block">
                <img src="/logo.jpg" alt="Logo WILDAN CASN" className="h-6 w-6 object-cover rounded-md" />
              </Link>
            )}

            {/* Desktop toggle button */}
            {!isMobile && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            )}

            {/* Mobile close button */}
            {isMobile && (
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* User profile card */}
          <div className="px-3">
            <div className={`bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="h-9 w-9 bg-[#0B1C30] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
                {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                  <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user.avatar || 'CP'
                )}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <h5 className="text-sm font-bold text-slate-800 truncate">{user.name}</h5>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {user.role === 'admin' ? 'Administrator' : 'Peserta'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-0.5">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
            )}
            {menuItems.map((item) => {
              const isDashboardRoute = location.pathname === '/dashboard';
              const isActive = isDashboardRoute && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0B1C30] text-white shadow-premium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B1C30]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </button>
              );
            })}

            {user.role === 'admin' && (
              <>
                <div className="border-t border-slate-100 my-2" />
                {!collapsed && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Admin</p>
                )}
                <button
                  onClick={handleAdminClick}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    location.pathname === '/admin'
                      ? 'bg-[#0B1C30] text-white shadow-premium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B1C30]'
                  }`}
                  title={collapsed ? 'Kelola Soal' : undefined}
                >
                  <div className="flex-shrink-0"><ShieldAlert className="h-[18px] w-[18px]" /></div>
                  {!collapsed && <span className="whitespace-nowrap">Kelola Soal</span>}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-3">
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-650 transition-all duration-200`}
            title={collapsed ? "Keluar" : undefined}
          >
            <div className="flex-shrink-0"><LogOut className="h-[18px] w-[18px]" /></div>
            {!collapsed && <span className="whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:block h-screen sticky top-0 flex-shrink-0 z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-60'
      }`}>
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile sidebar drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden transition-transform duration-300 ease-out`}>
        {renderSidebarContent(true)}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified Header / Topbar */}
        <header className="bg-white border-b border-slate-200/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-25 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          {/* Left: Menu trigger on Mobile, Search bar on Desktop */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-550 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight flex md:hidden items-center gap-1.5">
              <img src="/logo.jpg" alt="Logo" className="h-5 w-5 object-cover rounded-md" />
              <span>WILDAN<span className="text-[#0B1C30]"> CASN</span></span>
            </span>

            {/* Global Search Bar (Desktop) */}
            <div className="hidden md:flex items-center w-80 relative">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari soal, paket... (Cmd+K)"
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-200/40 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Right: Notification bell & User details */}
          <div className="flex items-center gap-3.5">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition-all duration-200">
              <Bell className="h-4.5 w-4.5" />
              {/* Pulsing indicator red dot */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
              </span>
            </button>

            {/* Profile Avatar & Details block (Desktop) */}
            <div className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3.5 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</p>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wide">{user.role === 'admin' ? 'Admin' : 'Peserta'}</p>
              </div>
              <div className="h-8 w-8 bg-[#0B1C30] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
                {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                  <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user.avatar || 'CP'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* View Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
