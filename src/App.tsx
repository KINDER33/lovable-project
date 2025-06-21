
import React from 'react';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { HybridAuthProvider } from '@/contexts/HybridAuthContext';
import { Toaster } from '@/components/ui/toaster';
import SimpleMainApp from '@/components/SimpleMainApp';

function App() {
  console.log('🚀 Démarrage de l\'application Caisse Médicale');

  return (
    <DatabaseProvider>
      <HybridAuthProvider>
        <SimpleMainApp />
        <Toaster />
      </HybridAuthProvider>
    </DatabaseProvider>
  );
}

export default App;
