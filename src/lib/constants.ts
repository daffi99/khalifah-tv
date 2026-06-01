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

// Dynamic categories are now fetched from Supabase.

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
    title: "Categories",
    description: "Manage dynamic video categories",
    href: "/admin/categories",
    icon: BookOpen,
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


