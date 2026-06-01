"use server";

import { supabase } from "@/lib/supabase/client";

export async function updateAdminPin(formData: FormData) {
  const pin = formData.get("pin") as string;

  if (!pin || pin.length !== 4) {
    return { error: "PIN must be exactly 4 digits." };
  }

  // Delete all existing PINs to guarantee we only ever have exactly 1 setting row
  const { error: deleteError } = await supabase
    .from("settings")
    .delete()
    .neq("admin_pin", "imposiblestring"); // Dummy condition to allow wipe

  if (deleteError) {
    return { error: "Failed to update PIN. Ensure settings table exists." };
  }

  // Insert the fresh, single PIN row
  const { error } = await supabase
    .from("settings")
    .insert({ admin_pin: pin });

  if (error) {
    return { error: "Failed to update PIN. Ensure settings table exists." };
  }

  return { success: true };
}
