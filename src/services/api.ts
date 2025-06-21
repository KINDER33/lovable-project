
// Service API pour remplacer Supabase avec configuration dynamique
interface DatabaseConfig {
  HOST: string;
  PORT: number;
  DATABASE: string;
  USER: string;
  PASSWORD: string;
  API_BASE_URL: string;
  TABLES: {
    MEDICATIONS: string;
    SALES: string;
    SALE_ITEMS: string;
    EXAMS: string;
    EXAM_TYPES: string;
    EXPENSES: string;
    EXPENSE_CATEGORIES: string;
  };
}

// Fonction pour obtenir la configuration actuelle
const getDatabaseConfig = (): DatabaseConfig => {
  // Vérifier d'abord la configuration globale
  if (window.DATABASE_CONFIG) {
    return window.DATABASE_CONFIG;
  }

  // Puis localStorage
  const savedConfig = localStorage.getItem('database_config');
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    return {
      HOST: config.host,
      PORT: config.port,
      DATABASE: config.database,
      USER: config.user,
      PASSWORD: config.password,
      API_BASE_URL: config.apiUrl || 'http://localhost/caisse-medicale/api',
      TABLES: {
        MEDICATIONS: 'medications',
        SALES: 'sales',
        SALE_ITEMS: 'sale_items',
        EXAMS: 'exams',
        EXAM_TYPES: 'exam_types',
        EXPENSES: 'expenses',
        EXPENSE_CATEGORIES: 'expense_categories'
      }
    };
  }

  // Configuration par défaut pour WAMP
  return {
    HOST: 'localhost',
    PORT: 3306,
    DATABASE: 'caisse_medicale',
    USER: 'root',
    PASSWORD: '',
    API_BASE_URL: 'http://localhost/caisse-medicale/api',
    TABLES: {
      MEDICATIONS: 'medications',
      SALES: 'sales',
      SALE_ITEMS: 'sale_items',
      EXAMS: 'exams',
      EXAM_TYPES: 'exam_types',
      EXPENSES: 'expenses',
      EXPENSE_CATEGORIES: 'expense_categories'
    }
  };
};

// Fonction pour générer les en-têtes HTTP
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

class DatabaseService {
  private getBaseUrl() {
    const config = getDatabaseConfig();
    return config.API_BASE_URL;
  }

  async get(table: string, filters?: any) {
    try {
      let url = `${this.getBaseUrl()}/${table}.php`;
      
      if (filters) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined) {
            params.append(key, filters[key]);
          }
        });
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération des données de ${table}:`, error);
      throw error;
    }
  }

  async post(table: string, data: any) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/${table}.php`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de l'insertion dans ${table}:`, error);
      throw error;
    }
  }

  async put(table: string, id: string, data: any) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/${table}.php/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${table}:`, error);
      throw error;
    }
  }

  async delete(table: string, id: string) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/${table}.php/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${table}:`, error);
      throw error;
    }
  }

  async generateInvoiceNumber() {
    try {
      const response = await fetch(`${this.getBaseUrl()}/generate-invoice-number.php`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result.invoice_number;
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de facture:', error);
      const timestamp = Date.now().toString().slice(-6);
      return `F${timestamp}`;
    }
  }
}

export const dbService = new DatabaseService();

// Mock complet des fonctions Supabase pour compatibilité parfaite
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      data: null,
      error: null,
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        single: async () => {
          try {
            const data = await dbService.get(table, { [column]: value });
            return { data: data[0] || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        gt: (column2: string, value2: any) => ({
          data: null,
          error: null,
          order: (orderColumn: string, options?: any) => ({
            data: null,
            error: null,
            execute: async () => {
              try {
                const data = await dbService.get(table, { 
                  [column]: value,
                  [`${column2}_gt`]: value2,
                  _order: orderColumn,
                  _sort: options?.ascending === false ? 'desc' : 'asc'
                });
                return { data, error: null };
              } catch (error) {
                return { data: [], error };
              }
            }
          })
        }),
        order: (orderColumn: string, options?: any) => ({
          data: null,
          error: null,
          limit: (count: number) => ({
            data: null,
            error: null,
            execute: async () => {
              try {
                const data = await dbService.get(table, { 
                  [column]: value, 
                  _order: orderColumn, 
                  _limit: count,
                  _sort: options?.ascending === false ? 'desc' : 'asc'
                });
                return { data, error: null };
              } catch (error) {
                return { data: [], error };
              }
            }
          }),
          execute: async () => {
            try {
              const data = await dbService.get(table, { 
                [column]: value,
                _order: orderColumn,
                _sort: options?.ascending === false ? 'desc' : 'asc'
              });
              return { data, error: null };
            } catch (error) {
              return { data: [], error };
            }
          }
        }),
        execute: async () => {
          try {
            const data = await dbService.get(table, { [column]: value });
            return { data, error: null };
          } catch (error) {
            return { data: [], error };
          }
        }
      }),
      gt: (column: string, value: any) => ({
        data: null,
        error: null,
        order: (orderColumn: string) => ({
          data: null,
          error: null,
          execute: async () => {
            try {
              const data = await dbService.get(table, { 
                [`${column}_gt`]: value,
                _order: orderColumn
              });
              return { data, error: null };
            } catch (error) {
              return { data: [], error };
            }
          }
        })
      }),
      gte: (column: string, value: any) => ({
        data: null,
        error: null,
        lt: (column2: string, value2: any) => ({
          data: null,
          error: null,
          eq: (column3: string, value3: any) => ({
            data: null,
            error: null,
            order: (orderColumn: string, options?: any) => ({
              data: null,
              error: null,
              execute: async () => {
                try {
                  const data = await dbService.get(table, {
                    [`${column}_gte`]: value,
                    [`${column2}_lt`]: value2,
                    [column3]: value3,
                    _order: orderColumn,
                    _sort: options?.ascending === false ? 'desc' : 'asc'
                  });
                  return { data, error: null };
                } catch (error) {
                  return { data: [], error };
                }
              }
            })
          })
        })
      }),
      order: (column: string, options?: any) => ({
        data: null,
        error: null,
        execute: async () => {
          try {
            const data = await dbService.get(table, {
              _order: column,
              _sort: options?.ascending === false ? 'desc' : 'asc'
            });
            return { data, error: null };
          } catch (error) {
            return { data: [], error };
          }
        },
        limit: (count: number) => ({
          data: null,
          error: null,
          execute: async () => {
            try {
              const data = await dbService.get(table, {
                _order: column,
                _sort: options?.ascending === false ? 'desc' : 'asc',
                _limit: count
              });
              return { data, error: null };
            } catch (error) {
              return { data: [], error };
            }
          }
        })
      }),
      limit: async (count: number) => {
        try {
          const data = await dbService.get(table, { _limit: count });
          return { data, error: null };
        } catch (error) {
          return { data: [], error };
        }
      },
      execute: async () => {
        try {
          const data = await dbService.get(table);
          return { data, error: null };
        } catch (error) {
          return { data: [], error };
        }
      }
    }),
    insert: (data: any) => ({
      data: null,
      error: null,
      select: () => ({
        data: null,
        error: null,
        single: async () => {
          try {
            const result = await dbService.post(table, data);
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      execute: async () => {
        try {
          const result = await dbService.post(table, data);
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    update: (data: any) => ({
      data: null,
      error: null,
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        execute: async () => {
          try {
            const result = await dbService.put(table, value, data);
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    }),
    delete: () => ({
      data: null,
      error: null,
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        execute: async () => {
          try {
            await dbService.delete(table, value);
            return { data: null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    })
  }),
  rpc: async (functionName: string) => {
    if (functionName === 'generate_invoice_number') {
      try {
        const invoiceNumber = await dbService.generateInvoiceNumber();
        return { data: invoiceNumber, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
    return { data: null, error: new Error('Fonction non supportée') };
  }
};

// Déclarer le type global pour TypeScript
declare global {
  interface Window {
    DATABASE_CONFIG?: DatabaseConfig;
  }
}
