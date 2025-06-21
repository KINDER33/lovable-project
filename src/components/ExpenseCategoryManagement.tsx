
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Folder, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const ExpenseCategoryManagement = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories de dépenses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('expense_categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès"
        });
      } else {
        const { error } = await supabase
          .from('expense_categories')
          .insert([{
            ...formData,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Catégorie créée avec succès"
        });
      }

      resetForm();
      fetchCategories();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('expense_categories')
        .update({ is_active: false })
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie désactivée avec succès"
      });

      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des catégories...</div>
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
              <Folder className="w-5 h-5" />
              Gestion des Catégories de Dépenses
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              
              <div>
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description optionnelle de la catégorie"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingCategory ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Aucune catégorie trouvée. Créez la première catégorie.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Folder className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-600">
                          {category.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Créée le {new Date(category.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={!category.is_active}
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

export default ExpenseCategoryManagement;
