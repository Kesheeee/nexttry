import { SmoothScrollProvider } from '@/components/ui/smooth-scroll-provider';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Hero } from '@/components/ui/animated-hero';
import { InteractiveSelector } from '@/components/ui/interactive-selector';
import { WhatWeOffer } from '@/components/ui/what-we-offer';
import { HowItWorks } from '@/components/ui/how-it-works';
import { SocialProof } from '@/components/ui/social-proof';
import { CTASection } from '@/components/ui/cta-section';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer-section';
import { LogosSlider } from '@/components/ui/logos-slider';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />

      {/* ── 1. Hero ── */}
      <AuroraBackground>
        <Hero />
        <div className="absolute -bottom-64 left-0 right-0 z-10">
          <LogosSlider />
        </div>
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

      {/* How → Social proof divider */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── 5. Social proof ── */}
      <SocialProof />

      {/* ── 6. CTA ── */}
      <CTASection />

      {/* ── 7. Footer ── */}
      <Footer />

    </SmoothScrollProvider>
  );
}
