
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DatabaseConfigStep from './setup/DatabaseConfigStep';
import AdminCreationStep from './setup/AdminCreationStep';
import SetupCompleteStep from './setup/SetupCompleteStep';
import SetupProgressIndicator from './setup/SetupProgressIndicator';

interface FirstTimeSetupProps {
  onComplete: () => void;
}

interface AdminData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adminData, setAdminData] = useState<AdminData>({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleDatabaseConfigSuccess = () => {
    setCurrentStep(2);
  };

  const handleAdminCreationSuccess = (data: AdminData) => {
    setAdminData(data);
    setCurrentStep(3);
  };

  const handleSetupComplete = () => {
    onComplete();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DatabaseConfigStep onSuccess={handleDatabaseConfigSuccess} />;
      case 2:
        return <AdminCreationStep onSuccess={handleAdminCreationSuccess} />;
      case 3:
        return <SetupCompleteStep adminData={adminData} onFinish={handleSetupComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Configuration Initiale du Système
          </CardTitle>
          <SetupProgressIndicator currentStep={currentStep} totalSteps={3} />
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstTimeSetup;
