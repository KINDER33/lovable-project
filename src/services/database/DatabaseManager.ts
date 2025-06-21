
import { DatabaseAdapter } from './DatabaseAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';
import { MySQLAdapter } from './MySQLAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { ProductionMySQLAdapter } from './ProductionMySQLAdapter';

export type DatabaseType = 'supabase' | 'mysql' | 'localStorage' | 'production' | 'offline';

export class DatabaseManager {
  private adapter: DatabaseAdapter | null = null;
  private currentType: DatabaseType | null = null;

  constructor() {
    console.log('🔧 DatabaseManager - Initialisation');
  }

  async initialize(type?: DatabaseType): Promise<{ success: boolean; type?: DatabaseType; message?: string; error?: string }> {
    try {
      // Si aucun type spécifié, utiliser la détection automatique
      if (!type) {
        return await this.autoDetectAndInitialize();
      }

      console.log(`🔄 DatabaseManager - Initialisation avec ${type}`);
      
      let newAdapter: DatabaseAdapter;
      
      switch (type) {
        case 'supabase':
          newAdapter = new SupabaseAdapter();
          break;
        case 'mysql':
          newAdapter = new MySQLAdapter();
          break;
        case 'localStorage':
          newAdapter = new LocalStorageAdapter();
          break;
        case 'production':
          newAdapter = new ProductionMySQLAdapter();
          break;
        default:
          throw new Error(`Type de base de données non supporté: ${type}`);
      }

      // Test de connexion
      const testResult = await newAdapter.testConnection();
      if (!testResult.success) {
        console.error(`❌ Échec du test de connexion ${type}:`, testResult.error);
        return { success: false, error: testResult.error };
      }

      this.adapter = newAdapter;
      this.currentType = type;
      
      console.log(`✅ DatabaseManager - ${type} initialisé avec succès`);
      return { 
        success: true, 
        type,
        message: `Base de données ${type} initialisée avec succès`
      };
      
    } catch (error: any) {
      console.error(`💥 Erreur initialisation ${type}:`, error);
      return { success: false, error: error.message };
    }
  }

  getAdapter(): DatabaseAdapter {
    if (!this.adapter) {
      throw new Error('Base de données non initialisée. Appelez initialize() d\'abord.');
    }
    return this.adapter;
  }

  getCurrentType(): DatabaseType | null {
    return this.currentType;
  }

  isInitialized(): boolean {
    return this.adapter !== null;
  }

  async autoDetectAndInitialize(): Promise<{ success: boolean; type?: DatabaseType; message?: string; error?: string }> {
    console.log('🔍 DatabaseManager - Détection automatique du type de base de données...');
    
    // Vérifier si on est en production LWS
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isProduction = !hostname.includes('localhost') && 
                        !hostname.includes('127.0.0.1') && 
                        !hostname.includes('lovable.app');

    if (isProduction) {
      console.log('🌐 Environnement de production détecté - utilisation de MySQL LWS');
      const result = await this.initialize('production');
      return { 
        ...result, 
        type: 'production',
        message: 'Connecté à MySQL LWS en production'
      };
    }

    // Ordre de priorité pour l'environnement de développement
    const typesToTry: DatabaseType[] = ['supabase', 'mysql', 'localStorage'];
    
    for (const type of typesToTry) {
      console.log(`🔄 Test de ${type}...`);
      const result = await this.initialize(type);
      
      if (result.success) {
        console.log(`✅ ${type} sélectionné automatiquement`);
        return { 
          success: true, 
          type,
          message: `Connecté à ${type} automatiquement`
        };
      } else {
        console.log(`❌ ${type} non disponible:`, result.error);
      }
    }

    console.log('❌ Aucune base de données disponible');
    return { 
      success: false, 
      error: 'Aucune base de données disponible. Vérifiez votre configuration.' 
    };
  }

  async reconnectOnline(): Promise<boolean> {
    console.log('🔄 Tentative de reconnexion en ligne...');
    
    try {
      // Essayer d'abord Supabase
      const result = await this.initialize('supabase');
      if (result.success) {
        console.log('✅ Reconnexion Supabase réussie');
        return true;
      }

      // Puis MySQL local
      const mysqlResult = await this.initialize('mysql');
      if (mysqlResult.success) {
        console.log('✅ Reconnexion MySQL réussie');
        return true;
      }

      console.log('❌ Impossible de se reconnecter en ligne');
      return false;
    } catch (error) {
      console.error('💥 Erreur lors de la reconnexion:', error);
      return false;
    }
  }

  async forceOfflineMode(): Promise<void> {
    console.log('🔄 Basculement en mode hors ligne...');
    
    try {
      const result = await this.initialize('localStorage');
      if (result.success) {
        this.currentType = 'offline';
        console.log('✅ Mode hors ligne activé');
      } else {
        throw new Error('Impossible d\'activer le mode hors ligne');
      }
    } catch (error) {
      console.error('💥 Erreur basculement hors ligne:', error);
      throw error;
    }
  }
}

// Instance singleton
export const databaseManager = new DatabaseManager();
