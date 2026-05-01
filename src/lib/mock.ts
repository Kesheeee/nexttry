// Mock data for nSpace v1.1 MVP UI.
// Replace with real API calls / Supabase queries when wiring backend.

export type LifeStage =
  | "Career Transition"
  | "New Parent"
  | "Recent Grad"
  | "Mid-career"
  | "Empty Nester";

export type Connection = {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  initials: string;
  lifeStage: LifeStage;
  bio?: string;
  lastActive: string;
  /** Days since last active. Drives the activity dot + stale-teaser rule. */
  daysSinceActive: number;
  homeNeighborhood?: string;
  homeLat?: number;
  homeLng?: number;
  /** nSpace-overlay fields (live in nspace_user_state, not the NextTry profile) */
  currentChapter?: string;
  conversationTopics?: string[]; // hard cap at 3
  openTo?: string[];
  /** Latest moment id, for the teaser. Pull body via getMoment(id). */
  latestMomentId?: string;
  /** Days since the latest moment was posted. Used for the stale-teaser rule. */
  latestMomentDaysAgo?: number;
  /**
   * The user's own circle (their connections). Used for the WeChat-style
   * mutual-friend visibility rule on Moments reactions and comments.
   */
  connectedTo: string[];
};

export type MomentSection = {
  todaysPlan?: string;
  recentSatisfaction?: string;
  futureGoal?: string;
  favoriteBook?: string;
};

/** Allowed reactions. Order is the picker order. */
export const REACTIONS = ["❤️", "🫂", "💭", "🙌", "👀", "🌱", "🔥"] as const;
export type ReactionEmoji = (typeof REACTIONS)[number];

export const REACTION_LABELS: Record<ReactionEmoji, string> = {
  "❤️": "like",
  "🫂": "support",
  "💭": "thinking about this",
  "🙌": "cheering",
  "👀": "curious",
  "🌱": "growth",
  "🔥": "resonance",
};

export const QUICK_LIKE: ReactionEmoji = "❤️";

export type MomentReaction = {
  id: string;
  userId: string;
  emoji: ReactionEmoji;
};

export type MomentComment = {
  id: string;
  userId: string;
  body: string; // ≤ 200 chars
  postedAt: string;
};

export type Moment = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  postedAt: string;
  /** Real timestamp for the 15-minute edit window. */
  postedAtISO: string;
  /**
   * Legacy 4-prompt shape. Kept for older seed data. New posts use `note`.
   * A moment renders from `note` + `tag` if `note` is set, otherwise from `sections`.
   */
  sections: MomentSection;
  /** New shape: a single open note (≤280 chars). */
  note?: string;
  /** Optional list of user ids the author tagged (people they were with). */
  taggedUserIds?: string[];
  reactions: MomentReaction[];
  comments: MomentComment[];
  /** Optional photo + caption attached to the moment. */
  photoUrl?: string | null;
  photoCaption?: string;
};

// ─── Notifications ─────────────────────────────────────────────────

export type NotificationType =
  | "meetup_invite"
  | "meetup_accepted"
  | "meetup_declined"
  | "moment_reaction"
  | "moment_comment"
  | "moment_tag"
  | "voice_note"
  | "friend_request";

export type Notification = {
  id: string;
  type: NotificationType;
  actorId: string;
  /** Short summary line for the row. */
  body: string;
  /** Optional secondary line (italic quote / preview). */
  detail?: string;
  /** Relative time string, e.g. "2h ago". */
  createdAt: string;
  read: boolean;
  /** Where clicking the notification takes the user. */
  link: string;
};

export const notifications: Notification[] = [
  {
    id: "n-1",
    type: "meetup_invite",
    actorId: "u-alex",
    body: "Alex Rivera invited you to The Long Garden",
    detail: "Was thinking of a slow Saturday — bring tea?",
    createdAt: "2h ago",
    read: false,
    link: "/nspace/meetups",
  },
  {
    id: "n-2",
    type: "moment_reaction",
    actorId: "u-maya",
    body: "Maya Chen reacted 🌱 to your moment",
    createdAt: "4h ago",
    read: false,
    link: "/nspace/moments/m-self-1",
  },
  {
    id: "n-3",
    type: "moment_comment",
    actorId: "u-david",
    body: "David Park commented on your moment",
    detail: "What was the thought?",
    createdAt: "yesterday",
    read: false,
    link: "/nspace/moments/m-self-1",
  },
  {
    id: "n-4",
    type: "voice_note",
    actorId: "u-alex",
    body: "Alex Rivera sent you a voice note",
    createdAt: "yesterday",
    read: true,
    link: "/nspace/sessions/s-2",
  },
  {
    id: "n-5",
    type: "meetup_accepted",
    actorId: "u-maya",
    body: "Maya Chen accepted your meetup",
    detail: "Quiet Corner Café · Saturday 4pm",
    createdAt: "2 days ago",
    read: true,
    link: "/nspace/meetups",
  },
  {
    id: "n-6",
    type: "moment_tag",
    actorId: "u-jess",
    body: "Jess Okafor tagged you in a moment",
    createdAt: "3 days ago",
    read: true,
    link: "/nspace/moments/m-2",
  },
];

export const EDIT_WINDOW_MS = 15 * 60 * 1000;

export function canEditMoment(m: Moment, viewerId: string) {
  if (m.authorId !== viewerId) return false;
  return Date.now() - new Date(m.postedAtISO).getTime() < EDIT_WINDOW_MS;
}

export function editMinutesLeft(m: Moment) {
  const ms =
    EDIT_WINDOW_MS - (Date.now() - new Date(m.postedAtISO).getTime());
  return Math.max(0, Math.ceil(ms / 60000));
}

export type Message = {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
  meetupId?: string; // when set, message renders as an InvitationCard
  audioUrl?: string; // when set, message renders as a voice note
  audioDuration?: number; // seconds
};

export type SessionStatus = "active" | "ended";

export type Session = {
  id: string;
  counterpartId: string;
  counterpartName: string;
  counterpartInitials: string;
  counterpartColor: string;
  topic: string;
  status: SessionStatus;
  lastMessageAt: string;
  lastMessagePreview: string;
  messages: Message[];
};

export type VenueType =
  | "cafe"
  | "bookstore"
  | "bar"
  | "restaurant"
  | "library"
  | "garden"
  | "other";

export type NoiseLevel = "silent" | "quiet" | "moderate" | "lively";
export type PriceRange = "$" | "$$" | "$$$";

export type Venue = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  photos: string[];
  venueType: VenueType;
  vibeTags: string[];
  noiseLevel: NoiseLevel;
  priceRange: PriceRange;
  typicalHours: string;
  recommended: boolean;
  pastVisitorQuotes?: string[];
};

export type MeetupStatus =
  | "proposed"
  | "confirmed"
  | "declined"
  | "counter_proposed"
  | "cancelled"
  | "completed";

export type Meetup = {
  id: string;
  sessionId: string;
  proposerId: string;
  inviteeId: string;
  venueId: string;
  venueName: string;
  venueDescription: string;
  proposedTimes: string[];
  chosenTime: string | null;
  note: string | null;
  responseMessage: string | null;
  status: MeetupStatus;
  counterRound: number;
  reflectionUnlockedSelf: boolean;
};

/**
 * Self-state. The NextTry foundation fields (name, avatar, lifeStage, bio,
 * socialLinks) live in the existing NextTry profile schema and are read-only
 * from nSpace's perspective. The nSpace fields below live in nspace_user_state.
 */
export const me = {
  id: "u-self",
  name: "Steven Tsai",
  initials: "ST",
  avatarColor: "#E2DCFF",
  // NextTry foundation (read-only stub for the demo):
  lifeStage: "Mid-career" as LifeStage,
  bio: "Founder. Tea drinker. Long walks, short emails.",
  socialLinks: { x: "stevent", linkedin: "stevent" },
  // The user's circle. Used as the viewer's connection set for the
  // mutual-friend visibility rule on Moments.
  connectedTo: ["u-maya", "u-alex", "u-david", "u-jess", "u-noor"],
  // nSpace overlay (editable):
  homeNeighborhood: "Sheung Wan",
  homeLat: 22.286,
  homeLng: 114.149,
  currentChapter:
    "Building nSpace — the relationship layer of NextTry. Trying to make the messy human parts of the product feel calm.",
  conversationTopics: ["Founder mental health", "Slow product", "HK design"],
  openTo: ["1:1 chat", "Coffee meet-up", "Reading group"],
  // Private metrics. Framed gently in the UI.
  metrics: {
    reflectionsCompleted: 4,
    meetupsCompleted: 5,
    momentsPosted: 11,
    benefitsUnlocked: true,
  },
  /**
   * Pending AI-drafted chapter update. The system runs a weekly job that
   * summarizes the user's last 3 moments. The draft never auto-publishes —
   * the user reviews it on /nspace/profile and chooses Accept / Edit / Dismiss.
   */
  chapterDraft: {
    text:
      "Finalizing the nSpace MVP — quieter days, longer walks, and a clearer sense of which parts of NextTry are mine to build vs. delegate.",
    draftedAt: "2 days ago",
    status: "pending" as "pending" | "dismissed" | "none",
  },
};

export const connections: Connection[] = [
  {
    id: "u-maya",
    name: "Maya Chen",
    handle: "maya.c",
    avatarColor: "#FFD8C7",
    initials: "MC",
    lifeStage: "Career Transition",
    bio: "Product → design pivot. Tea, long walks.",
    lastActive: "2 hours ago",
    daysSinceActive: 0,
    homeNeighborhood: "Tai Hang",
    homeLat: 22.279,
    homeLng: 114.19,
    currentChapter:
      "Sitting with a job offer that looks great on paper and feels off in the body. Not in a hurry to decide.",
    conversationTopics: ["Career pivots", "Decision-making", "Tea"],
    openTo: ["1:1 chat", "Walks"],
    latestMomentId: "m-1",
    latestMomentDaysAgo: 0,
    connectedTo: ["u-self", "u-alex", "u-david", "u-sam"],
  },
  {
    id: "u-alex",
    name: "Alex Rivera",
    handle: "alex.r",
    avatarColor: "#D7E5FF",
    initials: "AR",
    lifeStage: "Mid-career",
    bio: "Engineering manager learning to slow down.",
    lastActive: "yesterday",
    daysSinceActive: 1,
    homeNeighborhood: "Kennedy Town",
    homeLat: 22.283,
    homeLng: 114.128,
    currentChapter:
      "Trying to lead with less urgency. Reading old patterns books and questioning every meeting.",
    conversationTopics: ["Engineering management", "Walking", "Pattern languages"],
    openTo: ["1:1 chat", "Coffee meet-up"],
    latestMomentId: "m-2",
    latestMomentDaysAgo: 1,
    connectedTo: ["u-self", "u-maya", "u-jess"],
  },
  {
    id: "u-david",
    name: "David Park",
    handle: "david.p",
    avatarColor: "#E2DCFF",
    initials: "DP",
    lifeStage: "Empty Nester",
    bio: "Reads more than he writes.",
    lastActive: "3 days ago",
    daysSinceActive: 3,
    currentChapter:
      "Friday walks have become the most important meeting on my calendar. Working out what comes next, slowly.",
    conversationTopics: ["Long walks", "Writing"],
    openTo: ["Walks"],
    latestMomentId: "m-3",
    latestMomentDaysAgo: 3,
    connectedTo: ["u-self", "u-maya", "u-noor"],
  },
  {
    id: "u-jess",
    name: "Jess Okafor",
    handle: "jess.o",
    avatarColor: "#FFE7B0",
    initials: "JO",
    lifeStage: "New Parent",
    bio: "Designer, mother, sleep-deprived optimist.",
    lastActive: "5 days ago",
    daysSinceActive: 5,
    currentChapter:
      "Three months in. Relearning how to design with very little time and a very loud copilot.",
    conversationTopics: ["Parenting + work", "Design systems"],
    openTo: ["1:1 chat"],
    latestMomentDaysAgo: 5,
    connectedTo: ["u-self", "u-alex"],
  },
  {
    id: "u-noor",
    name: "Noor Hassan",
    handle: "noor.h",
    avatarColor: "#C7F0DD",
    initials: "NH",
    lifeStage: "Recent Grad",
    bio: "First job, second city.",
    lastActive: "a week ago",
    daysSinceActive: 7,
    conversationTopics: ["First jobs", "New cities"],
    openTo: ["Coffee meet-up"],
    // No currentChapter yet — soft empty state in self view.
    latestMomentDaysAgo: 45, // stale: should hide moment teaser per spec
    connectedTo: ["u-self", "u-david"],
  },
];

export const pendingRequests: Connection[] = [
  {
    id: "u-sam",
    name: "Sam Bailey",
    handle: "sam.b",
    avatarColor: "#FFD0E5",
    initials: "SB",
    lifeStage: "Career Transition",
    bio: "Met at the Oct meetup.",
    lastActive: "today",
    daysSinceActive: 0,
    conversationTopics: ["Career pivots", "Founder life"],
    openTo: ["1:1 chat"],
    // Sam is in maya's circle but NOT in the user's — used to demo
    // the mutual-friend filter (Sam's reactions on Maya's moment are
    // visible to Maya, not to the user.)
    connectedTo: ["u-maya"],
  },
];

function isoHoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
function isoMinutesAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

export const moments: Moment[] = [
  // Fresh by-me moment — within the 15-minute edit window. Demonstrates
  // the journal view + edit affordance.
  {
    id: "m-self-1",
    authorId: "u-self",
    authorName: "Steven Tsai",
    authorInitials: "ST",
    authorColor: "#E2DCFF",
    postedAt: "5 minutes ago",
    postedAtISO: isoMinutesAgo(5),
    sections: {
      todaysPlan:
        "Shipping the Moments visibility rule. Calmer than I expected.",
      recentSatisfaction:
        "Closed the laptop at 7. Walked to the harbour. Didn't check email once.",
    },
    reactions: [],
    comments: [],
  },
  {
    id: "m-1",
    authorId: "u-maya",
    authorName: "Maya Chen",
    authorInitials: "MC",
    authorColor: "#FFD8C7",
    postedAt: "2 hours ago",
    postedAtISO: isoHoursAgo(2),
    photoUrl: "https://picsum.photos/seed/maya-kitchen/900/520",
    photoCaption: "kitchen table · morning light",
    sections: {
      todaysPlan:
        "Finalizing the job offer decision. Drafting a list of what I'd lose by leaving and what I'd gain by staying.",
      recentSatisfaction:
        "Said no to a meeting I didn't need to be in. Tiny win, big mood.",
      futureGoal:
        "Lead my first cross-functional design review by end of quarter.",
    },
    reactions: [
      // Visible to me (I'm connected to all of these):
      { id: "r-1", userId: "u-alex", emoji: "🫂" },
      { id: "r-2", userId: "u-david", emoji: "💭" },
      { id: "r-3", userId: "u-jess", emoji: "🌱" },
      // NOT visible to me — Sam is in Maya's circle, not mine. Maya sees this.
      { id: "r-4", userId: "u-sam", emoji: "🔥" },
    ],
    comments: [
      {
        id: "c-1",
        userId: "u-alex",
        body: "The fact that you're drafting the list IS the answer. Trust the body.",
        postedAt: "1 hour ago",
      },
      // NOT visible to me (Sam isn't in my circle). Maya sees it.
      {
        id: "c-2",
        userId: "u-sam",
        body: "Whichever way — I'd love to hear how it lands.",
        postedAt: "30 min ago",
      },
    ],
  },
  {
    id: "m-2",
    authorId: "u-alex",
    authorName: "Alex Rivera",
    authorInitials: "AR",
    authorColor: "#D7E5FF",
    postedAt: "yesterday",
    postedAtISO: isoHoursAgo(28),
    sections: {},
    note:
      "1:1s all morning. Walk between every one. Reading 'A Pattern Language' — slowly, on purpose.",
    taggedUserIds: ["u-maya"],
    reactions: [
      { id: "r-5", userId: "u-maya", emoji: "🌱" },
      { id: "r-6", userId: "u-self", emoji: "👀" },
    ],
    comments: [],
  },
  {
    id: "m-3",
    authorId: "u-david",
    authorName: "David Park",
    authorInitials: "DP",
    authorColor: "#E2DCFF",
    postedAt: "3 days ago",
    postedAtISO: isoHoursAgo(72),
    sections: {},
    note:
      "Friday walk, no podcast, no phone. Came home with one clear thought: write 500 words a week. Doesn't matter where.",
    taggedUserIds: ["u-self", "u-noor"],
    reactions: [
      { id: "r-7", userId: "u-maya", emoji: "🙌" },
      { id: "r-8", userId: "u-self", emoji: "🌱" },
    ],
    comments: [
      {
        id: "c-3",
        userId: "u-maya",
        body: "What was the thought?",
        postedAt: "2 days ago",
      },
    ],
  },
];

// ─── Mutual-friend visibility for Moments ──────────────────────────────

/**
 * The WeChat-style rule. A reaction or comment by `actorId` on `authorId`'s
 * moment is visible to `viewerId` if either:
 *   - viewer is the author (always sees everything), OR
 *   - viewer is connected to the actor.
 */
export function isInteractionVisibleTo(
  authorId: string,
  actorId: string,
  viewerId: string
): boolean {
  if (viewerId === authorId) return true;
  if (viewerId === actorId) return true;
  const viewer = getViewerLike(viewerId);
  if (!viewer) return false;
  return viewer.connectedTo.includes(actorId);
}

function getViewerLike(viewerId: string): { connectedTo: string[] } | null {
  if (viewerId === me.id) return { connectedTo: me.connectedTo };
  const c = connections.find((c) => c.id === viewerId);
  if (c) return { connectedTo: c.connectedTo };
  const p = pendingRequests.find((c) => c.id === viewerId);
  if (p) return { connectedTo: p.connectedTo };
  return null;
}

export function visibleReactions(m: Moment, viewerId: string) {
  return m.reactions.filter((r) =>
    isInteractionVisibleTo(m.authorId, r.userId, viewerId)
  );
}

export function visibleComments(m: Moment, viewerId: string) {
  return m.comments.filter((c) =>
    isInteractionVisibleTo(m.authorId, c.userId, viewerId)
  );
}

// Photos use picsum.photos with deterministic seeds — no API key, no auth.
// Replace with Supabase Storage URLs when shipping.
function pic(seed: string, n = 5): string[] {
  return Array.from(
    { length: n },
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/450`
  );
}

export const venues: Venue[] = [
  {
    id: "v-1",
    name: "Quiet Corner Café",
    description: "Tucked-away café with low music and large tables.",
    longDescription:
      "A neighbourhood café known for slow drip coffee, a corner table by the window, and a no-laptops-after-3pm rule. Best for one-on-one conversations that take their time.",
    neighborhood: "Mong Kok",
    address: "12B Soy St, Mong Kok",
    lat: 22.319,
    lng: 114.169,
    photos: pic("quietcorner"),
    venueType: "cafe",
    vibeTags: ["quiet", "cozy", "bright"],
    noiseLevel: "quiet",
    priceRange: "$$",
    typicalHours: "Mon–Fri 8am–10pm · Wknd 9am–11pm",
    recommended: true,
    pastVisitorQuotes: [
      "The kind of place where a long pause doesn't feel awkward.",
      "We came for an hour, stayed for three.",
    ],
  },
  {
    id: "v-2",
    name: "Library Annex",
    description: "Reading room with armchairs. No food, no laptops.",
    longDescription:
      "An old reading-room annex repurposed as a public quiet space. Worn leather chairs, a long oak table, and absolutely no Wi-Fi. The reset button you didn't know you needed.",
    neighborhood: "Central",
    address: "3F, 8 Ice House St, Central",
    lat: 22.281,
    lng: 114.156,
    photos: pic("libraryannex"),
    venueType: "library",
    vibeTags: ["silent", "cozy", "indoor"],
    noiseLevel: "silent",
    priceRange: "$",
    typicalHours: "Tue–Sun 11am–8pm · Closed Mon",
    recommended: true,
    pastVisitorQuotes: [
      "Felt like both of us exhaled the moment we sat down.",
    ],
  },
  {
    id: "v-3",
    name: "The Long Garden",
    description: "Community garden with benches under a willow.",
    longDescription:
      "A volunteer-run garden along the river, with three benches under a willow at the south end. Best mid-afternoon when the light is sideways and the cicadas have given up.",
    neighborhood: "Tai Hang",
    address: "Wun Sha St (south end), Tai Hang",
    lat: 22.279,
    lng: 114.191,
    photos: pic("longgarden"),
    venueType: "garden",
    vibeTags: ["outdoor", "quiet", "bright"],
    noiseLevel: "quiet",
    priceRange: "$",
    typicalHours: "Daily, sunrise to dusk",
    recommended: true,
  },
  {
    id: "v-4",
    name: "Old Pages Bookshop",
    description: "Secondhand bookstore with a back-room reading nook.",
    longDescription:
      "Two narrow rooms of secondhand books, an old armchair you can sit in for as long as you want, and a kettle that's always hot. The back room is where the real conversations happen.",
    neighborhood: "Sai Ying Pun",
    address: "44 Western St, Sai Ying Pun",
    lat: 22.286,
    lng: 114.145,
    photos: pic("oldpages"),
    venueType: "bookstore",
    vibeTags: ["cozy", "quiet", "indoor"],
    noiseLevel: "quiet",
    priceRange: "$",
    typicalHours: "Wed–Sun 12pm–8pm",
    recommended: false,
  },
  {
    id: "v-5",
    name: "Slow Bar Kowloon",
    description: "Listening bar — vinyl, low lighting, no shouting.",
    longDescription:
      "A late-evening listening bar in Yau Ma Tei. Tube amps, vinyl, and a strict please-keep-it-down policy. Surprisingly good for serious conversations after dark.",
    neighborhood: "Yau Ma Tei",
    address: "1F, 9 Reclamation St, Yau Ma Tei",
    lat: 22.313,
    lng: 114.169,
    photos: pic("slowbar"),
    venueType: "bar",
    vibeTags: ["late-night", "cozy"],
    noiseLevel: "moderate",
    priceRange: "$$$",
    typicalHours: "Wed–Sat 7pm–1am",
    recommended: false,
  },
  {
    id: "v-6",
    name: "North Pier Bench",
    description: "Public bench on the harbour. Free, always open.",
    longDescription:
      "Not a venue exactly. A bench at the end of North Pier with a view of the harbour. Free, always open, never crowded after 9pm. Bring your own coffee.",
    neighborhood: "North Point",
    address: "North Point Pier",
    lat: 22.293,
    lng: 114.196,
    photos: pic("northpier"),
    venueType: "other",
    vibeTags: ["outdoor", "quiet", "late-night"],
    noiseLevel: "moderate",
    priceRange: "$",
    typicalHours: "24/7",
    recommended: false,
  },
];

// All venues sorted by midpoint between Steven (Sheung Wan) and Maya (Tai Hang).
// In real impl this is server-computed; here it's a pre-baked order.
export const venueOrderByMidpoint = ["v-1", "v-2", "v-4", "v-3", "v-5", "v-6"];

export function midpointFor(a: Connection | typeof me, b: Connection): {
  lat: number;
  lng: number;
  neighborhood: string;
} | null {
  if (!a.homeLat || !a.homeLng || !b.homeLat || !b.homeLng) return null;
  return {
    lat: (a.homeLat + b.homeLat) / 2,
    lng: (a.homeLng + b.homeLng) / 2,
    neighborhood: "Mong Kok",
  };
}

export const sessions: Session[] = [
  {
    id: "s-1",
    counterpartId: "u-maya",
    counterpartName: "Maya Chen",
    counterpartInitials: "MC",
    counterpartColor: "#FFD8C7",
    topic: "Career Transition",
    status: "active",
    lastMessageAt: "12 minutes ago",
    lastMessagePreview:
      "Yeah — I think I want to talk through the trade-offs out loud.",
    messages: [
      {
        id: "msg-1",
        senderId: "u-self",
        body: "Hey — saw your moment. Have a few minutes to talk it through?",
        sentAt: "10:14",
      },
      {
        id: "msg-2",
        senderId: "u-maya",
        body: "Yeah — I think I want to talk through the trade-offs out loud.",
        sentAt: "10:16",
      },
      {
        id: "msg-3",
        senderId: "u-self",
        body: "Want to start with what scares you about taking it?",
        sentAt: "10:17",
      },
      {
        id: "msg-mt-1",
        senderId: "u-self",
        body: "",
        sentAt: "10:24",
        meetupId: "mt-1",
      },
    ],
  },
  {
    id: "s-2",
    counterpartId: "u-alex",
    counterpartName: "Alex Rivera",
    counterpartInitials: "AR",
    counterpartColor: "#D7E5FF",
    topic: "Management",
    status: "active",
    lastMessageAt: "2 hours ago",
    lastMessagePreview: "Just sent something — no rush.",
    messages: [
      {
        id: "msg-s2-1",
        senderId: "u-alex",
        body:
          "Was thinking about that Tai Hang walk we kept saying we'd do.",
        sentAt: "2:08 PM",
      },
      {
        id: "msg-s2-2",
        senderId: "u-alex",
        body: "Just sent something — no rush, take your time.",
        sentAt: "2:09 PM",
      },
      {
        id: "msg-mt-2",
        senderId: "u-alex",
        body: "",
        sentAt: "2:09 PM",
        meetupId: "mt-2",
      },
    ],
  },
];

function nextSaturdayAt(hour: number): string {
  const d = new Date();
  const day = d.getDay();
  const offset = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}
function nextSundayAt(hour: number): string {
  const d = new Date();
  const day = d.getDay();
  const offset = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const meetups: Meetup[] = [
  {
    id: "mt-1",
    sessionId: "s-1",
    proposerId: "u-self",
    inviteeId: "u-maya",
    venueId: "v-1",
    venueName: "Quiet Corner Café",
    venueDescription: "Tucked-away café with low music and large tables.",
    proposedTimes: [nextSaturdayAt(16), nextSaturdayAt(17)],
    chosenTime: nextSaturdayAt(16),
    note: "There's a corner table by the window I think you'd like.",
    responseMessage: null,
    status: "confirmed",
    counterRound: 0,
    reflectionUnlockedSelf: false,
  },
  // Incoming invitation — Alex invited Steven (u-self) to The Long Garden.
  // Used to demo the invitee perspective on the Meetups page.
  {
    id: "mt-2",
    sessionId: "s-2",
    proposerId: "u-alex",
    inviteeId: "u-self",
    venueId: "v-3",
    venueName: "The Long Garden",
    venueDescription: "Community garden with benches under a willow.",
    proposedTimes: [
      nextSaturdayAt(11),
      nextSaturdayAt(15),
      nextSundayAt(11),
    ],
    chosenTime: null,
    note: "Was thinking of a slow Saturday — bring tea?",
    responseMessage: null,
    status: "proposed",
    counterRound: 0,
    reflectionUnlockedSelf: false,
  },
];

export function getConnection(id: string) {
  return (
    connections.find((c) => c.id === id) ||
    pendingRequests.find((c) => c.id === id)
  );
}

/**
 * Returns minimal display info for any user id — me, a connection, or a
 * pending request. Used by reaction/comment rows that may reference any user.
 */
export function getUserDisplay(id: string): {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
} {
  if (id === me.id) {
    return {
      id: me.id,
      name: me.name,
      initials: me.initials,
      avatarColor: me.avatarColor,
    };
  }
  const c = getConnection(id);
  if (c) {
    return {
      id: c.id,
      name: c.name,
      initials: c.initials,
      avatarColor: c.avatarColor,
    };
  }
  return { id, name: "Someone", initials: "·", avatarColor: "#E5E7EB" };
}
export function getMoment(id: string) {
  return moments.find((m) => m.id === id);
}
export function getSession(id: string) {
  return sessions.find((s) => s.id === id);
}
export function getMeetup(id: string) {
  return meetups.find((m) => m.id === id);
}
export function getVenue(id: string) {
  return venues.find((v) => v.id === id);
}

export function formatTimeRange(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDayOnly(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeOnly(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
