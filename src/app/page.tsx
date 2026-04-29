import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/animated-hero";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { WhatWeOffer } from "@/components/ui/what-we-offer";
import { HowItWorks } from "@/components/ui/how-it-works";
import { ContactCTA } from "@/components/ui/contact-cta";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <InteractiveSelector />
      <WhatWeOffer />
      <HowItWorks />
      <ContactCTA />
      <Footer />
    </>
  );
}
