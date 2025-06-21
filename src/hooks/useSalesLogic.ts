
import { useState, useEffect } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceGeneration } from './useInvoiceGeneration';
import { Medication, ExamType } from '@/services/database/DatabaseAdapter';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'medication' | 'exam';
  quantity: number;
  cartId: number;
}

export const useSalesLogic = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cartIdCounter, setCartIdCounter] = useState(1);

  const { adapter } = useDatabase();
  const { toast } = useToast();
  const { showInvoice, invoiceData, setShowInvoice, generateInvoice } = useInvoiceGeneration();

  useEffect(() => {
    loadData();
  }, [adapter]);

  const loadData = async () => {
    if (!adapter) {
      console.log('Mode local - utilisation de données de démonstration');
      // Données de démonstration pour le mode local
      setMedications([
        {
          id: '1',
          name: 'Paracétamol 500mg',
          category: 'Antalgique',
          unit_price: 1000,
          stock_quantity: 50,
          is_active: true
        },
        {
          id: '2',
          name: 'Amoxicilline 250mg',
          category: 'Antibiotique',
          unit_price: 8500,
          stock_quantity: 30,
          is_active: true
        }
      ]);

      setExamTypes([
        {
          id: '1',
          name: 'Consultation Générale',
          base_price: 15000,
          department: 'Médecine Générale',
          is_active: true
        },
        {
          id: '2',
          name: 'Échographie',
          base_price: 25000,
          department: 'Imagerie',
          is_active: true
        }
      ]);
      return;
    }

    try {
      console.log('Chargement des données avec adaptateur');
      
      const [medicationsResult, examTypesResult] = await Promise.all([
        adapter.getMedications(),
        adapter.getExamTypes()
      ]);

      if (medicationsResult.success && medicationsResult.data) {
        setMedications(medicationsResult.data);
        console.log('Médicaments chargés:', medicationsResult.data.length);
      }

      if (examTypesResult.success && examTypesResult.data) {
        setExamTypes(examTypesResult.data);
        console.log('Types d\'examens chargés:', examTypesResult.data.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    }
  };

  const addToCart = (item: Medication | ExamType, type: 'medication' | 'exam') => {
    console.log('Ajout au panier:', item.name, type);
    
    const price = type === 'medication' ? (item as Medication).unit_price : (item as ExamType).base_price;
    
    const newCartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: price,
      type: type,
      quantity: 1,
      cartId: cartIdCounter
    };

    setCart(prevCart => [...prevCart, newCartItem]);
    setCartIdCounter(prev => prev + 1);

    toast({
      title: "Article ajouté",
      description: `${item.name} a été ajouté au panier`
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
      description: "L'article a été retiré du panier"
    });
  };

  const handleGenerateInvoice = async () => {
    console.log('Génération facture demandée');
    
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles avant de générer une facture",
        variant: "destructive"
      });
      return;
    }

    await generateInvoice(cart, customerName, paymentMethod, () => {
      // Callback après succès
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      setCartIdCounter(1);
    });
  };

  // Filtrage des éléments
  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExamTypes = examTypes.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    cart,
    searchTerm,
    medications: filteredMedications,
    examTypes: filteredExamTypes,
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
    generateInvoice: handleGenerateInvoice
  };
};
