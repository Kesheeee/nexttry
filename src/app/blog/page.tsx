"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";
import { ACCENT_HEX, type Accent } from "@/lib/site-data";
import { POSTS, CATEGORIES, CATEGORY_LABEL, type Category, type Post } from "@/lib/blog-data";

function Tag({ category, accent }: { category: string; accent: Accent }) {
  const a = ACCENT_HEX[accent];
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5"
      style={{
        fontSize: 10.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: a.fg,
        fontWeight: 500,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: a.fg }} />
      {CATEGORY_LABEL[category] || category}
    </span>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const a = ACCENT_HEX[post.accent];
  return (
    <a
      href="#"
      className="grid overflow-hidden grid-cols-1 md:[grid-template-columns:1.05fr_1fr]"
      style={{
        borderRadius: 28,
        border: "1px solid var(--line)",
        background: "var(--paper)",
      }}
    >
      <div
        className="relative"
        style={{
          backgroundImage: `url(${post.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 460,
        }}
      >
        <div
          className="absolute"
          style={{
            top: 24,
            left: 24,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(251,248,243,0.95)",
            border: `1px solid ${a.ring}`,
          }}
        >
          <Tag category={post.category} accent={post.accent} />
        </div>
      </div>
      <div
        className="flex flex-col justify-between p-6 md:p-12"
        style={{ gap: 28 }}
      >
        <div>
          <div
            className="font-mono mb-5 inline-flex items-center gap-1.5"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: a.fg,
            }}
          >
            <Star size={12} fill="currentColor" strokeWidth={0} />
            Featured story
          </div>
          <h2
            className="m-0"
            style={{
              fontSize: "clamp(28px, 3.2vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "var(--ink)",
              textWrap: "balance" as const,
            }}
          >
            {post.title}
          </h2>
          <p
            className="mt-5 m-0"
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--ink-2)",
              textWrap: "pretty" as const,
            }}
          >
            {post.excerpt}
          </p>
        </div>
        <div
          className="flex items-center justify-between gap-4"
          style={{ paddingTop: 24, borderTop: "1px solid var(--line)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center font-semibold"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: a.bg,
                color: a.fg,
                fontSize: 13,
              }}
            >
              {post.author
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div>
              <div className="font-semibold" style={{ fontSize: 14, color: "var(--ink)" }}>
                {post.author}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{post.role}</div>
            </div>
          </div>
          <div
            className="flex items-center gap-3"
            style={{ fontSize: 13, color: "var(--ink-3)" }}
          >
            <span>{post.date}</span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--ink-3)" }} />
            <span>{post.readTime}</span>
            <ArrowUpRight size={14} strokeWidth={2} style={{ color: "var(--ink)" }} />
          </div>
        </div>
      </div>
    </a>
  );
}

function PostCard({ post }: { post: Post }) {
  const a = ACCENT_HEX[post.accent];
  return (
    <a
      href="#"
      className="flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderRadius: 20,
        border: "1px solid var(--line)",
        background: "var(--paper)",
      }}
    >
      <div
        className="relative"
        style={{
          height: 220,
          backgroundImage: `url(${post.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="absolute"
          style={{
            top: 14,
            left: 14,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(251,248,243,0.95)",
            border: `1px solid ${a.ring}`,
          }}
        >
          <Tag category={post.category} accent={post.accent} />
        </div>
      </div>
      <div
        className="flex flex-col flex-1"
        style={{ padding: "22px 22px 24px", gap: 12 }}
      >
        <h3
          className="m-0 font-semibold"
          style={{
            fontSize: 20,
            lineHeight: 1.2,
            letterSpacing: "-0.018em",
            color: "var(--ink)",
            textWrap: "balance" as const,
          }}
        >
          {post.title}
        </h3>
        <p className="m-0" style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
          {post.excerpt}
        </p>
        <div
          className="mt-auto flex justify-between items-center"
          style={{
            paddingTop: 14,
            borderTop: "1px solid var(--line)",
            fontSize: 12,
            color: "var(--ink-3)",
          }}
        >
          <span className="font-medium" style={{ color: "var(--ink-2)" }}>
            {post.author}
          </span>
          <span>
            {post.date} · {post.readTime}
          </span>
        </div>
      </div>
    </a>
  );
}

function Newsletter() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingBlock: 90,
        paddingInline: 28,
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--paper)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 60% at 0% 50%, rgba(91,75,224,0.07), transparent 70%), radial-gradient(40% 60% at 100% 50%, rgba(232,154,30,0.07), transparent 70%)",
        }}
      />
      <div
        className="relative grid items-center mx-auto grid-cols-1 md:[grid-template-columns:1.1fr_1fr] gap-8 md:gap-12"
        style={{ maxWidth: 880 }}
      >
        <div>
          <div
            className="font-mono mb-3.5"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            Letters from NextTry
          </div>
          <h2
            className="m-0"
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 500,
              color: "var(--ink)",
              textWrap: "balance" as const,
            }}
          >
            One story a week.{" "}
            <span className="italic" style={{ fontFamily: "var(--font-display)" }}>
              No noise.
            </span>
          </h2>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-stretch"
          style={{
            gap: 8,
            background: "var(--bg)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: 6,
          }}
        >
          <input
            type="email"
            placeholder="you@somewhere.com"
            className="flex-1 outline-none bg-transparent"
            style={{
              border: "none",
              padding: "10px 16px",
              fontSize: 14,
              color: "var(--ink)",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-1.5 font-medium"
            style={{
              border: "none",
              padding: "10px 18px",
              borderRadius: 999,
              background: "var(--ink)",
              color: "var(--bg)",
              fontSize: 13,
            }}
          >
            Subscribe <ArrowRight size={14} strokeWidth={2} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default function BlogPage() {
  const [filter, setFilter] = useState<Category>("all");
  const featured = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);
  const filtered = filter === "all" ? rest : rest.filter((p) => p.category === filter);

  return (
    <>
      <style>{`
        .filter-chip:hover:not([data-active="true"]) {
          background: var(--bg-alt) !important;
          border-color: rgba(21,17,14,0.2) !important;
        }
      `}</style>
      <Navbar />

      {/* Header */}
      <section
        className="pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-14 px-5 sm:px-7"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div className="max-w-[1240px] mx-auto">
          <div
            className="font-mono inline-flex items-center gap-2.5 mb-5"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            <span style={{ width: 24, height: 1, background: "var(--ink-3)" }} />
            The NextTry blog
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between flex-wrap gap-8">
            <h1
              className="m-0"
              style={{
                fontSize: "clamp(48px, 6.4vw, 96px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                paddingBottom: "0.18em",
                fontWeight: 500,
                color: "var(--ink)",
                maxWidth: 900,
                textWrap: "balance" as const,
              }}
            >
              Stories from{" "}
              <span className="italic" style={{ fontFamily: "var(--font-display)" }}>
                every chapter.
              </span>
            </h1>
            <p
              className="m-0 max-w-[360px]"
              style={{ fontSize: 16, lineHeight: 1.5, color: "var(--ink-2)" }}
            >
              Essays, interviews, and notes from the team — for whichever stage you&apos;re
              standing in right now.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section style={{ paddingBlock: 56, paddingInline: 28 }}>
          <div className="max-w-[1240px] mx-auto">
            <FeaturedPost post={featured} />
          </div>
        </section>
      )}

      {/* Filter strip */}
      <section
        className="sticky"
        style={{
          paddingBlock: 24,
          paddingInline: 16,
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          top: 64,
          zIndex: 10,
          background: "rgba(246,242,237,0.92)",
          backdropFilter: "saturate(140%) blur(14px)",
          WebkitBackdropFilter: "saturate(140%) blur(14px)",
        }}
      >
        <div
          className="max-w-[1240px] mx-auto flex flex-wrap items-center gap-2"
        >
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginRight: 10,
            }}
          >
            Browse
          </span>
          {CATEGORIES.map((c) => {
            const a = c.color !== "ink" ? ACCENT_HEX[c.color as Accent] : null;
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                data-active={isActive}
                className="filter-chip cursor-pointer inline-flex items-center gap-2 transition-all duration-150"
                style={{
                  border: `1px solid ${isActive && a ? a.fg : isActive ? "var(--ink)" : "var(--line)"}`,
                  background: isActive && a ? a.bg : isActive ? "var(--ink)" : "var(--bg)",
                  color: isActive && a ? a.fg : isActive ? "var(--bg)" : "var(--ink-2)",
                  padding: "7px 12px 7px 10px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              >
                {c.num && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      color: isActive && a ? a.fg : "var(--ink-3)",
                      fontWeight: 500,
                    }}
                  >
                    {c.num}
                  </span>
                )}
                {a && !c.num && (
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: a.fg }} />
                )}
                <span>{c.label}</span>
                {c.age && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.04em",
                      color: isActive && a ? a.fg : "var(--ink-3)",
                      opacity: 0.85,
                    }}
                  >
                    · {c.age}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section style={{ paddingBlock: 56, paddingInline: 28, minHeight: 480 }}>
        <div className="max-w-[1240px] mx-auto">
          {filtered.length === 0 ? (
            <div
              className="text-center"
              style={{
                padding: "80px 0",
                color: "var(--ink-3)",
                fontSize: 15,
              }}
            >
              No stories in this category yet — check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
