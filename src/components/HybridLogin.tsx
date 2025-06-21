
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Building2, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const HybridLogin = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useHybridAuth();
  const { databaseType, isOnline, initializationMessage, reconnect, forceOffline } = useDatabase();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez saisir votre nom d'utilisateur et mot de passe",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Tentative de connexion avec:', credentials.username);
      const success = await login(credentials.username, credentials.password);
      
      if (success) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue dans le système de caisse médicale`,
        });
        console.log('✅ Connexion réussie');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect",
          variant: "destructive"
        });
        console.log('❌ Échec de connexion');
      }
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      toast({
        title: "Erreur système",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = async () => {
    setIsLoading(true);
    try {
      const success = await reconnect();
      if (success) {
        toast({
          title: "Reconnexion réussie",
          description: "Maintenant connecté en ligne",
        });
      } else {
        toast({
          title: "Reconnexion échouée",
          description: "Impossible de se connecter en ligne",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceOffline = async () => {
    setIsLoading(true);
    try {
      await forceOffline();
      toast({
        title: "Mode hors ligne activé",
        description: "Vous travaillez maintenant hors ligne",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer le mode hors ligne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Caisse Médicale
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">En ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-600">Hors ligne</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{initializationMessage}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Nom d'utilisateur"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Mot de passe"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Informations de connexion par défaut */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Comptes par défaut:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>Caissier:</strong> caissier / caissier123</div>
            </div>
          </div>

          {/* Options de connexion */}
          <div className="border-t pt-4 space-y-2">
            {!isOnline && (
              <Button 
                onClick={handleReconnect}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reconnecter en ligne
              </Button>
            )}
            
            {isOnline && (
              <Button 
                onClick={handleForceOffline}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <WifiOff className="w-4 h-4 mr-2" />
                Mode hors ligne
              </Button>
            )}
          </div>

          {/* Statut système */}
          <div className="text-xs text-center text-gray-500">
            <p>Version Production | Mode : {isOnline ? 'En ligne' : 'Hors ligne'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HybridLogin;
