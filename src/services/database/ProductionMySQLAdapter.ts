import { DatabaseAdapter, Medication, ExamType, Sale, SaleItem, ExpenseCategory, Expense, User, CreateUserData, UpdateUserData } from './DatabaseAdapter';
import { DatabaseResult } from './types';

export class ProductionMySQLAdapter extends DatabaseAdapter {
  private apiBaseUrl: string;

  constructor() {
    super();
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isProduction = !hostname.includes('localhost') && 
                        !hostname.includes('127.0.0.1') && 
                        !hostname.includes('lovable.app');
    
    this.apiBaseUrl = isProduction ? 
      `${window.location.origin}/api` : 
      `${window.location.origin}/api`;
    
    console.log('🚀 ProductionMySQLAdapter initialisé pour LWS production:', {
      apiUrl: this.apiBaseUrl,
      isProduction,
      hostname
    });
  }

  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('🔍 Test de connexion MySQL LWS production...');
      
      const response = await fetch(`${this.apiBaseUrl}/config-lws.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Connexion MySQL LWS production réussie:', result);
        return {
          success: true,
          message: `Base production opérationnelle: ${result.database} (${result.users_count || 0} utilisateurs)`
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ Erreur connexion MySQL LWS production:', error);
      return {
        success: false,
        error: `Impossible de se connecter à la base production: ${error.message}`
      };
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const url = endpoint.includes('.php') ? 
        `${this.apiBaseUrl}/${endpoint}` : 
        `${this.apiBaseUrl}/${endpoint}-lws.php`;
        
      console.log('📡 Requête API production:', url);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📝 Réponse API production:', result);
      return result;
    } catch (error: any) {
      console.error(`💥 Erreur API ${endpoint} production:`, error);
      throw error;
    }
  }

  // Authentification
  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('🔑 Tentative de connexion production pour:', username);

      const result = await this.makeRequest('users', {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });

      if (result.success && result.user) {
        console.log('✅ Connexion réussie production pour:', result.user.username);
        return {
          success: true,
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email || `${result.user.username}@caisse-medicale.com`,
            fullName: result.user.full_name,
            role: result.user.role
          }
        };
      } else {
        console.log('❌ Connexion échouée production:', result.error);
        return { success: false, error: result.error || 'Utilisateur non trouvé' };
      }
    } catch (error: any) {
      console.error('💥 Erreur connexion production:', error);
      return { success: false, error: error.message };
    }
  }

  // Utilisateurs
  async getUsers(): Promise<DatabaseResult<User[]>> {
    try {
      console.log('👥 Récupération des utilisateurs production...');
      const result = await this.makeRequest('users');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      console.error('❌ Erreur getUsers production:', error);
      return { success: false, error: error.message };
    }
  }

  async createUser(user: CreateUserData): Promise<DatabaseResult<User>> {
    try {
      console.log('👤 Création utilisateur production:', user.username);
      
      const result = await this.makeRequest('users', {
        method: 'POST',
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          password: user.password,
          role: user.role || 'caissier'
        })
      });
      
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      console.error('❌ Erreur createUser production:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, user: UpdateUserData): Promise<DatabaseResult<User>> {
    try {
      const result = await this.makeRequest('users', {
        method: 'PUT',
        body: JSON.stringify({ id, ...user })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('users', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Médicaments
  async getMedications(): Promise<DatabaseResult<Medication[]>> {
    try {
      const result = await this.makeRequest('medications');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createMedication(medication: Omit<Medication, 'id'>): Promise<DatabaseResult<Medication>> {
    try {
      const result = await this.makeRequest('medications', {
        method: 'POST',
        body: JSON.stringify(medication)
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateMedication(id: string, medication: Partial<Medication>): Promise<DatabaseResult<Medication>> {
    try {
      const result = await this.makeRequest('medications', {
        method: 'PUT',
        body: JSON.stringify({ id, ...medication })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteMedication(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('medications', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Ventes
  async getSales(): Promise<DatabaseResult<Sale[]>> {
    try {
      const result = await this.makeRequest('sales');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createSale(sale: Omit<Sale, 'id'>): Promise<DatabaseResult<Sale>> {
    try {
      console.log('💾 Création de vente production:', sale);
      
      const result = await this.makeRequest('sales', {
        method: 'POST',
        body: JSON.stringify(sale)
      });
      
      if (result.success) {
        console.log('✅ Vente créée avec succès production:', result);
        return { 
          success: true, 
          data: { invoice_number: result.invoice_number } as Sale
        };
      } else {
        console.error('❌ Erreur création vente production:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('💥 Erreur réseau création vente production:', error);
      return { success: false, error: error.message };
    }
  }

  // Méthodes pour les types d'examens
  async getExamTypes(): Promise<DatabaseResult<ExamType[]>> {
    try {
      const result = await this.makeRequest('exam_types');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Méthodes pour les dépenses
  async getExpenses(): Promise<DatabaseResult<Expense[]>> {
    try {
      const result = await this.makeRequest('expenses');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExpenseCategories(): Promise<DatabaseResult<ExpenseCategory[]>> {
    try {
      const result = await this.makeRequest('expense_categories');
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<DatabaseResult<Expense>> {
    try {
      const result = await this.makeRequest('expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ... keep existing code (all other methods remain the same)

  async createExamType(examType: Omit<ExamType, 'id'>): Promise<DatabaseResult<ExamType>> {
    try {
      const result = await this.makeRequest('exam_types', {
        method: 'POST',
        body: JSON.stringify(examType)
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExamType(id: string, examType: Partial<ExamType>): Promise<DatabaseResult<ExamType>> {
    try {
      const result = await this.makeRequest('exam_types', {
        method: 'PUT',
        body: JSON.stringify({ id, ...examType })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExamType(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('exam_types', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<DatabaseResult<Sale>> {
    try {
      const result = await this.makeRequest('sales', {
        method: 'PUT',
        body: JSON.stringify({ id, ...sale })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteSale(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('sales', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const result = await this.makeRequest('expense_categories', {
        method: 'POST',
        body: JSON.stringify(category)
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const result = await this.makeRequest('expense_categories', {
        method: 'PUT',
        body: JSON.stringify({ id, ...category })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpenseCategory(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('expense_categories', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<DatabaseResult<Expense>> {
    try {
      const result = await this.makeRequest('expenses', {
        method: 'PUT',
        body: JSON.stringify({ id, ...expense })
      });
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpense(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.makeRequest('expenses', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
