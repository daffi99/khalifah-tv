"use client";

import { useEffect, useState } from "react";
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
  
  const [isOldDevice, setIsOldDevice] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent || "";
    
    // iPads explicitly say "iPad" in old versions. 
    // In iPadOS 13+, they request desktop sites and claim to be a "Macintosh", 
    // but they are the only Macs with multi-touch screens (maxTouchPoints > 1).
    const isIPad = /iPad/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    
    // Force native HTML5 player ONLY on iPads due to their strict desktop-mode webkit rules.
    // iPhones and other devices can safely use the modern Video.js player.
    if (isIPad) {
      setIsOldDevice(true);
    }
  }, []);

  return (
    <div className="w-full h-full bg-white relative">
      {isOldDevice ? (
        <video 
          className="w-full h-full object-contain bg-black" 
          src={safeSrc} 
          poster={safePoster} 
          controls 
          playsInline
        />
      ) : (
        <Player.Provider>
          <MinimalVideoSkin poster={safePoster}>
            <Video src={safeSrc} playsInline autoPlay />
          </MinimalVideoSkin>
        </Player.Provider>
      )}
    </div>
  );
}
