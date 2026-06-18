import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin1@mentoria.kz',
    password: 'admin123'
  });
  console.log("Error:", error);
  console.log("Error message:", error?.message);
  console.log("Error type:", typeof error);
  console.log("Data:", data);
}

test();
