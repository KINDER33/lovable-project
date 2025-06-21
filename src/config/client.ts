
// Configuration pour déploiement client final
export const CLIENT_CONFIG = {
  // Informations de l'application
  APP_NAME: 'Caisse Médicale',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: 'client',
  
  // Configuration interface
  UI: {
    THEME: 'light',
    LANGUAGE: 'fr',
    CURRENCY: 'FCFA',
    DECIMAL_PLACES: 0,
    AUTO_PRINT_INVOICES: true,
    SHOW_DEBUG: false
  },
  
  // Configuration système
  SYSTEM: {
    DEBUG_MODE: false,
    CONSOLE_LOGS: false,
    ERROR_REPORTING: true,
    AUTO_BACKUP: true
  },
  
  // Configuration de base
  DATABASE: {
    BACKUP_ENABLED: true,
    BACKUP_INTERVAL: '24h',
    CLEANUP_OLD_DATA: true
  }
};

// Fonction de validation de la configuration
export const validateClientConfig = () => {
  const requiredFields = ['APP_NAME', 'APP_VERSION', 'ENVIRONMENT'];
  const missingFields = requiredFields.filter(field => !CLIENT_CONFIG[field]);
  
  if (missingFields.length > 0) {
    console.error('Configuration manquante:', missingFields);
    return false;
  }
  
  return true;
};
