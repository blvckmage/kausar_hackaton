import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setup() {
  console.log("Регистрируем админа...");
  const { data: d1, error: e1 } = await supabase.auth.signUp({
    email: 'admin1@mentoria.com',
    password: 'admin123',
    options: {
      data: {
        full_name: 'Главный Админ',
        role: 'admin'
      }
    }
  });
  if (e1) console.log("Ошибка админа:", e1.message);
  else console.log("Админ создан:", d1.user?.email);

  console.log("Регистрируем студента...");
  const { data: d2, error: e2 } = await supabase.auth.signUp({
    email: 'student1@mentoria.com',
    password: 'student123',
    options: {
      data: {
        full_name: 'Обычный Студент',
        role: 'user'
      }
    }
  });
  if (e2) console.log("Ошибка студента:", e2.message);
  else console.log("Студент создан:", d2.user?.email);
}

setup();
