
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
}

interface MedicationsListProps {
  medications: Medication[];
  onAddToCart: (medication: Medication) => void;
}

const MedicationsList = ({ medications, onAddToCart }: MedicationsListProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Produits Pharmaceutiques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div key={med.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{med.name}</h3>
                <span className="text-lg font-bold text-green-600">{med.unit_price} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{med.category}</p>
                  <p className="text-sm text-gray-600">Stock: {med.stock_quantity}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onAddToCart(med)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={med.stock_quantity === 0}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsList;
