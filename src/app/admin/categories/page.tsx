import { supabase } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  // Fetch dynamic categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <AdminHeader
        title="Manage Categories"
        subtitle="Add or remove video categories"
        showBack
        backHref="/admin"
      />

      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
          <CategoryManager initialCategories={categories || []} />
        </div>
      </main>
    </div>
  );
}
