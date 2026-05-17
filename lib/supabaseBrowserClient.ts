import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente público para usar exclusivamente en Client Components
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
