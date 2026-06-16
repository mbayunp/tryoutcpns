import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/landing/Home';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import StartExam from '../pages/tryout/StartExam';
import Result from '../pages/tryout/Result';
import DashboardAdmin from '../pages/admin/DashboardAdmin';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Route>

      {/* Standalone Exam (CAT Mode - Distraction-free) */}
      <Route path="/exam" element={<StartExam />} />
    </Routes>
  );
}
