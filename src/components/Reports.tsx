import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import PermissionGuard from './PermissionGuard';

interface ReportData {
  sales: any[];
  expenses: any[];
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSales: number;
    totalExpenses: number;
    profit: number;
    transactionCount: number;
  };
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData>({
    sales: [],
    expenses: [],
    period: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    summary: {
      totalSales: 0,
      totalExpenses: 0,
      profit: 0,
      transactionCount: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('daily');
  
  const { adapter, isInitialized } = useDatabase();
  const { user } = useHybridAuth();
  const { toast } = useToast();

  // Vérifier les permissions
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isInitialized && adapter) {
      generateReport();
    }
  }, [isInitialized, adapter, startDate, endDate]);

  const generateReport = async () => {
    if (!adapter) return;

    try {
      setLoading(true);

      // Charger les ventes
      const salesResult = await adapter.getSales();
      const filteredSales = salesResult.data?.filter(sale => {
        const saleDate = sale.sale_date?.split('T')[0];
        return saleDate >= startDate && saleDate <= endDate && !sale.is_cancelled;
      }) || [];

      let filteredExpenses: any[] = [];
      // Charger les dépenses seulement pour les admins
      if (isAdmin) {
        const expensesResult = await adapter.getExpenses();
        filteredExpenses = expensesResult.data?.filter(expense => {
          const expenseDate = expense.expense_date?.split('T')[0];
          return expenseDate >= startDate && expenseDate <= endDate && !expense.is_cancelled;
        }) || [];
      }

      // Calculer le résumé
      const totalSales = filteredSales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount?.toString() || '0') || 0), 0);
      const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount?.toString() || '0') || 0), 0);

      setReportData({
        sales: filteredSales,
        expenses: filteredExpenses,
        period: { start: startDate, end: endDate },
        summary: {
          totalSales,
          totalExpenses,
          profit: totalSales - totalExpenses,
          transactionCount: filteredSales.length
        }
      });

    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_${startDate}_${endDate}.csv`;
    link.click();
  };

  const generateCSVContent = () => {
    let content = 'Type,Date,Description,Montant\n';
    
    // Ajouter les ventes
    reportData.sales.forEach(sale => {
      content += `Vente,${sale.sale_date},${sale.patient_name || 'N/A'},${sale.total_amount}\n`;
    });
    
    // Ajouter les dépenses (seulement pour les admins)
    if (isAdmin) {
      reportData.expenses.forEach(expense => {
        content += `Dépense,${expense.expense_date},${expense.description || expense.category_name},${expense.amount}\n`;
      });
    }
    
    return content;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600">Analyse financière et statistiques</p>
        </div>
        <Button onClick={exportReport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Filtres de période */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres de Période
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="reportType">Type de rapport</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={generateReport} className="w-full">
              Générer Rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reportData.summary.totalSales.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-gray-600">
              {reportData.summary.transactionCount} transactions
            </p>
          </CardContent>
        </Card>

        <PermissionGuard requiredRole="admin">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reportData.summary.totalExpenses.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">
                {reportData.expenses.length} dépenses
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard requiredRole="admin">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
              <BarChart3 className={`h-4 w-4 ${reportData.summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${reportData.summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.summary.profit >= 0 ? '+' : ''}{reportData.summary.profit.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">
                Période: {reportData.period.start} - {reportData.period.end}
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Période d'Analyse</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">
              {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} jours
            </div>
            <p className="text-xs text-gray-600">
              Du {startDate} au {endDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Détails des rapports */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Détail des Ventes</TabsTrigger>
          <PermissionGuard requiredRole="admin">
            <TabsTrigger value="expenses">Détail des Dépenses</TabsTrigger>
          </PermissionGuard>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Patient</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.sales.map((sale, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">{new Date(sale.sale_date).toLocaleDateString()}</td>
                        <td className="p-2">{sale.patient_name || 'N/A'}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {sale.sale_type || 'Vente'}
                          </span>
                        </td>
                        <td className="p-2 text-right font-semibold">
                          {parseFloat(sale.total_amount || '0').toLocaleString()} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.sales.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune vente trouvée pour cette période
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <PermissionGuard requiredRole="admin">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Catégorie</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Fournisseur</th>
                        <th className="text-right p-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.expenses.map((expense, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{new Date(expense.expense_date).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              {expense.category_name}
                            </span>
                          </td>
                          <td className="p-2">{expense.description || 'N/A'}</td>
                          <td className="p-2">{expense.supplier || 'N/A'}</td>
                          <td className="p-2 text-right font-semibold text-red-600">
                            {parseFloat(expense.amount || '0').toLocaleString()} FCFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportData.expenses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune dépense trouvée pour cette période
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
