import React, { useState, useEffect } from 'react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import HybridLogin from './HybridLogin';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import SalesModule from './SalesModule';
import MedicationManagement from './MedicationManagement';
import ExamTypeManagement from './ExamTypeManagement';
import ExpenseCategoryManagement from './ExpenseCategoryManagement';
import Reports from './Reports';
import SafeSettings from './SafeSettings';
import UserManagement from './UserManagement';
import DatabaseStatusIndicator from './DatabaseStatusIndicator';
import FirstTimeSetup from './FirstTimeSetup';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const HybridMainApp = () => {
  console.log('🎯 HybridMainApp - Démarrage système...');
  
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [isCheckingInitialization, setIsCheckingInitialization] = useState(true);

  try {
    const { isAuthenticated, isLoading, user } = useHybridAuth();
    const { isInitialized, databaseType, adapter } = useDatabase();

    console.log('HybridMainApp - État système:', {
      isAuthenticated: !!isAuthenticated,
      isLoading: !!isLoading,
      user: user ? user.username : 'undefined',
      isInitialized: !!isInitialized,
      databaseType: databaseType || 'non-défini',
      needsInitialization,
      isCheckingInitialization
    });

    // Vérifier si le système nécessite une initialisation
    useEffect(() => {
      const checkSystemInitialization = async () => {
        if (!isInitialized || !adapter) {
          console.log('⏳ Attente de l\'initialisation de la base de données...');
          return;
        }

        // Éviter les vérifications multiples
        if (!isCheckingInitialization) {
          return;
        }

        try {
          console.log('🔍 Vérification si le système nécessite une initialisation...');
          
          // Vérifier le localStorage d'abord
          const systemInitialized = localStorage.getItem('system_initialized');
          if (systemInitialized === 'true') {
            console.log('✅ Système déjà initialisé selon localStorage');
            setNeedsInitialization(false);
            setIsCheckingInitialization(false);
            return;
          }
          
          // Vérifier s'il y a des utilisateurs dans la base
          const usersResult = await adapter.getUsers();
          const hasUsers = !usersResult.error && usersResult.data && usersResult.data.length > 0;
          
          console.log('📊 Résultat vérification utilisateurs:', {
            error: usersResult.error,
            hasUsers,
            userCount: usersResult.data?.length || 0
          });

          if (!hasUsers && !usersResult.error) {
            console.log('🔧 Aucun utilisateur trouvé - configuration initiale requise');
            setNeedsInitialization(true);
          } else if (hasUsers) {
            console.log('✅ Utilisateurs existants trouvés - système déjà configuré');
            setNeedsInitialization(false);
            localStorage.setItem('system_initialized', 'true');
          } else if (usersResult.error) {
            console.log('⚠️ Erreur lors de la vérification - continuons avec la connexion normale');
            setNeedsInitialization(false);
          }
        } catch (error) {
          console.error('💥 Erreur lors de la vérification du système:', error);
          setNeedsInitialization(false);
        } finally {
          setIsCheckingInitialization(false);
        }
      };

      checkSystemInitialization();
    }, [isInitialized, adapter, isCheckingInitialization]);

    // Attendre l'initialisation de la base de données
    if (!isInitialized) {
      console.log('⏳ Initialisation de la base de données...');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connexion à la base de données...</p>
          </div>
        </div>
      );
    }

    // Attendre la vérification d'initialisation
    if (isCheckingInitialization) {
      console.log('⏳ Vérification de l\'état du système...');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du système...</p>
          </div>
        </div>
      );
    }

    // Afficher la configuration initiale si nécessaire
    if (needsInitialization) {
      console.log('🔧 Affichage de la configuration initiale');
      return (
        <FirstTimeSetup 
          onComplete={() => {
            console.log('✅ Configuration initiale terminée - passage à l\'interface de connexion');
            setNeedsInitialization(false);
            // Ne pas recharger la page, juste changer l'état
          }} 
        />
      );
    }

    // Attendre la vérification d'authentification
    if (isLoading) {
      console.log('⏳ Vérification authentification en cours...');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      );
    }

    // Afficher la page de connexion si non authentifié
    if (!isAuthenticated) {
      console.log('🔐 Utilisateur non authentifié - affichage de la page de connexion');
      return <HybridLogin />;
    }

    // Application principale pour utilisateur authentifié
    console.log('✅ Utilisateur authentifié - affichage de l\'application principale');
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <DatabaseStatusIndicator />
          <Navigation />
          <main className="ml-64 min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sales" element={<SalesModule />} />
              <Route path="/medications" element={<MedicationManagement />} />
              <Route path="/exam-types" element={<ExamTypeManagement />} />
              <Route path="/expense-categories" element={<ExpenseCategoryManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SafeSettings />} />
              {user?.role === 'admin' && (
                <Route path="/users" element={<UserManagement />} />
              )}
            </Routes>
          </main>
        </div>
      </Router>
    );
  } catch (error) {
    console.error('💥 Erreur dans HybridMainApp:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur du système</h1>
          <p className="text-red-500">Une erreur s'est produite lors de l'initialisation.</p>
          <div className="mt-4">
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réinitialiser le système
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default HybridMainApp;
