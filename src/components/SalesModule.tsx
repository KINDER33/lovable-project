
import React from 'react';
import { useSalesLogic } from '@/hooks/useSalesLogic';
import SalesGrid from './sales/SalesGrid';
import InvoiceModal from './sales/InvoiceModal';

const SalesModule = () => {
  const {
    cart,
    searchTerm,
    medications,
    examTypes,
    customerName,
    paymentMethod,
    showInvoice,
    invoiceData,
    setSearchTerm,
    setCustomerName,
    setPaymentMethod,
    setShowInvoice,
    addToCart,
    updateQuantity,
    removeFromCart,
    generateInvoice
  } = useSalesLogic();

  console.log('=== SALES MODULE ===');
  console.log('showInvoice:', showInvoice);
  console.log('invoiceData:', invoiceData);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Module de Ventes</h1>
          <p className="text-gray-600">Vente de médicaments et enregistrement d'examens</p>
        </div>
      </div>

      <SalesGrid
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        medications={medications}
        examTypes={examTypes}
        cart={cart}
        customerName={customerName}
        paymentMethod={paymentMethod}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCustomerNameChange={setCustomerName}
        onPaymentMethodChange={setPaymentMethod}
        onGenerateInvoice={generateInvoice}
      />

      <InvoiceModal
        showInvoice={showInvoice}
        onOpenChange={setShowInvoice}
        invoiceData={invoiceData}
      />
    </div>
  );
};

export default SalesModule;
