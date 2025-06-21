#!/bin/bash
set -e

# Configuration
LOG_DIR="/var/log/medical-app"
BACKUP_DIR="$LOG_DIR/archives"
MAX_AGE_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ATTENTION:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERREUR:${NC} $1"
}

# Création des répertoires nécessaires
mkdir -p "$BACKUP_DIR"

# Rotation des logs PHP
if [ -f "$LOG_DIR/errors.log" ]; then
    log "Rotation du fichier de log PHP..."
    if [ -s "$LOG_DIR/errors.log" ]; then  # Vérifie si le fichier n'est pas vide
        gzip -c "$LOG_DIR/errors.log" > "$BACKUP_DIR/errors_$DATE.log.gz"
        cat /dev/null > "$LOG_DIR/errors.log"
        log "Log PHP archivé: errors_$DATE.log.gz"
    else
        warning "Le fichier de log PHP est vide, pas d'archivage nécessaire"
    fi
fi

# Rotation des logs d'accès Nginx
if [ -f "$LOG_DIR/access.log" ]; then
    log "Rotation du fichier de log d'accès Nginx..."
    if [ -s "$LOG_DIR/access.log" ]; then
        gzip -c "$LOG_DIR/access.log" > "$BACKUP_DIR/access_$DATE.log.gz"
        cat /dev/null > "$LOG_DIR/access.log"
        log "Log d'accès archivé: access_$DATE.log.gz"
    else
        warning "Le fichier de log d'accès est vide, pas d'archivage nécessaire"
    fi
fi

# Rotation des logs d'erreur Nginx
if [ -f "$LOG_DIR/error.log" ]; then
    log "Rotation du fichier de log d'erreur Nginx..."
    if [ -s "$LOG_DIR/error.log" ]; then
        gzip -c "$LOG_DIR/error.log" > "$BACKUP_DIR/error_$DATE.log.gz"
        cat /dev/null > "$LOG_DIR/error.log"
        log "Log d'erreur archivé: error_$DATE.log.gz"
    else
        warning "Le fichier de log d'erreur est vide, pas d'archivage nécessaire"
    fi
fi

# Nettoyage des anciens logs
log "Nettoyage des archives de plus de $MAX_AGE_DAYS jours..."
find "$BACKUP_DIR" -name "*.gz" -type f -mtime +$MAX_AGE_DAYS -delete

# Vérification de l'espace disque
DISK_USAGE=$(df -h "$LOG_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    warning "L'espace disque est critique ($DISK_USAGE%). Suppression des logs les plus anciens..."
    find "$BACKUP_DIR" -name "*.gz" -type f -printf '%T+ %p\n' | sort | head -n 10 | cut -d' ' -f2- | xargs rm -f
fi

# Redémarrage des services si nécessaire
if systemctl is-active --quiet nginx; then
    log "Rechargement de Nginx..."
    systemctl reload nginx
fi

# Vérification des permissions
log "Vérification des permissions..."
chown -R www-data:www-data "$LOG_DIR"
chmod -R 755 "$LOG_DIR"
chmod -R 644 "$LOG_DIR"/*.log

log "Rotation des logs terminée avec succès"

# Affichage du résumé
echo
echo "=== Résumé de la rotation des logs ==="
echo "Date: $(date)"
echo "Espace disque utilisé: $DISK_USAGE%"
echo "Fichiers archivés:"
ls -lh "$BACKUP_DIR" | grep "$DATE"
echo "=================================="
