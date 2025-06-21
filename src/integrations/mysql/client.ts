
// Client MySQL pour remplacer Supabase
import { mockSupabase } from '../../services/api';

// Export du client mock pour remplacement transparent
export const supabase = mockSupabase;

// Types pour compatibilité
export interface Database {
  medications: any;
  sales: any;
  sale_items: any;
  exams: any;
  exam_types: any;
  expenses: any;
  expense_categories: any;
}
