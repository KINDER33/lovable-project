
const fs = require('fs');
const path = require('path');

console.log('📦 Préparation package local...');

// Configuration pour déploiement local
const localConfig = {
  environment: 'local',
  buildTime: new Date().toISOString(),
  version: '1.0.0',
  features: {
    offlineMode: true,
    autoBackup: true,
    localStorage: true,
    supabaseIntegration: true
  },
  requirements: {
    nodeVersion: '>=18.0.0',
    browsers: ['Chrome 90+', 'Firefox 90+', 'Edge 90+'],
    memory: '4GB RAM recommended',
    storage: '1GB free space'
  }
};

// Créer le fichier de configuration
const configPath = path.join(__dirname, '..', 'dist', 'config.json');
fs.writeFileSync(configPath, JSON.stringify(localConfig, null, 2));

// Créer le fichier de version
const versionInfo = {
  version: '1.0.0',
  buildDate: new Date().toISOString(),
  type: 'local-deployment',
  features: Object.keys(localConfig.features).filter(key => localConfig.features[key])
};

const versionPath = path.join(__dirname, '..', 'dist', 'version.json');
fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));

console.log('✅ Package local préparé avec succès !');
console.log(`📁 Configuration: ${configPath}`);
console.log(`📝 Version: ${versionPath}`);
