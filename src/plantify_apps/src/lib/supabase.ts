import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gecvpysiaymyyynjhpfz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlY3ZweXNpYXlteXl5bmpocGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDg2NTYsImV4cCI6MjA2OTA4NDY1Nn0.aCO6PYCaW0TGG6mSiRovlmTUjW9HwRdGLqZasapCee0';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
