'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Compass, Calendar, User, Users, Settings, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/components/ui/language-context';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const topIcons = [
  { icon: Home, key: 'side.home', href: '/dashboard' },
  { icon: Compass, key: 'side.golnext', href: '/explore/golnext' },
  { icon: Users, key: 'side.connects', href: '/dashboard/connects' },
  { icon: Calendar, key: 'side.programs', href: '/explore/programs' },
];

const bottomIcons = [
  { icon: User, key: 'side.profile', href: '/dashboard/profile' },
  { icon: Settings, key: 'side.settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const topItems = topIcons.map(i => ({ ...i, label: t(i.key) }));
  const bottomItems = bottomIcons.map(i => ({ ...i, label: t(i.key) }));
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareHover, setShareHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dashboard/profile`
    : '/dashboard/profile';

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profileUrl]);

  if (!session?.user) return null;

  return (
    <aside
      style={{ width: collapsed ? 72 : 260, transition: 'width 0.3s ease' }}
      className="fixed left-0 top-16 bottom-0 z-30 border-r border-border bg-background flex flex-col"
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* User — hover to show Share */}
      <div
        className="p-4 border-b border-border relative"
        onMouseEnter={() => setShareHover(true)}
        onMouseLeave={() => setShareHover(false)}
      >
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt=""
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
          )}
          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          )}

          {/* Share button — appears on hover */}
          <AnimatePresence>
            {shareHover && !collapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setShowShare(true)}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Share profile"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowShare(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4"
            >
              <div className="rounded-3xl border border-border bg-background p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold tracking-tight">Share Profile</h3>
                  <button
                    onClick={() => setShowShare(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Copy the link below to share your profile.
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground truncate">
                    {profileUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main nav — below avatar */}
      <nav className="p-3 flex flex-col gap-1">
        {topItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} strokeWidth={1.5} />
              {!collapsed && (
                <span className="overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom nav — Profile + Settings */}
      <nav className="p-3 flex flex-col gap-1 border-t border-border">
        {bottomItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} strokeWidth={1.5} />
              {!collapsed && (
                <span className="overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
