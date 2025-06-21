
import { useState, useEffect } from 'react';

interface NotificationSettings {
  lowStock: boolean;
  sales: boolean;
  autoReports: boolean;
}

interface PrintConfig {
  defaultPrinter: string;
  paperSize: string;
  autoprint: boolean;
}

interface UserPreferences {
  notifications: NotificationSettings;
  theme: string;
  language: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      lowStock: true,
      sales: false,
      autoReports: true
    },
    theme: 'light',
    language: 'fr'
  });

  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    defaultPrinter: 'printer1',
    paperSize: 'a4',
    autoprint: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedPreferences = localStorage.getItem('user_preferences');
    const savedPrintConfig = localStorage.getItem('print_config');
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    }

    if (savedPrintConfig) {
      try {
        setPrintConfig(JSON.parse(savedPrintConfig));
      } catch (error) {
        console.error('Erreur lors du chargement de la config impression:', error);
      }
    }
  }, []);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  const updatePrintConfig = (newConfig: PrintConfig) => {
    setPrintConfig(newConfig);
  };

  const savePreferences = async (preferencesToSave: UserPreferences): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('user_preferences', JSON.stringify(preferencesToSave));
      setPreferences(preferencesToSave);
      console.log('Préférences sauvegardées avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const savePrintConfig = async (configToSave: PrintConfig): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('print_config', JSON.stringify(configToSave));
      setPrintConfig(configToSave);
      console.log('Configuration d\'impression sauvegardée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la config impression:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    printConfig,
    updatePreferences,
    updatePrintConfig,
    savePreferences,
    savePrintConfig,
    isLoading
  };
};
