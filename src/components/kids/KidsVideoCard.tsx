import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { getProxyUrl } from "@/lib/utils";

interface KidsVideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration?: string | null;
  category: string;
  isDark?: boolean;
}

export function KidsVideoCard({ id, title, thumbnailUrl, duration, category, isDark = false }: KidsVideoCardProps) {
  const safeThumbnailUrl = getProxyUrl(thumbnailUrl);

  return (
    <Link href={`/watch/${id}`} className="block">
      <div className={`${isDark ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-white hover:shadow-md'} sm:rounded-3xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-300`}>
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full bg-slate-100">
          <Image
            src={safeThumbnailUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
              {duration}
            </div>
          )}

          {/* Play Icon Overlay (Optional, adds to the fun vibe) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
            <div className="bg-white/90 text-primary p-3 rounded-full shadow-lg backdrop-blur-md">
              <Play className="h-8 w-8 fill-primary ml-1" />
            </div>
          </div>
        </div>

        {/* Info Container */}
        <div className="p-4 flex gap-3 items-start">
          {/* Channel/Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex-shrink-0 border-2 border-white/20 shadow-sm flex items-center justify-center text-white font-bold text-xs">
            KT
          </div>
          
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className={`font-bold text-base leading-tight line-clamp-2 mb-1 ${isDark ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h3>
            <p className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
              <span>Khalifah TV</span>
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/30' : 'bg-muted-foreground/40'}`} />
              <span className="text-primary/80">{category}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
