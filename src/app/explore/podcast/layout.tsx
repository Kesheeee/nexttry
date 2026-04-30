import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast",
};

export default function PodcastLayout({ children }: { children: React.ReactNode }) {
  return children;
}
