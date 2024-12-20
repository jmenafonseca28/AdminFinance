import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
export const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL o Key no están configurados correctamente.");
  throw new Error("Supabase URL o Key no están configurados correctamente.");
}
