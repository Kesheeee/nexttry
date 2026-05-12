"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Calendar,
  Check,
  X,
  MessageSquare,
  MapPin,
} from "lucide-react";
import {
  Card,
  Empty,
  Eyebrow,
  SurfaceHeader,
} from "@/components/atoms";
import { useToast } from "@/components/Toast";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/cn";
import { displayName, timeAgo } from "@/lib/nspace/display";
import type { ApiUser, NspaceEvent } from "@/lib/nspace/types";

type ApiMeetup = {
  id: string;
  status: "proposed" | "confirmed" | "declined" | "canceled";
  proposer_id: string;
  invitee_id: string;
  proposed_times: string[];
  chosen_time: string | null;
  note: string | null;
  responded_at: string | null;
  created_at: string;
  venue: {
    id: string;
    name: string;
    neighborhood: string;
    type: string;
    address: string | null;
    google_maps_url: string | null;
  } | null;
  proposer: ApiUser | null;
  invitee: ApiUser | null;
};

type Tab = "upcoming" | "past";

type Venue = {
  id: string;
  name: string;
  neighborhood: string;
  type: string;
  address: string | null;
  google_maps_url: string | null;
};

// One source of truth for status-pill colors — same map drives the
// upcoming/past list, the next-up card, and the invitations strip.
type MeetupStatus = ApiMeetup["status"];
const STATUS_STYLE: Record<MeetupStatus, { label: string; style: React.CSSProperties }> = {
  confirmed: {
    label: "CONFIRMED",
    style: {
      background: "color-mix(in srgb, var(--teal) 14%, transparent)",
      color: "var(--teal)",
    },
  },
  proposed: {
    label: "PROPOSED",
    style: {
      background: "color-mix(in srgb, var(--amber) 14%, transparent)",
      color: "var(--amber)",
    },
  },
  declined: {
    label: "DECLINED",
    style: {
      background: "color-mix(in srgb, var(--plum) 12%, transparent)",
      color: "var(--plum)",
    },
  },
  canceled: {
    label: "CANCELED",
    style: {
      background: "color-mix(in srgb, var(--plum) 10%, transparent)",
      color: "var(--plum)",
    },
  },
};

function priceFor(type: string): string {
  const t = type.toLowerCase();
  if (t === "coffee" || t === "walk" || t === "park") return "£";
  if (t === "lunch" || t === "casual") return "££";
  if (t === "dinner") return "£££";
  return "££";
}

function formatWeekday(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}
function formatMonthDayShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
function daysFromNow(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export default function MeetupsListPage() {
  const { push } = useToast();
  const [meId, setMeId] = useState<string | null>(null);
  const [meetups, setMeetups] = useState<ApiMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueFilter, setVenueFilter] = useState<string>("all");
  const [pickedTimes, setPickedTimes] = useState<Record<string, string>>({});

  // ── Hosted events ("This week") ──────────────────────────────
  const [hostedEvents, setHostedEvents] = useState<NspaceEvent[]>([]);
  const [rsvpBusyId, setRsvpBusyId] = useState<string | null>(null);

  async function refresh() {
    const [meRes, meetupsRes, venuesRes, eventsRes] = await Promise.all([
      fetch("/api/nspace/me").then((r) => r.json()),
      fetch("/api/nspace/meetups").then((r) => r.json()),
      fetch("/api/nspace/venues").then((r) => r.json()),
      fetch("/api/nspace/events").then((r) => r.json()),
    ]);
    setMeId(meRes?.data?.user_id || meRes?.data?.id || null);
    setMeetups((meetupsRes?.data as ApiMeetup[]) || []);
    setVenues((venuesRes?.data as Venue[]) || []);
    setHostedEvents((eventsRes?.data as NspaceEvent[]) || []);
  }

  async function refreshEvent(eventId: string) {
    const res = await fetch(`/api/nspace/events/${eventId}`).then((r) =>
      r.json()
    );
    if (res?.data) {
      setHostedEvents((prev) =>
        prev.map((e) => (e.id === eventId ? (res.data as NspaceEvent) : e))
      );
    }
  }

  useEffect(() => {
    setLoadError(null);
    refresh()
      .catch(() =>
        setLoadError("Couldn't load meetups. Check your connection.")
      )
      .finally(() => setLoading(false));
  }, []);

  // ── Buckets ──────────────────────────────────────────────────
  // `Date.now()` is captured INSIDE each memo, not in deps —
  // otherwise the memos invalidate on every render and the entire
  // derivation chain re-runs (upcoming → strip → scoredVenues …).

  // Invitations waiting on me, regardless of whether the proposed
  // times are still future. We surface them at the top so the
  // notification → meetups deep-link always lands on something.
  const incoming = useMemo(
    () =>
      meId
        ? meetups
            .filter(
              (m) => m.status === "proposed" && m.invitee_id === meId
            )
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
        : [],
    [meetups, meId]
  );

  const upcoming = useMemo(() => {
    const now = Date.now();
    return meetups
      .filter((m) => {
        // Confirmed: always upcoming if the chosen time is future.
        // Proposed: only show as upcoming if I'M the proposer
        // (i.e. waiting on the other side). Invitations to me
        // belong to the Incoming section above.
        if (m.status === "confirmed") {
          return m.chosen_time
            ? new Date(m.chosen_time).getTime() > now
            : false;
        }
        if (m.status === "proposed" && m.proposer_id === meId) {
          return (m.proposed_times || []).some(
            (t) => new Date(t).getTime() > now
          );
        }
        return false;
      })
      .map((m) => ({
        meetup: m,
        when:
          m.chosen_time ||
          (m.proposed_times || []).find(
            (t) => new Date(t).getTime() > now
          ) ||
          m.proposed_times?.[0] ||
          null,
      }))
      .filter((x) => x.when)
      .sort(
        (a, b) =>
          new Date(a.when!).getTime() - new Date(b.when!).getTime()
      );
  }, [meetups, meId]);

  const past = useMemo(() => {
    const now = Date.now();
    return meetups
      .filter(
        (m) =>
          m.status === "declined" ||
          m.status === "canceled" ||
          (m.status === "confirmed" &&
            m.chosen_time &&
            new Date(m.chosen_time).getTime() <= now)
      )
      .map((m) => ({
        meetup: m,
        when: m.chosen_time || m.created_at,
      }))
      .sort(
        (a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()
      );
  }, [meetups]);

  const next = upcoming[0];

  // ── Right-rail stats ─────────────────────────────────────────
  const stats = useMemo(() => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
    const inYear = meetups.filter(
      (m) => new Date(m.created_at).getTime() >= yearStart
    );
    const peopleSet = new Set<string>();
    const venueSet = new Set<string>();
    let canceled = 0;
    let count = 0;
    inYear.forEach((m) => {
      const otherId = m.proposer_id === meId ? m.invitee_id : m.proposer_id;
      peopleSet.add(otherId);
      if (m.venue?.id) venueSet.add(m.venue.id);
      if (m.status === "canceled" || m.status === "declined") canceled++;
      else count++;
    });
    return {
      meetups: count,
      people: peopleSet.size,
      places: venueSet.size,
      canceled,
    };
  }, [meetups, meId]);

  const mostOftenWith = useMemo(() => {
    const counts = new Map<
      string,
      { user: ApiUser | null; n: number }
    >();
    meetups.forEach((m) => {
      const other = m.proposer_id === meId ? m.invitee : m.proposer;
      const otherId = other?.id || (m.proposer_id === meId ? m.invitee_id : m.proposer_id);
      if (!otherId) return;
      const existing = counts.get(otherId);
      if (existing) existing.n += 1;
      else counts.set(otherId, { user: other, n: 1 });
    });
    return [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 4);
  }, [meetups, meId]);

  const nudge = useMemo(() => {
    // Friend with longest gap since last meetup. Also tally the most
    // common weekday across past meetups with that friend so the
    // body line can suggest "free most {day}s".
    const lastSeen = new Map<
      string,
      {
        user: ApiUser | null;
        lastIso: string;
        venue: string | null;
        dayCounts: number[];
      }
    >();
    meetups
      .filter((m) => m.status === "confirmed" && m.chosen_time)
      .forEach((m) => {
        const other = m.proposer_id === meId ? m.invitee : m.proposer;
        const otherId =
          other?.id || (m.proposer_id === meId ? m.invitee_id : m.proposer_id);
        if (!otherId) return;
        const dayIdx = new Date(m.chosen_time as string).getDay();
        const cur = lastSeen.get(otherId);
        if (!cur) {
          const dc = new Array(7).fill(0);
          dc[dayIdx] = 1;
          lastSeen.set(otherId, {
            user: other,
            lastIso: m.chosen_time as string,
            venue: m.venue?.name || null,
            dayCounts: dc,
          });
          return;
        }
        cur.dayCounts[dayIdx] = (cur.dayCounts[dayIdx] || 0) + 1;
        if (cur.lastIso < (m.chosen_time as string)) {
          cur.lastIso = m.chosen_time as string;
          cur.venue = m.venue?.name || cur.venue;
        }
      });
    const candidates = [...lastSeen.values()]
      .filter((x) => x.user)
      .sort((a, b) => a.lastIso.localeCompare(b.lastIso));
    const top = candidates[0];
    if (!top) return null;
    // Pick the modal weekday only if there's a real signal (≥2 meetups
    // on that day). Otherwise leave the suggestion line off.
    const maxIdx = top.dayCounts.reduce(
      (best, n, i, arr) => (n > arr[best] ? i : best),
      0
    );
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const freeDay =
      top.dayCounts[maxIdx] >= 2 ? days[maxIdx] : null;
    return { ...top, freeDay };
  }, [meetups, meId]);

  // ── Invitations I've sent ────────────────────────────────────
  // Surface the response state for outgoing meetups. We show the
  // 3 most recent by default; clicking "View history" expands to
  // show every invitation I've ever sent.
  const sentInvitesAll = useMemo(() => {
    if (!meId) return [];
    return meetups
      .filter((m) => m.proposer_id === meId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [meetups, meId]);
  const [showAllInvites, setShowAllInvites] = useState(false);
  const sentInvites = showAllInvites
    ? sentInvitesAll
    : sentInvitesAll.slice(0, 3);

  // ── Venues you both like ─────────────────────────────────────
  // Score each venue: 2 if I've met at it with the next-up friend,
  // 1 if it's appeared in any past meetup of mine, 0 otherwise.
  const nextUpFriendId = useMemo(() => {
    const first = upcoming[0]?.meetup;
    if (!first || !meId) return null;
    return first.proposer_id === meId ? first.invitee_id : first.proposer_id;
  }, [upcoming, meId]);

  const scoredVenues = useMemo(() => {
    const friendVenueIds = new Set<string>();
    const anyVenueIds = new Set<string>();
    meetups.forEach((m) => {
      if (!m.venue?.id) return;
      anyVenueIds.add(m.venue.id);
      if (
        nextUpFriendId &&
        (m.proposer_id === nextUpFriendId ||
          m.invitee_id === nextUpFriendId)
      ) {
        friendVenueIds.add(m.venue.id);
      }
    });
    return venues
      .map((v) => ({
        venue: v,
        score: friendVenueIds.has(v.id) ? 2 : anyVenueIds.has(v.id) ? 1 : 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [venues, meetups, nextUpFriendId]);

  const venueTypes = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => v.type && set.add(v.type.toLowerCase()));
    return ["all", ...[...set].sort()];
  }, [venues]);

  const filteredVenues = scoredVenues.filter((x) =>
    venueFilter === "all"
      ? true
      : x.venue.type?.toLowerCase() === venueFilter
  );

  // ── 14-day strip ─────────────────────────────────────────────
  const strip = useMemo(() => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const days: { iso: string; dayNum: number; weekday: string; hasMeetup: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(todayMidnight.getTime() + i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString();
      const dayNum = d.getDate();
      const weekday = d
        .toLocaleDateString("en-US", { weekday: "short" })
        .charAt(0);
      const hasMeetup = upcoming.some((u) => {
        if (!u.when) return false;
        const when = new Date(u.when);
        return (
          when.getDate() === d.getDate() &&
          when.getMonth() === d.getMonth() &&
          when.getFullYear() === d.getFullYear()
        );
      });
      days.push({ iso, dayNum, weekday, hasMeetup });
    }
    return days;
  }, [upcoming]);

  // ── Filters ──────────────────────────────────────────────────
  const types = useMemo(() => {
    const set = new Set<string>();
    meetups.forEach((m) => m.venue?.type && set.add(m.venue.type));
    return ["all", ...[...set].sort()];
  }, [meetups]);

  const filtered = (tab === "upcoming" ? upcoming : past).filter((x) =>
    typeFilter === "all" ? true : x.meetup.venue?.type === typeFilter
  );

  // ── Hosted event RSVP ────────────────────────────────────────
  async function rsvpEvent(eventId: string, status: "confirmed" | "canceled") {
    setRsvpBusyId(eventId);
    try {
      const res = await fetch(`/api/nspace/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error?.code === "EVENT_FULL") {
          push("This event is full.");
          await refreshEvent(eventId);
        } else {
          push(json?.error?.message || "Couldn't RSVP.");
        }
      } else {
        push(status === "confirmed" ? "You're going." : "RSVP canceled.");
        await refreshEvent(eventId);
      }
    } catch {
      push("Network error. Try again.");
    } finally {
      setRsvpBusyId(null);
    }
  }

  // ── Actions ──────────────────────────────────────────────────
  async function respond(
    meetupId: string,
    action: "accept" | "decline",
    chosenTime?: string
  ) {
    if (action === "accept" && !chosenTime) return;
    setBusyId(meetupId);
    try {
      const res = await fetch(`/api/nspace/meetups/${meetupId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "accept"
            ? { action, chosen_time: chosenTime }
            : { action }
        ),
      });
      const json = await res.json();
      if (!res.ok) {
        push(json?.error?.message || "Couldn't respond.");
      } else {
        push(action === "accept" ? "Confirmed." : "Declined kindly.");
        await refresh();
      }
    } catch {
      push("Network error. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function cancel(meetupId: string) {
    setBusyId(meetupId);
    try {
      const res = await fetch(`/api/nspace/meetups/${meetupId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        push("Meetup canceled.");
        await refresh();
      } else {
        const json = await res.json().catch(() => null);
        push(json?.error?.message || "Couldn't cancel.");
      }
    } catch {
      push("Network error. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 max-w-[1200px] mx-auto">
      <div className="min-w-0">
        <SurfaceHeader
          title="Meetups"
          right={
            <Link
              href="/nspace-app/meetups/plan/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--ink)] text-[var(--cream)] text-[12.5px] hover:opacity-95 transition-opacity"
            >
              <Plus size={13} /> Plan a meetup
            </Link>
          }
        />

        {loading ? (
          <ul className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <li key={i}>
                <Card padding="p-5" className="ns-skeleton h-32">
                  <span aria-hidden />
                </Card>
              </li>
            ))}
          </ul>
        ) : loadError ? (
          <Card padding="p-6" className="text-center">
            <p className="serif text-[18px] text-foreground">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setLoadError(null);
                refresh()
                  .catch(() => setLoadError("Still no luck. Try again later."))
                  .finally(() => setLoading(false));
              }}
              className="mt-4 mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--flame)] hover:underline"
            >
              Try again →
            </button>
          </Card>
        ) : meetups.length === 0 ? (
          <Card padding="p-0">
            <Empty
              headline="Nothing on the calendar."
              sub="A meetup begins as a small piece of text — a coffee chat, a walk, a small group."
            />
          </Card>
        ) : (
          <>
            {/* ── This week — NextTry-hosted events ── */}
            {hostedEvents.length > 0 && (
              <section className="mb-8">
                <Eyebrow>This week</Eyebrow>
                <div
                  className="mt-3 flex flex-nowrap gap-3 overflow-x-auto pb-2 -mx-1 px-1 touch-pan-x"
                  style={{ scrollbarWidth: "none" }}
                >
                  {hostedEvents.slice(0, 4).map((ev) => {
                    const series = ev.series;
                    const venue = series?.venue;
                    const locationLabel =
                      venue?.name ?? series?.location_text ?? "TBD";
                    const effectiveCapacity =
                      ev.capacity_override ?? series?.capacity ?? 0;
                    const isFull = ev.rsvp_count >= effectiveCapacity;
                    // your_rsvp is populated only on the single-event GET;
                    // after refreshEvent it will be present.
                    const going =
                      "your_rsvp" in ev &&
                      ev.your_rsvp?.status === "confirmed";
                    const busy = rsvpBusyId === ev.id;

                    return (
                      <div
                        key={ev.id}
                        className="snap-start shrink-0 w-[200px] rounded-2xl border border-border bg-card flex flex-col overflow-hidden"
                      >
                        {/* Date stack */}
                        <div className="px-4 pt-4 pb-2 flex items-start gap-3">
                          <div className="text-center shrink-0 w-10">
                            <p className="mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--coral,var(--flame))]">
                              {new Date(ev.starts_at).toLocaleDateString(
                                "en-US",
                                { weekday: "short" }
                              )}
                            </p>
                            <p
                              className="font-bold text-[28px] leading-none text-foreground mt-0.5"
                              style={{
                                fontFamily:
                                  '"Times New Roman MT", "Times New Roman", Times, serif',
                              }}
                            >
                              {new Date(ev.starts_at).getDate()}
                            </p>
                            <p className="mono text-[9px] uppercase tracking-[0.1em] text-[var(--mute)] mt-0.5">
                              {new Date(ev.starts_at).toLocaleDateString(
                                "en-US",
                                { month: "short" }
                              )}
                            </p>
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-[14px] font-semibold text-foreground leading-tight line-clamp-2">
                              {series?.title ?? "Event"}
                            </p>
                            <p className="mono text-[10px] uppercase tracking-[0.1em] text-[var(--mute)] mt-1 truncate">
                              {locationLabel}
                            </p>
                          </div>
                        </div>

                        {/* Capacity badge */}
                        <div className="px-4 pb-3">
                          <span
                            className={cn(
                              "mono text-[9.5px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full",
                              isFull
                                ? "bg-[color-mix(in_srgb,var(--plum)_12%,transparent)] text-[var(--plum)]"
                                : "bg-[color-mix(in_srgb,var(--teal)_12%,transparent)] text-[var(--teal)]"
                            )}
                          >
                            {isFull
                              ? "Full"
                              : `${ev.rsvp_count} / ${effectiveCapacity}`}
                          </span>
                        </div>

                        {/* RSVP button */}
                        <div className="mt-auto px-4 pb-4">
                          {going ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => rsvpEvent(ev.id, "canceled")}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-border text-[12px] text-foreground hover:text-[var(--flame)] hover:border-[var(--flame)] disabled:opacity-50 transition-colors"
                            >
                              Going · Tap to cancel
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy || isFull}
                              onClick={() => rsvpEvent(ev.id, "confirmed")}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[var(--ink)] text-[var(--cream)] text-[12px] hover:opacity-95 disabled:opacity-50 transition-opacity"
                            >
                              RSVP
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── From your circle ── */}
            <Eyebrow>From your circle</Eyebrow>

            {/* Incoming invitations — surfaced first so notifications
                always land on something actionable. Each card lets
                the invitee see the note, pick a time, accept, or
                decline. */}
            {incoming.length > 0 && (
              <section className="mb-7">
                <div className="mb-3 flex items-center gap-2">
                  <Eyebrow>Incoming</Eyebrow>
                  <span
                    className="mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        "color-mix(in srgb, var(--flame) 14%, transparent)",
                      color: "var(--flame)",
                    }}
                  >
                    {incoming.length} new
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {incoming.map((m) => (
                    <li key={m.id}>
                      <IncomingInviteCard
                        meetup={m}
                        picked={pickedTimes[m.id]}
                        busy={busyId === m.id}
                        onPick={(t) =>
                          setPickedTimes((prev) => ({ ...prev, [m.id]: t }))
                        }
                        onAccept={(t) => respond(m.id, "accept", t)}
                        onDecline={() => respond(m.id, "decline")}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {next && (
              <NextUpCard
                meetup={next.meetup}
                when={next.when!}
                meId={meId}
                busy={busyId === next.meetup.id}
                onConfirm={(time) => respond(next.meetup.id, "accept", time)}
                onCancel={() => cancel(next.meetup.id)}
              />
            )}

            {/* Invitations I've sent — status tracker */}
            {sentInvitesAll.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow>Invitations you sent</Eyebrow>
                  {sentInvitesAll.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllInvites((v) => !v)}
                      className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--mute)] hover:text-foreground transition-colors"
                    >
                      {showAllInvites
                        ? "Show recent"
                        : `View history (${sentInvitesAll.length}) →`}
                    </button>
                  )}
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {sentInvites.map((m) => {
                    const invitee = m.invitee;
                    const inviteeName = displayName(invitee, "Friend");
                    const firstName = inviteeName.split(" ")[0];
                    const when =
                      m.chosen_time ||
                      m.proposed_times?.[0] ||
                      m.created_at;
                    const statusStyle = STATUS_STYLE[m.status].style;
                    const { statusLabel, line } = (() => {
                      switch (m.status) {
                        case "confirmed":
                          return {
                            statusLabel: "Accepted",
                            line: `${firstName} accepted · ${formatWeekday(when)} ${formatTime(when)}`,
                          };
                        case "declined":
                          return {
                            statusLabel: "Declined",
                            line: `${firstName} couldn't make it`,
                          };
                        case "canceled":
                          return {
                            statusLabel: "Canceled",
                            line: "You canceled this one",
                          };
                        case "proposed":
                        default:
                          return {
                            statusLabel: "Awaiting",
                            line: `Waiting on ${firstName} · sent ${timeAgo(m.created_at)}`,
                          };
                      }
                    })();
                    return (
                      <li
                        key={m.id}
                        className="px-4 py-3 rounded-2xl border border-border bg-card flex items-center gap-3"
                      >
                        <UserAvatar
                          userId={invitee?.id || m.invitee_id}
                          name={invitee?.name}
                          avatarUrl={invitee?.avatar_url}
                          size={32}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-foreground truncate">
                            {m.venue?.name || "Meetup"}{" "}
                            <span className="font-normal text-[var(--mute)]">
                              · {inviteeName}
                            </span>
                          </p>
                          <p className="text-[12px] text-[var(--mute)] mt-0.5 truncate">
                            {line}
                          </p>
                        </div>
                        <span
                          className="shrink-0 mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                          style={statusStyle}
                        >
                          {statusLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Venues you both like */}
            {filteredVenues.length > 0 && (
              <div className="mt-7">
                <Eyebrow>
                  {nextUpFriendId ? "Venues you both like" : "Venues you might like"}
                </Eyebrow>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {venueTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVenueFilter(t)}
                      className={cn(
                        "text-[12px] px-3 py-1 rounded-full transition-colors",
                        venueFilter === t
                          ? "bg-[var(--ink)] text-[var(--cream)]"
                          : "border border-border text-foreground hover:bg-[var(--warm)]/40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div
                  onWheel={(e) => {
                    // Translate vertical wheel into horizontal scroll
                    // so a desktop mouse wheel / non-horizontal trackpad
                    // can drive the row.
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  onPointerDown={(e) => {
                    // Click-and-drag scroll for desktop without a
                    // horizontal axis. Skip when the press starts on a
                    // link/button so the children stay clickable.
                    const target = e.target as HTMLElement;
                    if (target.closest("a, button")) return;
                    const el = e.currentTarget;
                    const startX = e.pageX;
                    const startLeft = el.scrollLeft;
                    el.setPointerCapture(e.pointerId);
                    const move = (ev: PointerEvent) => {
                      el.scrollLeft = startLeft - (ev.pageX - startX);
                    };
                    const up = (ev: PointerEvent) => {
                      el.releasePointerCapture(ev.pointerId);
                      window.removeEventListener("pointermove", move);
                      window.removeEventListener("pointerup", up);
                    };
                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                  }}
                  className="mt-3 flex flex-nowrap items-stretch gap-3 overflow-x-auto pb-2 -mx-1 px-1 touch-pan-x cursor-grab active:cursor-grabbing select-none"
                  style={{
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorX: "contain",
                  }}
                >
                  {filteredVenues.map((row) => {
                    const v = row.venue;
                    return (
                      <div
                        key={v.id}
                        className="snap-start shrink-0 w-[220px] rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
                      >
                        <div className="relative h-[88px] striped-wash">
                          <span className="absolute top-2.5 left-2.5 mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full bg-card/90 text-[var(--ink)]">
                            {v.type}
                          </span>
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <p className="serif text-[16px] font-semibold leading-tight text-foreground">
                            {v.name}
                          </p>
                          <p className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--mute)] mt-1.5 inline-flex items-center gap-1">
                            <MapPin size={10} /> {v.neighborhood}
                          </p>
                          <p className="mono text-[10px] uppercase tracking-[0.1em] text-[var(--mute)] mt-1">
                            {priceFor(v.type)}
                          </p>
                          {v.address && (
                            <p className="text-[12px] text-[var(--mute)] mt-2 leading-snug line-clamp-2">
                              {v.address}
                            </p>
                          )}
                          <Link
                            href={`/nspace-app/meetups/plan/new?venue=${v.id}${
                              nextUpFriendId ? `&friend=${nextUpFriendId}` : ""
                            }`}
                            className="mt-auto pt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[12px] text-foreground hover:bg-[var(--warm)]/40 transition-colors"
                          >
                            <Plus size={11} /> Plan here
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 14-day strip */}
            <div className="mt-7">
              <Eyebrow>Next 14 days</Eyebrow>
              <div
                className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1"
                onWheel={(e) => {
                  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
                style={{
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {strip.map((d, idx) => {
                  const isToday = idx === 0;
                  // Today: dark filled tile. Meetup days: soft
                  // pastel-blue tile. Everything else: white card tile.
                  return (
                    <div
                      key={d.iso}
                      className={cn(
                        "shrink-0 flex flex-col items-center justify-center w-11 h-14 rounded-xl border",
                        isToday
                          ? "bg-[var(--ink)] text-[var(--cream)] border-transparent"
                          : d.hasMeetup
                            ? "text-foreground border-transparent"
                            : "bg-card text-foreground border-border"
                      )}
                      style={
                        d.hasMeetup && !isToday
                          ? { background: "#DFE4F5" }
                          : undefined
                      }
                    >
                      <span
                        className={cn(
                          "mono text-[10px] uppercase tracking-[0.04em] leading-none",
                          isToday
                            ? "text-[var(--cream)]/75"
                            : "text-[var(--mute)]"
                        )}
                      >
                        {d.weekday}
                      </span>
                      <span
                        className={cn(
                          "leading-none mt-1.5 text-[15px]",
                          isToday ? "font-bold" : "font-medium"
                        )}
                      >
                        {d.dayNum}
                      </span>
                      {d.hasMeetup && !isToday && (
                        <span className="w-1 h-1 rounded-full bg-[var(--ink)] mt-1.5" />
                      )}
                      {d.hasMeetup && isToday && (
                        <span className="w-1 h-1 rounded-full bg-[var(--cream)] mt-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs + filters */}
            <div className="mt-7 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setTab("upcoming")}
                  className={cn(
                    "text-[14.5px] pb-1 border-b-2 transition-colors",
                    tab === "upcoming"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-[var(--mute)] hover:text-foreground"
                  )}
                >
                  Upcoming · {upcoming.length}
                </button>
                <button
                  type="button"
                  onClick={() => setTab("past")}
                  className={cn(
                    "text-[14.5px] pb-1 border-b-2 transition-colors",
                    tab === "past"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-[var(--mute)] hover:text-foreground"
                  )}
                >
                  Past · {past.length}
                </button>
              </div>
              {types.length > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={cn(
                        "text-[12px] px-3 py-1 rounded-full transition-colors",
                        typeFilter === t
                          ? "bg-[var(--ink)] text-[var(--cream)]"
                          : "border border-border text-foreground hover:bg-[var(--warm)]/40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ul className="mt-4 flex flex-col gap-2.5">
              {filtered.map((x) => {
                const m = x.meetup;
                const other =
                  m.proposer_id === meId ? m.invitee : m.proposer;
                const isInviteeProposed =
                  m.status === "proposed" && m.invitee_id === meId;
                const isProposerProposed =
                  m.status === "proposed" && m.proposer_id === meId;
                const { label: statusLabel, style: statusStyle } =
                  STATUS_STYLE[m.status];
                return (
                  <li
                    key={m.id}
                    className={cn(
                      "px-4 py-4 rounded-2xl border border-border bg-card flex items-center gap-4",
                      tab === "past" && "opacity-80"
                    )}
                  >
                    {/* Date stack — coral month, bold day, mute weekday */}
                    <div className="shrink-0 w-12 text-center">
                      <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--coral,var(--flame))]">
                        {new Date(x.when!).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </p>
                      <p
                        className="font-bold text-[26px] leading-none mt-0.5 text-foreground"
                        style={{
                          fontFamily:
                            '"Times New Roman MT", "Times New Roman", Times, serif',
                        }}
                      >
                        {new Date(x.when!).getDate()}
                      </p>
                      <p className="mono text-[9px] uppercase tracking-[0.12em] text-[var(--mute)] mt-1">
                        {formatWeekday(x.when!).slice(0, 3)}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                          style={statusStyle}
                        >
                          {statusLabel}
                        </span>
                        <span className="text-[12px] text-[var(--mute)]">
                          {m.venue?.type
                            ? `${m.venue.type} · `
                            : ""}
                          {formatTime(x.when!)}
                        </span>
                      </div>
                      <p className="text-[16.5px] font-semibold text-foreground mt-1.5 leading-tight tracking-tight">
                        {m.venue?.name || "Meetup"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <UserAvatar
                          userId={other?.id || ""}
                          name={other?.name}
                          avatarUrl={other?.avatar_url}
                          size={20}
                        />
                        <span className="text-[12.5px] text-[var(--mute)] truncate">
                          {displayName(other, "Friend")}
                          {m.venue?.neighborhood
                            ? ` · ${m.venue.neighborhood}`
                            : ""}
                        </span>
                      </div>
                      {m.note && (
                        <p className="serif-roman italic text-[13px] leading-relaxed text-foreground/80 mt-2 pl-3 border-l-2 border-[var(--warm)]">
                          &ldquo;{m.note}&rdquo;
                          {isInviteeProposed && (
                            <span className="not-italic mono text-[10px] uppercase tracking-[0.12em] text-[var(--mute)] ml-2">
                              — {displayName(other, "Friend").split(" ")[0]}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isInviteeProposed ? (
                        <button
                          type="button"
                          onClick={() =>
                            respond(m.id, "accept", m.proposed_times[0])
                          }
                          disabled={busyId === m.id}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[var(--ink)] text-[var(--cream)] text-[12px] hover:opacity-95 disabled:opacity-50 transition-opacity"
                        >
                          Reply
                        </button>
                      ) : m.status === "confirmed" ? (
                        <a
                          href={makeIcsUrl(
                            m,
                            x.when!,
                            displayName(other, "Friend")
                          )}
                          download={`${m.venue?.name || "meetup"}.ics`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border text-[12px] text-foreground hover:bg-[var(--warm)]/40 transition-colors"
                        >
                          <Calendar size={11} /> Add to cal
                        </a>
                      ) : isProposerProposed ? (
                        <button
                          type="button"
                          onClick={() => cancel(m.id)}
                          disabled={busyId === m.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-[12px] text-[var(--mute)] hover:text-[var(--flame)] disabled:opacity-50 transition-colors"
                        >
                          <X size={11} /> Cancel
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <Card padding="p-6" className="text-center">
                  <p className="text-[14px] text-[var(--mute)]">
                    Nothing here{typeFilter !== "all" ? ` for ${typeFilter}` : ""}.
                  </p>
                </Card>
              )}
            </ul>
          </>
        )}
      </div>

      {/* Right rail */}
      {!loading && meetups.length > 0 && (
        <aside className="hidden xl:flex flex-col gap-4 sticky top-7 self-start">
          <Card padding="p-4">
            <Eyebrow>This year</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              <Stat n={stats.meetups} label="meetups" />
              <Stat n={stats.people} label="people" />
              <Stat n={stats.places} label="places" />
              <Stat n={stats.canceled} label="canceled" />
            </div>
          </Card>

          {mostOftenWith.length > 0 && (
            <Card padding="p-4">
              <Eyebrow>Most often with</Eyebrow>
              <ul className="mt-3 flex flex-col gap-2">
                {mostOftenWith.map((row) => (
                  <li
                    key={row.user?.id}
                    className="flex items-center gap-2.5"
                  >
                    <UserAvatar
                      userId={row.user?.id || ""}
                      name={row.user?.name}
                      avatarUrl={row.user?.avatar_url}
                      size={28}
                    />
                    <span className="flex-1 text-[13px] text-foreground truncate">
                      {displayName(row.user, "Friend")}
                    </span>
                    <span className="mono text-[10.5px] text-[var(--mute)]">
                      {row.n}×
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {nudge && (
            <div
              className="rounded-2xl border border-border p-4"
              style={{ background: "var(--warm)" }}
            >
              <Eyebrow>A small nudge</Eyebrow>
              <p
                className="font-bold text-[18px] leading-tight tracking-tight text-foreground mt-2.5"
                style={{
                  fontFamily:
                    '"Times New Roman MT", "Times New Roman", Times, serif',
                }}
              >
                Haven&rsquo;t seen{" "}
                {(displayName(nudge.user, "them").split(" ")[0]) || "them"} in{" "}
                {formatGap(nudge.lastIso)}.
              </p>
              <p className="text-[12.5px] text-[var(--ink)]/70 mt-2 leading-relaxed">
                Last meetup: {nudge.venue || "somewhere"},{" "}
                {new Date(nudge.lastIso).toLocaleDateString("en-US", {
                  month: "long",
                })}
                .
                {nudge.freeDay
                  ? ` They’re free most ${nudge.freeDay}s.`
                  : ""}
              </p>
              <Link
                href={`/nspace-app/meetups/plan/new?friend=${nudge.user?.id || ""}`}
                className="mt-3.5 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-full bg-[var(--ink)] text-[var(--cream)] text-[13px] font-medium hover:opacity-95 transition-opacity"
              >
                <Plus size={13} /> Suggest a time
              </Link>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p
        className="font-bold text-[28px] leading-none text-foreground"
        style={{
          fontFamily:
            '"Times New Roman MT", "Times New Roman", Times, serif',
        }}
      >
        {n}
      </p>
      <p className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--mute)] mt-1">
        {label}
      </p>
    </div>
  );
}

function formatGap(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"}`;
}

function NextUpCard({
  meetup,
  when,
  meId,
  busy,
  onConfirm,
  onCancel,
}: {
  meetup: ApiMeetup;
  when: string;
  meId: string | null;
  busy: boolean;
  onConfirm: (chosenTime: string) => void;
  onCancel: () => void;
}) {
  const other =
    meetup.proposer_id === meId ? meetup.invitee : meetup.proposer;
  const otherName = displayName(other, "Friend");
  const firstName = otherName.split(" ")[0];
  const isInviteePending =
    meetup.status === "proposed" && meetup.invitee_id === meId;
  const isProposerPending =
    meetup.status === "proposed" && meetup.proposer_id === meId;
  const days = daysFromNow(when);
  const subDays =
    days <= 0
      ? "today"
      : days === 1
        ? "tomorrow"
        : days <= 14
          ? `in ${days} days`
          : `${formatMonthDayShort(when)}`;

  return (
    <div className="mt-1 rounded-3xl border border-border bg-[var(--warm)]/50 p-5 md:p-6 grid grid-cols-1 md:[grid-template-columns:auto_1fr_auto] gap-5 md:gap-6 items-start">
      {/* Date stack */}
      <div className="text-center md:text-left">
        <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--mute)]">
          {formatWeekday(when)}
        </p>
        <p
          className="font-bold text-[44px] md:text-[56px] leading-none text-foreground mt-1"
          style={{
            fontFamily:
              '"Times New Roman MT", "Times New Roman", Times, serif',
          }}
        >
          {new Date(when).getDate()}
        </p>
        <p className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--mute)] mt-1">
          {new Date(when).toLocaleDateString("en-US", { month: "long" })}{" "}
          {formatTime(when)}
        </p>
      </div>

      {/* Middle */}
      <div className="min-w-0">
        <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--mute)]">
          Next up · {subDays}
        </p>
        <h2
          className="font-bold text-[28px] md:text-[34px] leading-tight tracking-tight text-foreground mt-1"
          style={{
            fontFamily:
              '"Times New Roman MT", "Times New Roman", Times, serif',
          }}
        >
          {meetup.venue?.name || "Meetup"}
        </h2>
        <div className="mt-2 flex items-center gap-3 flex-wrap text-[13px] text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UserAvatar
              userId={other?.id || ""}
              name={other?.name}
              avatarUrl={other?.avatar_url}
              size={22}
            />
            with {firstName}
          </span>
          {meetup.venue?.address && (
            <span className="inline-flex items-center gap-1 text-[var(--mute)]">
              <MapPin size={11} /> {meetup.venue.address}
            </span>
          )}
          {!meetup.venue?.address && meetup.venue?.neighborhood && (
            <span className="inline-flex items-center gap-1 text-[var(--mute)]">
              <MapPin size={11} /> {meetup.venue.neighborhood}
            </span>
          )}
        </div>
        {meetup.note && (
          <p className="mt-3 px-3 py-2 rounded-2xl bg-card border border-border text-[13px] leading-relaxed text-foreground">
            <span className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--mute)]">
              {firstName}:
            </span>{" "}
            <span>{meetup.note}</span>
          </p>
        )}
      </div>

      {/* Right column actions */}
      <div className="flex flex-col items-stretch md:items-end gap-2 md:min-w-[180px]">
        <span
          className="self-start md:self-end mono text-[9.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
          style={
            meetup.status === "confirmed"
              ? {
                  background:
                    "color-mix(in srgb, var(--teal) 16%, transparent)",
                  color: "var(--teal)",
                }
              : {
                  background:
                    "color-mix(in srgb, var(--amber) 14%, transparent)",
                  color: "var(--amber)",
                }
          }
        >
          {meetup.status === "confirmed" ? "Confirmed" : "Pending"}
        </span>
        {isInviteePending ? (
          <button
            type="button"
            onClick={() => onConfirm(meetup.proposed_times[0])}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[var(--ink)] text-[var(--cream)] text-[13px] hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            <Check size={13} /> Confirm
          </button>
        ) : null}
        <Link
          href={`/nspace-app/sessions/${other?.id || ""}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border text-[13px] text-foreground hover:bg-[var(--warm)]/40 transition-colors"
        >
          <MessageSquare size={13} /> Message {firstName}
        </Link>
        {(isInviteePending || isProposerPending || meetup.status === "confirmed") && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--mute)] hover:text-[var(--flame)] disabled:opacity-50 mt-1"
          >
            <X size={10} className="inline mr-1" /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function IncomingInviteCard({
  meetup,
  picked,
  busy,
  onPick,
  onAccept,
  onDecline,
}: {
  meetup: ApiMeetup;
  picked: string | undefined;
  busy: boolean;
  onPick: (iso: string) => void;
  onAccept: (iso: string) => void;
  onDecline: () => void;
}) {
  const proposer = meetup.proposer;
  const proposerName = displayName(proposer, "Someone");
  const firstName = proposerName.split(" ")[0];
  const times = meetup.proposed_times || [];

  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{
        background: "var(--card)",
        borderColor: "color-mix(in srgb, var(--flame) 30%, var(--border))",
      }}
    >
      {/* Header — proposer + venue */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
        <UserAvatar
          userId={proposer?.id || meetup.proposer_id}
          name={proposer?.name}
          avatarUrl={proposer?.avatar_url}
          size={44}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] text-foreground leading-tight">
            <span className="font-semibold">{proposerName}</span>{" "}
            <span className="text-[var(--mute)]">invited you</span>
          </p>
          {meetup.venue && (
            <p className="serif text-[18px] text-foreground mt-1.5 leading-tight">
              {meetup.venue.name}
            </p>
          )}
          {meetup.venue?.neighborhood && (
            <p className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--mute)] mt-1">
              {meetup.venue.neighborhood}
              {meetup.venue.type ? ` · ${meetup.venue.type}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Note */}
      {meetup.note && (
        <p className="px-5 pb-3 serif-roman italic text-[14px] leading-relaxed text-foreground/85">
          &ldquo;{meetup.note}&rdquo;
        </p>
      )}

      {/* Time picker */}
      {times.length > 0 && (
        <div className="px-5 pb-4">
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--mute)] mb-2.5">
            Times offered · pick one
          </p>
          <div className="flex flex-wrap gap-1.5">
            {times.map((iso) => {
              const active = picked === iso;
              const isPast = new Date(iso).getTime() < Date.now();
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => onPick(iso)}
                  className={cn(
                    "rounded-full border-2 px-3 py-1.5 text-[12.5px] inline-flex items-center gap-1.5 bg-card transition-colors"
                  )}
                  style={
                    active
                      ? {
                          borderColor: "var(--flame)",
                          color: "var(--flame)",
                        }
                      : {
                          borderColor: "var(--line)",
                          color: "var(--ink)",
                        }
                  }
                >
                  <span className="serif">{formatWeekday(iso)}</span>
                  <span
                    className="mono text-[10.5px] uppercase tracking-[0.06em]"
                    style={{
                      color: active ? "var(--flame)" : "var(--mute)",
                    }}
                  >
                    {formatTime(iso)}
                  </span>
                  {isPast && (
                    <span
                      className="mono text-[9px] uppercase tracking-[0.1em]"
                      style={{ color: "var(--mute)" }}
                    >
                      past
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action row — stacked full-width on mobile so all 3 buttons
          stay tappable without wrapping awkwardly. */}
      <div
        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <button
          type="button"
          onClick={() => picked && onAccept(picked)}
          disabled={!picked || busy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{
            background: "var(--ink)",
            color: "var(--cream)",
          }}
        >
          <Check size={13} /> Accept
        </button>
        <button
          type="button"
          onClick={onDecline}
          disabled={busy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] border border-border text-[var(--mute)] hover:text-[var(--flame)] disabled:opacity-50 transition-colors"
        >
          <X size={13} /> Decline
        </button>
        <span className="hidden sm:block sm:flex-1" />
        <Link
          href={`/nspace-app/sessions/${proposer?.id || meetup.proposer_id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] text-[var(--mute)] hover:text-foreground border border-border transition-colors"
        >
          <MessageSquare size={13} /> Message {firstName}
        </Link>
      </div>
    </div>
  );
}

function makeIcsUrl(
  meetup: ApiMeetup,
  when: string,
  otherName: string
): string {
  const start = new Date(when);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//nSpace//Meetups//EN",
    "BEGIN:VEVENT",
    `UID:${meetup.id}@nspace`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${meetup.venue?.name || "Meetup"} with ${otherName}`,
    meetup.venue?.address ? `LOCATION:${meetup.venue.address}` : "",
    meetup.note ? `DESCRIPTION:${meetup.note.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`;
}
