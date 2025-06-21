
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SecurityTab = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    // Charger les paramètres de sécurité existants
    const savedSecurity = localStorage.getItem('security_settings');
    if (savedSecurity) {
      const settings = JSON.parse(savedSecurity);
      setTwoFactorAuth(settings.twoFactorAuth || false);
      setAutoLogout(settings.autoLogout || false);
    }
  }, []);

  const handleSecurityUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Validation des mots de passe
      if (adminPassword && adminPassword !== confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive"
        });
        return;
      }

      if (adminPassword && adminPassword.length < 6) {
        toast({
          title: "Erreur", 
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive"
        });
        return;
      }

      // Sauvegarder les paramètres de sécurité
      const securitySettings = {
        twoFactorAuth,
        autoLogout,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('security_settings', JSON.stringify(securitySettings));

      // Sauvegarder le nouveau mot de passe si fourni
      if (adminPassword) {
        localStorage.setItem('admin_password_hash', btoa(adminPassword));
        console.log('Mot de passe administrateur mis à jour');
      }

      toast({
        title: "Sécurité mise à jour",
        description: "Les paramètres de sécurité ont été sauvegardés avec succès",
      });

      // Réinitialiser les champs de mot de passe
      setAdminPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la sécurité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de sécurité",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité et Accès
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adminPassword">Nouveau mot de passe administrateur</Label>
            <Input 
              id="adminPassword" 
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le nouveau mot de passe"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-600">Sécurité renforcée avec code SMS</p>
            </div>
            <Switch 
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Déconnexion automatique</Label>
              <p className="text-sm text-gray-600">Se déconnecter après 30 min d'inactivité</p>
            </div>
            <Switch 
              checked={autoLogout}
              onCheckedChange={setAutoLogout}
            />
          </div>
          <Button 
            onClick={handleSecurityUpdate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Mise à jour...' : 'Mettre à jour la sécurité'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
