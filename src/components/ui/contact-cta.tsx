'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ContactCTA() {
  return (
    <section className="py-32 px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[80px]" style={{ backgroundColor: 'rgba(108, 92, 231, 0.12)' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full blur-[80px]" style={{ backgroundColor: 'rgba(225, 112, 85, 0.10)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto rounded-3xl border border-border bg-background/80 backdrop-blur-sm p-10 md:p-16 text-center shadow-sm">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Have a question?<br />We&apos;d love to hear from you.
        </h2>

        <p className="mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Whether it&apos;s feedback, a partnership idea, or you just want to say hi — drop us a message and someone from the team will get back to you.
        </p>

        <Link
          href="/about/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background font-semibold px-8 py-4 text-base hover:gap-3 transition-all duration-200"
        >
          Contact Us
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
