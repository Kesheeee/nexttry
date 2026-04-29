"use client";

import { ArrowRight, Sparkles, Mic, Users } from "lucide-react";

const products = [
  { Icon: Sparkles, label: "nCall", desc: "Mentorship, on demand", color: "var(--indigo)" },
  { Icon: Mic, label: "The Fourth Relationship", desc: "Mentorship, in podcast form", color: "var(--amber)" },
  { Icon: Users, label: "nSpace", desc: "Mentorship, in community", color: "var(--teal)" },
];

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b"
      style={{
        paddingTop: 160,
        paddingBottom: 110,
        paddingInline: 28,
        borderColor: "var(--line)",
      }}
    >
      {/* Soft warm wash in the corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 12% 10%, rgba(232,98,77,0.10), transparent 70%), radial-gradient(50% 40% at 90% 0%, rgba(91,75,224,0.08), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1240px] mx-auto">
        {/* Eyebrow */}
        <div
          className="font-mono inline-flex items-center gap-2.5 mb-7"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          <span className="block" style={{ width: 24, height: 1, background: "var(--ink-3)" }} />
          A mentorship platform for every chapter of life
        </div>

        {/* Headline */}
        <h1
          className="m-0 max-w-[1100px]"
          style={{
            fontSize: "clamp(48px, 7.6vw, 116px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            color: "var(--ink)",
            textWrap: "balance" as const,
          }}
        >
          Your{" "}
          <span className="italic" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
            next step
          </span>
          ,
          <br />
          at every stage of life.
        </h1>

        {/* Subtitle */}
        <p
          className="mt-8 mb-0 max-w-[640px]"
          style={{
            fontSize: 19,
            lineHeight: 1.5,
            color: "var(--ink-2)",
            textWrap: "pretty" as const,
          }}
        >
          NextTry is a bridge to mentorship. Start a conversation with an AI mentor today,
          hear how others walked the same path, and — when you&apos;re ready — meet a real human
          who&apos;s stood exactly where you&apos;re standing.
        </p>

        {/* CTA row */}
        <div className="mt-11 flex flex-wrap items-center gap-4">
          <a
            href="#stages"
            className="inline-flex items-center gap-2.5 font-medium"
            style={{
              padding: "16px 26px",
              borderRadius: 999,
              background: "var(--ink)",
              color: "var(--bg)",
              fontSize: 15,
              boxShadow: "0 8px 24px -10px rgba(21,17,14,.45)",
            }}
          >
            Find your next step
            <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a
            href="#products"
            className="inline-flex items-center gap-2 font-medium"
            style={{
              padding: "16px 22px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--ink)",
              fontSize: 15,
            }}
          >
            See what we offer
          </a>
        </div>

        {/* Three product surfaces */}
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {products.map((p, i) => (
            <div
              key={p.label}
              className="flex items-center gap-3.5"
              style={{
                padding: "26px 24px",
                borderRight: i < products.length - 1 ? "1px solid var(--line)" : undefined,
              }}
            >
              <span
                className="inline-flex items-center justify-center shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--paper)",
                  color: p.color,
                  border: "1px solid var(--line)",
                }}
              >
                <p.Icon size={18} strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <div
                  className="font-semibold"
                  style={{ fontSize: 14, color: "var(--ink)" }}
                >
                  {p.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Hero };
