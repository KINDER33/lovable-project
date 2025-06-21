
import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import { InvoiceData } from '@/types/sales';

interface AdaptedInvoiceReceiptProps {
  invoiceData: InvoiceData;
  format?: 'standard' | 'compact' | 'minimal';
}

const AdaptedInvoiceReceipt: React.FC<AdaptedInvoiceReceiptProps> = ({ 
  invoiceData, 
  format = 'standard' 
}) => {
  console.log('=== ADAPTED INVOICE RECEIPT ===');
  console.log('Format:', format);
  console.log('InvoiceData:', invoiceData);

  if (!invoiceData) {
    console.error('AdaptedInvoiceReceipt: Aucune donnée fournie');
    return <div>Erreur: Aucune donnée de facture</div>;
  }

  const formatClasses = {
    standard: 'p-4 text-xs',
    compact: 'p-3 text-xs',
    minimal: 'p-2 text-xs'
  };

  const spacingClasses = {
    standard: 'space-y-3',
    compact: 'space-y-2',
    minimal: 'space-y-1'
  };

  return (
    <div className={`border-2 border-black ${formatClasses[format]}`}>
      <InvoiceHeader invoiceNumber={invoiceData.invoiceNumber} />

      {/* Informations patient */}
      <div className={`${spacingClasses[format]}`}>
        <div>
          <span className="font-medium">Nom et Prénoms:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.customerName || 'Client non spécifié'}
          </div>
        </div>

        {format !== 'minimal' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Âge:</span>
              <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1"></div>
            </div>
            <div>
              <span className="font-medium">Sexe:</span>
              <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1"></div>
            </div>
          </div>
        )}

        <div>
          <span className="font-medium">Examen des:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.items && invoiceData.items.length > 0 
              ? invoiceData.items.map(item => item.name).join(', ')
              : 'Consultation générale'
            }
          </div>
        </div>

        {format === 'standard' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Montant (en chiffre):</span>
              <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1 text-right font-bold">
                {invoiceData.totalAmount ? invoiceData.totalAmount.toLocaleString() : '0'} FCFA
              </div>
            </div>
            <div>
              <span className="font-medium">Montant (en lettre):</span>
              <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1"></div>
            </div>
          </div>
        ) : (
          <div>
            <span className="font-medium">Montant:</span>
            <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1 text-right font-bold">
              {invoiceData.totalAmount ? invoiceData.totalAmount.toLocaleString() : '0'} FCFA
            </div>
          </div>
        )}

        <div>
          <span className="font-medium">Date de consultation:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        {format !== 'minimal' && (
          <div>
            <span className="font-medium">Mode de paiement:</span>
            <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
              {invoiceData.paymentMethod === 'cash' ? 'Espèces' : 
               invoiceData.paymentMethod === 'card' ? 'Carte' :
               invoiceData.paymentMethod === 'mobile' ? 'Mobile Money' :
               invoiceData.paymentMethod || 'Espèces'}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className={`${format === 'minimal' ? 'mt-4' : 'mt-6'} text-right`}>
          <div className="text-xs font-medium">Signature</div>
          <div className={`${format === 'minimal' ? 'w-16 h-6' : 'w-20 h-8'} border-b border-black mt-2 ml-auto`}></div>
        </div>
      </div>
    </div>
  );
};

export default AdaptedInvoiceReceipt;
