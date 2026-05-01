export type Accent = "amber" | "indigo" | "plum" | "coral" | "teal";

export const ACCENT_HEX: Record<Accent, { fg: string; bg: string; ring: string }> = {
  amber:  { fg: "#E89A1E", bg: "#FBEDD3", ring: "#F2C679" },
  indigo: { fg: "#5B4BE0", bg: "#ECE9FB", ring: "#A99FF0" },
  plum:   { fg: "#8C4BD6", bg: "#EFE3FB", ring: "#C4A1ED" },
  coral:  { fg: "#E8624D", bg: "#FBE0D9", ring: "#F2A293" },
  teal:   { fg: "#1B9D78", bg: "#D5EFE5", ring: "#7DC8AF" },
};

export type ProductId = "ncall" | "podcast" | "nspace";

export const PRODUCTS: Record<ProductId, {
  name: string;
  tagline: string;
  long: string;
  cta: string;
  icon: "spark" | "mic" | "users";
  color: Accent;
  href: string;
  external?: boolean;
}> = {
  ncall: {
    name: "nCall",
    tagline: "Talk to an AI mentor that actually listens.",
    long: "A 1-on-1 conversation, on demand. nCall asks the questions you didn't know to ask — about values, fears, options, trade-offs — and helps you write down what you're actually feeling. No advice you didn't ask for.",
    cta: "Try nCall",
    icon: "spark",
    color: "indigo",
    href: "/ncall",
    external: false,
  },
  podcast: {
    name: "The Fourth Relationship",
    tagline: "Real mentorship stories. Real growth.",
    long: "A weekly podcast about the relationships that change us — the ones beyond family, friends, and partners. Mentors, strangers, the people who saw us before we saw ourselves.",
    cta: "Listen now",
    icon: "mic",
    color: "amber",
    href: "https://www.youtube.com/@the4threlationships",
    external: true,
  },
  nspace: {
    name: "nSpace",
    tagline: "Find your mentor. Build your path.",
    long: "A human community where you're matched with people who've stood exactly where you're standing — and the people you'll be standing next to. Calls, messages, and small group cohorts.",
    cta: "Explore nSpace",
    icon: "users",
    color: "teal",
    href: "/nspace",
  },
};

export type Stage = {
  id: "school" | "uni" | "early" | "change" | "retired";
  label: string;
  age: string;
  headline: string;
  accent: Accent;
  subtitle: string;
  questions: string[];
  mentors: string[];
  primaryProduct: ProductId;
  secondary: ProductId[];
  storyName: string;
  storyText: string;
  image: string;
};

export const STAGE_IMAGES = {
  school:  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1400&q=80",
  uni:     "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1400&q=80",
  early:   "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
  change:  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1400&q=80",
  retired: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=1400&q=80",
} as const;

export const STAGES: Stage[] = [
  {
    id: "school",
    label: "Secondary School",
    age: "14 – 18",
    headline: "Figuring out who you want to become.",
    accent: "amber",
    subtitle: "The world's asking what you'll do next. You're still asking who you are.",
    questions: [
      "What if I pick the wrong subjects?",
      "Everyone seems to know what they want — except me.",
      "Is there a path that fits me, or do I have to fit a path?",
    ],
    mentors: [
      "University students 2 years ahead",
      "Adults who took non-linear paths",
      "Career counsellors who've heard it all",
    ],
    primaryProduct: "ncall",
    secondary: ["podcast"],
    storyName: "Ananya, 17",
    storyText: "I wanted to study art. My parents wanted engineering. I talked to three NextTry mentors who'd been exactly here. I chose design — with a plan.",
    image: STAGE_IMAGES.school,
  },
  {
    id: "uni",
    label: "University",
    age: "18 – 23",
    headline: "More choices. Less clarity.",
    accent: "indigo",
    subtitle: "Internships, majors, side projects, the friend who already has a startup. The signal-to-noise is brutal.",
    questions: [
      "Should I switch majors at the end of year two?",
      "Is grad school worth it for what I want to do?",
      "How do I pick between the safe job and the interesting one?",
    ],
    mentors: [
      "Recent grads in the field you're considering",
      "People who pivoted out of it",
      "Founders, researchers, generalists",
    ],
    primaryProduct: "nspace",
    secondary: ["ncall"],
    storyName: "Daniel, 20",
    storyText: "I matched with a product manager who'd done my exact major. One 30-minute call saved me from a year-long internship I would have hated.",
    image: STAGE_IMAGES.uni,
  },
  {
    id: "early",
    label: "Early Career",
    age: "23 – 30",
    headline: "Starting out, standing out.",
    accent: "plum",
    subtitle: "Two years in and the questions get harder: stay, switch, specialise, start something. Pretending to know is exhausting.",
    questions: [
      "Am I underpaid, or am I just imposter-syndrome-ing?",
      "Should I go deep or stay broad in my first 5 years?",
      "When does it stop feeling like I'm faking it?",
    ],
    mentors: [
      "Senior ICs and managers in your field",
      "People who left and don't regret it",
      "Coaches for negotiation & growth",
    ],
    primaryProduct: "ncall",
    secondary: ["nspace", "podcast"],
    storyName: "Maya, 26",
    storyText: "I almost took a promotion that would have locked me into a path I didn't want. My mentor asked one question I couldn't answer. I said no, and I'm so glad.",
    image: STAGE_IMAGES.early,
  },
  {
    id: "change",
    label: "Mid Career",
    age: "30 – 50",
    headline: "Brave enough to start over.",
    accent: "coral",
    subtitle: "You've built something real. Now you're considering trading it in. Everyone has an opinion. Most of them are wrong about you.",
    questions: [
      "Can I afford to take a step back to leap forward?",
      "Will my experience translate, or will I be starting from zero?",
      "How do I tell my family I'm doing this?",
    ],
    mentors: [
      "People who made the exact switch you're considering",
      "Financial planners for transitions",
      "Therapists who specialise in identity & work",
    ],
    primaryProduct: "nspace",
    secondary: ["ncall", "podcast"],
    storyName: "Rahul, 38",
    storyText: "Fifteen years in finance. I matched with three people who'd jumped to product — one was at my old firm. They didn't tell me what to do. They told me what to expect.",
    image: STAGE_IMAGES.change,
  },
  {
    id: "retired",
    label: "Retired",
    age: "60+",
    headline: "A finish line — or a fresh start.",
    accent: "teal",
    subtitle: "The work chapter closed. The you chapter didn't. What does a meaningful next look like — and who's already figured it out?",
    questions: [
      "What's a meaningful next chapter, not just a hobby?",
      "How do I find purpose without going back to a job?",
      "Who's already figured out this part of life?",
    ],
    mentors: [
      "Peers who redefined retirement and love it",
      "Encore-career coaches and life designers",
      "Founders and creators who started after sixty",
    ],
    primaryProduct: "podcast",
    secondary: ["nspace"],
    storyName: "Eleanor, 67",
    storyText: "I thought I was done. NextTry matched me with a 24-year-old founder who needed exactly the experience I'd spent forty years collecting. Now I mentor four of them.",
    image: STAGE_IMAGES.retired,
  },
];
