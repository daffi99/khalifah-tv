// ===========================================
// Constants and configuration for Khalifah TV
// ===========================================

import {
  Upload,
  Film,
  Clock,
  Settings,
  Music,
  BookOpen,
  BookHeart,
  HandHeart,
  PawPrint,
  PlayCircle,
} from "lucide-react";

/**
 * Video category options for select inputs.
 */
export const CATEGORY_OPTIONS = [
  { value: "songs", label: "Songs", icon: Music },
  { value: "learning", label: "Learning", icon: BookOpen },
  { value: "stories", label: "Stories", icon: BookHeart },
  { value: "dua", label: "Du'a", icon: HandHeart },
  { value: "animals", label: "Animals", icon: PawPrint },
] as const;

/**
 * Video status options for select inputs.
 */
export const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "hidden", label: "Hidden" },
] as const;

/**
 * Admin dashboard menu items.
 */
export const ADMIN_MENU_ITEMS = [
  {
    title: "Upload Video",
    description: "Add a new video to Khalifah TV",
    href: "/admin/upload",
    icon: Upload,
  },
  {
    title: "Manage Videos",
    description: "View, edit, and organize your videos",
    href: "/admin/videos",
    icon: Film,
  },
  {
    title: "Screen Time",
    description: "Set daily limits and monitor usage",
    href: "/admin/screen-time",
    icon: Clock,
  },
  {
    title: "Settings",
    description: "App preferences and configuration",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Kids Homepage",
    description: "Go to the main kids interface",
    href: "/",
    icon: PlayCircle,
  },
] as const;

/**
 * Get category label from value.
 */
export function getCategoryLabel(value: string): string {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}
