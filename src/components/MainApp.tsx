
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Login from '@/components/Login';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import SalesModule from '@/components/SalesModule';
import CashierManagement from '@/components/CashierManagement';
import Reports from '@/components/Reports';
import SafeSettings from '@/components/SafeSettings';

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { canAccess } = usePermissions();
  const { t } = useLanguage();
  const { toast } = useToast();

  console.log('MainApp - État auth:', { isAuthenticated, isLoading, user: user?.username });

  // Si en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    console.log('Utilisateur non authentifié - affichage de la page de connexion');
    return <Login />;
  }

  // Composant pour protéger les routes
  const ProtectedRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission: string }) => {
    if (!canAccess(requiredPermission)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('error.access')}</h2>
            <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 ml-64 overflow-auto">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute requiredPermission="dashboard">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredPermission="dashboard">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute requiredPermission="sales">
              <SalesModule />
            </ProtectedRoute>
          } />
          <Route path="/cashiers" element={
            <ProtectedRoute requiredPermission="cashiers">
              <CashierManagement />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredPermission="reports">
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiredPermission="settings">
              <SafeSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default MainApp;
