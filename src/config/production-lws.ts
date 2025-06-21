
// Configuration spécifique pour le déploiement LWS
export const LWS_PRODUCTION_CONFIG = {
  // Configuration base de données LWS
  DATABASE: {
    HOST: '127.0.0.1',
    PORT: 3306,
    NAME: 'afric2012609_225kcxe',
    USER: 'afric2012609',
    PASSWORD: 'Dounia@2025'
  },
  
  // Configuration API pour production
  API: {
    BASE_URL: '/api', // Sera résolu automatiquement selon l'environnement
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  
  // Configuration de l'application
  APP: {
    NAME: 'Caisse Médicale',
    VERSION: '1.0.0',
    ENVIRONMENT: 'production',
    DEBUG: false
  },
  
  // Configuration de sécurité
  SECURITY: {
    SESSION_TIMEOUT: 30, // minutes
    AUTO_LOGOUT: true,
    REQUIRE_HTTPS: true // En production
  }
};

// Fonction pour détecter l'environnement
export const isProductionEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  return !hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('lovable.app');
};

// Fonction pour obtenir l'URL de l'API
export const getProductionApiUrl = (): string => {
  if (isProductionEnvironment()) {
    return `${window.location.origin}/api`;
  }
  // Pour développement local
  return `${window.location.origin}/caisse-medicale/api`;
};
