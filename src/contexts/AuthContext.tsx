
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔐 Vérification de l\'état d\'authentification...');
      
      // Vérifier si un utilisateur est connecté dans localStorage
      const savedUser = localStorage.getItem('medical_center_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('✅ Session trouvée pour:', parsedUser.username);
          setUser(parsedUser);
        } catch (error) {
          console.error('❌ Erreur parsing session utilisateur:', error);
          localStorage.removeItem('medical_center_user');
        }
      } else {
        console.log('ℹ️ Aucune session utilisateur trouvée');
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
      
      // Rechercher l'utilisateur dans la base de données
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true);

      if (error) {
        console.error('❌ Erreur recherche utilisateur:', error);
        return false;
      }

      if (!users || users.length === 0) {
        console.log('❌ Utilisateur non trouvé:', username);
        return false;
      }

      const userData = users[0];
      console.log('👤 Utilisateur trouvé:', {
        username: userData.username,
        role: userData.role,
        active: userData.is_active
      });

      // Vérification du mot de passe
      let expectedPassword;
      try {
        expectedPassword = atob(userData.password_hash);
      } catch (decodeError) {
        console.error('❌ Erreur décodage mot de passe:', decodeError);
        return false;
      }

      if (expectedPassword !== password) {
        console.log('❌ Mot de passe incorrect pour:', username);
        return false;
      }

      // Création de l'objet utilisateur
      const userObj = {
        id: userData.id,
        username: userData.username,
        fullName: userData.full_name,
        role: userData.role,
        email: userData.email
      };

      console.log('✅ Connexion réussie pour:', {
        username: userObj.username,
        role: userObj.role,
        fullName: userObj.fullName
      });

      // Sauvegarder la session
      setUser(userObj);
      localStorage.setItem('medical_center_user', JSON.stringify(userObj));
      
      // Log de l'action de connexion
      localStorage.setItem('last_login', new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion...');
    setUser(null);
    localStorage.removeItem('medical_center_user');
    localStorage.setItem('last_logout', new Date().toISOString());
    setIsLoading(false);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
