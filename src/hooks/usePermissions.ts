
import { useHybridAuth } from '@/contexts/HybridAuthContext';

export interface Permission {
  module: string;
  action: 'read' | 'write' | 'admin';
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'dashboard:read',
    'sales:read', 'sales:write',
    'cashiers:read', 'cashiers:write', 'cashiers:admin',
    'reports:read', 'reports:write',
    'settings:read', 'settings:write', 'settings:admin'
  ],
  gestionnaire: [
    'dashboard:read',
    'sales:read', 'sales:write',
    'cashiers:read', 'cashiers:write',
    'reports:read', 'reports:write',
    'settings:read', 'settings:write'
  ],
  caissier: [
    'dashboard:read',
    'sales:read', 'sales:write',
    'reports:read'
  ]
};

export const usePermissions = () => {
  const { user } = useHybridAuth();

  const hasPermission = (module: string, action: 'read' | 'write' | 'admin' = 'read'): boolean => {
    if (!user || !user.role) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const permission = `${module}:${action}`;
    
    return userPermissions.includes(permission);
  };

  const canAccess = (module: string): boolean => {
    return hasPermission(module, 'read');
  };

  const canModify = (module: string): boolean => {
    return hasPermission(module, 'write');
  };

  const canAdminister = (module: string): boolean => {
    return hasPermission(module, 'admin');
  };

  const getAccessibleModules = (): string[] => {
    if (!user || !user.role) return [];
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const modules = new Set<string>();
    
    userPermissions.forEach(permission => {
      const [module] = permission.split(':');
      modules.add(module);
    });
    
    return Array.from(modules);
  };

  return {
    hasPermission,
    canAccess,
    canModify,
    canAdminister,
    getAccessibleModules,
    userRole: user?.role || 'guest'
  };
};
