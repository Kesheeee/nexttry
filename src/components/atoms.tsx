"use client";

import { cn } from "@/lib/cn";

// ─── Eyebrow / mono label ─────────────────────────────────────────

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--mute)]",
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────

export function Card({
  children,
  className,
  padding = "p-5",
  onClick,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-2xl",
        padding,
        interactive && "cursor-pointer transition-colors hover:border-[var(--mute)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
  full = false,
  leading,
  trailing,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "flame" | "quiet" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  full?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  const sizes = {
    sm: "py-1.5 px-3.5 text-[13px]",
    md: "py-2.5 px-5 text-[14px]",
    lg: "py-3 px-6 text-[15px]",
  };
  const variants = {
    primary: "bg-[var(--ink)] text-[var(--cream)] border-transparent",
    flame: "bg-[var(--flame)] text-white border-transparent",
    quiet: "bg-transparent text-foreground border-border hover:bg-[var(--warm)]",
    ghost: "bg-transparent text-[var(--mute)] border-transparent hover:bg-[var(--warm)]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium border transition-colors",
        sizes[size],
        variants[variant],
        full && "w-full",
        disabled && "opacity-45 cursor-not-allowed",
        className
      )}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}

// ─── Surface header (italic display) ──────────────────────────────

export function SurfaceHeader({
  title,
  sub,
  right,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-6 mb-5 flex-wrap">
      <div>
        <h1 className="serif text-[44px] md:text-[52px] leading-none text-foreground">
          {title}
        </h1>
        {sub && (
          <p className="serif-roman mt-2 text-[16px] text-[var(--mute)] leading-relaxed max-w-[560px]">
            {sub}
          </p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}

// ─── Striped wash placeholder ─────────────────────────────────────

export function StripedWash({
  children,
  height = "h-44",
  caption,
  className,
}: {
  children?: React.ReactNode;
  height?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "striped-wash rounded-2xl flex items-center justify-center relative",
        height,
        className
      )}
    >
      {caption && (
        <span className="mono text-[11px] tracking-[0.05em] text-[var(--ink)]/60">
          {caption}
        </span>
      )}
      {children}
    </div>
  );
}

// ─── Empty (calm, never apologizes) ───────────────────────────────

export function Empty({
  headline,
  sub,
}: {
  headline: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-14 flex flex-col items-center text-center gap-2">
      <p className="serif text-[22px] leading-tight text-foreground max-w-sm">
        {headline}
      </p>
      {sub && <p className="text-sm text-[var(--mute)] max-w-sm leading-relaxed">{sub}</p>}
    </div>
  );
}
