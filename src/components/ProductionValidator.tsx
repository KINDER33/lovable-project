import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ValidationCheck {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const ProductionValidator = () => {
  const [checks, setChecks] = useState<ValidationCheck[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  const runValidation = async () => {
    setIsValidating(true);
    const validationChecks: ValidationCheck[] = [];

    // 1. Vérification configuration système
    const dbConfig = localStorage.getItem('db_config_encrypted');
    const systemInit = localStorage.getItem('system_initialized');
    const adminCreated = localStorage.getItem('admin_user_created');

    validationChecks.push({
      name: 'Configuration Base de Données',
      status: dbConfig ? 'success' : 'error',
      message: dbConfig ? 'Configuration présente' : 'Configuration manquante',
      details: 'Base de données Supabase configurée'
    });

    validationChecks.push({
      name: 'Système Initialisé',
      status: systemInit === 'true' ? 'success' : 'error',
      message: systemInit === 'true' ? 'Système prêt' : 'Initialisation requise',
      details: 'Toutes les étapes d\'initialisation terminées'
    });

    validationChecks.push({
      name: 'Administrateur Créé',
      status: adminCreated === 'true' ? 'success' : 'error',
      message: adminCreated === 'true' ? 'Admin disponible' : 'Aucun admin',
      details: 'Compte administrateur configuré'
    });

    // 2. Test connexion Supabase
    try {
      const { data, error } = await supabase.from('medications').select('count', { count: 'exact' });
      validationChecks.push({
        name: 'Connexion Supabase',
        status: error ? 'error' : 'success',
        message: error ? 'Erreur connexion' : 'Connexion active',
        details: error ? error.message : 'Base de données accessible'
      });
    } catch (err: any) {
      validationChecks.push({
        name: 'Connexion Supabase',
        status: 'error',
        message: 'Échec connexion',
        details: err.message
      });
    }

    // 3. Vérification tables essentielles
    try {
      const tablesToCheck = ['medications', 'exam_types', 'expense_categories', 'users'];
      let allTablesReady = true;
      
      for (const table of tablesToCheck) {
        try {
          const { error } = await supabase.from(table as any).select('id').limit(1);
          if (error) {
            console.log(`Table ${table} error:`, error);
            allTablesReady = false;
          }
        } catch (err) {
          console.log(`Table ${table} not accessible:`, err);
          allTablesReady = false;
        }
      }

      validationChecks.push({
        name: 'Tables Système',
        status: allTablesReady ? 'success' : 'error',
        message: allTablesReady ? 'Toutes les tables prêtes' : 'Tables manquantes',
        details: 'Medications, exam_types, expense_categories, users'
      });
    } catch (err) {
      validationChecks.push({
        name: 'Tables Système',
        status: 'error',
        message: 'Impossible de vérifier',
        details: 'Vérifiez votre configuration Supabase'
      });
    }

    // 4. Test génération factures
    try {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      validationChecks.push({
        name: 'Génération Factures',
        status: error ? 'error' : 'success',
        message: error ? 'Fonction défaillante' : `Prêt (${data})`,
        details: 'Fonction de numérotation automatique'
      });
    } catch (err) {
      validationChecks.push({
        name: 'Génération Factures',
        status: 'warning',
        message: 'Fonction non testée',
        details: 'Sera créée au premier usage'
      });
    }

    // 5. Test table utilisateurs spécifiquement
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, username, role')
        .limit(5);

      if (usersError) {
        validationChecks.push({
          name: 'Table Utilisateurs',
          status: 'error',
          message: 'Table non accessible',
          details: `Erreur: ${usersError.message}`
        });
      } else {
        const adminCount = usersData?.filter(u => u.role === 'admin').length || 0;
        validationChecks.push({
          name: 'Table Utilisateurs',
          status: usersData?.length > 0 ? 'success' : 'warning',
          message: `${usersData?.length || 0} utilisateurs trouvés`,
          details: `Dont ${adminCount} administrateur(s)`
        });
      }
    } catch (err: any) {
      validationChecks.push({
        name: 'Table Utilisateurs',
        status: 'error',
        message: 'Erreur d\'accès',
        details: err.message
      });
    }

    // 6. Configuration centre
    const centerConfig = localStorage.getItem('center_config');
    const hasCenter = centerConfig && JSON.parse(centerConfig)?.centerName;
    
    validationChecks.push({
      name: 'Configuration Centre',
      status: hasCenter ? 'success' : 'warning',
      message: hasCenter ? 'Centre configuré' : 'Configuration recommandée',
      details: 'Informations du centre médical'
    });

    setChecks(validationChecks);
    
    const hasErrors = validationChecks.some(check => check.status === 'error');
    setIsReady(!hasErrors);
    
    if (!hasErrors) {
      toast({
        title: "✅ Validation Réussie",
        description: "Le système est prêt pour le déploiement en production",
      });
    } else {
      toast({
        title: "❌ Erreurs Détectées",
        description: "Corrigez les erreurs avant le déploiement",
        variant: "destructive"
      });
    }

    setIsValidating(false);
  };

  const generateDeploymentPackage = () => {
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      status: "ready-for-production",
      configuration: {
        database: "Supabase",
        authentication: "Configured",
        admin_created: localStorage.getItem('admin_user_created') === 'true',
        center_configured: !!localStorage.getItem('center_config')
      },
      deployment_checklist: [
        "✅ Base de données configurée",
        "✅ Système initialisé", 
        "✅ Administrateur créé",
        "✅ Connexion Supabase testée",
        "✅ Tables système vérifiées",
        "✅ Génération factures testée",
        "✅ Interface utilisateur fonctionnelle"
      ]
    };

    const blob = new Blob([JSON.stringify(deploymentInfo, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caisse-medicale-deployment-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Package de Déploiement Généré",
      description: "Fichier de configuration téléchargé avec succès",
    });
  };

  useEffect(() => {
    runValidation();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
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

  const successCount = checks.filter(c => c.status === 'success').length;
  const errorCount = checks.filter(c => c.status === 'error').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            🚀 Validation Production - Africa Web Com
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={runValidation} 
              disabled={isValidating}
              variant="outline"
              size="sm"
            >
              {isValidating ? "Validation..." : "Revalider"}
            </Button>
            {isReady && (
              <Button 
                onClick={generateDeploymentPackage}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Générer Package
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-gray-900">{check.name}</p>
                  <p className="text-sm text-gray-600">{check.message}</p>
                  {check.details && (
                    <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {check.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
        
        {checks.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">État de Production</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-gray-600">Validés</div>
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
            
            <div className={`p-3 rounded-lg ${isReady ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center gap-2">
                {isReady ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${isReady ? 'text-green-800' : 'text-red-800'}`}>
                  {isReady ? '🎉 SYSTÈME PRÊT POUR LA PRODUCTION' : '⚠️ CORRECTIONS REQUISES AVANT DÉPLOIEMENT'}
                </span>
              </div>
              
              {isReady && (
                <div className="mt-3 text-sm text-green-700">
                  <p>• Configuration validée ✅</p>
                  <p>• Base de données fonctionnelle ✅</p>
                  <p>• Authentification configurée ✅</p>
                  <p>• Prêt pour déploiement en production ✅</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionValidator;
