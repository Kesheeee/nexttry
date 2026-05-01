"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export function Navbar({ minimal = false }: { minimal?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when window grows past mobile breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-200 px-5 md:px-7"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          background:
            scrolled || mobileOpen ? "rgba(246,242,237,0.92)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "saturate(140%) blur(14px)" : "none",
          WebkitBackdropFilter: scrolled || mobileOpen ? "saturate(140%) blur(14px)" : "none",
          borderBottom:
            scrolled || mobileOpen
              ? "1px solid rgba(21,17,14,0.06)"
              : "1px solid transparent",
        }}
      >
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="NextTry"
            style={{ height: 24, width: "auto", display: "block" }}
          />
        </a>

        {!minimal && (
          <>
            <div className="hidden md:flex items-center gap-7">
              <a
                href="/#stages"
                className="px-1 py-2 hover:opacity-70 transition-opacity"
                style={{ fontSize: 14, color: "var(--ink-2)" }}
              >
                Life stages
              </a>
              <a
                href="/#products"
                className="px-1 py-2 hover:opacity-70 transition-opacity"
                style={{ fontSize: 14, color: "var(--ink-2)" }}
              >
                What we do
              </a>
              <a
                href="/#how"
                className="px-1 py-2 hover:opacity-70 transition-opacity"
                style={{ fontSize: 14, color: "var(--ink-2)" }}
              >
                How it works
              </a>
              <Link
                href="/blog"
                className="px-1 py-2 hover:opacity-70 transition-opacity"
                style={{ fontSize: 14, color: "var(--ink-2)" }}
              >
                Blog
              </Link>
              <Link
                href="/about/contact"
                className="px-1 py-2 hover:opacity-70 transition-opacity"
                style={{ fontSize: 14, color: "var(--ink-2)" }}
              >
                Contact Us
              </Link>

              <a
                href="/#stages"
                className="inline-flex items-center gap-1.5 font-medium hover:opacity-90 transition-opacity"
                style={{
                  padding: "9px 16px",
                  borderRadius: 999,
                  background: "var(--ink)",
                  color: "var(--bg)",
                  fontSize: 13,
                }}
              >
                Find your stage <ArrowRight size={14} strokeWidth={2} />
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: "var(--paper)",
                color: "var(--ink)",
              }}
            >
              {mobileOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {!minimal && mobileOpen && (
        <div
          className="fixed left-0 right-0 z-40 md:hidden flex flex-col"
          style={{
            top: 64,
            bottom: 0,
            background: "var(--bg)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div className="flex flex-col px-5 pt-6 pb-8 gap-1">
            <a
              href="/#stages"
              onClick={closeMobile}
              className="py-3 border-b"
              style={{ fontSize: 18, color: "var(--ink)", borderColor: "var(--line)" }}
            >
              Life stages
            </a>
            <a
              href="/#products"
              onClick={closeMobile}
              className="py-3 border-b"
              style={{ fontSize: 18, color: "var(--ink)", borderColor: "var(--line)" }}
            >
              What we do
            </a>
            <a
              href="/#how"
              onClick={closeMobile}
              className="py-3 border-b"
              style={{ fontSize: 18, color: "var(--ink)", borderColor: "var(--line)" }}
            >
              How it works
            </a>
            <Link
              href="/blog"
              onClick={closeMobile}
              className="py-3 border-b"
              style={{ fontSize: 18, color: "var(--ink)", borderColor: "var(--line)" }}
            >
              Blog
            </Link>
            <Link
              href="/about/contact"
              onClick={closeMobile}
              className="py-3"
              style={{ fontSize: 18, color: "var(--ink)" }}
            >
              Contact Us
            </Link>

            <a
              href="/#stages"
              onClick={closeMobile}
              className="mt-6 inline-flex items-center justify-center gap-2 font-medium"
              style={{
                padding: "16px 22px",
                borderRadius: 999,
                background: "var(--ink)",
                color: "var(--bg)",
                fontSize: 15,
              }}
            >
              Find your stage <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
