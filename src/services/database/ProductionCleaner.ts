
export class ProductionCleaner {
  
  static async clearAllLocalData(): Promise<void> {
    console.log('🧹 Nettoyage des données locales...');
    
    // Supprimer toutes les données localStorage liées à l'application
    const keysToRemove = [
      'medical_center_user',
      'center_config',
      'user_preferences',
      'print_config',
      'offline_users',
      'offline_medications',
      'offline_exam_types',
      'offline_expense_categories',
      'offline_sales',
      'offline_sale_items',
      'offline_exams',
      'offline_expenses',
      'last_login',
      'last_logout',
      'database_config',
      'system_tests_completed',
      'db_config_encrypted',
      'supabase_config'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Nettoyer le sessionStorage aussi
    sessionStorage.clear();

    console.log('✅ Données locales supprimées');
  }

  static async clearSupabaseData(adapter: any): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧹 Nettoyage de la base de données Supabase...');

      // Liste des tables à vider (dans l'ordre pour respecter les contraintes)
      const tablesToClear = [
        'sale_items',
        'exams', 
        'expenses',
        'sales',
        'user_actions',
        'user_sessions'
      ];

      for (const table of tablesToClear) {
        try {
          await adapter.clearTable(table);
          console.log(`✅ Table ${table} vidée`);
        } catch (error) {
          console.warn(`⚠️ Erreur lors du nettoyage de ${table}:`, error);
        }
      }

      return {
        success: true,
        message: 'Base de données nettoyée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage Supabase:', error);
      return {
        success: false,
        message: 'Erreur lors du nettoyage de la base de données'
      };
    }
  }

  static async initializeProductionData(adapter: any): Promise<void> {
    console.log('🚀 Initialisation des données de production...');

    // Créer un utilisateur administrateur par défaut
    try {
      const adminUser = {
        id: crypto.randomUUID(),
        username: 'admin',
        email: 'admin@caisse-medicale.com',
        password_hash: btoa('admin123'),
        full_name: 'Administrateur Système',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await adapter.createUser(adminUser);
      console.log('✅ Utilisateur administrateur créé');
    } catch (error) {
      console.warn('⚠️ Utilisateur admin existe déjà ou erreur:', error);
    }

    console.log('✅ Données de production initialisées');
  }

  static isProductionEnvironment(): boolean {
    // Vérifier si nous sommes en production
    return window.location.hostname !== 'localhost' && 
           !window.location.hostname.includes('lovableproject.com');
  }
}
