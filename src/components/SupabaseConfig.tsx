
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Settings, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase, testConnection, configureSupabase } from '@/integrations/supabase/client';

const SupabaseConfig = () => {
  const [config, setConfig] = useState({
    url: '',
    key: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Charger la configuration depuis localStorage
    const savedConfig = localStorage.getItem('supabase_config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setIsConfigured(true);
        testConnectionStatus();
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        setIsConfigured(false);
      }
    } else {
      // Utiliser la configuration par défaut
      setConfig({
        url: 'https://iynltojhdocgofmhedmk.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY'
      });
    }
  }, []);

  const testConnectionStatus = async () => {
    setIsTesting(true);
    setStatusMessage('Test en cours...');
    
    try {
      console.log('🚀 Début du test de connexion...');
      const result = await testConnection();
      
      if (result.success) {
        setConnectionStatus('success');
        setStatusMessage(result.message || 'Connexion réussie');
        console.log('✅ Connexion Supabase réussie');
      } else {
        setConnectionStatus('error');
        setStatusMessage(result.error || 'Erreur de connexion inconnue');
        console.error('❌ Échec de la connexion Supabase:', result.error);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setStatusMessage(`Erreur critique: ${error.message}`);
      console.error('💥 Erreur lors du test:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfiguration = async () => {
    if (!config.url || !config.key) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Sauvegarder la configuration
    const success = configureSupabase(config.url, config.key);
    
    if (success) {
      setIsConfigured(true);
      toast({
        title: "Configuration sauvegardée",
        description: "Configuration Supabase enregistrée avec succès"
      });
      
      // Forcer le rechargement de la page pour appliquer la nouvelle config
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const resetConfiguration = () => {
    localStorage.removeItem('supabase_config');
    setConfig({ url: '', key: '' });
    setIsConfigured(false);
    setConnectionStatus('pending');
    setStatusMessage('');
    toast({
      title: "Configuration réinitialisée",
      description: "Vous pouvez maintenant saisir de nouveaux paramètres."
    });
  };

  const useDefaultConfig = () => {
    const defaultConfig = {
      url: 'https://iynltojhdocgofmhedmk.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY'
    };
    
    setConfig(defaultConfig);
    configureSupabase(defaultConfig.url, defaultConfig.key);
    setIsConfigured(true);
    
    toast({
      title: "Configuration par défaut appliquée",
      description: "La configuration recommandée a été utilisée"
    });
    
    // Test immédiat avec la nouvelle config
    setTimeout(() => {
      testConnectionStatus();
    }, 500);
  };

  if (isConfigured) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuration Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Supabase configuré
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={testConnectionStatus} disabled={isTesting} variant="outline" size="sm">
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Test...
                  </>
                ) : (
                  'Tester'
                )}
              </Button>
              <Button onClick={resetConfiguration} variant="outline" size="sm">
                Reconfigurer
              </Button>
            </div>
          </div>

          {/* Statut de connexion détaillé */}
          {connectionStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">✅ {statusMessage}</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">❌ Erreur de connexion</span>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Détails:</p>
                <p className="text-sm text-red-600">{statusMessage}</p>
                <div className="mt-2">
                  <Button onClick={useDefaultConfig} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Utiliser la Config Par Défaut
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isTesting && (
            <div className="flex items-center space-x-2 p-3 bg-blue-100 rounded-lg">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-800">{statusMessage}</span>
            </div>
          )}

          {/* Informations de débogage */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <details>
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                Informations de débogage
              </summary>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>URL: {config.url}</p>
                <p>Clé: {config.key ? `${config.key.substring(0, 20)}...` : 'Non définie'}</p>
                <p>Statut: {connectionStatus}</p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration Supabase
        </CardTitle>
        <p className="text-sm text-gray-600">
          Connectez votre base de données Supabase
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Configuration Recommandée</p>
            <p className="text-xs text-amber-700">
              Utilisez directement la configuration par défaut ou saisissez vos propres paramètres.
            </p>
            <Button onClick={useDefaultConfig} size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
              Utiliser Config Par Défaut
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="supabase-url">URL du projet Supabase</Label>
          <Input
            id="supabase-url"
            value={config.url}
            onChange={(e) => setConfig({...config, url: e.target.value})}
            placeholder="https://xxxxx.supabase.co"
          />
        </div>

        <div>
          <Label htmlFor="supabase-key">Clé API publique (anon key)</Label>
          <Input
            id="supabase-key"
            value={config.key}
            onChange={(e) => setConfig({...config, key: e.target.value})}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={saveConfiguration}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sauvegarder Configuration
          </Button>
          <Button 
            onClick={testConnectionStatus}
            variant="outline"
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Test...
              </>
            ) : (
              'Tester la Connexion'
            )}
          </Button>
        </div>

        {/* Messages de statut */}
        {connectionStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">✅ {statusMessage}</span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">❌ Échec de connexion</span>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">{statusMessage}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Configuration Par Défaut :</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>URL :</strong> https://iynltojhdocgofmhedmk.supabase.co</p>
            <p><strong>Clé :</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
            <p className="text-xs mt-2 text-blue-600">
              💡 Cliquez sur "Utiliser Config Par Défaut" pour une configuration automatique
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConfig;
