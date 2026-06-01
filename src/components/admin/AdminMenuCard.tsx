import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminMenuCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function AdminMenuCard({
  title,
  description,
  href,
  icon: Icon,
}: AdminMenuCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/20 active:scale-[0.98] py-0 gap-0">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 leading-snug truncate">
              {description}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}
