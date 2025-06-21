import { DatabaseAdapter, Medication, ExamType, Sale, SaleItem, ExpenseCategory, Expense, User, CreateUserData, UpdateUserData } from './DatabaseAdapter';
import { DatabaseResult } from './types';

export class LocalStorageAdapter extends DatabaseAdapter {
  constructor() {
    super();
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  async testConnection() {
    try {
      // Test simple d'écriture/lecture localStorage
      const testKey = 'db_test_' + Date.now();
      localStorage.setItem(testKey, 'test');
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (testValue === 'test') {
        return { success: true, message: 'Base de données locale prête (hors ligne)' };
      } else {
        return { success: false, error: 'Erreur d\'accès au stockage local' };
      }
    } catch (err: any) {
      return { success: false, error: `Erreur stockage local: ${err.message}` };
    }
  }

  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async login(username: string, password: string) {
    try {
      const users = this.getFromStorage<any>('offline_users');
      const user = users.find((u: any) => 
        u.username === username && 
        u.is_active === true
      );

      if (!user) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      const expectedPassword = atob(user.password_hash);
      if (expectedPassword !== password) {
        return { success: false, error: 'Mot de passe incorrect' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
          email: user.email
        }
      };
    } catch (err: any) {
      return { success: false, error: `Erreur login local: ${err.message}` };
    }
  }

  async getUsers(): Promise<DatabaseResult<User[]>> {
    try {
      const users = this.getFromStorage<any>('offline_users');
      return { success: true, data: users };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createUser(user: CreateUserData): Promise<DatabaseResult<User>> {
    try {
      const users = this.getFromStorage<any>('offline_users');
      const newUser = {
        id: this.generateId(),
        username: user.username,
        email: user.email,
        password_hash: btoa(user.password),
        full_name: user.fullName,
        role: user.role,
        is_active: true,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      users.push(newUser);
      this.saveToStorage('offline_users', users);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateUser(id: string, user: UpdateUserData): Promise<DatabaseResult<User>> {
    try {
      const users = this.getFromStorage<any>('offline_users');
      const index = users.findIndex((u: any) => u.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      const updateData = {
        ...users[index],
        username: user.username,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        isActive: user.isActive,
        updated_at: this.getCurrentTimestamp()
      };

      if (user.password) {
        updateData.password_hash = btoa(user.password);
      }

      users[index] = updateData;
      this.saveToStorage('offline_users', users);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteUser(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const users = this.getFromStorage<any>('offline_users');
      const filteredUsers = users.filter((u: any) => u.id !== id);
      this.saveToStorage('offline_users', filteredUsers);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getMedications(): Promise<DatabaseResult<Medication[]>> {
    try {
      const medications = this.getFromStorage<any>('offline_medications');
      return { success: true, data: medications.filter((m: any) => m.is_active !== false) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createMedication(medication: Omit<Medication, 'id'>): Promise<DatabaseResult<Medication>> {
    try {
      const medications = this.getFromStorage<any>('offline_medications');
      const newMedication = {
        id: this.generateId(),
        ...medication,
        is_active: true,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      medications.push(newMedication);
      this.saveToStorage('offline_medications', medications);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateMedication(id: string, medication: Partial<Medication>): Promise<DatabaseResult<Medication>> {
    try {
      const medications = this.getFromStorage<any>('offline_medications');
      const index = medications.findIndex((m: any) => m.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Médicament non trouvé' };
      }

      medications[index] = {
        ...medications[index],
        ...medication,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_medications', medications);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteMedication(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const medications = this.getFromStorage<any>('offline_medications');
      const index = medications.findIndex((m: any) => m.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Médicament non trouvé' };
      }

      medications[index] = {
        ...medications[index],
        is_active: false,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_medications', medications);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getSales(): Promise<DatabaseResult<Sale[]>> {
    try {
      const sales = this.getFromStorage<any>('offline_sales');
      return { success: true, data: sales };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createSale(sale: Omit<Sale, 'id'>): Promise<DatabaseResult<Sale>> {
    try {
      const sales = this.getFromStorage<any>('offline_sales');
      const newSale = {
        id: this.generateId(),
        ...sale,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      sales.push(newSale);
      this.saveToStorage('offline_sales', sales);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Types d'examens
  async getExamTypes(): Promise<DatabaseResult<ExamType[]>> {
    try {
      const examTypes = this.getFromStorage<any>('offline_exam_types');
      return { success: true, data: examTypes.filter((e: any) => e.is_active !== false) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Dépenses
  async getExpenses(): Promise<DatabaseResult<Expense[]>> {
    try {
      const expenses = this.getFromStorage<any>('offline_expenses');
      return { success: true, data: expenses };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getExpenseCategories(): Promise<DatabaseResult<ExpenseCategory[]>> {
    try {
      const categories = this.getFromStorage<any>('offline_expense_categories');
      return { success: true, data: categories.filter((c: any) => c.is_active !== false) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // ... keep existing code (all other methods remain the same)

  async createExamType(examType: Omit<ExamType, 'id'>): Promise<DatabaseResult<ExamType>> {
    try {
      const examTypes = this.getFromStorage<any>('offline_exam_types');
      const newExamType = {
        id: this.generateId(),
        ...examType,
        is_active: true,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      examTypes.push(newExamType);
      this.saveToStorage('offline_exam_types', examTypes);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateExamType(id: string, examType: Partial<ExamType>): Promise<DatabaseResult<ExamType>> {
    try {
      const examTypes = this.getFromStorage<any>('offline_exam_types');
      const index = examTypes.findIndex((e: any) => e.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Type d\'examen non trouvé' };
      }

      examTypes[index] = {
        ...examTypes[index],
        ...examType,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_exam_types', examTypes);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteExamType(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const examTypes = this.getFromStorage<any>('offline_exam_types');
      const index = examTypes.findIndex((e: any) => e.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Type d\'examen non trouvé' };
      }

      examTypes[index] = {
        ...examTypes[index],
        is_active: false,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_exam_types', examTypes);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<DatabaseResult<Sale>> {
    try {
      const sales = this.getFromStorage<any>('offline_sales');
      const index = sales.findIndex((s: any) => s.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Vente non trouvée' };
      }

      sales[index] = {
        ...sales[index],
        ...sale,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_sales', sales);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteSale(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const sales = this.getFromStorage<any>('offline_sales');
      const filteredSales = sales.filter((s: any) => s.id !== id);
      this.saveToStorage('offline_sales', filteredSales);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<DatabaseResult<Expense>> {
    try {
      const expenses = this.getFromStorage<any>('offline_expenses');
      const newExpense = {
        id: this.generateId(),
        ...expense,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      expenses.push(newExpense);
      this.saveToStorage('offline_expenses', expenses);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const categories = this.getFromStorage<any>('offline_expense_categories');
      const newCategory = {
        id: this.generateId(),
        ...category,
        is_active: true,
        created_at: this.getCurrentTimestamp(),
        updated_at: this.getCurrentTimestamp()
      };

      categories.push(newCategory);
      this.saveToStorage('offline_expense_categories', categories);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<DatabaseResult<ExpenseCategory>> {
    try {
      const categories = this.getFromStorage<any>('offline_expense_categories');
      const index = categories.findIndex((c: any) => c.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Catégorie de dépense non trouvée' };
      }

      categories[index] = {
        ...categories[index],
        ...category,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_expense_categories', categories);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteExpenseCategory(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const categories = this.getFromStorage<any>('offline_expense_categories');
      const index = categories.findIndex((c: any) => c.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Catégorie de dépense non trouvée' };
      }

      categories[index] = {
        ...categories[index],
        is_active: false,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_expense_categories', categories);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<DatabaseResult<Expense>> {
    try {
      const expenses = this.getFromStorage<any>('offline_expenses');
      const index = expenses.findIndex((e: any) => e.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Dépense non trouvée' };
      }

      expenses[index] = {
        ...expenses[index],
        ...expense,
        updated_at: this.getCurrentTimestamp()
      };

      this.saveToStorage('offline_expenses', expenses);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async deleteExpense(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const expenses = this.getFromStorage<any>('offline_expenses');
      const filteredExpenses = expenses.filter((e: any) => e.id !== id);
      this.saveToStorage('offline_expenses', filteredExpenses);
      return { success: true, data: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
