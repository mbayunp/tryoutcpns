import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/landing/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import StartExam from '../pages/tryout/StartExam';
import Result from '../pages/tryout/Result';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Public Pages
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsConditions from '../pages/public/TermsConditions';
import RefundPolicy from '../pages/public/RefundPolicy';
import HelpCenter from '../pages/public/HelpCenter';

const DashboardAdmin = React.lazy(() => import('../pages/admin/DashboardAdmin'));
const PackageDetail = React.lazy(() => import('../pages/PackageDetail'));
const Analytics = React.lazy(() => import('../pages/admin/Analytics'));

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

      {/* Protected Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<Result />} />
        <Route path="/paket/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PackageDetail />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardAdmin />
          </Suspense>
        } />
        <Route path="/admin/analytics" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        } />
      </Route>

      {/* Standalone Exam (CAT Mode - Distraction-free) */}
      <Route path="/exam" element={<StartExam />} />
    </Routes>
  );
}
