"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, PlayCircle } from "lucide-react";

export function KidsHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white">
        {/* App Logo */}
        <div className="flex items-center gap-2">
          <PlayCircle className="h-7 w-7 text-primary fill-primary/20" />
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            Khalifah <span className="text-primary">Kids</span>
          </span>
        </div>

        {/* Parent Settings Button */}
        <button
          disabled={isLoggingOut}
          onClick={async () => {
            setIsLoggingOut(true);
            try {
              await fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin");
            } catch (err) {
              console.error("Logout failed:", err);
              router.push("/admin");
            }
          }}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95 disabled:opacity-50"
          aria-label="Parent Settings"
        >
          {isLoggingOut ? (
            <div className="h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Settings className="h-6 w-6" />
          )}
        </button>
      </header>
    </>
  );
}
