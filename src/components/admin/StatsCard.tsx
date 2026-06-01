import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  accentColor = "bg-primary/10 text-primary",
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden py-0 gap-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
