
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, DollarSign, Activity, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CashierManagement = () => {
  const [cashiers, setCashiers] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      username: "marie.d",
      status: "En ligne",
      todaySales: 125000,
      transactions: 15,
      startTime: "08:00",
      role: "Caissier Principal"
    },
    {
      id: 2,
      name: "Jean Ngarta",
      username: "jean.n",
      status: "En ligne",
      todaySales: 98000,
      transactions: 12,
      startTime: "08:30",
      role: "Caissier"
    },
    {
      id: 3,
      name: "Fatima Hassan",
      username: "fatima.h",
      status: "Pause",
      todaySales: 67000,
      transactions: 8,
      startTime: "09:00",
      role: "Caissier"
    }
  ]);

  const [newCashier, setNewCashier] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Caissier'
  });

  const addCashier = () => {
    if (newCashier.name && newCashier.username && newCashier.password) {
      const cashier = {
        id: Date.now(),
        ...newCashier,
        status: "Hors ligne",
        todaySales: 0,
        transactions: 0,
        startTime: "--:--"
      };
      setCashiers([...cashiers, cashier]);
      setNewCashier({ name: '', username: '', password: '', role: 'Caissier' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En ligne": return "bg-green-100 text-green-800";
      case "Pause": return "bg-yellow-100 text-yellow-800";
      case "Hors ligne": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalSales = cashiers.reduce((sum, cashier) => sum + cashier.todaySales, 0);
  const totalTransactions = cashiers.reduce((sum, cashier) => sum + cashier.transactions, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Caissiers</h1>
          <p className="text-gray-600">Suivi des performances et gestion des accès</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter Caissier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau Caissier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom Complet</Label>
                <Input
                  id="name"
                  value={newCashier.name}
                  onChange={(e) => setNewCashier({...newCashier, name: e.target.value})}
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={newCashier.username}
                  onChange={(e) => setNewCashier({...newCashier, username: e.target.value})}
                  placeholder="nom.utilisateur"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={newCashier.password}
                  onChange={(e) => setNewCashier({...newCashier, password: e.target.value})}
                  placeholder="Mot de passe sécurisé"
                />
              </div>
              <Button onClick={addCashier} className="w-full">
                Créer le Compte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caissiers Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{cashiers.filter(c => c.status === "En ligne").length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales.toLocaleString()} FCFA</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cashiers List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Liste des Caissiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cashiers.map((cashier) => (
              <div key={cashier.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {cashier.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cashier.name}</h3>
                      <p className="text-sm text-gray-600">@{cashier.username}</p>
                      <Badge className={getStatusColor(cashier.status)}>{cashier.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Ventes du jour</p>
                      <p className="font-semibold text-green-600">{cashier.todaySales.toLocaleString()} FCFA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="font-semibold text-blue-600">{cashier.transactions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Début</p>
                      <p className="font-semibold text-gray-900">{cashier.startTime}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Performance par Caissier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Graphique de performance</p>
              <p className="text-sm text-gray-400">À implémenter avec recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierManagement;
