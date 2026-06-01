import Link from "next/link";
import { Home, Search, Star, User } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] px-6 py-3 flex justify-between items-center rounded-t-[32px]">
        <Link href="/" className="flex flex-col items-center gap-1 group">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary transition-all group-active:scale-95">
            <Home className="h-6 w-6 fill-primary/20" />
          </div>
          <span className="text-[10px] font-bold text-primary">Beranda</span>
        </Link>
        
        <button className="flex flex-col items-center gap-1 group text-muted-foreground hover:text-foreground">
          <div className="p-2 rounded-2xl transition-all group-active:scale-95">
            <Search className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium">Telusuri</span>
        </button>

        <button className="flex flex-col items-center gap-1 group text-muted-foreground hover:text-foreground">
          <div className="p-2 rounded-2xl transition-all group-active:scale-95">
            <Star className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium">Favorit</span>
        </button>

        <button className="flex flex-col items-center gap-1 group text-muted-foreground hover:text-foreground">
          <div className="p-2 rounded-2xl transition-all group-active:scale-95">
            <User className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>
    </nav>
  );
}
