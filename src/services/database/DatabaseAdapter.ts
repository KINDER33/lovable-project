
import { DatabaseResult } from "./types";

export interface Medication {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
  min_stock_level?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamType {
  id: string;
  name: string;
  base_price: number;
  department: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  invoice_number: string;
  sale_date: string;
  payment_method: string;
  customer_name: string;
  total_amount: number;
  user_id: string;
  is_cancelled: boolean;
  created_at?: string;
  updated_at?: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  item_id: string;
  item_type: 'medication' | 'exam';
  item_name: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  expense_date: string;
  amount: number;
  description?: string;
  category_name?: string;
  expense_category_id: string;
  supplier?: string;
  is_cancelled: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  fullName?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export abstract class DatabaseAdapter {
  abstract testConnection(): Promise<{ success: boolean; message?: string; error?: string }>;
  
  abstract getMedications(): Promise<DatabaseResult<Medication[]>>;
  abstract createMedication(medication: Omit<Medication, 'id'>): Promise<DatabaseResult<Medication>>;
  abstract updateMedication(id: string, updates: Partial<Medication>): Promise<DatabaseResult<Medication>>;
  abstract deleteMedication(id: string): Promise<DatabaseResult<boolean>>;

  abstract getExamTypes(): Promise<DatabaseResult<ExamType[]>>;
  abstract createExamType(examType: Omit<ExamType, 'id'>): Promise<DatabaseResult<ExamType>>;
  abstract updateExamType(id: string, updates: Partial<ExamType>): Promise<DatabaseResult<ExamType>>;
  abstract deleteExamType(id: string): Promise<DatabaseResult<boolean>>;

  abstract getSales(): Promise<DatabaseResult<Sale[]>>;
  abstract createSale(sale: Omit<Sale, 'id'>): Promise<DatabaseResult<Sale>>;
  abstract updateSale(id: string, updates: Partial<Sale>): Promise<DatabaseResult<Sale>>;
  abstract deleteSale(id: string): Promise<DatabaseResult<boolean>>;

  abstract getExpenseCategories(): Promise<DatabaseResult<ExpenseCategory[]>>;
  abstract createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<DatabaseResult<ExpenseCategory>>;
  abstract updateExpenseCategory(id: string, updates: Partial<ExpenseCategory>): Promise<DatabaseResult<ExpenseCategory>>;
  abstract deleteExpenseCategory(id: string): Promise<DatabaseResult<boolean>>;

  abstract getExpenses(): Promise<DatabaseResult<Expense[]>>;
  abstract createExpense(expense: Omit<Expense, 'id'>): Promise<DatabaseResult<Expense>>;
  abstract updateExpense(id: string, updates: Partial<Expense>): Promise<DatabaseResult<Expense>>;
  abstract deleteExpense(id: string): Promise<DatabaseResult<boolean>>;

  // Méthodes de gestion des utilisateurs
  abstract getUsers(): Promise<DatabaseResult<User[]>>;
  abstract createUser(userData: CreateUserData): Promise<DatabaseResult<User>>;
  abstract updateUser(userId: string, userData: UpdateUserData): Promise<DatabaseResult<User>>;
  abstract deleteUser(userId: string): Promise<DatabaseResult<boolean>>;
  abstract login(username: string, password: string): Promise<{
    success: boolean;
    user?: {
      id: string;
      username: string;
      fullName: string;
      role: string;
      email: string;
    };
    error?: string;
  }>;
}
