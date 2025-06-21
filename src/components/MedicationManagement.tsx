
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Medication {
  id: string;
  name: string;
  description: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
  min_stock_level: number;
  supplier: string;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

const MedicationManagement = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit_price: 0,
    stock_quantity: 0,
    min_stock_level: 10,
    supplier: '',
    expiry_date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des médicaments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médicaments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMedication) {
        const { error } = await supabase
          .from('medications')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMedication.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Médicament mis à jour avec succès"
        });
      } else {
        const { error } = await supabase
          .from('medications')
          .insert([{
            ...formData,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Médicament créé avec succès"
        });
      }

      resetForm();
      fetchMedications();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le médicament",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      description: medication.description || '',
      category: medication.category || '',
      unit_price: medication.unit_price,
      stock_quantity: medication.stock_quantity,
      min_stock_level: medication.min_stock_level || 10,
      supplier: medication.supplier || '',
      expiry_date: medication.expiry_date || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (medicationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .update({ is_active: false })
        .eq('id', medicationId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Médicament désactivé avec succès"
      });

      fetchMedications();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le médicament",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit_price: 0,
      stock_quantity: 0,
      min_stock_level: 10,
      supplier: '',
      expiry_date: ''
    });
    setShowAddForm(false);
    setEditingMedication(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des médicaments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Gestion des Médicaments
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Médicament
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">
                {editingMedication ? 'Modifier le médicament' : 'Nouveau médicament'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du médicament</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unit_price">Prix unitaire (FCFA)</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Quantité en stock</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_stock_level">Seuil d'alerte</Label>
                  <Input
                    id="min_stock_level"
                    type="number"
                    min="0"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value) || 10})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Fournisseur</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Date d'expiration</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingMedication ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {medications.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Aucun médicament trouvé. Créez le premier médicament.
              </div>
            ) : (
              medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.category} • {medication.unit_price} FCFA • Stock: {medication.stock_quantity}
                      </div>
                      {medication.supplier && (
                        <div className="text-xs text-gray-500">
                          Fournisseur: {medication.supplier}
                        </div>
                      )}
                      {medication.stock_quantity <= (medication.min_stock_level || 10) && (
                        <div className="flex items-center text-xs text-orange-600 mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Stock faible
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      medication.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medication.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(medication)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(medication.id)}
                      disabled={!medication.is_active}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationManagement;
