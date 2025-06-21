
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Settings,
  History,
  LogOut,
  User,
  Users
} from 'lucide-react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SimpleNavigation = () => {
  const location = useLocation();
  const { user, logout } = useHybridAuth();
  const { toast } = useToast();

  // Pour SimpleMainApp, utiliser un utilisateur admin par défaut si aucun n'est fourni
  const defaultUser = {
    fullName: 'Administrateur',
    role: 'admin'
  };

  const currentUser = user || defaultUser;

  // Définir les éléments de navigation selon le rôle
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord' },
      { path: '/sales', icon: ShoppingCart, label: 'Ventes' }
    ];

    // Si c'est un admin, ajouter tous les autres éléments
    if (currentUser.role === 'admin') {
      return [
        ...baseItems,
        { path: '/sales-history', icon: History, label: 'Historique Ventes' },
        { path: '/medications', icon: Pill, label: 'Médicaments' },
        { path: '/exam-types', icon: FileText, label: 'Types d\'Examens' },
        { path: '/expense-categories', icon: DollarSign, label: 'Catégories Dépenses' },
        { path: '/reports', icon: BarChart3, label: 'Rapports' },
        { path: '/user-management', icon: Users, label: 'Gestion Utilisateurs' },
        { path: '/settings', icon: Settings, label: 'Paramètres' }
      ];
    }

    // Pour les caissiers, seulement le dashboard et les ventes
    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    console.log('🚪 Tentative de déconnexion...');
    
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });

    if (logout) {
      logout();
    } else {
      // Pour le mode simple, forcer la déconnexion
      console.log('Déconnexion en mode simple');
      window.location.reload();
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Caisse Médicale</h1>
        <p className="text-sm text-gray-600">Gestion Simplifiée</p>
      </div>

      {/* Informations utilisateur */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{currentUser.fullName}</p>
            <p className="text-xs text-gray-600">
              {currentUser.role === 'admin' ? 'Administrateur' : 'Caissier'}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 flex-1">
        <div className="px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 mb-1 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Bouton de déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Version 1.0.0</p>
          <p className="text-xs text-gray-500">Mode Simplifié</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleNavigation;
