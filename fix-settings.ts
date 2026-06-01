import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixSettings() {
  console.log("Fetching all settings...");
  const { data: settings, error: fetchError } = await supabase
    .from("settings")
    .select("*")
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("Error fetching settings:", fetchError);
    return;
  }

  console.log(`Found ${settings?.length} settings rows.`);
  
  if (!settings || settings.length <= 1) {
    console.log("No duplicates found. Everything is fine.");
    return;
  }

  // Keep the first one (0000), delete the rest
  const rowToKeep = settings.find(s => s.admin_pin === "0000") || settings[0];
  console.log(`Keeping row with PIN: ${rowToKeep.admin_pin} (ID: ${rowToKeep.id})`);

  const idsToDelete = settings
    .filter(s => s.id !== rowToKeep.id)
    .map(s => s.id);

  console.log(`Deleting ${idsToDelete.length} extra rows...`);

  const { error: deleteError } = await supabase
    .from("settings")
    .delete()
    .in("id", idsToDelete);

  if (deleteError) {
    console.error("Error deleting rows:", deleteError);
  } else {
    console.log("Successfully deleted extra rows!");
  }
}

fixSettings();
