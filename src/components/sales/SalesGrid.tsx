
import React from 'react';
import SearchBar from './SearchBar';
import MedicationsList from './MedicationsList';
import ExamsList from './ExamsList';
import ShoppingCart from './ShoppingCart';

interface Medication {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
}

interface ExamType {
  id: string;
  name: string;
  base_price: number;
  department: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'medication' | 'exam';
  quantity: number;
  cartId: number;
}

interface SalesGridProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  medications: Medication[];
  examTypes: ExamType[];
  cart: CartItem[];
  customerName: string;
  paymentMethod: string;
  onAddToCart: (item: Medication | ExamType, type: 'medication' | 'exam') => void;
  onUpdateQuantity: (cartId: number, newQuantity: number) => void;
  onRemoveFromCart: (cartId: number) => void;
  onCustomerNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onGenerateInvoice: () => void;
}

const SalesGrid = ({
  searchTerm,
  onSearchChange,
  medications,
  examTypes,
  cart,
  customerName,
  paymentMethod,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCustomerNameChange,
  onPaymentMethodChange,
  onGenerateInvoice
}: SalesGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        
        <MedicationsList 
          medications={medications}
          onAddToCart={(med) => onAddToCart(med, 'medication')}
        />
        
        <ExamsList 
          examTypes={examTypes}
          onAddToCart={(exam) => onAddToCart(exam, 'exam')}
        />
      </div>

      <ShoppingCart
        cart={cart}
        customerName={customerName}
        paymentMethod={paymentMethod}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onCustomerNameChange={onCustomerNameChange}
        onPaymentMethodChange={onPaymentMethodChange}
        onGenerateInvoice={onGenerateInvoice}
      />
    </div>
  );
};

export default SalesGrid;
