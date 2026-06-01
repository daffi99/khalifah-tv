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

interface KidsFeedProps {
  initialVideos: Video[];
}

const CATEGORIES = ["All", ...CATEGORY_OPTIONS.map((c) => c.label)];

export function KidsFeed({ initialVideos }: KidsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos = initialVideos.filter((video) => {
    if (selectedCategory === "All") return true;
    
    // Find the category option that matches the selected label
    const selectedOption = CATEGORY_OPTIONS.find(c => c.label === selectedCategory);
    if (!selectedOption) return false;

    // Compare the database category value with the option's value
    return video.category === selectedOption.value;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Categories Bar */}
      <div className="sticky top-0 z-30 bg-white pb-2 pt-2 border-b border-border/40">
        <CategoryChips
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Video Feed */}
      <div className="flex-1 overflow-y-auto pb-32 pt-0 scrollbar-hide bg-muted/10">
        <div className="flex flex-col gap-0 sm:gap-4">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-medium">
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
