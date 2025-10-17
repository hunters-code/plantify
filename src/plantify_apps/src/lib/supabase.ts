import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with fallback values for static generation
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
