'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Briefcase, RefreshCw, Heart, Check, ArrowRight } from 'lucide-react';

const stages = [
  { value: 'secondary_school', label: 'Secondary School', icon: GraduationCap, accent: '#f39c12', desc: 'Figuring out who you want to become' },
  { value: 'university',        label: 'University',       icon: BookOpen,      accent: '#00b894', desc: 'More choices, less clarity' },
  { value: 'early_career',      label: 'Early Career',     icon: Briefcase,     accent: '#6c5ce7', desc: 'Starting out and standing out' },
  { value: 'career_change',     label: 'Career Change',    icon: RefreshCw,     accent: '#e17055', desc: 'Brave enough to start over' },
  { value: 'retired',           label: 'Retired',          icon: Heart,         accent: '#fab1a0', desc: 'A lifetime of wisdom, still unfolding' },
];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in');
    else if (session?.user?.onboardingCompleted) router.push('/dashboard');
  }, [status, session, router]);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);

    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        life_stage: selected,
        onboarding_completed: true,
      }),
    });

    await update(); // refresh session JWT
    router.push('/dashboard');
  };

  if (status !== 'authenticated') return null;

  const firstName = session.user.name?.split(' ')[0] || 'there';

  return (
    <main className="min-h-screen flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Welcome, {firstName}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Where are you in life?
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This helps us personalise your experience. You can change this anytime.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-8">
          {stages.map((stage, i) => {
            const isSelected = selected === stage.value;
            return (
              <motion.button
                key={stage.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                onClick={() => setSelected(stage.value)}
                className={`relative flex items-center gap-4 p-5 rounded-3xl border text-left transition-all ${
                  isSelected ? 'border-transparent shadow-md' : 'border-border hover:border-foreground/20 hover:bg-muted/50'
                }`}
                style={isSelected ? { borderColor: stage.accent, backgroundColor: `${stage.accent}10` } : {}}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${stage.accent}${isSelected ? '25' : '15'}` }}
                >
                  <stage.icon className="w-5 h-5" style={{ color: stage.accent }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{stage.label}</p>
                  <p className="text-xs text-muted-foreground">{stage.desc}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stage.accent }}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full rounded-full bg-foreground text-background py-4 text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? 'Setting up...' : <>Continue <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </div>
    </main>
  );
}
