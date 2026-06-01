"use server";

import { supabase } from "@/lib/supabase/client";

export async function updateAdminPin(formData: FormData) {
  const pin = formData.get("pin") as string;

  if (!pin || pin.length !== 4) {
    return { error: "PIN must be exactly 4 digits." };
  }

  // Update the PIN in the settings table
  // Since we only have one settings row, we can just update all of them
  const { error } = await supabase
    .from("settings")
    .update({ admin_pin: pin })
    .neq("admin_pin", "imposiblestring") // Dummy condition to allow update without specific ID
    ;

  if (error) {
    return { error: "Failed to update PIN. Ensure settings table exists." };
  }

  return { success: true };
}
