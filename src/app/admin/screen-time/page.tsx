"use client";

// ===========================================
// Screen Time Page (Placeholder) — Khalifah TV
// ===========================================
// TODO: Connect to Supabase when implementing real screen time tracking.

import { useState } from "react";
import { Clock, Timer, TrendingUp } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ScreenTimePage() {
  const [enabled, setEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("30");

  // Placeholder data
  const todayMinutes = 12;
  const limitMinutes = parseInt(dailyLimit);
  const progressPercent = Math.min((todayMinutes / limitMinutes) * 100, 100);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Screen Time"
        subtitle="Set daily limits and monitor usage"
        showBack
        backHref="/admin"
      />

      <main className="flex-1 px-4 py-6 sm:px-6 space-y-4">
        {/* Enable Screen Time */}
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="screen-time-toggle" className="text-base font-semibold cursor-pointer">
                  Screen Time Limit
                </Label>
                <p className="text-sm text-muted-foreground">
                  Limit daily video watching
                </p>
              </div>
            </div>
            <Switch
              id="screen-time-toggle"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </CardContent>
        </Card>

        {/* Daily Limit Selector */}
        <Card className={enabled ? "" : "opacity-50 pointer-events-none"}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Timer className="h-5 w-5 text-primary" />
              Daily Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={dailyLimit} onValueChange={(v) => v && setDailyLimit(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Today's Watch Time */}
        <Card className={enabled ? "" : "opacity-50 pointer-events-none"}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Today&apos;s Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold tabular-nums">
                  {todayMinutes}
                </span>
                <span className="text-muted-foreground ml-1">min</span>
              </div>
              <p className="text-sm text-muted-foreground">
                of {dailyLimit} min limit
              </p>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {limitMinutes - todayMinutes > 0
                ? `${limitMinutes - todayMinutes} minutes remaining`
                : "Daily limit reached"}
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground pt-4">
          Screen time tracking is a placeholder and uses local state only.
          <br />
          Real tracking will be connected later.
        </p>
      </main>
    </div>
  );
}
