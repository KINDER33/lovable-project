
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const UserPreferencesTab = () => {
  const { 
    preferences, 
    savePreferences, 
    updatePreferences,
    isLoading 
  } = useUserPreferences();

  const handlePreferenceChange = (field: string, value: string) => {
    const newPreferences = { ...preferences, [field]: value };
    console.log('Mise à jour préférence', field, ':', value);
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
            <User className="w-5 h-5" />
            Préférences Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Thème de l'interface</Label>
            <Select 
              value={preferences.theme} 
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="auto">Automatique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Langue</Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
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

export default UserPreferencesTab;
