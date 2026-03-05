import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are required."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Contest = {
  id: string;
  name: string;
  created_at: string;
  host_token: string;
};

export type Vote = {
  id: string;
  contest_id: string;
  guest_name: string;
  scores_json: Record<string, number>;
  created_at: string;
};
