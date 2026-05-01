"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Mic, Users, Play } from "lucide-react";
import { ACCENT_HEX } from "@/lib/site-data";

const ease = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    id: "ncall",
    step: "01",
    Icon: Sparkles,
    label: "nCall",
    tag: "START · AI MENTORSHIP",
    tagline: "Open the conversation.",
    desc: "Talk to an AI mentor anytime. It asks the questions a real mentor would.",
    cta: "Start with nCall",
    href: "/ncall",
    external: true,
    color: ACCENT_HEX.indigo,
  },
  {
    id: "podcast",
    step: "02",
    Icon: Mic,
    label: "The Fourth Relationship",
    tag: "LISTEN · PODCAST MENTORSHIP",
    tagline: "Hear how others did it.",
    desc: "Weekly stories about the mentors who change us. Beyond family, friends, and partners.",
    cta: "Listen now",
    href: "https://www.youtube.com/@the4threlationships",
    external: true,
    color: ACCENT_HEX.amber,
  },
  {
    id: "nspace",
    step: "03",
    Icon: Users,
    label: "nSpace",
    tag: "MEET · HUMAN MENTORSHIP",
    tagline: "Meet a real mentor.",
    desc: "Get matched with someone who's stood exactly where you're standing. Calls, messages, small groups.",
    cta: "Explore nSpace",
    href: "/nspace",
    external: false,
    color: ACCENT_HEX.teal,
  },
];

const mentors = [
  { name: "Priya R.", role: "PM at Stripe · ex-finance", match: "92%" },
  { name: "Marcus L.", role: "Designer · 3 career pivots", match: "88%" },
  { name: "Aisha N.", role: "Encore career coach", match: "84%" },
];

function NCallVisual() {
  return (
    <div
      className="flex flex-col gap-2.5"
      style={{
        padding: "16px 18px",
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 14,
        fontSize: 13,
        color: "var(--ink-2)",
        lineHeight: 1.45,
      }}
    >
      <div className="flex gap-2 items-start">
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: ACCENT_HEX.indigo.bg,
            color: ACCENT_HEX.indigo.fg,
          }}
        >
          <Sparkles size={12} strokeWidth={2} />
        </span>
        <span>What&apos;s the part of this decision you keep avoiding?</span>
      </div>
      <div
        className="self-end"
        style={{
          maxWidth: "80%",
          padding: "8px 12px",
          borderRadius: 12,
          background: "var(--ink)",
          color: "var(--bg)",
          fontSize: 13,
        }}
      >
        Honestly? Telling my parents.
      </div>
      <div className="flex gap-2 items-start">
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: ACCENT_HEX.indigo.bg,
            color: ACCENT_HEX.indigo.fg,
          }}
        >
          <Sparkles size={12} strokeWidth={2} />
        </span>
        <span>Let&apos;s start there. What do you think they&apos;re really afraid of?</span>
      </div>
    </div>
  );
}

function PodcastVisual() {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 14,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: ACCENT_HEX.amber.bg,
            color: ACCENT_HEX.amber.fg,
          }}
        >
          <Play size={18} strokeWidth={2} fill="currentColor" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate" style={{ fontSize: 13, color: "var(--ink)" }}>
            Ep. 14 — The stranger who hired me
          </div>
          <div className="mt-0.5" style={{ fontSize: 11, color: "var(--ink-3)" }}>
            32 min · Posted Tuesday
          </div>
        </div>
        <div className="font-mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
          00:00 / 32:14
        </div>
      </div>
      <div className="mt-3.5 flex items-center gap-[3px]" style={{ height: 28 }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="flex-1"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.7)) * 18 + Math.cos(i * 0.4) * 6}%`,
              background: i < 14 ? ACCENT_HEX.amber.fg : "var(--line)",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NSpaceVisual() {
  return (
    <div
      className="flex flex-col gap-2.5"
      style={{
        padding: "14px 18px",
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 14,
      }}
    >
      {mentors.map((m) => (
        <div
          key={m.name}
          className="flex items-center gap-3"
          style={{ padding: "8px 4px" }}
        >
          <span
            className="inline-flex items-center justify-center font-semibold"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: ACCENT_HEX.teal.bg,
              color: ACCENT_HEX.teal.fg,
              fontSize: 12,
            }}
          >
            {m.name
              .split(" ")
              .map((s) => s[0])
              .join("")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate" style={{ fontSize: 13, color: "var(--ink)" }}>
              {m.name}
            </div>
            <div className="truncate" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {m.role}
            </div>
          </div>
          <span
            className="font-mono font-semibold"
            style={{ fontSize: 11, color: ACCENT_HEX.teal.fg }}
          >
            {m.match}
          </span>
        </div>
      ))}
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  ncall: <NCallVisual />,
  podcast: <PodcastVisual />,
  nspace: <NSpaceVisual />,
};

export function WhatWeOffer() {
  return (
    <section
      id="products"
      className="border-b py-16 sm:py-24 px-5 sm:px-7"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between flex-wrap gap-6 mb-10 md:mb-14">
          <div className="max-w-[720px]">
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
              02 · The mentorship bridge
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
              Three ways
              <br />
              to find your <span style={{ color: "var(--coral)" }}>guide.</span>
            </h2>
            <p
              className="mt-5 max-w-[520px]"
              style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}
            >
              Three steps from a question to the right mentor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.article
              key={c.id}
              className="flex flex-col gap-5"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: 24,
                padding: 28,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
            >
              <header>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-flex items-center justify-center"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: c.color.bg,
                        color: c.color.fg,
                      }}
                    >
                      <c.Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ fontSize: 11, letterSpacing: "0.16em", color: c.color.fg }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <span
                    className="font-mono"
                    style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em" }}
                  >
                    {c.step}
                  </span>
                </div>
                <h3
                  className="m-0 font-semibold"
                  style={{ fontSize: 26, letterSpacing: "-0.02em", color: "var(--ink)" }}
                >
                  {c.label}
                </h3>
                <p
                  className="mt-2 font-medium"
                  style={{ fontSize: 15.5, lineHeight: 1.45, color: "var(--ink)" }}
                >
                  {c.tagline}
                </p>
              </header>

              <p className="m-0" style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
                {c.desc}
              </p>

              {visuals[c.id]}

              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="mt-auto inline-flex items-center gap-2 font-semibold"
                style={{ fontSize: 14, color: c.color.fg }}
              >
                {c.cta} <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
