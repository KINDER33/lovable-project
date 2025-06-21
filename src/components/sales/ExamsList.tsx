
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ExamType {
  id: string;
  name: string;
  base_price: number;
  department: string;
}

interface ExamsListProps {
  examTypes: ExamType[];
  onAddToCart: (exam: ExamType) => void;
}

const ExamsList = ({ examTypes, onAddToCart }: ExamsListProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Examens Médicaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examTypes.map((exam) => (
            <div key={exam.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600">{exam.department}</p>
                  <p className="text-lg font-bold text-green-600">{exam.base_price} FCFA</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onAddToCart(exam)}
                  className="bg-green-600 hover:bg-green-700"
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

export default ExamsList;
