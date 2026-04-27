import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://placeholder-url.supabase.co';
let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url || !url.startsWith('http')) {
  url = defaultUrl;
}

const supabaseUrl = url;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = url !== defaultUrl && supabaseAnonKey !== 'placeholder-key';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
