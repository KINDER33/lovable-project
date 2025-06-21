
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Wifi, WifiOff, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/hooks/use-toast';

const SafeSettings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { databaseType, isOnline, reconnect, forceOffline } = useDatabase();
  const { toast } = useToast();
  
  const [centerConfig, setCenterConfig] = useState({
    name: 'Centre Médical',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    // Charger la configuration du centre
    const savedConfig = localStorage.getItem('center_config');
    if (savedConfig) {
      try {
        setCenterConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erreur chargement config centre:', error);
      }
    }
  }, []);

  const saveCenterConfig = () => {
    try {
      localStorage.setItem('center_config', JSON.stringify(centerConfig));
      toast({
        title: "Configuration sauvegardée",
        description: "Les informations du centre ont été mises à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    }
  };

  const handleReconnect = async () => {
    try {
      const success = await reconnect();
      if (success) {
        toast({
          title: "Reconnexion réussie",
          description: "Base de données reconnectée",
        });
      } else {
        toast({
          title: "Reconnexion échouée",
          description: "Impossible de se reconnecter",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la reconnexion",
        variant: "destructive"
      });
    }
  };

  const handleForceOffline = async () => {
    try {
      await forceOffline();
      toast({
        title: "Mode hors ligne activé",
        description: "Système basculé en mode hors ligne",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de basculer hors ligne",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Paramètres du Système
          </h1>
          <p className="text-gray-600">Configuration et gestion du système</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {databaseType === 'mysql' ? 'MySQL' : databaseType === 'supabase' ? 'Supabase' : 'Hors ligne'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="center">Centre Médical</TabsTrigger>
          <TabsTrigger value="database">Base de Données</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                État du Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Type de Base</h3>
                  <p className="text-sm text-blue-700 capitalize">{databaseType || 'Non défini'}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Statut</h3>
                  <p className="text-sm text-green-700">{isOnline ? 'En ligne' : 'Hors ligne'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isOnline && (
                  <Button onClick={handleReconnect} variant="outline">
                    <Wifi className="w-4 h-4 mr-2" />
                    Reconnecter
                  </Button>
                )}
                {isOnline && (
                  <Button onClick={handleForceOffline} variant="outline">
                    <WifiOff className="w-4 h-4 mr-2" />
                    Mode Hors Ligne
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="center">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du Centre Médical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="centerName">Nom du Centre</Label>
                <Input
                  id="centerName"
                  value={centerConfig.name}
                  onChange={(e) => setCenterConfig({...centerConfig, name: e.target.value})}
                  placeholder="Centre Médical"
                />
              </div>
              
              <div>
                <Label htmlFor="centerAddress">Adresse</Label>
                <Input
                  id="centerAddress"
                  value={centerConfig.address}
                  onChange={(e) => setCenterConfig({...centerConfig, address: e.target.value})}
                  placeholder="Adresse complète"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centerPhone">Téléphone</Label>
                  <Input
                    id="centerPhone"
                    value={centerConfig.phone}
                    onChange={(e) => setCenterConfig({...centerConfig, phone: e.target.value})}
                    placeholder="+XXX XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="centerEmail">Email</Label>
                  <Input
                    id="centerEmail"
                    type="email"
                    value={centerConfig.email}
                    onChange={(e) => setCenterConfig({...centerConfig, email: e.target.value})}
                    placeholder="contact@centre.com"
                  />
                </div>
              </div>
              
              <Button onClick={saveCenterConfig} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sauvegarder la Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Gestion de la Base de Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Configuration Base de Données</p>
                    <p className="text-xs text-yellow-700">
                      La configuration de base de données est effectuée au premier démarrage du système.
                      Pour modifier, redémarrez l'application et reconfigurez.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Configuration Actuelle :</h4>
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="text-sm"><strong>Type :</strong> {databaseType || 'Non configuré'}</p>
                  <p className="text-sm"><strong>État :</strong> {isOnline ? 'Connecté' : 'Déconnecté'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Sécurité Active</p>
                    <p className="text-xs text-green-700">
                      • Authentification requise pour tous les accès<br/>
                      • Sessions sécurisées<br/>
                      • Données chiffrées localement
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Informations de Sécurité :</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Connexion requise à chaque démarrage</li>
                  <li>• Données stockées de manière sécurisée</li>
                  <li>• Audit des actions utilisateurs</li>
                  <li>• Protection contre les accès non autorisés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafeSettings;
