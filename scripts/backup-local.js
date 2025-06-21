
const fs = require('fs');
const path = require('path');

// Script de sauvegarde locale automatique
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `backup_${timestamp}`;
  const backupDir = path.join(process.cwd(), 'backup', backupName);
  
  console.log(`💾 Création sauvegarde: ${backupName}`);
  
  // Créer le dossier de sauvegarde
  if (!fs.existsSync(path.join(process.cwd(), 'backup'))) {
    fs.mkdirSync(path.join(process.cwd(), 'backup'), { recursive: true });
  }
  
  fs.mkdirSync(backupDir, { recursive: true });
  
  // Sauvegarder la configuration
  const configSource = path.join(process.cwd(), 'config');
  const configDest = path.join(backupDir, 'config');
  
  if (fs.existsSync(configSource)) {
    fs.mkdirSync(configDest, { recursive: true });
    fs.readdirSync(configSource).forEach(file => {
      fs.copyFileSync(
        path.join(configSource, file),
        path.join(configDest, file)
      );
    });
  }
  
  // Sauvegarder les logs
  const logsSource = path.join(process.cwd(), 'logs');
  const logsDest = path.join(backupDir, 'logs');
  
  if (fs.existsSync(logsSource)) {
    fs.mkdirSync(logsDest, { recursive: true });
    fs.readdirSync(logsSource).forEach(file => {
      fs.copyFileSync(
        path.join(logsSource, file),
        path.join(logsDest, file)
      );
    });
  }
  
  // Créer un fichier de métadonnées
  const metadata = {
    backupDate: new Date().toISOString(),
    backupName: backupName,
    files: {
      config: fs.existsSync(configSource) ? fs.readdirSync(configSource) : [],
      logs: fs.existsSync(logsSource) ? fs.readdirSync(logsSource) : []
    }
  };
  
  fs.writeFileSync(
    path.join(backupDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`✅ Sauvegarde créée: ${backupDir}`);
  console.log(`📊 Fichiers sauvegardés: ${metadata.files.config.length + metadata.files.logs.length}`);
  
  return backupDir;
}

// Exécuter si appelé directement
if (require.main === module) {
  createBackup();
}

module.exports = { createBackup };
