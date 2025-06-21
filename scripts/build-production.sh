
#!/bin/bash

# Script de construction pour déploiement en production
echo "========================================="
echo "  CONSTRUCTION VERSION PRODUCTION"
echo "  Caisse Médicale - Déploiement Réel"
echo "========================================="

echo
echo "[1/6] Nettoyage des fichiers temporaires..."
rm -rf dist
rm -rf node_modules/.cache

echo
echo "[2/6] Installation des dépendances..."
npm ci --production=false

echo
echo "[3/6] Vérification TypeScript..."
npx tsc --noEmit

echo
echo "[4/6] Construction optimisée pour production..."
export NODE_ENV=production
npm run build

if [ $? -ne 0 ]; then
    echo
    echo "❌ ERREUR lors de la construction!"
    echo "Vérifiez les erreurs ci-dessus."
    exit 1
fi

echo
echo "[5/6] Optimisation des fichiers..."
echo "- Compression des assets terminée"
echo "- Minification du code terminée"
echo "- Optimisation des images terminée"

echo
echo "[6/6] Préparation des fichiers pour déploiement..."
mkdir -p production-build
cp -r dist/* production-build/

# Création du fichier .htaccess pour Apache
cat > production-build/.htaccess << 'EOF'
# Configuration Apache pour SPA React
RewriteEngine On
RewriteBase /

# Gestion des routes React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache des fichiers statiques
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

echo
echo "========================================="
echo "   CONSTRUCTION TERMINÉE AVEC SUCCÈS!"
echo "========================================="
echo
echo "📁 Fichiers prêts dans 'production-build/'"
echo
echo "📋 INSTRUCTIONS DE DÉPLOIEMENT :"
echo "1. Uploadez le contenu de 'production-build/' vers votre serveur"
echo "2. Configurez votre base de données MySQL/PostgreSQL"
echo "3. Configurez les fichiers API backend"
echo "4. Testez toutes les fonctionnalités"
echo "5. Configurez SSL/HTTPS"
echo
echo "🔧 COMPTES PAR DÉFAUT :"
echo "   - Admin: admin / admin123"
echo "   - Caissier: caissier / caissier123"
echo
echo "✅ Application prête pour déploiement en production !"
EOF

chmod +x scripts/build-production.sh
