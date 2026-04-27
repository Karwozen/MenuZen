import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Supabase keys are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
}

let client: ReturnType<typeof createClient>;
try {
  // Tentar ser criado com as chaves reais ou falhar explicitamente
  client = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  client = new Proxy({} as any, {
    get: () => { throw error; }
  });
}

export const supabase = client;
