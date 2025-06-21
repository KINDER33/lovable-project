
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DatabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Vérification de la connexion...');

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      // Test simple avec fetch direct
      const response = await fetch('http://localhost:8080/api/medications.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('connected');
        setMessage('Connecté à MySQL WAMP sur port 8080');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setStatus('error');
      setMessage('Impossible de se connecter à MySQL WAMP. Vérifiez que WAMP est démarré sur le port 8080.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Statut Base de Données</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{message}</span>
          </div>
          <Badge className={getStatusColor()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>API: http://localhost:8080/api/</p>
          <p>Assurez-vous que WAMP est démarré et que les fichiers PHP sont dans htdocs/api/</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;
