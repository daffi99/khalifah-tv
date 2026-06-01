"use client";

import { useState } from "react";
import { Settings, PlayCircle } from "lucide-react";
import { PinGateModal } from "./PinGateModal";

export function KidsHeader() {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

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
          onClick={() => setIsPinModalOpen(true)}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95"
          aria-label="Parent Settings"
        >
          <Settings className="h-6 w-6" />
        </button>
      </header>

      <PinGateModal 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)} 
      />
    </>
  );
}
