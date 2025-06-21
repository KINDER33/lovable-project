
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Database, Server, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { testConnection } from '@/integrations/supabase/client';
import { MySQLAdapter } from '@/services/database/MySQLAdapter';

interface DatabaseSetupProps {
  onComplete: () => void;
}

const DatabaseSetup: React.FC<DatabaseSetupProps> = ({ onComplete }) => {
  const [dbType, setDbType] = useState<'supabase' | 'mysql'>('mysql');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const [config, setConfig] = useState({
    supabaseUrl: 'https://iynltojhdocgofmhedmk.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY',
    mysqlHost: 'localhost',
    mysqlPort: '3306',
    mysqlDatabase: 'caisse_medicale',
    mysqlUser: 'root',
    mysqlPassword: ''
  });

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      console.log('Test de connexion à la base de données...');
      
      if (dbType === 'mysql') {
        const mysqlAdapter = new MySQLAdapter();
        const result = await mysqlAdapter.testConnection();
        
        if (result.success) {
          setIsConnected(true);
          toast({
            title: "Connexion MySQL réussie",
            description: result.message,
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        // Sauvegarder temporairement la config pour le test
        localStorage.setItem('supabase_config', JSON.stringify({
          url: config.supabaseUrl,
          key: config.supabaseKey
        }));
        
        const result = await testConnection();
        
        if (result.success) {
          setIsConnected(true);
          toast({
            title: "Connexion Supabase réussie",
            description: result.message,
          });
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter à la base de données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfiguration = async () => {
    if (!isConnected) {
      toast({
        title: "Test de connexion requis",
        description: "Veuillez tester la connexion avant de sauvegarder",
        variant: "destructive"
      });
      return;
    }

    try {
      const configToSave = {
        type: dbType,
        ...config,
        timestamp: new Date().toISOString(),
        configured_by: 'initial_setup'
      };

      localStorage.setItem('db_config_encrypted', JSON.stringify(configToSave));
      localStorage.setItem('db_configured', 'true');
      
      if (dbType === 'mysql') {
        // Sauvegarder spécifiquement pour MySQL
        localStorage.setItem('mysql_config', JSON.stringify({
          host: config.mysqlHost,
          port: config.mysqlPort,
          database: config.mysqlDatabase,
          user: config.mysqlUser,
          password: config.mysqlPassword
        }));
      }
      
      toast({
        title: "Configuration sauvegardée",
        description: `Base de données ${dbType} configurée avec succès`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Configuration de la Base de Données
          </CardTitle>
          <p className="text-gray-600">Configuration unique pour ce déploiement</p>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-amber-800">Configuration unique</p>
                <p className="text-xs text-amber-700">
                  Cette configuration ne sera demandée qu'une seule fois pour ce déploiement.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={dbType} onValueChange={(value: 'supabase' | 'mysql') => setDbType(value)}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="mysql" id="mysql" />
              <Label htmlFor="mysql" className="flex items-center space-x-2 cursor-pointer">
                <Server className="w-5 h-5 text-blue-600" />
                <span>MySQL WAMP Server (Recommandé pour local)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="supabase" id="supabase" />
              <Label htmlFor="supabase" className="flex items-center space-x-2 cursor-pointer">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Supabase (Cloud)</span>
              </Label>
            </div>
          </RadioGroup>

          {dbType === 'mysql' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mysqlHost">Hôte</Label>
                  <Input
                    id="mysqlHost"
                    placeholder="localhost"
                    value={config.mysqlHost}
                    onChange={(e) => setConfig({...config, mysqlHost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mysqlPort">Port</Label>
                  <Input
                    id="mysqlPort"
                    placeholder="3306"
                    value={config.mysqlPort}
                    onChange={(e) => setConfig({...config, mysqlPort: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mysqlDatabase">Nom de la Base</Label>
                <Input
                  id="mysqlDatabase"
                  placeholder="caisse_medicale"
                  value={config.mysqlDatabase}
                  onChange={(e) => setConfig({...config, mysqlDatabase: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mysqlUser">Utilisateur</Label>
                  <Input
                    id="mysqlUser"
                    placeholder="root"
                    value={config.mysqlUser}
                    onChange={(e) => setConfig({...config, mysqlUser: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mysqlPassword">Mot de Passe</Label>
                  <Input
                    id="mysqlPassword"
                    type="password"
                    placeholder="(vide pour WAMP par défaut)"
                    value={config.mysqlPassword}
                    onChange={(e) => setConfig({...config, mysqlPassword: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions WAMP :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Démarrez WAMP Server (icône verte)</li>
                  <li>• Créez la base 'caisse_medicale' dans phpMyAdmin</li>
                  <li>• Importez le fichier database-schema.sql</li>
                  <li>• Copiez les fichiers API dans www/caisse-medicale/api/</li>
                </ul>
              </div>
            </div>
          )}

          {dbType === 'supabase' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="supabaseUrl">URL du Projet Supabase</Label>
                <Input
                  id="supabaseUrl"
                  placeholder="https://votre-projet.supabase.co"
                  value={config.supabaseUrl}
                  onChange={(e) => setConfig({...config, supabaseUrl: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supabaseKey">Clé API Supabase (anon/public)</Label>
                <Input
                  id="supabaseKey"
                  type="password"
                  placeholder="Votre clé API publique"
                  value={config.supabaseKey}
                  onChange={(e) => setConfig({...config, supabaseKey: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button 
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex-1"
              variant="outline"
            >
              {isLoading ? "Test en cours..." : "Tester la Connexion"}
            </Button>
            
            {isConnected && (
              <Button 
                onClick={saveConfiguration}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Sauvegarder et Continuer
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✅ Connexion établie avec succès!</p>
              <p className="text-green-600 text-sm">
                Configuration {dbType} prête pour la production.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
