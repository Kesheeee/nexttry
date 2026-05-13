export const PASTEL_COLORS = [
  "#FFE2C7",
  "#D7E5FF",
  "#FFD0E5",
  "#E2F0D7",
  "#FFF1B8",
  "#E5D7FF",
  "#D7FFEC",
  "#FFC7C7",
];

/**
 * Canonical user-name renderer. Prefers `first_name + last_name`
 * (the LinkedIn-style profile fields) so the displayed name is
 * always First + Last, falling back to `name` (legacy / OAuth-seeded)
 * and finally a sensible placeholder.
 */
export function displayName(
  user:
    | {
        first_name?: string | null;
        last_name?: string | null;
        name?: string | null;
      }
    | null
    | undefined,
  fallback: string = "Friend"
): string {
  if (!user) return fallback;
  const first = (user.first_name || "").trim();
  const last = (user.last_name || "").trim();
  const combined = [first, last].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  const fallbackName = (user.name || "").trim();
  return fallbackName || fallback;
}

export function initialsFor(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
}

export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
