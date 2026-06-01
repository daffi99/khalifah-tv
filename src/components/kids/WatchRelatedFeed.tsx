"use client";

import { useState } from "react";
import { CategoryChips } from "./CategoryChips";
import { KidsVideoCard } from "./KidsVideoCard";
import { CATEGORY_OPTIONS } from "@/lib/constants";

// Define the shape of our video data
interface Video {
  id: string;
  title: string;
  category: string;
  duration: string | null;
  thumbnail_url: string;
}

interface WatchRelatedFeedProps {
  initialVideos: Video[];
}

const CATEGORIES = ["All", ...CATEGORY_OPTIONS.map((c) => c.label)];

export function WatchRelatedFeed({ initialVideos }: WatchRelatedFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos = initialVideos.filter((video) => {
    if (selectedCategory === "All") return true;
    
    const selectedOption = CATEGORY_OPTIONS.find(c => c.label === selectedCategory);
    if (!selectedOption) return false;

    return video.category === selectedOption.value;
  });

  return (
    <>
      {/* Category Chips for Related Videos */}
      <div className="bg-white border-b border-border/40 py-2">
        <CategoryChips
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
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
