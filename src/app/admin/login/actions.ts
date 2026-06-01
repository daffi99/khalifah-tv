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
  const { data: settingsArray, error } = await supabase
    .from("settings")
    .select("admin_pin")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error || !settingsArray || settingsArray.length === 0) {
    return { error: "Could not verify PIN. Please try again." };
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
