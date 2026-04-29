"use client";

import Link from "next/link";

const cols: { h: string; links: { title: string; href: string; external?: boolean }[] }[] = [
  {
    h: "Explore",
    links: [
      { title: "nCall", href: "https://ncall-nexttry.com", external: true },
      { title: "Podcast", href: "/explore/podcast" },
      { title: "nSpace", href: "/explore/programs" },
    ],
  },
  {
    h: "Company",
    links: [
      { title: "Contact Us", href: "/about/contact" },
    ],
  },
  {
    h: "Social",
    links: [
      { title: "Instagram", href: "https://www.instagram.com/nexttry.hk", external: true },
      { title: "LinkedIn", href: "https://linkedin.com/company/nexttry", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="py-12 sm:py-14 px-5 sm:px-7"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="mx-auto grid items-start gap-8 sm:gap-9 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:[grid-template-columns:1.4fr_repeat(3,1fr)]"
        style={{ maxWidth: 1240 }}
      >
        <div>
          <img src="/logo.png" alt="NextTry" style={{ height: 36, width: "auto" }} />
          <p
            className="m-0 mt-3"
            style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 320 }}
          >
            Wherever you are in life — NextTry is here.
            <br />
            Every stage. Every question. Every next step.
          </p>
          <p className="mt-4" style={{ fontSize: 12, color: "var(--ink-3)" }}>
            © {new Date().getFullYear()} NextTry. All rights reserved.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div
              className="font-mono mb-3.5"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              {c.h}
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {c.links.map((l) => (
                <li key={l.title}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    style={{ fontSize: 14, color: "var(--ink-2)" }}
                    className="hover:text-foreground transition-colors"
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
