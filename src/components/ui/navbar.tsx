"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X, Globe, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useLanguage } from "@/components/ui/language-context"

const NAV_ITEMS = [
  {
    label: "Explore",
    href: null,
    dropdown: [
      { label: "nCall",  href: "https://ncall-nexttry.com"  },
      { label: "Podcast",  href: "/explore/podcast"  },
      { label: "nSpace", href: "/explore/programs" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    dropdown: null,
  },
  {
    label: "Contact Us",
    href: "/about/contact",
    dropdown: null,
  },
]

const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: "easeIn" as const } },
}

function DropdownMenu({ items }: { items: { label: string; href: string }[] }) {
  return (
    <AnimatePresence>
      <motion.ul
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute top-full left-0 mt-3 min-w-[160px] z-50 flex flex-col gap-0.5"
      >
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="block text-sm font-bold tracking-wide px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </motion.ul>
    </AnimatePresence>
  )
}

export function Navbar({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { lang: currentLang, setLang: setAppLang, t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const [onDark, setOnDark] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 })
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function checkDark() {
      const stages = document.getElementById("life-stages")
      if (!stages) return
      const rect = stages.getBoundingClientRect()
      setOnDark(rect.top < 64 && rect.bottom > 64)
    }
    window.addEventListener("scroll", checkDark, { passive: true })
    return () => window.removeEventListener("scroll", checkDark)
  }, [])

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 1000)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <header ref={navRef} className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${onDark ? "text-white" : ""}`}>
      <div className="w-full px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className={`text-lg font-semibold hover:opacity-80 transition-all duration-300 ${onDark ? "text-white" : "text-foreground"}`}>
          NextTry
        </a>

        {/* Right side */}
        {session?.user ? (
          /* Logged in — welcome text + dropdown */
          <div className="relative" ref={navRef}>
            <button
              onClick={() => setOpenIndex(openIndex === 99 ? null : 99)}
              className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded-xl hover:bg-muted"
            >
              {session.user.image && (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
              )}
              <span>
                Welcome back, <span className="font-semibold text-foreground">{session.user.name?.split(" ")[0]}</span>
              </span>
              <motion.span
                animate={{ rotate: openIndex === 99 ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>

            <AnimatePresence>
              {openIndex === 99 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-background shadow-lg z-50 overflow-hidden"
                >
                  {/* Profile header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      {session.user.image && (
                        <img src={session.user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                      )}
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpenIndex(null)}
                      className="mt-3 block w-full text-center text-sm font-medium py-2 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      View profile
                    </Link>
                  </div>

                  {/* Account section */}
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Account</p>
                    <Link href="/dashboard" onClick={() => setOpenIndex(null)} className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">Dashboard</Link>
                    <Link href="/dashboard/settings" onClick={() => setOpenIndex(null)} className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">Settings & Privacy</Link>
                    <button onClick={() => setAppLang(currentLang === 'en' ? 'zh' : 'en')} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-between">
                      {t('nav.language')}
                      <span className="text-xs text-muted-foreground">{currentLang === 'en' ? 'EN' : '中文'}</span>
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : !minimal ? (
          /* Logged out — full nav */
          <div className="hidden md:flex items-center gap-16 ml-auto">

            {/* Nav items with sliding cursor */}
            <nav
              ref={navItemsRef}
              className="relative flex items-center gap-1"
              onMouseLeave={() => setCursor(pv => ({ ...pv, opacity: 0 }))}
            >
              <motion.div
                animate={cursor}
                className="absolute top-0 bottom-0 rounded-xl bg-primary/10 z-0 pointer-events-none"
              />

              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={(e) => {
                    cancelClose()
                    const container = navItemsRef.current
                    if (!container) return
                    const btn = e.currentTarget.querySelector('button')
                    if (!btn) return
                    const rect = btn.getBoundingClientRect()
                    const containerRect = container.getBoundingClientRect()
                    setCursor({ left: rect.left - containerRect.left, width: rect.width, opacity: 1 })
                    if (item.dropdown) setOpenIndex(i)
                  }}
                  onMouseLeave={() => {
                    if (item.dropdown) scheduleClose()
                  }}
                >
                  {item.href && !item.dropdown ? (
                    <Link
                      href={item.href}
                      className={`relative z-10 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-xl hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-xl transition-all duration-300 ${onDark ? "text-white" : "text-foreground"} ${
                        pathname === item.href ? "text-primary" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`relative z-10 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-xl hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-xl transition-all duration-300 ${onDark ? "text-white" : "text-foreground"} ${
                        item.dropdown && item.dropdown.some(d => pathname.startsWith(d.href))
                          ? "text-primary"
                          : ""
                      }`}
                      aria-expanded={item.dropdown ? openIndex === i : undefined}
                      aria-haspopup={item.dropdown ? "true" : undefined}
                      onClick={() => {
                        if (!item.dropdown) return
                        setOpenIndex(openIndex === i ? null : i)
                      }}
                    >
                      {item.label}
                      {item.dropdown && (
                        <motion.span
                          animate={{ rotate: openIndex === i ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </button>
                  )}

                  {item.dropdown && openIndex === i && (
                    <DropdownMenu items={item.dropdown} />
                  )}
                </div>
              ))}
            </nav>

            {/* Language + Log In */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAppLang(currentLang === 'en' ? 'zh' : 'en')}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg hover:text-primary hover:bg-primary/10 transition-all duration-300 ${onDark ? "text-white" : "text-foreground"}`}
              >
                <Globe className="w-4 h-4" />
                {currentLang === 'en' ? 'EN' : '中文'}
              </button>
            </div>

          </div>
        ) : null}

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
          >
            <nav className="px-4 py-3 flex flex-col gap-0.5">
              {NAV_ITEMS.map((item, i) => (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between text-sm font-medium px-3 py-3 rounded-xl text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      if (!item.dropdown) { setMobileOpen(false); return }
                      setMobileExpanded(mobileExpanded === i ? null : i)
                    }}
                  >
                    {item.label}
                    {item.dropdown && (
                      <motion.span
                        animate={{ rotate: mobileExpanded === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </button>

                  <AnimatePresence>
                    {item.dropdown && mobileExpanded === i && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden pl-3 border-l-2 border-primary/30 ml-3 mb-1"
                      >
                        {item.dropdown.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="block w-full text-left text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
