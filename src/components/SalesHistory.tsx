
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/hooks/use-toast';
import OptimizedInvoiceGenerator from './OptimizedInvoiceGenerator';
import { Calendar, Eye, Printer } from 'lucide-react';
import { Sale as DatabaseSale, SaleItem } from '@/services/database/DatabaseAdapter';

interface LocalSale {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  payment_method: string;
  sale_date: string;
  items?: SaleItem[];
}

const SalesHistory = () => {
  const [sales, setSales] = useState<LocalSale[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState<LocalSale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { adapter } = useDatabase();
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesByDate();
  }, [selectedDate, adapter]);

  const convertDatabaseSaleToLocal = (dbSale: DatabaseSale): LocalSale => {
    return {
      id: dbSale.id,
      invoice_number: dbSale.invoice_number,
      customer_name: dbSale.customer_name || 'Client',
      total_amount: Number(dbSale.total_amount),
      payment_method: dbSale.payment_method || 'cash',
      sale_date: dbSale.sale_date,
      items: dbSale.items || []
    };
  };

  const fetchSalesByDate = async () => {
    if (!adapter) {
      console.log('Adapter non disponible - mode local');
      // Mode local - utiliser des données de démonstration
      const demoSales: LocalSale[] = [
        {
          id: '1',
          invoice_number: 'F000001',
          customer_name: 'Jean Dupont',
          total_amount: 15000,
          payment_method: 'cash',
          sale_date: selectedDate + 'T10:30:00Z',
          items: [
            { id: '1', sale_id: '1', item_id: '1', item_type: 'medication', item_name: 'Paracétamol', quantity: 2, price: 1000 },
            { id: '2', sale_id: '1', item_id: '2', item_type: 'exam', item_name: 'Consultation Générale', quantity: 1, price: 13000 }
          ]
        },
        {
          id: '2',
          invoice_number: 'F000002',
          customer_name: 'Marie Martin',
          total_amount: 8500,
          payment_method: 'card',
          sale_date: selectedDate + 'T14:15:00Z',
          items: [
            { id: '3', sale_id: '2', item_id: '3', item_type: 'medication', item_name: 'Amoxicilline', quantity: 1, price: 8500 }
          ]
        }
      ];
      setSales(demoSales);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Chargement des ventes pour la date:', selectedDate);
      const result = await adapter.getSales();
      if (result.success && result.data) {
        // Filtrer par date sélectionnée et convertir au format local
        const filteredSales = result.data.filter(sale => {
          const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
          return saleDate === selectedDate;
        });
        const localSales = filteredSales.map(convertDatabaseSaleToLocal);
        setSales(localSales);
        console.log('Ventes chargées:', localSales.length);
      }
    } catch (error) {
      console.error('Erreur chargement ventes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ventes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewInvoice = (sale: LocalSale) => {
    console.log('Consultation facture:', sale.invoice_number);
    
    // Créer les données de facture à partir de la vente
    const invoiceData = {
      invoiceNumber: sale.invoice_number,
      customerName: sale.customer_name,
      items: sale.items ? sale.items.map((item) => ({
        name: item.item_name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      })) : [],
      totalAmount: sale.total_amount,
      paymentMethod: sale.payment_method,
      date: sale.sale_date,
      saleReference: `REF-${sale.invoice_number}-${Date.now().toString().slice(-6)}`
    };

    setSelectedSale(sale);
    setShowInvoice(true);
  };

  const calculateDayTotal = () => {
    return sales.reduce((total, sale) => total + sale.total_amount, 0);
  };

  const formatItemsDisplay = (items?: SaleItem[]) => {
    if (!items || items.length === 0) return 'N/A';
    return items.map(item => `${item.item_name} (${item.quantity})`).join(', ');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique des Ventes</h1>
          <p className="text-gray-600">Consultation des factures générées</p>
        </div>
      </div>

      {/* Sélection de date */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtrer par Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="date">Date de consultation</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={fetchSalesByDate} disabled={isLoading}>
              {isLoading ? "Chargement..." : "Actualiser"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé du jour */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
              <p className="text-gray-600">Ventes du jour</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{calculateDayTotal().toLocaleString()} FCFA</p>
              <p className="text-gray-600">Chiffre d'affaires</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {sales.length > 0 ? Math.round(calculateDayTotal() / sales.length).toLocaleString() : 0} FCFA
              </p>
              <p className="text-gray-600">Panier moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des ventes */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Ventes du {new Date(selectedDate).toLocaleDateString('fr-FR')}</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune vente trouvée pour cette date</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                    <TableCell>{sale.customer_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{formatItemsDisplay(sale.items)}</TableCell>
                    <TableCell className="font-semibold">{sale.total_amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sale.payment_method === 'cash' ? 'bg-green-100 text-green-800' :
                        sale.payment_method === 'card' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {sale.payment_method === 'cash' ? 'Espèces' :
                         sale.payment_method === 'card' ? 'Carte' : 'Mobile Money'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(sale.sale_date).toLocaleTimeString('fr-FR')}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewInvoice(sale)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de facture */}
      {showInvoice && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <OptimizedInvoiceGenerator
              invoiceData={{
                invoiceNumber: selectedSale.invoice_number,
                customerName: selectedSale.customer_name,
                items: selectedSale.items ? selectedSale.items.map((item) => ({
                  name: item.item_name,
                  quantity: item.quantity,
                  unitPrice: item.price,
                  totalPrice: item.price * item.quantity
                })) : [],
                totalAmount: selectedSale.total_amount,
                paymentMethod: selectedSale.payment_method,
                date: selectedSale.sale_date,
                saleReference: `REF-${selectedSale.invoice_number}-${Date.now().toString().slice(-6)}`
              }}
              onPrint={() => setShowInvoice(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
