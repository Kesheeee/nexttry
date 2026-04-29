"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar({ minimal = false }: { minimal?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-200"
      style={{
        padding: "14px 28px",
        background: scrolled ? "rgba(246,242,237,0.82)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(21,17,14,0.06)" : "1px solid transparent",
      }}
    >
      <a href="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="NextTry"
          style={{ height: 28, width: "auto", display: "block" }}
        />
      </a>

      {!minimal && (
      <div className="hidden md:flex items-center gap-7">
        <a href="/#stages" className="px-1 py-2 hover:opacity-70 transition-opacity" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          Life stages
        </a>
        <a href="/#products" className="px-1 py-2 hover:opacity-70 transition-opacity" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          What we do
        </a>
        <a href="/#how" className="px-1 py-2 hover:opacity-70 transition-opacity" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          How it works
        </a>
        <Link href="/blog" className="px-1 py-2 hover:opacity-70 transition-opacity" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          Blog
        </Link>
        <Link href="/about/contact" className="px-1 py-2 hover:opacity-70 transition-opacity" style={{ fontSize: 14, color: "var(--ink-2)" }}>
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
      )}
    </nav>
  );
}
