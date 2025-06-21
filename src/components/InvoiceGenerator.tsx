
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  date: string;
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
  onPrint?: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ invoiceData, onPrint }) => {
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="print:block hidden">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .invoice-container, .invoice-container * { visibility: visible; }
            .invoice-container { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}</style>
      </div>
      
      <div className="invoice-container">
        {/* En-tête de la facture */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CENTRE MÉDICAL</h1>
              <p className="text-gray-600 mt-2">Système de Gestion de Caisse</p>
              <p className="text-gray-600">Adresse du centre médical</p>
              <p className="text-gray-600">Téléphone : +221 XX XXX XXXX</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">FACTURE</h2>
              <p className="text-gray-600 mt-2">N° {invoiceData.invoiceNumber}</p>
              <p className="text-gray-600">Date : {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Facturé à :</h3>
          <p className="text-gray-700">{invoiceData.customerName || 'Client'}</p>
        </div>

        {/* Détails des articles */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Quantité</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Prix Unitaire</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.unitPrice.toLocaleString()} FCFA</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.totalPrice.toLocaleString()} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t-2 border-gray-300">
              <span className="font-semibold text-lg">TOTAL À PAYER :</span>
              <span className="font-bold text-lg">{invoiceData.totalAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <span>Mode de paiement :</span>
              <span>{invoiceData.paymentMethod === 'cash' ? 'Espèces' : invoiceData.paymentMethod === 'card' ? 'Carte' : 'Mobile Money'}</span>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
          <p>Merci de votre confiance</p>
          <p>Conservez cette facture pour vos dossiers</p>
        </div>
      </div>

      {/* Bouton d'impression */}
      <div className="no-print mt-6 text-center">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-2" />
          Imprimer la Facture
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
