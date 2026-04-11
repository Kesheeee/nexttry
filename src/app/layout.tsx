import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AuthProvider } from "@/components/ui/session-provider";
import { LanguageProvider } from "@/components/ui/language-context";
import {
  Montserrat,
  Playfair_Display,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});


export const metadata: Metadata = {
  title: {
    default: "NextTry — Every stage. Every question. Every next step.",
    template: "%s | NextTry",
  },
  description: "Wherever you are in life — NextTry is here. Mentorship, AI career guidance, and community for every stage of life.",
  openGraph: {
    title: "NextTry",
    description: "Wherever you are in life — NextTry is here.",
    siteName: "NextTry",
    locale: "en_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
        <LanguageProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <div id="main-content">
            {children}
          </div>
          <ScrollProgress />
        </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
