
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import HybridLogin from '@/components/HybridLogin';
import SimpleNavigation from '@/components/SimpleNavigation';
import Dashboard from '@/components/Dashboard';
import SalesModule from '@/components/SalesModule';
import SalesHistory from '@/components/SalesHistory';
import MedicationManagement from '@/components/MedicationManagement';
import ExamTypeManagement from '@/components/ExamTypeManagement';
import ExpenseCategoryManagement from '@/components/ExpenseCategoryManagement';
import Reports from '@/components/Reports';
import SafeSettings from '@/components/SafeSettings';
import UserAccountManagement from '@/components/UserAccountManagement';
import PermissionGuard from '@/components/PermissionGuard';

const SimpleMainApp = () => {
  const { isAuthenticated, isLoading } = useHybridAuth();

  console.log('🚀 SimpleMainApp - État auth:', { isAuthenticated, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <HybridLogin />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <SimpleNavigation />
        <main className="flex-1 ml-64 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<SalesModule />} />
            <Route path="/sales-history" element={
              <PermissionGuard requiredRole="admin">
                <SalesHistory />
              </PermissionGuard>
            } />
            <Route path="/medications" element={
              <PermissionGuard requiredRole="admin">
                <MedicationManagement />
              </PermissionGuard>
            } />
            <Route path="/exam-types" element={
              <PermissionGuard requiredRole="admin">
                <ExamTypeManagement />
              </PermissionGuard>
            } />
            <Route path="/expense-categories" element={
              <PermissionGuard requiredRole="admin">
                <ExpenseCategoryManagement />
              </PermissionGuard>
            } />
            <Route path="/reports" element={
              <PermissionGuard requiredRole="admin">
                <Reports />
              </PermissionGuard>
            } />
            <Route path="/settings" element={
              <PermissionGuard requiredRole="admin">
                <SafeSettings />
              </PermissionGuard>
            } />
            <Route path="/user-management" element={
              <PermissionGuard requiredRole="admin">
                <UserAccountManagement />
              </PermissionGuard>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default SimpleMainApp;
