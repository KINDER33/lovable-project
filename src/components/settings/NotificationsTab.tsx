
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const NotificationsTab = () => {
  const { 
    preferences, 
    savePreferences, 
    updatePreferences,
    isLoading 
  } = useUserPreferences();

  const handleNotificationChange = (field: string, value: boolean) => {
    const newPreferences = { 
      ...preferences, 
      notifications: { ...preferences.notifications, [field]: value }
    };
    console.log('Mise à jour notification', field, ':', value);
    updatePreferences(newPreferences);
  };

  const handleSavePreferences = async () => {
    const success = await savePreferences(preferences);
    if (success) {
      console.log('Préférences sauvegardées avec succès');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Paramètres de Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications de stock faible</Label>
              <p className="text-sm text-gray-600">Recevoir des alertes quand le stock est faible</p>
            </div>
            <Switch 
              checked={preferences.notifications.lowStock}
              onCheckedChange={(checked) => handleNotificationChange('lowStock', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications de ventes</Label>
              <p className="text-sm text-gray-600">Notifications pour chaque vente effectuée</p>
            </div>
            <Switch 
              checked={preferences.notifications.sales}
              onCheckedChange={(checked) => handleNotificationChange('sales', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Rapports automatiques</Label>
              <p className="text-sm text-gray-600">Génération automatique des rapports quotidiens</p>
            </div>
            <Switch 
              checked={preferences.notifications.autoReports}
              onCheckedChange={(checked) => handleNotificationChange('autoReports', checked)}
            />
          </div>
          <Button 
            onClick={handleSavePreferences}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
