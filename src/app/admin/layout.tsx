// ===========================================
// Admin Layout — Khalifah TV
// ===========================================
// Wraps all /admin/* pages with a centered container
// and consistent padding for mobile-first design.
// TODO: Add admin authentication guard here.
// When auth is implemented, check session and redirect
// to login if not authenticated.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}
