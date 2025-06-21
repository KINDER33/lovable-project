import { DatabaseAdapter, Medication, ExamType, Sale, SaleItem, ExpenseCategory, Expense, User, CreateUserData, UpdateUserData } from './DatabaseAdapter';
import { DatabaseResult } from './types';

export class MySQLAdapter extends DatabaseAdapter {
  private apiBaseUrl: string;

  constructor() {
    super();
    this.apiBaseUrl = this.getApiBaseUrl();
  }

  private getApiBaseUrl(): string {
    const currentUrl = window.location.origin;
    
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return `${currentUrl}/caisse-medicale/api`;
    }
    
    return `${currentUrl}/api`;
  }

  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('🔍 Test de connexion MySQL WAMP...');
      console.log('📡 URL API:', this.apiBaseUrl);

      const response = await fetch(`${this.apiBaseUrl}/medications.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Connexion MySQL WAMP réussie');
        return {
          success: true,
          message: 'Connexion MySQL établie avec succès'
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ Erreur connexion MySQL:', error);
      return {
        success: false,
        error: `Impossible de se connecter à MySQL WAMP: ${error.message}`
      };
    }
  }

  // Authentification
  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('🔑 Connexion MySQL pour:', username);

      const response = await fetch(`${this.apiBaseUrl}/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.user) {
        console.log('✅ Connexion MySQL réussie pour:', result.user.username);
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
        return { success: false, error: result.error || 'Utilisateur non trouvé' };
      }
    } catch (error: any) {
      console.error('💥 Erreur connexion MySQL:', error);
      return { success: false, error: error.message };
    }
  }

  // Utilisateurs
  async getUsers(): Promise<DatabaseResult<User[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUser(user: CreateUserData): Promise<DatabaseResult<User>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...user })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, user: UpdateUserData): Promise<DatabaseResult<User>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...user })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Médicaments
  async getMedications(): Promise<DatabaseResult<Medication[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/medications.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createMedication(medication: Omit<Medication, 'id'>): Promise<DatabaseResult<Medication>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/medications.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication)
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateMedication(id: string, medication: Partial<Medication>): Promise<DatabaseResult<Medication>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/medications.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...medication })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteMedication(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/medications.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Ventes - version améliorée
  async getSales(): Promise<DatabaseResult<Sale[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/sales.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createSale(sale: Omit<Sale, 'id'>): Promise<DatabaseResult<Sale>> {
    try {
      console.log('💾 Création de vente MySQL:', sale);
      
      const response = await fetch(`${this.apiBaseUrl}/sales.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Vente créée avec succès:', result);
        return { 
          success: true, 
          data: { invoice_number: result.invoice_number } as Sale
        };
      } else {
        console.error('❌ Erreur création vente:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('💥 Erreur réseau création vente:', error);
      return { success: false, error: error.message };
    }
  }

  // Types d'examens
  async getExamTypes(): Promise<DatabaseResult<ExamType[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exam_types.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Examens
  async getExams(): Promise<DatabaseResult<any[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exams.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExam(exam: any): Promise<DatabaseResult<any>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exams.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam)
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Dépenses
  async getExpenses(): Promise<DatabaseResult<Expense[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExpenseCategories(): Promise<DatabaseResult<ExpenseCategory[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expense_categories.php`);
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<DatabaseResult<Expense>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Adding missing methods for ExamType
  async createExamType(examType: Omit<ExamType, 'id'>): Promise<DatabaseResult<ExamType>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exam_types.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examType)
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExamType(id: string, examType: Partial<ExamType>): Promise<DatabaseResult<ExamType>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exam_types.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...examType })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExamType(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exam_types.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<DatabaseResult<Sale>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/sales.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sale })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteSale(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/sales.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expense_categories.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expense_categories.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...category })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpenseCategory(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expense_categories.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<DatabaseResult<Expense>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...expense })
      });
      const result = await response.json();
      return { success: result.success || false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteExpense(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      return { success: result.success || false, data: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
