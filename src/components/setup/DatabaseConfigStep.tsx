
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Database, CheckCircle, Server, Shield } from 'lucide-react';

interface DatabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
  mysqlHost: string;
  mysqlPort: string;
  mysqlDatabase: string;
  mysqlUser: string;
  mysqlPassword: string;
}

interface DatabaseConfigStepProps {
  onSuccess: () => void;
}

const DatabaseConfigStep: React.FC<DatabaseConfigStepProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [dbType, setDbType] = useState<'mysql' | 'supabase'>('mysql');
  const { toast } = useToast();

  const [config, setConfig] = useState<DatabaseConfig>({
    supabaseUrl: 'https://iynltojhdocgofmhedmk.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY',
    mysqlHost: 'localhost',
    mysqlPort: '3306',
    mysqlDatabase: 'caisse_medicale',
    mysqlUser: 'root',
    mysqlPassword: ''
  });

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    try {
      console.log(`🔍 Test de connexion à la base de données ${dbType}...`);
      
      if (dbType === 'mysql') {
        localStorage.setItem('mysql_config', JSON.stringify({
          host: config.mysqlHost,
          port: config.mysqlPort,
          database: config.mysqlDatabase,
          user: config.mysqlUser,
          password: config.mysqlPassword
        }));
        
        const { MySQLAdapter } = await import('@/services/database/MySQLAdapter');
        const mysqlAdapter = new MySQLAdapter();
        const result = await mysqlAdapter.testConnection();
        
        if (!result.error) {
          setIsConnected(true);
          toast({
            title: "Connexion MySQL réussie",
            description: result.message || "Base de données MySQL accessible",
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        localStorage.setItem('supabase_config', JSON.stringify({
          url: config.supabaseUrl,
          key: config.supabaseKey
        }));
        
        const { SupabaseAdapter } = await import('@/services/database/SupabaseAdapter');
        const supabaseAdapter = new SupabaseAdapter();
        const result = await supabaseAdapter.testConnection();
        
        if (!result.error) {
          setIsConnected(true);
          toast({
            title: "Connexion Supabase réussie",
            description: result.message || "Base de données Supabase accessible",
          });
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion DB:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter à la base de données",
        variant: "destructive"
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToNext = () => {
    if (!isConnected) {
      toast({
        title: "Test de connexion requis",
        description: "Veuillez tester la connexion avant de continuer",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('selected_db_type', dbType);
    localStorage.setItem('db_config_validated', 'true');
    
    toast({
      title: "Configuration validée",
      description: `Base de données ${dbType} configurée avec succès`,
    });

    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Étape 1 : Configuration Base de Données</h3>
        <p className="text-gray-600">Sélectionnez et configurez votre type de base de données</p>
      </div>
      
      <div className="space-y-4">
        <RadioGroup value={dbType} onValueChange={(value: 'mysql' | 'supabase') => {
          setDbType(value);
          setIsConnected(false);
        }}>
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
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">Configuration MySQL</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mysqlHost">Hôte</Label>
                <Input
                  id="mysqlHost"
                  placeholder="localhost"
                  value={config.mysqlHost}
                  onChange={(e) => {
                    setConfig({...config, mysqlHost: e.target.value});
                    setIsConnected(false);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="mysqlPort">Port</Label>
                <Input
                  id="mysqlPort"
                  placeholder="3306"
                  value={config.mysqlPort}
                  onChange={(e) => {
                    setConfig({...config, mysqlPort: e.target.value});
                    setIsConnected(false);
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mysqlDatabase">Nom de la Base</Label>
              <Input
                id="mysqlDatabase"
                placeholder="caisse_medicale"
                value={config.mysqlDatabase}
                onChange={(e) => {
                  setConfig({...config, mysqlDatabase: e.target.value});
                  setIsConnected(false);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mysqlUser">Utilisateur</Label>
                <Input
                  id="mysqlUser"
                  placeholder="root"
                  value={config.mysqlUser}
                  onChange={(e) => {
                    setConfig({...config, mysqlUser: e.target.value});
                    setIsConnected(false);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="mysqlPassword">Mot de Passe</Label>
                <Input
                  id="mysqlPassword"
                  type="password"
                  placeholder="(vide pour WAMP par défaut)"
                  value={config.mysqlPassword}
                  onChange={(e) => {
                    setConfig({...config, mysqlPassword: e.target.value});
                    setIsConnected(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {dbType === 'supabase' && (
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900">Configuration Supabase</h4>
            <div>
              <Label htmlFor="supabaseUrl">URL du Projet Supabase</Label>
              <Input
                id="supabaseUrl"
                placeholder="https://votre-projet.supabase.co"
                value={config.supabaseUrl}
                onChange={(e) => {
                  setConfig({...config, supabaseUrl: e.target.value});
                  setIsConnected(false);
                }}
              />
            </div>
            <div>
              <Label htmlFor="supabaseKey">Clé API Supabase (anon/public)</Label>
              <Input
                id="supabaseKey"
                type="password"
                placeholder="Votre clé API publique"
                value={config.supabaseKey}
                onChange={(e) => {
                  setConfig({...config, supabaseKey: e.target.value});
                  setIsConnected(false);
                }}
              />
            </div>
          </div>
        )}
        
        <div className="flex space-x-4">
          <Button 
            onClick={testDatabaseConnection}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            {isLoading ? "Test en cours..." : "Tester la Connexion"}
          </Button>
          
          {isConnected && (
            <Button 
              onClick={proceedToNext}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continuer
            </Button>
          )}
        </div>

        {isConnected && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Connexion établie avec succès!</p>
            <p className="text-green-600 text-sm">
              Configuration {dbType} validée et prête.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseConfigStep;
