import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are placeholders or not set
const isConfigured = 
  supabaseUrl && 
  supabaseUrl !== "your-supabase-url-here" && 
  supabaseAnonKey && 
  supabaseAnonKey !== "your-supabase-anon-key-here";

if (!isConfigured) {
  console.warn(
    "Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable live syncing. Falling back to sessionStorage storage."
  );
}

// Fallback client details so the application doesn't crash on initial boot
export const supabase = createClient(
  isConfigured ? supabaseUrl : "https://placeholder-project.supabase.co",
  isConfigured ? supabaseAnonKey : "placeholder-key"
);

export const hasSupabase = isConfigured;
