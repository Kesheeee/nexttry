'use client';

import React from 'react';
import { Check, Copy, Mail, MapPin } from 'lucide-react';

const APP_EMAIL = 'hello@nexttry.hk';

const InstagramIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export function ContactPage() {
  return (
    <main className="min-h-screen w-full px-8 py-24 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Reach out to the NextTry team — we'd love to hear from you.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Email */}
        <div className="rounded-2xl border border-border bg-background p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="size-5 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${APP_EMAIL}`}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              {APP_EMAIL}
            </a>
            <CopyButton value={APP_EMAIL} />
          </div>
          <p className="text-sm text-muted-foreground">We respond to all emails within 24 hours.</p>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-border bg-background p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="size-5 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Location</h2>
          </div>
          <p className="text-base font-medium text-foreground">Hong Kong</p>
          <p className="text-sm text-muted-foreground">We're based in Hong Kong.</p>
        </div>
      </div>

      {/* Social */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Find us online</h2>
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/nexttry.hk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-border text-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-semibold"
          >
            <InstagramIcon />
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/nexttry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-border text-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-semibold"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </div>

    </main>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy email'}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors relative"
    >
      <span className={`absolute transition-all ${copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <Check className="size-3.5 stroke-emerald-500" />
      </span>
      <span className={`transition-all ${copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <Copy className="size-3.5" />
      </span>
    </button>
  );
}
