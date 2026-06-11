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
    // Detect older iOS versions (iOS 13 and below) and older WebKit engines
    const isOldIOS = /iP(hone|od|ad).*OS (7|8|9|10|11|12|13)_/i.test(ua);
    const isOldWebKit = /AppleWebKit\/([1-5]\d\d|60[0-4])\.?/i.test(ua);
    
    // Also catch old Safari if needed, but the above covers most old iPads
    if (isOldIOS || isOldWebKit) {
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
