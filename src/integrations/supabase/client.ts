
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuration par défaut pour le client - MISE À JOUR avec les bonnes informations
const DEFAULT_SUPABASE_URL = 'https://iynltojhdocgofmhedmk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bmx0b2poZG9jZ29mbWhlZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjYxNTUsImV4cCI6MjA2MzYwMjE1NX0.4ESglPXw0DmCgSvFsob2OQGrr2bXYmFjvgatXxb0zoY';

// Récupération de la configuration depuis le localStorage
const getSupabaseConfig = () => {
  const saved = localStorage.getItem('supabase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

// Configuration Supabase
const config = getSupabaseConfig();
const supabaseUrl = config?.url || DEFAULT_SUPABASE_URL;
const supabaseKey = config?.key || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // Pas de session pour cette version
  }
});

// Fonction pour tester la connexion - AMÉLIORÉE avec plusieurs tests
export const testConnection = async () => {
  try {
    console.log('🔍 Test de connexion Supabase en cours...');
    console.log('URL:', supabaseUrl);
    console.log('Key (premiers caractères):', supabaseKey.substring(0, 20) + '...');
    
    // Test 1: Vérification de base avec une requête simple
    console.log('📡 Test 1: Ping basique...');
    const { data: pingData, error: pingError } = await supabase
      .from('medications')
      .select('id')
      .limit(1);
    
    if (pingError) {
      console.log('❌ Test 1 échoué:', pingError);
      
      // Test 2: Essayer avec une autre table
      console.log('📡 Test 2: Essai avec table users...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (userError) {
        console.log('❌ Test 2 échoué:', userError);
        return { success: false, error: `Erreur base de données: ${userError.message}` };
      } else {
        console.log('✅ Test 2 réussi avec table users');
        return { success: true, message: 'Connexion réussie (via table users)' };
      }
    }
    
    console.log('✅ Test 1 réussi:', pingData);
    return { success: true, message: 'Connexion établie avec succès' };
    
  } catch (err: any) {
    console.error('💥 Erreur lors du test de connexion:', err);
    
    // Analyser le type d'erreur
    if (err.message?.includes('fetch')) {
      return { 
        success: false, 
        error: 'Erreur réseau - Vérifiez votre URL Supabase' 
      };
    } else if (err.message?.includes('Invalid API key')) {
      return { 
        success: false, 
        error: 'Clé API invalide - Vérifiez votre clé anonyme' 
      };
    } else {
      return { 
        success: false, 
        error: `Erreur de connexion: ${err.message}` 
      };
    }
  }
};

// Fonction pour configurer Supabase
export const configureSupabase = (url: string, key: string) => {
  const config = { url, key };
  localStorage.setItem('supabase_config', JSON.stringify(config));
  
  // Rechargement recommandé après configuration
  return true;
};
