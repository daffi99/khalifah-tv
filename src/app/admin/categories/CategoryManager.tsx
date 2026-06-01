"use client";

import { useState } from "react";
import { addCategory, deleteCategory } from "./actions";
import { Plus, Trash2, Tag, Loader2, AlertCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);

    const result = await addCategory(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setName("");
      // Optimistically add it to UI for speed (it's also revalidated from server)
      setCategories([
        ...categories, 
        { id: Math.random().toString(), name: name.trim(), slug: name.trim().toLowerCase() }
      ]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setCategories(categories.filter((c) => c.id !== id));
    await deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category Name (e.g. Science)"
          className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-primary text-primary-foreground px-4 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 transition-active"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Tag className="w-4 h-4" />
              </div>
              <span className="font-semibold text-foreground text-sm">{cat.name}</span>
            </div>
            
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-6">
            No categories created yet.
          </p>
        )}
      </div>
    </div>
  );
}
