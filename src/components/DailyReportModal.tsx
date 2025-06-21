
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Printer } from 'lucide-react';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyReportModal = ({ isOpen, onClose }: DailyReportModalProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données simulées pour le bilan
  const dailyReport = {
    date: selectedDate,
    sales: {
      medicaments: 125000,
      examens: 180000,
      total: 305000
    },
    expenses: {
      achats: 45000,
      maintenance: 12000,
      autres: 8000,
      total: 65000
    },
    profit: 240000,
    transactions: 47,
    cashiers: [
      { name: 'Marie Dubois', sales: 125000, transactions: 15 },
      { name: 'Jean Ngarta', sales: 98000, transactions: 12 },
      { name: 'Fatima Hassan', sales: 82000, transactions: 20 }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exportation du rapport journalier pour:', selectedDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Bilan Journalier - {new Date(selectedDate).toLocaleDateString('fr-FR')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Résumé financier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dailyReport.sales.total.toLocaleString()} FCFA
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  <div>Médicaments: {dailyReport.sales.medicaments.toLocaleString()} FCFA</div>
                  <div>Examens: {dailyReport.sales.examens.toLocaleString()} FCFA</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600">Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {dailyReport.expenses.total.toLocaleString()} FCFA
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  <div>Achats: {dailyReport.expenses.achats.toLocaleString()} FCFA</div>
                  <div>Maintenance: {dailyReport.expenses.maintenance.toLocaleString()} FCFA</div>
                  <div>Autres: {dailyReport.expenses.autres.toLocaleString()} FCFA</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">Bénéfice Net</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {dailyReport.profit.toLocaleString()} FCFA
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {dailyReport.transactions} transactions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance par caissier */}
          <Card>
            <CardHeader>
              <CardTitle>Performance par Caissier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyReport.cashiers.map((cashier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{cashier.name}</div>
                      <div className="text-sm text-gray-600">{cashier.transactions} transactions</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {cashier.sales.toLocaleString()} FCFA
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyReportModal;
