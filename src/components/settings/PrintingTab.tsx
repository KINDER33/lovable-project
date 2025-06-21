
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Printer } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const PrintingTab = () => {
  const { 
    printConfig, 
    savePrintConfig, 
    updatePrintConfig,
    isLoading 
  } = useUserPreferences();

  const handlePrintConfigChange = (field: string, value: any) => {
    const newConfig = { ...printConfig, [field]: value };
    console.log('Mise à jour config impression', field, ':', value);
    updatePrintConfig(newConfig);
  };

  const handleSavePrintConfig = async () => {
    const success = await savePrintConfig(printConfig);
    if (success) {
      console.log('Configuration d\'impression sauvegardée avec succès');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Configuration d'Impression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="printerName">Imprimante par défaut</Label>
            <Select 
              value={printConfig.defaultPrinter} 
              onValueChange={(value) => handlePrintConfigChange('defaultPrinter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une imprimante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer1">HP LaserJet P1102</SelectItem>
                <SelectItem value="printer2">Canon Pixma</SelectItem>
                <SelectItem value="printer3">Epson EcoTank</SelectItem>
                <SelectItem value="thermal">Imprimante Thermique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paperSize">Format de papier</Label>
            <Select 
              value={printConfig.paperSize} 
              onValueChange={(value) => handlePrintConfigChange('paperSize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4 (Standard)</SelectItem>
                <SelectItem value="a5">A5 (Économique)</SelectItem>
                <SelectItem value="receipt">Reçu (58mm)</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Impression automatique des factures</Label>
              <p className="text-sm text-gray-600">Imprimer automatiquement après génération</p>
            </div>
            <Switch 
              checked={printConfig.autoprint}
              onCheckedChange={(checked) => handlePrintConfigChange('autoprint', checked)}
            />
          </div>
          <Button 
            onClick={handleSavePrintConfig}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintingTab;
