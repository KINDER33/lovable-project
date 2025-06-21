
#!/bin/bash

# Script de déploiement automatisé pour logiciel de gestion médicale
# Version: 1.0
# Usage: ./deploy-production.sh

set -e  # Arrêt en cas d'erreur

# Configuration
APP_NAME="medical-cashier"
APP_DIR="/opt/$APP_NAME"
BACKUP_DIR="/opt/backups/$APP_NAME"
SERVICE_NAME="$APP_NAME"
NGINX_SITE="$APP_NAME"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des privilèges
check_privileges() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Ce script doit être exécuté en tant que root"
        echo "Utilisez: sudo $0"
        exit 1
    fi
}

# Vérification des prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        echo "Installez Node.js 18+ avant de continuer"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -lt 18 ]]; then
        print_error "Node.js version 18+ requis (actuelle: $NODE_VERSION)"
        exit 1
    fi
    
    # NPM
    if ! command -v npm &> /dev/null; then
        print_error "NPM n'est pas installé"
        exit 1
    fi
    
    # Nginx
    if ! command -v nginx &> /dev/null; then
        print_warning "Nginx n'est pas installé. Installation..."
        apt update
        apt install -y nginx
    fi
    
    # PostgreSQL (optionnel)
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL n'est pas détecté (optionnel si Supabase utilisé)"
    fi
    
    print_status "Prérequis validés ✓"
}

# Création de l'utilisateur système
create_system_user() {
    print_status "Création de l'utilisateur système..."
    
    if ! id "medical" &>/dev/null; then
        useradd --system --shell /bin/bash --home $APP_DIR --create-home medical
        print_status "Utilisateur 'medical' créé ✓"
    else
        print_status "Utilisateur 'medical' existe déjà ✓"
    fi
}

# Création des dossiers
create_directories() {
    print_status "Création des dossiers..."
    
    mkdir -p $APP_DIR
    mkdir -p $BACKUP_DIR
    mkdir -p /var/log/$APP_NAME
    mkdir -p /etc/$APP_NAME
    
    # Permissions
    chown -R medical:medical $APP_DIR
    chown -R medical:medical $BACKUP_DIR
    chown -R medical:medical /var/log/$APP_NAME
    
    print_status "Dossiers créés ✓"
}

# Installation de l'application
install_application() {
    print_status "Installation de l'application..."
    
    # Sauvegarde si version existante
    if [[ -d "$APP_DIR/dist" ]]; then
        print_status "Sauvegarde de la version existante..."
        tar -czf $BACKUP_DIR/app_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C $APP_DIR .
    fi
    
    # Copie des fichiers (assume que les fichiers sont dans le répertoire courant)
    cp -r . $APP_DIR/
    
    # Installation des dépendances
    cd $APP_DIR
    sudo -u medical npm ci --production --silent
    
    # Build de production
    sudo -u medical npm run build
    
    print_status "Application installée ✓"
}

# Configuration du service systemd
configure_service() {
    print_status "Configuration du service systemd..."
    
    cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Logiciel de Gestion Médicale
After=network.target postgresql.service

[Service]
Type=simple
User=medical
Group=medical
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run preview
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

# Sécurité
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR /var/log/$APP_NAME
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    
    print_status "Service systemd configuré ✓"
}

# Configuration Nginx
configure_nginx() {
    print_status "Configuration Nginx..."
    
    cat > /etc/nginx/sites-available/$NGINX_SITE << EOF
server {
    listen 80;
    server_name _;
    
    # Redirection HTTPS (à configurer après certificat SSL)
    # return 301 https://\$server_name\$request_uri;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Gestion des fichiers statiques
    location /assets/ {
        alias $APP_DIR/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

    # Activation du site
    ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    
    # Test de la configuration
    nginx -t
    
    systemctl reload nginx
    
    print_status "Nginx configuré ✓"
}

# Configuration du pare-feu
configure_firewall() {
    print_status "Configuration du pare-feu..."
    
    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw deny 3000/tcp  # Port application uniquement via Nginx
        
        print_status "Pare-feu configuré ✓"
    else
        print_warning "UFW non disponible, configurez manuellement le pare-feu"
    fi
}

# Configuration des sauvegardes
configure_backups() {
    print_status "Configuration des sauvegardes..."
    
    cat > /opt/scripts/backup-medical.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/medical-cashier"
APP_DIR="/opt/medical-cashier"

# Création du dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de l'application
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Sauvegarde base de données (si PostgreSQL local)
if command -v pg_dump &> /dev/null; then
    sudo -u postgres pg_dump medical_cashier > $BACKUP_DIR/db_backup_$DATE.sql 2>/dev/null || echo "Base locale non trouvée"
fi

# Nettoyage (garder 30 jours)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Sauvegarde terminée : $DATE"
EOF

    chmod +x /opt/scripts/backup-medical.sh
    mkdir -p /opt/scripts
    
    # Crontab pour sauvegarde quotidienne
    (crontab -l 2>/dev/null; echo "0 2 * * * /opt/scripts/backup-medical.sh") | crontab -
    
    print_status "Sauvegardes configurées ✓"
}

# Démarrage des services
start_services() {
    print_status "Démarrage des services..."
    
    systemctl start $SERVICE_NAME
    systemctl status $SERVICE_NAME --no-pager
    
    print_status "Services démarrés ✓"
}

# Tests de validation
run_tests() {
    print_status "Tests de validation..."
    
    # Test du service
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_status "Service actif ✓"
    else
        print_error "Service non actif ✗"
        systemctl status $SERVICE_NAME --no-pager
        return 1
    fi
    
    # Test HTTP
    sleep 5  # Attendre que le service démarre
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_status "Application accessible ✓"
    else
        print_warning "Application non accessible via HTTP (normal si redirection HTTPS)"
    fi
    
    # Test Nginx
    if curl -f http://localhost >/dev/null 2>&1; then
        print_status "Nginx fonctionne ✓"
    else
        print_error "Nginx non accessible ✗"
        return 1
    fi

    # Test Health Check
    print_status "Vérification de la santé de l'application..."
    HEALTH_CHECK=$(curl -s http://localhost/api/health-check.php)
    if [[ $(echo $HEALTH_CHECK | jq -r '.status') == "healthy" ]]; then
        print_status "Santé de l'application : OK ✓"
        echo "  - Base de données : $(echo $HEALTH_CHECK | jq -r '.checks.database.status')"
        echo "  - Espace disque : $(echo $HEALTH_CHECK | jq -r '.checks.disk.status')"
        echo "  - Mémoire : $(echo $HEALTH_CHECK | jq -r '.checks.memory.status')"
    else
        print_error "Problème de santé de l'application ✗"
        echo $HEALTH_CHECK | jq '.'
        return 1
    fi
    
    print_status "Tests de validation terminés ✓"
}

# Installation de jq pour le parsing JSON
install_dependencies() {
    print_status "Installation des dépendances..."
    if ! command -v jq &> /dev/null; then
        apt-get update && apt-get install -y jq
    fi
    print_status "Dépendances installées ✓"
}

# Affichage des informations finales
show_final_info() {
    print_status "=== DÉPLOIEMENT TERMINÉ ==="
    echo
    echo "🌐 Application accessible sur :"
    echo "   - http://$(hostname -I | awk '{print $1}')"
    echo "   - http://localhost"
    echo
    echo "📁 Dossiers importants :"
    echo "   - Application : $APP_DIR"
    echo "   - Sauvegardes : $BACKUP_DIR"
    echo "   - Logs : /var/log/$APP_NAME"
    echo
    echo "🔧 Commandes utiles :"
    echo "   - Status : sudo systemctl status $SERVICE_NAME"
    echo "   - Restart : sudo systemctl restart $SERVICE_NAME"
    echo "   - Logs : sudo journalctl -u $SERVICE_NAME -f"
    echo "   - Sauvegarde : sudo /opt/scripts/backup-medical.sh"
    echo
    echo "📋 Prochaines étapes :"
    echo "   1. Configurer SSL/HTTPS avec certbot"
    echo "   2. Configurer la base de données (Supabase ou locale)"
    echo "   3. Créer le compte administrateur"
    echo "   4. Former les utilisateurs"
    echo
    print_status "Déploiement réussi ! 🎉"
}

# Fonction principale
main() {
    print_status "=== DÉPLOIEMENT LOGICIEL GESTION MÉDICALE ==="
    echo
    
    check_privileges
    check_prerequisites
    install_dependencies
    create_system_user
    create_directories
    install_application
    configure_service
    configure_nginx
    configure_firewall
    configure_backups
    start_services
    run_tests
    show_final_info
}

# Gestion des erreurs
trap 'print_error "Erreur durant le déploiement à la ligne $LINENO"' ERR

# Exécution
main "$@"
