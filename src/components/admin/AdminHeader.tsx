"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
}

export function AdminHeader({
  title,
  subtitle,
  showBack = false,
  backHref,
}: AdminHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 -ml-2 rounded-xl"
              onClick={() => (backHref ? router.push(backHref) : router.back())}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
