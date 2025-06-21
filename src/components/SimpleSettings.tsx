
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Database, Server, Shield, Settings, CheckCircle } from 'lucide-react';

const SimpleSettings = () => {
  const [dbType, setDbType] = useState<'mysql' | 'supabase' | 'none'>('none');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const testDatabaseConnection = async () => {
    if (dbType === 'none') {
      toast({
        title: "Mode local activé",
        description: "Le logiciel fonctionne sans base de données externe",
      });
      setIsConnected(true);
      localStorage.setItem('database_mode', 'local');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Test de connexion à la base de données ${dbType}...`);
      
      if (dbType === 'mysql') {
        localStorage.setItem('mysql_config', JSON.stringify({
          host: config.mysqlHost,
          port: config.mysqlPort,
          database: config.mysqlDatabase,
          user: config.mysqlUser,
          password: config.mysqlPassword
        }));
        localStorage.setItem('database_mode', 'mysql');
        
        setIsConnected(true);
        toast({
          title: "Configuration MySQL sauvegardée",
          description: "Paramètres MySQL enregistrés avec succès",
        });
      } else if (dbType === 'supabase') {
        localStorage.setItem('supabase_config', JSON.stringify({
          url: config.supabaseUrl,
          key: config.supabaseKey
        }));
        localStorage.setItem('database_mode', 'supabase');
        
        setIsConnected(true);
        toast({
          title: "Configuration Supabase sauvegardée",
          description: "Paramètres Supabase enregistrés avec succès",
        });
      }
      
      // Recharger la page pour appliquer la nouvelle configuration
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Erreur de configuration DB:', error);
      toast({
        title: "Erreur de configuration",
        description: error.message || "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier la configuration actuelle au chargement
  React.useEffect(() => {
    const currentMode = localStorage.getItem('database_mode');
    if (currentMode) {
      setDbType(currentMode as 'mysql' | 'supabase' | 'none');
      setIsConnected(true);
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres du Logiciel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Mode de Fonctionnement</h3>
              <p className="text-sm text-blue-800">
                Ce logiciel peut fonctionner en mode local (sans base de données) 
                ou être connecté à une base de données externe.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Configuration de la Base de Données</h4>
              
              <RadioGroup value={dbType} onValueChange={(value: 'mysql' | 'supabase' | 'none') => {
                setDbType(value);
                setIsConnected(false);
              }}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="flex items-center space-x-2 cursor-pointer">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span>Mode Local (Aucune base de données)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="mysql" id="mysql" />
                  <Label htmlFor="mysql" className="flex items-center space-x-2 cursor-pointer">
                    <Server className="w-5 h-5 text-blue-600" />
                    <span>MySQL WAMP Server</span>
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

              {/* Configuration MySQL */}
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
                </div>
              )}

              {/* Configuration Supabase */}
              {dbType === 'supabase' && (
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900">Configuration Supabase</h4>
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
                    <Label htmlFor="supabaseKey">Clé API Supabase</Label>
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

              <Button 
                onClick={testDatabaseConnection}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Configuration en cours..." : "Sauvegarder la Configuration"}
              </Button>

              {isConnected && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Configuration sauvegardée avec succès!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Mode {dbType === 'none' ? 'local' : dbType} activé.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Logiciel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Mode:</strong> Accès libre (sans authentification)</p>
            <p><strong>Type de données:</strong> {
              localStorage.getItem('database_mode') || 'Local (navigateur)'
            }</p>
            <p><strong>Fonctionnalités disponibles:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Module de ventes avec impression de factures</li>
              <li>Gestion des médicaments</li>
              <li>Gestion des types d'examens</li>
              <li>Gestion des catégories de dépenses</li>
              <li>Rapports et statistiques</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSettings;
