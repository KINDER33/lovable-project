
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Medication, ExamType } from '@/services/database/DatabaseAdapter';

export const useProductData = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const { toast } = useToast();
  const { adapter, isInitialized } = useDatabase();

  useEffect(() => {
    if (isInitialized) {
      fetchMedications();
      fetchExamTypes();
    }
  }, [adapter, isInitialized]);

  const fetchMedications = async () => {
    try {
      if (!adapter) {
        console.log('Mode local - chargement des médicaments de démonstration');
        const demoMedications: Medication[] = [
          { id: '1', name: 'Paracétamol 500mg', category: 'Antalgique', unit_price: 500, stock_quantity: 50, is_active: true },
          { id: '2', name: 'Amoxicilline 250mg', category: 'Antibiotique', unit_price: 1200, stock_quantity: 30, is_active: true },
          { id: '3', name: 'Aspirine 100mg', category: 'Antalgique', unit_price: 300, stock_quantity: 25, is_active: true },
          { id: '4', name: 'Doliprane 1000mg', category: 'Antalgique', unit_price: 800, stock_quantity: 40, is_active: true },
          { id: '5', name: 'Ibuprofène 400mg', category: 'Anti-inflammatoire', unit_price: 600, stock_quantity: 35, is_active: true },
          { id: '6', name: 'Cétrizine 10mg', category: 'Antihistaminique', unit_price: 350, stock_quantity: 20, is_active: true }
        ];
        setMedications(demoMedications);
        console.log('Médicaments de démonstration chargés:', demoMedications.length);
        return;
      }
      
      console.log('Chargement des médicaments depuis la base de données...');
      const result = await adapter.getMedications();
      if (result.data) {
        const activeMedications = result.data.filter(med => 
          med.is_active && med.stock_quantity > 0
        );
        setMedications(activeMedications);
        console.log('Médicaments chargés depuis la DB:', activeMedications.length);
      }
    } catch (error) {
      console.error('Erreur chargement médicaments:', error);
      // En cas d'erreur, charger les données de démonstration
      const demoMedications: Medication[] = [
        { id: '1', name: 'Paracétamol 500mg', category: 'Antalgique', unit_price: 500, stock_quantity: 50, is_active: true },
        { id: '2', name: 'Amoxicilline 250mg', category: 'Antibiotique', unit_price: 1200, stock_quantity: 30, is_active: true },
        { id: '3', name: 'Aspirine 100mg', category: 'Antalgique', unit_price: 300, stock_quantity: 25, is_active: true },
        { id: '4', name: 'Doliprane 1000mg', category: 'Antalgique', unit_price: 800, stock_quantity: 40, is_active: true }
      ];
      setMedications(demoMedications);
      console.log('Basculement vers les médicaments de démonstration après erreur');
      
      toast({
        title: "Mode hors ligne",
        description: "Utilisation des données de démonstration"
      });
    }
  };

  const fetchExamTypes = async () => {
    try {
      if (!adapter) {
        console.log('Mode local - chargement des types d\'examens de démonstration');
        const demoExamTypes: ExamType[] = [
          { id: '1', name: 'Consultation Générale', base_price: 5000, department: 'Médecine Générale', is_active: true },
          { id: '2', name: 'Échographie', base_price: 15000, department: 'Radiologie', is_active: true },
          { id: '3', name: 'Analyse de Sang', base_price: 8000, department: 'Laboratoire', is_active: true },
          { id: '4', name: 'Radiographie', base_price: 12000, department: 'Radiologie', is_active: true },
          { id: '5', name: 'ECG', base_price: 6000, department: 'Cardiologie', is_active: true },
          { id: '6', name: 'Test Urinaire', base_price: 3000, department: 'Laboratoire', is_active: true }
        ];
        setExamTypes(demoExamTypes);
        console.log('Types d\'examens de démonstration chargés:', demoExamTypes.length);
        return;
      }
      
      console.log('Chargement des types d\'examens depuis la base de données...');
      const result = await adapter.getExamTypes();
      if (result.data) {
        const activeExamTypes = result.data.filter(exam => exam.is_active);
        setExamTypes(activeExamTypes);
        console.log('Types examens chargés depuis la DB:', activeExamTypes.length);
      }
    } catch (error) {
      console.error('Erreur chargement types examens:', error);
      // En cas d'erreur, charger les données de démonstration
      const demoExamTypes: ExamType[] = [
        { id: '1', name: 'Consultation Générale', base_price: 5000, department: 'Médecine Générale', is_active: true },
        { id: '2', name: 'Échographie', base_price: 15000, department: 'Radiologie', is_active: true },
        { id: '3', name: 'Analyse de Sang', base_price: 8000, department: 'Laboratoire', is_active: true },
        { id: '4', name: 'Radiographie', base_price: 12000, department: 'Radiologie', is_active: true }
      ];
      setExamTypes(demoExamTypes);
      console.log('Basculement vers les types d\'examens de démonstration après erreur');
      
      toast({
        title: "Mode hors ligne",
        description: "Utilisation des données de démonstration"
      });
    }
  };

  return {
    medications,
    examTypes,
    fetchMedications
  };
};
