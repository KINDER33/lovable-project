
export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  date: string;
  saleReference?: string; // Nouvelle propriété pour la référence de vente
}

export interface OptimizedInvoiceGeneratorProps {
  invoiceData: InvoiceData;
  onPrint?: () => void;
}
