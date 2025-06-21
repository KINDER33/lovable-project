
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff, RefreshCw, Database, Shield } from 'lucide-react';

const DatabaseStatusIndicator = () => {
  const { databaseType, isOnline, reconnect, forceOffline } = useDatabase();
  const { toast } = useToast();
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const handleReconnect = async () => {
    setIsReconnecting(true);
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
          description: "Reste en mode hors ligne",
          variant: "destructive"
        });
      }
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleForceOffline = async () => {
    try {
      await forceOffline();
      toast({
        title: "Mode hors ligne activé",
        description: "Travail hors ligne en cours",
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
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Base de données :</span>
        </div>
        
        {isOnline ? (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            En ligne
          </Badge>
        ) : (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            Hors ligne
          </Badge>
        )}

        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Production
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {!isOnline && (
          <Button 
            onClick={handleReconnect}
            variant="outline"
            size="sm"
            disabled={isReconnecting}
          >
            {isReconnecting ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Reconnexion...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 mr-1" />
                Reconnecter
              </>
            )}
          </Button>
        )}
        
        {isOnline && (
          <Button 
            onClick={handleForceOffline}
            variant="outline"
            size="sm"
          >
            <WifiOff className="w-3 h-3 mr-1" />
            Mode hors ligne
          </Button>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatusIndicator;
