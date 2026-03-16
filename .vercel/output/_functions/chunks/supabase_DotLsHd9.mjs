import { createClient } from '@supabase/supabase-js';

const supabaseUrl = undefined                                   ;
const supabaseAnonKey = undefined                                        ;
{
  throw new Error(
    "Missing Supabase environment variables: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are required."
  );
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
