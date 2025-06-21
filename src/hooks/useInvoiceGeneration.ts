
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { CartItem, InvoiceData } from '@/types/sales';
import { Sale } from '@/services/database/DatabaseAdapter';

export interface SaleData {
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  payment_method: string;
  sale_date: string;
  user_id: string;
  is_cancelled: boolean;
}

export interface CreateSaleResult {
  success: boolean;
  invoice_number?: string;
}

export const useInvoiceGeneration = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const { toast } = useToast();
  const { adapter } = useDatabase();

  const generateInvoice = async (
    cart: CartItem[],
    customerName: string,
    paymentMethod: string,
    onSuccess?: () => void
  ) => {
    console.log('=== DÉBUT GÉNÉRATION FACTURE ===');
    console.log('Panier reçu:', cart);
    console.log('Nombre d\'articles dans le panier:', cart.length);
    console.log('Client:', customerName);
    console.log('Paiement:', paymentMethod);

    if (cart.length === 0) {
      console.log('❌ ERREUR: Panier vide');
      toast({
        title: "Erreur",
        description: "Le panier est vide. Ajoutez des articles avant de générer une facture.",
        variant: "destructive"
      });
      return;
    }

    try {
      const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      console.log('💰 Total calculé:', totalAmount, 'FCFA');

      // Générer un numéro de facture unique
      const invoiceNumber = `F${Date.now().toString().slice(-6)}`;
      console.log('📄 Numéro de facture généré:', invoiceNumber);

      let result: CreateSaleResult = { success: true, invoice_number: invoiceNumber };

      // Essayer de sauvegarder en base de données (optionnel)
      if (adapter) {
        try {
          console.log('💾 Tentative de sauvegarde en base de données...');
          const saleData: Omit<Sale, 'id'> = {
            invoice_number: invoiceNumber,
            customer_name: customerName || 'Client',
            total_amount: totalAmount,
            payment_method: paymentMethod,
            sale_date: new Date().toISOString(),
            user_id: 'system',
            is_cancelled: false
          };

          const dbResult = await adapter.createSale(saleData);
          if (dbResult.success) {
            result = { success: true, invoice_number: invoiceNumber };
            console.log('✅ Sauvegarde en DB réussie:', result);
          } else {
            console.log('⚠️ Échec sauvegarde DB, continue en mode local:', dbResult.error);
            // Continuer en mode local même si la DB échoue
          }
        } catch (error) {
          console.error('❌ Erreur sauvegarde vente en DB:', error);
          console.log('🔄 Continuation en mode local après erreur DB');
          // Continuer en mode local
        }
      } else {
        console.log('📱 Mode local (pas d\'adaptateur DB)');
      }

      // TOUJOURS créer la facture, même si la DB échoue
      console.log('✅ Création de la facture en cours...');

      // Préparer les données de facture pour l'affichage
      const finalInvoiceData: InvoiceData = {
        invoiceNumber: result.invoice_number || invoiceNumber,
        customerName: customerName || 'Client',
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
        saleReference: `REF-${result.invoice_number || invoiceNumber}-${Date.now().toString().slice(-6)}`
      };

      console.log('=== DONNÉES FACTURE FINALES ===');
      console.log('InvoiceData complète:', finalInvoiceData);

      // Sauvegarder en localStorage pour consultation ultérieure
      try {
        const savedSales = JSON.parse(localStorage.getItem('sales_history') || '[]');
        const newSale = {
          id: Date.now().toString(),
          invoice_number: result.invoice_number || invoiceNumber,
          customer_name: customerName || 'Client',
          total_amount: totalAmount,
          payment_method: paymentMethod,
          sale_date: new Date().toISOString(),
          items: cart.map(item => `${item.name} (${item.quantity})`).join(', ')
        };
        savedSales.push(newSale);
        localStorage.setItem('sales_history', JSON.stringify(savedSales));
        console.log('💾 Vente sauvegardée dans localStorage');
      } catch (storageError) {
        console.error('❌ Erreur sauvegarde localStorage:', storageError);
      }

      console.log('🎯 Mise à jour des états pour afficher la facture...');
      setInvoiceData(finalInvoiceData);
      setShowInvoice(true);
      
      console.log('🎯 États mis à jour - showInvoice:', true);
      console.log('🎯 États mis à jour - invoiceData:', finalInvoiceData);

      toast({
        title: "Succès",
        description: `Facture ${finalInvoiceData.invoiceNumber} générée avec succès !`
      });

      if (onSuccess) {
        console.log('🔄 Exécution du callback onSuccess');
        onSuccess();
      }

    } catch (error) {
      console.error('❌ ERREUR GÉNÉRATION FACTURE:', error);
      toast({
        title: "Erreur",
        description: `Impossible de générer la facture: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }

    console.log('=== FIN GÉNÉRATION FACTURE ===');
  };

  return {
    showInvoice,
    invoiceData,
    setShowInvoice,
    generateInvoice
  };
};
