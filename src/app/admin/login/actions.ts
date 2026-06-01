"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function loginWithPin(formData: FormData) {
  const pin = formData.get("pin") as string;

  if (!pin) {
    return { error: "PIN is required" };
  }

  // Fetch the correct PIN from the settings table
  let { data: settingsArray, error } = await supabase
    .from("settings")
    .select("admin_pin")
    .order("updated_at", { ascending: false })
    .limit(1);

  // Self-healing: fallback queries if the 'updated_at' column is missing from their DB
  if (error) {
    const fallback = await supabase.from("settings").select("admin_pin").limit(1);
    if (fallback.error) {
      return { error: `DB Error: ${fallback.error.message}` };
    }
    settingsArray = fallback.data;
  }

  // Self-healing: if the table is completely empty, insert the default PIN
  if (!settingsArray || settingsArray.length === 0) {
    const { error: insertError } = await supabase.from("settings").insert({ admin_pin: "0000" });
    if (insertError) {
      return { error: `Failed to create default PIN: ${insertError.message}` };
    }
    settingsArray = [{ admin_pin: "0000" }];
  }

  const settings = settingsArray[0];

  if (pin === settings.admin_pin) {
    // Set a secure HTTP-only cookie that the middleware will read
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.VERCEL === "1",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    // Redirect must happen outside of a try/catch, so we do it here if successful
    redirect("/admin/videos");
  } else {
    return { error: "Incorrect PIN" };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
