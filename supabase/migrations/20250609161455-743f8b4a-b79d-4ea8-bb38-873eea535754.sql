
-- Migration SQL pour l'authentification et les dépenses

-- 1. Créer un type enum pour les rôles
CREATE TYPE user_role AS ENUM ('admin', 'caissier');

-- 2. Mettre à jour la table users avec les nouveaux rôles
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role_type user_role DEFAULT 'caissier';

-- 3. Mettre à jour les utilisateurs existants
UPDATE users SET role_type = 'admin' WHERE role = 'admin';
UPDATE users SET role_type = 'caissier' WHERE role IN ('caissier', 'cashier', 'gestionnaire', 'manager');

-- 4. Créer un utilisateur admin par défaut
INSERT INTO users (id, username, email, password_hash, full_name, role, role_type, is_active)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@centre-sante.td',
  encode(digest('admin123', 'sha256'), 'base64'),
  'Administrateur Principal',
  'admin',
  'admin',
  true
) ON CONFLICT (username) DO NOTHING;

-- 5. Créer un utilisateur caissier par défaut
INSERT INTO users (id, username, email, password_hash, full_name, role, role_type, is_active)
VALUES (
  gen_random_uuid(),
  'caissier',
  'caissier@centre-sante.td',
  encode(digest('caissier123', 'sha256'), 'base64'),
  'Caissier Principal',
  'caissier',
  'caissier',
  true
) ON CONFLICT (username) DO NOTHING;

-- 6. Ajouter des contraintes pour les permissions selon les rôles
-- Les caissiers ne peuvent que faire des ventes et examens
-- Les admins ont accès à tout

-- 7. Ajouter des index pour optimiser les requêtes d'authentification
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role_type ON users(role_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- 8. Ajouter des index pour optimiser les requêtes de dépenses
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(expense_category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_cancelled ON expenses(is_cancelled);

-- 9. Ajouter des index pour optimiser les requêtes de ventes
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_cancelled ON sales(is_cancelled);
CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id);

-- 10. Créer une vue pour les statistiques rapides
CREATE OR REPLACE VIEW daily_statistics AS
SELECT 
  CURRENT_DATE as stat_date,
  COUNT(CASE WHEN DATE(sale_date) = CURRENT_DATE AND NOT is_cancelled THEN 1 END) as sales_today,
  COALESCE(SUM(CASE WHEN DATE(sale_date) = CURRENT_DATE AND NOT is_cancelled THEN total_amount ELSE 0 END), 0) as revenue_today,
  (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE DATE(expense_date) = CURRENT_DATE AND NOT is_cancelled) as expenses_today,
  (SELECT COUNT(*) FROM medications WHERE stock_quantity <= min_stock_level AND is_active) as low_stock_count
FROM sales;

-- 11. Fonction pour logger les actions des utilisateurs
CREATE OR REPLACE FUNCTION log_user_action(
  p_user_id UUID,
  p_action_type VARCHAR,
  p_description TEXT,
  p_table_name VARCHAR DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_amount NUMERIC DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_actions (user_id, action_type, description, table_name, record_id, amount)
  VALUES (p_user_id, p_action_type, p_description, p_table_name, p_record_id, p_amount);
END;
$$ LANGUAGE plpgsql;

-- 12. Trigger pour logger automatiquement les ventes
CREATE OR REPLACE FUNCTION trigger_log_sale() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_user_action(
      NEW.user_id,
      'SALE_CREATE',
      'Vente créée: ' || NEW.invoice_number,
      'sales',
      NEW.id,
      NEW.total_amount
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.is_cancelled = false AND NEW.is_cancelled = true THEN
    PERFORM log_user_action(
      NEW.user_id,
      'SALE_CANCEL',
      'Vente annulée: ' || NEW.invoice_number,
      'sales',
      NEW.id,
      NEW.total_amount
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sales_log_trigger ON sales;
CREATE TRIGGER sales_log_trigger
  AFTER INSERT OR UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION trigger_log_sale();

-- 13. Trigger pour logger automatiquement les dépenses
CREATE OR REPLACE FUNCTION trigger_log_expense() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_user_action(
      NEW.user_id,
      'EXPENSE_CREATE',
      'Dépense créée: ' || NEW.category_name,
      'expenses',
      NEW.id,
      NEW.amount
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.is_cancelled = false AND NEW.is_cancelled = true THEN
    PERFORM log_user_action(
      NEW.user_id,
      'EXPENSE_CANCEL',
      'Dépense annulée: ' || NEW.category_name,
      'expenses',
      NEW.id,
      NEW.amount
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS expenses_log_trigger ON expenses;
CREATE TRIGGER expenses_log_trigger
  AFTER INSERT OR UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION trigger_log_expense();
