<?php
// Configuration de la surveillance système
return [
    // Seuils d'alerte
    'thresholds' => [
        'disk' => [
            'warning' => 80,  // Pourcentage d'utilisation du disque pour déclencher un avertissement
            'critical' => 90  // Pourcentage d'utilisation du disque pour déclencher une alerte critique
        ],
        'memory' => [
            'warning' => 80,  // Pourcentage d'utilisation de la mémoire pour avertissement
            'critical' => 90  // Pourcentage d'utilisation de la mémoire pour alerte critique
        ],
        'cpu' => [
            'warning' => 70,  // Pourcentage d'utilisation CPU pour avertissement
            'critical' => 85  // Pourcentage d'utilisation CPU pour alerte critique
        ],
        'response_time' => [
            'warning' => 2000,  // Temps de réponse en ms pour avertissement
            'critical' => 5000  // Temps de réponse en ms pour alerte critique
        ]
    ],

    // Configuration des logs
    'logs' => [
        'path' => '/var/log/medical-app',
        'max_size' => 10 * 1024 * 1024,  // 10 MB
        'rotation' => [
            'enabled' => true,
            'max_files' => 30,  // Nombre de fichiers de logs à conserver
            'frequency' => 'daily'  // Fréquence de rotation (daily, weekly, monthly)
        ]
    ],

    // Points de surveillance
    'monitoring_points' => [
        // API Endpoints critiques
        'endpoints' => [
            '/api/health-check.php',
            '/api/config-production.php',
            '/api/sales.php',
            '/api/medications.php'
        ],

        // Services système critiques
        'services' => [
            'nginx',
            'php-fpm',
            'mysql'
        ],

        // Fichiers à surveiller
        'files' => [
            '/var/log/medical-app/errors.log',
            '/var/log/medical-app/access.log',
            '/var/log/nginx/error.log'
        ]
    ],

    // Configuration des notifications
    'notifications' => [
        'email' => [
            'enabled' => true,
            'recipients' => [
                'admin@centre-medical.local',
                'support-technique@centre-medical.local'
            ],
            'from' => 'monitoring@centre-medical.local',
            'subject_prefix' => '[MEDICAL-APP] '
        ],
        'sms' => [
            'enabled' => false,
            'provider' => 'twilio',  // ou autre provider SMS
            'recipients' => [
                '+123456789'  // Numéro d'urgence
            ]
        ],
        'slack' => [
            'enabled' => false,
            'webhook_url' => '',
            'channel' => '#monitoring'
        ]
    ],

    // Intervalles de vérification (en secondes)
    'check_intervals' => [
        'health' => 60,          // Vérification de santé générale
        'performance' => 300,     // Vérification des performances
        'security' => 3600,       // Vérification de sécurité
        'backup' => 86400        // Vérification des sauvegardes
    ],

    // Configuration de la base de données
    'database' => [
        'monitoring_table' => 'system_monitoring',
        'max_connections' => 100,
        'slow_query_threshold' => 2.0,  // secondes
        'backup' => [
            'enabled' => true,
            'frequency' => 'daily',
            'retention_days' => 30
        ]
    ],

    // Sécurité
    'security' => [
        'failed_login_threshold' => 5,  // Nombre de tentatives avant blocage
        'block_duration' => 1800,       // Durée du blocage en secondes (30 minutes)
        'ip_whitelist' => [
            '127.0.0.1',
            // Ajouter les IPs autorisées
        ],
        'scan_frequency' => 'daily'     // Fréquence des scans de sécurité
    ],

    // Performance
    'performance' => [
        'cache' => [
            'enabled' => true,
            'driver' => 'redis',
            'ttl' => 3600  // Durée de vie du cache en secondes
        ],
        'optimization' => [
            'auto_vacuum' => true,       // Nettoyage automatique de la base
            'compress_output' => true,   // Compression des réponses
            'minify_html' => true       // Minification du HTML
        ]
    ],

    // Maintenance
    'maintenance' => [
        'window' => [
            'start' => '01:00',  // Heure de début (format 24h)
            'duration' => 60      // Durée en minutes
        ],
        'auto_update' => [
            'enabled' => false,
            'packages' => ['security']  // Types de mises à jour automatiques
        ]
    ]
];
