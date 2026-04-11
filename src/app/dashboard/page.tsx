'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { DotBackground } from '@/components/ui/dot-background';
import { Calendar, MapPin, ArrowRight, Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const upcomingEvents = [
  {
    title: 'Career Discovery Workshop',
    date: 'Sat, Apr 19',
    time: '2:00 PM',
    location: 'Causeway Bay, HK',
    accent: '#6c5ce7',
  },
  {
    title: 'Mentorship Meetup',
    date: 'Wed, Apr 23',
    time: '7:00 PM',
    location: 'Central, HK',
    accent: '#00b894',
  },
  {
    title: 'GOLnext Launch Event',
    date: 'Sat, May 3',
    time: '10:00 AM',
    location: 'Cyberport, HK',
    accent: '#e17055',
  },
];

const connects = [
  { name: 'Sarah Chen', image: 'https://randomuser.me/api/portraits/women/44.jpg', stage: 'Early Career' },
  { name: 'Raymond Ng', image: 'https://randomuser.me/api/portraits/men/52.jpg', stage: 'Retired' },
  { name: 'David Chan', image: 'https://randomuser.me/api/portraits/men/32.jpg', stage: 'University' },
  { name: 'Fiona Cheung', image: 'https://randomuser.me/api/portraits/women/36.jpg', stage: 'Career Change' },
  { name: 'Jason Ho', image: 'https://randomuser.me/api/portraits/men/75.jpg', stage: 'Secondary School' },
  { name: 'Angie Tsang', image: 'https://randomuser.me/api/portraits/women/21.jpg', stage: 'Early Career' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const firstName = session.user.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <Navbar />
      <Sidebar />
      <DotBackground />
      <main className="min-h-screen pt-24 pb-16 px-8 pl-8 relative overflow-hidden transition-all duration-300">
        <div className="relative max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {greeting}, {firstName}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening in your NextTry journey.
            </p>
          </motion.div>

          {/* GOLnext prompt */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="mb-8"
          >
            <Link href="/explore/golnext" className="group block">
              <div className="rounded-3xl border border-border bg-background p-6 flex items-center gap-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">What's on your mind today?</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Ask GOLnext — your AI mentor is ready.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          {/* Main grid: Events (left/center) + Connects (right) */}
          <div className="flex gap-8">

            {/* Upcoming Events — main area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="flex-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Upcoming Events</h2>
                <Link href="/explore/programs" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {upcomingEvents.map((event, i) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease }}
                    className="rounded-3xl border border-border bg-background p-5 flex items-center gap-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Date block */}
                    <div
                      className="w-14 h-14 rounded-3xl flex flex-col items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: event.accent }}
                    >
                      <span className="text-[10px] font-semibold uppercase leading-none">{event.date.split(', ')[0]}</span>
                      <span className="text-base font-extrabold leading-tight">{event.date.split(' ').pop()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {event.date} · {event.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                      </div>
                    </div>

                    <button className="shrink-0 text-xs font-medium px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      Join
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Connects — right sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="hidden lg:block w-64 shrink-0"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Connects</h2>
                <Link href="/dashboard/connects" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <div className="flex flex-col gap-3">
                  {connects.map((person, i) => (
                    <motion.div
                      key={person.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05, ease }}
                    >
                      <Link
                        href={`/dashboard/connects/${person.name.toLowerCase().replace(' ', '-')}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors group"
                      >
                        <img src={person.image} alt={person.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{person.name}</p>
                          <p className="text-[10px] text-muted-foreground">{person.stage}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  );
}
