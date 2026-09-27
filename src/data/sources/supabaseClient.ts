import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://woepddzxmpnxtbiwwrvu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZXBkZHp4bXBueHRiaXd3cnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDA4ODcsImV4cCI6MjA3NDM3Njg4N30.C3iG99U-6O25l45e45x9p7pGzQ58vV6f1E2C9b3_6qE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'mia_academy'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
