import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  // Find all settings rows
  const { data: settings } = await supabase.from("settings").select("*");
  
  if (!settings || settings.length <= 1) {
    return NextResponse.json({ message: "No duplicates found.", settings });
  }

  // Identify the row with PIN 1234
  const rowToDelete = settings.find(s => s.admin_pin === "1234");
  
  if (rowToDelete) {
    await supabase.from("settings").delete().eq("id", rowToDelete.id);
    return NextResponse.json({ message: "Successfully removed the 1234 PIN row! Now only 0000 remains." });
  }

  return NextResponse.json({ message: "Could not find a 1234 PIN row to delete." });
}
