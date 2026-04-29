"use client";

import { useState } from "react";
import { ChevronRight, Quote, Check, Sparkles, Mic, Users } from "lucide-react";
import { STAGES, ACCENT_HEX, PRODUCTS, type ProductId } from "@/lib/site-data";

const productIcons: Record<"spark" | "mic" | "users", typeof Sparkles> = {
  spark: Sparkles,
  mic: Mic,
  users: Users,
};

function ProductPill({ id }: { id: ProductId }) {
  const p = PRODUCTS[id];
  const Icon = productIcons[p.icon];
  const accent = ACCENT_HEX[p.color];
  return (
    <a
      href={p.href}
      target={p.external ? "_blank" : undefined}
      rel={p.external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 transition-all duration-150 hover:opacity-80"
      style={{
        padding: "6px 12px 6px 8px",
        borderRadius: 999,
        background: "var(--paper)",
        border: "1px solid var(--line)",
        fontSize: 13,
        color: "var(--ink)",
      }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: accent.bg,
          color: accent.fg,
        }}
      >
        <Icon size={13} strokeWidth={2} />
      </span>
      {p.name}
    </a>
  );
}

export function InteractiveSelector() {
  const [active, setActive] = useState<string>("uni");
  const stage = STAGES.find((s) => s.id === active) ?? STAGES[1];
  const accent = ACCENT_HEX[stage.accent];

  return (
    <section
      id="stages"
      className="border-b"
      style={{
        borderColor: "var(--line)",
        background: "var(--paper)",
        paddingBlock: 110,
        paddingInline: 28,
      }}
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
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
              01 — Find your stage
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
              The questions change.
              <br />
              <span className="italic" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                The need for a guide doesn&apos;t.
              </span>
            </h2>
          </div>
          <p
            className="m-0 max-w-[360px]"
            style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55 }}
          >
            Pick the chapter you&apos;re in. We&apos;ll show you what people actually wrestle with there
            — and how NextTry helps.
          </p>
        </div>

        {/* Explorer split */}
        <div
          className="grid items-stretch"
          style={{
            gridTemplateColumns: "minmax(320px, 380px) 1fr",
            gap: 36,
          }}
        >
          {/* Left: stage list */}
          <div className="flex flex-col gap-2.5">
            {STAGES.map((s, i) => {
              const a = ACCENT_HEX[s.accent];
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className="text-left cursor-pointer transition-all duration-200"
                  style={{
                    border: `1px solid ${isActive ? a.fg : "var(--line)"}`,
                    background: isActive ? a.bg : "var(--bg)",
                    borderRadius: 18,
                    padding: "20px 22px",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    gap: 16,
                    color: "var(--ink)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      color: isActive ? a.fg : "var(--ink-3)",
                      width: 28,
                      textAlign: "center",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span>
                    <span
                      className="block font-semibold"
                      style={{ fontSize: 17, color: "var(--ink)" }}
                    >
                      {s.label}
                    </span>
                    <span className="block mt-0.5" style={{ fontSize: 13, color: "var(--ink-3)" }}>
                      {s.age}
                    </span>
                  </span>
                  <span
                    className="inline-flex items-center justify-center transition-all duration-200"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `1px solid ${isActive ? a.fg : "var(--line)"}`,
                      background: isActive ? a.fg : "transparent",
                      color: isActive ? "white" : a.fg,
                    }}
                  >
                    <ChevronRight size={14} strokeWidth={2.4} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: tailored content */}
          <div
            className="relative overflow-hidden flex flex-col"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 24,
              background: "var(--bg)",
              minHeight: 560,
            }}
          >
            {/* Image header */}
            <div
              className="relative"
              style={{
                height: 280,
                backgroundImage: `url(${stage.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(21,17,14,0.80) 0%, rgba(21,17,14,0.10) 60%, transparent 100%)",
                }}
              />
              <div
                className="absolute flex items-end justify-between gap-6"
                style={{ left: 32, right: 32, bottom: 26 }}
              >
                <div>
                  <div
                    className="font-mono mb-2.5"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {stage.label} · {stage.age}
                  </div>
                  <h3
                    className="m-0"
                    style={{
                      color: "white",
                      fontSize: "clamp(24px, 3vw, 40px)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                      fontWeight: 500,
                      maxWidth: 520,
                      textWrap: "balance" as const,
                    }}
                  >
                    {stage.headline}
                  </h3>
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 96,
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.18)",
                    fontWeight: 300,
                  }}
                >
                  0{STAGES.findIndex((s) => s.id === active) + 1}
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              className="grid flex-1"
              style={{
                padding: "32px 32px 36px",
                gridTemplateColumns: "1.1fr 1fr",
                gap: 36,
              }}
            >
              {/* Left column */}
              <div>
                <p
                  className="m-0"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.5,
                    color: "var(--ink-2)",
                    textWrap: "pretty" as const,
                  }}
                >
                  {stage.subtitle}
                </p>

                <div className="mt-7">
                  <div
                    className="font-mono mb-3.5"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: accent.fg,
                    }}
                  >
                    What people in this chapter ask
                  </div>
                  <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
                    {stage.questions.map((q, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3"
                        style={{
                          padding: "12px 14px",
                          background: "var(--paper)",
                          border: "1px solid var(--line)",
                          borderRadius: 12,
                          fontSize: 14.5,
                          lineHeight: 1.45,
                          color: "var(--ink)",
                        }}
                      >
                        <Quote
                          size={14}
                          style={{ color: accent.fg, flexShrink: 0, marginTop: 3 }}
                        />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">
                <div>
                  <div
                    className="font-mono mb-3.5"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    Who you&apos;ll meet
                  </div>
                  <div className="flex flex-col gap-2">
                    {stage.mentors.map((m) => (
                      <div
                        key={m}
                        className="flex items-center gap-2.5"
                        style={{ fontSize: 14, color: "var(--ink-2)" }}
                      >
                        <Check size={14} strokeWidth={2.4} style={{ color: accent.fg }} />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="font-mono mb-3"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    Where to start
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ProductPill id={stage.primaryProduct} />
                    {stage.secondary.map((id) => (
                      <ProductPill key={id} id={id} />
                    ))}
                  </div>
                </div>

                {/* Story card */}
                <figure
                  className="m-0 mt-auto"
                  style={{
                    padding: "18px",
                    background: accent.bg,
                    border: `1px solid ${accent.ring}`,
                    borderRadius: 14,
                  }}
                >
                  <blockquote
                    className="m-0 font-serif italic"
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.5,
                      color: "var(--ink)",
                    }}
                  >
                    &ldquo;{stage.storyText}&rdquo;
                  </blockquote>
                  <figcaption
                    className="mt-2.5 font-medium"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      color: "var(--ink-2)",
                    }}
                  >
                    — {stage.storyName}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center" style={{ fontSize: 14, color: "var(--ink-3)" }}>
          Not sure which fits?{" "}
          <a
            href="#products"
            style={{
              color: "var(--ink)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Start with nCall — it&apos;ll help you figure it out
          </a>
          .
        </div>
      </div>
    </section>
  );
}
