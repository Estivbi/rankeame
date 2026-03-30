import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
export const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

// Flag that API handlers can check before making database calls.
// When false they return a 503 JSON error instead of crashing the function.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Use placeholder values so the module can be imported without throwing at
// load time. Actual requests will still fail (and be caught) if the real
// credentials are not provided, but the serverless function will stay alive
// long enough to return a meaningful JSON error to the client.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export type Contest = {
  id: string;
  name: string;
  contest_type: string;
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
