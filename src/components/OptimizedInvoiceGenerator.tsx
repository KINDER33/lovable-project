
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import InvoiceReceipt from './invoice/InvoiceReceipt';
import { InvoiceData } from '@/types/sales';
import { Printer, X } from 'lucide-react';

interface OptimizedInvoiceGeneratorProps {
  invoiceData: InvoiceData;
  onPrint?: () => void;
}

const OptimizedInvoiceGenerator: React.FC<OptimizedInvoiceGeneratorProps> = ({ 
  invoiceData, 
  onPrint 
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  console.log('=== OPTIMIZED INVOICE GENERATOR ===');
  console.log('Données reçues:', invoiceData);

  const handlePrint = () => {
    console.log('Lancement de l\'impression');
    
    if (componentRef.current) {
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = componentRef.current.innerHTML;
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Reçu ${invoiceData?.invoiceNumber || 'UNKNOWN'}</title>
              <style>
                @page { 
                  size: A5; 
                  margin: 10mm; 
                }
                body { 
                  font-family: Arial, sans-serif; 
                  font-size: 12px; 
                  line-height: 1.4;
                  color: black;
                  margin: 0;
                  padding: 10px;
                }
                .border-2 { border: 2px solid black; }
                .border { border: 1px solid #ccc; }
                .border-b { border-bottom: 1px solid #ccc; }
                .border-dotted { border-style: dotted; }
                .border-black { border-color: black; }
                .p-4 { padding: 16px; }
                .p-2 { padding: 8px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-4 { margin-bottom: 16px; }
                .mt-1 { margin-top: 4px; }
                .mt-2 { margin-top: 8px; }
                .mt-6 { margin-top: 24px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-xs { font-size: 10px; }
                .text-sm { font-size: 11px; }
                .font-bold { font-weight: bold; }
                .font-medium { font-weight: 500; }
                .space-y-2 > * + * { margin-top: 8px; }
                .space-y-4 > * + * { margin-top: 16px; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .gap-4 { gap: 16px; }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .justify-between { justify-content: space-between; }
                .w-10 { width: 40px; }
                .h-10 { height: 40px; }
                .w-20 { width: 80px; }
                .h-8 { height: 32px; }
                .w-32 { width: 128px; }
                .bg-green-600 { background-color: #059669; }
                .rounded-full { border-radius: 50%; }
                .rounded-lg { border-radius: 8px; }
                .min-h-6 { min-height: 24px; }
                .ml-auto { margin-left: auto; }
                .inline-block { display: inline-block; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Attendre que le contenu soit chargé puis imprimer
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          
          console.log('Impression terminée');
          if (onPrint) onPrint();
        }, 500);
      }
    }
  };

  const handleClose = () => {
    if (onPrint) onPrint();
  };

  if (!invoiceData) {
    console.error('OptimizedInvoiceGenerator: Aucune donnée de facture fournie');
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4 text-lg">Erreur: Aucune donnée de facture disponible</p>
        <Button onClick={handleClose} variant="outline">Fermer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Boutons d'action */}
      <div className="flex justify-between items-center mb-6 no-print bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Facture N° {invoiceData.invoiceNumber}
        </h2>
        <div className="flex gap-3">
          <Button 
            onClick={handlePrint} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleClose} variant="outline" className="px-6 py-2">
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>
        </div>
      </div>

      {/* Aperçu de la facture */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">Aperçu avant impression</p>
          <div className="border-2 border-gray-300 rounded-lg p-2 inline-block">
            <p className="text-xs text-gray-500">Format A5 - Taille réelle à l'impression</p>
          </div>
        </div>

        {/* Contenu à imprimer */}
        <div 
          ref={componentRef} 
          className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto"
          style={{ transform: 'scale(0.9)', transformOrigin: 'center top' }}
        >
          <InvoiceReceipt invoiceData={invoiceData} showAmountInWords={false} />
        </div>
      </div>

      {/* Informations de débogage */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Facture:</strong> {invoiceData.invoiceNumber}</p>
            <p><strong>Client:</strong> {invoiceData.customerName}</p>
            <p><strong>Date:</strong> {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p><strong>Articles:</strong> {invoiceData.items?.length || 0}</p>
            <p><strong>Total:</strong> {invoiceData.totalAmount?.toLocaleString() || '0'} FCFA</p>
            <p><strong>Paiement:</strong> {invoiceData.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedInvoiceGenerator;
