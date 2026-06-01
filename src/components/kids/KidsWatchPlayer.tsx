"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

interface KidsWatchPlayerProps {
  title: string;
  src: string;
  poster: string;
}

export function KidsWatchPlayer({ title, src, poster }: KidsWatchPlayerProps) {
  return (
    <MediaPlayer
      title={title}
      src={{ src, type: 'video/mp4' }}
      poster={poster}
      playsInline
      className="w-full h-full"
      autoPlay
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
