"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import { getProxyUrl } from "@/lib/utils";

interface KidsWatchPlayerProps {
  title: string;
  src: string;
  poster: string;
}

export function KidsWatchPlayer({ title, src, poster }: KidsWatchPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  const safeSrc = getProxyUrl(src);
  const safePoster = getProxyUrl(poster);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("vjs-fluid"); // Make it responsive/fluid
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        playsinline: true,
        poster: safePoster,
        sources: [
          {
            src: safeSrc,
            type: "video/mp4",
          },
        ],
      }, () => {
        videojs.log("player is ready");
      }));
    } else {
      const player = playerRef.current;
      if (player) {
        player.autoplay(true);
        player.src({ src: safeSrc, type: "video/mp4" });
        player.poster(safePoster);
      }
    }
  }, [safeSrc, safePoster, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full h-full rounded-2xl overflow-hidden bg-black shadow-lg">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
}
