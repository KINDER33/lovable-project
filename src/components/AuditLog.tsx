
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Download, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AuditEntry {
  timestamp: string;
  action: string;
  details?: string;
  user: string;
  ip?: string;
  success?: boolean;
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const { toast } = useToast();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedAction]);

  const loadAuditLogs = () => {
    try {
      const auditData = localStorage.getItem('audit_log');
      if (auditData) {
        const parsedLogs = JSON.parse(auditData);
        setLogs(parsedLogs.reverse()); // Plus récents en premier
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les logs d'audit",
        variant: "destructive"
      });
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedAction !== 'ALL') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Logs d'audit exportés avec succès",
      });
      
      // Journaliser l'export
      addAuditEntry('LOGS_EXPORTED', 'Export des logs d\'audit', 'admin');
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les logs",
        variant: "destructive"
      });
    }
  };

  const addAuditEntry = (action: string, details: string, user: string, success = true) => {
    const newEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      user,
      success,
      ip: '127.0.0.1' // Simulé, récupérer vraie IP en production
    };

    const existingLogs = JSON.parse(localStorage.getItem('audit_log') || '[]');
    existingLogs.push(newEntry);
    localStorage.setItem('audit_log', JSON.stringify(existingLogs));
    
    setLogs([newEntry, ...logs]);
  };

  const clearLogs = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tous les logs ? Cette action est irréversible.')) {
      localStorage.removeItem('audit_log');
      setLogs([]);
      setFilteredLogs([]);
      
      toast({
        title: "Logs effacés",
        description: "Tous les logs d'audit ont été supprimés",
      });
      
      // Créer un nouveau log pour l'effacement
      addAuditEntry('LOGS_CLEARED', 'Effacement complet des logs d\'audit', 'admin');
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('ERROR') || action.includes('FAILED')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (action.includes('SUCCESS') || action.includes('CREATED')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('ERROR') || action.includes('FAILED')) return 'bg-red-100 text-red-800';
    if (action.includes('SUCCESS') || action.includes('CREATED')) return 'bg-green-100 text-green-800';
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'bg-blue-100 text-blue-800';
    if (action.includes('DB') || action.includes('CONFIG')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const uniqueActions = ['ALL', ...Array.from(new Set(logs.map(log => log.action)))];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Journal d'Audit & Sécurité
        </CardTitle>
        <p className="text-sm text-gray-600">
          Historique complet des actions système et accès base de données
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contrôles de filtrage */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select 
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm" className="text-red-600">
            Effacer Tout
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Total</div>
            <div className="text-xl font-bold text-blue-900">{logs.length}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Succès</div>
            <div className="text-xl font-bold text-green-900">
              {logs.filter(log => log.success !== false).length}
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600">Échecs</div>
            <div className="text-xl font-bold text-red-900">
              {logs.filter(log => log.success === false).length}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="text-sm text-amber-600">Aujourd'hui</div>
            <div className="text-xl font-bold text-amber-900">
              {logs.filter(log => 
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </div>
        </div>

        {/* Liste des logs */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun log trouvé pour les critères sélectionnés
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="text-sm text-gray-600">par {log.user}</span>
                    {log.ip && (
                      <span className="text-xs text-gray-500">({log.ip})</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                {log.details && (
                  <div className="mt-2 text-sm text-gray-700">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Actions rapides pour test */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Actions de Test :</h4>
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addAuditEntry('TEST_SUCCESS', 'Test d\'action réussie', 'admin', true)}
            >
              Test Succès
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addAuditEntry('TEST_ERROR', 'Test d\'erreur simulée', 'admin', false)}
            >
              Test Erreur
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addAuditEntry('DB_CONNECTION_FAILED', 'Échec de connexion base de données', 'system', false)}
            >
              Échec DB
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
