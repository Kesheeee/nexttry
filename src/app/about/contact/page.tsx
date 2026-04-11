import { Contact2 } from "@/components/ui/contact-2";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";

export default function ContactRoute() {
  return (
    <>
      <Navbar />
      <Contact2
        title="How can we help you?"
        description="We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!"
        email="hakest@nexttryhk.com"
      />
      <Footer />
    </>
  );
}
