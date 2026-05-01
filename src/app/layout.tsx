import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AuthProvider } from "@/components/ui/session-provider";
import { LanguageProvider } from "@/components/ui/language-context";
import {
  Inter,
  Fraunces,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});


export const metadata: Metadata = {
  title: {
    default: "NextTry",
    template: "NextTry · %s",
  },
  description:
    "Mentorship for every chapter of life. Through AI conversations, real podcast stories, and a human community.",
  openGraph: {
    title: "NextTry",
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
      className={`${sans.variable} ${serif.variable} ${display.variable} ${mono.variable} h-full antialiased`}
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
