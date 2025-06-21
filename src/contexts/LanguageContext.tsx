
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionnaire de traductions étendu
const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.sales': 'Ventes',
    'nav.cashiers': 'Caissiers',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.statistics': 'Statistiques',
    
    // Ventes
    'sales.title': 'Module de Ventes',
    'sales.search': 'Rechercher des produits...',
    'sales.cart': 'Panier',
    'sales.total': 'Total',
    'sales.checkout': 'Finaliser la vente',
    'sales.quantity': 'Quantité',
    'sales.price': 'Prix',
    'sales.remove': 'Supprimer',
    
    // Rapports
    'reports.title': 'Rapports',
    'reports.daily': 'Rapport quotidien',
    'reports.monthly': 'Rapport mensuel',
    
    // Paramètres
    'settings.title': 'Paramètres',
    'settings.center': 'Centre Médical',
    'settings.security': 'Sécurité',
    'settings.language': 'Langue',
    'settings.currency': 'Devise',
    'settings.save': 'Sauvegarder',
    'settings.cancel': 'Annuler',
    
    // Auth
    'auth.login': 'Se connecter',
    'auth.username': 'Nom d\'utilisateur',
    'auth.password': 'Mot de passe',
    'auth.welcome': 'Bienvenue',
    'auth.logout.success': 'Déconnexion réussie',
    
    // Messages
    'success.saved': 'Sauvegardé avec succès',
    'error.save': 'Erreur lors de la sauvegarde',
    'error.access': 'Accès non autorisé',
    
    // Rôles
    'role.admin': 'Administrateur',
    'role.gestionnaire': 'Gestionnaire',
    'role.caissier': 'Caissier',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.sales': 'المبيعات',
    'nav.cashiers': 'أمناء الصندوق',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً',
    'dashboard.statistics': 'الإحصائيات',
    
    // Ventes
    'sales.title': 'وحدة المبيعات',
    'sales.search': 'البحث عن المنتجات...',
    'sales.cart': 'عربة التسوق',
    'sales.total': 'المجموع',
    'sales.checkout': 'إتمام البيع',
    'sales.quantity': 'الكمية',
    'sales.price': 'السعر',
    'sales.remove': 'حذف',
    
    // Rapports
    'reports.title': 'التقارير',
    'reports.daily': 'التقرير اليومي',
    'reports.monthly': 'التقرير الشهري',
    
    // Paramètres
    'settings.title': 'الإعدادات',
    'settings.center': 'المركز الطبي',
    'settings.security': 'الأمان',
    'settings.language': 'اللغة',
    'settings.currency': 'العملة',
    'settings.save': 'حفظ',
    'settings.cancel': 'إلغاء',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.username': 'اسم المستخدم',
    'auth.password': 'كلمة المرور',
    'auth.welcome': 'مرحباً',
    'auth.logout.success': 'تم تسجيل الخروج بنجاح',
    
    // Messages
    'success.saved': 'تم الحفظ بنجاح',
    'error.save': 'خطأ في الحفظ',
    'error.access': 'غير مسموح بالوصول',
    
    // Rôles
    'role.admin': 'مدير',
    'role.gestionnaire': 'مدير العمليات',
    'role.caissier': 'أمين الصندوق',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.sales': 'Sales',
    'nav.cashiers': 'Cashiers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.statistics': 'Statistics',
    
    // Ventes
    'sales.title': 'Sales Module',
    'sales.search': 'Search products...',
    'sales.cart': 'Cart',
    'sales.total': 'Total',
    'sales.checkout': 'Complete Sale',
    'sales.quantity': 'Quantity',
    'sales.price': 'Price',
    'sales.remove': 'Remove',
    
    // Rapports
    'reports.title': 'Reports',
    'reports.daily': 'Daily Report',
    'reports.monthly': 'Monthly Report',
    
    // Paramètres
    'settings.title': 'Settings',
    'settings.center': 'Medical Center',
    'settings.security': 'Security',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    
    // Auth
    'auth.login': 'Login',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.welcome': 'Welcome',
    'auth.logout.success': 'Successfully logged out',
    
    // Messages
    'success.saved': 'Successfully saved',
    'error.save': 'Error saving',
    'error.access': 'Access denied',
    
    // Rôles
    'role.admin': 'Administrator',
    'role.gestionnaire': 'Manager',
    'role.caissier': 'Cashier',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('fr');

  useEffect(() => {
    // Charger la langue depuis les préférences utilisateur
    const savedPrefs = localStorage.getItem('user_preferences');
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.language) {
          setLanguageState(prefs.language);
          console.log('Langue chargée:', prefs.language);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la langue:', error);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    console.log('Changement de langue vers:', lang);
    setLanguageState(lang);
    
    // Sauvegarder dans les préférences
    const savedPrefs = localStorage.getItem('user_preferences');
    const prefs = savedPrefs ? JSON.parse(savedPrefs) : {};
    prefs.language = lang;
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
    
    // Appliquer la direction RTL pour l'arabe
    applyLanguageSettings(lang);
  };

  const applyLanguageSettings = (lang: string) => {
    const html = document.documentElement;
    
    if (lang === 'ar') {
      html.dir = 'rtl';
      html.lang = 'ar';
      html.style.fontFamily = '"Noto Sans Arabic", "Arial Unicode MS", sans-serif';
      // Ajouter la classe pour le CSS RTL
      html.classList.add('rtl');
      html.classList.remove('ltr');
    } else {
      html.dir = 'ltr';
      html.lang = lang;
      html.style.fontFamily = '';
      html.classList.add('ltr');
      html.classList.remove('rtl');
    }
  };

  const t = (key: string): string => {
    const languageDict = translations[language as keyof typeof translations] || translations.fr;
    return languageDict[key as keyof typeof languageDict] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    // Appliquer la direction lors du changement de langue
    applyLanguageSettings(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
