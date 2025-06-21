
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamType {
  id: string;
  name: string;
  base_price: number;
  duration_minutes: number;
  department: string;
}

const ExamModal = ({ isOpen, onClose }: ExamModalProps) => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [examTypeId, setExamTypeId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [examPrice, setExamPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchExamTypes();
    }
  }, [isOpen]);

  const fetchExamTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setExamTypes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'examens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types d'examens",
        variant: "destructive"
      });
    }
  };

  const handleExamTypeChange = (value: string) => {
    setExamTypeId(value);
    const selectedExam = examTypes.find(exam => exam.id === value);
    if (selectedExam) {
      setExamPrice(selectedExam.base_price);
    }
  };

  const handleSubmit = async () => {
    if (!examTypeId || !patientName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedExamType = examTypes.find(exam => exam.id === examTypeId);
      
      const { error } = await supabase
        .from('exams')
        .insert([{
          exam_type_id: examTypeId,
          patient_name: patientName,
          patient_age: patientAge,
          price: examPrice,
          notes
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Examen enregistré avec succès"
      });

      // Réinitialiser le formulaire
      setExamTypeId('');
      setPatientName('');
      setPatientAge('');
      setExamPrice(0);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'examen",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Enregistrer un Examen
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Nom du patient *</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Nom complet"
              />
            </div>
            
            <div>
              <Label htmlFor="patientAge">Âge</Label>
              <Input
                id="patientAge"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Âge du patient"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="examType">Type d'examen *</Label>
            <Select value={examTypeId} onValueChange={handleExamTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type d'examen" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name} - {exam.base_price.toLocaleString()} FCFA ({exam.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="examPrice">Tarif (FCFA)</Label>
            <Input
              id="examPrice"
              type="number"
              value={examPrice}
              onChange={(e) => setExamPrice(parseFloat(e.target.value) || 0)}
              placeholder="Prix de l'examen"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes additionnelles</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, instructions, etc."
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">
                Total: {examPrice.toLocaleString()} FCFA
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Enregistrer l'examen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamModal;
