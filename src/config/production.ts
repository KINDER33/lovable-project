
// Configuration de production pour déploiement en ligne
export const PRODUCTION_CONFIG = {
  // Informations de l'application
  APP_NAME: 'Caisse Médicale',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: 'production',
  
  // Configuration sécurité
  SECURITY: {
    SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 heures en millisecondes
    AUTO_LOGOUT: true,
    REQUIRE_AUTH: true,
    HTTPS_ONLY: true
  },
  
  // Configuration interface
  UI: {
    THEME: 'light',
    LANGUAGE: 'fr',
    CURRENCY: 'FCFA',
    DECIMAL_PLACES: 0,
    AUTO_PRINT_INVOICES: true
  },
  
  // Configuration système
  SYSTEM: {
    DEBUG_MODE: false,
    CONSOLE_LOGS: false,
    ERROR_REPORTING: true,
    PERFORMANCE_MONITORING: true
  },
  
  // Configuration sauvegarde
  BACKUP: {
    AUTO_BACKUP: true,
    RETENTION_DAYS: 90,
    COMPRESS_BACKUPS: true
  },
  
  // Informations du centre de santé
  CENTER_INFO: {
    NAME: 'Centre de Santé Solidarité Islamique',
    ADDRESS: 'MONGO, TCHAD',
    PHONE: '+235 66 49 22 54',
    EMAIL: 'contact@solidarite-islamique.td'
  }
};

// Fonction pour vérifier l'environnement de production
export const isProductionEnvironment = (): boolean => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  return !hostname.includes('localhost') && 
         !hostname.includes('127.0.0.1') && 
         !hostname.includes('lovable') &&
         !hostname.includes('127.0.0.1');
};

// Fonction pour obtenir la configuration selon l'environnement
export const getAppConfig = () => {
  return PRODUCTION_CONFIG;
};
