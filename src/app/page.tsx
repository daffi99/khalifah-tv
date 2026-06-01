import { supabase } from "@/lib/supabase/client";
import { KidsHeader } from "@/components/kids/KidsHeader";
import { BottomNav } from "@/components/kids/BottomNav";
import { KidsFeed } from "@/components/kids/KidsFeed";

// Revalidate this page every 60 seconds so new videos show up automatically
export const revalidate = 60;

export default async function Home() {
  // Fetch only published videos, ordered by newest first
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, category, duration, thumbnail_url")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-muted/20 flex justify-center selection:bg-primary/30">
      {/* Mobile constraint wrapper */}
      <div className="w-full max-w-md bg-white relative flex flex-col min-h-screen shadow-2xl overflow-hidden border-x border-border">
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col flex-1 h-screen overflow-hidden pt-2">
          <KidsHeader />
          <KidsFeed initialVideos={videos || []} />
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
