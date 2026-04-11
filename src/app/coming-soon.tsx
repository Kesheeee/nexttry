import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";

export default function ComingSoon() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-8">
        <p className="text-2xl font-semibold">Coming Soon</p>
        <p className="text-muted-foreground">We're working on this page. Check back soon.</p>
      </main>
      <Footer />
    </>
  );
}
