"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Film } from "lucide-react";

interface AdminVideoPlayerProps {
  title: string;
  src: string;
  poster?: string;
}

export function AdminVideoPlayer({
  title,
  src,
  poster,
}: AdminVideoPlayerProps) {
  if (!src) {
    return (
      <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground border border-border">
        <Film className="h-10 w-10 opacity-40" />
        <p className="text-sm">No video source available</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black/90 relative group border border-border shadow-sm">
      <video
        controls
        playsInline
        poster={poster}
        src={src}
        className="w-full h-full object-contain"
        preload="metadata"
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <a 
          href={src} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs bg-black/80 backdrop-blur-md text-white font-medium px-3 py-1.5 rounded-lg hover:bg-black transition-colors shadow-sm border border-white/10"
        >
          Open Direct Link
        </a>
      </div>
    </div>
  );
}
