// ===========================================
// Supabase Client — Khalifah TV
// ===========================================
// Uses the public anon key for client-side access.
// TODO: Add admin authentication — currently no auth guard.
// When auth is added, use createServerClient for server components
// and add RLS policies to the videos table.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    "⚠️ Supabase environment variables are not set. " +
      "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

// Create a client even with empty strings to avoid build-time crashes.
// Requests will fail gracefully at runtime if env vars are missing.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
