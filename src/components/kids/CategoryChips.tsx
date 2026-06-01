"use client";

import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryChips({ categories, selectedCategory, onSelect }: CategoryChipsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-3 px-4">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-sm",
                isSelected
                  ? "bg-foreground text-background scale-105"
                  : "bg-white text-foreground hover:bg-secondary border border-border/50"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
