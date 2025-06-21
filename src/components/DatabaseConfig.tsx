
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Settings } from 'lucide-react';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

const DatabaseConfig = () => {
  const [config, setConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    port: 3306,
    database: 'caisse_medicale',
    user: 'root',
    password: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    // Charger la configuration depuis localStorage
    const savedConfig = localStorage.getItem('database_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      setIsConfigured(true);
    }
  }, []);

  const saveConfiguration = () => {
    // Générer automatiquement l'URL API basée sur l'emplacement actuel
    const currentUrl = window.location.origin;
    const apiUrl = currentUrl.includes('localhost') 
      ? `${currentUrl}/caisse-medicale/api`
      : `${currentUrl}/api`;

    const configToSave = {
      ...config,
      apiUrl
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('database_config', JSON.stringify(configToSave));
    
    // Mettre à jour la configuration globale
    window.DATABASE_CONFIG = {
      HOST: config.host,
      PORT: config.port,
      DATABASE: config.database,
      USER: config.user,
      PASSWORD: config.password,
      API_BASE_URL: apiUrl,
      TABLES: {
        MEDICATIONS: 'medications',
        SALES: 'sales',
        SALE_ITEMS: 'sale_items',
        EXAMS: 'exams',
        EXAM_TYPES: 'exam_types',
        EXPENSES: 'expenses',
        EXPENSE_CATEGORIES: 'expense_categories'
      }
    };

    setIsConfigured(true);
    toast({
      title: "Configuration sauvegardée",
      description: `Base configurée avec API: ${apiUrl}`
    });
  };

  const testConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('pending');

    try {
      const currentUrl = window.location.origin;
      const apiUrl = currentUrl.includes('localhost') 
        ? `${currentUrl}/caisse-medicale/api`
        : `${currentUrl}/api`;

      const response = await fetch(`${apiUrl}/medications.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setConnectionStatus('success');
        toast({
          title: "Connexion réussie",
          description: "La base de données est accessible.",
          variant: "default"
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez que WAMP est démarré et que les fichiers API sont en place.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetConfiguration = () => {
    localStorage.removeItem('database_config');
    setIsConfigured(false);
    setConnectionStatus('pending');
    toast({
      title: "Configuration réinitialisée",
      description: "Vous pouvez maintenant saisir de nouveaux paramètres."
    });
  };

  if (isConfigured) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Base configurée : {config.host}:{config.port}/{config.database}
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={testConnection} disabled={isTesting} variant="outline" size="sm">
                {isTesting ? 'Test...' : 'Tester'}
              </Button>
              <Button onClick={resetConfiguration} variant="outline" size="sm">
                Reconfigurer
              </Button>
            </div>
          </div>

          {connectionStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Connexion active - Système prêt</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">Erreur de connexion - Vérifiez WAMP</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration Base de Données MySQL
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configuration simplifiée pour WAMP Server
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="host">Hôte</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => setConfig({...config, host: e.target.value})}
              placeholder="localhost"
            />
          </div>
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              value={config.port}
              onChange={(e) => setConfig({...config, port: parseInt(e.target.value) || 3306})}
              placeholder="3306"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="database">Base de données</Label>
          <Input
            id="database"
            value={config.database}
            onChange={(e) => setConfig({...config, database: e.target.value})}
            placeholder="caisse_medicale"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="user">Utilisateur</Label>
            <Input
              id="user"
              value={config.user}
              onChange={(e) => setConfig({...config, user: e.target.value})}
              placeholder="root"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig({...config, password: e.target.value})}
              placeholder="(laisser vide pour WAMP)"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={saveConfiguration}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sauvegarder Configuration
          </Button>
          <Button 
            onClick={testConnection}
            variant="outline"
            disabled={isTesting}
          >
            {isTesting ? 'Test en cours...' : 'Tester la Connexion'}
          </Button>
        </div>

        {connectionStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Connexion réussie ! Vous pouvez sauvegarder.</span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">Échec de connexion. Vérifiez vos paramètres.</span>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Instructions Rapides :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Exécutez scripts\deploy-wamp.bat</li>
            <li>• Démarrez WAMP (icône verte)</li>
            <li>• Créez la base 'caisse_medicale' dans phpMyAdmin</li>
            <li>• Importez database-schema.sql</li>
            <li>• Configuration automatique de l'API</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
