
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseManager } from '@/services/database/DatabaseManager';
import { DatabaseAdapter } from '@/services/database/DatabaseAdapter';

interface DatabaseContextType {
  adapter: DatabaseAdapter | null;
  databaseType: string | null;
  isInitialized: boolean;
  isOnline: boolean;
  initializationMessage: string;
  reconnect: () => Promise<boolean>;
  forceOffline: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [adapter, setAdapter] = useState<DatabaseAdapter | null>(null);
  const [databaseType, setDatabaseType] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [initializationMessage, setInitializationMessage] = useState('Initialisation...');
  const [databaseManager] = useState(() => new DatabaseManager());

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      console.log('🚀 Initialisation de la base de données...');
      
      // Déterminer l'environnement actuel
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isProduction = !hostname.includes('localhost') && 
                          !hostname.includes('127.0.0.1') && 
                          !hostname.includes('lovable.app');
      
      console.log('🔍 Environnement détecté:', {
        hostname,
        isProduction,
        forceProduction: isProduction
      });

      let result;

      if (isProduction) {
        // En production, utiliser directement l'adaptateur MySQL LWS
        console.log('🎯 Mode production détecté - utilisation de MySQL LWS');
        setInitializationMessage('Connexion à MySQL LWS...');
        result = await databaseManager.initialize('production');
      } else {
        // En développement, tester d'abord Supabase puis MySQL en fallback
        console.log('🔧 Mode développement - test de Supabase puis MySQL');
        setInitializationMessage('Test de connexion Supabase...');
        
        result = await databaseManager.initialize('supabase');
        if (!result.success) {
          console.log('⚠️ Supabase non disponible, basculement vers production MySQL');
          setInitializationMessage('Connexion à MySQL production...');
          result = await databaseManager.initialize('production');
        }
      }

      if (result.success && databaseManager.isInitialized()) {
        const dbAdapter = databaseManager.getAdapter();
        const dbType = databaseManager.getCurrentType();
        
        setAdapter(dbAdapter);
        setDatabaseType(dbType || 'unknown');
        setIsOnline(true);
        setIsInitialized(true);
        
        console.log('✅ Base initialisée:', dbType, '- Connexion établie');
        setInitializationMessage(
          dbType === 'supabase' 
            ? 'Connecté à Supabase' 
            : 'Connecté à MySQL LWS'
        );
      } else {
        throw new Error(result.error || 'Aucun adaptateur disponible');
      }
    } catch (error) {
      console.error('❌ Erreur initialisation base de données:', error);
      setIsOnline(false);
      setInitializationMessage('Erreur de connexion - Mode hors ligne');
      
      // En cas d'erreur, essayer le mode hors ligne avec localStorage
      try {
        const offlineResult = await databaseManager.initialize('localStorage');
        if (offlineResult.success && databaseManager.isInitialized()) {
          const dbAdapter = databaseManager.getAdapter();
          setAdapter(dbAdapter);
          setDatabaseType('localstorage');
          setIsInitialized(true);
          console.log('🔄 Basculement vers le mode hors ligne réussi');
        } else {
          throw new Error('Impossible d\'initialiser le mode hors ligne');
        }
      } catch (offlineError) {
        console.error('💥 Impossible d\'initialiser le mode hors ligne:', offlineError);
        setInitializationMessage('Erreur critique - Impossible de se connecter');
      }
    }
  };

  const reconnect = async (): Promise<boolean> => {
    try {
      setInitializationMessage('Reconnexion...');
      await initializeDatabase();
      return isOnline;
    } catch (error) {
      console.error('Erreur lors de la reconnexion:', error);
      return false;
    }
  };

  const forceOffline = async (): Promise<void> => {
    try {
      const offlineResult = await databaseManager.initialize('localStorage');
      if (offlineResult.success && databaseManager.isInitialized()) {
        const dbAdapter = databaseManager.getAdapter();
        setAdapter(dbAdapter);
        setDatabaseType('localstorage');
        setIsOnline(false);
        setInitializationMessage('Mode hors ligne activé');
      } else {
        throw new Error('Impossible d\'activer le mode hors ligne');
      }
    } catch (error) {
      console.error('Erreur lors du passage en mode hors ligne:', error);
      throw error;
    }
  };

  const value = {
    adapter,
    databaseType,
    isInitialized,
    isOnline,
    initializationMessage,
    reconnect,
    forceOffline
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
