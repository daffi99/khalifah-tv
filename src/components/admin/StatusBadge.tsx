import { Badge } from "@/components/ui/badge";
import { type VideoStatus } from "@/lib/types";

const statusConfig: Record<
  VideoStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100",
  },
  draft: {
    label: "Draft",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100",
  },
  hidden: {
    label: "Hidden",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 hover:bg-slate-100",
  },
};

interface StatusBadgeProps {
  status: VideoStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <Badge variant="secondary" className={`${config.className} font-medium text-xs`}>
      {config.label}
    </Badge>
  );
}
