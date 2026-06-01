"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name || name.trim().length === 0) {
    return { error: "Category name is required" };
  }

  // Generate a simple slug from the name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from("categories")
    .insert([{ name: name.trim(), slug }]);

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { error: "A category with this name already exists" };
    }
    return { error: "Failed to add category" };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/upload");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Failed to delete category" };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/upload");
  revalidatePath("/");
  return { success: true };
}
