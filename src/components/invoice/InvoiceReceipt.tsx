
import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import { InvoiceData } from './InvoiceTypes';

interface InvoiceReceiptProps {
  invoiceData: InvoiceData;
  showAmountInWords?: boolean;
}

const InvoiceReceipt: React.FC<InvoiceReceiptProps> = ({ 
  invoiceData, 
  showAmountInWords = false 
}) => {
  console.log('=== INVOICE RECEIPT ===');
  console.log('InvoiceReceipt - Données reçues:', invoiceData);
  console.log('InvoiceReceipt - showAmountInWords:', showAmountInWords);

  if (!invoiceData) {
    console.error('InvoiceReceipt: Aucune donnée fournie');
    return <div>Erreur: Aucune donnée de facture</div>;
  }

  return (
    <div className="border-2 border-black p-4">
      <InvoiceHeader invoiceNumber={invoiceData.invoiceNumber} />

      {/* Affichage de la référence de vente si disponible */}
      {invoiceData.saleReference && (
        <div className="text-center mb-2">
          <p className="text-xs font-medium">Réf: {invoiceData.saleReference}</p>
        </div>
      )}

      {/* Informations patient */}
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium">Nom et Prénoms:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.customerName || 'Client non spécifié'}
          </div>
        </div>

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

        <div>
          <span className="font-medium">Services/Médicaments:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.items && invoiceData.items.length > 0 
              ? invoiceData.items.map(item => `${item.name} (${item.quantity})`).join(', ')
              : 'Aucun service'
            }
          </div>
        </div>

        {showAmountInWords ? (
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

        <div>
          <span className="font-medium">Mode de paiement:</span>
          <div className="border-b border-dotted border-black min-h-[1.2rem] mt-1">
            {invoiceData.paymentMethod === 'cash' ? 'Espèces' : 
             invoiceData.paymentMethod === 'card' ? 'Carte' :
             invoiceData.paymentMethod === 'mobile' ? 'Mobile Money' :
             invoiceData.paymentMethod || 'Non spécifié'}
          </div>
        </div>

        {/* Signature */}
        <div className="mt-6 text-right">
          <div className="text-xs font-medium">Signature</div>
          <div className="w-20 h-8 border-b border-black mt-2 ml-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
