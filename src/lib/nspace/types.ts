export type ApiUser = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export type MomentSections = {
  note?: string;
  taggedUserIds?: string[];
  photoUrl?: string | null;
  photoCaption?: string;
  todaysPlan?: string;
  recentSatisfaction?: string;
  futureGoal?: string;
  favoriteBook?: string;
};

export type ApiMomentComment = {
  id: string;
  body?: string;
  created_at?: string;
  author?: ApiUser | null;
};

export type ApiMoment = {
  id: string;
  user_id: string;
  created_at: string;
  sections: MomentSections;
  author: ApiUser | null;
  reactions: { id: string; emoji: string; user_id: string }[];
  comments: ApiMomentComment[];
};

export type ApiConnectionRow = {
  id: string;
  status: "pending" | "accepted" | "declined";
  requested_by_id: string;
  user_id: string;
  connected_user_id: string;
  other: ApiUser | null;
  created_at: string;
  accepted_at: string | null;
};

export type ApiConnections = {
  friends: ApiConnectionRow[];
  incoming: ApiConnectionRow[];
  outgoing: ApiConnectionRow[];
};

export type NspaceEventSeries = {
  title: string;
  description: string | null;
  venue_id: string | null;
  location_text: string | null;
  capacity: number;
  price_cents: number;
  venue: {
    id: string;
    name: string;
    neighborhood: string;
    address: string | null;
  } | null;
};

export type NspaceEventRsvp = {
  id: string;
  event_id: string;
  user_id: string;
  status: "confirmed" | "canceled";
  created_at: string;
  updated_at: string;
};

export type NspaceEvent = {
  id: string;
  series_id: string;
  starts_at: string;
  ends_at: string;
  capacity_override: number | null;
  status: "scheduled" | "canceled" | "completed";
  created_at: string;
  series: NspaceEventSeries | null;
  rsvp_count: number;
  /** Only present on single-event GET, not the list endpoint. */
  your_rsvp?: NspaceEventRsvp | null;
};

export type ApiProfile = {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  user_id: string;
  share_code: string;
  avatar_color: string;
  use_photo: boolean;
  mission: string | null;
  open_to: string[];
  topics: string[];
  last_moment_at: string | null;
  // LinkedIn-style fields
  first_name: string | null;
  last_name: string | null;
  additional_name: string | null;
  headline: string | null;
  position_title: string | null;
  position_company: string | null;
  industry: string | null;
  school: string | null;
  country: string | null;
  city: string | null;
  cover_url: string | null;
};
