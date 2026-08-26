import { createClient } from '@supabase/supabase-js';

// Default project configuration provided by user
const DEFAULT_SUPABASE_URL = 'https://jlaywofncvmzwhzkqkyn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_9f0FQPbcTGLjt77rNqW6DA_oEJ0tflT';

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('freshmart_supabase_url');
  const customKey = localStorage.getItem('freshmart_supabase_anon_key');

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  if (url) localStorage.setItem('freshmart_supabase_url', url.trim());
  if (anonKey) localStorage.setItem('freshmart_supabase_anon_key', anonKey.trim());
};

export const resetSupabaseConfig = () => {
  localStorage.removeItem('freshmart_supabase_url');
  localStorage.removeItem('freshmart_supabase_anon_key');
};

const { url, anonKey } = getSupabaseConfig();

// Create and export singleton client instance
export const supabase = createClient(
  url.startsWith('http') ? url : DEFAULT_SUPABASE_URL,
  anonKey || DEFAULT_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
