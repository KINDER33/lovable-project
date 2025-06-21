
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building } from 'lucide-react';
import { useCenterConfig } from '@/hooks/useCenterConfig';

const CenterConfigTab = () => {
  const { config, saveConfig, isLoading, updateConfig } = useCenterConfig();

  const handleConfigSave = async () => {
    console.log('Tentative de sauvegarde:', config);
    const success = await saveConfig(config);
    if (success) {
      console.log('Sauvegarde réussie');
    } else {
      console.log('Échec de la sauvegarde');
    }
  };

  const handleConfigChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    console.log('Mise à jour du champ', field, ':', value);
    updateConfig(newConfig);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Informations du Centre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="centerName">Nom du centre</Label>
              <Input 
                id="centerName" 
                value={config.centerName}
                onChange={(e) => handleConfigChange('centerName', e.target.value)}
                placeholder="Centre Médical..." 
              />
            </div>
            <div>
              <Label htmlFor="centerPhone">Téléphone</Label>
              <Input 
                id="centerPhone" 
                value={config.centerPhone}
                onChange={(e) => handleConfigChange('centerPhone', e.target.value)}
                placeholder="+221 XX XXX XXXX" 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="centerAddress">Adresse</Label>
            <Textarea 
              id="centerAddress" 
              value={config.centerAddress}
              onChange={(e) => handleConfigChange('centerAddress', e.target.value)}
              placeholder="Adresse complète du centre" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="centerEmail">Email</Label>
              <Input 
                id="centerEmail" 
                type="email" 
                value={config.centerEmail}
                onChange={(e) => handleConfigChange('centerEmail', e.target.value)}
                placeholder="contact@centre.com" 
              />
            </div>
            <div>
              <Label htmlFor="centerWebsite">Site web</Label>
              <Input 
                id="centerWebsite" 
                value={config.centerWebsite}
                onChange={(e) => handleConfigChange('centerWebsite', e.target.value)}
                placeholder="www.centre.com" 
              />
            </div>
          </div>
          <Button 
            onClick={handleConfigSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les informations'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterConfigTab;
