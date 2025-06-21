
import React from 'react';
import { InvoiceData } from './InvoiceTypes';

interface InvoiceServiceDetailsProps {
  invoiceData: InvoiceData;
}

const InvoiceServiceDetails: React.FC<InvoiceServiceDetailsProps> = ({ invoiceData }) => {
  console.log('=== INVOICE SERVICE DETAILS ===');
  console.log('InvoiceServiceDetails - Données reçues:', invoiceData);
  console.log('InvoiceServiceDetails - Articles:', invoiceData?.items);

  if (!invoiceData) {
    console.error('InvoiceServiceDetails: Aucune donnée fournie');
    return <div>Erreur: Aucune donnée de service</div>;
  }

  if (!invoiceData.items || invoiceData.items.length === 0) {
    console.warn('InvoiceServiceDetails: Aucun article trouvé');
    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-bold mb-2">Détails des services:</h3>
        <p className="text-xs text-gray-500">Aucun service enregistré</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-bold mb-2">Détails des services:</h3>
      <div className="text-xs space-y-1">
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} (Quantité: {item.quantity})</span>
            <span>{item.totalPrice ? item.totalPrice.toLocaleString() : '0'} FCFA</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t">
        <span>Mode de paiement: {
          invoiceData.paymentMethod === 'cash' ? 'Espèces' : 
          invoiceData.paymentMethod === 'card' ? 'Carte' :
          invoiceData.paymentMethod === 'mobile' ? 'Mobile Money' :
          invoiceData.paymentMethod || 'Non spécifié'
        }</span>
        <span>Total: {invoiceData.totalAmount ? invoiceData.totalAmount.toLocaleString() : '0'} FCFA</span>
      </div>
      {invoiceData.saleReference && (
        <div className="text-center mt-2 pt-2 border-t">
          <span className="text-xs font-medium">Référence: {invoiceData.saleReference}</span>
        </div>
      )}
    </div>
  );
};

export default InvoiceServiceDetails;
