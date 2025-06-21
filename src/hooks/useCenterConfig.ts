
import { useState, useEffect } from 'react';

interface CenterConfig {
  centerName: string;
  centerPhone: string;
  centerAddress: string;
  centerEmail: string;
  centerWebsite: string;
}

export const useCenterConfig = () => {
  const [config, setConfig] = useState<CenterConfig>({
    centerName: '',
    centerPhone: '',
    centerAddress: '',
    centerEmail: '',
    centerWebsite: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger la configuration depuis localStorage
    const savedConfig = localStorage.getItem('center_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erreur lors du chargement de la config centre:', error);
      }
    }
  }, []);

  const updateConfig = (newConfig: CenterConfig) => {
    setConfig(newConfig);
  };

  const saveConfig = async (configToSave: CenterConfig): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('center_config', JSON.stringify(configToSave));
      setConfig(configToSave);
      console.log('Configuration du centre sauvegardée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la config centre:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    updateConfig,
    saveConfig,
    isLoading
  };
};
