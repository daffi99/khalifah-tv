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
      <div className="w-full bg-white relative flex flex-col h-[100dvh] overflow-hidden">
        
        {/* Top Section: Player & Info */}
        <div className="w-full flex flex-col shrink-0">
          {/* Fixed Player at the Top */}
          <div className="w-full bg-black aspect-video landscape:h-[65vh] landscape:aspect-auto flex justify-center shrink-0 shadow-sm relative z-20">
            <div className="w-full h-full max-w-5xl flex justify-center">
              <KidsWatchPlayer 
                title={video.title} 
                src={video.video_url} 
                poster={video.thumbnail_url} 
              />
            </div>
          </div>

          {/* Video Info Section (Hidden on landscape to save space) */}
          <div className="px-4 py-2 lg:py-3 w-full max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 landscape:hidden">
            <div>
              <h1 className="text-sm lg:text-base font-bold text-foreground leading-tight mb-1">
                {video.title}
              </h1>
              <div className="flex items-center text-[10px] lg:text-xs text-muted-foreground font-medium">
                <span>{mockViews} views</span>
                <span className="mx-1.5">•</span>
                <span>{mockDate}</span>
                <span className="mx-1.5">•</span>
                <button className="font-bold text-foreground">more...</button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                  KT
                </div>
                <div>
                  <h3 className="font-bold text-xs lg:text-sm text-foreground">Khalifah TV</h3>
                  <p className="text-[10px] text-muted-foreground">1.2M subscribers</p>
                </div>
              </div>
              
              <button className="bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[10px] lg:text-xs font-bold active:scale-95 transition-transform shadow-md uppercase tracking-wide">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Interactive Related Videos Feed */}
        <div className="flex-1 flex flex-col min-h-0 bg-white relative z-10 w-full max-w-5xl mx-auto pb-16 landscape:pb-2 border-t border-border/40">
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
