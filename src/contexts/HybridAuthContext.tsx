
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDatabase } from './DatabaseContext';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  email: string;
}

interface HybridAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const HybridAuthContext = createContext<HybridAuthContextType | undefined>(undefined);

export const useHybridAuth = () => {
  const context = useContext(HybridAuthContext);
  if (context === undefined) {
    throw new Error('useHybridAuth must be used within a HybridAuthProvider');
  }
  return context;
};

interface HybridAuthProviderProps {
  children: ReactNode;
}

// Comptes par défaut pour le mode démo
const DEFAULT_ACCOUNTS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Administrateur Principal',
    role: 'admin',
    email: 'admin@caisse.medical'
  },
  {
    id: '2',
    username: 'caissier',
    password: 'caissier123',
    fullName: 'Caissier Principal',
    role: 'caissier',
    email: 'caissier@caisse.medical'
  }
];

export const HybridAuthProvider: React.FC<HybridAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { adapter, isInitialized } = useDatabase();

  useEffect(() => {
    if (isInitialized) {
      checkAuthState();
    }
  }, [isInitialized]);

  const checkAuthState = async () => {
    try {
      console.log('🔐 Vérification de l\'état d\'authentification...');
      
      // Vérifier s'il y a une session sauvegardée
      const savedUser = localStorage.getItem('hybrid_auth_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('✅ Session locale trouvée pour:', parsedUser.username);
          setUser(parsedUser);
        } catch (error) {
          console.error('❌ Erreur parsing session utilisateur:', error);
          localStorage.removeItem('hybrid_auth_user');
        }
      } else {
        console.log('ℹ️ Aucune session utilisateur trouvée - connexion requise');
      }
    } catch (error) {
      console.error('💥 Erreur vérification auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Tentative de connexion pour:', username);
      
      // Essayer d'abord avec l'adaptateur de base de données
      if (adapter) {
        const result = await adapter.login(username, password);
        
        if (result.success && result.user) {
          console.log('✅ Connexion DB réussie pour:', {
            username: result.user.username,
            role: result.user.role,
            fullName: result.user.fullName
          });

          setUser(result.user);
          
          // Sauvegarder la session
          localStorage.setItem('hybrid_auth_user', JSON.stringify(result.user));
          localStorage.setItem('last_login', new Date().toISOString());
          
          return true;
        }
      }
      
      // Fallback vers les comptes par défaut
      console.log('🔄 Tentative avec les comptes par défaut...');
      const account = DEFAULT_ACCOUNTS.find(acc => 
        acc.username === username && acc.password === password
      );
      
      if (account) {
        const authUser: User = {
          id: account.id,
          username: account.username,
          fullName: account.fullName,
          role: account.role,
          email: account.email
        };
        
        console.log('✅ Connexion par défaut réussie pour:', {
          username: authUser.username,
          role: authUser.role,
          fullName: authUser.fullName
        });

        setUser(authUser);
        
        // Sauvegarder la session
        localStorage.setItem('hybrid_auth_user', JSON.stringify(authUser));
        localStorage.setItem('last_login', new Date().toISOString());
        
        return true;
      }
      
      console.log('❌ Connexion échouée - credentials invalides');
      return false;
      
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion en cours...');
    setUser(null);
    localStorage.removeItem('hybrid_auth_user');
    localStorage.setItem('last_logout', new Date().toISOString());
    console.log('✅ Déconnexion terminée');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return <HybridAuthContext.Provider value={value}>{children}</HybridAuthContext.Provider>;
};
