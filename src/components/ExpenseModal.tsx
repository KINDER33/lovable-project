
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { ExpenseCategory } from '@/services/database/DatabaseAdapter';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpenseModal = ({ isOpen, onClose }: ExpenseModalProps) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { adapter } = useDatabase();
  const { user } = useHybridAuth();

  // Vérifier que seuls les admins peuvent accéder
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isOpen && adapter && isAdmin) {
      fetchCategories();
    }
  }, [isOpen, adapter, isAdmin]);

  const fetchCategories = async () => {
    if (!adapter) return;

    try {
      const result = await adapter.getExpenseCategories();
      if (result.error) {
        throw new Error(result.error);
      }
      setCategories(result.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories de dépenses",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent enregistrer des dépenses",
        variant: "destructive"
      });
      return;
    }

    if (!expenseCategoryId || !amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!adapter) {
      toast({
        title: "Erreur",
        description: "Base de données non disponible",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const selectedCategory = categories.find(cat => cat.id === expenseCategoryId);
      
      const expenseData = {
        expense_category_id: expenseCategoryId,
        category_name: selectedCategory?.name || '',
        amount,
        description,
        supplier,
        expense_date: new Date().toISOString(),
        is_cancelled: false,
        user_id: user?.id || ''
      };

      const result = await adapter.createExpense(expenseData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Succès",
        description: "Dépense enregistrée avec succès"
      });

      // Réinitialiser le formulaire
      setExpenseCategoryId('');
      setAmount(0);
      setDescription('');
      setSupplier('');
      setReceiptNumber('');
      
      // Fermer la modal
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la dépense",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Réinitialiser le formulaire lors de la fermeture
    setExpenseCategoryId('');
    setAmount(0);
    setDescription('');
    setSupplier('');
    setReceiptNumber('');
    onClose();
  };

  // Ne pas afficher la modal si l'utilisateur n'est pas admin
  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Enregistrer une Dépense
            <span className="text-sm font-normal text-gray-500">
              (Administrateur uniquement)
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expenseType">Type de dépense *</Label>
              <Select value={expenseCategoryId} onValueChange={setExpenseCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Montant en FCFA"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supplier">Fournisseur/Bénéficiaire</Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Nom du fournisseur ou bénéficiaire"
            />
          </div>

          <div>
            <Label htmlFor="receiptNumber">Numéro de reçu</Label>
            <Input
              id="receiptNumber"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Numéro de facture ou reçu"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de la dépense"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <div className="text-right">
              <div className="text-xl font-bold text-red-600">
                Montant: {amount.toLocaleString()} FCFA
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer la dépense'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
