import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useExamStore } from '../../store/useExamStore';
import Swal from 'sweetalert2';
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
  Bell,
  Megaphone,
  Clock,
  ExternalLink,
  Package,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, activeTab, setActiveTab, notifications, fetchNotifications } = useExamStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPaketOpen, setIsPaketOpen] = useState(false);

  useEffect(() => {
    if (activeTab && (activeTab === 'paket' || activeTab.startsWith('paket-'))) {
      setIsPaketOpen(true);
    }
  }, [activeTab]);

  // Notification dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('read_notifications') || '[]');
    } catch {
      return [];
    }
  });
  
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Click outside to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = (notifications || []).filter(
    (n) => !readNotifications.includes(n.id)
  );
  const unreadCount = unreadNotifications.length;

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    const allIds = (notifications || []).map(n => n.id);
    localStorage.setItem('read_notifications', JSON.stringify(allIds));
    setReadNotifications(allIds);
  };

  const handleNotificationClick = (notification) => {
    if (!readNotifications.includes(notification.id)) {
      const newRead = [...readNotifications, notification.id];
      localStorage.setItem('read_notifications', JSON.stringify(newRead));
      setReadNotifications(newRead);
    }
    if (notification.link) {
      window.open(notification.link, '_blank', 'noopener,noreferrer');
    }
  };

  const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;
      
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

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

  const handleAnalyticsClick = () => {
    setMobileOpen(false);
    navigate('/admin/analytics');
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Keluar Aplikasi',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#8C0C14',
      cancelButtonColor: '#6B7280'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { 
      id: 'paket', 
      name: 'Paket', 
      icon: <Package className="h-[18px] w-[18px]" />,
      isCollapsible: true,
      children: [
        { id: 'paket', name: 'Semua Produk' },
        { id: 'paket-tryout', name: 'Tryout' },
        { id: 'paket-kelas-online', name: 'Kelas Online' },
        { id: 'paket-ebook', name: 'E-Book' },
        { id: 'paket-bundling', name: 'Bundling' },
      ]
    },
    { id: 'paket-saya', name: 'Paket Saya', icon: <FileText className="h-[18px] w-[18px]" /> },
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
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                  <img src="/logo.jpg" alt="Logo WILDAN CASN" className="h-6 w-6 object-cover rounded-md" />
                </div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight whitespace-nowrap">
                  WILDAN<span className="text-[#0B1C30]"> CASN</span>
                </span>
              </Link>
            ) : (
              <Link to="/dashboard" className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm block">
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
              if (item.isCollapsible) {
                const isChildActive = activeTab && activeTab.startsWith('paket-') && activeTab !== 'paket-saya';
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (collapsed) {
                          setIsSidebarCollapsed(false);
                          setIsPaketOpen(true);
                        } else {
                          setIsPaketOpen(!isPaketOpen);
                        }
                      }}
                      className={`w-full flex items-center justify-between ${collapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                        isChildActive || activeTab === 'paket'
                          ? 'bg-[#0B1C30]/5 text-[#0B1C30]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B1C30]'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0">{item.icon}</div>
                        {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                      </div>
                      {!collapsed && (
                        <div className="flex-shrink-0">
                          {isPaketOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                    </button>
                    
                    {isPaketOpen && !collapsed && (
                      <div className="pl-6 space-y-0.5 animate-fadeIn">
                        {item.children.map((child) => {
                          const isSubActive = activeTab === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleTabClick(child.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-200 ${
                                isSubActive
                                  ? 'bg-[#0B1C30] text-white shadow-sm'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B1C30]'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                              <span className="whitespace-nowrap">{child.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

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
                <button
                  onClick={handleAnalyticsClick}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 px-3'} py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 mt-1 ${
                    location.pathname === '/admin/analytics'
                      ? 'bg-[#0B1C30] text-white shadow-premium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B1C30]'
                  }`}
                  title={collapsed ? 'Keuangan & Analisis' : undefined}
                >
                  <div className="flex-shrink-0"><TrendingUp className="h-[18px] w-[18px]" /></div>
                  {!collapsed && <span className="whitespace-nowrap">Keuangan & Analisis</span>}
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
        <header className="bg-white border-b border-slate-200/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          {/* Left: Menu trigger on Mobile, Search bar on Desktop */}
          <div className="flex items-center gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-550 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight flex md:hidden items-center gap-1.5 mr-2 flex-shrink-0">
              <img src="/logo.jpg" alt="Logo" className="h-5 w-5 object-cover rounded-md" />
              <span>WILDAN<span className="text-[#0B1C30]"> CASN</span></span>
            </span>
          </div>

          {/* Right: Notification bell & User details */}
          <div className="flex items-center gap-3.5">
            {/* Notification Bell */}
            <div className="relative flex items-center animate-fadeIn" ref={dropdownRef}>
              <button 
                onClick={handleToggleNotifications}
                className={`relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-200 ${showNotifications ? 'bg-slate-50 text-slate-700' : ''}`}
                title="Notifikasi"
              >
                <Bell className="h-5.5 w-5.5" />
                {/* Numeric indicator badge if there are unread count */}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-extrabold text-white flex items-center justify-center shadow-md select-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-[340px] sm:w-[420px] bg-white border border-slate-200/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-[15px]">Notifikasi</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} Belum dibaca` : 'Tidak ada pesan baru'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-extrabold text-blue-650 hover:text-blue-750 transition-colors focus:outline-none"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const isRead = readNotifications.includes(notif.id);
                        return (
                          <div 
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 flex gap-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors relative ${!isRead ? 'bg-blue-50/10' : ''}`}
                          >
                            {/* Unread indicator dot */}
                            {!isRead && (
                              <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500 shadow-sm animate-pulse" />
                            )}
                            
                            {/* Icon Wrapper */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              !isRead ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <Megaphone className="h-5 w-5" />
                            </div>

                            {/* Text content */}
                            <div className="space-y-1 text-left flex-1 min-w-0 pr-3.5">
                              <p className={`text-[13.5px] leading-relaxed text-slate-700 break-words ${!isRead ? 'font-bold' : 'font-medium'}`}>
                                {notif.text}
                              </p>
                              <div className="flex items-center gap-2.5 mt-1.5">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatRelativeTime(notif.created_at)}</span>
                                </div>
                                {notif.link && (
                                  <span className="flex items-center gap-1 text-[11px] text-blue-500 font-bold hover:underline">
                                    <span>Tautan</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      /* Empty State */
                      <div className="py-14 px-5 text-center text-slate-400">
                        <Bell className="h-10 w-10 mx-auto mb-3 opacity-30 text-slate-500" />
                        <p className="font-extrabold text-sm text-slate-500">Tidak ada pengumuman</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                          Semua pengumuman resmi dari sistem akan muncul di sini.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
