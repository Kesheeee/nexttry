'use client';

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-8 pt-32 pb-32">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <BookOpen className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Blog</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Coming Soon
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            We&apos;re writing the first stories now. Check back soon for articles on mentorship, career change, and the lives we&apos;re trying to build.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
