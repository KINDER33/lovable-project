
import React from 'react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'caissier';
  fallbackMessage?: string;
  showAdminOnly?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  requiredRole, 
  fallbackMessage,
  showAdminOnly = false
}) => {
  const { user } = useHybridAuth();

  // Si aucun rôle requis spécifié, permettre l'accès à tous les utilisateurs connectés
  if (!requiredRole && user) {
    return <>{children}</>;
  }

  // Si showAdminOnly est activé, afficher seulement pour les admins
  if (showAdminOnly && user?.role !== 'admin') {
    return null;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (requiredRole && user?.role !== requiredRole) {
    const defaultMessage = requiredRole === 'admin' 
      ? 'Accès restreint aux administrateurs'
      : 'Accès restreint aux caissiers';

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Accès Restreint
              </h3>
              <p className="text-gray-600">
                {fallbackMessage || defaultMessage}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Votre rôle actuel: {user?.role === 'admin' ? 'Administrateur' : 'Caissier'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
