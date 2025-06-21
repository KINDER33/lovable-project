
import React, { useState } from 'react';
import { Home, ShoppingCart, Users, FileText, Settings, LogOut, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useHybridAuth();
  const { t, isRTL } = useLanguage();
  const { canAccess } = usePermissions();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenir la page actuelle depuis l'URL
  const currentPage = location.pathname.substring(1) || 'dashboard';

  // Définir tous les éléments de menu avec leurs permissions
  const allMenuItems = [
    { id: 'dashboard', labelKey: 'nav.dashboard', icon: Home, permission: 'dashboard', path: '/dashboard' },
    { id: 'sales', labelKey: 'nav.sales', icon: ShoppingCart, permission: 'sales', path: '/sales' },
    { id: 'users', labelKey: 'nav.users', icon: Users, permission: 'users', path: '/users' },
    { id: 'reports', labelKey: 'nav.reports', icon: FileText, permission: 'reports', path: '/reports' },
    { id: 'settings', labelKey: 'nav.settings', icon: Settings, permission: 'settings', path: '/settings' },
  ];

  // Filtrer les éléments selon les permissions
  const menuItems = allMenuItems.filter(item => {
    if (item.id === 'users') {
      return user?.role === 'admin';
    }
    return canAccess(item.permission);
  });

  const handleLogout = () => {
    console.log('Clic sur déconnexion');
    toast({
      title: t('nav.logout'),
      description: t('auth.logout.success'),
    });
    logout();
  };

  const handlePageChange = (path: string, permission: string) => {
    // Vérifier les permissions avant la navigation
    if (!canAccess(permission)) {
      toast({
        title: t('error.access'),
        description: "Vous n'avez pas les permissions nécessaires",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Navigation vers:', path);
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-gray-200 transition-all duration-300 flex flex-col z-40",
      isRTL ? "border-l" : "border-r",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-gray-200",
        isRTL ? "border-b" : "border-b"
      )}>
        <div className={cn(
          "flex items-center",
          isRTL ? "space-x-reverse space-x-3" : "space-x-3"
        )}>
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className={isRTL ? "text-right" : "text-left"}>
              <h2 className="font-semibold text-gray-900 text-sm">Caisse Médicale</h2>
              <p className="text-xs text-gray-600">Système de Gestion</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-4 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900",
            isRTL ? "-left-3" : "-right-3"
          )}
        >
          {isCollapsed ? (isRTL ? '←' : '→') : (isRTL ? '→' : '←')}
        </button>
      </div>

      {/* User Info */}
      <div className={cn(
        "p-4 border-gray-200",
        isRTL ? "border-b" : "border-b"
      )}>
        <div className={cn(
          "flex items-center",
          isRTL ? "space-x-reverse space-x-3" : "space-x-3"
        )}>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="font-medium text-gray-900">{user?.fullName || 'Utilisateur'}</p>
              <p className="text-xs text-gray-600">{t(`role.${user?.role}`) || t('role.caissier')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handlePageChange(item.path, item.permission)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors",
                  isRTL ? "space-x-reverse space-x-3" : "space-x-3",
                  currentPage === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{t(item.labelKey)}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 border-gray-200",
        isRTL ? "border-t" : "border-t"
      )}>
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors",
            isRTL ? "space-x-reverse space-x-3" : "space-x-3"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Navigation;
