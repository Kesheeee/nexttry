'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { DotBackground } from '@/components/ui/dot-background';
import { Link2, UserPlus, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

interface Connection {
  id: string;
  name: string;
  image: string;
  stage: string;
  accent: string;
  addedAt: string;
}

export default function ConnectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [link, setLink] = useState('');
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      stage: 'Early Career',
      accent: '#6c5ce7',
      addedAt: 'Apr 10',
    },
    {
      id: 'raymond-ng',
      name: 'Raymond Ng',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      stage: 'Retired',
      accent: '#fab1a0',
      addedAt: 'Apr 8',
    },
  ]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in');
  }, [status, router]);

  const handleAdd = () => {
    if (!link.trim()) return;
    // Simulate adding a connection from a shared link
    const id = `user-${Date.now()}`;
    setConnections((prev) => [
      {
        id,
        name: 'New Connection',
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg`,
        stage: 'Unknown',
        accent: '#6c5ce7',
        addedAt: 'Just now',
      },
      ...prev,
    ]);
    setLink('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <>
      <Navbar />
      <Sidebar />
      <DotBackground />
      <main className="min-h-screen pt-24 pb-16 px-8 relative overflow-hidden transition-all duration-300">
        <div className="relative max-w-3xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Connects</h1>
            <p className="text-muted-foreground text-sm mb-8">Add people you meet at NextTry events by pasting their profile link.</p>
          </motion.div>

          {/* Add connection by link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="rounded-3xl border border-border bg-background p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <h2 className="text-base font-bold tracking-tight">Add a connection</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Paste a profile link shared by someone you met at an event or program.
            </p>

            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-border focus-within:border-primary transition-colors">
                <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="Paste profile link here..."
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!link.trim()}
                className="shrink-0 px-5 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Add
              </button>
            </div>

            <AnimatePresence>
              {added && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 mt-3 text-sm font-medium text-emerald-500"
                >
                  <Check className="w-4 h-4" /> Connection added
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Your connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Your connections ({connections.length})
            </h2>

            {connections.length > 0 ? (
              <div className="flex flex-col gap-3">
                {connections.map((person, i) => (
                  <motion.div
                    key={`${person.name}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.05, ease }}
                  >
                    <Link
                      href={`/dashboard/connects/${person.id}`}
                      className="rounded-3xl border border-border bg-background p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group block"
                    >
                      <img src={person.image} alt={person.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{person.name}</h3>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                            style={{ backgroundColor: `${person.accent}15`, color: person.accent }}
                          >
                            {person.stage}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Added {person.addedAt}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-background p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No connections yet. Meet people at NextTry events and add them here.
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </>
  );
}
