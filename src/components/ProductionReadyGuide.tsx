
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Server, Shield, Database, FileText, Download } from 'lucide-react';

const ProductionReadyGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const deploymentSteps = [
    {
      id: 1,
      title: "Configuration Serveur Local",
      icon: <Server className="w-5 h-5" />,
      items: [
        "Installer Node.js 18+ et npm/yarn",
        "Configurer PostgreSQL ou utiliser Supabase local",
        "Définir les variables d'environnement (.env.local)",
        "Tester la connectivité réseau local"
      ]
    },
    {
      id: 2,
      title: "Sécurité et Accès",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Créer un compte administrateur initial",
        "Définir des mots de passe forts",
        "Configurer les droits d'accès (admin/caissier)",
        "Activer HTTPS si nécessaire"
      ]
    },
    {
      id: 3,
      title: "Base de Données",
      icon: <Database className="w-5 h-5" />,
      items: [
        "✅ Données sensibles supprimées",
        "✅ Configuration système initialisée",
        "Configurer les sauvegardes automatiques",
        "Tester la fonction de génération de factures"
      ]
    },
    {
      id: 4,
      title: "Documentation et Formation",
      icon: <FileText className="w-5 h-5" />,
      items: [
        "Guide d'utilisation pour caissiers",
        "Procédures de sauvegarde",
        "Manuel de dépannage",
        "Formation utilisateurs"
      ]
    }
  ];

  const generateInstallationScript = () => {
    const script = `#!/bin/bash
# Script d'installation - Centre Médical
# Généré automatiquement

echo "=== INSTALLATION CENTRE MÉDICAL ==="

# 1. Vérification des prérequis
echo "Vérification Node.js..."
node --version || { echo "Node.js requis"; exit 1; }

# 2. Installation des dépendances
echo "Installation des dépendances..."
npm install

# 3. Configuration de l'environnement
echo "Configuration de l'environnement..."
cp .env.example .env.local
echo "⚠️  Modifiez .env.local avec vos paramètres"

# 4. Build de production
echo "Construction de l'application..."
npm run build

# 5. Lancement
echo "Démarrage du serveur..."
npm run preview

echo "=== INSTALLATION TERMINÉE ==="
echo "Accédez à http://localhost:4173"
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'install-centre-medical.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateEnvTemplate = () => {
    const envContent = `# Configuration Centre Médical - Production
# Modifiez ces valeurs selon votre environnement

# Base de données Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon

# Configuration réseau local
VITE_APP_NAME="Centre Médical"
VITE_APP_VERSION="1.0.0"

# Sécurité (à modifier absolument)
VITE_ADMIN_DEFAULT_PASSWORD=MotDePasseFort123!

# Optionnel: Configuration imprimante
VITE_PRINTER_NAME="HP_LaserJet"
VITE_PRINT_FORMAT="A4"
`;

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.local';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Guide de Déploiement Production
          </CardTitle>
          <p className="text-gray-600">
            Suivez ces étapes pour déployer le système sur votre serveur local
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deploymentSteps.map((step) => (
              <div key={step.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {step.icon}
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={completedSteps.includes(step.id) ? "default" : "secondary"}
                      className={completedSteps.includes(step.id) ? "bg-green-100 text-green-800" : ""}
                    >
                      {completedSteps.includes(step.id) ? "Terminé" : "En attente"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStep(step.id)}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "Marquer terminé"
                      )}
                    </Button>
                  </div>
                </div>
                <ul className="space-y-2">
                  {step.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {item.startsWith('✅') ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">{item.replace('✅ ', '')}</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 border border-gray-300 rounded"></div>
                          <span className="text-gray-700">{item}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-4">Fichiers de Configuration</h3>
            <div className="flex space-x-4">
              <Button onClick={generateInstallationScript} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Script d'Installation
              </Button>
              <Button onClick={generateEnvTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Template .env
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ Prérequis Techniques</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Serveur avec 2GB RAM minimum</li>
              <li>• Node.js 18+ installé</li>
              <li>• PostgreSQL ou accès Supabase</li>
              <li>• Connexion internet pour les mises à jour</li>
              <li>• Imprimante thermique (optionnel)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionReadyGuide;
