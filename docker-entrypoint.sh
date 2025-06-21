
#!/bin/sh
set -e

echo "========================================="
echo "  CAISSE MÉDICALE - PRODUCTION"
echo "  Centre de Santé Solidarité Islamique"
echo "========================================="

# Fonction de vérification de la santé
check_health() {
    echo "🔍 Vérification de la santé du service..."
    curl -f http://localhost/health || return 1
}

# Vérification des variables d'environnement
echo "⚙️ Vérification de la configuration..."
echo "Application: ${APP_NAME:-Caisse Médicale}"
echo "Version: ${APP_VERSION:-1.0.0}"
echo "Port: 80"

# Vérification des fichiers
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ Erreur: Fichiers de l'application manquants"
    exit 1
fi

echo "✅ Configuration validée"

# Vérification des permissions
echo "🔒 Vérification des permissions..."
if [ ! -w "/var/log/nginx" ]; then
    echo "❌ Erreur: Permissions insuffisantes sur /var/log/nginx"
    exit 1
fi

# Test de la configuration Nginx
echo "🔧 Test de la configuration Nginx..."
nginx -t || exit 1

echo "✅ Configuration Nginx validée"

# Affichage des informations de démarrage
echo
echo "🚀 Démarrage de l'application..."
echo "📱 Interface accessible sur le port 80"
echo "🏥 Centre: Centre de Santé Solidarité Islamique"
echo "📍 Localisation: MONGO, TCHAD"
echo "📊 Surveillance de santé activée"
echo

# Exécution de la commande principale
exec "$@"
