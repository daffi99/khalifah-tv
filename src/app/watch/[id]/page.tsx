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
      {/* Mobile constraint wrapper */}
      <div className="w-full max-w-md bg-white relative flex flex-col h-screen shadow-2xl overflow-hidden">
        
        {/* Fixed Player at the Top */}
        <div className="w-full bg-black aspect-video shrink-0">
          <KidsWatchPlayer 
            title={video.title} 
            src={video.video_url} 
            poster={video.thumbnail_url} 
          />
        </div>

        {/* Video Info Section */}
        <div className="px-4 py-3 border-b border-border/40">
          <h1 className="text-lg font-bold text-foreground leading-tight line-clamp-2 mb-1">
            {video.title}
          </h1>
          <div className="flex items-center text-xs text-muted-foreground font-medium mb-3">
            <span>{mockViews} views</span>
            <span className="mx-1.5">•</span>
            <span>{mockDate}</span>
            <span className="mx-1.5">•</span>
            <button className="font-bold text-foreground">more...</button>
          </div>

          {/* Channel Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                KT
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Khalifah TV</h3>
                <p className="text-xs text-muted-foreground">1.2M subscribers</p>
              </div>
            </div>
            
            <button className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform">
              Subscribe
            </button>
          </div>
        </div>

        {/* Interactive Related Videos Feed */}
        <div className="flex-1 flex flex-col min-h-0 pb-16">
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
