import { createClient } from '@supabase/supabase-js';
import { DatabaseAdapter, Medication, ExamType, Sale, SaleItem, ExpenseCategory, Expense, User, CreateUserData, UpdateUserData } from './DatabaseAdapter';
import { DatabaseResult } from './types';

export class SupabaseAdapter extends DatabaseAdapter {
  private supabase: any;

  constructor() {
    super();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iynltojhdocgofmhedmk.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { 
        success: true, 
        message: 'Connexion Supabase établie avec succès' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Clear table method for production cleanup
  async clearTable(tableName: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🧹 Nettoyage de la table ${tableName}...`);
      
      // Use raw SQL query to clear table data
      const { error } = await this.supabase.rpc('clear_table_data', { 
        table_name: tableName 
      });

      if (error) {
        // Fallback: try direct delete
        const { error: deleteError } = await this.supabase
          .from(tableName as any)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

        if (deleteError) {
          console.warn(`⚠️ Erreur lors du nettoyage de ${tableName}:`, deleteError);
          return { success: false, error: deleteError.message };
        }
      }

      console.log(`✅ Table ${tableName} nettoyée`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ Erreur lors du nettoyage de ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Authentification
  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('🔑 Tentative de connexion Supabase pour:', username);
      
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error) {
        console.log('❌ Utilisateur non trouvé:', error.message);
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      // Vérifier le mot de passe (en production, utiliser un hash approprié)
      const isPasswordValid = data.password_hash === btoa(password) || data.password_hash === password;
      
      if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect');
        return { success: false, error: 'Mot de passe incorrect' };
      }

      console.log('✅ Connexion Supabase réussie pour:', data.username);
      return {
        success: true,
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.full_name,
          role: data.role
        }
      };
    } catch (error: any) {
      console.error('💥 Erreur de connexion Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Utilisateurs
  async getUsers(): Promise<DatabaseResult<User[]>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUser(user: CreateUserData): Promise<DatabaseResult<User>> {
    try {
      const { error } = await this.supabase
        .from('users')
        .insert([user]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, user: UpdateUserData): Promise<DatabaseResult<User>> {
    try {
      const { error } = await this.supabase
        .from('users')
        .update(user)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Médicaments
  async getMedications(): Promise<DatabaseResult<Medication[]>> {
    try {
      const { data, error } = await this.supabase
        .from('medications')
        .select('*')
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createMedication(medication: Omit<Medication, 'id'>): Promise<DatabaseResult<Medication>> {
    try {
      const { error } = await this.supabase
        .from('medications')
        .insert([medication]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateMedication(id: string, medication: Partial<Medication>): Promise<DatabaseResult<Medication>> {
    try {
      const { error } = await this.supabase
        .from('medications')
        .update(medication)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteMedication(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Ventes
  async getSales(): Promise<DatabaseResult<Sale[]>> {
    try {
      const { data, error } = await this.supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createSale(sale: Omit<Sale, 'id'>): Promise<DatabaseResult<Sale>> {
    try {
      const { error } = await this.supabase
        .from('sales')
        .insert([sale]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Types d'examens
  async getExamTypes(): Promise<DatabaseResult<ExamType[]>> {
    try {
      const { data, error } = await this.supabase
        .from('exam_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Examens
  async getExams(): Promise<{ data: any[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createExam(exam: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('exams')
        .insert([exam]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Dépenses
  async getExpenses(): Promise<DatabaseResult<Expense[]>> {
    try {
      const { data, error } = await this.supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExpenseCategories(): Promise<DatabaseResult<ExpenseCategory[]>> {
    try {
      const { data, error } = await this.supabase
        .from('expense_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<DatabaseResult<Expense>> {
    try {
      const { error } = await this.supabase
        .from('expenses')
        .insert([expense]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExamType(examType: Omit<ExamType, 'id'>): Promise<DatabaseResult<ExamType>> {
    try {
      const { error } = await this.supabase
        .from('exam_types')
        .insert([examType]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExamType(id: string, examType: Partial<ExamType>): Promise<DatabaseResult<ExamType>> {
    try {
      const { error } = await this.supabase
        .from('exam_types')
        .update(examType)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExamType(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('exam_types')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<DatabaseResult<Sale>> {
    try {
      const { error } = await this.supabase
        .from('sales')
        .update(sale)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteSale(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const { error } = await this.supabase
        .from('expense_categories')
        .insert([category]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const { error } = await this.supabase
        .from('expense_categories')
        .update(category)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpenseCategory(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('expense_categories')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<DatabaseResult<Expense>> {
    try {
      const { error } = await this.supabase
        .from('expenses')
        .update(expense)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpense(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const { error } = await this.supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
