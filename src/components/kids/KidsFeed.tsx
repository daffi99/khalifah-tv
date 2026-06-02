"use client";

import { useState } from "react";
import { CategoryChips } from "./CategoryChips";
import { KidsVideoCard } from "./KidsVideoCard";

interface Video {
  id: string;
  title: string;
  category: string;
  duration: string | null;
  thumbnail_url: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface KidsFeedProps {
  initialVideos: Video[];
  categories: Category[];
}

export function KidsFeed({ initialVideos, categories }: KidsFeedProps) {
  const defaultSlug = categories.some(c => c.slug.toLowerCase().includes('learning')) 
    ? categories.find(c => c.slug.toLowerCase().includes('learning'))!.slug 
    : "all";

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(defaultSlug);

  const categoryLabels = ["All", ...categories.map((c) => c.name)];

  const filteredVideos = initialVideos.filter((video) => {
    if (selectedCategorySlug === "all") return true;
    return video.category === selectedCategorySlug;
  });

  const handleSelect = (label: string) => {
    if (label === "All") {
      setSelectedCategorySlug("all");
    } else {
      const cat = categories.find((c) => c.name === label);
      if (cat) setSelectedCategorySlug(cat.slug);
    }
  };

  const currentLabel = selectedCategorySlug === "all" 
    ? "All" 
    : categories.find(c => c.slug === selectedCategorySlug)?.name || "All";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Categories Bar */}
      <div className="sticky top-0 z-30 bg-white pb-2 pt-2 border-b border-border/40">
        <CategoryChips
          categories={categoryLabels}
          selectedCategory={currentLabel}
          onSelect={handleSelect}
        />
      </div>

      {/* Video Feed */}
      <div className="flex-1 overflow-y-auto pb-32 pt-2 sm:pt-4 px-4 sm:px-6 scrollbar-hide bg-muted/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-medium col-span-full">
              No videos found for this category yet!
            </div>
          ) : (
            filteredVideos.map((video) => (
              <KidsVideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                category={video.category}
                duration={video.duration}
                thumbnailUrl={video.thumbnail_url}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
