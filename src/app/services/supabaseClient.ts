import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function hasRealEnvValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return false;
  }

  const placeholderTokens = [
    "COLE_SUA_CHAVE",
    "SUA_CHAVE",
    "SEU_PROJETO",
    "YOUR_",
    "_AQUI",
  ];

  return !placeholderTokens.some((token) => normalizedValue.toUpperCase().includes(token));
}

export const isSupabaseConfigured =
  hasRealEnvValue(supabaseUrl) && hasRealEnvValue(supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
