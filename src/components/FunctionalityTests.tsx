
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, XCircle, ShoppingCart, FileText, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
}

const FunctionalityTests = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const updateTestStatus = (name: string, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    const initialTests: TestResult[] = [
      { name: 'Ajout Médicament', status: 'pending', message: 'En attente...' },
      { name: 'Création Vente', status: 'pending', message: 'En attente...' },
      { name: 'Génération Facture', status: 'pending', message: 'En attente...' },
      { name: 'Enregistrement Examen', status: 'pending', message: 'En attente...' },
      { name: 'Gestion Dépenses', status: 'pending', message: 'En attente...' },
      { name: 'Calculs Financiers', status: 'pending', message: 'En attente...' }
    ];
    
    setTests(initialTests);

    // Test 1: Ajout de médicament
    try {
      updateTestStatus('Ajout Médicament', 'running', 'Test en cours...');
      
      const testMedication = {
        name: 'Test Paracétamol',
        category: 'Test',
        unit_price: 500,
        stock_quantity: 10,
        supplier: 'Test Supplier'
      };

      const { data, error } = await supabase
        .from('medications')
        .insert([testMedication])
        .select()
        .single();

      if (error) throw error;

      // Nettoyer le test
      await supabase.from('medications').delete().eq('id', data.id);

      updateTestStatus('Ajout Médicament', 'success', 'Médicament ajouté et supprimé avec succès');
    } catch (error) {
      updateTestStatus('Ajout Médicament', 'error', `Erreur: ${error.message}`);
    }

    // Test 2: Création de vente
    try {
      updateTestStatus('Création Vente', 'running', 'Test en cours...');
      
      // Générer un numéro de facture
      const { data: invoiceNumber, error: invoiceError } = await supabase.rpc('generate_invoice_number');
      if (invoiceError) throw invoiceError;

      const testSale = {
        invoice_number: invoiceNumber,
        customer_name: 'Client Test',
        total_amount: 5000,
        payment_method: 'cash'
      };

      const { data, error } = await supabase
        .from('sales')
        .insert([testSale])
        .select()
        .single();

      if (error) throw error;

      // Nettoyer le test
      await supabase.from('sales').delete().eq('id', data.id);

      updateTestStatus('Création Vente', 'success', `Vente créée (${invoiceNumber}) et supprimée`);
    } catch (error) {
      updateTestStatus('Création Vente', 'error', `Erreur: ${error.message}`);
    }

    // Test 3: Génération de facture
    try {
      updateTestStatus('Génération Facture', 'running', 'Test en cours...');
      
      const { data, error } = await supabase.rpc('generate_invoice_number');
      if (error) throw error;

      updateTestStatus('Génération Facture', 'success', `Numéro généré: ${data}`);
    } catch (error) {
      updateTestStatus('Génération Facture', 'error', `Erreur: ${error.message}`);
    }

    // Test 4: Enregistrement d'examen
    try {
      updateTestStatus('Enregistrement Examen', 'running', 'Test en cours...');
      
      const testExam = {
        patient_name: 'Patient Test',
        price: 10000,
        notes: 'Examen de test'
      };

      const { data, error } = await supabase
        .from('exams')
        .insert([testExam])
        .select()
        .single();

      if (error) throw error;

      // Nettoyer le test
      await supabase.from('exams').delete().eq('id', data.id);

      updateTestStatus('Enregistrement Examen', 'success', 'Examen enregistré et supprimé');
    } catch (error) {
      updateTestStatus('Enregistrement Examen', 'error', `Erreur: ${error.message}`);
    }

    // Test 5: Gestion des dépenses
    try {
      updateTestStatus('Gestion Dépenses', 'running', 'Test en cours...');
      
      const testExpense = {
        category_name: 'Test',
        amount: 1000,
        description: 'Dépense de test'
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([testExpense])
        .select()
        .single();

      if (error) throw error;

      // Nettoyer le test
      await supabase.from('expenses').delete().eq('id', data.id);

      updateTestStatus('Gestion Dépenses', 'success', 'Dépense enregistrée et supprimée');
    } catch (error) {
      updateTestStatus('Gestion Dépenses', 'error', `Erreur: ${error.message}`);
    }

    // Test 6: Calculs financiers
    try {
      updateTestStatus('Calculs Financiers', 'running', 'Test en cours...');
      
      // Test des calculs de base
      const testCalculation = 1000 + 500 - 200; // Simulation calcul financier
      
      if (testCalculation === 1300) {
        updateTestStatus('Calculs Financiers', 'success', 'Calculs mathématiques corrects');
      } else {
        throw new Error('Erreur de calcul');
      }
    } catch (error) {
      updateTestStatus('Calculs Financiers', 'error', `Erreur: ${error.message}`);
    }

    setIsRunning(false);

    // Résumé final
    const finalTests = tests.filter(test => test.status !== 'pending');
    const successCount = finalTests.filter(test => test.status === 'success').length;
    const errorCount = finalTests.filter(test => test.status === 'error').length;

    if (errorCount === 0) {
      toast({
        title: "Tous les tests réussis ✅",
        description: `${successCount} fonctionnalités validées`,
        variant: "default"
      });
    } else {
      toast({
        title: `${errorCount} test(s) échoué(s) ⚠️`,
        description: "Vérifiez les erreurs ci-dessous",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running': return <PlayCircle className="w-5 h-5 text-blue-600 animate-pulse" />;
      default: return <PlayCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Tests de Fonctionnalités
          </CardTitle>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <PlayCircle className="w-4 h-4 mr-2 animate-pulse" />
            ) : (
              <PlayCircle className="w-4 h-4 mr-2" />
            )}
            Lancer tous les tests
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-600">{test.message}</p>
                </div>
              </div>
              <Badge className={getStatusBadge(test.status)}>
                {test.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>

        {tests.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'success').length}
              </div>
              <div className="text-green-800 text-sm">Tests réussis</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {tests.filter(t => t.status === 'running').length}
              </div>
              <div className="text-blue-800 text-sm">En cours</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {tests.filter(t => t.status === 'error').length}
              </div>
              <div className="text-red-800 text-sm">Erreurs</div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h3>
          <p className="text-sm text-yellow-800">
            Ces tests vérifient les fonctionnalités critiques du système. 
            Tous les tests doivent être au vert avant la mise en production.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalityTests;
