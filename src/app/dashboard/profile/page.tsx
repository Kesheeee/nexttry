'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { DotBackground } from '@/components/ui/dot-background';
import { Mail, User, GraduationCap, BookOpen, Briefcase, RefreshCw, Heart, Check, Pencil, MapPin } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const lifeStages = [
  { value: 'secondary', label: 'Secondary School', icon: GraduationCap, accent: '#f39c12', description: 'Figuring out who you want to become' },
  { value: 'university', label: 'University', icon: BookOpen, accent: '#00b894', description: 'More choices, less clarity' },
  { value: 'early-career', label: 'Early Career', icon: Briefcase, accent: '#6c5ce7', description: 'Starting out and standing out' },
  { value: 'career-change', label: 'Career Change', icon: RefreshCw, accent: '#e17055', description: 'Brave enough to start over' },
  { value: 'retired', label: 'Retired', icon: Heart, accent: '#fab1a0', description: 'A lifetime of wisdom, still unfolding' },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [selectedStage, setSelectedStage] = useState('early-career');
  const [bio, setBio] = useState('Exploring career opportunities in tech and design. Open to mentorship and new connections.');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in');
  }, [status, router]);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session?.user) return null;

  const currentStage = lifeStages.find(s => s.value === selectedStage);

  // ─── VIEW MODE ───
  if (!editing) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <DotBackground />
        <main className="min-h-screen pt-24 pb-16 px-8 relative overflow-hidden transition-all duration-300">
          <div className="relative max-w-2xl mx-auto">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Profile</h1>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="rounded-3xl border border-border bg-background p-8"
            >
              {/* Avatar + name + stage */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold tracking-tight">{session.user.name}</h2>
                    {currentStage && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${currentStage.accent}15`, color: currentStage.accent }}>
                        {currentStage.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Signed in with Google</p>
                </div>
              </div>

              {/* About */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {bio || <span className="text-muted-foreground italic">No bio yet.</span>}
                </p>
              </div>

              {/* Contact */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{session.user.email}</span>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Social</h3>
                <div className="flex flex-col gap-3">
                  {/* Google — always shown */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                    <span className="text-sm text-foreground flex-1">{session.user.email}</span>
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Connected</span>
                  </div>

                  {instagram && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                      <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      <span className="text-sm text-foreground">@{instagram.replace('@', '')}</span>
                    </div>
                  )}

                  {linkedin && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                      <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      <span className="text-sm text-foreground">{linkedin}</span>
                    </div>
                  )}

                  {!instagram && !linkedin && (
                    <p className="text-sm text-muted-foreground italic">No social accounts linked yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  // ─── EDIT MODE ───
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="min-h-screen pt-24 pb-16 px-8 relative overflow-hidden transition-all duration-300">
        <div className="relative max-w-3xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Edit Profile</h1>
            <button
              onClick={() => setEditing(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </motion.div>

          {/* Your Stage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="rounded-3xl border border-border bg-background p-8 mb-6"
          >
            <h3 className="text-lg font-bold tracking-tight mb-1">Your Stage</h3>
            <p className="text-sm text-muted-foreground mb-6">Where are you in your journey right now?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lifeStages.map((stage) => {
                const isSelected = selectedStage === stage.value;
                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => setSelectedStage(stage.value)}
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected ? 'border-transparent shadow-md' : 'border-border hover:border-muted-foreground/20 hover:bg-muted/50'
                    }`}
                    style={isSelected ? { borderColor: stage.accent, backgroundColor: `${stage.accent}10` } : {}}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stage.accent}${isSelected ? '20' : '10'}` }}>
                      <stage.icon className="w-5 h-5" style={{ color: stage.accent }} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{stage.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: stage.accent }}>
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* About Me */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="rounded-3xl border border-border bg-background p-8 mb-6"
          >
            <h3 className="text-lg font-bold tracking-tight mb-1">About Me</h3>
            <p className="text-sm text-muted-foreground mb-4">Tell us a bit about yourself and what you're looking for.</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="I'm a university student exploring career options..."
              rows={4}
              className="w-full bg-transparent text-sm p-4 rounded-2xl border border-border focus:border-primary focus:outline-none resize-none transition-colors"
            />
          </motion.div>

          {/* Connected Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="rounded-3xl border border-border bg-background p-8 mb-6"
          >
            <h3 className="text-lg font-bold tracking-tight mb-1">Connected Accounts</h3>
            <p className="text-sm text-muted-foreground mb-6">Link your social profiles so others can find you.</p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Google</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Connected</span>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border">
                <svg className="w-5 h-5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@your_handle" className="flex-1 bg-transparent text-sm focus:outline-none" />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border">
                <svg className="w-5 h-5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/your-profile" className="flex-1 bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="flex items-center gap-4"
          >
            <button onClick={handleSave} className="rounded-full bg-foreground text-background px-8 py-3 text-sm font-medium hover:opacity-80 active:scale-[0.97] transition-all duration-200">
              Save Changes
            </button>
            <AnimatePresence>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                  <Check className="w-4 h-4" /> Saved
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </>
  );
}
