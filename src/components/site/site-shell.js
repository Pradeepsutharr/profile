import { ProfileCard } from "@/components/site/profile-card";
import { MobileNav, SiteHeader } from "@/components/site/site-chrome";
import { colorVariables } from "@/lib/theme-colors";

/**
 * Server shell: page content is not wrapped in a client boundary,
 * so LCP text/images paint without waiting on hydration.
 */
export function SiteShell({ profile, settings, children }) {
  return (
    <div
      id="site-shell"
      style={colorVariables(settings?.colors, "dark")}
      className="relative min-h-screen bg-[var(--shell)]"
    >
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <div className="aurora pointer-events-none fixed inset-0 -z-10" />
      <div className="dots pointer-events-none fixed inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="mx-auto flex flex-col gap-6 px-4 pb-24 pt-4 md:px-6 md:pt-6 lg:flex-row lg:items-start lg:pb-10">
        <ProfileCard profile={profile} />
        <div className="panel relative min-w-0 flex-1 overflow-hidden rounded-[2rem]">
          <SiteHeader settings={settings} />
          <main id="main-content" className="p-5 md:p-8" tabIndex={-1}>
            {children}
          </main>
          <footer className="flex flex-col justify-between gap-2 border-t px-5 py-5 text-xs text-muted-foreground md:flex-row md:px-8">
            <span>© 2026 {profile.name}. Crafted with care in Ahmedabad.</span>
            <a href={`mailto:${profile.email}`} className="hover:text-primary">
              {profile.email}
            </a>
          </footer>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
