'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { DotBackground } from '@/components/ui/dot-background';
import { ArrowLeft, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// Mock profiles — in production this would come from a database
const profiles: Record<string, {
  name: string;
  image: string;
  stage: string;
  accent: string;
  bio: string;
  location: string;
  email: string;
  instagram: string;
  linkedin: string;
}> = {
  'sarah-chen': {
    name: 'Sarah Chen',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    stage: 'Early Career',
    accent: '#6c5ce7',
    bio: 'Product designer exploring the intersection of tech and education. Passionate about making tools that help people find direction.',
    location: 'Hong Kong',
    email: 'sarah@example.com',
    instagram: '@sarahdesigns',
    linkedin: 'linkedin.com/in/sarahchen',
  },
  'raymond-ng': {
    name: 'Raymond Ng',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    stage: 'Retired',
    accent: '#fab1a0',
    bio: '30+ years in finance. Now spending time mentoring the next generation and giving back to the community.',
    location: 'Hong Kong',
    email: 'raymond@example.com',
    instagram: '',
    linkedin: 'linkedin.com/in/raymondng',
  },
};

export default function ConnectProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session?.user) return null;

  const profile = profiles[id];

  if (!profile) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <DotBackground />
        <main className="min-h-screen pt-24 pb-16 px-8 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-2xl font-semibold">Profile not found</p>
          <p className="text-muted-foreground text-sm">This person may not have shared their profile yet.</p>
          <Link href="/dashboard/connects" className="text-sm font-medium text-primary hover:underline mt-2">
            Back to Connects
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="min-h-screen pt-24 pb-16 px-8 relative overflow-hidden transition-all duration-300">
        <div className="relative max-w-2xl mx-auto">

          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }}>
            <Link href="/dashboard/connects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Connects
            </Link>
          </motion.div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="rounded-3xl border border-border bg-background p-8"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <img src={profile.image} alt={profile.name} className="w-20 h-20 rounded-3xl object-cover" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-extrabold tracking-tight">{profile.name}</h1>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${profile.accent}15`, color: profile.accent }}
                  >
                    {profile.stage}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">About</h2>
              <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
            </div>

            {/* Contact info */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contact</h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Social accounts */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Social</h2>
              <div className="flex flex-col gap-3">
                {profile.instagram && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                    <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <span className="text-sm text-foreground">{profile.instagram}</span>
                  </div>
                )}
                {profile.linkedin && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                    <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    <span className="text-sm text-foreground">{profile.linkedin}</span>
                  </div>
                )}
                {!profile.instagram && !profile.linkedin && (
                  <p className="text-sm text-muted-foreground italic">No social accounts linked.</p>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </>
  );
}
