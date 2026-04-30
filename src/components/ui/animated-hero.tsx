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
      className="relative overflow-hidden border-b pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-28 px-5 sm:px-7"
      style={{ borderColor: "var(--line)" }}
    >
      {/* Warm wash in the corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 10% 5%, rgba(232,98,77,0.28), transparent 70%), radial-gradient(60% 55% at 95% 0%, rgba(91,75,224,0.22), transparent 70%), radial-gradient(80% 70% at 50% 110%, rgba(232,154,30,0.32), transparent 70%), radial-gradient(70% 50% at 20% 100%, rgba(232,98,77,0.22), transparent 70%), radial-gradient(70% 50% at 80% 100%, rgba(91,75,224,0.18), transparent 70%)",
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
            letterSpacing: "0",
            fontWeight: 500,
            color: "var(--ink)",
            textWrap: "balance" as const,
          }}
        >
          Your <span style={{ color: "var(--coral)" }}>next step</span>,
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
          A bridge to mentorship — through AI, podcast stories, and real human guides.
        </p>

        {/* CTA row */}
        <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
          <a
            href="#stages"
            className="inline-flex items-center justify-center sm:justify-start gap-2.5 font-medium"
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
            className="inline-flex items-center justify-center sm:justify-start gap-2 font-medium"
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
          className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {products.map((p, i) => {
            const isNotLast = i < products.length - 1;
            return (
            <div
              key={p.label}
              className={`flex items-center gap-3.5 py-5 px-1 md:px-6 md:py-7 ${isNotLast ? "border-b md:border-b-0 md:border-r" : ""}`}
              style={{
                borderColor: "var(--line)",
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { Hero };
