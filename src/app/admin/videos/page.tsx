"use client";

// ===========================================
// Manage Videos Page — Khalifah TV
// ===========================================

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  MoreVertical,
  Play,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import { getCategoryLabel } from "@/lib/constants";
import type { Video, VideoStatus } from "@/lib/types";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { VideoPreviewDialog } from "@/components/admin/VideoPreviewDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { LoadingState } from "@/components/admin/LoadingState";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterStatus = "all" | VideoStatus;

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "hidden", label: "Hidden" },
];

export default function ManageVideosPage() {
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Preview dialog state
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);

  // Delete dialog state
  const [deleteVideo, setDeleteVideo] = useState<Video | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data ?? []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      toast.error("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Filtered + searched videos
  const filteredVideos = useMemo(() => {
    let result = videos;
    if (filter !== "all") {
      result = result.filter((v) => v.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }
    return result;
  }, [videos, filter, search]);

  // --- Actions ---
  async function handleStatusChange(video: Video, newStatus: VideoStatus) {
    const { error } = await supabase
      .from("videos")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", video.id);

    if (error) {
      toast.error("Failed to update status.");
      return;
    }

    toast.success(
      `Video ${newStatus === "published" ? "published" : newStatus === "hidden" ? "hidden" : "updated"}.`
    );
    fetchVideos();
  }

  async function handleDelete() {
    if (!deleteVideo) return;
    setIsDeleting(true);

    try {
      // Delete from R2
      const keysToDelete = [deleteVideo.video_key, deleteVideo.thumbnail_key].filter(Boolean);
      if (keysToDelete.length > 0) {
        await fetch("/api/r2/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys: keysToDelete }),
        });
      }

      // Delete from Supabase
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", deleteVideo.id);

      if (error) throw error;

      toast.success("Video deleted.");
      setDeleteVideo(null);
      fetchVideos();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete video.");
    } finally {
      setIsDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Manage Videos"
        subtitle={`${videos.length} video${videos.length !== 1 ? "s" : ""}`}
        showBack
        backHref="/admin"
      />

      <main className="flex-1 px-4 py-4 sm:px-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Video List */}
        {loading ? (
          <LoadingState message="Loading videos…" />
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            title={search || filter !== "all" ? "No matching videos" : "No videos yet"}
            description={
              search || filter !== "all"
                ? "Try a different search or filter."
                : "Upload your first video to get started."
            }
            actionLabel={!search && filter === "all" ? "Upload Video" : undefined}
            onAction={
              !search && filter === "all"
                ? () => router.push("/admin/upload")
                : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden py-0 gap-0">
                <CardContent className="p-0">
                  <div className="flex gap-3 p-3">
                    {/* Thumbnail */}
                    <div
                      className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer group"
                      onClick={() => setPreviewVideo(video)}
                    >
                      {video.thumbnail_url ? (
                        <Image
                          src={video.thumbnail_url}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                      {/* Duration badge */}
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 font-medium"
                        >
                          {getCategoryLabel(video.category)}
                        </Badge>
                        <StatusBadge status={video.status} />
                      </div>
                      <div className="flex items-center gap-1 mt-auto text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(video.created_at)}
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setPreviewVideo(video)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/videos/${video.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {video.status !== "published" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(video, "published")
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {video.status !== "hidden" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(video, "hidden")
                            }
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteVideo(video)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Preview Dialog */}
      {previewVideo && (
        <VideoPreviewDialog
          open={!!previewVideo}
          onOpenChange={(open) => !open && setPreviewVideo(null)}
          title={previewVideo.title}
          src={previewVideo.video_url}
          poster={previewVideo.thumbnail_url}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteVideo && (
        <DeleteConfirmDialog
          open={!!deleteVideo}
          onOpenChange={(open) => !open && setDeleteVideo(null)}
          title={deleteVideo.title}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
