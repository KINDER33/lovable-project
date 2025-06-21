
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const SystemDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Configuration système
    const dbConfig = localStorage.getItem('db_config_encrypted');
    const systemInit = localStorage.getItem('system_initialized');
    const adminCreated = localStorage.getItem('admin_user_created');

    diagnostics.push({
      name: 'Configuration Base de Données',
      status: dbConfig ? 'success' : 'error',
      message: dbConfig ? 'Configuration trouvée' : 'Configuration manquante',
      details: dbConfig ? 'DB configurée correctement' : 'Exécutez la configuration'
    });

    diagnostics.push({
      name: 'Initialisation Système',
      status: systemInit === 'true' ? 'success' : 'error',
      message: systemInit === 'true' ? 'Système initialisé' : 'Système non initialisé',
      details: systemInit === 'true' ? 'Prêt pour production' : 'Terminez l\'initialisation'
    });

    diagnostics.push({
      name: 'Utilisateur Admin',
      status: adminCreated === 'true' ? 'success' : 'error',
      message: adminCreated === 'true' ? 'Admin créé' : 'Aucun admin',
      details: adminCreated === 'true' ? 'Compte admin disponible' : 'Créez un compte admin'
    });

    // Test 2: Connexion Supabase
    try {
      const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
      diagnostics.push({
        name: 'Connexion Supabase',
        status: error ? 'error' : 'success',
        message: error ? 'Erreur de connexion' : 'Connexion active',
        details: error ? error.message : `Base de données accessible`
      });
    } catch (err: any) {
      diagnostics.push({
        name: 'Connexion Supabase',
        status: 'error',
        message: 'Échec de connexion',
        details: err.message
      });
    }

    // Test 3: Utilisateurs en base
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('username, role, is_active')
        .eq('is_active', true);

      const adminUsers = users?.filter(u => u.role === 'admin') || [];
      
      diagnostics.push({
        name: 'Utilisateurs en Base',
        status: adminUsers.length > 0 ? 'success' : 'warning',
        message: `${users?.length || 0} utilisateurs, ${adminUsers.length} admins`,
        details: adminUsers.length > 0 ? 'Au moins un admin disponible' : 'Aucun admin en base'
      });
    } catch (err: any) {
      diagnostics.push({
        name: 'Utilisateurs en Base',
        status: 'error',
        message: 'Impossible de vérifier',
        details: err.message
      });
    }

    // Test 4: Configuration centre
    const centerConfig = localStorage.getItem('center_config');
    try {
      const center = centerConfig ? JSON.parse(centerConfig) : null;
      diagnostics.push({
        name: 'Configuration Centre',
        status: center?.centerName ? 'success' : 'warning',
        message: center?.centerName ? `Centre: ${center.centerName}` : 'Configuration incomplète',
        details: center?.centerName ? 'Informations centre disponibles' : 'Configurez les informations du centre'
      });
    } catch {
      diagnostics.push({
        name: 'Configuration Centre',
        status: 'warning',
        message: 'Configuration corrompue',
        details: 'Reconfigurez les informations du centre'
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  const isSystemReady = errorCount === 0 && results.length > 0;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Diagnostic Système Complet
          </CardTitle>
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Relancer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <p className="font-medium text-gray-900">{result.name}</p>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(result.status)}>
                {result.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
        
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Résumé du Diagnostic</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-gray-600">Réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
                <div className="text-gray-600">Avertissements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-gray-600">Erreurs</div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${isSystemReady ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center gap-2">
                {isSystemReady ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${isSystemReady ? 'text-green-800' : 'text-red-800'}`}>
                  {isSystemReady ? '✅ Système prêt pour la production' : '❌ Système non prêt - Corrigez les erreurs'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemDiagnostic;
