'use client';

import { useSession } from 'next-auth/react';
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { DotBackground } from "@/components/ui/dot-background";
import { Footer } from "@/components/ui/footer-section";

export default function ProgramsPage() {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      {session?.user && <><Sidebar /><DotBackground /></>}
      <main className={`min-h-screen flex flex-col items-center justify-center gap-3 text-center px-8 transition-all duration-300 ${session?.user ? 'pl-8' : ''}`}>
        <p className="text-2xl font-semibold">Coming Soon</p>
        <p className="text-muted-foreground">We are working on this page. Check back soon.</p>
      </main>
      {!session?.user && <Footer />}
    </>
  );
}
