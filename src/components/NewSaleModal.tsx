
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSaleModal = ({ isOpen, onClose }: NewSaleModalProps) => {
  const [saleType, setSaleType] = useState('medicament');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [clientName, setClientName] = useState('');

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmit = () => {
    console.log('Nouvelle vente:', { saleType, items, clientName, total: calculateTotal() });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Nouvelle Vente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="saleType">Type de vente</Label>
              <Select value={saleType} onValueChange={setSaleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicament">Médicament</SelectItem>
                  <SelectItem value="materiel">Matériel médical</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nom du patient/client"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Articles</h3>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label>Article</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Nom de l'article"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="col-span-3">
                  <Label>Prix unitaire</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="col-span-1">
                  <Label>Total</Label>
                  <div className="text-sm font-semibold p-2 bg-gray-100 rounded">
                    {(item.quantity * item.price).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                Total: {calculateTotal().toLocaleString()} FCFA
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Enregistrer la vente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSaleModal;
