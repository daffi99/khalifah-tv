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
    // Detect standard iOS devices
    const isIOS = /iP(hone|od|ad)/i.test(ua);
    // Detect iPadOS 13+ which requests desktop site by default and poses as a Mac
    const isIPadOS = ua.includes("Macintosh") && window.navigator.maxTouchPoints !== undefined && window.navigator.maxTouchPoints > 1;
    
    // We will use the native player for all iPads/iPhones to guarantee the play button works
    if (isIOS || isIPadOS) {
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
