export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { ChevronDown, Share2, ThumbsUp, MoreVertical } from "lucide-react";
import Link from "next/link";
import { KidsWatchPlayer } from "@/components/kids/KidsWatchPlayer";
import { WatchRelatedFeed } from "@/components/kids/WatchRelatedFeed";
import { BottomNav } from "@/components/kids/BottomNav";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;

  // Fetch the current video
  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (!video) {
    notFound();
  }

  // Fetch all other published videos for the "Related" feed
  const { data: relatedVideos } = await supabase
    .from("videos")
    .select("id, title, category, duration, thumbnail_url")
    .eq("status", "published")
    .neq("id", id)
    .order("created_at", { ascending: false });

  // Fetch dynamic categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  // Generate a mock view count and date for the YouTube look
  const mockViews = Math.floor(Math.random() * 900 + 100) + "K";
  const mockDate = "6 days ago";

  // Shuffle related videos for a randomized feed
  const shuffledRelatedVideos = relatedVideos 
    ? [...relatedVideos].sort(() => Math.random() - 0.5) 
    : [];

  return (
    <main className="min-h-screen bg-white flex justify-center selection:bg-primary/30">
      {/* Full-width responsive constraint wrapper */}
      <div className="w-full bg-white relative flex flex-col lg:flex-row h-[100dvh] shadow-2xl overflow-hidden">
        
        {/* Left Column: Player & Info (fixed width on desktop) */}
        <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-col shrink-0 border-r border-border/40 overflow-y-auto overflow-x-hidden">
          {/* Fixed Player at the Top (relative to this column) */}
          <div className="sticky top-0 z-50 w-full bg-black aspect-video shrink-0 shadow-sm">
            <KidsWatchPlayer 
              title={video.title} 
              src={video.video_url} 
              poster={video.thumbnail_url} 
            />
          </div>

          {/* Video Info Section */}
          <div className="px-4 py-4 lg:py-6">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight mb-2">
              {video.title}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground font-medium mb-4 lg:mb-6">
              <span>{mockViews} views</span>
              <span className="mx-2">•</span>
              <span>{mockDate}</span>
              <span className="mx-2">•</span>
              <button className="font-bold text-foreground">more...</button>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between bg-muted/20 p-3 lg:p-4 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  KT
                </div>
                <div>
                  <h3 className="font-bold text-base lg:text-lg text-foreground">Khalifah TV</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">1.2M subscribers</p>
                </div>
              </div>
              
              <button className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform shadow-md hover:bg-foreground/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Related Videos Feed */}
        <div className="flex-1 flex flex-col min-h-0 bg-muted/10 lg:bg-white pb-16 lg:pb-0 relative z-10">
          <WatchRelatedFeed 
            initialVideos={shuffledRelatedVideos} 
            categories={categories || []}
          />
        </div>

      </div>

      <BottomNav />
    </main>
  );
}
