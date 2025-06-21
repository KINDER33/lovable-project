
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CenterConfigTab from './settings/CenterConfigTab';
import UserPreferencesTab from './settings/UserPreferencesTab';
import PrintingTab from './settings/PrintingTab';
import SecurityTab from './settings/SecurityTab';
import NotificationsTab from './settings/NotificationsTab';
import SystemDiagnostic from './SystemDiagnostic';
import ProductionValidator from './ProductionValidator';
import UserAccountManagement from './UserAccountManagement';
import { useHybridAuth } from '@/contexts/HybridAuthContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('production');
  const { user } = useHybridAuth();
  
  // Seuls les admins peuvent gérer les comptes
  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du Système</h1>
          <p className="text-gray-600">Configuration et validation pour la production</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-8' : 'grid-cols-7'}`}>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
          <TabsTrigger value="center">Centre</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="printing">Impression</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users">Comptes</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="production">
          <ProductionValidator />
        </TabsContent>

        <TabsContent value="diagnostic">
          <SystemDiagnostic />
        </TabsContent>

        <TabsContent value="center">
          <CenterConfigTab />
        </TabsContent>

        <TabsContent value="preferences">
          <UserPreferencesTab />
        </TabsContent>

        <TabsContent value="printing">
          <PrintingTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users">
            <UserAccountManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
