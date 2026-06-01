"use client";

// ===========================================
// Settings Page (Placeholder) — Khalifah TV
// ===========================================
// TODO: Connect to Supabase for persistent settings.

import { useState } from "react";
import { Settings2, Play, Palette, Info } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [autoplay, setAutoplay] = useState(true);
  const [theme, setTheme] = useState("system");

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Settings"
        subtitle="App preferences and configuration"
        showBack
        backHref="/admin"
      />

      <main className="flex-1 px-4 py-6 sm:px-6 space-y-4">
        {/* App Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5 text-primary" />
              App Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">App Name</span>
              <span className="text-sm font-semibold">Khalifah TV</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
          </CardContent>
        </Card>

        {/* Playback Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="h-5 w-5 text-primary" />
              Playback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="autoplay-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  Autoplay Next Video
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically play the next video in queue
                </p>
              </div>
              <Switch
                id="autoplay-toggle"
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(v) => v && setTheme(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground pt-4">
          Settings are currently using local state only.
          <br />
          Persistent settings will be connected later.
        </p>
      </main>
    </div>
  );
}
