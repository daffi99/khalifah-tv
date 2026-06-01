"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminVideoPlayer } from "./AdminVideoPlayer";

interface VideoPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  src: string;
  poster?: string;
}

export function VideoPreviewDialog({
  open,
  onOpenChange,
  title,
  src,
  poster,
}: VideoPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-base truncate pr-8">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <AdminVideoPlayer title={title} src={src} poster={poster} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
