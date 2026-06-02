import { supabase } from "@/lib/supabase/client";
import { KidsHeader } from "@/components/kids/KidsHeader";
import { BottomNav } from "@/components/kids/BottomNav";
import { KidsFeed } from "@/components/kids/KidsFeed";

// Force dynamic rendering so we can generate a perfectly random feed on every page load
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch only published videos, ordered by newest first
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, category, duration, thumbnail_url")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch dynamic categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  // Shuffle videos for a completely random feed experience
  const shuffledVideos = videos 
    ? [...videos].sort(() => Math.random() - 0.5) 
    : [];

  return (
    <main className="min-h-screen bg-muted/20 flex justify-center selection:bg-primary/30">
      {/* Full-width responsive constraint wrapper */}
      <div className="w-full bg-white relative flex flex-col min-h-screen shadow-2xl overflow-hidden">
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col flex-1 h-screen overflow-hidden pt-2">
          <KidsHeader />
          <KidsFeed initialVideos={shuffledVideos} categories={categories || []} />
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
