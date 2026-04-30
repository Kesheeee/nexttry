import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";

export const metadata: Metadata = {
  title: "Team",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-8">
        <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Coming Soon</p>
        <p className="text-muted-foreground text-lg">We are working on this page. Check back soon.</p>
      </main>
      <Footer />
    </>
  );
}
