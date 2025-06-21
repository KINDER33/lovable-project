
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExamType {
  id: string;
  name: string;
  description: string;
  department: string;
  base_price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

const ExamTypeManagement = () => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExamType, setEditingExamType] = useState<ExamType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    base_price: 0,
    duration_minutes: 30
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const fetchExamTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExamTypes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'examens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types d'examens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingExamType) {
        const { error } = await supabase
          .from('exam_types')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingExamType.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Type d'examen mis à jour avec succès"
        });
      } else {
        const { error } = await supabase
          .from('exam_types')
          .insert([{
            ...formData,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Type d'examen créé avec succès"
        });
      }

      resetForm();
      fetchExamTypes();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le type d'examen",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (examType: ExamType) => {
    setEditingExamType(examType);
    setFormData({
      name: examType.name,
      description: examType.description || '',
      department: examType.department || '',
      base_price: examType.base_price,
      duration_minutes: examType.duration_minutes || 30
    });
    setShowAddForm(true);
  };

  const handleDelete = async (examTypeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce type d\'examen ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('exam_types')
        .update({ is_active: false })
        .eq('id', examTypeId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type d'examen désactivé avec succès"
      });

      fetchExamTypes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type d'examen",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      department: '',
      base_price: 0,
      duration_minutes: 30
    });
    setShowAddForm(false);
    setEditingExamType(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des types d'examens...</div>
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
              <Stethoscope className="w-5 h-5" />
              Gestion des Types d'Examens
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Type d'Examen
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">
                {editingExamType ? 'Modifier le type d\'examen' : 'Nouveau type d\'examen'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'examen</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base_price">Prix de base (FCFA)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration_minutes">Durée (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 30})}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingExamType ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {examTypes.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Aucun type d'examen trouvé. Créez le premier type d'examen.
              </div>
            ) : (
              examTypes.map((examType) => (
                <div key={examType.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Stethoscope className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{examType.name}</div>
                      <div className="text-sm text-gray-600">
                        {examType.department} • {examType.base_price} FCFA • {examType.duration_minutes} min
                      </div>
                      {examType.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {examType.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      examType.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {examType.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(examType)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(examType.id)}
                      disabled={!examType.is_active}
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

export default ExamTypeManagement;
