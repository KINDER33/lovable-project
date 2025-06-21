
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, DollarSign, FileText, Users, ShoppingCart, Stethoscope, Settings, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    todayExams: 0,
    todayTransactions: 0,
    totalMedications: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkConfiguration();
    if (isConfigured) {
      fetchDashboardData();
    }
  }, [isConfigured]);

  const checkConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('count(*)')
        .limit(1);
      
      if (!error) {
        setIsConfigured(true);
        fetchDashboardData();
      }
    } catch (error) {
      console.log('Configuration Supabase requise');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: salesData } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('sale_date', today)
        .eq('is_cancelled', false);

      const { data: examsData } = await supabase
        .from('exams')
        .select('id')
        .gte('exam_date', today)
        .eq('is_cancelled', false);

      const { data: medicationsData } = await supabase
        .from('medications')
        .select('id')
        .eq('is_active', true);

      const todaySalesAmount = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const todayExamsCount = examsData?.length || 0;
      const totalMedications = medicationsData?.length || 0;

      setDashboardStats({
        todaySales: todaySalesAmount,
        todayExams: todayExamsCount,
        todayTransactions: (salesData?.length || 0) + todayExamsCount,
        totalMedications
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  if (!isConfigured) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Configuration Initiale Requise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Bienvenue dans votre système de Caisse Médicale !
                </p>
                <p className="text-gray-600 mb-6">
                  Pour commencer, vous devez configurer votre base de données Supabase.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Étapes de Configuration :</h3>
                <ol className="list-decimal list-inside text-blue-800 space-y-1">
                  <li>Créez un compte gratuit sur supabase.com</li>
                  <li>Créez un nouveau projet</li>
                  <li>Notez votre URL et clé API</li>
                  <li>Configurez la connexion dans les paramètres</li>
                </ol>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => navigate('/settings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  size="lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Configurer Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ventes Aujourd'hui",
      value: `${dashboardStats.todaySales.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Examens Réalisés",
      value: dashboardStats.todayExams.toString(),
      icon: Stethoscope,
      color: "text-blue-600"
    },
    {
      title: "Transactions",
      value: dashboardStats.todayTransactions.toString(),
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Médicaments",
      value: dashboardStats.totalMedications.toString(),
      icon: Users,
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caisse Médicale</h1>
          <p className="text-gray-600">Système de gestion pour centre médical</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">
            Système Opérationnel
          </Badge>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/sales')}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Nouvelle Vente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              size="lg"
              onClick={() => navigate('/sales')}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Nouvelle Vente
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              size="lg"
              onClick={() => navigate('/exams')}
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Enregistrer Examen
            </Button>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
              size="lg"
              onClick={() => navigate('/reports')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Voir Rapports
            </Button>
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white" 
              size="lg"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 mr-2" />
              Paramètres
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Informations Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Base de données connectée</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Guide de Démarrage :</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Ajoutez vos médicaments dans Paramètres</li>
                  <li>• Configurez vos types d'examens</li>
                  <li>• Commencez à enregistrer des ventes</li>
                  <li>• Consultez vos rapports quotidiens</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Système : Actif</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Base de données : Connectée</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Dernière actualisation : {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
