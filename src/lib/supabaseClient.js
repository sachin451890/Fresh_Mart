import { createClient } from '@supabase/supabase-js';

// Default project configuration provided by user
const DEFAULT_SUPABASE_URL = 'https://jlaywofncvmzwhzkqkyn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_9f0FQPbcTGLjt77rNqW6DA_oEJ0tflT';

export const getSupabaseConfig = () => {
  const hasLocalStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const customUrl = hasLocalStorage ? localStorage.getItem('freshmart_supabase_url') : null;
  const customKey = hasLocalStorage ? localStorage.getItem('freshmart_supabase_anon_key') : null;

  const envUrl =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_URL
      : process.env.VITE_SUPABASE_URL;

  const envKey =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_ANON_KEY
      : process.env.VITE_SUPABASE_ANON_KEY;

  const url = customUrl || envUrl || DEFAULT_SUPABASE_URL;
  const anonKey = customKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.includes('.supabase.co') &&
    !url.includes('your-project') &&
    anonKey.length > 15
  );

  return { url, anonKey, isConfigured };
};

export const setSupabaseConfig = (url, anonKey) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (url) localStorage.setItem('freshmart_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('freshmart_supabase_anon_key', anonKey.trim());
  }
};

export const resetSupabaseConfig = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem('freshmart_supabase_url');
    localStorage.removeItem('freshmart_supabase_anon_key');
  }
};

const { url, anonKey } = getSupabaseConfig();

// Create and export singleton client instance
export const supabase = createClient(
  url.startsWith('http') ? url : DEFAULT_SUPABASE_URL,
  anonKey || DEFAULT_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
  }
);
