"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, MapPin, MessageSquare, UserPlus, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { me, meetups, notifications } from "@/lib/mock";

const TABS = [
  { id: "moments", label: "Moments", href: "/nspace", icon: PencilLeaf },
  { id: "chat", label: "Chat", href: "/nspace/sessions", icon: MessageSquare },
  { id: "meetups", label: "Meetups", href: "/nspace/meetups", icon: MapPin },
  { id: "notifications", label: "Notifications", href: "/nspace/notifications", icon: Bell },
];

function PencilLeaf({ size = 16 }: { size?: number }) {
  return <Pencil size={size} />;
}

function isActive(href: string, pathname: string) {
  if (href === "/nspace")
    return pathname === "/nspace" || pathname.startsWith("/nspace/moments");
  return pathname.startsWith(href);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const incomingInvites = meetups.filter(
    (m) => m.status === "proposed" && m.inviteeId === me.id
  ).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left rail */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 px-5 py-6 sticky top-0 h-screen">
        <Link href="/nspace" className="mb-7 block">
          <span className="serif text-[28px] leading-none text-foreground">
            nSpace
          </span>
        </Link>

        <Link
          href="/nspace/moments/new"
          className="mb-4 px-4 py-2.5 rounded-2xl bg-[var(--ink)] text-[var(--cream)] flex items-center justify-between gap-2 hover:opacity-95"
        >
          <span className="inline-flex items-center gap-2 text-[14px] font-medium">
            <PencilLeaf size={14} />
            Share a moment
          </span>
          <span className="mono text-[10px] opacity-60">⌘N</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = isActive(t.href, pathname);
            const badgeCount =
              t.id === "notifications"
                ? unreadNotifs
                : t.id === "meetups"
                ? incomingInvites
                : 0;
            const showDot = t.id === "chat" && badgeCount === 0;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={cn(
                  "px-3 py-2 rounded-xl flex items-center gap-3 text-[14px] transition-colors relative",
                  active
                    ? "bg-card text-foreground"
                    : "text-[var(--mute)] hover:text-foreground hover:bg-[var(--paper)]/60"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[var(--flame)]" />
                )}
                <Icon size={16} />
                <span className="flex-1">{t.label}</span>
                {badgeCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--flame)] text-white grid place-items-center mono text-[10px] font-medium">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
                {showDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--flame)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/nspace/circle/find"
          className="mt-4 px-3 py-2 rounded-xl flex items-center gap-3 text-[14px] text-[var(--mute)] hover:text-foreground border border-border bg-card/40"
        >
          <UserPlus size={16} />
          Add a friend
        </Link>

        <div className="flex-1" />

        {/* Quiet-for card */}
        <div className="mb-4 p-4 rounded-2xl bg-[var(--paper)]/50">
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--mute)]">
            Quiet for
          </p>
          <p className="serif text-[20px] leading-tight text-foreground mt-0.5">
            3 days, 4 hours
          </p>
          <p className="text-[12px] text-[var(--mute)] mt-2 leading-relaxed">
            You haven&rsquo;t posted a moment lately. No pressure.
          </p>
        </div>

        {/* Profile chip */}
        <Link
          href="/nspace/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--paper)]/60"
        >
          <div
            className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-semibold shrink-0"
            style={{ background: me.avatarColor }}
          >
            {me.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">
              You
            </p>
            <p className="text-[11px] text-[var(--mute)] truncate">
              mission · 6 friends
            </p>
          </div>
          <Settings size={14} className="text-[var(--mute)]" />
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 px-6 md:px-10 py-7 pb-24">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-stretch z-30">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = isActive(t.href, pathname);
          return (
            <Link
              key={t.id}
              href={t.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 text-[10px] gap-1",
                active ? "text-[var(--flame)]" : "text-[var(--mute)]"
              )}
            >
              <Icon size={18} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
