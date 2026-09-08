import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let instance: SupabaseClient | null = null;

const DEFAULT_URL = 'https://esuvvrbpcbehnqpqczbg.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_fx2-49ZhHopJUSj0ZSirtQ_pDLY-EVl';

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;
  if (!instance) instance = createClient(url, key);
  return instance;
}

export const supabaseConfigured = true;
