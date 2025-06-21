
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdaptedInvoiceReceipt from './invoice/AdaptedInvoiceReceipt';
import { InvoiceData } from '@/types/sales';
import { Printer, X, FileText } from 'lucide-react';

interface OptimizedProductionInvoiceGeneratorProps {
  invoiceData: InvoiceData;
  onPrint?: () => void;
}

const OptimizedProductionInvoiceGenerator: React.FC<OptimizedProductionInvoiceGeneratorProps> = ({ 
  invoiceData, 
  onPrint 
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [printFormat, setPrintFormat] = useState<'standard' | 'compact' | 'minimal'>('standard');

  console.log('=== OPTIMIZED PRODUCTION INVOICE GENERATOR ===');
  console.log('Données reçues:', invoiceData);
  console.log('Format sélectionné:', printFormat);

  const formatDescriptions = {
    standard: 'Format standard - Tous les détails (A4)',
    compact: 'Format compact - Économie papier (A5)',
    minimal: 'Format minimal - Très économique (Ticket)'
  };

  const handlePrint = () => {
    console.log('Impression avec format:', printFormat);
    
    if (componentRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = componentRef.current.innerHTML;
        
        const pageSize = printFormat === 'standard' ? 'A4' : 
                        printFormat === 'compact' ? 'A5' : '80mm 200mm';
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Reçu ${invoiceData?.invoiceNumber || 'UNKNOWN'}</title>
              <style>
                @page { 
                  size: ${pageSize}; 
                  margin: ${printFormat === 'minimal' ? '5mm' : '10mm'}; 
                }
                body { 
                  font-family: Arial, sans-serif; 
                  font-size: ${printFormat === 'minimal' ? '10px' : '12px'}; 
                  line-height: 1.4;
                  color: black;
                  margin: 0;
                  padding: ${printFormat === 'minimal' ? '5px' : '10px'};
                }
                .border-2 { border: 2px solid black; }
                .border { border: 1px solid #ccc; }
                .border-b { border-bottom: 1px solid #ccc; }
                .border-dotted { border-style: dotted; }
                .border-black { border-color: black; }
                .p-4 { padding: 16px; }
                .p-3 { padding: 12px; }
                .p-2 { padding: 8px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-3 { margin-bottom: 12px; }
                .mb-4 { margin-bottom: 16px; }
                .mt-1 { margin-top: 4px; }
                .mt-2 { margin-top: 8px; }
                .mt-4 { margin-top: 16px; }
                .mt-6 { margin-top: 24px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-xs { font-size: ${printFormat === 'minimal' ? '9px' : '11px'}; }
                .text-sm { font-size: ${printFormat === 'minimal' ? '10px' : '12px'}; }
                .font-bold { font-weight: bold; }
                .font-medium { font-weight: 500; }
                .space-y-1 > * + * { margin-top: 4px; }
                .space-y-2 > * + * { margin-top: 8px; }
                .space-y-3 > * + * { margin-top: 12px; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .gap-4 { gap: 16px; }
                .flex { display: flex; }
                .flex-1 { flex: 1; }
                .items-center { align-items: center; }
                .w-12 { width: 48px; }
                .h-12 { height: 48px; }
                .w-16 { width: 64px; }
                .w-20 { width: 80px; }
                .h-6 { height: 24px; }
                .h-8 { height: 32px; }
                .w-32 { width: 128px; }
                .mr-3 { margin-right: 12px; }
                .ml-auto { margin-left: auto; }
                .min-h-6 { min-height: 24px; }
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
    console.error('OptimizedProductionInvoiceGenerator: Aucune donnée de facture fournie');
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4 text-lg">Erreur: Aucune donnée de facture disponible</p>
        <Button onClick={handleClose} variant="outline">Fermer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contrôles d'impression */}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Facture N° {invoiceData.invoiceNumber}
          </h2>
          <div className="flex items-center gap-4">
            <FileText className="w-4 h-4 text-gray-600" />
            <Select value={printFormat} onValueChange={(value: 'standard' | 'compact' | 'minimal') => setPrintFormat(value)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{formatDescriptions.standard}</SelectItem>
                <SelectItem value="compact">{formatDescriptions.compact}</SelectItem>
                <SelectItem value="minimal">{formatDescriptions.minimal}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handlePrint} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
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
          <p className="text-sm text-gray-600 mb-2">Aperçu avant impression - {formatDescriptions[printFormat]}</p>
        </div>

        {/* Contenu à imprimer */}
        <div 
          ref={componentRef} 
          className={`bg-white border border-gray-200 rounded-lg shadow-sm mx-auto ${
            printFormat === 'standard' ? 'max-w-lg' : 
            printFormat === 'compact' ? 'max-w-md' : 'max-w-sm'
          }`}
          style={{ 
            transform: printFormat === 'minimal' ? 'scale(0.8)' : 'scale(0.9)', 
            transformOrigin: 'center top' 
          }}
        >
          <AdaptedInvoiceReceipt invoiceData={invoiceData} format={printFormat} />
        </div>
      </div>

      {/* Informations du format */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p><strong>Format:</strong> {formatDescriptions[printFormat]}</p>
            <p><strong>Économie:</strong> {
              printFormat === 'standard' ? '0%' : 
              printFormat === 'compact' ? '30%' : '60%'
            }</p>
          </div>
          <div>
            <p><strong>Facture:</strong> {invoiceData.invoiceNumber}</p>
            <p><strong>Client:</strong> {invoiceData.customerName}</p>
          </div>
          <div>
            <p><strong>Total:</strong> {invoiceData.totalAmount?.toLocaleString() || '0'} FCFA</p>
            <p><strong>Date:</strong> {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedProductionInvoiceGenerator;
