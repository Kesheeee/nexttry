'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { DotBackground } from '@/components/ui/dot-background';
import { Shield, CreditCard, Bell, Globe, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const plans = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    period: 'forever',
    description: 'Get started with the basics',
    features: ['GOLnext (5 messages/day)', 'Community connects', 'Event access'],
    accent: '#6c5ce7',
    current: true,
  },
  {
    name: 'Pro',
    monthlyPrice: '$9.99',
    yearlyPrice: '$7.99',
    period: '/month',
    description: 'Unlock the full NextTry experience',
    features: ['Unlimited GOLnext', 'Priority event booking', 'Mentor matching', 'Profile verification badge', 'Podcast early access'],
    accent: '#6c5ce7',
    current: false,
    popular: true,
  },
  {
    name: 'Team',
    monthlyPrice: '$29.99',
    yearlyPrice: '$24.99',
    period: '/month',
    description: 'For schools and organisations',
    features: ['Everything in Pro', 'Team dashboard', 'Bulk event booking', 'Custom programs', 'Dedicated support'],
    accent: '#00b894',
    current: false,
  },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'privacy' | 'billing'>('privacy');
  const [isYearly, setIsYearly] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in');
  }, [status, router]);

  const handleSave = () => {
    setSaved(true);
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

  return (
    <>
      <Navbar />
      <Sidebar />
      <DotBackground />
      <main className="min-h-screen pt-24 pb-16 px-8 relative overflow-hidden transition-all duration-300">
        <div className="relative max-w-3xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Settings</h1>
            <p className="text-sm text-muted-foreground mb-8">Manage your privacy, notifications, and subscription.</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex gap-1 mb-8 p-1 rounded-2xl border border-border bg-muted/30 w-fit"
          >
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'privacy' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-4 h-4" /> Privacy & Settings
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'billing' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Billing & Plan
            </button>
          </motion.div>

          {activeTab === 'privacy' ? (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Profile visibility */}
              <div className="rounded-3xl border border-border bg-background p-8">
                <h2 className="text-lg font-bold tracking-tight mb-1">Profile Visibility</h2>
                <p className="text-sm text-muted-foreground mb-6">Control who can see your profile in Connects.</p>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'public', label: 'Public', desc: 'Anyone in the NextTry community can see your profile' },
                    { value: 'connects', label: 'Connects Only', desc: 'Only people you have connected with' },
                    { value: 'private', label: 'Private', desc: 'Your profile is hidden from everyone' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileVisibility(option.value)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl border text-left transition-all ${
                        profileVisibility === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        profileVisibility === option.value ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {profileVisibility === option.value && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-3xl border border-border bg-background p-8">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold tracking-tight">Notifications</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Choose what you want to be notified about.</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates and news via email</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${emailNotifications ? 'bg-primary' : 'bg-border'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${emailNotifications ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Event reminders</p>
                      <p className="text-xs text-muted-foreground">Get reminded before upcoming events</p>
                    </div>
                    <button
                      onClick={() => setEventReminders(!eventReminders)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${eventReminders ? 'bg-primary' : 'bg-border'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${eventReminders ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="rounded-3xl border border-border bg-background p-8">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold tracking-tight">Language</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred language.</p>
                <div className="flex gap-3">
                  {[
                    { value: 'en', label: 'English' },
                    { value: 'zh', label: '中文' },
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        language === lang.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-4">
                <button onClick={handleSave} className="rounded-full bg-foreground text-background px-8 py-3 text-sm font-medium hover:opacity-80 active:scale-[0.97] transition-all">
                  Save Changes
                </button>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                    <Check className="w-4 h-4" /> Saved
                  </motion.span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-8"
            >
              {/* Header + toggle */}
              <div className="flex flex-col items-center text-center gap-4">
                <h2 className="text-2xl font-extrabold tracking-tight">Plans & Pricing</h2>
                <p className="text-sm text-muted-foreground max-w-md">Choose the plan that matches your journey and scale with ease.</p>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className={isYearly ? 'text-muted-foreground' : 'text-foreground'}>Monthly</span>
                  <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                  <span className={isYearly ? 'text-foreground' : 'text-muted-foreground'}>
                    Yearly <span className="text-xs text-primary font-semibold ml-1">Save 20%</span>
                  </span>
                </div>
              </div>

              {/* Plan cards */}
              <div className="grid md:grid-cols-3 gap-5">
                {plans.map((plan, i) => {
                  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                  return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
                      className={`rounded-3xl border p-6 flex flex-col gap-5 relative ${
                        plan.popular
                          ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5'
                          : plan.current
                          ? 'border-primary/20 bg-primary/[0.02]'
                          : 'border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" /> Most Popular
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-bold tracking-tight">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-extrabold tracking-tight">{price}</span>
                          {price !== '$0' && (
                            <span className="text-xs text-muted-foreground">/{isYearly ? 'mo, billed yearly' : 'month'}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                      <ul className="flex flex-col gap-2.5 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                            <Check className="w-4 h-4 shrink-0" style={{ color: plan.accent }} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`mt-auto rounded-full py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                          plan.current
                            ? 'bg-muted text-muted-foreground cursor-default'
                            : plan.popular
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]'
                            : 'bg-foreground text-background hover:opacity-80 active:scale-[0.97]'
                        }`}
                        disabled={plan.current}
                      >
                        {plan.current ? 'Current Plan' : <>Upgrade <ArrowRight className="w-3.5 h-3.5" /></>}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Payment method */}
              <div className="rounded-3xl border border-border bg-background p-8">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold tracking-tight">Payment Method</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">No payment method on file.</p>
                <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-3 transition-all duration-200">
                  + Add payment method <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Billing history */}
              <div className="rounded-3xl border border-border bg-background p-8">
                <h2 className="text-lg font-bold tracking-tight mb-1">Billing History</h2>
                <p className="text-sm text-muted-foreground">No invoices yet. Your billing history will appear here once you upgrade.</p>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </>
  );
}
