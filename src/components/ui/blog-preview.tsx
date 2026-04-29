'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export function BlogPreview() {
  return (
    <section className="py-32 px-8">
      <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-background p-10 md:p-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-5">
          <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Blog</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Coming Soon
        </h2>
        <p className="mt-5 text-muted-foreground max-w-lg mx-auto leading-relaxed">
          We&apos;re writing the first stories now. Articles on mentorship, career change, and the lives we&apos;re trying to build.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
        >
          Visit the blog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
