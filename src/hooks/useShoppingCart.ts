
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/sales';
import { Medication, ExamType } from '@/services/database/DatabaseAdapter';

export const useShoppingCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: Medication | ExamType, type: 'medication' | 'exam') => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: type === 'medication' ? (item as Medication).unit_price : (item as ExamType).base_price,
      type,
      quantity: 1,
      cartId: Date.now()
    };
    
    setCart(prevCart => [...prevCart, cartItem]);
    console.log('Article ajouté au panier:', cartItem);
    
    toast({
      title: "Article ajouté",
      description: `${item.name} ajouté au panier`
    });
  };

  const updateQuantity = (cartId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId: number) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    toast({
      title: "Article retiré",
      description: "Article retiré du panier"
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    clearCart
  };
};
