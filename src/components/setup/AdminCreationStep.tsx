
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import { useDatabase } from '@/contexts/DatabaseContext';

interface AdminData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AdminCreationStepProps {
  onSuccess: (adminData: AdminData) => void;
}

const AdminCreationStep: React.FC<AdminCreationStepProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { adapter } = useDatabase();
  const { toast } = useToast();

  const [adminData, setAdminData] = useState<AdminData>({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const createFirstAdmin = async () => {
    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (adminData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    if (!adapter) {
      toast({
        title: "Erreur",
        description: "Base de données non disponible",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔧 Création du premier compte administrateur...');
      
      const result = await adapter.createUser({
        username: adminData.username,
        email: adminData.email,
        fullName: adminData.fullName,
        password: adminData.password,
        role: 'admin'
      });

      console.log('📝 Résultat création premier admin:', result);

      if (!result.error) {
        console.log('✅ Premier compte administrateur créé avec succès');
        
        localStorage.setItem('system_initialized', 'true');
        localStorage.setItem('admin_created', 'true');
        localStorage.setItem('admin_username', adminData.username);
        
        toast({
          title: "Compte créé",
          description: `Compte administrateur "${adminData.username}" créé avec succès`,
        });
        
        onSuccess(adminData);
      } else {
        console.error('❌ Erreur création premier admin:', result.error);
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('💥 Erreur création premier admin:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte administrateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Étape 2 : Création Compte Administrateur</h3>
        <p className="text-gray-600">Créez le premier compte administrateur du système</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nom Complet *</Label>
          <Input
            id="fullName"
            value={adminData.fullName}
            onChange={(e) => setAdminData({...adminData, fullName: e.target.value})}
            placeholder="Votre nom complet"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Adresse Email *</Label>
          <Input
            id="email"
            type="email"
            value={adminData.email}
            onChange={(e) => setAdminData({...adminData, email: e.target.value})}
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="username">Nom d'utilisateur *</Label>
          <Input
            id="username"
            value={adminData.username}
            onChange={(e) => setAdminData({...adminData, username: e.target.value})}
            placeholder="admin"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              value={adminData.password}
              onChange={(e) => setAdminData({...adminData, password: e.target.value})}
              placeholder="Minimum 6 caractères"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={adminData.confirmPassword}
              onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
              placeholder="Confirmer"
              required
            />
          </div>
        </div>
        
        <Button 
          onClick={createFirstAdmin}
          disabled={isLoading || !adminData.username || !adminData.password || !adminData.fullName || !adminData.email}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Création..." : "Créer le Compte Administrateur"}
        </Button>
      </div>
    </div>
  );
};

export default AdminCreationStep;
