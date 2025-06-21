
export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'medication' | 'exam';
  quantity: number;
  cartId: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  items: InvoiceItem[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  saleReference: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Add the missing types that other files are importing
export interface Medication {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
  is_active: boolean;
  min_stock_level?: number;
}

export interface ExamType {
  id: string;
  name: string;
  base_price: number;
  department: string;
  is_active: boolean;
}
