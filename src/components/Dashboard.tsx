
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart,
  FileText,
  AlertTriangle,
  Plus,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import ExpenseModal from './ExpenseModal';
import PermissionGuard from './PermissionGuard';

interface DashboardStats {
  totalSalesToday: number;
  totalMedications: number;
  lowStockCount: number;
  totalRevenue: number;
  totalExpensesToday: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSalesToday: 0,
    totalMedications: 0,
    lowStockCount: 0,
    totalRevenue: 0,
    totalExpensesToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const { adapter, isInitialized } = useDatabase();
  const { user } = useHybridAuth();
  const { toast } = useToast();

  // For SimpleMainApp, use default user if none provided
  const defaultUser = {
    fullName: 'Utilisateur Admin',
    role: 'admin'
  };

  const currentUser = user || defaultUser;

  // Vérifier les permissions selon le rôle
  const isAdmin = currentUser?.role === 'admin';
  const isCaissier = currentUser?.role === 'caissier';

  useEffect(() => {
    if (isInitialized && adapter) {
      loadDashboardData();
    } else {
      // Mode démo sans adaptateur
      loadDemoData();
    }
  }, [isInitialized, adapter]);

  const loadDemoData = () => {
    // Données de démonstration pour le mode sans base de données
    setStats({
      totalSalesToday: 8,
      totalMedications: 45,
      lowStockCount: 3,
      totalRevenue: 125000,
      totalExpensesToday: 15000
    });
    setLoading(false);
  };

  const loadDashboardData = async () => {
    if (!adapter) {
      loadDemoData();
      return;
    }

    try {
      setLoading(true);

      // Charger les ventes du jour
      const salesResult = await adapter.getSales();
      const today = new Date().toISOString().split('T')[0];
      const todaySales = salesResult.data?.filter(sale => 
        sale.sale_date?.startsWith(today) && !sale.is_cancelled
      ) || [];

      // Charger les médicaments
      const medicationsResult = await adapter.getMedications();
      const medications = medicationsResult.data || [];
      const lowStock = medications.filter(med => 
        med.stock_quantity <= (med.min_stock_level || 10) && med.is_active
      );

      // Calculer les statistiques de base
      const totalSalesToday = todaySales.length;
      const totalRevenue = todaySales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount?.toString() || '0') || 0), 0);

      let totalExpensesToday = 0;
      // Charger les dépenses seulement pour les admins
      if (isAdmin) {
        const expensesResult = await adapter.getExpenses();
        const todayExpenses = expensesResult.data?.filter(expense => 
          expense.expense_date?.startsWith(today) && !expense.is_cancelled
        ) || [];
        totalExpensesToday = todayExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount?.toString() || '0') || 0), 0);
      }

      setStats({
        totalSalesToday,
        totalMedications: medications.filter(med => med.is_active).length,
        lowStockCount: lowStock.length,
        totalRevenue,
        totalExpensesToday
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive"
      });
      // Fallback to demo data
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    setShowExpenseModal(false);
    loadDashboardData();
    toast({
      title: "Succès",
      description: "Dépense enregistrée avec succès"
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec informations utilisateur et boutons d'action */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">Centre de Santé Solidarité Islamique - MONGO, TCHAD</p>
          <p className="text-sm text-gray-500">
            Connecté en tant que: <span className="font-medium">{currentUser?.fullName}</span> 
            ({currentUser?.role === 'admin' ? 'Administrateur' : 'Caissier'})
          </p>
        </div>
        <PermissionGuard requiredRole="admin">
          <Button 
            onClick={() => setShowExpenseModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Dépense
          </Button>
        </PermissionGuard>
      </div>

      {/* Interface spécifique pour les caissiers */}
      {isCaissier && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Interface Caissier</h3>
                <p className="text-blue-700">
                  Vous avez accès aux modules de vente et de facturation. 
                  Pour d'autres fonctionnalités, contactez un administrateur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cartes de statistiques adaptées selon le rôle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventes du jour - visible pour tous */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Aujourd'hui</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSalesToday}</div>
            <p className="text-xs text-gray-600">transactions</p>
          </CardContent>
        </Card>

        {/* Recettes du jour - visible pour tous */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes du Jour</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalRevenue.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-gray-600">revenus</p>
          </CardContent>
        </Card>

        {/* Date du jour - visible pour tous */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date du Jour</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">
              {new Date().toLocaleDateString('fr-FR')}
            </div>
            <p className="text-xs text-gray-600">système opérationnel</p>
          </CardContent>
        </Card>

        {/* Statut utilisateur */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">
              {user?.role === 'admin' ? 'Administrateur' : 'Caissier'}
            </div>
            <p className="text-xs text-gray-600">connecté</p>
          </CardContent>
        </Card>
      </div>

      {/* Cartes additionnelles pour les admins seulement */}
      <PermissionGuard requiredRole="admin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses du Jour</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.totalExpensesToday.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">dépenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalMedications}</div>
              <p className="text-xs text-gray-600">en stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</div>
              <p className="text-xs text-gray-600">alertes</p>
            </CardContent>
          </Card>
        </div>

        {/* Bilan financier pour les admins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bilan Financier du Jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  + {stats.totalRevenue.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-600">Recettes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  - {stats.totalExpensesToday.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-600">Dépenses</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${
                  (stats.totalRevenue - stats.totalExpensesToday) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(stats.totalRevenue - stats.totalExpensesToday) >= 0 ? '+' : ''}
                  {(stats.totalRevenue - stats.totalExpensesToday).toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-600">Bénéfice Net</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PermissionGuard>

      {/* Modal de dépense pour les admins */}
      <PermissionGuard requiredRole="admin">
        <ExpenseModal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
        />
      </PermissionGuard>
    </div>
  );
};

export default Dashboard;
