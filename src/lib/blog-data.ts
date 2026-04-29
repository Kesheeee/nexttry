import type { Accent } from "@/lib/site-data";

export type Category = "all" | "school" | "uni" | "early" | "change" | "retired" | "essays";

export const CATEGORIES: { id: Category; label: string; age?: string; num?: string; color: Accent | "ink" }[] = [
  { id: "all", label: "All stories", color: "ink" },
  { id: "school", label: "Secondary", num: "01", age: "14–18", color: "amber" },
  { id: "uni", label: "University", num: "02", age: "18–23", color: "indigo" },
  { id: "early", label: "Early career", num: "03", age: "23–30", color: "plum" },
  { id: "change", label: "Mid Career", num: "04", age: "30–50", color: "coral" },
  { id: "retired", label: "Retired", num: "05", age: "60+", color: "teal" },
];

export const CATEGORY_LABEL: Record<string, string> = {
  school: "Secondary",
  uni: "University",
  early: "Early career",
  change: "Mid Career",
  retired: "Retired",
  essays: "Essay",
};

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<Category, "all">;
  accent: Accent;
  image: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const POSTS: Post[] = [];

const _PLACEHOLDER_POSTS: Post[] = [
  {
    id: "fourth-relationship",
    title: "The Fourth Relationship: why mentorship deserves a name of its own.",
    excerpt:
      "We have words for family, for friends, for partners. Why is the relationship that quietly changes us — the mentor — still nameless?",
    category: "essays",
    accent: "indigo",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=70",
    author: "The NextTry team",
    role: "Editorial",
    date: "Apr 26, 2026",
    readTime: "7 min read",
    featured: true,
  },
  {
    id: "year-two-pivot",
    title: "Should I switch majors at the end of year two?",
    excerpt:
      "A worksheet, a story, and a question we ask everyone considering the leap.",
    category: "uni",
    accent: "indigo",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=70",
    author: "Daniel L.",
    role: "Mentee, year 2",
    date: "Apr 22, 2026",
    readTime: "5 min read",
  },
  {
    id: "first-job-imposter",
    title: "What nobody told me about my first 6 months at work.",
    excerpt:
      "Imposter syndrome isn't a phase you survive — it's a question you learn to use.",
    category: "early",
    accent: "plum",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&auto=format&fit=crop&q=70",
    author: "Maya P.",
    role: "Early career, age 25",
    date: "Apr 19, 2026",
    readTime: "6 min read",
  },
  {
    id: "switching-after-fifteen",
    title: "I left finance after fifteen years. Here's what mentorship made possible.",
    excerpt:
      "Three calls, two questions, and one sentence that gave me permission to start.",
    category: "change",
    accent: "coral",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&auto=format&fit=crop&q=70",
    author: "Rahul K.",
    role: "Mid Career, age 38",
    date: "Apr 15, 2026",
    readTime: "8 min read",
  },
  {
    id: "art-not-engineering",
    title: "I wanted art. They wanted engineering. We found a third option.",
    excerpt:
      "How three conversations with mentors three years older reframed a decade-long fight.",
    category: "school",
    accent: "amber",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&auto=format&fit=crop&q=70",
    author: "Ananya S.",
    role: "Mentee, age 17",
    date: "Apr 10, 2026",
    readTime: "5 min read",
  },
  {
    id: "encore-mentorship",
    title: "I thought retirement was the end. It was the start of mentorship.",
    excerpt:
      "Forty years of experience, twenty-four-year-old founders, and one question: who needs what I know?",
    category: "retired",
    accent: "teal",
    image: "https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=900&auto=format&fit=crop&q=70",
    author: "Eleanor W.",
    role: "Retired, age 67",
    date: "Apr 6, 2026",
    readTime: "6 min read",
  },
  {
    id: "the-bridge",
    title: "Why we built a bridge from AI to a real human.",
    excerpt:
      "Mentorship rarely starts with a perfect match. It starts with a question. Here's how we designed the path that follows.",
    category: "essays",
    accent: "indigo",
    image: "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=900&auto=format&fit=crop&q=70",
    author: "The NextTry team",
    role: "Product",
    date: "Apr 2, 2026",
    readTime: "9 min read",
  },
];
