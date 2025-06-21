
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OptimizedProductionInvoiceGenerator from '../OptimizedProductionInvoiceGenerator';
import { InvoiceData } from '@/types/sales';

interface InvoiceModalProps {
  showInvoice: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
}

const InvoiceModal = ({ showInvoice, onOpenChange, invoiceData }: InvoiceModalProps) => {
  console.log('=== INVOICE MODAL ===');
  console.log('showInvoice:', showInvoice);
  console.log('invoiceData:', invoiceData);

  return (
    <Dialog open={showInvoice} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Aperçu de la Facture - Centre de Santé Solidarité Islamique
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {invoiceData ? (
            <OptimizedProductionInvoiceGenerator 
              invoiceData={invoiceData} 
              onPrint={() => onOpenChange(false)}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-red-500 text-lg mb-4">
                Erreur: Aucune donnée de facture disponible
              </p>
              <button 
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
