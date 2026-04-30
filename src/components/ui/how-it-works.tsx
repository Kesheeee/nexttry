"use client";

import { Compass, Users, Flag } from "lucide-react";
import { ACCENT_HEX } from "@/lib/site-data";

const steps = [
  {
    n: "01",
    title: "Tell us where you are.",
    body: "Pick a stage or chat with nCall. We figure out what you're really wrestling with.",
    Icon: Compass,
    color: ACCENT_HEX.indigo,
  },
  {
    n: "02",
    title: "Meet your people.",
    body: "Get matched with mentors who've been exactly here. Hear stories from a chapter ahead.",
    Icon: Users,
    color: ACCENT_HEX.amber,
  },
  {
    n: "03",
    title: "Take your next step.",
    body: "Move forward with clarity. Come back when the next question shows up.",
    Icon: Flag,
    color: ACCENT_HEX.coral,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-b py-16 sm:py-24 px-5 sm:px-7"
      style={{
        borderColor: "var(--line)",
        background: "var(--paper)",
      }}
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-14 max-w-[720px]">
          <div
            className="font-mono inline-flex items-center gap-2.5 mb-4"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            <span style={{ width: 24, height: 1, background: "var(--ink-3)" }} />
            03 — How it works
          </div>
          <h2
            className="m-0"
            style={{
              fontSize: "clamp(36px, 4.6vw, 64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "var(--ink)",
              textWrap: "balance" as const,
            }}
          >
            <span style={{ color: "var(--coral)" }}>Three steps.</span>
            <br />
            One chapter at a time.
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 overflow-hidden"
          style={{
            border: "1px solid var(--line)",
            borderRadius: 24,
            background: "var(--bg)",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`flex flex-col gap-3.5 p-7 md:p-8 ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""}`}
              style={{
                borderColor: "var(--line)",
                minHeight: 200,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: s.color.bg,
                    color: s.color.fg,
                  }}
                >
                  <s.Icon size={18} strokeWidth={1.6} />
                </span>
                <span
                  className="font-mono font-medium"
                  style={{ fontSize: 11, color: s.color.fg, letterSpacing: "0.1em" }}
                >
                  {s.n}
                </span>
              </div>
              <h3
                className="font-semibold"
                style={{
                  margin: "auto 0 0",
                  fontSize: 24,
                  color: "var(--ink)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {s.title}
              </h3>
              <p className="m-0" style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
