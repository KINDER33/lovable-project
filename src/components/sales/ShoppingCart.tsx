
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart as ShoppingCartIcon, Calculator } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'medication' | 'exam';
  quantity: number;
  cartId: number;
}

interface ShoppingCartProps {
  cart: CartItem[];
  customerName: string;
  paymentMethod: string;
  onUpdateQuantity: (cartId: number, newQuantity: number) => void;
  onRemoveFromCart: (cartId: number) => void;
  onCustomerNameChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onGenerateInvoice: () => void;
}

const ShoppingCart = ({
  cart,
  customerName,
  paymentMethod,
  onUpdateQuantity,
  onRemoveFromCart,
  onCustomerNameChange,
  onPaymentMethodChange,
  onGenerateInvoice
}: ShoppingCartProps) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          Panier ({cart.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Panier vide</p>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.cartId} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                    <button 
                      onClick={() => onRemoveFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded text-xs"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded text-xs"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium text-sm">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {calculateTotal().toLocaleString()} FCFA
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="customer">Nom du Patient</Label>
                  <Input 
                    id="customer" 
                    placeholder="Nom complet" 
                    value={customerName}
                    onChange={(e) => onCustomerNameChange(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment">Mode de Paiement</Label>
                  <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="card">Carte</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={onGenerateInvoice}
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Générer Facture
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;
