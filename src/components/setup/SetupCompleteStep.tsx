
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, LogIn } from 'lucide-react';

interface AdminData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface SetupCompleteStepProps {
  adminData: AdminData;
  onFinish: () => void;
}

const SetupCompleteStep: React.FC<SetupCompleteStepProps> = ({ adminData, onFinish }) => {
  const { toast } = useToast();

  const finishSetup = () => {
    console.log('✅ Configuration terminée - passage à l\'interface de connexion');
    toast({
      title: "Configuration terminée",
      description: "Vous pouvez maintenant vous connecter avec votre compte administrateur",
    });
    onFinish();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Étape 3 : Configuration Terminée</h3>
        <p className="text-gray-600">Le système est maintenant prêt à utiliser</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Compte Administrateur Créé :</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li><strong>Nom :</strong> {adminData.fullName}</li>
            <li><strong>Utilisateur :</strong> {adminData.username}</li>
            <li><strong>Email :</strong> {adminData.email}</li>
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Prochaine étape :</h4>
          <p className="text-sm text-blue-800">
            Vous allez être redirigé vers l'interface de connexion du logiciel.
            Utilisez les identifiants que vous venez de créer pour vous connecter.
          </p>
        </div>
        
        <Button 
          onClick={finishSetup}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Aller à l'Interface de Connexion
        </Button>
      </div>
    </div>
  );
};

export default SetupCompleteStep;
