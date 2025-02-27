/* import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL o Key no están configurados correctamente.");
  throw new Error("Supabase URL o Key no están configurados correctamente.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, 
    storage: {
      getItem: (key) => {
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {} as Record<string, string>);
        return cookies[key] || null;
      },
      setItem: (key, value) => {
        document.cookie = `${key}=${value}; path=/;`;
      },
      removeItem: (key) => {
        document.cookie = `${key}=; Max-Age=0; path=/;`;
      }
    }
  }
}); */