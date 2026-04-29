import { SmoothScrollProvider } from '@/components/ui/smooth-scroll-provider';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Hero } from '@/components/ui/animated-hero';
import { InteractiveSelector } from '@/components/ui/interactive-selector';
import { WhatWeOffer } from '@/components/ui/what-we-offer';
import { HowItWorks } from '@/components/ui/how-it-works';
import { BlogPreview } from '@/components/ui/blog-preview';
import { ContactCTA } from '@/components/ui/contact-cta';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer-section';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />

      {/* ── 1. Hero ── */}
      <AuroraBackground>
        <Hero />
      </AuroraBackground>

      {/* Hero → Stages transition */}
      <div className="w-full h-24 bg-gradient-to-b from-background to-[#111] -mb-1" />

      {/* ── 2. Life stages ── */}
      <InteractiveSelector />

      {/* ── 3. What we offer ── */}
      <WhatWeOffer />

      {/* Offer → How it works divider */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── 4. How it works ── */}
      <HowItWorks />

      {/* ── 5. Blog ── */}
      <BlogPreview />

      {/* ── 6. Contact CTA ── */}
      <ContactCTA />

      {/* ── 7. Footer ── */}
      <Footer />

    </SmoothScrollProvider>
  );
}
