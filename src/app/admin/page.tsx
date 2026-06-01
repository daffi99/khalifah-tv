"use client";

// ===========================================
// Admin Dashboard — Khalifah TV
// ===========================================

import { useEffect, useState } from "react";
import { Film, Eye, FileEdit, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { AdminMenuCard } from "@/components/admin/AdminMenuCard";
import { ADMIN_MENU_ITEMS } from "@/lib/constants";
import type { VideoStats } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<VideoStats>({
    total: 0,
    published: 0,
    draft: 0,
    hidden: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("status");

        if (error) {
          console.error("Error fetching stats:", error);
          return;
        }

        const videos = data ?? [];
        setStats({
          total: videos.length,
          published: videos.filter((v) => v.status === "published").length,
          draft: videos.filter((v) => v.status === "draft").length,
          hidden: videos.filter((v) => v.status === "hidden").length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Parent Dashboard"
        subtitle="Manage Khalifah TV videos"
      />

      <main className="flex-1 px-4 py-6 sm:px-6 space-y-8">
        {/* Stats Grid */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              label="Total Videos"
              value={loading ? 0 : stats.total}
              icon={Film}
              accentColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <StatsCard
              label="Published"
              value={loading ? 0 : stats.published}
              icon={Eye}
              accentColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <StatsCard
              label="Drafts"
              value={loading ? 0 : stats.draft}
              icon={FileEdit}
              accentColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <StatsCard
              label="Hidden"
              value={loading ? 0 : stats.hidden}
              icon={EyeOff}
              accentColor="bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400"
            />
          </div>
        </section>

        {/* Menu Cards */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {ADMIN_MENU_ITEMS.map((item) => (
              <AdminMenuCard
                key={item.href}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
