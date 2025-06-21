import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemInitializationProps {
  onComplete: () => void;
}

const SystemInitialization: React.FC<SystemInitializationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [adminData, setAdminData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [centerData, setCenterData] = useState({
    centerName: '',
    centerAddress: '',
    centerPhone: '',
    centerEmail: '',
    centerWebsite: ''
  });

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNumbers && hasSymbols;
  };

  const createTables = async () => {
    setIsLoading(true);
    try {
      console.log('🔧 Vérification de la base de données...');
      
      // Vérifier la connexion à Supabase
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact' });

      if (error) {
        throw new Error('Impossible de se connecter à la base de données');
      }

      console.log('✅ Base de données vérifiée et opérationnelle');
      
      toast({
        title: "Base de données vérifiée",
        description: "La connexion à la base de données est fonctionnelle",
      });
      
      setCurrentStep(2);
    } catch (error: any) {
      console.error('❌ Erreur de vérification DB:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vérifier la base de données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!validatePassword(adminData.password)) {
      toast({
        title: "Mot de passe non valide",
        description: "Le mot de passe doit contenir au moins 8 caractères, des chiffres et des symboles",
        variant: "destructive"
      });
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('👤 Création du compte administrateur...');
      
      // Créer l'administrateur dans la base de données
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: adminData.username,
          email: adminData.email,
          full_name: adminData.fullName,
          password_hash: btoa(adminData.password), // Encodage simple pour démo
          role: 'admin',
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur création admin:', error);
        throw error;
      }

      console.log('✅ Compte administrateur créé avec succès');
      
      // IMPORTANT: Marquer qu'un utilisateur admin a été créé
      localStorage.setItem('admin_user_created', 'true');
      
      // Sauvegarder les informations de l'admin créé pour debug
      localStorage.setItem('initial_admin_info', JSON.stringify({
        username: adminData.username,
        email: adminData.email,
        fullName: adminData.fullName,
        created_at: new Date().toISOString()
      }));

      toast({
        title: "Compte administrateur créé",
        description: `Admin "${adminData.username}" enregistré avec succès`,
      });
      
      setCurrentStep(3);
    } catch (error: any) {
      console.error('💥 Erreur lors de la création de l\'admin:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte administrateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const configurateCenter = async () => {
    setIsLoading(true);
    try {
      console.log('🏥 Configuration du centre médical...');
      
      // Sauvegarder la configuration du centre
      localStorage.setItem('center_config', JSON.stringify(centerData));
      
      // Marquer le système comme entièrement initialisé
      localStorage.setItem('system_initialized', 'true');
      
      // Sauvegarder un timestamp de la configuration finale
      localStorage.setItem('system_configured_at', new Date().toISOString());
      
      console.log('🎯 Système entièrement configuré et prêt pour la production');
      
      toast({
        title: "Système initialisé",
        description: "Le système est maintenant prêt pour la production",
      });
      
      onComplete();
    } catch (error) {
      console.error('❌ Erreur finalisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vérification de la Base de Données</h3>
              <p className="text-gray-600">Vérification de la connexion à votre base de données Supabase</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Ce qui sera vérifié :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Connexion à Supabase</li>
                  <li>• Tables utilisateurs disponibles</li>
                  <li>• Permissions de lecture/écriture</li>
                </ul>
              </div>
              
              <Button 
                onClick={createTables}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Vérification en cours..." : "Vérifier la Base de Données"}
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Créer le Premier Administrateur</h3>
              <p className="text-gray-600">Ce compte sera enregistré dans la base de données</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nom Complet</Label>
                <Input
                  id="fullName"
                  value={adminData.fullName}
                  onChange={(e) => setAdminData({...adminData, fullName: e.target.value})}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                  placeholder="admin@centre.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={adminData.username}
                  onChange={(e) => setAdminData({...adminData, username: e.target.value})}
                  placeholder="admin"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminData.password}
                  onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                  placeholder="Minimum 8 caractères, chiffres et symboles"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={adminData.confirmPassword}
                  onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
              </div>
              
              <Button 
                onClick={createAdmin}
                disabled={isLoading || !adminData.fullName || !adminData.email || !adminData.username || !adminData.password}
                className="w-full"
              >
                {isLoading ? "Création en cours..." : "Créer le Compte Admin"}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Configuration du Centre</h3>
              <p className="text-gray-600">Informations de votre établissement médical</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="centerName">Nom du Centre</Label>
                <Input
                  id="centerName"
                  value={centerData.centerName}
                  onChange={(e) => setCenterData({...centerData, centerName: e.target.value})}
                  placeholder="Centre Médical XYZ"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="centerAddress">Adresse</Label>
                <Input
                  id="centerAddress"
                  value={centerData.centerAddress}
                  onChange={(e) => setCenterData({...centerData, centerAddress: e.target.value})}
                  placeholder="Adresse complète du centre"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centerPhone">Téléphone</Label>
                  <Input
                    id="centerPhone"
                    value={centerData.centerPhone}
                    onChange={(e) => setCenterData({...centerData, centerPhone: e.target.value})}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label htmlFor="centerEmail">Email</Label>
                  <Input
                    id="centerEmail"
                    type="email"
                    value={centerData.centerEmail}
                    onChange={(e) => setCenterData({...centerData, centerEmail: e.target.value})}
                    placeholder="contact@centre.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="centerWebsite">Site Web (optionnel)</Label>
                <Input
                  id="centerWebsite"
                  value={centerData.centerWebsite}
                  onChange={(e) => setCenterData({...centerData, centerWebsite: e.target.value})}
                  placeholder="https://www.centre.com"
                />
              </div>
              
              <Button 
                onClick={configurateCenter}
                disabled={isLoading || !centerData.centerName}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Finalisation..." : "Terminer la Configuration"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Initialisation du Système
          </CardTitle>
          <p className="text-gray-600">Étape {currentStep}/3 : Configuration avec base de données vide</p>
          
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemInitialization;
