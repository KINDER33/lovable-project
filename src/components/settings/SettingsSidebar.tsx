
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings as SettingsIcon, 
  Building, 
  Database, 
  Bell, 
  Printer, 
  User, 
  Shield,
  Package,
  Stethoscope,
  Folder,
  Users
} from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'supabase', label: 'Base de Données', icon: Database },
    { id: 'audit', label: 'Journal d\'Audit', icon: Shield },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'center', label: 'Centre Médical', icon: Building },
    { id: 'medications', label: 'Médicaments', icon: Package },
    { id: 'examTypes', label: 'Types d\'Examens', icon: Stethoscope },
    { id: 'expenseCategories', label: 'Catégories Dépenses', icon: Folder },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'printing', label: 'Impression', icon: Printer },
    { id: 'user', label: 'Utilisateur', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default SettingsSidebar;
