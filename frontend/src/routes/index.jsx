import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/landing/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import StartExam from '../pages/tryout/StartExam';
import Result from '../pages/tryout/Result';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Public Pages
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsConditions from '../pages/public/TermsConditions';
import RefundPolicy from '../pages/public/RefundPolicy';
import HelpCenter from '../pages/public/HelpCenter';

const DashboardAdmin = React.lazy(() => import('../pages/admin/DashboardAdmin'));
const AdminSoal = React.lazy(() => import('../pages/admin/AdminSoal'));
const AdminPaket = React.lazy(() => import('../pages/admin/AdminPaket'));
const AdminBanner = React.lazy(() => import('../pages/admin/AdminBanner'));
const PackageDetail = React.lazy(() => import('../pages/PackageDetail'));
const Analytics = React.lazy(() => import('../pages/admin/Analytics'));
const AdminReferral = React.lazy(() => import('../pages/admin/AdminReferral'));
const AdminPembayaran = React.lazy(() => import('../pages/admin/AdminPembayaran'));

// Dashboard views
const DashboardHome = React.lazy(() => import('../pages/dashboard/DashboardHome'));
const PackageCatalog = React.lazy(() => import('../pages/dashboard/PackageCatalog'));
const UserProfile = React.lazy(() => import('../pages/dashboard/UserProfile'));
const HistoryTab = React.lazy(() => import('../pages/dashboard/HistoryTab'));
const RankingTab = React.lazy(() => import('../pages/dashboard/RankingTab'));
const ProgramSelection = React.lazy(() => import('../pages/dashboard/ProgramSelection'));
const Pembayaran = React.lazy(() => import('../pages/dashboard/Pembayaran'));

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/help" element={<HelpCenter />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/program-selection" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProgramSelection />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardHome />
          </Suspense>
        } />
        <Route path="/dashboard/paket" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PackageCatalog />
          </Suspense>
        } />
        <Route path="/dashboard/paket-saya" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PackageCatalog showOnlyPurchased={true} />
          </Suspense>
        } />
        <Route path="/dashboard/riwayat" element={
          <Suspense fallback={<LoadingSpinner />}>
            <HistoryTab />
          </Suspense>
        } />
        <Route path="/dashboard/ranking" element={
          <Suspense fallback={<LoadingSpinner />}>
            <RankingTab />
          </Suspense>
        } />
        <Route path="/dashboard/profil" element={
          <Suspense fallback={<LoadingSpinner />}>
            <UserProfile />
          </Suspense>
        } />
        <Route path="/dashboard/pembayaran" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Pembayaran />
          </Suspense>
        } />

        <Route path="/result" element={<Result />} />
        
        <Route path="/paket/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PackageDetail />
          </Suspense>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardAdmin />
          </Suspense>
        } />
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardAdmin />
          </Suspense>
        } />
        <Route path="/admin/soal" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSoal />
          </Suspense>
        } />
        <Route path="/admin/paket" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPaket />
          </Suspense>
        } />
        <Route path="/admin/kelola-paket" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPaket />
          </Suspense>
        } />
        <Route path="/admin/banner" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminBanner />
          </Suspense>
        } />
        <Route path="/admin/pembayaran" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPembayaran />
          </Suspense>
        } />
        <Route path="/admin/analytics" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        } />
        <Route path="/admin/referal" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminReferral />
          </Suspense>
        } />
        <Route path="/admin/referral" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminReferral />
          </Suspense>
        } />
      </Route>

      {/* Standalone Exam (CAT Mode - Distraction-free) */}
      <Route path="/exam" element={<StartExam />} />
    </Routes>
  );
}
