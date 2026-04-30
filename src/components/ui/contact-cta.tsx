"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b py-20 sm:py-28 md:py-32 px-5 sm:px-7"
      style={{ borderColor: "var(--line)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 0% 50%, rgba(91,75,224,0.08), transparent 70%), radial-gradient(50% 60% at 100% 50%, rgba(232,98,77,0.08), transparent 70%)",
        }}
      />
      <div className="relative max-w-[980px] mx-auto text-center">
        <div
          className="font-mono mb-5"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Wherever you are in life
        </div>
        <h2
          className="m-0"
          style={{
            fontSize: "clamp(44px, 6.2vw, 96px)",
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            fontWeight: 500,
            color: "var(--ink)",
            textWrap: "balance" as const,
          }}
        >
          Every stage. Every question.
          <br />
          Every <span style={{ color: "var(--coral)" }}>next step.</span>
        </h2>
        <p
          className="mx-auto"
          style={{
            margin: "26px auto 0",
            maxWidth: 560,
            fontSize: 17,
            color: "var(--ink-2)",
            lineHeight: 1.5,
          }}
        >
          Got a question? We&apos;d love to hear from you.
        </p>
        <div className="mt-9 inline-flex flex-wrap gap-3 justify-center">
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
            Find your next step <ArrowRight size={16} strokeWidth={2} />
          </a>
          <Link
            href="/about/contact"
            className="inline-flex items-center gap-2 font-medium"
            style={{
              padding: "16px 22px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: 15,
            }}
          >
            Contact the team
          </Link>
        </div>
      </div>
    </section>
  );
}
