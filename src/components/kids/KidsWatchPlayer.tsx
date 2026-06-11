"use client";

import { getProxyUrl } from "@/lib/utils";

interface KidsWatchPlayerProps {
  title: string;
  src: string;
  poster: string;
}

export function KidsWatchPlayer({ title, src, poster }: KidsWatchPlayerProps) {
  const safeSrc = getProxyUrl(src);
  const safePoster = getProxyUrl(poster);

  return (
    <div className="w-full h-full bg-white relative">
      <video 
        className="w-full h-full object-contain bg-black" 
        src={safeSrc} 
        poster={safePoster} 
        controls 
        playsInline
      />
    </div>
  );
}
