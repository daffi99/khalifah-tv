"use client";

import { getProxyUrl } from "@/lib/utils";
import { createPlayer } from "@videojs/react";
import { MinimalVideoSkin, Video, videoFeatures } from "@videojs/react/video";
import "@videojs/react/video/minimal-skin.css";

const Player = createPlayer({ features: videoFeatures });

interface KidsWatchPlayerProps {
  title: string;
  src: string;
  poster: string;
}

export function KidsWatchPlayer({ title, src, poster }: KidsWatchPlayerProps) {
  const safeSrc = getProxyUrl(src);
  const safePoster = getProxyUrl(poster);

  return (
    <div className="w-full h-full bg-white">
      <Player.Provider>
        <MinimalVideoSkin poster={safePoster}>
          <Video src={safeSrc} playsInline autoPlay />
        </MinimalVideoSkin>
      </Player.Provider>
    </div>
  );
}
