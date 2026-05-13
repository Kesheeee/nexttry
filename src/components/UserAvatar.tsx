"use client";

import { colorFor, initialsFor } from "@/lib/nspace/display";
import { cn } from "@/lib/cn";

/**
 * Renders either a user's photo (Google avatar) or initials in a colored circle.
 *
 * Photo is shown when:
 *   1. avatarUrl is set, AND
 *   2. usePhoto is not explicitly false (defaults to true)
 *
 * Otherwise renders initials with a deterministic pastel background.
 */
export function UserAvatar({
  userId,
  name,
  avatarUrl,
  avatarColor,
  usePhoto = true,
  size = 40,
  className,
}: {
  userId: string;
  name: string | null | undefined;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  usePhoto?: boolean;
  size?: number;
  className?: string;
}) {
  const showPhoto = usePhoto && !!avatarUrl;
  const bg = avatarColor || colorFor(userId);
  const initials = initialsFor(name);
  const fontSize = Math.max(10, Math.round(size * 0.34));

  if (showPhoto) {
    return (
      <span
        className={cn(
          "inline-block rounded-full overflow-hidden shrink-0",
          className
        )}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl!}
          alt={name || ""}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full shrink-0 font-semibold text-[var(--ink)] select-none",
        className
      )}
      style={{ width: size, height: size, background: bg, fontSize }}
    >
      {initials}
    </span>
  );
}
