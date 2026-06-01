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

interface WatchRelatedFeedProps {
  initialVideos: Video[];
  categories: Category[];
}

export function WatchRelatedFeed({ initialVideos, categories }: WatchRelatedFeedProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");

  const categoryLabels = ["All", ...categories.map((c) => c.name)];

  const filteredVideos = initialVideos.filter((video) => {
    if (selectedCategorySlug === "all") return true;
    return video.category === selectedCategorySlug;
  });

  // CategoryChips returns the LABEL (e.g. "Science"). We need to map it back to slug to filter.
  const handleSelect = (label: string) => {
    if (label === "All") {
      setSelectedCategorySlug("all");
    } else {
      const cat = categories.find((c) => c.name === label);
      if (cat) setSelectedCategorySlug(cat.slug);
    }
  };

  // Find the current selected label based on the slug
  const currentLabel = selectedCategorySlug === "all" 
    ? "All" 
    : categories.find(c => c.slug === selectedCategorySlug)?.name || "All";

  return (
    <>
      {/* Category Chips for Related Videos */}
      <div className="bg-white border-b border-border/40 py-2">
        <CategoryChips
          categories={categoryLabels}
          selectedCategory={currentLabel}
          onSelect={handleSelect}
        />
      </div>

      {/* Related Videos Feed */}
      <div className="flex flex-col gap-0 sm:gap-4 bg-muted/10 pb-8 pt-2">
        {filteredVideos && filteredVideos.length > 0 ? (
          filteredVideos.map((rv) => (
            <KidsVideoCard
              key={rv.id}
              id={rv.id}
              title={rv.title}
              category={rv.category}
              duration={rv.duration}
              thumbnailUrl={rv.thumbnail_url}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 text-sm">No related videos found.</p>
        )}
      </div>
    </>
  );
}
